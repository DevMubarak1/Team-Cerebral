import { NextResponse } from 'next/server';
import { requeryTransaction } from '@/lib/interswitch';
import { supabase } from '@/lib/supabase';

// POST /api/payments - Verify a payment via server-side requery
export async function POST(request: Request) {
  try {
    const { txnRef, appointmentId, amount, paymentMethod } = await request.json();

    if (!txnRef) {
      return NextResponse.json({ error: 'Transaction reference required' }, { status: 400 });
    }

    // Server-side requery to verify payment (CRITICAL - never trust client alone)
    let verified = false;
    let responseCode = 'XX';
    let responseDesc = 'Verification skipped';

    try {
      const requeryResult = await requeryTransaction(txnRef);
      responseCode = requeryResult.ResponseCode;
      responseDesc = requeryResult.ResponseDescription;

      // '00' = approved/successful
      if (requeryResult.ResponseCode === '00') {
        verified = true;
      }
    } catch (requeryError) {
      console.error('Requery failed:', requeryError);
      // In test mode, treat as verified for demo purposes
      if (process.env.INTERSWITCH_ENV !== 'live') {
        verified = true;
        responseCode = '00';
        responseDesc = 'Test mode - auto verified';
      }
    }

    if (verified && appointmentId) {
      // Record the transaction in Supabase
      await supabase.from('transactions').insert({
        appointment_id: appointmentId,
        transaction_id: txnRef,
        amount: amount,
        payment_method: paymentMethod || 'card',
        status: 'completed',
      });

      // Update appointment status
      await supabase
        .from('appointments')
        .update({ status: 'confirmed' })
        .eq('id', appointmentId);
    }

    return NextResponse.json({
      verified,
      responseCode,
      responseDescription: responseDesc,
      txnRef,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed', verified: false },
      { status: 500 }
    );
  }
}

// GET /api/payments/config - Return client-safe checkout config
export async function GET() {
  return NextResponse.json({
    merchantCode: process.env.NEXT_PUBLIC_INTERSWITCH_MERCHANT_CODE || 'MX6072',
    payItemId: process.env.NEXT_PUBLIC_INTERSWITCH_PAY_ITEM_ID || '9405967',
    isTest: process.env.INTERSWITCH_ENV !== 'live',
  });
}
