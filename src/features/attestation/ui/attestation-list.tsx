import {
  AttestationReportDto,
  AttestationStatus,
  AttestationView,
  EmployeeLevel,
} from '@/entities/attestation/model/attestation.types'
import { UserRoles } from '@/entities/user'
import { DataTable } from '@/shared/components/common/data-table'
import { Badge } from '@/shared/components/ui/badge'
import { useAuth } from '@/shared/hooks/use-auth'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { getDate } from '@/shared/utils/date'
import { useTranslation } from 'react-i18next'

export const AttestationList: React.FC = () => {
  const { user } = useAuth()
  const { t } = useTranslation()
  const {
    paramsObject: { ...rest },
  } = useCustomSearchParams()
  const { data, isLoading } = usePaginatedData<any>(`/attestation`, {
    ...rest,
    page: rest.page || 1,
    size: rest?.size || 10,
  })

  const levelTranslations: Record<string, string> = {
    [EmployeeLevel.LEADER]: t('attestation.LEADER'),
    [EmployeeLevel.TECHNICIAN]: t('attestation.TECHNICIAN'),
    [EmployeeLevel.EMPLOYEE]: t('attestation.EMPLOYEE'),
  }

  const columnsForLegalIndividual: ColumnDef<AttestationView>[] = [
    { accessorKey: 'employeeName', header: 'Xodim F.I.SH.' },
    { accessorKey: 'employeePin', header: 'JSHSHIR' },
    {
      accessorKey: 'employeeLevel',
      header: 'Lavozimi',
      cell: ({ row }) => levelTranslations[row.original.employeeLevel] || row.original.employeeLevel,
    },
    { accessorKey: 'hfName', header: 'XICHО nomi' },
    {
      accessorKey: 'expiryDate',
      header: 'Attestatsiyadan o‘tgan muddati',
      cell: ({ row }) => getDate(row.original.expiryDate),
    },

    {
      accessorKey: 'status',
      header: 'Attestatsiya holati',
      cell: ({ row }) =>
        row.original.status == AttestationStatus.PASSED ? (
          <Badge variant="success">O‘tdi</Badge>
        ) : row.original.status == AttestationStatus.FAILED ? (
          <Badge variant="error">O‘tmadi</Badge>
        ) : (
          <Badge variant="info">Jarayonda</Badge>
        ),
    },
  ]
  const columnsForOthers: ColumnDef<AttestationReportDto>[] = [
    { accessorKey: 'legalName', header: 'Tashkilot nomi' },
    { accessorKey: 'legalTin', header: 'Tashkilot STIR' },
    { accessorKey: 'legalAddress', header: 'Tashkilot manzili' },
    { accessorKey: 'hfName', header: 'XICHО nomi' },
    { accessorKey: 'hfAddress', header: 'XICHО manzili' },
    { accessorKey: 'totalEmployees', header: 'Jami xodimlar soni' },
    { accessorKey: 'leadersPassed', header: 'Attestatsiyadan o‘tgan rahbar xodimlar' },
    { accessorKey: 'techniciansPassed', header: 'Attestatsiyadan o‘tgan muhandis-texnik xodimlar' },
    { accessorKey: 'employeesPassed', header: 'Attestatsiyadan o‘tgan oddiy xodimlar' },
    { accessorKey: 'failedEmployees', header: 'Attestatsiyadan o‘tmay qolgan xodimlar' },
  ]

  const columns =
    user?.role === UserRoles.LEGAL || user?.role === UserRoles.INDIVIDUAL ? columnsForLegalIndividual : columnsForOthers

  return (
    <>
      <DataTable
        isPaginated
        columns={columns as any}
        data={data || []}
        isLoading={isLoading}
        className="h-[calc(100svh-320px)]"
      />
    </>
  )
}
