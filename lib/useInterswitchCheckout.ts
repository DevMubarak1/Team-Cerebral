'use client';

import { useEffect, useRef } from 'react';

// Declare global types for Interswitch Inline Checkout
declare global {
  interface Window {
    webpayCheckout: (request: InterswitchCheckoutRequest) => void;
  }
}

export interface InterswitchCheckoutRequest {
  merchant_code: string;
  pay_item_id: string;
  txn_ref: string;
  amount: number;
  currency: number;
  cust_id: string;
  cust_name?: string;
  pay_item_name?: string;
  site_redirect_url: string; // REQUIRED by Interswitch
  onComplete: (response: InterswitchPaymentResponse) => void;
  mode?: 'TEST' | 'LIVE';
}

export interface InterswitchPaymentResponse {
  txnref: string;
  payRef: string;
  retRef: string;
  cardNum: string;
  apprAmt: number;
  resp: string;      // '00' = success
  desc: string;
}

export function useInterswitchCheckout(isTest = true) {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    const script = document.createElement('script');
    script.src = isTest
      ? 'https://newwebpay.qa.interswitchng.com/inline-checkout.js'
      : 'https://newwebpay.interswitchng.com/inline-checkout.js';
    script.async = true;
    document.body.appendChild(script);
    loaded.current = true;
  }, [isTest]);

  const checkout = (request: InterswitchCheckoutRequest) => {
    if (typeof window !== 'undefined' && window.webpayCheckout) {
      window.webpayCheckout(request);
    } else {
      console.error('Interswitch checkout script not loaded yet. Retrying in 1s...');
      // Retry after a brief delay for slow script loads
      setTimeout(() => {
        if (window.webpayCheckout) {
          window.webpayCheckout(request);
        } else {
          console.error('Interswitch checkout script failed to load');
        }
      }, 1000);
    }
  };

  return checkout;
}

// Generate unique transaction reference
export function generateTxnRef(): string {
  return `HP-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

// Convert amount to kobo (minor currency)
export function toKobo(naira: number): number {
  return Math.round(naira * 100);
}

// Verify payment server-side
export async function verifyPayment(txnRef: string, appointmentId: string, amount: number, paymentMethod: string) {
  const response = await fetch('/api/payments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ txnRef, appointmentId, amount, paymentMethod }),
  });

  return response.json();
}
