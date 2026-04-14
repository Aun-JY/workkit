import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';

interface Options {
  trimEdges: boolean;
  collapseSpaces: boolean;
  removeEmptyLines: boolean;
  tabsToSpaces: boolean;
}

function processText(text: string, opts: Options): string {
  let result = text;

  if (opts.tabsToSpaces) {
    result = result.replace(/\t/g, '  ');
  }

  if (opts.collapseSpaces) {
    result = result
      .split('\n')
      .map(line => line.replace(/[ \t]+/g, ' '))
      .join('\n');
  }

  if (opts.trimEdges) {
    result = result
      .split('\n')
      .map(line => line.trim())
      .join('\n')
      .trim();
  }

  if (opts.removeEmptyLines) {
    result = result
      .split('\n')
      .filter(line => line.trim().length > 0)
      .join('\n');
  }

  return result;
}

export const WhitespaceRemover: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t('tools.whitespace.name'));

  const OPTION_LABELS: { key: keyof Options; label: string; desc: string }[] = [
    { key: 'trimEdges',        label: t('text.whitespace.trimEdges'),       desc: t('text.whitespace.trimEdgesDesc') },
    { key: 'collapseSpaces',   label: t('text.whitespace.collapseSpaces'),  desc: t('text.whitespace.collapseSpacesDesc') },
    { key: 'removeEmptyLines', label: t('text.whitespace.removeEmpty'),     desc: t('text.whitespace.removeEmptyDesc') },
    { key: 'tabsToSpaces',     label: t('text.whitespace.tabsToSpaces'),    desc: t('text.whitespace.tabsToSpacesDesc') },
  ];

  const [input, setInput] = useState('');
  const [options, setOptions] = useState<Options>({
    trimEdges: true,
    collapseSpaces: true,
    removeEmptyLines: false,
    tabsToSpaces: false,
  });
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => processText(input, options), [input, options]);

  const toggleOption = (key: keyof Options) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard write denied
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cleaned-text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const removedChars = input.length - output.length;

  return (
    <ToolLayout
      toolId="whitespace"
      category="text"
      breadcrumbs={[
        { label: t('categories.text'), path: '/category/text' },
        { label: t('tools.whitespace.name') },
      ]}
    >
      <ToolHeader
        toolId="whitespace"
        category="text"
        nameKey="tools.whitespace.name"
        descKey="tools.whitespace.desc"
      />

      {/* Options */}
      <div
        style={{
          background: 'var(--surface)',
          border: '2px solid var(--border)',
          borderRadius: '20px',
          padding: '20px 24px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 700,
            fontSize: '13px',
            color: 'var(--muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '14px',
          }}
        >
          {t('text.whitespace.options')}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {OPTION_LABELS.map(({ key, label, desc }) => (
            <label key={key} className="ws-option-label">
              <input
                type="checkbox"
                checked={options[key]}
                onChange={() => toggleOption(key)}
                className="ws-checkbox"
              />
              <div>
                <div
                  style={{
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 700,
                    fontSize: '14px',
                    color: 'var(--text)',
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontFamily: 'Nunito Sans, sans-serif',
                    fontSize: '12px',
                    color: 'var(--muted)',
                    marginTop: '2px',
                  }}
                >
                  {desc}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Two-column layout: input / output */}
      <div className="ws-split">
        {/* Input */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <label
            style={{
              display: 'block',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 700,
              fontSize: '13px',
              color: 'var(--muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px',
            }}
          >
            {t('text.whitespace.input')}
          </label>
          <textarea
            value={input}
            onChange={e => { setInput(e.target.value); setCopied(false); }}
            placeholder={t('text.whitespace.inputPlaceholder')}
            style={{
              width: '100%',
              minHeight: '260px',
              padding: '16px',
              border: '2px solid var(--border)',
              borderRadius: '14px',
              background: 'var(--surface)',
              color: 'var(--text)',
              fontFamily: 'Nunito Sans, sans-serif',
              fontSize: '14px',
              lineHeight: 1.7,
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            className="ws-textarea"
          />
        </div>

        {/* Output */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <label
              style={{
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 700,
                fontSize: '13px',
                color: 'var(--muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {t('text.whitespace.output')}
              {removedChars > 0 && (
                <span
                  style={{
                    marginLeft: '8px',
                    fontFamily: 'Nunito Sans, sans-serif',
                    fontSize: '11px',
                    color: 'var(--green, #22C55E)',
                    fontWeight: 600,
                    textTransform: 'none',
                  }}
                >
                  {t('text.whitespace.removedChars', { count: removedChars })}
                </span>
              )}
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleCopy}
                disabled={!output}
                className="ws-btn ws-btn-ghost"
                style={{ opacity: output ? 1 : 0.4 }}
              >
                {copied ? `✓ ${t('common.copied')}` : t('common.copy')}
              </button>
              <button
                onClick={handleDownload}
                disabled={!output}
                className="ws-btn ws-btn-accent"
                style={{ opacity: output ? 1 : 0.4 }}
              >
                {t('common.download')}
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={output}
            placeholder={input ? '' : t('text.whitespace.outputPlaceholder')}
            style={{
              width: '100%',
              minHeight: '260px',
              padding: '16px',
              border: '2px solid var(--border)',
              borderRadius: '14px',
              background: 'var(--surface2, var(--surface))',
              color: output ? 'var(--text)' : 'var(--muted)',
              fontFamily: 'Nunito Sans, sans-serif',
              fontSize: '14px',
              lineHeight: 1.7,
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
              cursor: 'default',
            }}
          />
        </div>
      </div>

      <style>{`
        .ws-split {
          display: flex;
          gap: 20px;
        }
        @media (max-width: 640px) {
          .ws-split {
            flex-direction: column;
          }
        }
        .ws-textarea:focus {
          border-color: var(--accent) !important;
        }
        .ws-option-label {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
          user-select: none;
        }
        .ws-checkbox {
          margin-top: 2px;
          width: 17px;
          height: 17px;
          accent-color: var(--accent);
          flex-shrink: 0;
          cursor: pointer;
        }
        .ws-btn {
          padding: 6px 16px;
          border-radius: 999px;
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: opacity 0.15s;
          white-space: nowrap;
        }
        .ws-btn:hover:not(:disabled) { opacity: 0.82; }
        .ws-btn:disabled { cursor: default; }
        .ws-btn-ghost {
          background: var(--surface2, var(--surface));
          color: var(--text);
          border-color: var(--border);
        }
        .ws-btn-accent {
          background: var(--accent);
          color: #fff;
          border-color: var(--accent);
        }
      `}</style>
    </ToolLayout>
  );
};
