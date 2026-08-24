'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

/**
 * One scale instead of the seven ad-hoc widths this codebase had grown
 * (425, 500, 525, 625, 725, 800, 5xl). Pick by what the dialog holds, not by
 * eye: a confirmation is sm, a short form md, a full form lg, a table or a map
 * xl.
 */
const DIALOG_SIZES = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
  full: 'sm:max-w-[95vw]',
} as const

const isSlot = (node: React.ReactNode, slot: React.ElementType) => React.isValidElement(node) && node.type === slot

/**
 * The dialog splits itself into a header, a scrolling body and a footer.
 *
 * Sixty-three modals drop their content straight into DialogContent, so there
 * is no body wrapper to key off - the children are sorted here instead. That
 * keeps the title and the actions pinned while only the middle moves, without
 * touching a single one of those files.
 */
const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    size?: keyof typeof DIALOG_SIZES
  }
>(({ className, children, size = 'md', 'aria-describedby': describedBy, ...props }, ref) => {
  const items = React.Children.toArray(children)
  const header = items.find((item) => isSlot(item, DialogHeader))
  const footer = items.find((item) => isSlot(item, DialogFooter))
  const body = items.filter((item) => item !== header && item !== footer)

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        /**
         * Radix points this at a DialogDescription it assumes exists. Only three
         * of the dialogs here render one, so the rest advertised an element that
         * is not on the page. Passing the prop through - undefined when nobody
         * set it - overrides that default.
         */
        aria-describedby={describedBy}
        className={cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 translate-x-[-50%] translate-y-[-50%] border shadow-lg duration-200 sm:rounded-lg',
          // Always short of the screen edges, so the dialog reads as a layer over
          // the page rather than a second page.
          'flex max-h-[calc(100dvh-4rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] flex-col overflow-hidden p-0',
          DIALOG_SIZES[size],
          className
        )}
        {...props}
      >
        {header}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">{body}</div>
        {footer && React.isValidElement(footer)
          ? React.cloneElement(footer as React.ReactElement<any>, { 'data-pinned': '' })
          : footer}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
})
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  hideClose = false,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hideClose?: boolean }) => (
  <div
    className={cn(
      // pr-14 keeps a long title clear of the close button.
      'bg-background relative flex shrink-0 flex-col space-y-1.5 border-b py-4 pr-14 pl-6 text-left',
      className
    )}
    {...props}
  >
    {children}
    {!hideClose && (
      <DialogPrimitive.Close className="ring-offset-background absolute top-3.5 right-4 flex size-8 cursor-pointer items-center justify-center rounded-full text-gray-900/80 transition-colors hover:bg-gray-900/10 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:outline-hidden">
        <X className="h-4 w-4 stroke-[2.5]" />
        <span className="sr-only">Yopish</span>
      </DialogPrimitive.Close>
    )}
  </div>
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'bg-background flex shrink-0 flex-col-reverse gap-2 border-t px-6 py-4 sm:flex-row sm:justify-end',
      /**
       * A footer nested in the dialog's <form> is not a direct child, so it
       * rides inside the scrolling body. The offsets cancel that body's
       * padding - without them it floats an inch above the true bottom and
       * content shows through the gap underneath.
       */
      'sticky -bottom-4 z-10 -mx-6 -mb-4',
      // Rendered in the pinned slot instead, it needs none of that.
      'data-[pinned]:static data-[pinned]:m-0',
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg leading-none font-semibold tracking-tight', className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn('text-muted-foreground text-sm', className)} {...props} />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
