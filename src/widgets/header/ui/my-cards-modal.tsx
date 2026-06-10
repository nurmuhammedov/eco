import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { CreditCard, Plus, Info } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/api-client'
import { Skeleton } from '@/shared/components/ui/skeleton'
import useData from '@/shared/hooks/api/useData'

export interface PaymentCard {
  id?: string
  cardNumber: string
  expirationDate?: string
  expiryDate?: string
  transitAccount?: string
  bankInfo?: string
  type?: 'UZCARD' | 'HUMO' | 'UNKNOWN'
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const getCardType = (number: string): 'UZCARD' | 'HUMO' | 'UNKNOWN' => {
  const clean = number.replace(/\s+/g, '')
  if (clean.startsWith('8600') || clean.startsWith('5614')) return 'UZCARD'
  if (clean.startsWith('9860')) return 'HUMO'
  return 'UNKNOWN'
}

const formatCardNumber = (value: string) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  const matches = v.match(/\d{4,16}/g)
  const match = (matches && matches[0]) || ''
  const parts = []
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4))
  }
  if (parts.length) {
    return parts.join(' ')
  } else {
    return value
  }
}

const formatExpiryDate = (value: string) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  if (v.length >= 3) {
    return `${v.substring(0, 2)}/${v.substring(2, 4)}`
  }
  return v
}

const formatNumberOnly = (value: string) => {
  return value.replace(/\D/g, '')
}

