import React, { useRef } from 'react';
import { TinyMCEEditor, TinyMCEEditorRef } from '@/shared/components/common/editor';

interface EditTemplateFormProps {
  content: string;
  onChange: (content: string) => void;
}

export const EditTemplateContentForm: React.FC<EditTemplateFormProps> = ({ content, onChange }) => {
  const editorRef = useRef<TinyMCEEditorRef>(null);

  return <TinyMCEEditor className="!h-[calc(100vh-150px)]" ref={editorRef} value={content} onChange={onChange} />;
};
