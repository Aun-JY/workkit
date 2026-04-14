import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';

const syntaxHighlight = (json: string): string => {
  return json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        let cls = 'json-number';
        if (/^"/.test(match)) {
          cls = /:$/.test(match) ? 'json-key' : 'json-string';
        } else if (/true|false/.test(match)) {
          cls = 'json-bool';
        } else if (/null/.test(match)) {
          cls = 'json-null';
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
};

export const JsonFormatter: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t('tools.jsonFormatter.name'));

  const [input, setInput]   = useState('');
  const [output, setOutput] = useState('');
  const [error, setError]   = useState('');
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);
  const [highlighted, setHighlighted] = useState('');

  const process = useCallback((mode: 'format' | 'minify' | 'validate') => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      if (mode === 'validate') {
        setOutput('✅ Valid JSON');
        setHighlighted('');
        return;
      }
      const result = mode === 'minify'
        ? JSON.stringify(parsed)
        : JSON.stringify(parsed, null, indent);
      setOutput(result);
      setHighlighted(syntaxHighlight(result));
      setCopied(false);
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
      setHighlighted('');
    }
  }, [input, indent]);

  const copyOutput = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const lineCount = (s: string) => s.split('\n').length;

  return (
    <ToolLayout toolId="json-formatter" category="dev"
      breadcrumbs={[{ label: t('categories.dev'), path: '/category/dev' }, { label: t('tools.jsonFormatter.name') }]}>
      <ToolHeader toolId="json-formatter" category="dev" nameKey="tools.jsonFormatter.name" descKey="tools.jsonFormatter.desc" />

      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => process('format')} className="json-btn json-btn-primary">✨ Format</button>
        <button onClick={() => process('minify')} className="json-btn json-btn-secondary">⚡ Minify</button>
        <button onClick={() => process('validate')} className="json-btn json-btn-secondary">✅ Validate</button>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>{t('dev.jsonFormatter.indent')}</span>
          <select value={indent} onChange={e => setIndent(Number(e.target.value))}
            style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '10px', padding: '6px 10px', fontSize: '13px', color: 'var(--text)', outline: 'none' }}>
            <option value={2}>{t('dev.jsonFormatter.indent2')}</option>
            <option value={4}>{t('dev.jsonFormatter.indent4')}</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: '#FEF2F2', border: '2px solid #FECACA', borderRadius: '12px', padding: '12px 16px', color: '#EF4444', fontSize: '13px', marginBottom: '16px', fontFamily: 'monospace' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="json-panels">
        {/* Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)' }}>Input</span>
            <span style={{ fontSize: '11px', color: 'var(--muted2)' }}>{input.length} chars · {lineCount(input)} lines</span>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            style={{
              background: 'var(--surface)',
              border: `2px solid ${error ? '#FECACA' : 'var(--border)'}`,
              borderRadius: '14px',
              padding: '14px',
              fontSize: '13px',
              fontFamily: 'monospace',
              color: 'var(--text)',
              minHeight: '380px',
              resize: 'vertical',
              outline: 'none',
              transition: 'border-color 0.2s',
              lineHeight: 1.6,
            }}
            onFocus={e => { if (!error) e.target.style.borderColor = 'var(--accent)'; }}
            onBlur={e => { if (!error) e.target.style.borderColor = 'var(--border)'; }}
          />
          <button onClick={() => setInput('')}
            style={{ alignSelf: 'flex-start', background: 'none', border: '2px solid var(--border)', borderRadius: '999px', padding: '5px 14px', fontSize: '12px', fontWeight: 700, color: 'var(--muted)', cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
            Clear
          </button>
        </div>

        {/* Output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)' }}>Output</span>
            {output && <span style={{ fontSize: '11px', color: 'var(--muted2)' }}>{output.length} chars · {lineCount(output)} lines</span>}
          </div>
          {highlighted ? (
            <pre
              dangerouslySetInnerHTML={{ __html: highlighted }}
              style={{
                background: 'var(--surface)',
                border: '2px solid var(--border)',
                borderRadius: '14px',
                padding: '14px',
                fontSize: '13px',
                fontFamily: 'monospace',
                minHeight: '380px',
                overflow: 'auto',
                margin: 0,
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}
            />
          ) : (
            <div style={{ background: 'var(--surface2)', border: '2px dashed var(--border)', borderRadius: '14px', minHeight: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted2)', fontSize: '14px' }}>
              {output || t('dev.jsonFormatter.placeholder')}
            </div>
          )}
          {output && (
            <button onClick={copyOutput}
              style={{ alignSelf: 'flex-start', background: copied ? 'var(--green)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: '999px', padding: '6px 18px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', transition: 'background 0.2s' }}>
              {copied ? `✓ ${t('common.copied')}` : `📋 ${t('common.copy')}`}
            </button>
          )}
        </div>
      </div>

      <style>{`
        .json-btn {
          border-radius: 999px;
          padding: 9px 20px;
          font-family: Nunito, sans-serif;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 2px solid;
        }
        .json-btn-primary {
          background: var(--accent);
          color: #fff;
          border-color: var(--accent);
        }
        .json-btn-primary:hover { opacity: 0.88; }
        .json-btn-secondary {
          background: var(--surface);
          color: var(--text);
          border-color: var(--border);
        }
        .json-btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
        .json-key    { color: var(--blue, #2563EB); font-weight: 700; }
        .json-string { color: var(--green, #16A34A); }
        .json-number { color: var(--accent); }
        .json-bool   { color: var(--accent); font-style: italic; }
        .json-null   { color: var(--muted); font-style: italic; }
        @media (max-width: 640px) { .json-panels { grid-template-columns: 1fr !important; } }
      `}</style>
    </ToolLayout>
  );
};
