'use client';

import { useState, useEffect, useCallback } from 'react';
import { CalendarDays, Clock, CheckCircle2, AlertCircle, XCircle, MapPin, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Appointment {
  id: string;
  patient_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  service?: { name: string; price: number };
  provider?: { name: string; location: string };
}

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async () => {
    const name = localStorage.getItem('patientName') || '';
    const email = localStorage.getItem('patientEmail') || '';
    const { data } = await supabase.from('appointments')
      .select('*, service:services(name, price), provider:providers(name, location)')
      .or(`patient_name.eq.${name},patient_email.eq.${email}`)
      .order('appointment_date', { ascending: false });
    if (data) setAppointments(data as unknown as Appointment[]);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const demoData: Appointment[] = [
    { id: '1', patient_name: 'You', appointment_date: '2026-03-25', appointment_time: '09:00 AM', status: 'confirmed', service: { name: 'General Consultation', price: 5000 }, provider: { name: 'Maryland Health Center', location: 'Lagos Island' } },
    { id: '2', patient_name: 'You', appointment_date: '2026-03-28', appointment_time: '10:30 AM', status: 'pending', service: { name: 'Laboratory Tests', price: 12000 }, provider: { name: 'Lekki Hospital', location: 'Lekki, Lagos' } },
    { id: '3', patient_name: 'You', appointment_date: '2026-03-20', appointment_time: '01:00 PM', status: 'confirmed', service: { name: 'Dental Check-up', price: 8000 }, provider: { name: 'Saint Health Clinic', location: 'Ikeja, Lagos' } },
    { id: '4', patient_name: 'You', appointment_date: '2026-03-15', appointment_time: '02:00 PM', status: 'cancelled', service: { name: 'Pediatrics', price: 6500 }, provider: { name: 'Maryland Health Center', location: 'Lagos Island' } },
  ];

  const displayData = appointments.length > 0 ? appointments : demoData;
  const filtered = displayData.filter(a => {
    const matchSearch = (a.service?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (a.provider?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusIcon = (s: string) => s === 'confirmed' ? <CheckCircle2 size={14} color="#10B981" /> : s === 'pending' ? <AlertCircle size={14} color="#F59E0B" /> : <XCircle size={14} color="#EF4444" />;
  const statusColors = (s: string) => ({
    background: s === 'confirmed' ? '#ECFDF5' : s === 'pending' ? '#FFFBEB' : '#FEF2F2',
    color: s === 'confirmed' ? '#059669' : s === 'pending' ? '#D97706' : '#DC2626',
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
          <input placeholder="Search by service or provider..."
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

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map(a => (
          <div key={a.id} className="card" style={{
            padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
              <div style={{
                width: 46, height: 46, borderRadius: '14px',
                background: a.status === 'confirmed' ? '#ECFDF5' : a.status === 'pending' ? '#FFFBEB' : '#FEF2F2',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CalendarDays size={20} color={a.status === 'confirmed' ? '#10B981' : a.status === 'pending' ? '#F59E0B' : '#EF4444'} />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{a.service?.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                  <MapPin size={12} color="#94A3B8" />
                  <span style={{ fontSize: '13px', color: '#64748B' }}>{a.provider?.name} · {a.provider?.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#94A3B8' }}><CalendarDays size={12} />{a.appointment_date}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#94A3B8' }}><Clock size={12} />{a.appointment_time}</span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '16px', fontWeight: 800, color: '#2563EB', marginBottom: '6px' }}>₦{a.service?.price?.toLocaleString()}</p>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                ...statusColors(a.status),
              }}>
                {statusIcon(a.status)} {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>
            <CalendarDays size={40} color="#CBD5E1" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontWeight: 600, fontSize: '16px', marginBottom: '8px' }}>No appointments found</p>
            <p>Book your first appointment to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
