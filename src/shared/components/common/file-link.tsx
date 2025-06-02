import { FC } from 'react';
import { buttonVariants } from '@/shared/components/ui/button.tsx';

interface Props {
  url: string;
  title?: string;
}

const FileLink: FC<Props> = ({ url, title='Yuklab olish' }) => {
  return (
    <a className={buttonVariants({ variant: 'outline' })} href={url} target={'_blank'}>
      {title}
    </a>
  );
};

export default FileLink;
