import { useState } from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { useAuth } from '../core/Auth'
import { signin } from './Query'
import { processUserLogin } from '../core/AuthHelpers'
import { tryDevLogin } from '../core/devMock'
import { useAlert } from '@/app/pages/common/AlertType'

const loginSchema = Yup.object().shape({
  username: Yup.string().required('帳號為必填...'),
  password: Yup.string().required('密碼為必填...'),
})

const initialValues = {
  username: '',
  password: '',
}

export function Login() {
  const { alert, showAlert, Alert } = useAlert()
  const [loading, setLoading] = useState(false)
  const { setCurrentUser } = useAuth()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true)

      // 1) 離線模式：只允許 mock / 1234 登入（繞過 API）
      const mockUser = tryDevLogin(values.username, values.password)
      if (mockUser) {
        // 先設置到 localStorage
        processUserLogin(mockUser)
        // 再設置到 Context
        setCurrentUser(mockUser)
        setLoading(false)
        setSubmitting(false)
        showAlert('登入成功（離線模式）', 'success')
        // 明確導航到 dashboard
        navigate('/dashboard', { replace: true })
        return
      }

      // 2) 非 mock 帳號：顯示錯誤訊息（離線模式不支援其他帳號）
      showAlert('離線模式只支援 mock / 1234 登入', 'danger')
      setLoading(false)
      setSubmitting(false)
      return

      // 註：以下代碼在離線模式下不會執行
      // 一般情況：呼叫後端 /auth/login
      // const user = await signin(values, showAlert)

      setLoading(false)
      setSubmitting(false)

      if (!user) {
        // 登入失敗，訊息已經在 signin 裡 showAlert 了
        return
      }

      // 3) 登入成功：寫入 localStorage + context
      // 先設置到 localStorage
      processUserLogin(user)
      // 再設置到 Context
      setCurrentUser(user)
      // 明確導航到 dashboard
      navigate('/dashboard', { replace: true })
    },
  })

  return (
    <>
      {alert && <Alert message={alert.message} type={alert.type} />}

      <form
        className='form w-100'
        onSubmit={formik.handleSubmit}
        noValidate
        id='kt_login_signin_form'
      >
        <div className='text-center mb-11'>
          <h1 className='text-gray-900 fw-bolder mb-3'>登入</h1>
        </div>

        <div className='separator separator-content my-14' />

        {/* 帳號 */}
        <div className='fv-row mb-8'>
          <label className='form-label fs-6 fw-bolder text-gray-900'>帳號</label>
          <input
            placeholder='請輸入帳號...'
            type='text'
            autoComplete='off'
            {...formik.getFieldProps('username')}
            className={clsx(
              'form-control bg-transparent',
              {
                'is-invalid': formik.touched.username && formik.errors.username,
              },
              {
                'is-valid': formik.touched.username && !formik.errors.username,
              },
            )}
          />
          {formik.touched.username && formik.errors.username && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.username}</span>
              </div>
            </div>
          )}
        </div>

        {/* 密碼 */}
        <div className='fv-row mb-3'>
          <label className='form-label fw-bolder text-gray-900 fs-6 mb-0'>密碼</label>
          <input
            placeholder='請輸入密碼...'
            type='password'
            autoComplete='off'
            {...formik.getFieldProps('password')}
            className={clsx(
              'form-control bg-transparent',
              {
                'is-invalid': formik.touched.password && formik.errors.password,
              },
              {
                'is-valid': formik.touched.password && !formik.errors.password,
              },
            )}
          />
          {formik.touched.password && formik.errors.password && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.password}</span>
              </div>
            </div>
          )}
        </div>

        {/* 忘記密碼連結 */}
        <div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8'>
          <div />
          <Link to='/auth/forgot-password' className='link-primary'>
            忘記密碼？
          </Link>
        </div>

        {/* 登入按鈕 */}
        <div className='d-grid mb-10'>
          <button
            type='submit'
            id='kt_sign_in_submit'
            className='btn btn-primary'
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {!loading && <span className='indicator-label'>登入</span>}
            {loading && (
              <span className='indicator-progress' style={{ display: 'block' }}>
                請稍候...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>

        {/* <div className='text-gray-500 text-center fw-semibold fs-6'>
          尚未註冊？{' '}
          <Link to='/auth/registration' className='link-primary'>
            註冊
          </Link>
        </div> */}
      </form>
    </>
  )
}
