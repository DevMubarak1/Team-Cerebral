'use client';

import { ReactNode } from 'react';

interface StatsCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  change: string;
  iconBg: string;
  iconShadow?: string;
}

export default function StatsCard({ icon, value, label, change, iconBg, iconShadow }: StatsCardProps) {
  const isPositive = change.startsWith('+');

  return (
    <div className="card" style={{ flex: 1, minWidth: '240px', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '14px',
            background: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: iconShadow || 'none',
          }}
        >
          {icon}
        </div>
        <div
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: isPositive ? '#10B981' : '#EF4444',
            padding: '4px 10px',
            borderRadius: '6px',
            background: isPositive ? '#ECFDF5' : '#FEF2F2',
          }}
        >
          {change}
        </div>
      </div>
      <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px', letterSpacing: '-0.03em' }}>{value}</h2>
      <p style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 500 }}>{label}</p>
    </div>
  );
}
