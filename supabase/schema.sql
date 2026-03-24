-- HealthPay Database Schema
-- Run this in Supabase SQL Editor

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS providers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users (shared auth for patients and providers)
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('patient', 'provider')),
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Providers (linked to users)
CREATE TABLE providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price DECIMAL NOT NULL,
  duration TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
  patient_name TEXT,
  patient_email TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  transaction_id TEXT UNIQUE NOT NULL,
  amount DECIMAL NOT NULL,
  payment_method TEXT,
  status TEXT DEFAULT 'completed',
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Permissive policies for hackathon (allow all operations with anon key)
CREATE POLICY "Allow all on users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on providers" ON providers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on services" ON services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on appointments" ON appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on transactions" ON transactions FOR ALL USING (true) WITH CHECK (true);

-- =========================================
-- SEED DATA
-- =========================================

-- Test user (can login as both patient and provider)
INSERT INTO users (email, password, name, role) VALUES
  ('testing@healthpay.com', 'testing', 'HealthPay Admin', 'provider');

-- Also insert as patient role
INSERT INTO users (email, password, name, role) VALUES
  ('testing@healthpay.com', 'testing', 'HealthPay Admin', 'patient')
ON CONFLICT (email) DO NOTHING;

-- NOTE: Since email is UNIQUE, we allow same email to work for both roles
-- by checking role in the login queries. Let's adjust:
-- Drop the unique constraint on email and add a composite unique instead
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE users ADD CONSTRAINT users_email_role_unique UNIQUE (email, role);

-- Re-insert patient role
INSERT INTO users (email, password, name, role) VALUES
  ('testing@healthpay.com', 'testing', 'HealthPay Admin', 'patient');

-- Seed Providers
INSERT INTO providers (name, email, location) VALUES
  ('Maryland Health Center', 'maryland@healthpay.ng', 'Lagos Island'),
  ('Lekki Hospital', 'lekki@healthpay.ng', 'Lekki'),
  ('Saint Health Clinic', 'saint@healthpay.ng', 'Ikeja');

-- Link test user to a provider
UPDATE providers SET user_id = (SELECT id FROM users WHERE email = 'testing@healthpay.com' AND role = 'provider' LIMIT 1) WHERE email = 'maryland@healthpay.ng';

-- Also create provider entry for test user
INSERT INTO providers (user_id, name, email, location)
SELECT id, 'HealthPay Admin Clinic', 'testing@healthpay.com', 'Lagos'
FROM users WHERE email = 'testing@healthpay.com' AND role = 'provider'
ON CONFLICT (email) DO NOTHING;

-- Seed Services for Maryland Health Center
INSERT INTO services (provider_id, name, description, category, price, duration)
SELECT p.id, s.name, s.description, s.category, s.price, s.duration
FROM providers p
CROSS JOIN (
  VALUES 
    ('General Consultation', 'Standard consultation with general practitioner', 'Consultation', 5000, '30 mins'),
    ('Laboratory Tests', 'Complete blood count and basic tests', 'Laboratory', 12000, '1 hour'),
    ('Dental Check-up', 'Comprehensive dental examination', 'Dental', 8000, '45 mins'),
    ('Pediatrics', 'Child healthcare consultation', 'Consultation', 6500, '30 mins'),
    ('General Health Check Up', 'Full body health screening', 'Consultation', 6000, '1 hour')
) AS s(name, description, category, price, duration)
WHERE p.name = 'Maryland Health Center';

INSERT INTO services (provider_id, name, description, category, price, duration)
SELECT p.id, s.name, s.description, s.category, s.price, s.duration
FROM providers p
CROSS JOIN (
  VALUES 
    ('General Consultation', 'Standard consultation with specialist', 'Consultation', 7000, '30 mins'),
    ('X-Ray Scan', 'Digital X-Ray imaging', 'Radiology', 15000, '30 mins'),
    ('Blood Test', 'Comprehensive blood analysis', 'Laboratory', 10000, '45 mins')
) AS s(name, description, category, price, duration)
WHERE p.name = 'Lekki Hospital';

INSERT INTO services (provider_id, name, description, category, price, duration)
SELECT p.id, s.name, s.description, s.category, s.price, s.duration
FROM providers p
CROSS JOIN (
  VALUES 
    ('General Consultation', 'Walk-in consultation', 'Consultation', 4000, '20 mins'),
    ('Eye Examination', 'Comprehensive eye test', 'Consultation', 8000, '30 mins'),
    ('Vaccination', 'Standard immunization', 'Pharmacy', 3500, '15 mins')
) AS s(name, description, category, price, duration)
WHERE p.name = 'Saint Health Clinic';

-- Services for HealthPay Admin Clinic (test user's clinic)
INSERT INTO services (provider_id, name, description, category, price, duration)
SELECT p.id, s.name, s.description, s.category, s.price, s.duration
FROM providers p
CROSS JOIN (
  VALUES 
    ('General Consultation', 'Professional medical consultation', 'Consultation', 5000, '30 mins'),
    ('Lab Test Package', 'Full blood work and urinalysis', 'Laboratory', 10000, '1 hour'),
    ('Health Screening', 'Complete body checkup', 'Consultation', 15000, '2 hours')
) AS s(name, description, category, price, duration)
WHERE p.email = 'testing@healthpay.com';
