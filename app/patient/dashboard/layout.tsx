'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PatientDashboardLayout from '@/components/PatientDashboardLayout';

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('patientEmail');
    if (!email) {
      router.push('/patient/login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #E2E8F0', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  return <PatientDashboardLayout>{children}</PatientDashboardLayout>;
}
