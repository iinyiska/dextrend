'use client';

import { useNewPairs, useGainers, useLosers } from '@/hooks/useQueries';
import { TokenGrid } from '@/components/tokens/TokenGrid';
import { PairsTable } from '@/components/tables/PairsTable';
import { useStore } from '@/store/useStore';
import { Flame, Zap, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { BannerDisplay, AdDisplay, useSiteSettings, DynamicFooter } from '@/components/admin/DynamicContent';

export default function HomePage() {
  const { selectedChain } = useStore();
  const { settings, isLoaded } = useSiteSettings();
  const { data: newPairs, isLoading: loadingNewPairs } = useNewPairs(selectedChain || undefined);
  const { data: gainers, isLoading: loadingGainers } = useGainers();
  const { data: losers, isLoading: loadingLosers } = useLosers();

  const logoText = isLoaded ? settings.logo_text : 'DexTrend';

  return (
    <div className="space-y-8">
      {/* Hero Banner (from admin) */}
      <BannerDisplay position="hero" />

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900/30 via-[#1a1a1a] to-cyan-900/30 p-8 border border-white/5">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <TrendingUp size={24} className="text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{logoText}</h1>
              <p className="text-gray-400">
                {isLoaded && settings.site_description
                  ? settings.site_description
                  : 'Real-Time Multi-Chain DEX Analytics'}
              </p>
            </div>
          </div>

          <p className="text-gray-300 max-w-2xl mb-6">
            Track trending tokens, discover new pairs, and analyze price movements across
            Ethereum, Solana, BSC, and 10+ other blockchains — all in real-time.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-2xl font-bold text-emerald-400">10+</div>
              <div className="text-sm text-gray-500">Blockchains</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-2xl font-bold text-cyan-400">100K+</div>
              <div className="text-sm text-gray-500">Tokens</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-400">500+</div>
              <div className="text-sm text-gray-500">DEXs</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-2xl font-bold text-orange-400">Real-time</div>
              <div className="text-sm text-gray-500">Updates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Slot - Between Content */}
      <AdDisplay position="between_content" />

      {/* Trending Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Flame size={20} className="text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Trending Tokens</h2>
              <p className="text-sm text-gray-500">Most active tokens right now</p>
            </div>
          </div>
          <Link
            href="/trending"
            className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <TokenGrid pairs={newPairs?.slice(0, 4)} isLoading={loadingNewPairs} />
      </section>

      {/* New Pairs Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Zap size={20} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">New Pairs</h2>
              <p className="text-sm text-gray-500">Recently added trading pairs</p>
            </div>
          </div>
          <Link
            href="/new-pairs"
            className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
          <PairsTable pairs={newPairs?.slice(0, 10) || []} showCreatedAt isLoading={loadingNewPairs} />
        </div>
      </section>

      {/* Ad Slot - Between Sections */}
      <AdDisplay position="sidebar" />

      {/* Gainers & Losers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gainers */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp size={20} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Top Gainers</h2>
              <p className="text-sm text-gray-500">24h price increase</p>
            </div>
          </div>
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
            <PairsTable pairs={gainers?.slice(0, 5) || []} showChain={false} isLoading={loadingGainers} />
          </div>
        </section>

        {/* Losers */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <TrendingDown size={20} className="text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Top Losers</h2>
              <p className="text-sm text-gray-500">24h price decrease</p>
            </div>
          </div>
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
            <PairsTable pairs={losers?.slice(0, 5) || []} showChain={false} isLoading={loadingLosers} />
          </div>
        </section>
      </div>

      {/* Footer Ad */}
      <AdDisplay position="footer" />

      {/* Dynamic Footer */}
      <DynamicFooter />
    </div>
  );
}
