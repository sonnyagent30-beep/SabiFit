'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';
import { Loader2, Store, MapPin, Phone, ImagePlus } from 'lucide-react';

const shopSetupSchema = z.object({
  shop_name: z.string().min(2, 'Shop name must be at least 2 characters').max(80),
  owner_name: z.string().min(2, 'Your name must be at least 2 characters').max(80),
  phone: z.string().min(10, 'Enter a valid phone number'),
  address: z.string().optional(),
});

type ShopSetupForm = z.infer<typeof shopSetupSchema>;

export default function ShopSetupPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shopName, setShopName] = useState('');
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ShopSetupForm>({ resolver: zodResolver(shopSetupSchema) });

  const generatedSlug = slugify(shopName || 'my-shop');

  // Check slug availability as user types shop name
  async function checkSlug(slug: string) {
    if (slug.length < 3) { setSlugAvailable(null); return; }
    setCheckingSlug(true);
    const { data } = await supabase.from('shops').select('id').eq('slug', slug).single();
    setSlugAvailable(!data);
    setCheckingSlug(false);
  }

  async function onSubmit(data: ShopSetupForm) {
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const slug = generatedSlug;
    if (slugAvailable === false) {
      setError('This shop name don take. Try another one.');
      setLoading(false);
      return;
    }

    // Create shop
    const { data: shop, error: shopError } = await supabase
      .from('shops')
      .insert({
        name: data.shop_name,
        slug,
        phone: data.phone,
        address: data.address || null,
      })
      .select()
      .single();

    if (shopError || !shop) {
      setError('Shop creation fail. Try again.');
      setLoading(false);
      return;
    }

    // Create owner user profile
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email,
        phone: user.phone || data.phone,
        full_name: data.owner_name,
        shop_id: shop.id,
        role: 'owner',
      });

    if (userError) {
      setError('Profile creation fail. Try again.');
      setLoading(false);
      return;
    }

    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-bg">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
          <div className="w-2 h-2 bg-clay rounded-full" />
          SabiFit
        </div>
        <h1 className="text-2xl font-bold text-indigo">Set up your shop</h1>
        <p className="text-text-light text-sm mt-1">Last step — then you dey ready to work</p>
      </div>

      <div className="w-full max-w-md bg-surface rounded-2xl p-6 shadow-card border border-border">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Shop Name */}
          <div>
            <label className="block text-sm font-semibold text-indigo mb-1.5">
              <Store size={14} className="inline mr-1" />
              Shop Name
            </label>
            <input
              {...register('shop_name')}
              value={shopName}
              onChange={(e) => {
                setShopName(e.target.value);
                checkSlug(slugify(e.target.value));
              }}
              placeholder="e.g. Chidi Tailoring, Zarah Fashion House"
              className="w-full px-4 py-3 border border-border rounded-xl text-sm text-text bg-white focus:outline-none focus:border-indigo"
            />
            {errors.shop_name && (
              <p className="text-error text-xs mt-1">{errors.shop_name.message}</p>
            )}
            {/* Slug preview */}
            {shopName && (
              <p className="text-xs text-text-light mt-1">
                sabifit.app/
                <span className="font-mono text-indigo">{generatedSlug}</span>
                {' '}
                {checkingSlug ? (
                  <span className="text-text-light">checking...</span>
                ) : slugAvailable === true ? (
                  <span className="text-success">✓ available</span>
                ) : slugAvailable === false ? (
                  <span className="text-error">✗ taken</span>
                ) : null}
              </p>
            )}
          </div>

          {/* Owner Name */}
          <div>
            <label className="block text-sm font-semibold text-indigo mb-1.5">
              Your Full Name
            </label>
            <input
              {...register('owner_name')}
              placeholder="e.g. Chidi Eze"
              className="w-full px-4 py-3 border border-border rounded-xl text-sm text-text bg-white focus:outline-none focus:border-indigo"
            />
            {errors.owner_name && (
              <p className="text-error text-xs mt-1">{errors.owner_name.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-indigo mb-1.5">
              <Phone size={14} className="inline mr-1" />
              Shop Phone
            </label>
            <div className="flex gap-2">
              <div className="flex items-center px-4 py-3 bg-bg border border-border rounded-xl text-sm font-semibold text-text-light">
                🇳🇬 +234
              </div>
              <input
                {...register('phone')}
                type="tel"
                placeholder="803 456 7890"
                inputMode="numeric"
                className="flex-1 px-4 py-3 border border-border rounded-xl text-sm text-text bg-white focus:outline-none focus:border-indigo"
              />
            </div>
            {errors.phone && (
              <p className="text-error text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-indigo mb-1.5">
              <MapPin size={14} className="inline mr-1" />
              Shop Address <span className="font-normal text-text-light">(optional)</span>
            </label>
            <textarea
              {...register('address')}
              placeholder="e.g. 15 Admiralty Way, Lekki Phase 1, Lagos"
              rows={2}
              className="w-full px-4 py-3 border border-border rounded-xl text-sm text-text bg-white focus:outline-none focus:border-indigo resize-none"
            />
            {errors.address && (
              <p className="text-error text-xs mt-1">{errors.address.message}</p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-error text-center">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || slugAvailable === false}
            className="w-full py-3 bg-clay text-white font-semibold text-sm rounded-xl hover:bg-clay-light transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Setting up shop...' : 'Open My Shop'}
          </button>
        </form>
      </div>
    </div>
  );
}