export function MyCardsModal({ open, onOpenChange }: Props) {
  const queryClient = useQueryClient()
  const [isAdding, setIsAdding] = useState(false)
  const [expandedCardId, setExpandedCardId] = useState<string | number | null>(null)

  // Form state
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [transitAccount, setTransitAccount] = useState('')
  const [bankInfo, setBankInfo] = useState('')

  useEffect(() => {
    if (!open) {
      setIsAdding(false)
      setCardNumber('')
      setExpiryDate('')
      setTransitAccount('')
      setBankInfo('')
      setExpandedCardId(null)
    }
  }, [open])

  // Fetch current card
  const { data: cards, isLoading: isFetching } = useData<PaymentCard[]>('/plastic-cards/my', open)
  const cardsList = Array.isArray(cards) ? cards : []
  const hasCards = cardsList.length > 0

  // Create card
  const { mutate: addCard, isPending } = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await apiClient.post('/plastic-cards', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/plastic-cards/my'] })
      setIsAdding(false)
      setCardNumber('')
      setExpiryDate('')
      setTransitAccount('')
      setBankInfo('')
    },
  })

  const handleAddCard = () => {
    if (cardNumber.replace(/\s+/g, '').length !== 16 || expiryDate.length !== 5) return
    if (!transitAccount || !bankInfo) return

    const expirationDateFormatted = expiryDate.replace('/', '') // "11/24" -> "1124"

    addCard({
      cardNumber: cardNumber.replace(/\s+/g, ''),
      expirationDate: expirationDateFormatted,
      transitAccount,
      bankInfo, // MFO
    })
  }

  const currentType = getCardType(cardNumber)

  const renderCardVisual = (num: string, exp: string, typeVal: string) => {
    const formattedNum = formatCardNumber(num) || '0000 0000 0000 0000'
    const formattedExp =
      exp && !exp.includes('/') && exp.length === 4 ? `${exp.substring(0, 2)}/${exp.substring(2, 4)}` : exp || 'MM/YY'

    return (
      <div
        className={cn(
          'relative flex h-48 w-full shrink-0 flex-col justify-between overflow-hidden rounded-[20px] border border-white/10 p-6 text-white shadow-md transition-all duration-300',
          'bg-gradient-to-bl from-slate-900 via-slate-800 to-slate-950'
        )}
      >
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-slate-400/10 blur-3xl" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="text-xl font-bold tracking-[0.2em] text-slate-200">
            {typeVal === 'UZCARD' ? 'UZCARD' : typeVal === 'HUMO' ? 'HUMO' : 'KARTA'}
          </div>
          <div className="relative flex h-9 w-12 items-center justify-center overflow-hidden rounded-[6px] border-[0.5px] border-yellow-600/50 bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 shadow-sm">
            <div className="absolute top-1/2 left-0 h-[0.5px] w-full bg-yellow-700/40" />
            <div className="absolute top-0 left-1/2 h-full w-[0.5px] bg-yellow-700/40" />
            <div className="absolute h-5 w-6 rounded-sm border-[0.5px] border-yellow-700/40" />
          </div>
        </div>

        <div className="relative z-10 mt-8 flex items-center justify-between">
          <div className="font-mono text-[22px] tracking-[0.2em] text-slate-100 drop-shadow-sm">{formattedNum}</div>
        </div>

        <div className="relative z-10 mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            <span className="mb-1 text-[9px] tracking-[0.15em] text-slate-400 uppercase">Amal qilish</span>
            <span className="font-mono text-base tracking-widest text-slate-200">{formattedExp}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-[#4E75FF]">Karta ma’lumotlarim</DialogTitle>
        </DialogHeader>

        {isFetching ? (
          <div className="flex flex-col gap-4 py-4">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ) : !isAdding && !hasCards ? (
          <div className="flex flex-col gap-4 py-4">
            <div className="text-muted-foreground flex flex-col items-center justify-center rounded-xl border border-dashed py-10 text-center">
              <CreditCard className="mb-3 h-12 w-12 opacity-20" />
              <p>Hali hech qanday karta saqlanmagan</p>
            </div>
            <Button onClick={() => setIsAdding(true)} className="w-full gap-2">
              <Plus className="h-4 w-4" /> Karta qo‘shish
            </Button>
          </div>
        ) : !isAdding && hasCards ? (
          <div className="flex flex-col gap-5 py-4">
            <div className="flex max-h-[400px] flex-col gap-6 overflow-y-auto pr-2 pb-2">
              {cardsList.map((card, idx) => {
                const id = card.id || idx
                const isExpanded = expandedCardId === id
                return (
                  <div
                    key={id}
                    className="group relative h-48 w-full cursor-pointer"
                    style={{ perspective: '1000px' }}
                    onClick={() => setExpandedCardId(isExpanded ? null : id)}
                  >
                    <div
                      className={cn(
                        'h-full w-full transition-transform duration-700',
                        isExpanded ? '[transform:rotateY(180deg)]' : ''
                      )}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* Front Side */}
                      <div className="absolute inset-0 h-full w-full" style={{ backfaceVisibility: 'hidden' }}>
                        {renderCardVisual(
                          card.cardNumber,
                          card.expirationDate || card.expiryDate || '',
                          getCardType(card.cardNumber)
                        )}
                      </div>

                      {/* Back Side */}
                      <div
                        className="absolute inset-0 flex h-full w-full flex-col overflow-hidden rounded-[20px] border border-slate-700/50 bg-slate-900 shadow-md"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      >
                        <div className="mt-6 h-12 w-full border-y border-slate-800 bg-slate-950 shadow-md" />

                        <div className="mt-6 flex flex-1 flex-col gap-4 px-6">
                          <div className="flex flex-col border-b border-slate-700/50 pb-2">
                            <span className="mb-1 text-[10px] tracking-widest text-slate-400">TRANZIT RAQAM</span>
                            <span className="text-[17px] font-medium tracking-widest text-slate-200">
                              {card.transitAccount || '-'}
                            </span>
                          </div>
                          <div className="flex flex-col border-b border-slate-700/50 pb-2">
                            <span className="mb-1 text-[10px] tracking-widest text-slate-400">MFO KODI</span>
                            <span className="text-[17px] font-medium tracking-widest text-slate-200">
                              {card.bankInfo || '-'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <Button onClick={() => setIsAdding(true)} className="w-full gap-2" variant="outline">
              Boshqa karta kiritish
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-5 py-4">
            {/* Visual Card Preview */}
            {renderCardVisual(cardNumber, expiryDate, currentType)}

            {/* Inputs */}
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label>Karta raqami</Label>
                <Input
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Amal qilish muddati</Label>
                  <Input
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label>MFO</Label>
                  <Input
                    placeholder="MFO kiriting"
                    value={bankInfo}
                    onChange={(e) => setBankInfo(formatNumberOnly(e.target.value))}
                    maxLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Tranzit raqam</Label>
                  <span className="text-muted-foreground text-xs">{transitAccount.length}/20</span>
                </div>
                <div className="relative">
                  <Input
                    placeholder="Tranzit raqam kiriting"
                    value={transitAccount}
                    onChange={(e) => setTransitAccount(formatNumberOnly(e.target.value))}
                    maxLength={20}
                    className="pr-10"
                  />
                  <div className="absolute top-1/2 right-3 -translate-y-1/2">
                    <Info className="text-muted-foreground h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800 shadow-sm">
              <Info className="h-5 w-5 shrink-0 text-orange-500" />
              <p className="leading-relaxed font-medium">
                Bank tranzit raqami va MFO kodi noto‘g‘ri kiritilgan taqdirda arizangiz rad etiladi. Ushbu ma’lumotlarni
                olish uchun xizmat ko‘rsatuvchi bankga murojaat qiling.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsAdding(false)
                  if (!hasCards) {
                    onOpenChange(false)
                  }
                }}
              >
                Bekor qilish
              </Button>
              <Button
                className="flex-1"
                onClick={handleAddCard}
                loading={isPending}
                disabled={
                  cardNumber.replace(/\s+/g, '').length !== 16 ||
                  expiryDate.length !== 5 ||
                  !transitAccount ||
                  !bankInfo ||
                  isPending
                }
              >
                Saqlash
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
