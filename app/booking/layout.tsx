'use client';

import PatientDashboardLayout from '@/components/PatientDashboardLayout';

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return <PatientDashboardLayout>{children}</PatientDashboardLayout>;
}
