import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'html' }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          onClick={() => setOpen(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'var(--surface)',
            border: '2px solid var(--border)',
            borderRadius: '10px',
            padding: '8px 16px',
            fontSize: '13px',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 700,
            color: 'var(--text)',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {open ? '코드 접기 ▲' : `${language.toUpperCase()} 코드 보기 ▼`}
        </button>
        <button
          onClick={handleCopy}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: copied ? '#22c55e' : 'var(--accent)',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 16px',
            fontSize: '13px',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 800,
            color: '#fff',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {copied ? '✓ 복사됨!' : '📋 코드 복사'}
        </button>
        <span style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'Nunito Sans, sans-serif' }}>
          {code.split('\n').length}줄
        </span>
      </div>

      {open && (
        <div style={{ marginTop: '10px', position: 'relative' }}>
          <pre
            style={{
              background: '#1e1e2e',
              color: '#cdd6f4',
              borderRadius: '14px',
              padding: '20px',
              overflowX: 'auto',
              fontSize: '12px',
              lineHeight: 1.65,
              fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
              border: '2px solid rgba(255,255,255,0.05)',
              maxHeight: '420px',
              overflowY: 'auto',
              margin: 0,
            }}
          >
            <code>{code}</code>
          </pre>
          <button
            onClick={handleCopy}
            style={{
              position: 'absolute', top: '12px', right: '12px',
              background: copied ? '#22c55e' : 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              padding: '5px 12px',
              fontSize: '11px',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 700,
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {copied ? '✓ 복사됨' : '복사'}
          </button>
        </div>
      )}
    </div>
  );
};
