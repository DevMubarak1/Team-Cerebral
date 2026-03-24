'use client';

import { useState, useEffect, useCallback } from 'react';
import { CalendarDays, Receipt, Activity, Clock, ArrowUpRight, CreditCard, Stethoscope } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface AppointmentRow {
  id: string;
  patient_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  service?: { name: string; price: number };
  provider?: { name: string; location: string };
}

interface TransactionRow {
  id: string;
  transaction_id: string;
  amount: number;
  status: string;
  payment_method: string;
  completed_at: string;
}

export default function PatientOverviewPage() {
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [patientName, setPatientName] = useState('');

  const fetchData = useCallback(async () => {
    const name = localStorage.getItem('patientName') || '';
    const email = localStorage.getItem('patientEmail') || '';
    setPatientName(name);

    // Fetch patient's appointments
    const { data: appts } = await supabase
      .from('appointments')
      .select('*, service:services(name, price), provider:providers(name, location)')
      .or(`patient_name.eq.${name},patient_email.eq.${email}`)
      .order('appointment_date', { ascending: false })
      .limit(5);
    if (appts) setAppointments(appts as unknown as AppointmentRow[]);

    // Fetch related transactions
    const { data: tx } = await supabase
      .from('transactions')
      .select('*')
      .order('completed_at', { ascending: false })
      .limit(5);
    if (tx) setTransactions(tx as unknown as TransactionRow[]);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Demo data for display
  const demoAppts: AppointmentRow[] = [
    { id: '1', patient_name: 'You', appointment_date: '2026-03-25', appointment_time: '09:00 AM', status: 'confirmed', service: { name: 'General Consultation', price: 5000 }, provider: { name: 'Maryland Health Center', location: 'Lagos Island' } },
    { id: '2', patient_name: 'You', appointment_date: '2026-03-28', appointment_time: '10:30 AM', status: 'pending', service: { name: 'Laboratory Tests', price: 12000 }, provider: { name: 'Lekki Hospital', location: 'Lekki, Lagos' } },
  ];
  const demoTx: TransactionRow[] = [
    { id: '1', transaction_id: 'HP-A1B2C3-XY01', amount: 5000, status: 'completed', payment_method: 'card', completed_at: '2026-03-24T09:00:00' },
    { id: '2', transaction_id: 'HP-D4E5F6-AB02', amount: 12000, status: 'completed', payment_method: 'transfer', completed_at: '2026-03-22T14:30:00' },
  ];

  const displayAppts = appointments.length > 0 ? appointments : demoAppts;
  const displayTx = transactions.length > 0 ? transactions : demoTx;
  const totalSpent = displayTx.filter(t => t.status === 'completed').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="animate-fadeIn">
      {/* Welcome */}
      <div style={{
        background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', borderRadius: '20px',
        padding: '28px 32px', color: 'white', marginBottom: '24px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-20px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: '-40px', right: '60px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '4px' }}>Welcome back,</p>
          <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '12px' }}>{patientName || 'Patient'} 👋</h2>
          <p style={{ fontSize: '14px', opacity: 0.7, maxWidth: '400px' }}>Manage your appointments, track payments, and book new healthcare services.</p>
          <Link href="/booking" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px',
            color: 'white', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
            marginTop: '16px', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)',
            transition: 'all 0.2s',
          }}>
            <CalendarDays size={16} /> Book New Appointment
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        {[
          { icon: <CalendarDays size={20} color="#2563EB" />, bg: '#EFF6FF', value: displayAppts.length, label: 'Appointments' },
          { icon: <Receipt size={20} color="#10B981" />, bg: '#ECFDF5', value: `₦${totalSpent.toLocaleString()}`, label: 'Total Spent' },
          { icon: <Stethoscope size={20} color="#7C3AED" />, bg: '#F5F3FF', value: new Set(displayAppts.map(a => a.provider?.name).filter(Boolean)).size, label: 'Providers Visited' },
        ].map(s => (
          <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '18px 20px' }}>
            <div style={{ width: 40, height: 40, borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
            <div>
              <p style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em' }}>{s.value}</p>
              <p style={{ fontSize: '12px', color: '#94A3B8' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
        {/* Upcoming Appointments */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid #F1F5F9' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Upcoming Appointments</h3>
            <a href="/patient/dashboard/appointments" style={{ fontSize: '12px', fontWeight: 600, color: '#2563EB', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all <ArrowUpRight size={13} />
            </a>
          </div>
          {displayAppts.map((a, i) => (
            <div key={a.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 24px', borderBottom: i < displayAppts.length - 1 ? '1px solid #F8FAFC' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '10px',
                  background: a.status === 'confirmed' ? '#ECFDF5' : '#FFFBEB',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Clock size={16} color={a.status === 'confirmed' ? '#10B981' : '#F59E0B'} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>{a.service?.name}</p>
                  <p style={{ fontSize: '12px', color: '#94A3B8' }}>{a.provider?.name}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '13px', fontWeight: 500 }}>{a.appointment_date}</p>
                <p style={{ fontSize: '12px', color: '#94A3B8' }}>{a.appointment_time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Payments */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid #F1F5F9' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Recent Payments</h3>
            <a href="/patient/dashboard/payments" style={{ fontSize: '12px', fontWeight: 600, color: '#10B981', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all <ArrowUpRight size={13} />
            </a>
          </div>
          {displayTx.map((t, i) => (
            <div key={t.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 24px', borderBottom: i < displayTx.length - 1 ? '1px solid #F8FAFC' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '10px', background: '#EFF6FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CreditCard size={16} color="#2563EB" />
                </div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'monospace', color: '#475569' }}>{t.transaction_id}</p>
                  <p style={{ fontSize: '12px', color: '#94A3B8' }}>{t.payment_method === 'card' ? 'Card' : 'Transfer'}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '14px', fontWeight: 700 }}>₦{t.amount.toLocaleString()}</p>
                <span style={{
                  fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px',
                  background: t.status === 'completed' ? '#ECFDF5' : '#FFFBEB',
                  color: t.status === 'completed' ? '#059669' : '#D97706',
                }}>{t.status.charAt(0).toUpperCase() + t.status.slice(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
