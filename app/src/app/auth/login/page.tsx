'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginForm) {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Redirect handled by Next.js router — will hit the root page which checks auth
    window.location.href = '/';
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-bg">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
          <div className="w-2 h-2 bg-clay rounded-full" />
          SabiFit
        </div>
        <h1 className="text-2xl font-bold text-indigo">Welcome back</h1>
        <p className="text-text-light text-sm mt-1">Sign in to your tailor shop</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-surface rounded-2xl p-6 shadow-card border border-border">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-indigo mb-1.5">Email</label>
            <input
              {...register('email')}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full px-4 py-3 border border-border rounded-xl text-sm text-text bg-white focus:outline-none focus:border-indigo transition-colors"
            />
            {errors.email && (
              <p className="text-error text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-semibold text-indigo">Password</label>
              <Link href="/auth/forgot-password" className="text-xs text-clay font-medium hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full px-4 py-3 pr-11 border border-border rounded-xl text-sm text-text bg-white focus:outline-none focus:border-indigo transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-error text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-error">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo text-white font-semibold text-sm rounded-xl hover:bg-indigo-light transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-text-light">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Phone OTP */}
        <Link
          href="/auth/signup"
          className="block w-full py-3 border border-indigo text-indigo font-semibold text-sm rounded-xl text-center hover:bg-indigo/5 transition-colors"
        >
          Sign in with Phone / OTP
        </Link>
      </div>

      {/* Footer */}
      <p className="mt-6 text-sm text-text-light">
        No account yet?{' '}
        <Link href="/auth/signup" className="text-indigo font-semibold hover:underline">
          Create your shop
        </Link>
      </p>
    </div>
  );
}
