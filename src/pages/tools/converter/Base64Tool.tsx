import React, { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';

type TabMode = 'encode' | 'decode';

interface CopyState {
  input: boolean;
  output: boolean;
}

export const Base64Tool: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t('tools.base64.name'));

  const [tab, setTab] = useState<TabMode>('encode');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<CopyState>({ input: false, output: false });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processEncode = useCallback((text: string) => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(text)));
      setOutputText(encoded);
      setError('');
    } catch {
      setError(t('converter.base64.errorEncode'));
      setOutputText('');
    }
  }, [t]);

  const processDecode = useCallback((text: string) => {
    if (!text.trim()) {
      setOutputText('');
      setError('');
      return;
    }
    try {
      const decoded = decodeURIComponent(escape(atob(text.trim())));
      setOutputText(decoded);
      setError('');
    } catch {
      setError(t('converter.base64.errorDecode'));
      setOutputText('');
    }
  }, [t]);

  const handleInputChange = useCallback((val: string) => {
    setInputText(val);
    if (tab === 'encode') {
      processEncode(val);
    } else {
      processDecode(val);
    }
  }, [tab, processEncode, processDecode]);

  const switchTab = useCallback((newTab: TabMode) => {
    setTab(newTab);
    setInputText('');
    setOutputText('');
    setError('');
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      // result is "data:<mime>;base64,<data>"
      const base64 = result.split(',')[1] || '';
      const withMeta = `data:${file.type};base64,${base64}`;
      setInputText(`[${t('converter.base64.filePrefix')}: ${file.name}]`);
      setOutputText(withMeta);
      setError('');
    };
    reader.onerror = () => setError(t('converter.base64.errorFile'));
    reader.readAsDataURL(file);

    // reset input so same file can be selected again
    e.target.value = '';
  }, []);

  const copyText = useCallback((which: 'input' | 'output') => {
    const text = which === 'input' ? inputText : outputText;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(prev => ({ ...prev, [which]: true }));
      setTimeout(() => setCopied(prev => ({ ...prev, [which]: false })), 2000);
    });
  }, [inputText, outputText]);

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '220px',
    padding: '14px',
    background: 'var(--surface)',
    border: '2px solid var(--border)',
    borderRadius: '14px',
    color: 'var(--text)',
    fontSize: '13px',
    fontFamily: 'monospace',
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
    lineHeight: 1.6,
    transition: 'border-color 0.15s',
  };

  const copyBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '5px 14px',
    border: `2px solid ${active ? 'var(--green-border)' : 'var(--border)'}`,
    borderRadius: '999px',
    background: active ? 'var(--green-soft)' : 'var(--surface)',
    color: active ? 'var(--green)' : 'var(--muted)',
    fontSize: '12px',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'Nunito Sans, sans-serif',
    transition: 'all 0.2s',
  });

  return (
    <ToolLayout
      toolId="base64"
      category="converter"
      breadcrumbs={[
        { label: t('categories.converter'), path: '/category/converter' },
        { label: t('tools.base64.name') },
      ]}
    >
      <ToolHeader
        toolId="base64"
        category="converter"
        nameKey="tools.base64.name"
        descKey="tools.base64.desc"
      />

      <style>{`
        .b64-textarea:focus { border-color: var(--accent) !important; }
        .b64-textarea.error { border-color: #e53e3e !important; }
        .b64-tab { transition: background 0.15s, color 0.15s, border-color 0.15s; }
        .b64-tab:hover:not(.active) { border-color: var(--accent-border) !important; color: var(--accent) !important; }
        .b64-file-btn:hover { border-color: var(--accent-border) !important; color: var(--accent) !important; }
        @media (max-width: 680px) {
          .b64-panels { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {(['encode', 'decode'] as const).map(mode => (
          <button
            key={mode}
            className={`b64-tab${tab === mode ? ' active' : ''}`}
            onClick={() => switchTab(mode)}
            style={{
              padding: '9px 24px',
              border: `2px solid ${tab === mode ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: '999px',
              background: tab === mode ? 'var(--accent)' : 'var(--surface)',
              color: tab === mode ? '#fff' : 'var(--muted)',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            {mode === 'encode' ? t('converter.base64.tabEncode') : t('converter.base64.tabDecode')}
          </button>
        ))}
      </div>

      {/* Two panels */}
      <div
        className="b64-panels"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          alignItems: 'start',
        }}
      >
        {/* Input panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', color: 'var(--text)' }}>
              {tab === 'encode' ? t('converter.base64.inputLabelEncode') : t('converter.base64.inputLabelDecode')}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {tab === 'encode' && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <button
                    className="b64-file-btn"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      padding: '5px 14px',
                      border: '2px solid var(--border)',
                      borderRadius: '999px',
                      background: 'var(--surface)',
                      color: 'var(--muted)',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'Nunito Sans, sans-serif',
                      transition: 'border-color 0.15s, color 0.15s',
                    }}
                  >
                    📁 {t('converter.base64.fileBtn')}
                  </button>
                </>
              )}
              <button
                onClick={() => copyText('input')}
                style={copyBtnStyle(copied.input)}
              >
                {copied.input ? `✓ ${t('common.copied')}` : t('common.copy')}
              </button>
            </div>
          </div>
          <textarea
            className="b64-textarea"
            style={textareaStyle}
            value={inputText}
            onChange={e => handleInputChange(e.target.value)}
            placeholder={tab === 'encode' ? t('converter.base64.placeholderEncode') : t('converter.base64.placeholderDecode')}
          />
          <span style={{ fontSize: '11px', color: 'var(--muted2)' }}>
            {inputText.length.toLocaleString()} {t('converter.base64.chars')} · {inputText.split('\n').length} {t('converter.base64.lines')}
          </span>
        </div>

        {/* Output panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', color: 'var(--text)' }}>
              {tab === 'encode' ? t('converter.base64.outputLabelEncode') : t('converter.base64.outputLabelDecode')}
            </span>
            <button
              onClick={() => copyText('output')}
              style={copyBtnStyle(copied.output)}
            >
              {copied.output ? `✓ ${t('common.copied')}` : t('common.copy')}
            </button>
          </div>
          <textarea
            className={`b64-textarea${error ? ' error' : ''}`}
            style={{
              ...textareaStyle,
              background: error ? 'rgba(229,62,62,0.05)' : 'var(--surface2)',
              borderColor: error ? '#e53e3e' : 'var(--border2)',
              color: error ? '#e53e3e' : 'var(--text)',
            }}
            value={error ? '' : outputText}
            readOnly
            placeholder={error ? '' : (tab === 'encode' ? t('converter.base64.placeholderOutputEncode') : t('converter.base64.placeholderOutputDecode'))}
          />
          {error ? (
            <div
              style={{
                background: 'rgba(229,62,62,0.08)',
                border: '2px solid rgba(229,62,62,0.3)',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '13px',
                color: '#e53e3e',
                fontWeight: 600,
              }}
            >
              ⚠ {error}
            </div>
          ) : (
            <span style={{ fontSize: '11px', color: 'var(--muted2)' }}>
              {outputText.length.toLocaleString()} {t('converter.base64.chars')} · {outputText.split('\n').length} {t('converter.base64.lines')}
            </span>
          )}
        </div>
      </div>
    </ToolLayout>
  );
};
