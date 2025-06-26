// src/features/application/application-detail/ui/parts/files-section.tsx

import { ApplicationStatus } from '@/entities/application';
import { UserRoles } from '@/entities/user';
import FileLink from '@/shared/components/common/file-link.tsx';
import { FC } from 'react';
import { UpdateFileModal } from '../modals/update-file-modal';

interface Props {
  files: { label: string; path: string; fieldName: string }[];
  userRole?: UserRoles;
  applicationStatus?: ApplicationStatus;
  appealId?: string;
  edit?: boolean;
}

const FilesSection: FC<Props> = ({ files, userRole, applicationStatus, appealId, edit }) => {
  const canEdit = userRole === UserRoles.INSPECTOR && applicationStatus === ApplicationStatus.IN_PROCESS && edit;

  return (
    <div className="grid grid-cols-2 gap-x-8">
      {files.map((file) => (
        <div key={file.path} className="flex justify-between items-center border-b border-b-[#E5E7EB] py-4 px-3">
          <p>{file.label}</p>
          <div className="flex items-center gap-2">
            {file.path ? <FileLink url={file.path} /> : <span className="text-red-600">Mavjud emas</span>}
            {canEdit && <UpdateFileModal appealId={appealId} fieldName={file.fieldName} />}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilesSection;
