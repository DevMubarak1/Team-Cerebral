'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('providerId');
    if (!id) {
      router.push('/provider/login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#F8FAFC',
      }}>
        <div style={{
          width: 40, height: 40, border: '3px solid #E2E8F0', borderTopColor: '#10B981',
          borderRadius: '50%', animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
