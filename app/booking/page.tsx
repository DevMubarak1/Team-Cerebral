'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, FileText, Lock, CreditCard, Building2, Clock, Calendar, Heart, Shield, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import StepIndicator from '@/components/StepIndicator';
import { supabase } from '@/lib/supabase';
import { useInterswitchCheckout, generateTxnRef, toKobo, verifyPayment } from '@/lib/useInterswitchCheckout';
import type { Service, Provider, PaymentMethod } from '@/lib/types';

const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM'];

export default function BookingPage() {
  const router = useRouter();
  const checkout = useInterswitchCheckout(true); // true = test mode
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');

  const [transactionId, setTransactionId] = useState('');
  const [completedAt, setCompletedAt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    fetchData();
    // Pre-fill from patient login
    const storedName = localStorage.getItem('patientName');
    const storedEmail = localStorage.getItem('patientEmail');
    if (storedName) setPatientName(storedName);
    if (storedEmail) setPatientEmail(storedEmail);
  }, []);

  async function fetchData() {
    const { data: servicesData } = await supabase.from('services').select('*');
    const { data: providersData } = await supabase.from('providers').select('*');
    if (servicesData) setServices(servicesData);
    if (providersData) setProviders(providersData);
  }

  const handleProceedToPayment = () => {
    if (selectedService && selectedProvider && selectedDate && selectedTime) setStep(2);
  };

  // Create appointment and complete payment flow
  const completePayment = async (txnRef: string, method: string) => {
    try {
      const { data: appointment } = await supabase
        .from('appointments')
        .insert({
          service_id: selectedService!.id,
          provider_id: selectedProvider!.id,
          patient_name: patientName || 'Patient',
          patient_email: patientEmail || '',
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          status: 'confirmed',
        })
        .select()
        .single();

      if (appointment) {
        // Verify payment server-side and record transaction
        await verifyPayment(txnRef, appointment.id, selectedService!.price, method);
      }
    } catch (err) { console.error('Payment error:', err); }

    const now = new Date();
    setCompletedAt(
      now.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) + ', ' +
      now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    );
  };

  // Handle Interswitch Inline Checkout for card payments
  const handleCardPayment = () => {
    if (!patientEmail) { setPaymentError('Please enter your email address'); return; }
    setPaymentError('');
    setIsProcessing(true);

    const txnRef = generateTxnRef();
    setTransactionId(txnRef);

    checkout({
      merchant_code: process.env.NEXT_PUBLIC_INTERSWITCH_MERCHANT_CODE || 'MX6072',
      pay_item_id: process.env.NEXT_PUBLIC_INTERSWITCH_PAY_ITEM_ID || '9405967',
      txn_ref: txnRef,
      amount: toKobo(selectedService!.price),
      currency: 566, // NGN
      cust_id: patientEmail,
      cust_name: patientName || undefined,
      pay_item_name: selectedService!.name,
      site_redirect_url: window.location.origin + '/booking',
      onComplete: async (response) => {
        if (response.resp === '00') {
          // Payment successful — verify server-side and record
          await completePayment(txnRef, 'card');
          setIsProcessing(false);
          setStep(3);
        } else {
          setPaymentError(`Payment failed: ${response.desc || 'Transaction was not completed'}. You can try again.`);
          setIsProcessing(false);
        }
      },
      mode: 'TEST',
    });
  };

  // Handle bank transfer (manual confirmation)
  const handleTransferPayment = async () => {
    setIsProcessing(true);
    const txnRef = generateTxnRef();
    setTransactionId(txnRef);
    await completePayment(txnRef, 'transfer');
    setIsProcessing(false);
    setStep(3);
  };

  const demoServices = [
    { id: 'demo1', name: 'General Health Check Up', price: 6000, provider_id: '', description: 'Full body health screening', category: 'Consultation', duration: '1 hour', created_at: '' },
    { id: 'demo2', name: 'Dental Check-up', price: 8000, provider_id: '', description: 'Comprehensive dental examination', category: 'Dental', duration: '45 mins', created_at: '' },
    { id: 'demo3', name: 'Laboratory Tests', price: 12000, provider_id: '', description: 'Complete blood count and analysis', category: 'Laboratory', duration: '1 hour', created_at: '' },
    { id: 'demo4', name: 'Pediatrics Consultation', price: 6500, provider_id: '', description: 'Child healthcare', category: 'Consultation', duration: '30 mins', created_at: '' },
    { id: 'demo5', name: 'General Consultation', price: 5000, provider_id: '', description: 'Standard GP consultation', category: 'Consultation', duration: '30 mins', created_at: '' },
  ];

  const demoProviders = [
    { id: 'p1', name: 'Maryland Health Center', location: 'Lagos Island', email: '', created_at: '' },
    { id: 'p2', name: 'Lekki Hospital', location: 'Lekki, Lagos', email: '', created_at: '' },
    { id: 'p3', name: 'Saint Health Clinic', location: 'Ikeja, Lagos', email: '', created_at: '' },
  ];

  const displayServices = services.length > 0 ? services : demoServices;
  const displayProviders = providers.length > 0 ? providers : demoProviders;

  return (
    <div className="animate-fadeIn">
      {/* Step Indicator */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <StepIndicator currentStep={step} steps={['Booking', 'Payment', 'Confirmation']} />
      </div>

      {/* Content */}
      <div className="booking-content" style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* === STEP 1 === */}
        {step === 1 && (
          <div className="animate-fadeIn">
            <div className="card booking-card" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
              {/* Select Service */}
              <section style={{ marginBottom: '36px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Heart size={14} color="#2563EB" />
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em' }}>Select Service</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {displayServices.map((s) => (
                    <button key={s.id} onClick={() => setSelectedService(s)}
                      className={`selection-item ${selectedService?.id === s.id ? 'active' : ''}`}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{s.name}</div>
                        <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                          ₦{s.price.toLocaleString()} · {s.duration}
                        </div>
                      </div>
                      {selectedService?.id === s.id && <CheckCircle2 size={20} color="#2563EB" />}
                    </button>
                  ))}
                </div>
              </section>

              {/* Select Provider */}
              <section style={{ marginBottom: '36px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '8px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={14} color="#10B981" />
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em' }}>Select Provider</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {displayProviders.map((p) => (
                    <button key={p.id} onClick={() => setSelectedProvider(p)}
                      className={`selection-item ${selectedProvider?.id === p.id ? 'active' : ''}`}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{p.name}</div>
                        <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>{p.location}</div>
                      </div>
                      <div className={`radio-dot ${selectedProvider?.id === p.id ? 'active' : ''}`} />
                    </button>
                  ))}
                </div>
              </section>

              {/* Select Date */}
              <section style={{ marginBottom: '36px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '8px', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={14} color="#F59E0B" />
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em' }}>Select Date</h3>
                </div>
                <input type="date" className="input" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  style={{ cursor: 'pointer' }}
                />
              </section>

              {/* Select Time */}
              <section style={{ marginBottom: '36px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '8px', background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={14} color="#7C3AED" />
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em' }}>Select Time</h3>
                </div>
                <div className="time-grid" style={{ display: 'grid', gap: '8px' }}>
                  {timeSlots.map((time) => (
                    <button key={time} onClick={() => setSelectedTime(time)}
                      style={{
                        padding: '14px', borderRadius: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                        fontSize: '14px', fontWeight: 500, transition: 'all 0.2s',
                        background: selectedTime === time ? '#EFF6FF' : '#F1F5F9',
                        border: selectedTime === time ? '2px solid #2563EB' : '2px solid transparent',
                        color: selectedTime === time ? '#2563EB' : '#475569',
                      }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </section>

              <button className="btn-primary" onClick={handleProceedToPayment}
                disabled={!selectedService || !selectedProvider || !selectedDate || !selectedTime}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}

        {/* === STEP 2 === */}
        {step === 2 && (
          <div className="animate-fadeIn">
            <div className="card booking-card" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
              {/* Security badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: '#ECFDF5', padding: '6px 14px', borderRadius: '8px', marginBottom: '24px',
              }}>
                <Lock size={12} color="#10B981" />
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#059669' }}>Secured by Interswitch</span>
              </div>

              {/* Payment Method */}
              <section style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', letterSpacing: '-0.01em' }}>
                  Select Payment Method
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button onClick={() => setPaymentMethod('card')}
                    className={`selection-item ${paymentMethod === 'card' ? 'active' : ''}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CreditCard size={18} color="#2563EB" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>Card Payment</div>
                        <div style={{ fontSize: '12px', color: '#94A3B8' }}>Verve, Mastercard, Visa</div>
                      </div>
                    </div>
                    <div className={`radio-dot ${paymentMethod === 'card' ? 'active' : ''}`} />
                  </button>

                  <button onClick={() => setPaymentMethod('transfer')}
                    className={`selection-item ${paymentMethod === 'transfer' ? 'active' : ''}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Building2 size={18} color="#10B981" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>Bank Transfer</div>
                        <div style={{ fontSize: '12px', color: '#94A3B8' }}>Direct bank payment</div>
                      </div>
                    </div>
                    <div className={`radio-dot ${paymentMethod === 'transfer' ? 'active' : ''}`} />
                  </button>
                </div>
              </section>

              {/* Card Payment — Interswitch Inline Checkout */}
              {paymentMethod === 'card' && (
                <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>Full Name</label>
                    <input className="input" placeholder="John Doe" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>Email Address</label>
                    <input className="input" type="email" placeholder="patient@email.com" value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} />
                  </div>

                  {paymentError && (
                    <div style={{ background: '#FEF2F2', color: '#DC2626', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', border: '1px solid #FECACA', fontWeight: 500 }}>
                      {paymentError}
                    </div>
                  )}

                  {/* Order Summary */}
                  <div style={{ background: '#F8FAFC', borderRadius: '14px', padding: '20px', border: '1px solid #E2E8F0' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em', marginBottom: '12px' }}>ORDER SUMMARY</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#64748B' }}>{selectedService?.name}</span>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>₦{selectedService?.price.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700 }}>Total</span>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: '#2563EB' }}>₦{selectedService?.price.toLocaleString()}</span>
                    </div>
                  </div>

                  <button className="btn-primary" onClick={handleCardPayment} disabled={isProcessing} style={{ marginTop: '4px', gap: '10px' }}>
                    {isProcessing ? (
                      <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</>
                    ) : (
                      <><CreditCard size={18} /> Pay ₦{selectedService?.price.toLocaleString()} with Interswitch</>
                    )}
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '4px' }}>
                    <Shield size={12} color="#10B981" />
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>Your card details are handled securely by Interswitch</span>
                  </div>
                </div>
              )}

              {/* Transfer Details */}
              {paymentMethod === 'transfer' && (
                <div className="animate-fadeIn">
                  <div style={{
                    background: 'linear-gradient(135deg, #F8FAFC, #EFF6FF)',
                    borderRadius: '16px', padding: '28px', border: '1px solid #DBEAFE', marginBottom: '20px',
                  }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Transfer Details</h3>
                    {[
                      { label: 'Bank Name', value: 'Providus Bank' },
                      { label: 'Account Number', value: '1234567890' },
                      { label: 'Account Name', value: 'HealthPay Technologies' },
                      { label: 'Amount', value: `₦${selectedService?.price.toLocaleString()}` },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #E2E8F0' }}>
                        <span style={{ fontSize: '14px', color: '#64748B' }}>{label}</span>
                        <span style={{ fontSize: '14px', fontWeight: 700 }}>{value}</span>
                      </div>
                    ))}
                    <p style={{ textAlign: 'center', fontSize: '12px', color: '#94A3B8', marginTop: '16px' }}>
                      Complete the transfer and click confirm below
                    </p>
                  </div>
                  <button className="btn-primary" onClick={handleTransferPayment} disabled={isProcessing}>
                    {isProcessing ? 'Confirming...' : 'I\'ve Made the Transfer'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* === STEP 3: RECEIPT === */}
        {step === 3 && (
          <div className="animate-scaleIn" style={{ textAlign: 'center' }}>
            {/* Success Animation */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'linear-gradient(135deg, #10B981, #34D399)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
              }}>
                <CheckCircle2 size={36} color="white" />
              </div>
              <h1 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>Payment Successful</h1>
              <p style={{ fontSize: '15px', color: '#64748B' }}>Your appointment has been confirmed</p>
            </div>

            {/* Receipt Card */}
            <div className="card" style={{ textAlign: 'left', padding: 0, overflow: 'hidden', maxWidth: '420px', margin: '0 auto', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
              {/* Receipt Header */}
              <div style={{ background: 'linear-gradient(135deg, #EFF6FF, #F0F7FF)', padding: '24px 28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em' }}>HealthPay</h2>
                    <p style={{ fontSize: '12px', color: '#94A3B8' }}>Digital Healthcare Payments</p>
                  </div>
                  <FileText size={22} color="#94A3B8" />
                </div>
                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '12px', fontWeight: 500 }}>Receipt #{transactionId}</p>
              </div>

              {/* Details */}
              <div style={{ padding: '24px 28px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em', marginBottom: '14px' }}>TRANSACTION DETAILS</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  {[
                    { label: 'Service', value: selectedService?.name, extra: `₦${selectedService?.price.toLocaleString()}` },
                    { label: 'Date', value: selectedDate },
                    { label: 'Time', value: selectedTime },
                  ].map(({ label, value, extra }) => (
                    <div key={label}>
                      <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>{label}</span>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500 }}>{value}</span>
                        {extra && <span style={{ fontSize: '14px', fontWeight: 700, color: '#2563EB' }}>{extra}</span>}
                      </div>
                    </div>
                  ))}
                </div>

                <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em', marginBottom: '10px' }}>PROVIDER</h4>
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>{selectedProvider?.name}</p>
                  <p style={{ fontSize: '13px', color: '#64748B' }}>{selectedProvider?.location}</p>
                </div>

                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
                  <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em', marginBottom: '14px' }}>PAYMENT INFO</h4>
                  <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { label: 'Method', value: paymentMethod === 'card' ? 'Card Payment' : 'Bank Transfer' },
                      { label: 'Transaction ID', value: transactionId },
                      { label: 'Completed', value: completedAt },
                      { label: 'Status', value: 'Completed', color: '#10B981' },
                    ].map(({ label, value, color }) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13px', color: '#94A3B8' }}>{label}</span>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: color || '#0F172A' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Total */}
              <div style={{
                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                padding: '18px 28px', textAlign: 'center',
              }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'white' }}>
                  Total Paid: ₦{selectedService?.price.toLocaleString()}
                </span>
              </div>
            </div>

            <button className="btn-secondary" onClick={() => router.push('/patient/dashboard')}
              style={{ maxWidth: '420px', margin: '20px auto 0' }}>
              Go to My Dashboard
            </button>
          </div>
        )}
      </div>

      <style>{`
        .booking-card { padding: 32px; }
        .time-grid { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 640px) {
          .booking-card { padding: 20px 16px !important; }
          .time-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
