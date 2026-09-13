import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Textarea } from '@/shared/components/ui/textarea'
import { Button } from '@/shared/components/ui/button'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'

interface TextDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  label: string
  submitLabel: string
  description?: string | null
  required?: boolean
  destructive?: boolean
  isPending?: boolean
  onSubmit: (text: string) => void
}

export const TextDialog = ({
  open,
  onOpenChange,
  title,
  label,
  submitLabel,
  description,
  required = true,
  destructive,
  isPending,
  onSubmit,
}: TextDialogProps) => {
  const schema = useMemo(
    () => z.object({ text: required ? z.string().trim().min(1, FORM_ERROR_MESSAGES.required) : z.string().trim() }),
    [required]
  )

  const form = useForm<{ text: string }>({ resolver: zodResolver(schema), defaultValues: { text: '' } })

  useEffect(() => {
    if (open) form.reset({ text: '' })
  }, [open, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(({ text }) => onSubmit(text))} className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required={required}>{label}</FormLabel>
                  <FormControl>
                    <Textarea rows={5} placeholder="Kiriting..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Bekor qilish
              </Button>
              <Button type="submit" variant={destructive ? 'destructive' : 'default'} loading={isPending}>
                {submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
