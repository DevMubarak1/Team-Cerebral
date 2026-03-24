'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PatientDashboardIndex() {
  const router = useRouter();
  useEffect(() => { router.replace('/patient/dashboard/overview'); }, [router]);
  return null;
}
