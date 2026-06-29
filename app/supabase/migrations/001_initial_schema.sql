-- ============================================================
-- SabiFit — Initial Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Shops (fashion design houses)
CREATE TABLE shops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Users (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  phone TEXT,
  full_name TEXT,
  shop_id UUID REFERENCES shops(id) ON DELETE SET NULL,
  role TEXT CHECK (role IN ('owner', 'senior_staff', 'junior_staff', 'read_only')) DEFAULT 'owner',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  photo_url TEXT,
  notes TEXT,
  archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Measurements
CREATE TABLE measurements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  garment_type TEXT NOT NULL,
  unit TEXT CHECK (unit IN ('in', 'cm')) DEFAULT 'in',
  fields JSONB NOT NULL DEFAULT '{}',
  photo_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  notes TEXT,
  status TEXT CHECK (status IN ('draft', 'pending', 'approved', 'flagged')) DEFAULT 'draft',
  created_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  measurement_id UUID REFERENCES measurements(id) ON DELETE SET NULL,
  garment_type TEXT NOT NULL,
  fabric_details TEXT,
  agreed_price_kobo BIGINT DEFAULT 0,
  deposit_kobo BIGINT DEFAULT 0,
  balance_kobo BIGINT GENERATED ALWAYS AS (agreed_price_kobo - deposit_kobo) STORED,
  deadline DATE,
  status TEXT CHECK (status IN ('pending', 'in_progress', 'fitting', 'ready', 'delivered', 'closed')) DEFAULT 'pending',
  assigned_staff_id UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  amount_kobo BIGINT NOT NULL DEFAULT 0,
  status TEXT CHECK (status IN ('unpaid', 'paid', 'cancelled')) DEFAULT 'unpaid',
  paystack_ref TEXT,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Measurement Links (public token-based links for diaspora clients)
CREATE TABLE measurement_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  garment_type TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL DEFAULT uuid_generate_v4()::TEXT,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  used_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurement_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users see own shop" ON shops FOR SELECT USING (id IN (SELECT shop_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Users see shop members" ON users FOR SELECT USING (shop_id IN (SELECT shop_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Clients visible to shop" ON clients FOR ALL USING (shop_id IN (SELECT shop_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Measurements visible to shop" ON measurements FOR ALL USING (client_id IN (SELECT id FROM clients WHERE shop_id IN (SELECT shop_id FROM users WHERE id = auth.uid())));
CREATE POLICY "Orders visible to shop" ON orders FOR ALL USING (shop_id IN (SELECT shop_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Invoices visible to shop" ON invoices FOR ALL USING (shop_id IN (SELECT shop_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Shop can manage links" ON measurement_links FOR ALL USING (shop_id IN (SELECT shop_id FROM users WHERE id = auth.uid()));
CREATE POLICY "Public can read by token" ON measurement_links FOR SELECT USING (expires_at > NOW());

-- Indexes
CREATE INDEX idx_clients_shop_id ON clients(shop_id);
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_measurements_client_id ON measurements(client_id);
CREATE INDEX idx_orders_shop_id ON orders(shop_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_invoices_shop_id ON invoices(shop_id);
CREATE INDEX idx_shops_slug ON shops(slug);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$
LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION updated_at();
CREATE TRIGGER invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION updated_at();
CREATE TRIGGER measurements_updated_at BEFORE UPDATE ON measurements FOR EACH ROW EXECUTE FUNCTION updated_at();
