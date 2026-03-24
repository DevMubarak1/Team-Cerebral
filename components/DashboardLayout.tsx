'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, CalendarDays, Receipt, Stethoscope,
  Users, Settings, LogOut, Menu, X, ChevronRight,
} from 'lucide-react';
import Image from 'next/image';

const navItems = [
  { label: 'Overview', href: '/provider/dashboard/overview', icon: LayoutDashboard },
  { label: 'Appointments', href: '/provider/dashboard/appointments', icon: CalendarDays },
  { label: 'Transactions', href: '/provider/dashboard/transactions', icon: Receipt },
  { label: 'Services', href: '/provider/dashboard/services', icon: Stethoscope },
  { label: 'Patients', href: '/provider/dashboard/patients', icon: Users },
  { label: 'Settings', href: '/provider/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [providerName, setProviderName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('providerName');
    setProviderName(name || 'Provider');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('providerId');
    localStorage.removeItem('providerName');
    router.push('/home');
  };

  const isActive = (href: string) => pathname === href || (href === '/provider/dashboard/overview' && pathname === '/provider/dashboard');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)',
            backdropFilter: 'blur(4px)', zIndex: 45,
          }}
          className="lg-hide"
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: '260px', background: '#0F172A', display: 'flex', flexDirection: 'column',
          position: 'fixed', top: 0, bottom: 0, left: sidebarOpen ? 0 : '-260px',
          zIndex: 50, transition: 'left 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
        className="sidebar"
      >
        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Image src="/favicon.png" alt="HealthPay" width={36} height={36} style={{ borderRadius: '10px' }} />
            <div>
              <h1 style={{ fontSize: '16px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>HealthPay</h1>
              <p style={{ fontSize: '11px', color: '#475569', fontWeight: 500 }}>Provider Portal</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg-hide"
            style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', display: 'flex' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => { router.push(item.href); setSidebarOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 14px', borderRadius: '10px', border: 'none',
                  background: active ? 'rgba(16,185,129,0.1)' : 'transparent',
                  color: active ? '#10B981' : '#94A3B8',
                  fontSize: '14px', fontWeight: active ? 600 : 500,
                  cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  transition: 'all 0.2s', width: '100%', textAlign: 'left',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon size={18} />
                {item.label}
                {active && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
            borderRadius: '10px', background: 'rgba(255,255,255,0.04)', marginBottom: '8px',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '8px',
              background: 'linear-gradient(135deg, #10B981, #059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: 700, color: 'white',
            }}>
              {providerName.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{providerName}</p>
              <p style={{ fontSize: '11px', color: '#475569' }}>Healthcare Provider</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 14px', borderRadius: '10px', border: 'none',
              background: 'transparent', color: '#EF4444',
              fontSize: '13px', fontWeight: 500, cursor: 'pointer',
              fontFamily: 'var(--font-sans)', width: '100%', textAlign: 'left',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content" style={{ flex: 1, minWidth: 0 }}>
        {/* Top bar */}
        <header className="glass" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 24px', borderBottom: '1px solid rgba(226,232,240,0.6)',
          position: 'sticky', top: 0, zIndex: 40, height: '60px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              className="lg-hide"
              onClick={() => setSidebarOpen(true)}
              style={{
                background: '#F1F5F9', border: 'none', cursor: 'pointer',
                display: 'flex', padding: '8px', borderRadius: '8px',
              }}
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.02em' }}>
                {navItems.find((n) => isActive(n.href))?.label || 'Dashboard'}
              </h2>
              <p style={{ fontSize: '12px', color: '#94A3B8' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ padding: '24px' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .sidebar { left: 0 !important; }
          .main-content { margin-left: 260px; }
          .lg-hide { display: none !important; }
        }
      `}</style>
    </div>
  );
}
