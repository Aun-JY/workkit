import React from 'react';

interface AdSlotProps {
  type: 'horizontal' | 'square' | 'sidebar';
  adSlot?: string;
}

const DIMENSIONS: Record<AdSlotProps['type'], { w: number; h: number; label: string }> = {
  horizontal: { w: 728, h: 90,  label: 'Advertisement 728×90' },
  square:     { w: 300, h: 250, label: 'Advertisement 300×250' },
  sidebar:    { w: 160, h: 600, label: 'Advertisement 160×600' },
};

export const AdSlot: React.FC<AdSlotProps> = ({ type }) => {
  const { w, h, label } = DIMENSIONS[type];
  const enableAds = import.meta.env.VITE_ENABLE_ADS === 'true';

  if (enableAds) {
    return (
      <div style={{ width: w, maxWidth: '100%', height: h, overflow: 'hidden' }}>
        {/* Google AdSense slot would go here */}
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: w,
        height: h,
        border: '2px dashed var(--border2)',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--muted2)',
        fontSize: '12px',
        fontFamily: 'Nunito Sans, sans-serif',
        background: 'var(--surface2)',
        margin: '0 auto',
      }}
    >
      {label}
    </div>
  );
};
