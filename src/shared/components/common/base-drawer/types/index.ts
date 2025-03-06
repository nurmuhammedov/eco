import { ReactNode } from 'react';

type DrawerDirection = 'top' | 'bottom' | 'left' | 'right';

export interface BaseDrawerProps {
  title: string;
  open: boolean;
  asForm?: boolean;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  onClose: () => void;
  onSubmit?: () => void;
  footer?: ReactNode | null;
  showCancelButton?: boolean;
  showSubmitButton?: boolean;
  direction?: DrawerDirection;
}

export interface DrawerFooterActionsProps {
  loading?: boolean;
  disabled?: boolean;
  cancelLabel?: string;
  submitLabel?: string;
  showCancel?: boolean;
  showSubmit?: boolean;
  onCancel?: () => void;
  onSubmit?: () => void;
}
