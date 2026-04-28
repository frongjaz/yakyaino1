'use client';

import { useEffect, useRef } from 'react';

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minRows?: number;
}

export default function RichTextEditor({ value, onChange, placeholder = 'กรอกเนื้อหา...', minRows = 10 }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync external value → DOM only on mount or when value is cleared
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (el.innerHTML !== value) {
      el.innerHTML = value || '';
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val ?? undefined);
    editorRef.current?.focus();
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const handleLink = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      alert('กรุณาเลือกข้อความก่อนแนบลิงก์');
      return;
    }
    const url = prompt('กรอก URL ลิงก์:', 'https://');
    if (url) exec('createLink', url);
  };

  const ToolBtn = ({ onClick, title, children, mono }: { onClick: () => void; title: string; children: React.ReactNode; mono?: boolean }) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`h-8 min-w-[2rem] px-2 flex items-center justify-center rounded text-sm text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition select-none ${mono ? 'font-mono' : ''}`}
    >
      {children}
    </button>
  );

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1">
        <ToolBtn onClick={() => exec('bold')} title="ตัวหนา (Ctrl+B)" mono>
          <strong>B</strong>
        </ToolBtn>
        <ToolBtn onClick={() => exec('italic')} title="ตัวเอียง (Ctrl+I)" mono>
          <em>I</em>
        </ToolBtn>
        <ToolBtn onClick={() => exec('underline')} title="ขีดเส้นใต้ (Ctrl+U)" mono>
          <span className="underline">U</span>
        </ToolBtn>
        <div className="mx-1 h-5 w-px bg-gray-300" />
        <ToolBtn onClick={handleLink} title="แนบลิงก์">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </ToolBtn>
        <ToolBtn onClick={() => exec('unlink')} title="ลบลิงก์">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a3 3 0 010 4.243l-4 4a3 3 0 01-4.243 0M9.636 18.364a3 3 0 010-4.243l4-4a3 3 0 014.243 0" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
          </svg>
        </ToolBtn>
        <div className="mx-1 h-5 w-px bg-gray-300" />
        <ToolBtn onClick={() => exec('insertUnorderedList')} title="รายการหัวข้อย่อย">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </ToolBtn>
        <ToolBtn onClick={() => exec('insertOrderedList')} title="รายการหมายเลข">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </ToolBtn>
        <div className="mx-1 h-5 w-px bg-gray-300" />
        <ToolBtn onClick={() => exec('formatBlock', 'h3')} title="หัวข้อ">
          <span className="text-xs font-bold">H3</span>
        </ToolBtn>
        <ToolBtn onClick={() => exec('formatBlock', 'p')} title="ข้อความปกติ">
          <span className="text-xs">¶</span>
        </ToolBtn>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => { if (editorRef.current) onChange(editorRef.current.innerHTML); }}
        data-placeholder={placeholder}
        className="prose prose-sm max-w-none px-4 py-3 text-sm text-gray-800 focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
        style={{ minHeight: `${minRows * 1.6}rem` }}
      />
    </div>
  );
}
