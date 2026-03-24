'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, CreditCard, CheckCircle, Shield, ArrowRight, X, Heart } from 'lucide-react';

const slides = [
  {
    icon: <img src="/favicon.png" alt="HealthPay Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '24px' }} />,
    title: 'Welcome to HealthPay',
    description:
      "Nigeria's unified digital healthcare payments and billing platform. Seamless transactions for patients, providers, and insurers.",
    gradient: 'transparent',
  },
  {
    icon: <CreditCard size={32} strokeWidth={2.5} />,
    title: 'Fast & Secure Payments',
    description:
      'Book appointments and pay for healthcare services instantly using Verve cards, bank transfers, and more — all powered by Interswitch.',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
  },
  {
    icon: <CheckCircle size={32} strokeWidth={2.5} />,
    title: 'Complete Transparency',
    description:
      'Get instant digital receipts, track all transactions in real-time, and enjoy full transparency across the healthcare payment ecosystem.',
    gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
  },
  {
    icon: <Shield size={32} strokeWidth={2.5} />,
    title: 'Bank-Grade Security',
    description:
      'Your payments are protected with end-to-end encryption and bank-grade security. Trusted by healthcare providers nationwide.',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
  },
];

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<'right' | 'left'>('right');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  const goNext = () => {
    if (currentSlide === slides.length - 1) {
      router.push('/home');
      return;
    }
    setDirection('right');
    setCurrentSlide((prev) => prev + 1);
  };

  const goBack = () => {
    if (currentSlide > 0) {
      setDirection('left');
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const skip = () => router.push('/home');
  const slide = slides[currentSlide];
  const isLast = currentSlide === slides.length - 1;
  const isFirst = currentSlide === 0;

  if (!mounted) return null;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        background: '#F8FAFC',
      }}
    >
      {/* Background decoration */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%', width: '500px', height: '500px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', left: '-10%', width: '400px', height: '400px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '60%', width: '300px', height: '300px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)',
        }} />
      </div>

      {/* Skip */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '24px 32px', position: 'relative', zIndex: 10 }}>
        <button
          onClick={skip}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(8px)', border: '1px solid rgba(226,232,240,0.8)',
            padding: '8px 16px', borderRadius: '10px', cursor: 'pointer',
            fontSize: '14px', fontWeight: 500, color: '#64748B', fontFamily: 'var(--font-sans)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#0F172A'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.8)'; e.currentTarget.style.color = '#64748B'; }}
        >
          Skip <X size={16} />
        </button>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px 48px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '440px', width: '100%' }}>
          {/* Card */}
          <div
            className="glass"
            style={{
              borderRadius: '28px', padding: '48px 36px', textAlign: 'center',
              boxShadow: '0 8px 40px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
              background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(24px)',
            }}
          >
            {/* Animated Icon */}
            <div
              key={`icon-${currentSlide}`}
              className={direction === 'right' ? 'animate-slideRight' : 'animate-slideLeft'}
            >
              <div
                className="animate-float"
                style={{
                  width: 80, height: 80, borderRadius: '24px',
                  background: slide.gradient, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 36px', color: 'white',
                  boxShadow: `0 8px 24px ${currentSlide === 0 ? 'rgba(37,99,235,0.3)' : currentSlide === 1 ? 'rgba(124,58,237,0.3)' : currentSlide === 2 ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                }}
              >
                {slide.icon}
              </div>
            </div>

            {/* Text */}
            <div
              key={`text-${currentSlide}`}
              className={direction === 'right' ? 'animate-slideRight' : 'animate-slideLeft'}
            >
              <h1 style={{
                fontSize: '28px', fontWeight: 800, lineHeight: 1.2, marginBottom: '16px',
                color: '#0F172A', letterSpacing: '-0.02em',
              }}>
                {slide.title}
              </h1>
              <p style={{
                fontSize: '15px', lineHeight: 1.7, color: '#64748B',
                maxWidth: '320px', margin: '0 auto',
              }}>
                {slide.description}
              </p>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '44px' }}>
              {!isFirst && (
                <button className="btn-secondary" onClick={goBack} style={{ width: 'auto', padding: '14px 28px' }}>
                  Back
                </button>
              )}
              <button
                className="btn-primary"
                onClick={goNext}
                style={{ flex: 1, padding: '14px 28px' }}
              >
                {isLast ? 'Get Started' : 'Next'}
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Progress Dots */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '28px' }}>
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > currentSlide ? 'right' : 'left'); setCurrentSlide(i); }}
                  style={{
                    width: i === currentSlide ? '28px' : '10px', height: '10px',
                    borderRadius: '999px', border: 'none', cursor: 'pointer',
                    background: i === currentSlide ? slides[currentSlide].gradient : '#CBD5E1',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: i === currentSlide ? 1 : 0.5,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center', padding: '24px', position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
      }}>
        <Heart size={12} fill="#EF4444" color="#EF4444" />
        <span style={{ fontSize: '12px', color: '#94A3B8', letterSpacing: '0.02em' }}>
          Powered by Interswitch · Secure · Trusted
        </span>
      </div>
    </div>
  );
}
