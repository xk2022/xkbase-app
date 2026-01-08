// src/app/pages/upms/user/detail/UserPermissionSummaryCard.tsx
import React, {useEffect, useMemo, useState} from 'react'
import {KTIcon} from '@/_metronic/helpers'
import type {AlertFn} from '@/app/pages/common/AlertType'

import { UserProfile } from '../../Model'
import { fetchUserPermissions } from '../../Query'

type Props = {
  detail: UserProfile
  showAlert?: AlertFn
}

/**
 * MVP 行為：
 * - 優先顯示 detail.permissions（Detail API 已帶回時，速度最快）
 * - 點「刷新」才呼叫 /permissions 取得「計算後權限」(若後端有實作)
 * - 支援 keyword filter（前端做，不打 API）
 */
export const UserPermissionSummaryCard: React.FC<Props> = ({detail, showAlert}) => {
  const [loading, setLoading] = useState(false)
  const [serverPermissions, setServerPermissions] = useState<string[] | null>(null)

  const [tempKeyword, setTempKeyword] = useState('')
  const [keyword, setKeyword] = useState('')

  const basePermissions = useMemo(() => {
    // server 優先；否則用 detail.permissions
    const list = (serverPermissions ?? detail.permissions ?? []).filter(Boolean)
    // 去重 + sort（穩定）
    return Array.from(new Set(list)).sort((a, b) => a.localeCompare(b))
  }, [detail.permissions, serverPermissions])

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    if (!kw) return basePermissions
    return basePermissions.filter((p) => p.toLowerCase().includes(kw))
  }, [basePermissions, keyword])

  const onSearch = () => setKeyword(tempKeyword.trim())
  const onReset = () => {
    setTempKeyword('')
    setKeyword('')
  }

  const onRefresh = async () => {
    setLoading(true)
    try {
      const list = await fetchUserPermissions(detail.id, showAlert)
      if (list && list.length > 0) {
        setServerPermissions(list)
      } else {
        // 若後端回空，仍保留（可能真的沒有權限）
        setServerPermissions([])
      }
    } finally {
      setLoading(false)
    }
  }

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(filtered.join('\n'))
      showAlert?.('已複製權限清單', 'success')
    } catch (e) {
      console.error(e)
      showAlert?.('複製失敗（瀏覽器權限限制）', 'warning')
    }
  }

  // detail.id 改變時，清掉 server cache（避免顯示錯人）
  useEffect(() => {
    setServerPermissions(null)
    setTempKeyword('')
    setKeyword('')
  }, [detail.id])

  return (
    <div className='card'>
      <div className='card-header align-items-center'>
        <div className='card-title m-0'>
          <div className='d-flex align-items-center gap-2'>
            <KTIcon iconName='key' className='fs-2' />
            <h3 className='fw-bold m-0'>權限摘要</h3>
          </div>
        </div>

        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2'>
            <button type='button' className='btn btn-sm btn-light' onClick={copyAll} disabled={filtered.length === 0}>
              <KTIcon iconName='copy' className='fs-3 me-1' />
              複製
            </button>

            <button type='button' className='btn btn-sm btn-light-primary' onClick={onRefresh} disabled={loading}>
              {loading ? (
                <span className='d-flex align-items-center gap-2'>
                  <span className='spinner-border spinner-border-sm' />
                  刷新中...
                </span>
              ) : (
                <>
                  <KTIcon iconName='arrows-circle' className='fs-3 me-1' />
                  刷新
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className='card-body'>
        {/* quick meta */}
        <div className='d-flex flex-wrap gap-3 mb-4'>
          <div className='text-muted fs-8'>
            Roles：<span className='fw-bold'>{detail.roles?.length ?? 0}</span>
          </div>
          <div className='text-muted fs-8'>
            Permissions：<span className='fw-bold'>{basePermissions.length}</span>
          </div>
          {serverPermissions !== null && (
            <span className='badge badge-light-info'>已從 Server 刷新</span>
          )}
        </div>

        {/* filter row */}
        <div className='d-flex align-items-center gap-2 flex-wrap mb-4'>
          <div className='d-flex align-items-center position-relative flex-grow-1' style={{minWidth: 220}}>
            <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
            <input
              type='text'
              className='form-control form-control-solid ps-14'
              placeholder='搜尋權限，例如：upms.user'
              value={tempKeyword}
              onChange={(e) => setTempKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSearch()
              }}
            />
          </div>

          <button type='button' className='btn btn-light-primary' onClick={onSearch}>
            搜尋
          </button>
          <button type='button' className='btn btn-light' onClick={onReset}>
            重置
          </button>
        </div>

        {/* list */}
        {filtered.length === 0 ? (
          <div className='text-center py-8 text-muted'>
            {basePermissions.length === 0 ? '目前沒有任何權限' : '查無符合的權限'}
            <div className='fs-8 mt-2'>可點右上角「刷新」取得最新計算結果</div>
          </div>
        ) : (
          <div className='table-responsive'>
            <table className='table table-row-dashed table-row-gray-200 align-middle gs-0 gy-3'>
              <thead>
                <tr className='text-muted fw-semibold fs-8'>
                  <th style={{width: 70}}>#</th>
                  <th>Permission</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, idx) => (
                  <tr key={p}>
                    <td className='text-muted'>{idx + 1}</td>
                    <td className='fw-semibold'>
                      <code className='text-gray-800'>{p}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className='text-muted fs-8 mt-3'>
          提示：此處顯示「有效權限」(effective permissions)。若你後端尚未做計算，會先用 detail.permissions。
        </div>
      </div>
    </div>
  )
}

export default UserPermissionSummaryCard
