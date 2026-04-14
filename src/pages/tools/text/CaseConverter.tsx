import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';

type CaseType =
  | 'upper'
  | 'lower'
  | 'title'
  | 'sentence'
  | 'camel'
  | 'snake'
  | 'kebab'
  | 'pascal';

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/(?:^|\s)\S/g, c => c.toUpperCase());
}

function toSentenceCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
}

function toCamelCase(str: string): string {
  const words = str
    .replace(/[^a-zA-Z0-9가-힣\s]/g, ' ')
    .trim()
    .split(/\s+/);
  return words
    .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join('');
}

function toSnakeCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9가-힣\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .join('_')
    .toLowerCase();
}

function toKebabCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9가-힣\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .join('-')
    .toLowerCase();
}

function toPascalCase(str: string): string {
  const words = str
    .replace(/[^a-zA-Z0-9가-힣\s]/g, ' ')
    .trim()
    .split(/\s+/);
  return words
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

function convert(text: string, caseType: CaseType): string {
  switch (caseType) {
    case 'upper':    return text.toUpperCase();
    case 'lower':    return text.toLowerCase();
    case 'title':    return toTitleCase(text);
    case 'sentence': return toSentenceCase(text);
    case 'camel':    return toCamelCase(text);
    case 'snake':    return toSnakeCase(text);
    case 'kebab':    return toKebabCase(text);
    case 'pascal':   return toPascalCase(text);
    default:         return text;
  }
}

const CASE_BUTTONS: { type: CaseType; label: string; example: string }[] = [
  { type: 'upper',    label: 'UPPERCASE',     example: 'HELLO WORLD' },
  { type: 'lower',    label: 'lowercase',     example: 'hello world' },
  { type: 'title',    label: 'Title Case',    example: 'Hello World' },
  { type: 'sentence', label: 'Sentence case', example: 'Hello world' },
  { type: 'camel',    label: 'camelCase',     example: 'helloWorld' },
  { type: 'snake',    label: 'snake_case',    example: 'hello_world' },
  { type: 'kebab',    label: 'kebab-case',    example: 'hello-world' },
  { type: 'pascal',   label: 'PascalCase',    example: 'HelloWorld' },
];

export const CaseConverter: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t('tools.caseConverter.name'));

  const [input, setInput] = useState('');
  const [activeCase, setActiveCase] = useState<CaseType | null>(null);
  const [copied, setCopied] = useState(false);

  const output = activeCase ? convert(input, activeCase) : '';

  const handleSelect = (caseType: CaseType) => {
    setActiveCase(caseType);
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

  return (
    <ToolLayout
      toolId="case-converter"
      category="text"
      breadcrumbs={[
        { label: t('categories.text'), path: '/category/text' },
        { label: t('tools.caseConverter.name') },
      ]}
    >
      <ToolHeader
        toolId="case-converter"
        category="text"
        nameKey="tools.caseConverter.name"
        descKey="tools.caseConverter.desc"
      />

      {/* Input area */}
      <div style={{ marginBottom: '20px' }}>
        <label
          style={{
            display: 'block',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 700,
            fontSize: '13px',
            color: 'var(--muted)',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {t('text.caseConverter.inputLabel')}
        </label>
        <textarea
          value={input}
          onChange={e => { setInput(e.target.value); setCopied(false); }}
          placeholder={t('text.caseConverter.placeholder')}
          style={{
            width: '100%',
            minHeight: '160px',
            padding: '16px',
            border: '2px solid var(--border)',
            borderRadius: '14px',
            background: 'var(--surface)',
            color: 'var(--text)',
            fontFamily: 'Nunito Sans, sans-serif',
            fontSize: '15px',
            lineHeight: 1.7,
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          className="cc-textarea"
        />
      </div>

      {/* Case buttons grid */}
      <div
        style={{ marginBottom: '20px' }}
      >
        <label
          style={{
            display: 'block',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 700,
            fontSize: '13px',
            color: 'var(--muted)',
            marginBottom: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {t('text.caseConverter.selectMode')}
        </label>
        <div className="cc-btn-grid">
          {CASE_BUTTONS.map(btn => (
            <button
              key={btn.type}
              onClick={() => handleSelect(btn.type)}
              className={`cc-case-btn${activeCase === btn.type ? ' cc-case-btn--active' : ''}`}
            >
              <span className="cc-case-btn-label">{btn.label}</span>
              <span className="cc-case-btn-example">{btn.example}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Output area */}
      <div>
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
            {t('text.caseConverter.outputLabel')}
          </label>
          <button
            onClick={handleCopy}
            disabled={!output}
            className="cc-copy-btn"
            style={{ opacity: output ? 1 : 0.4 }}
          >
            {copied ? `✓ ${t('common.copied')}` : t('common.copy')}
          </button>
        </div>
        <textarea
          readOnly
          value={output}
          placeholder={activeCase ? '' : t('text.caseConverter.outputPlaceholder')}
          style={{
            width: '100%',
            minHeight: '160px',
            padding: '16px',
            border: '2px solid var(--border)',
            borderRadius: '14px',
            background: 'var(--surface2, var(--surface))',
            color: output ? 'var(--text)' : 'var(--muted)',
            fontFamily: 'Nunito Sans, sans-serif',
            fontSize: '15px',
            lineHeight: 1.7,
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box',
            cursor: 'default',
          }}
        />
      </div>

      <style>{`
        .cc-textarea:focus {
          border-color: var(--accent) !important;
        }
        .cc-btn-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }
        @media (max-width: 600px) {
          .cc-btn-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .cc-case-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 3px;
          padding: 12px 14px;
          border: 2px solid var(--border);
          border-radius: 14px;
          background: var(--surface);
          color: var(--text);
          cursor: pointer;
          text-align: left;
          transition: border-color 0.15s, background 0.15s;
        }
        .cc-case-btn:hover {
          border-color: var(--accent-border, var(--accent));
          background: var(--accent-soft, rgba(255,107,43,0.06));
        }
        .cc-case-btn--active {
          border-color: var(--accent) !important;
          background: var(--accent-soft, rgba(255,107,43,0.08)) !important;
        }
        .cc-case-btn-label {
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: 13px;
          color: var(--text);
        }
        .cc-case-btn--active .cc-case-btn-label {
          color: var(--accent);
        }
        .cc-case-btn-example {
          font-family: 'Nunito Sans', sans-serif;
          font-size: 11px;
          color: var(--muted);
        }
        .cc-copy-btn {
          padding: 6px 18px;
          border-radius: 999px;
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          border: 2px solid var(--accent);
          background: var(--accent);
          color: #fff;
          transition: opacity 0.15s;
        }
        .cc-copy-btn:hover:not(:disabled) { opacity: 0.85; }
        .cc-copy-btn:disabled { cursor: default; }
      `}</style>
    </ToolLayout>
  );
};
