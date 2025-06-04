import { FC } from 'react';
import { buttonVariants } from '@/shared/components/ui/button.tsx';
import { FileDown } from 'lucide-react';

interface Props {
  url: string;
  title?: string;
}

const FileLink: FC<Props> = ({ url, title = 'Yuklab olish' }) => {
  return (
    <a className={buttonVariants({ variant: 'info' })} href={url} target={'_blank'}>
      <FileDown />
      {title}
    </a>
  );
};

export default FileLink;
