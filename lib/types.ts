export interface Provider {
  id: string;
  name: string;
  email: string;
  location: string;
  created_at: string;
}

export interface Service {
  id: string;
  provider_id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  service_id: string;
  provider_id: string;
  patient_name: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  // Joined
  service?: Service;
  provider?: Provider;
}

export interface Transaction {
  id: string;
  appointment_id: string;
  transaction_id: string;
  amount: number;
  payment_method: 'card' | 'transfer';
  status: 'pending' | 'completed' | 'failed';
  completed_at: string;
  // Joined
  appointment?: Appointment;
}

export type PaymentMethod = 'card' | 'transfer';

export interface BookingData {
  service: Service | null;
  provider: Provider | null;
  date: string;
  time: string;
  patientName: string;
  paymentMethod: PaymentMethod | null;
}
