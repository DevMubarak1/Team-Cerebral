'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Users, CalendarDays } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface PatientInfo {
  name: string;
  visits: number;
  lastVisit: string;
  totalSpent: number;
  services: string[];
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<PatientInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async () => {
    const { data: appointments } = await supabase
      .from('appointments')
      .select('patient_name, appointment_date, service:services(name, price)')
      .order('appointment_date', { ascending: false });

    if (appointments && appointments.length > 0) {
      const patientMap = new Map<string, PatientInfo>();
      appointments.forEach((a: any) => {
        const service = Array.isArray(a.service) ? a.service[0] : a.service;
        const existing = patientMap.get(a.patient_name);
        if (existing) {
          existing.visits += 1;
          existing.totalSpent += service?.price || 0;
          if (service?.name && !existing.services.includes(service.name)) {
            existing.services.push(service.name);
          }
        } else {
          patientMap.set(a.patient_name, {
            name: a.patient_name,
            visits: 1,
            lastVisit: a.appointment_date,
            totalSpent: service?.price || 0,
            services: service?.name ? [service.name] : [],
          });
        }
      });
      setPatients(Array.from(patientMap.values()));
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const demoPatients: PatientInfo[] = [
    { name: 'Adebayo Johnson', visits: 5, lastVisit: '2026-03-24', totalSpent: 42000, services: ['General Consultation', 'Laboratory Tests'] },
    { name: 'Fatima Abubakar', visits: 3, lastVisit: '2026-03-24', totalSpent: 28000, services: ['Laboratory Tests', 'X-Ray Scan'] },
    { name: 'Chukwu Emeka', visits: 2, lastVisit: '2026-03-23', totalSpent: 16000, services: ['Dental Check-up'] },
    { name: 'Ngozi Okonkwo', visits: 4, lastVisit: '2026-03-23', totalSpent: 32500, services: ['Pediatrics', 'General Consultation'] },
    { name: 'Yusuf Ibrahim', visits: 1, lastVisit: '2026-03-22', totalSpent: 5000, services: ['General Consultation'] },
    { name: 'Kemi Adekunle', visits: 3, lastVisit: '2026-03-22', totalSpent: 35000, services: ['X-Ray Scan', 'Laboratory Tests'] },
    { name: 'Tunde Bakare', visits: 2, lastVisit: '2026-03-21', totalSpent: 13000, services: ['Dental Check-up', 'General Consultation'] },
    { name: 'Amara Obi', visits: 1, lastVisit: '2026-03-20', totalSpent: 6500, services: ['Pediatrics'] },
  ];

  const displayPatients = patients.length > 0 ? patients : demoPatients;
  const filtered = displayPatients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fadeIn">
      {/* Summary */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div className="card" style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '14px', padding: '20px' }}>
          <div style={{ width: 42, height: 42, borderRadius: '12px', background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={20} color="#2563EB" />
          </div>
          <div>
            <p style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em' }}>{filtered.length}</p>
            <p style={{ fontSize: '13px', color: '#94A3B8' }}>Total Patients</p>
          </div>
        </div>
        <div className="card" style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '14px', padding: '20px' }}>
          <div style={{ width: 42, height: 42, borderRadius: '12px', background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CalendarDays size={20} color="#10B981" />
          </div>
          <div>
            <p style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em' }}>{filtered.reduce((s, p) => s + p.visits, 0)}</p>
            <p style={{ fontSize: '13px', color: '#94A3B8' }}>Total Visits</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '0 16px', background: 'white', border: '1.5px solid #E2E8F0',
        borderRadius: '12px', marginBottom: '20px',
      }}>
        <Search size={16} color="#94A3B8" />
        <input placeholder="Search patients..."
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          style={{ border: 'none', outline: 'none', flex: 1, padding: '12px 0', fontFamily: 'var(--font-sans)', fontSize: '14px', background: 'transparent' }} />
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr>
                {['PATIENT', 'VISITS', 'LAST VISIT', 'SERVICES', 'TOTAL SPENT'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '14px 20px', fontSize: '11px', fontWeight: 700,
                    color: '#94A3B8', letterSpacing: '0.06em', borderBottom: '1px solid #F1F5F9', background: '#FAFBFC',
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.name}
                  style={{ borderBottom: '1px solid #F8FAFC', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#FAFBFF'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '8px',
                        background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '13px', fontWeight: 700, color: 'white',
                      }}>
                        {p.name.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 600 }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '6px', background: '#F1F5F9', fontWeight: 600, fontSize: '13px' }}>{p.visits}</span>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#64748B' }}>{p.lastVisit}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {p.services.slice(0, 2).map(s => (
                        <span key={s} style={{ padding: '2px 8px', borderRadius: '4px', background: '#EFF6FF', color: '#2563EB', fontSize: '11px', fontWeight: 600 }}>{s}</span>
                      ))}
                      {p.services.length > 2 && (
                        <span style={{ padding: '2px 8px', borderRadius: '4px', background: '#F1F5F9', color: '#64748B', fontSize: '11px', fontWeight: 600 }}>+{p.services.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 700 }}>₦{p.totalSpent.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
