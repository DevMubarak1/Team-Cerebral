'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, ArrowRight, Shield, Heart, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ProviderLoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setError(''); setLoading(true);
    try {
      // Check user credentials in Supabase
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .eq('role', 'provider')
        .single();

      if (!user) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      // Find or create provider record linked to this user
      let { data: provider } = await supabase
        .from('providers')
        .select('*')
        .eq('email', email)
        .single();

      if (!provider) {
        // Create provider record for this user
        const { data: newProvider } = await supabase
          .from('providers')
          .insert({ user_id: user.id, name: user.name, email: user.email, location: user.location || 'Nigeria' })
          .select()
          .single();
        provider = newProvider;
      }

      if (provider) {
        localStorage.setItem('providerId', provider.id);
        localStorage.setItem('providerName', provider.name);
        router.push('/provider/dashboard');
      }
    } catch {
      setError('Login failed. Please check your credentials.');
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    setError(''); setLoading(true);
    if (!name || !email || !location || !password) { setError('Please fill in all fields'); setLoading(false); return; }
    try {
      // Check if user already exists
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .eq('role', 'provider')
        .single();

      if (existing) {
        setError('Account already exists. Please sign in.');
        setLoading(false);
        return;
      }

      // Create user record
      const { data: newUser, error: userErr } = await supabase
        .from('users')
        .insert({ email, password, name, role: 'provider', location })
        .select()
        .single();

      if (userErr || !newUser) {
        setError('Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      // Create provider record
      const { data: provider, error: provErr } = await supabase
        .from('providers')
        .insert({ user_id: newUser.id, name, email, location })
        .select()
        .single();

      if (provErr || !provider) {
        setError('Could not create provider profile.');
        setLoading(false);
        return;
      }

      localStorage.setItem('providerId', provider.id);
      localStorage.setItem('providerName', provider.name);
      router.push('/provider/dashboard');
    } catch {
      setError('Registration failed. Email may already exist.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden',
    }}>
      {/* Left decorative panel - desktop only */}
      <div style={{
        flex: '0 0 45%', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px',
        position: 'relative', overflow: 'hidden',
      }}
        className="hidden-mobile"
      >
        <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)' }} />

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
            <img src="/favicon.png" alt="HealthPay Logo" style={{ width: 48, height: 48, borderRadius: '14px', objectFit: 'contain' }} />
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>HealthPay</h2>
              <p style={{ fontSize: '12px', color: '#64748B' }}>Provider Portal</p>
            </div>
          </div>

          <h1 style={{ fontSize: '40px', fontWeight: 900, color: 'white', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '20px' }}>
            Manage your<br />
            <span style={{ color: '#10B981' }}>healthcare</span><br />
            payments
          </h1>
          <p style={{ fontSize: '16px', color: '#94A3B8', lineHeight: 1.7, maxWidth: '380px' }}>
            Track revenue, manage services, and reconcile transactions — all in one dashboard.
          </p>

          <div style={{ display: 'flex', gap: '8px', marginTop: '40px', flexWrap: 'wrap' }}>
            {[
              { icon: '🔒', text: 'Bank-grade security' },
              { icon: '⚡', text: 'Real-time tracking' },
              { icon: '📊', text: 'Analytics dashboard' },
            ].map((f, i) => (
              <div key={i} style={{
                padding: '8px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', color: '#94A3B8',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <span>{f.icon}</span> {f.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', background: '#F8FAFC', position: 'relative',
      }}>
        <div style={{ maxWidth: '400px', width: '100%', position: 'relative', zIndex: 10 }}>
          {/* Mobile logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px' }}
            className="show-mobile"
          >
            <img src="/favicon.png" alt="HealthPay Logo" style={{ width: 40, height: 40, borderRadius: '12px', objectFit: 'contain' }} />
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 800 }}>HealthPay</h2>
              <p style={{ fontSize: '11px', color: '#94A3B8' }}>Provider Portal</p>
            </div>
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '6px', letterSpacing: '-0.02em' }}>
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '32px', lineHeight: 1.6 }}>
            {isRegister ? 'Register your healthcare facility' : 'Sign in to your provider dashboard'}
          </p>

          {error && (
            <div style={{
              background: '#FEF2F2', color: '#DC2626', padding: '12px 16px',
              borderRadius: '12px', fontSize: '13px', marginBottom: '20px',
              border: '1px solid #FECACA', fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {isRegister && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>Facility Name</label>
                  <input className="input" placeholder="e.g., Lekki Hospital" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>Location</label>
                  <input className="input" placeholder="e.g., Lekki, Lagos" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
              </>
            )}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>Email Address</label>
              <input className="input" type="email" placeholder="provider@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>
                <Lock size={14} /> Password
              </label>
              <div style={{ position: 'relative' }}>
                <input className="input" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (isRegister ? handleRegister() : handleLogin())} style={{ paddingRight: '44px' }} />
                <button onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button className="btn-primary" onClick={isRegister ? handleRegister : handleLogin} disabled={loading}
              style={{ marginTop: '8px', background: 'linear-gradient(135deg, #10B981, #059669)', boxShadow: '0 1px 3px rgba(16,185,129,0.3), 0 4px 12px rgba(16,185,129,0.15)' }}>
              {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Security badge */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            marginTop: '24px', padding: '10px', borderRadius: '10px', background: '#ECFDF5',
          }}>
            <Shield size={14} color="#10B981" />
            <span style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>Protected by Interswitch Security</span>
          </div>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748B', marginTop: '20px' }}>
            {isRegister ? 'Already registered? ' : 'Need an account? '}
            <button onClick={() => { setIsRegister(!isRegister); setError(''); }}
              style={{
                background: 'none', border: 'none', color: '#10B981', fontWeight: 700,
                cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '14px',
              }}>
              {isRegister ? 'Sign In' : 'Register'}
            </button>
          </p>

          {/* Demo credentials */}
          <div style={{ padding: '12px 16px', background: '#ECFDF5', borderRadius: '10px', marginTop: '16px' }}>
            <p style={{ fontSize: '12px', color: '#059669', fontWeight: 600, marginBottom: '4px' }}>Demo Credentials</p>
            <p style={{ fontSize: '12px', color: '#64748B' }}>Email: testing@healthpay.com</p>
            <p style={{ fontSize: '12px', color: '#64748B' }}>Password: testing</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '24px' }}>
            <Heart size={10} fill="#EF4444" color="#EF4444" />
            <span style={{ fontSize: '11px', color: '#CBD5E1' }}>HealthPay · Making healthcare accessible</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}
