'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface TransactionRow {
  id: string;
  transaction_id: string;
  amount: number;
  payment_method: string;
  status: string;
  completed_at: string;
  appointment?: { patient_name: string; appointment_date: string; appointment_time: string; service?: { name: string } };
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async () => {
    const { data } = await supabase
      .from('transactions')
      .select('*, appointment:appointments(patient_name, appointment_date, appointment_time, service:services(name))')
      .order('completed_at', { ascending: false });
    if (data) setTransactions(data as unknown as TransactionRow[]);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const demoTx: TransactionRow[] = [
    { id: '1', transaction_id: 'HP-1711234567-A8K2MN', amount: 15000, payment_method: 'card', status: 'completed', completed_at: '2026-03-24T09:00:00', appointment: { patient_name: 'Adebayo Johnson', appointment_date: '2026-03-24', appointment_time: '09:00 AM', service: { name: 'General Consultation' } } },
    { id: '2', transaction_id: 'HP-1711234890-B7J3PQ', amount: 12000, payment_method: 'transfer', status: 'completed', completed_at: '2026-03-24T10:30:00', appointment: { patient_name: 'Fatima Abubakar', appointment_date: '2026-03-24', appointment_time: '10:30 AM', service: { name: 'Laboratory Tests' } } },
    { id: '3', transaction_id: 'HP-1711235123-C6H4RS', amount: 8000, payment_method: 'card', status: 'completed', completed_at: '2026-03-23T14:00:00', appointment: { patient_name: 'Chukwu Emeka', appointment_date: '2026-03-23', appointment_time: '02:00 PM', service: { name: 'Dental Check-up' } } },
    { id: '4', transaction_id: 'HP-1711235456-D5G5TU', amount: 6500, payment_method: 'card', status: 'pending', completed_at: '2026-03-23T11:00:00', appointment: { patient_name: 'Ngozi Okonkwo', appointment_date: '2026-03-23', appointment_time: '11:00 AM', service: { name: 'Pediatrics' } } },
    { id: '5', transaction_id: 'HP-1711235789-E4F6VW', amount: 5000, payment_method: 'transfer', status: 'completed', completed_at: '2026-03-22T16:00:00', appointment: { patient_name: 'Yusuf Ibrahim', appointment_date: '2026-03-22', appointment_time: '04:00 PM', service: { name: 'General Consultation' } } },
    { id: '6', transaction_id: 'HP-1711236012-F3E7XY', amount: 15000, payment_method: 'card', status: 'completed', completed_at: '2026-03-22T09:30:00', appointment: { patient_name: 'Kemi Adekunle', appointment_date: '2026-03-22', appointment_time: '09:30 AM', service: { name: 'X-Ray Scan' } } },
  ];

  const displayTx = transactions.length > 0 ? transactions : demoTx;
  const filtered = displayTx.filter(t =>
    t.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.appointment?.patient_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = filtered.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="animate-fadeIn">
      {/* Summary */}
      <div style={{
        display: 'flex', gap: '20px', marginBottom: '20px', padding: '20px 24px',
        background: 'linear-gradient(135deg, #0F172A, #1E293B)', borderRadius: '16px',
        color: 'white', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap',
      }}>
        <div>
          <p style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 500 }}>Total Revenue (Filtered)</p>
          <p style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em' }}>₦{totalRevenue.toLocaleString()}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: '#94A3B8', padding: '6px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: '8px' }}>
            {filtered.length} transactions
          </span>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
            borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)',
            color: 'white', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600,
          }}>
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: '10px',
          padding: '0 16px', background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '12px',
        }}>
          <Search size={16} color="#94A3B8" />
          <input placeholder="Search by patient name or transaction ID..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', outline: 'none', flex: 1, padding: '12px 0', fontFamily: 'var(--font-sans)', fontSize: '14px', background: 'transparent' }} />
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: '6px', padding: '0 18px',
          border: '1.5px solid #E2E8F0', borderRadius: '12px', background: 'white',
          cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#64748B', fontWeight: 600,
        }}>
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr>
                {['TRANSACTION ID', 'PATIENT', 'SERVICE', 'DATE', 'AMOUNT', 'METHOD', 'STATUS'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '14px 20px', fontSize: '11px', fontWeight: 700,
                    color: '#94A3B8', letterSpacing: '0.06em', borderBottom: '1px solid #F1F5F9', background: '#FAFBFC',
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}
                  style={{ borderBottom: '1px solid #F8FAFC', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#FAFBFF'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 20px', fontWeight: 600, fontSize: '12px', fontFamily: 'monospace', color: '#475569' }}>{t.transaction_id}</td>
                  <td style={{ padding: '14px 20px', fontWeight: 500 }}>{t.appointment?.patient_name || 'N/A'}</td>
                  <td style={{ padding: '14px 20px', color: '#64748B' }}>{t.appointment?.service?.name || 'N/A'}</td>
                  <td style={{ padding: '14px 20px' }}>{t.appointment?.appointment_date}</td>
                  <td style={{ padding: '14px 20px', fontWeight: 700 }}>₦{t.amount?.toLocaleString()}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                      background: t.payment_method === 'card' ? '#EFF6FF' : '#ECFDF5',
                      color: t.payment_method === 'card' ? '#2563EB' : '#059669',
                    }}>
                      {t.payment_method === 'card' ? 'Card' : 'Transfer'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className={`status-${t.status}`}>{t.status.charAt(0).toUpperCase() + t.status.slice(1)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
