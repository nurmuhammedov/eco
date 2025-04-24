// src/examples/TinyMCEEditorExample.tsx
import React, { Fragment, useLayoutEffect, useRef, useState } from 'react';
import { useTemplateContent } from '../model/use-template-content';
import { TinyMCEEditor, TinyMCEEditorRef } from '@/shared/components/common/editor';
import { Button } from '@/shared/components/ui/button';

const TinyMCEEditorExample: React.FC = () => {
  const { handleSave, initialContent } = useTemplateContent();

  useLayoutEffect(() => {
    setContent(initialContent);
  }, [initialContent]);
  const [content, setContent] = useState<string>('');

  console.log('initialContent', initialContent);

  const editorRef = useRef<TinyMCEEditorRef>(null);

  const handleEditorChange = (newContent: string) => {
    setContent(newContent);
  };

  return (
    <Fragment>
      <Button onClick={() => handleSave(content)}>Saqlash</Button>
      <TinyMCEEditor ref={editorRef} value={content} onChange={handleEditorChange} />
    </Fragment>
  );
};

export default TinyMCEEditorExample;
