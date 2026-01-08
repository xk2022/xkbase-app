// src/app/pages/tom/order/detail/cards/OrderTypeDetailCard.tsx
import React from 'react'
import { OrderDetail } from './Model'

type Props = {
  detail: OrderDetail
  reload: () => void | Promise<void>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fmt = (v?: any) => (v === null || v === undefined || v === '' ? '-' : String(v))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Row: React.FC<{ label: string; value?: any }> = ({ label, value }) => (
  <tr>
    <td className='text-muted w-180px'>{label}</td>
    <td className='fw-semibold'>{fmt(value)}</td>
  </tr>
)

export const OrderTypeDetailCard: React.FC<Props> = ({ detail }) => {
  const isImport = detail.orderType === 'IMPORT'
  const isExport = detail.orderType === 'EXPORT'

  const d = isImport ? detail.importDetail : isExport ? detail.exportDetail : undefined

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-title'>
          <h3 className='fw-bold m-0'>
            {isImport ? '進口明細' : isExport ? '出口明細' : '類型明細'}
          </h3>
        </div>
      </div>

      <div className='card-body'>
        {!d ? (
          <div className='text-muted'>尚無明細資料</div>
        ) : (
          <div className='table-responsive'>
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-3'>
              <tbody>
                {/* ✅ Import 常用欄位（你可依後端 DTO 對齊） */}
                {isImport && (
                  <>
                    <Row label='提貨/送貨單地點' value={d.deliveryOrderLocation} />
                    <Row label='進口報關號' value={d.importDeclNo} />
                    <Row label='提單號 BL No' value={d.blNo} />
                    <Row label='通關放行時間' value={d.customsReleaseTime} />
                    <Row label='倉庫' value={d.warehouse} />
                    <Row label='到港通知/文件備註' value={d.arrivalNotice} />
                  </>
                )}

                {/* ✅ Export 常用欄位（先放一組保守欄位） */}
                {isExport && (
                  <>
                    <Row label='訂艙號 Booking No' value={d.bookingNo} />
                    <Row label='裝櫃日' value={d.stuffingDate} />
                    <Row label='結關時間' value={d.cutoffTime} />
                    <Row label='出口報關號' value={d.exportDeclNo} />
                    <Row label='裝櫃地點' value={d.stuffingLocation} />
                    <Row label='S/O No' value={d.soNo} />
                    <Row label='報關行' value={d.customsBroker} />
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Debug 區：你在對齊欄位時很好用，之後可移除 */}
        {/* <pre className='mt-5 p-3 bg-light rounded'>{JSON.stringify(d, null, 2)}</pre> */}
      </div>
    </div>
  )
}
