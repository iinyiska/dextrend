'use client';

import { useNewPairs, useGainers, useLosers } from '@/hooks/useQueries';
import { PromotedTokensGrid } from '@/components/tokens/PromotedTokensGrid';
import { PairsTable } from '@/components/tables/PairsTable';
import { useStore } from '@/store/useStore';
import { Flame, Zap, TrendingUp, TrendingDown, ArrowRight, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { BannerDisplay, AdDisplay, useSiteSettings, DynamicFooter } from '@/components/admin/DynamicContent';
import { CollapsibleSection } from '@/components/ui/CollapsibleSection';

export default function HomePage() {
  const { selectedChain } = useStore();
  const { settings, isLoaded } = useSiteSettings();
  const { data: newPairs, isLoading: loadingNewPairs } = useNewPairs(selectedChain || undefined);
  const { data: gainers, isLoading: loadingGainers } = useGainers();
  const { data: losers, isLoading: loadingLosers } = useLosers();

  const logoText = isLoaded ? settings.logo_text : 'GujinDex';

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Hero Banner (from admin) */}
      <div className="animate-in slide-in-from-top-4 duration-700">
        <BannerDisplay position="hero" />
      </div>

      {/* Hero Section - Simplified for Mobile */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900/30 via-[#1a1a1a] to-cyan-900/30 p-6 md:p-8 border border-white/5 shadow-2xl shadow-emerald-900/10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 animate-pulse" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <TrendingUp size={28} className="text-black" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{logoText}</h1>
                <p className="text-sm text-gray-400 font-medium">
                  {isLoaded && settings.site_description
                    ? settings.site_description
                    : 'Real-Time Multi-Chain DEX Analytics'}
                </p>
              </div>
            </div>
          </div>

          {/* Wrapper for Stats to be collapsible/scrollable on very small screens if needed, 
              but grid is usually fine. Kept simple grid. */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-3 md:p-4 border border-white/5">
              <div className="text-xl md:text-2xl font-bold text-emerald-400">10+</div>
              <div className="text-xs md:text-sm text-gray-500">Blockchains</div>
            </div>
            <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-3 md:p-4 border border-white/5">
              <div className="text-xl md:text-2xl font-bold text-cyan-400">100K+</div>
              <div className="text-xs md:text-sm text-gray-500">Tokens</div>
            </div>
            <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-3 md:p-4 border border-white/5">
              <div className="text-xl md:text-2xl font-bold text-purple-400">500+</div>
              <div className="text-xs md:text-sm text-gray-500">DEXs</div>
            </div>
            <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-3 md:p-4 border border-white/5">
              <div className="text-xl md:text-2xl font-bold text-orange-400">Live</div>
              <div className="text-xs md:text-sm text-gray-500">Updates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Slot */}
      <AdDisplay position="between_content" />

      {/* Trending Section - Always Visible */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Flame size={18} className="text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white">Trending</h2>
              <p className="text-xs md:text-sm text-gray-500 hidden md:block">Hottest tokens right now</p>
            </div>
          </div>
          <Link
            href="/trending"
            className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-400/10 px-3 py-1.5 rounded-lg"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <PromotedTokensGrid apiTokens={newPairs?.slice(0, 4)} isLoading={loadingNewPairs} maxItems={4} />
      </section>

      {/* Collapsible New Pairs Section */}
      <CollapsibleSection
        title={
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Zap size={18} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">New Pairs</h2>
              <p className="text-xs text-gray-500 md:hidden">Recently added pairs</p>
            </div>
          </div>
        }
        defaultOpen={true}
      >
        <div className="-mx-4 md:mx-0">
          <PairsTable pairs={newPairs?.slice(0, 10) || []} showCreatedAt isLoading={loadingNewPairs} />
          <div className="mt-4 text-center">
            <Link href="/new-pairs" className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1">
              View all new pairs <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </CollapsibleSection>

      {/* Ad Slot */}
      <AdDisplay position="sidebar" />

      {/* Gainers & Losers - Collapsible Grid */}
      <div className="flex flex-col gap-6">
        {/* Gainers */}
        <CollapsibleSection
          title={
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp size={18} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Top Gainers</h2>
              </div>
            </div>
          }
          defaultOpen={false}
        >
          <div className="-mx-4 md:mx-0">
            <PairsTable pairs={gainers?.slice(0, 5) || []} showChain={false} isLoading={loadingGainers} />
            <div className="mt-4 text-center">
              <Link href="/gainers" className="text-sm text-gray-400 hover:text-white transition-colors">View more</Link>
            </div>
          </div>
        </CollapsibleSection>

        {/* Losers */}
        <CollapsibleSection
          title={
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                <TrendingDown size={18} className="text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Top Losers</h2>
              </div>
            </div>
          }
          defaultOpen={false}
        >
          <div className="-mx-4 md:mx-0">
            <PairsTable pairs={losers?.slice(0, 5) || []} showChain={false} isLoading={loadingLosers} />
            <div className="mt-4 text-center">
              <Link href="/losers" className="text-sm text-gray-400 hover:text-white transition-colors">View more</Link>
            </div>
          </div>
        </CollapsibleSection>
      </div>

      {/* Footer Ad */}
      <AdDisplay position="footer" />

      <DynamicFooter />
    </div>
  );
}

