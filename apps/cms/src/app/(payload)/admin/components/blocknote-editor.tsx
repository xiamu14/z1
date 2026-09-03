'use client';

import type { PartialBlock } from '@blocknote/core';
import { BlockNoteViewRaw, useCreateBlockNote } from '@blocknote/react';
import { useField, withCondition } from '@payloadcms/ui';
import type { JSONFieldClientComponent } from 'payload';
import { useCallback, useMemo } from 'react';

const emptyDocument = [
  {
    type: 'paragraph',
    content: '',
  },
] satisfies PartialBlock[];

const BlockNoteEditorComponent: JSONFieldClientComponent = (props) => {
  const { path, readOnly } = props;
  const { setValue, value } = useField<unknown[]>({
    path,
  });

  const initialContent = useMemo(() => {
    if (Array.isArray(value) && value.length > 0) {
      return value as PartialBlock[];
    }

    return emptyDocument;
  }, [value]);

  const uploadFile = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt', file.name);

    const response = await fetch('/api/media', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    const media = (await response.json()) as { doc?: { url?: string | null } };
    const url = media.doc?.url;

    if (!url) {
      throw new Error('Upload response missing url');
    }

    return url;
  }, []);

  const editor = useCreateBlockNote(
    {
      initialContent,
      uploadFile,
    },
    [initialContent, uploadFile],
  );

  const handleChange = useCallback(() => {
    setValue(editor.document);
  }, [editor, setValue]);

  return (
    <div className="blocknote-field">
      <div className="blocknote-field__editor">
        <BlockNoteViewRaw
          editor={editor}
          editable={!readOnly}
          onChange={handleChange}
          theme="light"
        />
      </div>
    </div>
  );
};

export const BlockNoteEditor = withCondition(BlockNoteEditorComponent);
