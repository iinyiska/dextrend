'use client';

import Link from 'next/link';
import { Pair } from '@/lib/types';
import { formatPrice, formatPercentage, formatNumber, getChainName, getChainColor } from '@/lib/utils';
import { Star, ExternalLink } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { TokenLogo, getTokenLogoUrl } from './TokenLogo';

interface TokenCardProps {
    pair: Pair;
    showChart?: boolean;
}

export function TokenCard({ pair, showChart = false }: TokenCardProps) {
    const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useStore();
    const pairId = `${pair.chainId}-${pair.pairAddress}`;
    const isWatched = isInWatchlist(pairId);

    const priceChange = pair.priceChange?.h24 || 0;
    const isPositive = priceChange >= 0;
    const logoUrl = getTokenLogoUrl(pair);

    const handleWatchlistClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isWatched) {
            removeFromWatchlist(pairId);
        } else {
            addToWatchlist(pairId);
        }
    };

    return (
        <Link
            href={`/${pair.chainId}/${pair.pairAddress}`}
            className="group block bg-[#1a1a1a] rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-emerald-500/5"
        >
            {/* Header */}
            <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        {/* Token Logo */}
                        <TokenLogo
                            imageUrl={logoUrl}
                            symbol={pair.baseToken.symbol}
                            chainId={pair.chainId}
                            size="lg"
                        />
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-white">{pair.baseToken.symbol}</span>
                                <span className="text-gray-500 text-sm">/ {pair.quoteToken.symbol}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span
                                    className="text-xs px-2 py-0.5 rounded-full"
                                    style={{
                                        backgroundColor: getChainColor(pair.chainId) + '20',
                                        color: getChainColor(pair.chainId)
                                    }}
                                >
                                    {getChainName(pair.chainId)}
                                </span>
                                <span className="text-xs text-gray-500">{pair.dexId}</span>
                            </div>
                        </div>
                    </div>

                    {/* Watchlist Button */}
                    <button
                        onClick={handleWatchlistClick}
                        className={`p-2 rounded-lg transition-colors ${isWatched
                            ? 'text-yellow-400 bg-yellow-400/10'
                            : 'text-gray-500 hover:text-yellow-400 hover:bg-white/5'
                            }`}
                    >
                        <Star size={16} fill={isWatched ? 'currentColor' : 'none'} />
                    </button>
                </div>

                {/* Price */}
                <div className="mb-4">
                    <div className="text-2xl font-bold text-white">
                        {formatPrice(pair.priceUsd)}
                    </div>
                    <div className={`flex items-center gap-2 mt-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                        <span className="text-lg font-semibold">
                            {formatPercentage(priceChange)}
                        </span>
                        <span className="text-xs text-gray-500">24h</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-xl p-3">
                        <div className="text-xs text-gray-500 mb-0.5">Volume 24h</div>
                        <div className="font-semibold text-white">${formatNumber(pair.volume?.h24 || 0)}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                        <div className="text-xs text-gray-500 mb-0.5">Liquidity</div>
                        <div className="font-semibold text-white">${formatNumber(pair.liquidity?.usd || 0)}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                        <div className="text-xs text-gray-500 mb-0.5">Market Cap</div>
                        <div className="font-semibold text-white">${formatNumber(pair.marketCap || pair.fdv || 0)}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                        <div className="text-xs text-gray-500 mb-0.5">Txns 24h</div>
                        <div className="font-semibold text-white">
                            <span className="text-emerald-400">{pair.txns?.h24?.buys || 0}</span>
                            <span className="text-gray-500">/</span>
                            <span className="text-red-400">{pair.txns?.h24?.sells || 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-white/5 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                    View Chart
                </span>
                <ExternalLink size={14} className="text-gray-500 group-hover:text-emerald-400 transition-colors" />
            </div>
        </Link>
    );
}

// Skeleton for loading state
export function TokenCardSkeleton() {
    return (
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden animate-pulse">
            <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10" />
                        <div>
                            <div className="h-4 w-20 bg-white/10 rounded mb-1" />
                            <div className="h-3 w-16 bg-white/10 rounded" />
                        </div>
                    </div>
                </div>
                <div className="h-8 w-28 bg-white/10 rounded mb-2" />
                <div className="h-5 w-16 bg-white/10 rounded mb-4" />
                <div className="grid grid-cols-2 gap-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white/5 rounded-xl p-3">
                            <div className="h-3 w-12 bg-white/10 rounded mb-1" />
                            <div className="h-4 w-16 bg-white/10 rounded" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="px-4 py-3 bg-white/5">
                <div className="h-3 w-16 bg-white/10 rounded" />
            </div>
        </div>
    );
}
