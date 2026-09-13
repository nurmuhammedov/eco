import { ReactNode, createContext, useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { FieldValues, UseFormReturn } from 'react-hook-form'
import { Plus } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Form } from '@/shared/components/ui/form'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/shared/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog'
import { cn } from '@/shared/lib/utils'

export const ActiveBadge = ({ active }: { active: boolean }) => (
  <Badge variant={active ? 'success' : 'secondary'}>{active ? 'Faol' : 'Nofaol'}</Badge>
)

interface TabToolbarProps {
  addLabel: string
  onAdd: () => void
  addDisabled?: boolean
  children?: ReactNode
}

// The page's header row, beside the tab list, where the active tab puts its filters and add button.
export const ToolbarSlotContext = createContext<HTMLElement | null>(null)

export const TabToolbar = ({ addLabel, onAdd, addDisabled, children }: TabToolbarProps) => {
  const slot = useContext(ToolbarSlotContext)

  const content = (
    <>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">{children}</div>
      <Button onClick={onAdd} disabled={addDisabled} className="shrink-0">
        <Plus className="mr-2 size-4" />
        {addLabel}
      </Button>
    </>
  )

  return slot ? createPortal(content, slot) : <div className="flex flex-wrap items-center gap-2">{content}</div>
}

export const EmptyHint = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-neutral-200 p-10 text-center text-sm text-neutral-500">
    {children}
  </div>
)

interface FormSheetProps<T extends FieldValues> {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  form: UseFormReturn<T>
  onSubmit: (values: T) => void
  isPending?: boolean
  className?: string
  children: ReactNode
}

export const FormSheet = <T extends FieldValues>({
  open,
  onOpenChange,
  title,
  form,
  onSubmit,
  isPending,
  className,
  children,
}: FormSheetProps<T>) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent className={cn('flex h-full flex-col', className)}>
      <SheetHeader>
        <SheetTitle>{title}</SheetTitle>
      </SheetHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-1">{children}</div>
          <SheetFooter className="w-full gap-2 sm:space-x-0">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Bekor qilish
            </Button>
            <Button type="submit" className="flex-1" loading={isPending}>
              Saqlash
            </Button>
          </SheetFooter>
        </form>
      </Form>
    </SheetContent>
  </Sheet>
)

interface ConfirmButtonProps {
  label: string
  title: string
  description?: string
  disabled?: boolean
  onConfirm: () => void
}

export const ConfirmButton = ({ label, title, description, disabled, onConfirm }: ConfirmButtonProps) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button size="sm" variant="outline" disabled={disabled} onClick={() => setOpen(true)}>
        {label}
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>{label}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
