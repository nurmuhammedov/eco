// path: src/features/inspections/ui/parts/inspection-reports.tsx
import { useAuth } from '@/shared/hooks/use-auth'
import { DataTable } from '@/shared/components/common/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { format, formatDate } from 'date-fns'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import InspectionChecklistFormV2, { answerOptions } from '@/features/inspections/ui/parts/inspection-checklist-form-v2'
import { InspectionStatus, InspectionSubMenuStatus } from '@/widgets/inspection/ui/inspection-widget'
import { useState } from 'react'
import { useData } from '@/shared/hooks'
import { UserRoles } from '@/entities/user'
import { NoData } from '@/shared/components/common/no-data'
import DetailRow from '@/shared/components/common/detail-row'
import FileLink from '@/shared/components/common/file-link'
import ReportExecutionModal from '@/features/inspections/ui/parts/report-execution-modal'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Eye, UploadCloud } from 'lucide-react'
import SignersModal from '@/features/application/application-detail/ui/modals/signers-modal'
import { getDate } from '@/shared/utils/date'
import SignedActUploadModal from './signed-act-upload-modal'
import { useTranslation } from 'react-i18next'

const InspectionReports = ({ status, acknowledgementPath, signedActPath, act, resultId, specialCode }: any) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [currentTab, setCurrentTab] = useState<'questions' | 'eliminated' | 'not_eliminated'>('questions')
  const [tabulation, setTabulation] = useState<'all' | 'positive' | 'negative'>('all')
  const [id, setId] = useState<any>(null)
  const [inspectionTitle, setInspectionTitle] = useState<string>('')
  const [signers, setSigners] = useState<any[]>([])

  const { data: categories = [] } = useData<any[]>(
    `/inspection-checklists`,
    !!resultId,
    {
      resultId,
      positive: currentTab != 'questions' ? currentTab == 'not_eliminated' : null,
      resolved: tabulation != 'all' && currentTab == 'eliminated' ? tabulation == 'positive' : null,
    },
    [],
    6000
  )

  const columns: ColumnDef<any>[] = [
    ...(currentTab == 'eliminated'
      ? [
          {
            accessorKey: 'question',
            header: 'Aniqlangan kamchilik',
          },
          {
            accessorKey: 'corrective',
            header: 'Chora-tadbir',
          },
          {
            accessorKey: 'deadline',
            size: 100,
            header: 'Bartaraf etish muddati',
            cell: ({ row }: any) => format(new Date(row.original?.deadline), 'dd.MM.yyyy'),
          },
          {
            accessorKey: 'eliminated',
            header: 'Holati',
            cell: ({ row }: any) => (
              <div className="flex items-center gap-2">
                {row.original?.status == 'NEGATIVE' ? (
                  <Badge variant="info">{user?.role == UserRoles.LEGAL ? 'Yangi' : 'Yangi'}</Badge>
                ) : row.original?.status == 'UPLOADED' ? (
                  <Badge variant="warning">Fayl yuklangan</Badge>
                ) : row.original?.status == 'REJECTED' ? (
                  <Badge variant="error">Rad etilgan</Badge>
                ) : row.original?.status == 'ACCEPTED' ? (
                  <Badge variant="success">Qabul qilindi</Badge>
                ) : null}
                <Button
                  onClick={() => {
                    setId(row.original?.id)
                    setInspectionTitle(row?.original?.question || '')
                  }}
                  variant="outline"
                  size="iconSm"
                >
                  <Eye />
                </Button>
              </div>
            ),
          },
        ]
      : currentTab == 'questions'
        ? [
            {
              accessorKey: 'question',
              size: 300,
              header: 'Savol',
            },
            ...(status == InspectionSubMenuStatus.COMPLETED
              ? [
                  {
                    accessorKey: 'answer',
                    header: 'Javob',
                    cell: ({ row }: any) =>
                      answerOptions?.find((i) => i?.value == row.original?.answer)?.labelKey || '',
                  },
                  {
                    accessorKey: 'deadline',
                    size: 100,
                    header: 'Bartaraf etish muddati',
                    cell: (cell: any) =>
                      cell.row.original.deadline ? formatDate(cell.row.original.deadline, 'dd.MM.yyyy') : '',
                  },
                  {
                    accessorKey: 'corrective',
                    header: 'Chora-tadbir matni',
                  },
                ]
              : []),
          ]
        : [
            {
              accessorKey: 'question',
              header: 'Savol',
            },
            {
              accessorKey: 'answer',
              header: 'Javob',
              cell: ({ row }: any) => answerOptions?.find((i) => i?.value == row.original?.answer)?.labelKey || '',
            },
          ]),
  ]

  return (
    <div>
      <DetailRow title="Ombudsman maxsus kodi" value={specialCode || '-'} />
      <div className="flex items-center justify-between">
        <div className="mt-2">
          <Tabs value={currentTab} onValueChange={(val) => setCurrentTab(val as any)}>
            <TabsList className="bg-[#EDEEEE]">
              <TabsTrigger value="questions">Tekshiruv savolnoma</TabsTrigger>
              <TabsTrigger value="eliminated">Kamchilik aniqlandi</TabsTrigger>
              <TabsTrigger value="not_eliminated">Kamchilik aniqlanmadi</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="my-3">
        {currentTab == 'eliminated' && (
          <Tabs value={tabulation} onValueChange={(val) => setTabulation(val as any)}>
            <TabsList className="bg-[#EDEEEE]">
              <TabsTrigger value="all">Barchasi</TabsTrigger>
              <TabsTrigger value="negative">Bartaraf etilmadi</TabsTrigger>
              <TabsTrigger value="positive">Bartaraf etildi</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>

      <div>
        {!categories?.length ? (
          <NoData />
        ) : (
          <>
            {currentTab == 'questions' && user?.role == UserRoles.INSPECTOR && status == InspectionStatus.ASSIGNED ? (
              <InspectionChecklistFormV2
                categories={categories}
                resultId={resultId}
                acknowledgementPath={acknowledgementPath}
              />
            ) : (
              <>
                {currentTab == 'questions' && (
                  <>
                    {!!acknowledgementPath && (
                      <div className="mb-4">
                        <DetailRow
                          title="Tilxat fayli:"
                          boldTitle={true}
                          value={
                            <div className="flex items-center gap-2">
                              <FileLink url={acknowledgementPath} />
                            </div>
                          }
                        />
                      </div>
                    )}

                    {!!act && (
                      <>
                        <div className="mb-4">
                          <DetailRow
                            title="Dalolatnoma:"
                            boldTitle={true}
                            value={
                              <div className="flex items-center gap-2">
                                <span>{act?.createdAt ? getDate(act?.createdAt) : ''}</span> |{' '}
                                <FileLink url={act?.path} /> |
                                <button
                                  className="cursor-pointer text-[#A6B1BB] hover:text-yellow-200"
                                  onClick={() => {
                                    setSigners(act?.signers)
                                  }}
                                >
                                  <Eye size="18" />
                                </button>
                              </div>
                            }
                          />
                        </div>
                        <SignersModal setSigners={setSigners} signers={signers} />
                      </>
                    )}

                    {!!signedActPath ? (
                      <div className="mb-4">
                        <DetailRow
                          title={`${t('signedAct')}:`}
                          boldTitle={true}
                          value={
                            <div className="flex items-center gap-2">
                              <FileLink url={signedActPath} />
                            </div>
                          }
                        />
                      </div>
                    ) : (
                      status === InspectionSubMenuStatus.COMPLETED &&
                      user?.role === UserRoles.INSPECTOR && (
                        <div className="mb-4">
                          <DetailRow
                            title={`${t('signedAct')}:`}
                            boldTitle={true}
                            value={
                              <SignedActUploadModal
                                resultId={resultId}
                                signedActPath={signedActPath}
                                trigger={
                                  <Button>
                                    <UploadCloud className="mr-2 h-4 w-4" /> Imzolangan dalolatnomani yuklash
                                  </Button>
                                }
                              />
                            }
                          />
                        </div>
                      )
                    )}
                  </>
                )}
                {categories?.map((category: any) => (
                  <div key={category.inspectionCategoryId} className="mb-4 rounded-xl border bg-white p-4">
                    <h3 className="text-black-600 mb-4 text-lg font-semibold">{category.categoryName}</h3>
                    <DataTable isLoading={false} columns={columns} data={category.checklists || []} />
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>

      {currentTab == 'eliminated' && status == InspectionSubMenuStatus.COMPLETED && (
        <ReportExecutionModal
          description={inspectionTitle}
          id={id}
          closeModal={() => {
            setId(null)
            setInspectionTitle('')
          }}
        />
      )}
    </div>
  )
}

export default InspectionReports
