// Database types for SabiFit
export type Json = Record<string, unknown>;

export type ShopRole = 'owner' | 'senior_staff' | 'junior_staff' | 'read_only';
export type Gender = 'male' | 'female' | 'other';
export type MeasurementStatus = 'draft' | 'pending' | 'approved' | 'flagged';
export type OrderStatus = 'pending' | 'in_progress' | 'fitting' | 'ready' | 'delivered' | 'closed';
export type InvoiceStatus = 'unpaid' | 'paid' | 'cancelled';
export type Unit = 'in' | 'cm';

export interface Shop {
  id: string;
  name: string;
  slug: string;
  phone: string;
  address: string | null;
  logo_url: string | null;
  created_at: string;
}

export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string | null;
  shop_id: string | null;
  role: ShopRole | null;
  created_at: string;
}

export interface Client {
  id: string;
  shop_id: string;
  full_name: string;
  phone: string;
  email: string | null;
  gender: Gender | null;
  photo_url: string | null;
  notes: string | null;
  archived: boolean;
  created_at: string;
}

export interface Measurement {
  id: string;
  client_id: string;
  garment_type: string;
  unit: Unit;
  fields: Json;
  photo_urls: string[];
  notes: string | null;
  status: MeasurementStatus;
  created_by: string;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  shop_id: string;
  client_id: string;
  measurement_id: string | null;
  garment_type: string;
  fabric_details: string | null;
  agreed_price_kobo: number;
  deposit_kobo: number;
  balance_kobo: number;
  deadline: string | null;
  status: OrderStatus;
  assigned_staff_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  shop_id: string;
  order_id: string;
  client_id: string;
  amount_kobo: number;
  status: InvoiceStatus;
  paystack_ref: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface MeasurementLink {
  id: string;
  shop_id: string;
  client_id: string | null;
  garment_type: string;
  token: string;
  expires_at: string;
  used_at: string | null;
  created_by: string;
}

export type GarmentType =
  | 'agbada'
  | 'kaftan'
  | 'buba_sokoto'
  | 'senator'
  | 'native_shirt_trouser'
  | 'dashiki'
  | 'babban_riga'
  | 'kperti'
  | 'blouse'
  | 'wrapper_set'
  | 'iro_buba'
  | 'kaba'
  | 'gown'
  | 'kaba_wrapper'
  | 'maternity'
  | 'aso_oke'
  | 'children';

export const GARMENT_LABELS: Record<GarmentType, string> = {
  agbada: 'Agbada (Complete)',
  kaftan: 'Kaftan / Babariga',
  buba_sokoto: 'Buba + Sokoto Set',
  senator: 'Senator / Native Set',
  native_shirt_trouser: 'Native Shirt + Trouser',
  dashiki: 'Dashiki',
  babban_riga: 'Babban Riga',
  kperti: 'Kperti / Abeti-Aja',
  blouse: 'Blouse / Top',
  wrapper_set: 'Wrapper Set',
  iro_buba: 'Iro + Buba',
  kaba: 'Kaba',
  gown: 'Gown / Aso-oke',
  kaba_wrapper: 'Kaba + Wrapper',
  maternity: 'Maternity',
  aso_oke: 'Aso-oke / Gele Styles',
  children: "Children's (Simplified)",
};
