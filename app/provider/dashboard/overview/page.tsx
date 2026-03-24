'use client';

import { useState, useEffect, useCallback } from 'react';
import { DollarSign, TrendingUp, Users, CalendarDays, ArrowUpRight, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import StatsCard from '@/components/StatsCard';

interface RecentTx {
  id: string;
  transaction_id: string;
  amount: number;
  status: string;
  completed_at: string;
  appointment?: { patient_name: string; service?: { name: string } };
}

interface UpcomingAppt {
  id: string;
  patient_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  service?: { name: string };
}

export default function OverviewPage() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [todayPayments, setTodayPayments] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [recentTx, setRecentTx] = useState<RecentTx[]>([]);
  const [upcomingAppts, setUpcomingAppts] = useState<UpcomingAppt[]>([]);

  const fetchData = useCallback(async () => {
    // Transactions
    const { data: txData } = await supabase
      .from('transactions')
      .select('*, appointment:appointments(patient_name, service:services(name))')
      .order('completed_at', { ascending: false })
      .limit(5);

    if (txData) {
      setRecentTx(txData as unknown as RecentTx[]);
      const allTx = await supabase.from('transactions').select('amount, completed_at');
      if (allTx.data) {
        const revenue = allTx.data.reduce((sum, t) => sum + (t.amount || 0), 0);
        setTotalRevenue(revenue);
        const today = new Date().toISOString().split('T')[0];
        const todayTx = allTx.data.filter(t => t.completed_at?.startsWith(today));
        setTodayPayments(todayTx.reduce((sum, t) => sum + (t.amount || 0), 0));
      }
    }

    // Appointments
    const { data: appts } = await supabase
      .from('appointments')
      .select('*, service:services(name)')
      .order('appointment_date', { ascending: true })
      .limit(5);

    if (appts) {
      setUpcomingAppts(appts as unknown as UpcomingAppt[]);
      const allAppts = await supabase.from('appointments').select('id, patient_name');
      if (allAppts.data) {
        setTotalAppointments(allAppts.data.length);
        const patients = new Set(allAppts.data.map(a => a.patient_name).filter(Boolean));
        setTotalPatients(patients.size);
      }
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Demo data
  const demoTx: RecentTx[] = [
    { id: '1', transaction_id: 'TXN-98KL23MN', amount: 15000, status: 'completed', completed_at: '2026-03-24T09:00:00', appointment: { patient_name: 'Adebayo Johnson', service: { name: 'General Consultation' } } },
    { id: '2', transaction_id: 'TXN-76HJ45PQ', amount: 12000, status: 'completed', completed_at: '2026-03-24T10:30:00', appointment: { patient_name: 'Fatima Abubakar', service: { name: 'Laboratory Tests' } } },
    { id: '3', transaction_id: 'TXN-54FG67RS', amount: 8000, status: 'completed', completed_at: '2026-03-23T14:00:00', appointment: { patient_name: 'Chukwu Emeka', service: { name: 'Dental Check-up' } } },
    { id: '4', transaction_id: 'TXN-32DE89TU', amount: 6500, status: 'pending', completed_at: '2026-03-23T11:00:00', appointment: { patient_name: 'Ngozi Okonkwo', service: { name: 'Pediatrics' } } },
  ];

  const demoAppts: UpcomingAppt[] = [
    { id: '1', patient_name: 'Amara Obi', appointment_date: '2026-03-25', appointment_time: '09:00 AM', status: 'confirmed', service: { name: 'General Consultation' } },
    { id: '2', patient_name: 'Tunde Bakare', appointment_date: '2026-03-25', appointment_time: '10:30 AM', status: 'confirmed', service: { name: 'Dental Check-up' } },
    { id: '3', patient_name: 'Kemi Adekunle', appointment_date: '2026-03-25', appointment_time: '01:00 PM', status: 'pending', service: { name: 'Laboratory Tests' } },
    { id: '4', patient_name: 'Emeka Nwafor', appointment_date: '2026-03-26', appointment_time: '09:00 AM', status: 'confirmed', service: { name: 'Pediatrics' } },
  ];

  const displayTx = recentTx.length > 0 ? recentTx : demoTx;
  const displayAppts = upcomingAppts.length > 0 ? upcomingAppts : demoAppts;

  return (
    <div className="animate-fadeIn">
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatsCard icon={<DollarSign size={22} color="#2563EB" />}
          iconBg="linear-gradient(135deg, #EFF6FF, #DBEAFE)" iconShadow="0 2px 8px rgba(37,99,235,0.15)"
          value={`₦${(totalRevenue || 2000000).toLocaleString()}`} label="Total Revenue" change="+12.5%" />
        <StatsCard icon={<TrendingUp size={22} color="#10B981" />}
          iconBg="linear-gradient(135deg, #ECFDF5, #D1FAE5)" iconShadow="0 2px 8px rgba(16,185,129,0.15)"
          value={`₦${(todayPayments || 500000).toLocaleString()}`} label="Today's Payments" change="+8.2%" />
        <StatsCard icon={<Users size={22} color="#F59E0B" />}
          iconBg="linear-gradient(135deg, #FFFBEB, #FEF3C7)" iconShadow="0 2px 8px rgba(245,158,11,0.15)"
          value={`${totalPatients || 150}`} label="Total Patients" change="+5.3%" />
        <StatsCard icon={<CalendarDays size={22} color="#7C3AED" />}
          iconBg="linear-gradient(135deg, #F5F3FF, #EDE9FE)" iconShadow="0 2px 8px rgba(124,58,237,0.15)"
          value={`${totalAppointments || 324}`} label="Appointments" change="+3.1%" />
      </div>

      {/* Two Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {/* Recent Transactions */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #F1F5F9' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em' }}>Recent Transactions</h3>
            <a href="/provider/dashboard/transactions" style={{ fontSize: '13px', fontWeight: 600, color: '#2563EB', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all <ArrowUpRight size={14} />
            </a>
          </div>
          <div>
            {displayTx.map((t, i) => (
              <div key={t.id || i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 24px', borderBottom: i < displayTx.length - 1 ? '1px solid #F8FAFC' : 'none',
              }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>{t.appointment?.patient_name || 'N/A'}</p>
                  <p style={{ fontSize: '12px', color: '#94A3B8' }}>{t.appointment?.service?.name}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '14px', fontWeight: 700 }}>₦{t.amount?.toLocaleString()}</p>
                  <span className={`status-${t.status}`} style={{ fontSize: '11px' }}>
                    {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #F1F5F9' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em' }}>Upcoming Appointments</h3>
            <a href="/provider/dashboard/appointments" style={{ fontSize: '13px', fontWeight: 600, color: '#10B981', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all <ArrowUpRight size={14} />
            </a>
          </div>
          <div>
            {displayAppts.map((a, i) => (
              <div key={a.id || i} style={{
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
                    <p style={{ fontSize: '14px', fontWeight: 600 }}>{a.patient_name}</p>
                    <p style={{ fontSize: '12px', color: '#94A3B8' }}>{a.service?.name}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '13px', fontWeight: 500 }}>{a.appointment_date}</p>
                  <p style={{ fontSize: '12px', color: '#94A3B8' }}>{a.appointment_time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
