// src/features/application/application-detail/ui/parts/files-section.tsx

import { ApplicationStatus } from '@/entities/application';
import { UserRoles } from '@/entities/user';
import FileLink from '@/shared/components/common/file-link.tsx';
import { FC } from 'react';
import { UpdateFileModal } from '../modals/update-file-modal';
import FileEditModal from '@/features/register/modals/file-edit-modal';
import { getDate } from '@/shared/utils/date';

type FileType = {
  label: string;
  data: {
    path: string;
    number: string;
    uploadDate: string;
    expiryDate: string;
  };
  fieldName: string;
};

interface Props {
  files: FileType[];
  userRole?: UserRoles;
  applicationStatus?: ApplicationStatus;
  appealId?: string;
  register?: boolean;
  url?: string;
  edit?: boolean;
}

const FilesSection: FC<Props> = ({ files, register = false, url, userRole, applicationStatus, appealId, edit }) => {
  const canEdit = userRole === UserRoles.INSPECTOR && applicationStatus === ApplicationStatus.IN_PROCESS && edit;
  const canInspectorEdit = userRole === UserRoles.INSPECTOR && register && !appealId;

  const showFileData = (file: FileType) => {
    if (!file.data.path && !file.data.number && !file.data.uploadDate && !file.data.expiryDate) {
      return <span className="text-red-600">Mavjud emas</span>;
    } else {
      return (
        <div className={'flex-col'}>
          {file.data?.path && <FileLink url={file.data.path} className={'mb-1'} />}
          {file.data?.expiryDate && (
            <div className={'mr-1 text-xs text-gray-400 text-nowrap mb-1'}>
              Amal qilish muddati: {getDate(file.data.expiryDate)}
            </div>
          )}
          {file.data?.number && (
            <div className={'text-xs text-gray-400 text-nowrap mb-1'}>Raqam: {file.data.number}</div>
          )}
          {file.data?.uploadDate && (
            <div className={'text-xs text-gray-400 text-nowrap'}>Yuklash sanasi: {getDate(file.data.uploadDate)}</div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="grid grid-cols-2 gap-x-8">
      {files.map((file) => (
        <div key={file.label} className="flex justify-between items-center border-b border-b-[#E5E7EB] py-4 px-3">
          <p className={'pr-5'}>{file.label}</p>
          <div className="flex items-center gap-2">
            {canInspectorEdit ? <FileEditModal url={url} fieldName={file.fieldName} /> : showFileData(file)}
            {canEdit && <UpdateFileModal appealId={appealId} fieldName={file.fieldName} />}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilesSection;
