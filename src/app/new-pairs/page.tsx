'use client';

import { useNewPairs } from '@/hooks/useQueries';
import { PairsTable } from '@/components/tables/PairsTable';
import { TokenGrid } from '@/components/tokens/TokenGrid';
import { useStore } from '@/store/useStore';
import { Zap, Grid3X3, List } from 'lucide-react';
import { useState } from 'react';

export default function NewPairsPage() {
    const { selectedChain } = useStore();
    const { data: newPairs, isLoading } = useNewPairs(selectedChain || undefined);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                        <Zap size={24} className="text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">New Pairs</h1>
                        <p className="text-gray-500">Recently added trading pairs across all chains</p>
                    </div>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${viewMode === 'grid'
                                ? 'bg-emerald-500 text-black'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Grid3X3 size={16} />
                        Grid
                    </button>
                    <button
                        onClick={() => setViewMode('table')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${viewMode === 'table'
                                ? 'bg-emerald-500 text-black'
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
                <TokenGrid pairs={newPairs} isLoading={isLoading} emptyMessage="No new pairs found" />
            ) : (
                <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
                    <PairsTable pairs={newPairs || []} showCreatedAt isLoading={isLoading} />
                </div>
            )}
        </div>
    );
}
