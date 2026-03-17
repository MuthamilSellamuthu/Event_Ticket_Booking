import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRCodeGenerator = ({ data, size = 200 }) => {
  if (!data) return null;

  return (
    <div style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
    }}>
      <div style={{
        background: '#ffffff',
        padding: 16,
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        <QRCodeSVG
          value={data}
          size={size}
          bgColor="#ffffff"
          fgColor="#1a1a2e"
          level="H"
          includeMargin={false}
        />
      </div>
      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        Scan at the venue for entry
      </p>
    </div>
  );
};

export default QRCodeGenerator;
