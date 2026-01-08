// src/app/pages/hrm/salary/list/mockSalaryFormulas.tsx
import type { SalaryFormulaListItem } from '../Model'

export const MOCK_SALARY_FORMULAS: SalaryFormulaListItem[] = [
  {
    id: '1',
    formulaName: '標準薪資公式',
    driverId: '1',
    driverName: '張三',
    tripFee: 5000,
    overtimeRate: 200,
    nightShiftSubsidy: 150,
    effectiveDate: '2024-01-01',
    status: 'active',
    createdAt: '2023-12-20T10:00:00Z',
    updatedAt: '2023-12-20T10:00:00Z',
  },
  {
    id: '2',
    formulaName: '高級司機薪資公式',
    driverId: '2',
    driverName: '李四',
    tripFee: 6000,
    overtimeRate: 250,
    nightShiftSubsidy: 200,
    effectiveDate: '2024-01-01',
    status: 'active',
    createdAt: '2023-12-20T10:00:00Z',
    updatedAt: '2023-12-20T10:00:00Z',
  },
]
