'use client';

import { useNewPairs } from '@/hooks/useQueries';
import { TokenGrid } from '@/components/tokens/TokenGrid';
import { PairsTable } from '@/components/tables/PairsTable';
import { Flame, Grid3X3, List } from 'lucide-react';
import { useState } from 'react';

export default function TrendingPage() {
    const { data: trendingPairs, isLoading } = useNewPairs();
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    // Sort by volume for "trending"
    const sortedPairs = trendingPairs?.sort((a, b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center">
                        <Flame size={24} className="text-orange-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Trending Tokens</h1>
                        <p className="text-gray-500">Most active tokens by trading volume</p>
                    </div>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${viewMode === 'grid'
                                ? 'bg-orange-500 text-black'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Grid3X3 size={16} />
                        Grid
                    </button>
                    <button
                        onClick={() => setViewMode('table')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${viewMode === 'table'
                                ? 'bg-orange-500 text-black'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <List size={16} />
                        Table
                    </button>
                </div>
            </div>

            {/* Content */}
            {viewMode === 'grid' ? (
                <TokenGrid pairs={sortedPairs} isLoading={isLoading} emptyMessage="No trending tokens found" />
            ) : (
                <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
                    <PairsTable pairs={sortedPairs || []} isLoading={isLoading} />
                </div>
            )}
        </div>
    );
}
