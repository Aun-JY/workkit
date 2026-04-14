import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';

type TabType = 'url' | 'text' | 'wifi' | 'vcard';

export const QRGenerator: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t('tools.qrGenerator.name'));

  const [tab, setTab] = useState<TabType>('url');
  const [urlValue, setUrlValue] = useState('https://example.com');
  const [textValue, setTextValue] = useState('');
  const [fgColor, setFgColor] = useState('#2D1F0E');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [size, setSize] = useState(256);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [wifiType, setWifiType] = useState('WPA');
  const [vcardName, setVcardName] = useState('');
  const [vcardPhone, setVcardPhone] = useState('');
  const [vcardEmail, setVcardEmail] = useState('');

  const getContent = (): string => {
    switch (tab) {
      case 'url':   return urlValue;
      case 'text':  return textValue;
      case 'wifi':  return `WIFI:T:${wifiType};S:${wifiSsid};P:${wifiPass};;`;
      case 'vcard': return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardName}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nEND:VCARD`;
      default:      return '';
    }
  };

  const generateQR = async () => {
    const content = getContent();
    if (!content.trim()) return;
    setLoading(true);
    setError('');
    try {
      // Dynamic import of qrcode
      const QRCode = await import('qrcode');
      const url = await QRCode.default.toDataURL(content, {
        width: size,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: 'M',
      });
      setQrDataUrl(url);
    } catch {
      setError(t('converter.qrGenerator.errorGenerate'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { generateQR(); }, [tab, size, fgColor, bgColor]);

  const downloadPng = () => {
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'qrcode.png';
    a.click();
  };

  const TABS: { key: TabType; label: string; icon: string }[] = [
    { key: 'url',   label: 'URL',    icon: '🔗' },
    { key: 'text',  label: t('converter.qrGenerator.tabText'), icon: '📝' },
    { key: 'wifi',  label: 'WiFi',   icon: '📶' },
    { key: 'vcard', label: 'vCard',  icon: '👤' },
  ];

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '10px',
    padding: '9px 12px', fontSize: '14px', color: 'var(--text)', outline: 'none',
    fontFamily: 'Nunito Sans, sans-serif', marginBottom: '10px',
  };

  return (
    <ToolLayout toolId="qr-generator" category="converter"
      breadcrumbs={[{ label: t('categories.converter'), path: '/category/converter' }, { label: t('tools.qrGenerator.name') }]}>
      <ToolHeader toolId="qr-generator" category="converter" nameKey="tools.qrGenerator.name" descKey="tools.qrGenerator.desc" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px' }} className="qr-layout">
        {/* Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', background: 'var(--surface2)', borderRadius: '14px', padding: '4px' }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                style={{ flex: 1, background: tab === t.key ? 'var(--surface)' : 'transparent', border: tab === t.key ? '2px solid var(--border)' : '2px solid transparent', borderRadius: '10px', padding: '8px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', cursor: 'pointer', color: tab === t.key ? 'var(--accent)' : 'var(--muted)', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <span>{t.icon}</span>
                <span style={{ fontSize: '11px' }}>{t.label}</span>
              </button>
            ))}
          </div>

          <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '20px' }}>
            {tab === 'url' && (
              <>
                <label style={{ display: 'block', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)', marginBottom: '6px' }}>URL</label>
                <input value={urlValue} onChange={e => setUrlValue(e.target.value)} onBlur={generateQR} placeholder="https://example.com" style={inputStyle} />
              </>
            )}
            {tab === 'text' && (
              <>
                <label style={{ display: 'block', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)', marginBottom: '6px' }}>{t('converter.qrGenerator.tabText')}</label>
                <textarea value={textValue} onChange={e => setTextValue(e.target.value)} onBlur={generateQR} placeholder={t('converter.qrGenerator.placeholderText')}
                  style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} />
              </>
            )}
            {tab === 'wifi' && (
              <>
                <input value={wifiSsid} onChange={e => setWifiSsid(e.target.value)} onBlur={generateQR} placeholder={t('converter.qrGenerator.placeholderSsid')} style={inputStyle} />
                <input type="password" value={wifiPass} onChange={e => setWifiPass(e.target.value)} onBlur={generateQR} placeholder={t('converter.qrGenerator.placeholderPassword')} style={inputStyle} />
                <select value={wifiType} onChange={e => { setWifiType(e.target.value); generateQR(); }}
                  style={{ ...inputStyle, marginBottom: 0 }}>
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">{t('converter.qrGenerator.wifiNoPass')}</option>
                </select>
              </>
            )}
            {tab === 'vcard' && (
              <>
                <input value={vcardName} onChange={e => setVcardName(e.target.value)} onBlur={generateQR} placeholder={t('converter.qrGenerator.placeholderName')} style={inputStyle} />
                <input value={vcardPhone} onChange={e => setVcardPhone(e.target.value)} onBlur={generateQR} placeholder={t('converter.qrGenerator.placeholderPhone')} style={inputStyle} />
                <input value={vcardEmail} onChange={e => setVcardEmail(e.target.value)} onBlur={generateQR} placeholder={t('converter.qrGenerator.placeholderEmail')} style={{ ...inputStyle, marginBottom: 0 }} />
              </>
            )}

            <button onClick={generateQR} style={{ marginTop: '14px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '999px', padding: '10px 24px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer', width: '100%' }}>
              {t('converter.qrGenerator.generate')}
            </button>
          </div>

          {/* Customize */}
          <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', color: 'var(--text)' }}>{t('converter.qrGenerator.customize')}</div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>{t('converter.qrGenerator.fgColor')}</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
                  <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} style={{ width: '36px', height: '36px', borderRadius: '8px', border: '2px solid var(--border)', cursor: 'pointer', padding: '2px' }} />
                  <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--muted)' }}>{fgColor}</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>{t('converter.qrGenerator.bgColor')}</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
                  <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ width: '36px', height: '36px', borderRadius: '8px', border: '2px solid var(--border)', cursor: 'pointer', padding: '2px' }} />
                  <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--muted)' }}>{bgColor}</span>
                </div>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>{t('converter.qrGenerator.size')}</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                {[128, 256, 512].map(s => (
                  <button key={s} onClick={() => setSize(s)}
                    style={{ background: size === s ? 'var(--accent)' : 'var(--surface2)', color: size === s ? '#fff' : 'var(--text)', border: `2px solid ${size === s ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '999px', padding: '5px 14px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
                    {s}px
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
          <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            {loading ? (
              <div style={{ width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '32px' }}>⏳</div>
            ) : qrDataUrl ? (
              <img src={qrDataUrl} alt="QR Code" style={{ maxWidth: '100%', borderRadius: '8px' }} />
            ) : (
              <div style={{ width: '200px', height: '200px', background: 'var(--surface2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '14px' }}>{t('converter.qrGenerator.preview')}</div>
            )}
          </div>
          {error && <div style={{ color: '#EF4444', fontSize: '13px' }}>{error}</div>}
          {qrDataUrl && (
            <button onClick={downloadPng} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '999px', padding: '11px 28px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer', width: '100%' }}>
              📥 {t('converter.qrGenerator.downloadPng')}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) { .qr-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </ToolLayout>
  );
};
