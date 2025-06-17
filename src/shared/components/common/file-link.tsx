import { FC } from 'react';
import { buttonVariants } from '@/shared/components/ui/button.tsx';
import { FileDown } from 'lucide-react';

interface Props {
  url: string;
  title?: string;
  isSmall?: boolean;
}

const FileLink: FC<Props> = ({ url, title = 'Yuklab olish', isSmall = false }) => {
  const size = isSmall ? 'sm' : 'default';
  return (
    <a className={buttonVariants({ variant: 'info', size })} href={url} target={'_blank'}>
      <FileDown />
      {title}
    </a>
  );
};

export default FileLink;
