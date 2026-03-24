'use client';

import { useState, useEffect } from 'react';
import { Save, User, Mail, Shield, Activity } from 'lucide-react';

export default function PatientProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(localStorage.getItem('patientName') || '');
    setEmail(localStorage.getItem('patientEmail') || '');
  }, []);

  const handleSave = () => {
    setSaving(true);
    localStorage.setItem('patientName', name);
    localStorage.setItem('patientEmail', email);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }, 500);
  };

  return (
    <div className="animate-fadeIn" style={{ maxWidth: '700px' }}>
      {/* Profile Card */}
      <div className="card" style={{ padding: '32px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '18px',
            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '26px', fontWeight: 800, color: 'white',
            boxShadow: '0 4px 16px rgba(37,99,235,0.25)',
          }}>
            {name.charAt(0).toUpperCase() || 'P'}
          </div>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em' }}>{name || 'Patient'}</h3>
            <p style={{ fontSize: '13px', color: '#94A3B8' }}>{email}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>
              <User size={14} /> Full Name
            </label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>
              <Mail size={14} /> Email Address
            </label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>

          <button className="btn-primary" onClick={handleSave} disabled={saving}
            style={{ width: 'auto', alignSelf: 'flex-start', padding: '12px 28px', borderRadius: '12px', marginTop: '8px', gap: '8px' }}>
            <Save size={16} /> {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Security Info */}
      <div className="card" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>Security & Privacy</h3>
        <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '20px' }}>Your data is protected</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { icon: <Shield size={16} color="#10B981" />, label: 'Payment data encrypted via Interswitch', status: 'Active' },
            { icon: <Activity size={16} color="#10B981" />, label: 'HIPAA-compliant data handling', status: 'Active' },
            { icon: <Shield size={16} color="#10B981" />, label: 'Secure connection (HTTPS)', status: 'Active' },
          ].map(({ icon, label, status }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
              background: '#F8FAFC', borderRadius: '10px',
            }}>
              {icon}
              <span style={{ flex: 1, fontSize: '14px', fontWeight: 500 }}>{label}</span>
              <span style={{ fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px', background: '#ECFDF5', color: '#059669' }}>{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
