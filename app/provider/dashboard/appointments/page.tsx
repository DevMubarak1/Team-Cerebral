'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, CalendarDays, Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Appointment {
  id: string;
  patient_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  service?: { name: string; price: number };
  provider?: { name: string };
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchData = useCallback(async () => {
    const { data } = await supabase
      .from('appointments')
      .select('*, service:services(name, price), provider:providers(name)')
      .order('appointment_date', { ascending: false });
    if (data) setAppointments(data as unknown as Appointment[]);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const demoData: Appointment[] = [
    { id: '1', patient_name: 'Adebayo Johnson', appointment_date: '2026-03-25', appointment_time: '09:00 AM', status: 'confirmed', service: { name: 'General Consultation', price: 5000 } },
    { id: '2', patient_name: 'Fatima Abubakar', appointment_date: '2026-03-25', appointment_time: '10:30 AM', status: 'confirmed', service: { name: 'Laboratory Tests', price: 12000 } },
    { id: '3', patient_name: 'Chukwu Emeka', appointment_date: '2026-03-25', appointment_time: '01:00 PM', status: 'pending', service: { name: 'Dental Check-up', price: 8000 } },
    { id: '4', patient_name: 'Ngozi Okonkwo', appointment_date: '2026-03-24', appointment_time: '11:00 AM', status: 'confirmed', service: { name: 'Pediatrics', price: 6500 } },
    { id: '5', patient_name: 'Yusuf Ibrahim', appointment_date: '2026-03-24', appointment_time: '02:00 PM', status: 'cancelled', service: { name: 'General Consultation', price: 5000 } },
    { id: '6', patient_name: 'Kemi Adekunle', appointment_date: '2026-03-26', appointment_time: '09:00 AM', status: 'confirmed', service: { name: 'X-Ray Scan', price: 15000 } },
  ];

  const displayData = appointments.length > 0 ? appointments : demoData;

  const filtered = displayData.filter(a => {
    const matchSearch = a.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) || (a.service?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusIcon = (status: string) => {
    if (status === 'confirmed') return <CheckCircle2 size={14} color="#10B981" />;
    if (status === 'pending') return <AlertCircle size={14} color="#F59E0B" />;
    return <XCircle size={14} color="#EF4444" />;
  };

  const statusStyle = (status: string) => ({
    display: 'inline-flex' as const, alignItems: 'center' as const, gap: '6px',
    padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
    background: status === 'confirmed' ? '#ECFDF5' : status === 'pending' ? '#FFFBEB' : '#FEF2F2',
    color: status === 'confirmed' ? '#059669' : status === 'pending' ? '#D97706' : '#DC2626',
  });

  return (
    <div className="animate-fadeIn">
      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{
          flex: 1, minWidth: '240px', display: 'flex', alignItems: 'center', gap: '10px',
          padding: '0 16px', background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '12px',
        }}>
          <Search size={16} color="#94A3B8" />
          <input placeholder="Search by patient or service..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', outline: 'none', flex: 1, padding: '12px 0', fontFamily: 'var(--font-sans)', fontSize: '14px', background: 'transparent' }} />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['all', 'confirmed', 'pending', 'cancelled'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{
                padding: '10px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-sans)',
                background: statusFilter === s ? '#0F172A' : 'white',
                color: statusFilter === s ? 'white' : '#64748B',
                boxShadow: statusFilter === s ? 'none' : '0 1px 3px rgba(0,0,0,0.06)',
                transition: 'all 0.2s',
              }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr>
                {['PATIENT', 'SERVICE', 'DATE', 'TIME', 'AMOUNT', 'STATUS'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '14px 20px', fontSize: '11px', fontWeight: 700,
                    color: '#94A3B8', letterSpacing: '0.06em', borderBottom: '1px solid #F1F5F9', background: '#FAFBFC',
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}
                  style={{ borderBottom: '1px solid #F8FAFC', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#FAFBFF'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 20px', fontWeight: 600 }}>{a.patient_name}</td>
                  <td style={{ padding: '14px 20px', color: '#64748B' }}>{a.service?.name || 'N/A'}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CalendarDays size={14} color="#94A3B8" />
                      {a.appointment_date}
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} color="#94A3B8" />
                      {a.appointment_time}
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 700 }}>₦{a.service?.price?.toLocaleString() || '—'}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={statusStyle(a.status)}>
                      {statusIcon(a.status)} {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>No appointments found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
