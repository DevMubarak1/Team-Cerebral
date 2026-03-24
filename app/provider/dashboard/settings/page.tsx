'use client';

import { useState, useEffect } from 'react';
import { Save, Building2, Mail, MapPin, Shield, Activity } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadProvider() {
      const id = localStorage.getItem('providerId');
      if (!id) return;
      const { data } = await supabase.from('providers').select('*').eq('id', id).single();
      if (data) {
        setName(data.name || '');
        setEmail(data.email || '');
        setLocation(data.location || '');
      }
    }
    loadProvider();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const id = localStorage.getItem('providerId');
    if (id) {
      await supabase.from('providers').update({ name, email, location }).eq('id', id);
      localStorage.setItem('providerName', name);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="animate-fadeIn" style={{ maxWidth: '700px' }}>
      {/* Profile Section */}
      <div className="card" style={{ padding: '32px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '16px',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', fontWeight: 800, color: 'white',
            boxShadow: '0 4px 12px rgba(16,185,129,0.25)',
          }}>
            {name.charAt(0).toUpperCase() || 'P'}
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em' }}>Provider Profile</h3>
            <p style={{ fontSize: '13px', color: '#94A3B8' }}>Manage your healthcare facility details</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>
              <Building2 size={14} /> Facility Name
            </label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your facility name" />
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>
              <Mail size={14} /> Email Address
            </label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contact@facility.com" />
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>
              <MapPin size={14} /> Location
            </label>
            <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, State" />
          </div>

          <button className="btn-green" onClick={handleSave} disabled={saving}
            style={{ width: 'auto', alignSelf: 'flex-start', padding: '12px 28px', borderRadius: '12px', marginTop: '8px' }}>
            <Save size={16} /> {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Payment Settings */}
      <div className="card" style={{ padding: '32px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px', letterSpacing: '-0.01em' }}>Payment Settings</h3>
        <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '24px' }}>Your Interswitch payment integration configuration</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { label: 'Payment Gateway', value: 'Interswitch' },
            { label: 'Environment', value: 'Test Mode' },
            { label: 'Merchant Code', value: 'MX6072' },
            { label: 'Supported Methods', value: 'Verve, Mastercard, Visa, Bank Transfer' },
          ].map(({ label, value }) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between', padding: '12px 16px',
              background: '#F8FAFC', borderRadius: '10px', alignItems: 'center',
            }}>
              <span style={{ fontSize: '14px', color: '#64748B' }}>{label}</span>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="card" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px', letterSpacing: '-0.01em' }}>Security</h3>
        <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '24px' }}>Your account security status</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { icon: <Shield size={16} color="#10B981" />, label: 'SSL Encryption', status: 'Active', ok: true },
            { icon: <Activity size={16} color="#10B981" />, label: 'Real-time Monitoring', status: 'Active', ok: true },
            { icon: <Shield size={16} color="#10B981" />, label: 'Interswitch Protection', status: 'Enabled', ok: true },
          ].map(({ icon, label, status, ok }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
              background: '#F8FAFC', borderRadius: '10px',
            }}>
              {icon}
              <span style={{ flex: 1, fontSize: '14px', fontWeight: 500 }}>{label}</span>
              <span style={{
                fontSize: '12px', fontWeight: 600,
                padding: '4px 10px', borderRadius: '6px',
                background: ok ? '#ECFDF5' : '#FEF2F2',
                color: ok ? '#059669' : '#DC2626',
              }}>{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
