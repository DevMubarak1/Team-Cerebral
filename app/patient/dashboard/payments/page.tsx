'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, CreditCard, Building2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface PaymentRow {
  id: string;
  transaction_id: string;
  amount: number;
  payment_method: string;
  status: string;
  completed_at: string;
  appointment?: { patient_name: string; appointment_date: string; service?: { name: string }; provider?: { name: string } };
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async () => {
    const { data } = await supabase
      .from('transactions')
      .select('*, appointment:appointments(patient_name, appointment_date, service:services(name), provider:providers(name))')
      .order('completed_at', { ascending: false });
    if (data) setPayments(data as unknown as PaymentRow[]);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const demoPayments: PaymentRow[] = [
    { id: '1', transaction_id: 'HP-1711234567-A8K2MN', amount: 5000, payment_method: 'card', status: 'completed', completed_at: '2026-03-24T09:00:00', appointment: { patient_name: 'You', appointment_date: '2026-03-24', service: { name: 'General Consultation' }, provider: { name: 'Maryland Health Center' } } },
    { id: '2', transaction_id: 'HP-1711234890-B7J3PQ', amount: 12000, payment_method: 'transfer', status: 'completed', completed_at: '2026-03-22T10:30:00', appointment: { patient_name: 'You', appointment_date: '2026-03-22', service: { name: 'Laboratory Tests' }, provider: { name: 'Lekki Hospital' } } },
    { id: '3', transaction_id: 'HP-1711235123-C6H4RS', amount: 8000, payment_method: 'card', status: 'completed', completed_at: '2026-03-20T14:00:00', appointment: { patient_name: 'You', appointment_date: '2026-03-20', service: { name: 'Dental Check-up' }, provider: { name: 'Saint Health Clinic' } } },
    { id: '4', transaction_id: 'HP-1711235456-D5G5TU', amount: 6500, payment_method: 'card', status: 'pending', completed_at: '2026-03-18T11:00:00', appointment: { patient_name: 'You', appointment_date: '2026-03-18', service: { name: 'Pediatrics' }, provider: { name: 'Maryland Health Center' } } },
  ];

  const displayPayments = payments.length > 0 ? payments : demoPayments;
  const filtered = displayPayments.filter(p =>
    p.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.appointment?.service?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.appointment?.provider?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPaid = filtered.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="animate-fadeIn">
      {/* Summary Banner */}
      <div style={{
        display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap',
      }}>
        <div style={{
          flex: 2, minWidth: '280px', padding: '24px 28px',
          background: 'linear-gradient(135deg, #0F172A, #1E293B)', borderRadius: '16px', color: 'white',
        }}>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '4px' }}>Total Payments Made</p>
          <p style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-0.03em' }}>₦{totalPaid.toLocaleString()}</p>
          <p style={{ fontSize: '12px', color: '#64748B', marginTop: '8px' }}>{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="card" style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ width: 42, height: 42, borderRadius: '12px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
            <CheckCircle2 size={20} color="#10B981" />
          </div>
          <p style={{ fontSize: '20px', fontWeight: 800 }}>{filtered.filter(p => p.status === 'completed').length}</p>
          <p style={{ fontSize: '12px', color: '#94A3B8' }}>Successful</p>
        </div>
      </div>

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '0 16px', background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '12px', marginBottom: '20px',
      }}>
        <Search size={16} color="#94A3B8" />
        <input placeholder="Search by ID, service, or provider..."
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          style={{ border: 'none', outline: 'none', flex: 1, padding: '12px 0', fontFamily: 'var(--font-sans)', fontSize: '14px', background: 'transparent' }} />
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map(p => (
          <div key={p.id} className="card" style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '12px',
                  background: p.payment_method === 'card' ? '#EFF6FF' : '#ECFDF5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {p.payment_method === 'card' ? <CreditCard size={20} color="#2563EB" /> : <Building2 size={20} color="#10B981" />}
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>{p.appointment?.service?.name || 'Healthcare Payment'}</h4>
                  <p style={{ fontSize: '12px', color: '#94A3B8' }}>{p.appointment?.provider?.name} · {p.appointment?.appointment_date}</p>
                  <p style={{ fontSize: '11px', color: '#CBD5E1', fontFamily: 'monospace', marginTop: '4px' }}>{p.transaction_id}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>₦{p.amount.toLocaleString()}</p>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                  background: p.status === 'completed' ? '#ECFDF5' : '#FFFBEB',
                  color: p.status === 'completed' ? '#059669' : '#D97706',
                }}>
                  {p.status === 'completed' ? <CheckCircle2 size={12} /> : null}
                  {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
