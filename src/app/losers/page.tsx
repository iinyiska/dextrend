'use client';

import { useLosers } from '@/hooks/useQueries';
import { PairsTable } from '@/components/tables/PairsTable';
import { TokenGrid } from '@/components/tokens/TokenGrid';
import { TrendingDown, Grid3X3, List } from 'lucide-react';
import { useState } from 'react';

export default function LosersPage() {
    const { data: losers, isLoading } = useLosers();
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center">
                        <TrendingDown size={24} className="text-red-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Top Losers</h1>
                        <p className="text-gray-500">Tokens with highest 24h price decrease</p>
                    </div>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${viewMode === 'grid'
                                ? 'bg-red-500 text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Grid3X3 size={16} />
                        Grid
                    </button>
                    <button
                        onClick={() => setViewMode('table')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${viewMode === 'table'
                                ? 'bg-red-500 text-white'
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
                <TokenGrid pairs={losers} isLoading={isLoading} emptyMessage="No losers found" />
            ) : (
                <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
                    <PairsTable pairs={losers || []} isLoading={isLoading} />
                </div>
            )}
        </div>
    );
}
