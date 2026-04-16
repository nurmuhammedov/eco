import { useAuth } from '@/shared/hooks/use-auth'
import { DataTable } from '@/shared/components/common/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { format, formatDate } from 'date-fns'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import InspectionChecklistFormV2, { answerOptions } from '@/features/inspections/ui/parts/inspection-checklist-form-v2'
import { InspectionStatus, InspectionSubMenuStatus } from '@/widgets/inspection/ui/inspection-widget'
import { useState } from 'react'
import { useCustomSearchParams, useData } from '@/shared/hooks'
import { UserRoles } from '@/entities/user'
import { NoData } from '@/shared/components/common/no-data'
import FileLink from '@/shared/components/common/file-link'
import ReportExecutionModal from '@/features/inspections/ui/parts/report-execution-modal'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { AlertCircle, CheckCircle2, Eye, FileText, ShieldCheck, UploadCloud } from 'lucide-react'
import SignersModal from '@/features/application/application-detail/ui/modals/signers-modal'
import { getDate } from '@/shared/utils/date'
import SignedActUploadModal from './signed-act-upload-modal'
import { useTranslation } from 'react-i18next'
import OmbudsmanCodeModal from './ombudsman-code-modal'

const InspectionReports = ({
  status,
  acknowledgementPath,
  additionalFilePath,
  signedActPath,
  act,
  resultId,
  specialCode,
}: any) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [currentTab, setCurrentTab] = useState<'questions' | 'eliminated' | 'not_eliminated'>('questions')
  const [tabulation, setTabulation] = useState<'all' | 'positive' | 'negative'>('all')
  const [id, setId] = useState<any>(null)
  const [inspectionTitle, setInspectionTitle] = useState<string>('')
  const [signers, setSigners] = useState<any[]>([])
  const {
    paramsObject: { inspectionType = 'risk_based' },
  } = useCustomSearchParams()

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
      <div className="mt-1 flex flex-col gap-4">
        {specialCode ? (
          <div className="flex items-center gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-800">Ombudsman maxsus kodi</p>
              <p className="text-xl font-bold tracking-wider text-emerald-700">{specialCode}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                <ShieldCheck className="h-6 w-6 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Ombudsman maxsus kodi</p>
                <p className="text-sm font-semibold text-red-500">Mavjud emas</p>
              </div>
            </div>
            {inspectionType === 'other' && user?.role === UserRoles.REGIONAL && (
              <OmbudsmanCodeModal
                resultId={resultId}
                trigger={
                  <Button
                    // className="border-gray-300 text-gray-700 hover:bg-gray-100"
                    disabled={!signedActPath}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" /> Kodni yuklash
                  </Button>
                }
              />
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Tabs value={currentTab} onValueChange={(val) => setCurrentTab(val as any)}>
          <TabsList className="bg-[#EDEEEE]">
            <TabsTrigger value="questions">Tekshiruv savolnoma</TabsTrigger>
            <TabsTrigger value="eliminated">Kamchilik aniqlandi</TabsTrigger>
            <TabsTrigger value="not_eliminated">Kamchilik aniqlanmadi</TabsTrigger>
          </TabsList>
        </Tabs>
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
          <div className="pb-50">
            <NoData />
          </div>
        ) : (
          <>
            {currentTab == 'questions' && user?.role == UserRoles.INSPECTOR && status == InspectionStatus.ASSIGNED ? (
              <InspectionChecklistFormV2
                categories={categories}
                resultId={resultId}
                acknowledgementPath={acknowledgementPath}
                additionalFilePath={additionalFilePath}
              />
            ) : (
              <>
                {currentTab == 'questions' && (
                  <div
                    className={`mb-6 grid grid-cols-1 gap-3 lg:grid-cols-2 ${inspectionType == 'other' ? 'xl:grid-cols-4' : 'xl:grid-cols-3'}`}
                  >
                    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                      <div>
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                            <FileText className="h-5 w-5 text-amber-600" />
                          </div>
                          {acknowledgementPath && (
                            <Badge variant="success" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                              Yuklangan
                            </Badge>
                          )}
                        </div>
                        <h4 className="mb-1 text-sm font-medium text-slate-800">Tilxat fayli</h4>
                        <p className="text-xs text-slate-500">
                          {acknowledgementPath ? 'Inspektor tomonidan yuklangan!' : 'Inspektor tomonidan yuklanadi!'}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                        {acknowledgementPath ? (
                          <>
                            <FileLink url={acknowledgementPath} title="Hujjatni ko‘rish" />
                            {/*{user?.role === UserRoles.INSPECTOR && (*/}
                            {/*  <AcknowledgementUploadModal*/}
                            {/*    resultId={resultId}*/}
                            {/*    acknowledgementPath={acknowledgementPath}*/}
                            {/*    trigger={*/}
                            {/*      <button className="cursor-pointer text-xs font-medium text-amber-600 underline underline-offset-2 hover:text-amber-700">*/}
                            {/*        Yangilash*/}
                            {/*      </button>*/}
                            {/*    }*/}
                            {/*  />*/}
                            {/*)}*/}
                          </>
                        ) : (
                          <span className="flex items-center gap-1.5 text-sm text-slate-400">
                            <AlertCircle className="h-4 w-4" /> Yuklanmagan
                          </span>
                        )}
                      </div>
                    </div>

                    {inspectionType == 'other' && (
                      <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                        <div>
                          <div className="mb-3 flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                              <FileText className="h-5 w-5 text-amber-600" />
                            </div>
                            {additionalFilePath && (
                              <Badge variant="success" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                                Yuklangan
                              </Badge>
                            )}
                          </div>
                          <h4 className="mb-1 text-sm font-medium text-slate-800"> Qo‘shimcha fayl</h4>
                          <p className="text-xs text-slate-500">
                            {additionalFilePath ? 'Inspektor tomonidan yuklangan!' : 'Inspektor tomonidan yuklanadi!'}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                          {additionalFilePath ? (
                            <>
                              <FileLink url={additionalFilePath} title="Hujjatni ko‘rish" />
                              {/*{user?.role === UserRoles.INSPECTOR && (*/}
                              {/*  <additionalFilePathModal*/}
                              {/*    resultId={resultId}*/}
                              {/*    additionalFilePath={additionalFilePath}*/}
                              {/*    trigger={*/}
                              {/*      <button className="cursor-pointer text-xs font-medium text-amber-600 underline underline-offset-2 hover:text-amber-700">*/}
                              {/*        Yangilash*/}
                              {/*      </button>*/}
                              {/*    }*/}
                              {/*  />*/}
                              {/*)}*/}
                            </>
                          ) : (
                            <span className="flex items-center gap-1.5 text-sm text-slate-400">
                              <AlertCircle className="h-4 w-4" /> Yuklanmagan
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                      <div>
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          {act && (
                            <Badge variant="outline" className="border-blue-200 bg-blue-50/50 text-blue-700">
                              Shakllangan
                            </Badge>
                          )}
                        </div>
                        <h4 className="mb-1 text-sm font-medium text-slate-800">Dalolatnoma</h4>
                        <p className="text-xs text-slate-500">
                          {act
                            ? 'Tizim tomonidan avtomatik shakllantirilgan!'
                            : 'Tizim tomonidan avtomatik shakllantiriladi!'}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                        {act ? (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-slate-500">
                                {act?.createdAt ? getDate(act?.createdAt) : ''}
                              </span>
                              <FileLink url={act?.path} title="Hujjatni ko‘rish" />
                            </div>
                            <button
                              className="flex cursor-pointer items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                              onClick={() => setSigners(act?.signers)}
                            >
                              <Eye size="14" /> Imzolagan shaxslar
                            </button>
                          </>
                        ) : (
                          <span className="flex items-center gap-1.5 text-sm text-slate-400">
                            <AlertCircle className="h-4 w-4" /> Shakllanmagan
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                      <div>
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                            <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                          </div>
                          {signedActPath && (
                            <Badge variant="success" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                              Yuklangan
                            </Badge>
                          )}
                        </div>
                        <h4 className="mb-1 text-sm font-medium text-slate-800">{t('signedAct')}</h4>
                        <p className="text-xs text-slate-500">Imzolangan dalolatnomaning skaner nusxasi!</p>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                        {signedActPath ? (
                          <>
                            <FileLink url={signedActPath} title="Hujjatni ko‘rish" />
                          </>
                        ) : status === InspectionSubMenuStatus.COMPLETED && user?.role === UserRoles.INSPECTOR ? (
                          <SignedActUploadModal
                            resultId={resultId}
                            signedActPath={signedActPath}
                            trigger={
                              <Button variant="outline" className="w-full border-indigo-200 text-indigo-600">
                                <UploadCloud className="mr-2 h-4 w-4" /> Yuklash
                              </Button>
                            }
                          />
                        ) : (
                          <span className="flex items-center gap-1.5 text-sm text-slate-400">
                            <AlertCircle className="h-4 w-4" /> Yuklanmagan
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {act && <SignersModal setSigners={setSigners} signers={signers} />}

                {categories?.map((category: any) => (
                  <div key={category.inspectionCategoryId} className="mb-4 rounded-xl border bg-white p-4 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-slate-800">{category.categoryName}</h3>
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
