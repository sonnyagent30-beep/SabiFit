import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNaira(kobo: number): string {
  const naira = kobo / 100;
  return '₦' + naira.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function koboToNaira(kobo: number): number {
  return kobo / 100;
}

export function nairaToKobo(naira: number): number {
  return Math.round(naira * 100);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
