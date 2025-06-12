
import { useState } from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import { useAuth } from '../core/Auth'
import { signin } from './Query'
import { useAlert } from '../../../pages/common/useAlert'
import { processUserLogin } from '../core/AuthHelpers'
import { tryDevLogin } from '../core/devMock'

const loginSchema = Yup.object().shape({
  account: Yup.string()
    .required('帳號為必填...'),
  password: Yup.string()
    .required('密碼為必填...'),
})

const initialValues = {
  account: '',
  password: '',
}

export function Login() {
  const { alert, showAlert, Alert } = useAlert();
  const [loading, setLoading] = useState(false)
  const { setCurrentUser } = useAuth()

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);

      // 👇 特例帳號：直接登入（繞過 API）
      const mockUser = tryDevLogin(values.account, values.password);
      if (mockUser) {
        console.log(mockUser);
        processUserLogin(mockUser);
        setCurrentUser(mockUser);
        setLoading(false);
        return;
      }

      const auth = await signin(values, showAlert);
      setLoading(false);

      if (!auth || !auth.data) {
        setSubmitting(false);
        return;
      }

      processUserLogin(auth.data);
      setCurrentUser(auth.data);
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
          {/* <div className='text-gray-500 fw-semibold fs-6'>Your Social Campaigns</div> */}
        </div>
        {/* begin::Heading */}

        {/* begin::Separator */}
        <div className='separator separator-content my-14'>
          {/* <span className='w-125px text-gray-500 fw-semibold fs-7'>Or with email</span> */}
        </div>
        {/* end::Separator */}

        {/* begin::Form group */}
        <div className='fv-row mb-8'>
          <label className='form-label fs-6 fw-bolder text-gray-900'>帳號</label>
          <input
            placeholder='請輸入帳號...'
            type='text'
            autoComplete='off'
            {...formik.getFieldProps('account')}
            className={clsx(
              'form-control bg-transparent',
              {
                'is-invalid': formik.touched.account && formik.errors.account
              },
              {
                'is-valid': formik.touched.account && !formik.errors.account,
              }
            )}
          />
          {formik.touched.account && formik.errors.account && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.account}</span>
              </div>
            </div>
          )}
        </div>
        {/* end::Form group */}

        {/* begin::Form group */}
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
              }
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
        {/* end::Form group */}

        {/* begin::Wrapper */}
        <div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8'>
          <div />

          {/* begin::Link */}
          <Link to='/auth/forgot-password' className='link-primary'>
            忘記密碼？
          </Link>
          {/* end::Link */}
        </div>
        {/* end::Wrapper */}

        {/* begin::Action */}
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
        {/* end::Action */}

        <div className='text-gray-500 text-center fw-semibold fs-6'>
          尚未註冊？{' '}
          <Link to='/auth/registration' className='link-primary'>
            註冊
          </Link>
        </div>
      </form>
    </>
  )
}
