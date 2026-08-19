import { useState } from 'react'
import { Check, PenLine, RefreshCw } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { HandSignatureDialog } from '@/shared/components/common/hand-signature'
import { cn } from '@/shared/lib/utils'
import { ActParticipant } from '@/features/inspections/model/act-participants'

interface ActParticipantsPanelProps {
  participants: ActParticipant[]
  onChange: (index: number, signBase64: string) => void
  disabled?: boolean
}

export const ActParticipantsPanel = ({ participants, onChange, disabled = false }: ActParticipantsPanelProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const signedCount = participants.filter((participant) => participant.signBase64).length
  const isComplete = signedCount === participants.length
  const activeParticipant = activeIndex === null ? null : participants[activeIndex]

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex-shrink-0 border-b px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold">Qatnashuvchilar imzosi</h3>
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 text-xs font-medium',
              isComplete ? 'bg-[#2ECD56]/15 text-[#1F9A3E]' : 'bg-amber-100 text-amber-800'
            )}
          >
            {signedCount} / {participants.length}
          </span>
        </div>
        <p className="text-muted-foreground pt-1 text-xs">
          Har bir qatnashuvchi dalolatnoma bilan tanishib chiqqach imzo qo‘yadi.
        </p>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {participants.map((participant, index) => {
          const isSigned = Boolean(participant.signBase64)

          return (
            <div
              key={`${participant.fullName}-${index}`}
              className={cn(
                'rounded-xl border p-3 transition-colors',
                isSigned ? 'border-[#2ECD56]/40 bg-[#2ECD56]/5' : 'bg-slate-50'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-medium">{participant.fullName}</p>
                  <p className="text-muted-foreground truncate text-xs">{participant.position}</p>
                </div>
                {isSigned && (
                  <span className="flex flex-shrink-0 items-center gap-1 text-xs font-medium text-[#1F9A3E]">
                    <Check className="size-3.5" />
                    Imzolandi
                  </span>
                )}
              </div>

              {isSigned ? (
                <div className="mt-2 flex items-center gap-3">
                  <img
                    alt={`${participant.fullName} imzosi`}
                    src={`data:image/png;base64,${participant.signBase64}`}
                    className="h-12 min-w-0 flex-1 rounded-md border border-neutral-200 bg-white object-contain p-1"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={disabled}
                    onClick={() => setActiveIndex(index)}
                  >
                    <RefreshCw className="size-4" />
                    Qayta
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  variant="info"
                  disabled={disabled}
                  className="mt-2 w-full"
                  onClick={() => setActiveIndex(index)}
                >
                  <PenLine className="size-4" />
                  Imzo qo‘yish
                </Button>
              )}
            </div>
          )
        })}
      </div>

      {activeParticipant && (
        <HandSignatureDialog
          open={activeIndex !== null}
          signerName={activeParticipant.fullName}
          signerPosition={activeParticipant.position}
          onOpenChange={(open) => {
            if (!open) setActiveIndex(null)
          }}
          onSave={(signBase64) => {
            if (activeIndex !== null) onChange(activeIndex, signBase64)
          }}
        />
      )}
    </div>
  )
}
