'use client';

import { createClient } from '@/lib/supabase/client';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*, shops(*)')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-bg">
      {/* Top Nav */}
      <header className="bg-indigo text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-clay rounded-full" />
          <span className="font-semibold text-sm">{profile?.shops?.name || 'SabiFit'}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs opacity-80">{profile?.full_name}</span>
          <div className="w-8 h-8 bg-clay rounded-full flex items-center justify-center text-xs font-bold">
            {profile?.full_name?.charAt(0) || 'U'}
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="px-4 py-6 max-w-5xl mx-auto">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-indigo">
            Good morning, {profile?.full_name?.split(' ')[0] || 'Boss'} 👋
          </h1>
          <p className="text-text-light text-sm mt-0.5">
            Here na your shop overview. Everything we dey for hand.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Clients', value: '0', icon: '👥', color: 'indigo' },
            { label: 'Active Orders', value: '0', icon: '📋', color: 'clay' },
            { label: 'Ready for Delivery', value: '0', icon: '✨', color: 'success' },
            { label: 'Unpaid Invoices', value: '₦0', icon: '💰', color: 'error' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface rounded-xl p-4 border border-border shadow-sm"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-bold text-text">{stat.value}</div>
              <div className="text-xs text-text-light mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-surface rounded-xl p-5 border border-border shadow-sm mb-6">
          <h2 className="font-semibold text-indigo text-sm mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Add Client', href: '/clients/new', icon: '👤+' },
              { label: 'New Order', href: '/orders/new', icon: '📋+' },
              { label: 'Take Measurement', href: '/measurements/new', icon: '📏+' },
              { label: 'Send Invoice', href: '/invoices/new', icon: '🧾+' },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex flex-col items-center gap-1.5 p-3 bg-indigo/5 hover:bg-indigo/10 rounded-xl transition-colors text-center"
              >
                <span className="text-xl">{action.icon}</span>
                <span className="text-xs font-semibold text-indigo">{action.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Recent Activity / Placeholder */}
        <div className="bg-surface rounded-xl p-5 border border-border shadow-sm">
          <h2 className="font-semibold text-indigo text-sm mb-3">Recent Activity</h2>
          <div className="text-center py-10 text-text-light text-sm">
            <div className="text-3xl mb-2">📭</div>
            <p>No activity yet.</p>
            <p className="text-xs mt-1">Add your first client to start tracking.</p>
            <a
              href="/clients/new"
              className="inline-block mt-4 px-4 py-2 bg-clay text-white text-xs font-semibold rounded-lg hover:bg-clay-light transition-colors"
            >
              Add First Client
            </a>
          </div>
        </div>
      </main>

      {/* Bottom Nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-2 py-2 flex justify-around md:hidden">
        {[
          { label: 'Home', icon: '🏠', href: '/dashboard' },
          { label: 'Clients', icon: '👥', href: '/clients' },
          { label: 'Orders', icon: '📋', href: '/orders' },
          { label: 'More', icon: '☰', href: '/more' },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-0.5 py-1 px-3 text-indigo"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-semibold">{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
