'use client';

import { ArrowRight, User, Hospital, Shield, Zap, Heart, CreditCard, CheckCircle2, Clock, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', position: 'relative', overflow: 'hidden' }}>
      {/* Background mesh */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.04) 0%, transparent 70%)', transform: 'translate(-50%, -50%)' }} />
      </div>

      {/* Navbar — with Patient/Provider buttons (no generic Sign In / Get Started) */}
      <nav className="glass home-nav" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 32px', borderBottom: '1px solid rgba(226,232,240,0.6)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Image src="/favicon.png" alt="HealthPay" width={36} height={36} style={{ borderRadius: '10px' }} />
          <span className="home-brand-text" style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0F172A' }}>HealthPay</span>
        </div>
        <div className="home-nav-btns" style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => router.push('/patient/login')}
            className="btn-primary" style={{
              padding: '8px 18px', fontSize: '12px', borderRadius: '10px', gap: '6px',
            }}>
            <User size={14} /> Patient
          </button>
          <button onClick={() => router.push('/provider/login')}
            style={{
              padding: '8px 18px', borderRadius: '10px', border: '1.5px solid #10B981',
              background: 'white', fontSize: '12px', fontWeight: 700, color: '#059669',
              cursor: 'pointer', fontFamily: 'var(--font-sans)', display: 'flex',
              alignItems: 'center', gap: '6px', transition: 'all 0.2s',
            }}>
            <Hospital size={14} /> Provider
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>

        {/* Hero Section */}
        <section className="animate-fadeIn" style={{ textAlign: 'center', padding: '80px 0 60px' }}>
          {/* Trust Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'white', padding: '8px 20px', borderRadius: '999px',
            border: '1px solid #E2E8F0', marginBottom: '32px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}>
            <Shield size={14} color="#10B981" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}>
              Secured by Interswitch · 256-bit Encryption
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 5.5vw, 68px)', fontWeight: 900, lineHeight: 1.06,
            letterSpacing: '-0.04em', marginBottom: '24px', color: '#0F172A',
          }}>
            Healthcare<br />
            <span style={{
              background: 'linear-gradient(135deg, #2563EB, #10B981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Payments</span> Made<br />
            Simple
          </h1>
          <p style={{
            fontSize: 'clamp(16px, 2vw, 19px)', color: '#64748B', maxWidth: '520px',
            margin: '0 auto', lineHeight: 1.8, fontWeight: 400,
          }}>
            Book appointments, pay securely, and track your healthcare journey — all powered by <strong style={{ color: '#0F172A' }}>Interswitch</strong>.
          </p>

          {/* CTA — two buttons side by side */}
          <div className="hero-cta" style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '36px' }}>
            <button onClick={() => router.push('/patient/login')} className="btn-primary"
              style={{ padding: '14px 32px', fontSize: '15px', borderRadius: '14px', gap: '10px' }}>
              Start as Patient <ArrowRight size={18} />
            </button>
            <button onClick={() => router.push('/provider/login')}
              style={{
                padding: '14px 32px', borderRadius: '14px', border: '2px solid #10B981',
                background: 'transparent', fontSize: '15px', fontWeight: 700, color: '#059669',
                cursor: 'pointer', fontFamily: 'var(--font-sans)', display: 'flex',
                alignItems: 'center', gap: '10px', transition: 'all 0.2s',
              }}>
              <Hospital size={18} /> Provider Portal
            </button>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="animate-fadeIn delay-100" style={{
          display: 'flex', justifyContent: 'center', gap: '48px', padding: '28px 0 64px', flexWrap: 'wrap',
        }}>
          {[
            { value: '500+', label: 'Patients Served' },
            { value: '₦10M+', label: 'Payments Processed' },
            { value: '50+', label: 'Healthcare Providers' },
            { value: '99.9%', label: 'Uptime' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.03em', color: '#0F172A' }}>{s.value}</p>
              <p style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </section>

        {/* Features Grid */}
        <section className="animate-fadeIn delay-200" style={{ padding: '0 0 80px' }}>
          <p style={{
            fontSize: '13px', fontWeight: 700, color: '#2563EB', letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center',
          }}>
            Why HealthPay?
          </p>
          <h2 style={{
            fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, letterSpacing: '-0.03em',
            textAlign: 'center', marginBottom: '48px', color: '#0F172A',
          }}>
            Everything you need for <br />healthcare payments
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {[
              { icon: <Zap size={22} color="#2563EB" />, bg: '#EFF6FF', title: 'Instant Payments', desc: 'Pay for healthcare services instantly using Interswitch — cards, bank transfer, USSD.' },
              { icon: <Shield size={22} color="#10B981" />, bg: '#ECFDF5', title: 'Bank-Grade Security', desc: 'Your data is encrypted with 256-bit security. All transactions are verified server-side.' },
              { icon: <CreditCard size={22} color="#2563EB" />, bg: '#EFF6FF', title: 'Multiple Payment Methods', desc: 'Verve, Mastercard, Visa, bank transfers — all supported through Interswitch.' },
              { icon: <Clock size={22} color="#F59E0B" />, bg: '#FFFBEB', title: 'Easy Booking', desc: 'Book appointments with your preferred provider, pick a date and time, and pay online.' },
              { icon: <Activity size={22} color="#10B981" />, bg: '#ECFDF5', title: 'Real-time Tracking', desc: 'Both patients and providers get instant updates on appointments and payment status.' },
              { icon: <CheckCircle2 size={22} color="#2563EB" />, bg: '#EFF6FF', title: 'Digital Receipts', desc: 'Automatic receipts for every transaction. Full payment history in your dashboard.' },
            ].map(f => (
              <div key={f.title} className="card" style={{ padding: '28px', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
              >
                <div style={{ width: 44, height: 44, borderRadius: '12px', background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.01em' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid #E2E8F0', padding: '32px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Image src="/favicon.png" alt="HealthPay" width={28} height={28} style={{ borderRadius: '8px' }} />
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>HealthPay</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Heart size={12} fill="#EF4444" color="#EF4444" />
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>
              Built for the Enyata Buildathon 2026
            </span>
          </div>
          <span style={{ fontSize: '12px', color: '#CBD5E1' }}>
            Powered by Interswitch · © 2026
          </span>
        </footer>
      </main>

      <style>{`
        @media (max-width: 640px) {
          .home-nav { padding: 10px 16px !important; }
          .home-brand-text { font-size: 15px !important; }
          .home-nav-btns button { padding: 6px 12px !important; font-size: 11px !important; }
          .hero-cta { flex-direction: row !important; }
          .hero-cta button { padding: 10px 16px !important; font-size: 13px !important; flex: 1; }
        }
      `}</style>
    </div>
  );
}
