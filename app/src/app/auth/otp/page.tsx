'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2, CheckCircle } from 'lucide-react';

export default function OtpPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Countdown to allow resend
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timer); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError(null);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (newOtp.every((d) => d !== '') && newOtp.join('').length === 6) {
      verifyOtp(newOtp.join(''));
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      verifyOtp(pasted);
    }
  }

  async function verifyOtp(code: string) {
    setLoading(true);
    setError(null);

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      phone,
      token: code,
      type: 'sms',
    });

    setLoading(false);

    if (verifyError) {
      setError('Code no work. Abeg try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      return;
    }

    // Check if user already has a shop
    if (data.user) {
      const { data: profile } = await supabase
        .from('users')
        .select('shop_id')
        .eq('id', data.user.id)
        .single();

      if (profile?.shop_id) {
        router.push('/dashboard');
      } else {
        router.push('/auth/shop-setup');
      }
    }
  }

  async function resendOtp() {
    if (countdown > 0) return;
    setResending(true);
    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: { channel: 'sms' },
    });
    setResending(false);
    if (!error) {
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-bg">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
          <div className="w-2 h-2 bg-clay rounded-full" />
          SabiFit
        </div>
        <h1 className="text-2xl font-bold text-indigo">Verify your phone</h1>
        <p className="text-text-light text-sm mt-1">
          Enter the 6-digit code sent to<br />
          <span className="font-semibold text-text">{phone}</span>
        </p>
      </div>

      {/* OTP Inputs */}
      <div
        className="w-full max-w-sm bg-surface rounded-2xl p-6 shadow-card border border-border"
        onPaste={handlePaste}
      >
        <div className="flex gap-2 justify-center mb-5">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-13 text-center text-xl font-bold border border-border rounded-xl bg-white focus:outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/20 transition-all"
              maxLength={1}
              autoFocus={i === 0}
            />
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-error text-center mb-4">
            {error}
          </div>
        )}

        <button
          onClick={() => verifyOtp(otp.join(''))}
          disabled={loading || otp.join('').length < 6}
          className="w-full py-3 bg-indigo text-white font-semibold text-sm rounded-xl hover:bg-indigo-light transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mb-4"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? 'Verifying...' : 'Verify Code'}
        </button>

        <div className="text-center text-xs text-text-light">
          No code yet?{' '}
          {countdown > 0 ? (
            <span className="text-text-light">Resend in {countdown}s</span>
          ) : (
            <button
              onClick={resendOtp}
              disabled={resending}
              className="text-clay font-semibold hover:underline disabled:opacity-50"
            >
              {resending ? 'Sending...' : 'Resend code'}
            </button>
          )}
        </div>
      </div>

      {/* Demo hint */}
      <div className="mt-6 bg-indigo/5 border border-indigo/20 rounded-xl px-4 py-3 max-w-sm">
        <p className="text-xs text-indigo text-center">
          💡 <strong>Demo mode:</strong> Use code <code className="font-mono bg-white px-1 rounded">123456</code> as a test OTP
        </p>
      </div>
    </div>
  );
}
