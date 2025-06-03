import { FC } from 'react';
import FileLink from '@/shared/components/common/file-link.tsx';

interface Props {
  files: { label: string; path: string }[];
}

const FilesSection: FC<Props> = ({ files }) => {
  return (
    <div className="grid grid-cols-2 gap-x-8">
      {files.map((file) => (
        <div key={file.path} className="flex justify-between items-center border-b border-b-[#E5E7EB] py-4 px-3">
          <p>{file.label}</p>
          <p className="shrink-0">
            <FileLink url={file.path} />
          </p>
        </div>
      ))}
    </div>
  );
};

export default FilesSection;
