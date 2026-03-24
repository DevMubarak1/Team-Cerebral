'use client';

import { Trash2 } from 'lucide-react';

interface ServiceCardProps {
  name: string;
  category: string;
  description: string;
  duration: string;
  price: number;
  onDelete?: () => void;
}

export default function ServiceCard({ name, category, description, duration, price, onDelete }: ServiceCardProps) {
  const getCategoryStyle = (cat: string) => {
    const lc = cat.toLowerCase();
    if (lc === 'laboratory') return { bg: '#EFF6FF', color: '#2563EB' };
    if (lc === 'dental') return { bg: '#ECFDF5', color: '#059669' };
    if (lc === 'radiology') return { bg: '#F5F3FF', color: '#7C3AED' };
    if (lc === 'pharmacy') return { bg: '#FFF7ED', color: '#D97706' };
    return { bg: '#EFF6FF', color: '#2563EB' };
  };

  const catStyle = getCategoryStyle(category);

  return (
    <div className="card" style={{ padding: '24px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px', letterSpacing: '-0.01em' }}>{name}</h3>
          <span style={{
            display: 'inline-block', padding: '4px 12px', borderRadius: '8px',
            fontSize: '12px', fontWeight: 600, background: catStyle.bg, color: catStyle.color,
          }}>
            {category}
          </span>
        </div>
        {onDelete && (
          <button onClick={onDelete}
            style={{
              background: '#FEF2F2', border: 'none', cursor: 'pointer', color: '#EF4444',
              padding: '8px', borderRadius: '8px', transition: 'all 0.2s', display: 'flex',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#FEE2E2'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#FEF2F2'; }}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <p style={{ fontSize: '14px', color: '#64748B', margin: '14px 0', lineHeight: 1.6 }}>{description}</p>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: '14px', borderTop: '1px solid #F1F5F9',
      }}>
        <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 500 }}>⏱ {duration}</span>
        <span style={{ fontSize: '20px', fontWeight: 800, color: '#10B981', letterSpacing: '-0.02em' }}>
          ₦{price.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
