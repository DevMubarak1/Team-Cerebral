'use client';

import { Activity } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header
      className="glass"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 28px',
        borderBottom: '1px solid rgba(226,232,240,0.6)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <Link href="/home" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
          }}
        >
          <Activity size={20} color="white" strokeWidth={2.5} />
        </div>
        <div>
          <h1 style={{ fontSize: '17px', fontWeight: 800, lineHeight: '1.2', letterSpacing: '-0.02em' }}>HealthPay</h1>
          <p style={{ fontSize: '11px', color: '#94A3B8', lineHeight: '1.2', fontWeight: 500 }}>
            Powered by Interswitch
          </p>
        </div>
      </Link>
    </header>
  );
}
