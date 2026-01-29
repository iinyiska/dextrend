'use client';

import { Star } from 'lucide-react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';

export default function WatchlistPage() {
    const { watchlist } = useStore();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
                    <Star size={24} className="text-yellow-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Watchlist</h1>
                    <p className="text-gray-500">Your saved tokens and pairs</p>
                </div>
            </div>

            {/* Content */}
            {watchlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center mb-6">
                        <Star size={40} className="text-yellow-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Your watchlist is empty</h2>
                    <p className="text-gray-500 max-w-md mb-6">
                        Start adding tokens to your watchlist by clicking the star icon on any token card.
                    </p>
                    <Link
                        href="/"
                        className="px-6 py-3 bg-emerald-500 text-black rounded-xl font-medium hover:bg-emerald-400 transition-colors"
                    >
                        Explore Tokens
                    </Link>
                </div>
            ) : (
                <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6">
                    <p className="text-gray-400 mb-4">You have {watchlist.length} tokens in your watchlist.</p>
                    <div className="space-y-2">
                        {watchlist.map((pairId) => {
                            const [chainId, pairAddress] = pairId.split('-');
                            return (
                                <Link
                                    key={pairId}
                                    href={`/${chainId}/${pairAddress}`}
                                    className="block p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    <code className="text-sm text-gray-300">{pairId}</code>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
