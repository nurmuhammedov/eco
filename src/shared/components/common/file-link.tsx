import { FC } from 'react';
import { buttonVariants } from '@/shared/components/ui/button.tsx';
import { FileDown } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
  url: string;
  title?: string;
  isSmall?: boolean;
  className?: string;
}

const FileLink: FC<Props> = ({ url, title = 'Yuklab olish', isSmall = false, className }) => {
  const size = isSmall ? 'sm' : 'default';
  return (
    <a className={clsx(buttonVariants({ variant: 'info', size }), className)} href={url} target={'_blank'}>
      <FileDown />
      {title}
    </a>
  );
};

export default FileLink;
