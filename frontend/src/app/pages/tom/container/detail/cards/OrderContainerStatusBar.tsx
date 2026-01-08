import React from 'react'

export type OrderContainerStatus =
  | 'CREATED'
  | 'UNASSIGNED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'PARTIAL_DONE'
  | 'DONE'
  | 'CANCELLED'

type Props = {
  status: OrderContainerStatus
}

const STEPS: Array<{ key: OrderContainerStatus; label: string }> = [
  { key: 'CREATED', label: '建立' },
  { key: 'UNASSIGNED', label: '待指派' },
  { key: 'ASSIGNED', label: '已指派' },
  { key: 'IN_PROGRESS', label: '運送中' },
  { key: 'DONE', label: '完成' },
]

export const OrderContainerStatusBar: React.FC<Props> = ({ status }) => {
  const currentIndex = STEPS.findIndex((s) => s.key === status)

  return (
    <div className='card mb-6'>
      <div className='card-body py-4'>
        <div className='d-flex align-items-center justify-content-between'>
          {STEPS.map((s, idx) => {
            const isDone = idx < currentIndex
            const isCurrent = idx === currentIndex

            return (
              <div key={s.key} className='d-flex align-items-center flex-fill'>
                {/* circle */}
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center fw-bold`}
                  style={{
                    width: 36,
                    height: 36,
                    backgroundColor: isCurrent
                      ? '#0d6efd'
                      : isDone
                      ? '#198754'
                      : '#dee2e6',
                    color: isCurrent || isDone ? '#fff' : '#6c757d',
                  }}
                >
                  {idx + 1}
                </div>

                {/* label */}
                <div className='ms-3 me-3 fw-semibold text-gray-700'>
                  {s.label}
                </div>

                {/* line */}
                {idx < STEPS.length - 1 && (
                  <div className='flex-fill mx-2'>
                    <div
                      style={{
                        height: 2,
                        backgroundColor: isDone ? '#198754' : '#dee2e6',
                      }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
