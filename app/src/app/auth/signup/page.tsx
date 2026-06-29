'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Mail, Phone } from 'lucide-react';

const signupSchema = z.object({
  mode: z.enum(['phone', 'email']),
  phone: z.string().optional(),
  email: z.string().email('Enter a valid email').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
}).refine((data) => {
  if (data.mode === 'phone') return data.phone && data.phone.length >= 10;
  if (data.mode === 'email') return data.email && data.password && data.password.length >= 8;
  return false;
}, { message: 'Invalid entry' });

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const supabase = createClient();
  const router = useRouter();
  const [mode, setMode] = useState<'phone' | 'email'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [phone, setPhone] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    defaultValues: { mode: 'phone' },
  });

  async function sendOTP(phoneNum: string) {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      phone: phoneNum,
      options: { channel: 'sms' },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setOtpSent(true);
    setPhone(phoneNum);
  }

  async function onSubmitEmail(data: SignupForm) {
    if (mode !== 'email') return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email: data.email!,
      password: data.password!,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push('/auth/verify-email?email=' + encodeURIComponent(data.email!));
  }

  if (otpSent) {
    router.push(`/auth/otp?phone=${encodeURIComponent(phone)}`);
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-bg">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
          <div className="w-2 h-2 bg-clay rounded-full" />
          SabiFit
        </div>
        <h1 className="text-2xl font-bold text-indigo">Create your shop</h1>
        <p className="text-text-light text-sm mt-1">Start your free trial — no card needed</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex bg-surface border border-border rounded-xl p-1 mb-5 w-full max-w-sm">
        <button
          type="button"
          onClick={() => setMode('phone')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            mode === 'phone' ? 'bg-indigo text-white shadow-sm' : 'text-text-light hover:text-text'
          }`}
        >
          <Phone size={15} />
          Phone / OTP
        </button>
        <button
          type="button"
          onClick={() => setMode('email')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            mode === 'email' ? 'bg-indigo text-white shadow-sm' : 'text-text-light hover:text-text'
          }`}
        >
          <Mail size={15} />
          Email
        </button>
      </div>

      <div className="w-full max-w-sm bg-surface rounded-2xl p-6 shadow-card border border-border">
        {mode === 'phone' ? (
          <PhoneSignup onSubmit={sendOTP} loading={loading} error={error} errors={errors} register={register} />
        ) : (
          <form onSubmit={handleSubmit(onSubmitEmail)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-indigo mb-1.5">Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full px-4 py-3 border border-border rounded-xl text-sm text-text bg-white focus:outline-none focus:border-indigo"
              />
              {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-indigo mb-1.5">Password</label>
              <input
                {...register('password')}
                type="password"
                placeholder="Min 8 characters"
                autoComplete="new-password"
                className="w-full px-4 py-3 border border-border rounded-xl text-sm text-text bg-white focus:outline-none focus:border-indigo"
              />
              {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-error">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo text-white font-semibold text-sm rounded-xl hover:bg-indigo-light transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Create Account
            </button>
          </form>
        )}
      </div>

      <p className="mt-6 text-xs text-text-light text-center max-w-xs">
        By creating an account, you agree to our{' '}
        <Link href="/legal/terms" className="text-indigo hover:underline">Terms of Service</Link>
        {' '}and{' '}
        <Link href="/legal/privacy" className="text-indigo hover:underline">Privacy Policy</Link>
      </p>

      <p className="mt-4 text-sm text-text-light">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-indigo font-semibold hover:underline">Sign in</Link>
      </p>
    </div>
  );
}

function PhoneSignup({ onSubmit, loading, error, errors, register }: {
  onSubmit: (phone: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  errors: Record<string, unknown>;
  register: (name: string) => unknown;
}) {
  const [phone, setPhone] = useState('');
  const nigeriaCode = '+234';

  async function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fullPhone = phone.startsWith('0') ? nigeriaCode + phone.slice(1) : phone;
    await onSubmit(fullPhone);
  }

  return (
    <form onSubmit={handlePhoneSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-indigo mb-1.5">Phone Number</label>
        <div className="flex gap-2">
          <div className="flex items-center px-4 py-3 bg-bg border border-border rounded-xl text-sm font-semibold text-text-light">
            🇳🇬 {nigeriaCode}
          </div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="803 456 7890"
            inputMode="numeric"
            className="flex-1 px-4 py-3 border border-border rounded-xl text-sm text-text bg-white focus:outline-none focus:border-indigo"
          />
        </div>
        <input type="hidden" {...register('mode')} value="phone" />
        <input type="hidden" {...register('phone')} value={phone} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-error">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading || phone.length < 10}
        className="w-full py-3 bg-indigo text-white font-semibold text-sm rounded-xl hover:bg-indigo-light transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        Send OTP Code
      </button>

      <p className="text-xs text-text-light text-center">
        We go send am 6-digit code to your phone. Na free message.
      </p>
    </form>
  );
}
