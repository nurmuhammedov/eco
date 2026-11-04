import { useState } from 'react'
import { CheckCircle2, Pencil, Plus, Trash2, TriangleAlert } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { NoData } from '@/shared/components/common/no-data'
import DeleteConfirmationDialog from '@/shared/components/common/delete-confirm-dialog'
import { COMMISSION_ROLE } from '@/entities/attestation/model/labels'
import type { AttestationCommissionMember } from '@/entities/attestation/model/types'
import { useCommission, useRemoveCommissionMember } from '../model/use-commission'
import { CommissionSettings } from './commission-settings'
import { MemberDialog } from './member-dialog'

/**
 * The standing commission (resolution No. 26, items 18–19): its deputy chairman
 * signs decisions and letters, its secretary is their executor, and the members
 * who sat on an exam sign its protocol.
 */
export function CommissionPageContent() {
  const { data: commission, isLoading } = useCommission()
  const remove = useRemoveCommissionMember()
  const [dialog, setDialog] = useState<{ open: boolean; member: AttestationCommissionMember | null }>({
    open: false,
    member: null,
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (!commission) return <NoData text="Komissiya topilmadi" />

  const members = commission.members ?? []

  return (
    <div className="flex flex-col gap-3 overflow-y-auto">
      <CommissionSettings commission={commission} />

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold">Komissiya tarkibi</h3>
            <Badge variant="outline">{commission.is_central ? 'Markaziy komissiya' : 'Hududiy komissiya'}</Badge>
            <Button className="ml-auto" onClick={() => setDialog({ open: true, member: null })}>
              <Plus className="mr-2 h-4 w-4" />
              A’zo qo‘shish
            </Button>
          </div>

          {commission.problems.length > 0 ? (
            <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Tarkib to‘liq emas, shu sababli arizalar bo‘yicha qaror chiqarib va imtihon belgilab bo‘lmaydi:{' '}
                {commission.problems.join('; ')}.
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-2 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <p>Tarkib 26-son Nizom talablariga mos.</p>
            </div>
          )}

          <p className="text-muted-foreground text-xs">
            Komissiya kamida {commission.minimum_members} kishidan, toq sondagi a’zolardan iborat bo‘ladi: rais, kamida
            bitta rais o‘rinbosari, a’zolar va kotib. Qaror va xatlarni rais o‘rinbosari, bayonnoma va guvohnomani rais
            imzolaydi, kotib xatlarda ijrochi sifatida ko‘rsatiladi. Imtihon boshlangach, uning tarkibi shu imtihon
            bayonnomasi uchun saqlanib qoladi.
          </p>

          {members.length === 0 ? (
            <NoData text="Komissiya a’zolari kiritilmagan" />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">T/r</TableHead>
                    <TableHead>F.I.Sh.</TableHead>
                    <TableHead>Lavozimi</TableHead>
                    <TableHead>Komissiyadagi vazifasi</TableHead>
                    <TableHead className="w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member, index) => (
                    <TableRow key={member.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <p className="font-medium">{member.full_name}</p>
                        <p className="text-muted-foreground text-xs">{member.pin}</p>
                      </TableCell>
                      <TableCell>{member.position || '-'}</TableCell>
                      <TableCell>{COMMISSION_ROLE[member.role] ?? member.role_label}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-500"
                            title="Tahrirlash"
                            onClick={() => setDialog({ open: true, member })}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <DeleteConfirmationDialog
                            title="Komissiya tarkibidan chiqarish"
                            description={`${member.full_name} komissiya tarkibidan chiqariladi. Boshlangan imtihonlarning bayonnomasi o‘zgarmaydi.`}
                            confirmText="Chiqarish"
                            onConfirm={() => remove.mutate(member.id)}
                            trigger={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500"
                                title="Tarkibdan chiqarish"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <MemberDialog
        isOpen={dialog.open}
        member={dialog.member}
        onClose={() => setDialog({ open: false, member: null })}
      />
    </div>
  )
}
