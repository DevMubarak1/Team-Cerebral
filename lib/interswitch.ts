// Interswitch API Configuration & Helpers
// Based on interswitch-setup and interswitch-web-checkout skills

export interface InterswitchConfig {
  env: 'test' | 'live';
  clientId: string;
  secretKey: string;
  merchantCode: string;
  payItemId: string;
  passportUrl: string;
  collectionsBaseUrl: string;
  webCheckoutUrl: string;
}

export function getConfig(): InterswitchConfig {
  const isLive = process.env.INTERSWITCH_ENV === 'live';
  return {
    env: isLive ? 'live' : 'test',
    clientId: isLive
      ? process.env.LIVE_CLIENT_ID!
      : process.env.TEST_CLIENT_ID!,
    secretKey: isLive
      ? process.env.LIVE_SECRET_KEY!
      : process.env.TEST_SECRET_KEY!,
    merchantCode: isLive
      ? process.env.LIVE_MERCHANT_CODE!
      : process.env.TEST_MERCHANT_CODE!,
    payItemId: process.env.PAY_ITEM_ID || '9405967',
    passportUrl: isLive
      ? 'https://passport.interswitchng.com/passport/oauth/token'
      : 'https://passport.k8.isw.la/passport/oauth/token',
    collectionsBaseUrl: isLive
      ? 'https://interswitchng.com'
      : 'https://qa.interswitchng.com',
    webCheckoutUrl: isLive
      ? 'https://newwebpay.interswitchng.com'
      : 'https://newwebpay.qa.interswitchng.com',
  };
}

// OAuth 2.0 Token Generation
interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  merchant_code: string;
}

let cachedToken: { token: AccessTokenResponse; expiresAt: number } | null = null;

export async function generateAccessToken(): Promise<AccessTokenResponse> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now) {
    return cachedToken.token;
  }

  const config = getConfig();
  const credentials = Buffer.from(`${config.clientId}:${config.secretKey}`).toString('base64');

  const response = await fetch(
    `${config.passportUrl}?grant_type=client_credentials`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Interswitch auth failed: ${response.status} ${response.statusText}`);
  }

  const token: AccessTokenResponse = await response.json();
  cachedToken = {
    token,
    expiresAt: now + token.expires_in * 1000 - 60000,
  };

  return token;
}

// Transaction Requery (CRITICAL - always verify server-side)
export interface RequeryResponse {
  Amount: number;
  ResponseCode: string;
  ResponseDescription: string;
  MerchantReference: string;
  PaymentReference: string;
  RetrievalReferenceNumber: string;
  TransactionDate: string;
}

export async function requeryTransaction(txnRef: string): Promise<RequeryResponse> {
  const config = getConfig();
  const token = await generateAccessToken();

  const response = await fetch(
    `${config.collectionsBaseUrl}/collections/api/v1/gettransaction.json` +
    `?merchantcode=${config.merchantCode}&transactionreference=${txnRef}&amount=0`,
    {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Transaction requery failed: ${response.status}`);
  }

  return response.json();
}

// Client-side config (safe to expose)
export function getClientConfig() {
  return {
    merchantCode: process.env.NEXT_PUBLIC_INTERSWITCH_MERCHANT_CODE || 'MX6072',
    payItemId: process.env.NEXT_PUBLIC_INTERSWITCH_PAY_ITEM_ID || '9405967',
    isTest: process.env.INTERSWITCH_ENV !== 'live',
  };
}
