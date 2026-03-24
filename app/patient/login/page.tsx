'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, ArrowLeft, Mail, User, LogIn, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function PatientLoginPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    setError('');

    if (isSignup) {
      if (!name) { setError('Please enter your name'); setLoading(false); return; }
      // Check if user already exists
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .eq('role', 'patient')
        .single();

      if (existing) {
        setError('Account already exists. Please sign in.');
        setLoading(false);
        return;
      }

      // Create user in Supabase
      const { data: newUser, error: insertErr } = await supabase
        .from('users')
        .insert({ email, password, name, role: 'patient' })
        .select()
        .single();

      if (insertErr) {
        setError('Could not create account. Please try again.');
        setLoading(false);
        return;
      }

      localStorage.setItem('patientEmail', email);
      localStorage.setItem('patientName', newUser.name);
      localStorage.setItem('patientId', newUser.id);
      router.push('/patient/dashboard');
    } else {
      // Login — check credentials in Supabase
      const { data: user, error: loginErr } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .eq('role', 'patient')
        .single();

      if (loginErr || !user) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      localStorage.setItem('patientEmail', user.email);
      localStorage.setItem('patientName', user.name);
      localStorage.setItem('patientId', user.id);
      router.push('/patient/dashboard');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left Panel - Branding */}
      <div style={{
        flex: 1, background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #1E293B 100%)',
        display: 'none', flexDirection: 'column', justifyContent: 'center', padding: '60px',
        position: 'relative', overflow: 'hidden',
      }} className="login-brand-panel">
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-15%', left: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <div style={{
              width: 44, height: 44, borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
            }}>
              <Activity size={22} color="white" strokeWidth={2.5} />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>HealthPay</h1>
          </div>

          <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'white', lineHeight: 1.2, letterSpacing: '-0.03em', marginBottom: '16px' }}>
            Your Health,<br /><span style={{ color: '#60A5FA' }}>Your Way</span>
          </h2>
          <p style={{ fontSize: '16px', color: '#94A3B8', lineHeight: 1.7, maxWidth: '400px' }}>
            Book appointments, pay securely via Interswitch, and manage your health journey — all in one place.
          </p>

          <div style={{ display: 'flex', gap: '32px', marginTop: '40px' }}>
            {[{ num: '500+', label: 'Patients' }, { num: '50+', label: 'Providers' }, { num: '₦10M+', label: 'Processed' }].map(s => (
              <div key={s.label}>
                <p style={{ fontSize: '22px', fontWeight: 800, color: 'white' }}>{s.num}</p>
                <p style={{ fontSize: '13px', color: '#64748B' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', background: '#F8FAFC',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <button onClick={() => router.push('/home')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '13px', fontWeight: 500, marginBottom: '32px', fontFamily: 'var(--font-sans)' }}>
            <ArrowLeft size={16} /> Back to Home
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div className="lg-only-hide" style={{
              width: 36, height: 36, borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Activity size={18} color="white" />
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.03em' }}>
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h2>
          </div>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '32px' }}>
            {isSignup ? 'Join HealthPay to manage your healthcare' : 'Sign in to your patient dashboard'}
          </p>

          {error && (
            <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', color: '#DC2626', fontWeight: 500 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {isSignup && (
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>
                  <User size={14} /> Full Name
                </label>
                <input className="input" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>
                <Mail size={14} /> Email Address
              </label>
              <input className="input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>
                <Lock size={14} /> Password
              </label>
              <div style={{ position: 'relative' }}>
                <input className="input" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} style={{ paddingRight: '44px' }} />
                <button onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button className="btn-primary" onClick={handleSubmit} disabled={loading || !email || !password}
              style={{ marginTop: '8px', gap: '8px' }}>
              <LogIn size={18} /> {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Sign In'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '13px', color: '#94A3B8' }}>
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button onClick={() => { setIsSignup(!isSignup); setError(''); }}
                style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '13px' }}>
                {isSignup ? 'Sign In' : 'Sign Up'}
              </button>
            </p>

            {/* Test credentials hint */}
            <div style={{ padding: '12px 16px', background: '#EFF6FF', borderRadius: '10px', marginTop: '4px' }}>
              <p style={{ fontSize: '12px', color: '#2563EB', fontWeight: 600, marginBottom: '4px' }}>Demo Credentials</p>
              <p style={{ fontSize: '12px', color: '#64748B' }}>Email: testing@healthpay.com</p>
              <p style={{ fontSize: '12px', color: '#64748B' }}>Password: testing</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .login-brand-panel { display: flex !important; }
          .lg-only-hide { display: none !important; }
        }
      `}</style>
    </div>
  );
}
