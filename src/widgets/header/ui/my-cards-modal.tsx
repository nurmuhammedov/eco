import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { CreditCard, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

export interface PaymentCard {
  id: string
  cardNumber: string
  expiryDate: string
  type: 'UZCARD' | 'HUMO' | 'UNKNOWN'
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

export function MyCardsModal({ open, onOpenChange }: Props) {
  const [cards, setCards] = useState<PaymentCard[]>([])
  const [isAdding, setIsAdding] = useState(false)

  // Form state
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('user_payment_cards')
    if (saved) {
      try {
        setCards(JSON.parse(saved))
      } catch (e) {
        /* empty */
      }
    }
  }, [open])

  const saveToStorage = (newCards: PaymentCard[]) => {
    setCards(newCards)
    localStorage.setItem('user_payment_cards', JSON.stringify(newCards))
  }

  const handleAddCard = () => {
    if (cardNumber.replace(/\s+/g, '').length !== 16 || expiryDate.length !== 5) return

    const newCard: PaymentCard = {
      id: Math.random().toString(36).substring(7),
      cardNumber,
      expiryDate,
      type: getCardType(cardNumber),
    }

    saveToStorage([...cards, newCard])
    setIsAdding(false)
    setCardNumber('')
    setExpiryDate('')
  }

  const removeCard = (id: string) => {
    saveToStorage(cards.filter((c) => c.id !== id))
  }

  const currentType = getCardType(cardNumber)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-[#4E75FF]">Karta ma’lumotlarim</DialogTitle>
        </DialogHeader>

        {!isAdding ? (
          <div className="flex flex-col gap-4 py-4">
            {cards.length === 0 ? (
              <div className="text-muted-foreground flex flex-col items-center justify-center rounded-xl border border-dashed py-8 text-center">
                <CreditCard className="mb-2 h-10 w-10 opacity-20" />
                <p>Hali hech qanday karta saqlanmagan</p>
              </div>
            ) : (
              <div className="flex max-h-[300px] flex-col gap-4 overflow-y-auto pr-1 pb-2">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className={cn(
                      'relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 text-white shadow-lg transition-transform hover:scale-[1.02]',
                      card.type === 'UZCARD'
                        ? 'bg-gradient-to-tr from-blue-700 to-cyan-400'
                        : card.type === 'HUMO'
                          ? 'bg-gradient-to-tr from-orange-500 to-yellow-400'
                          : 'bg-gradient-to-tr from-gray-800 to-gray-500'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold tracking-wider italic opacity-90">
                        {card.type === 'UZCARD' ? 'UZCARD' : card.type === 'HUMO' ? 'HUMO' : 'KARTA'}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/70 hover:bg-white/20 hover:text-white"
                        onClick={() => removeCard(card.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-6 font-mono text-xl tracking-widest drop-shadow-sm">{card.cardNumber}</div>
                    <div className="mt-4 flex items-center justify-between text-sm drop-shadow-sm">
                      <div className="flex flex-col">
                        <span className="text-xs uppercase opacity-70">Amal qilish</span>
                        <span className="font-mono font-medium">{card.expiryDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button onClick={() => setIsAdding(true)} className="w-full gap-2">
              <Plus className="h-4 w-4" /> Yangi karta qo‘shish
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-6 py-4">
            {/* Visual Card Preview */}
            <div
              className={cn(
                'relative flex h-48 flex-col justify-between overflow-hidden rounded-2xl p-6 text-white shadow-xl transition-all duration-300',
                currentType === 'UZCARD'
                  ? 'bg-gradient-to-tr from-blue-700 to-cyan-400'
                  : currentType === 'HUMO'
                    ? 'bg-gradient-to-tr from-orange-500 to-yellow-400'
                    : 'bg-gradient-to-tr from-gray-800 to-gray-500'
              )}
            >
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>

              <div className="z-10 flex items-center justify-between">
                <div className="text-xl font-bold tracking-wider italic drop-shadow-md">
                  {currentType === 'UZCARD' ? 'UZCARD' : currentType === 'HUMO' ? 'HUMO' : 'KARTA'}
                </div>
                <CreditCard className="h-8 w-8 opacity-70" />
              </div>
              <div className="z-10 font-mono text-2xl tracking-[0.2em] drop-shadow-md">
                {cardNumber || '0000 0000 0000 0000'}
              </div>
              <div className="z-10 flex items-center justify-between text-sm drop-shadow-md">
                <div className="flex flex-col">
                  <span className="text-xs uppercase opacity-70">Amal qilish</span>
                  <span className="font-mono font-medium">{expiryDate || 'MM/YY'}</span>
                </div>
              </div>
            </div>

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
              <div className="space-y-2">
                <Label>Amal qilish muddati</Label>
                <Input
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                  maxLength={5}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsAdding(false)}>
                Bekor qilish
              </Button>
              <Button
                className="flex-1"
                onClick={handleAddCard}
                disabled={cardNumber.replace(/\s+/g, '').length !== 16 || expiryDate.length !== 5}
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
