import React, { Fragment } from 'react';
import { Loader } from '@/shared/components/common';
import { EditTemplateContentActions } from '../ui/edit-template-actions';
import { EditTemplateContentForm } from '../ui/edit-template-content-form';
import { useEditTemplateContent } from '../model/use-edit-template-content';

export const EditTemplateContent: React.FC = () => {
  const { content, setContent, handleSave, isLoading } = useEditTemplateContent();

  if (isLoading) {
    return <Loader isVisible />;
  }

  return (
    <Fragment>
      <EditTemplateContentActions onSave={handleSave} />
      <EditTemplateContentForm content={content} onChange={setContent} />
    </Fragment>
  );
};
