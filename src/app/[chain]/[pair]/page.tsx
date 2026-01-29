'use client';

import { useParams } from 'next/navigation';
import { usePair } from '@/hooks/useQueries';
import { PriceChart } from '@/components/charts/PriceChart';
import { formatPrice, formatPercentage, formatNumber, getChainName, getChainColor, shortenAddress, formatTimeAgo } from '@/lib/utils';
import { Star, Copy, ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { BoostTokenButton } from '@/components/admin/DynamicContent';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { useState } from 'react';

export default function TokenDetailPage() {
    const params = useParams();
    const chainId = params.chain as string;
    const pairAddress = params.pair as string;

    const { data: pair, isLoading } = usePair(chainId, pairAddress);
    const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useStore();
    const [copied, setCopied] = useState(false);

    const pairId = `${chainId}-${pairAddress}`;
    const isWatched = isInWatchlist(pairId);

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(pair?.baseToken.address || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleWatchlistToggle = () => {
        if (isWatched) {
            removeFromWatchlist(pairId);
        } else {
            addToWatchlist(pairId);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-8 w-48 bg-white/10 rounded" />
                <div className="h-[400px] bg-white/10 rounded-2xl" />
                <div className="grid grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-white/10 rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (!pair) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-xl font-bold text-white mb-2">Token Not Found</h2>
                <p className="text-gray-500 mb-6">The requested trading pair could not be found.</p>
                <Link
                    href="/"
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black rounded-xl font-medium hover:bg-emerald-400 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>
            </div>
        );
    }

    const priceChange = pair.priceChange?.h24 || 0;
    const isPositive = priceChange >= 0;

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
                <ArrowLeft size={16} />
                Back
            </Link>

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl"
                        style={{
                            background: `linear-gradient(135deg, ${getChainColor(pair.chainId)}, #1a1a1a)`
                        }}
                    >
                        {pair.baseToken.symbol.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-bold text-white">{pair.baseToken.symbol}</h1>
                            <span className="text-gray-500 text-xl">/ {pair.quoteToken.symbol}</span>
                            <span
                                className="text-sm px-3 py-1 rounded-full"
                                style={{
                                    backgroundColor: getChainColor(pair.chainId) + '20',
                                    color: getChainColor(pair.chainId)
                                }}
                            >
                                {getChainName(pair.chainId)}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 text-sm">Contract:</span>
                                <code className="text-sm text-gray-300">{shortenAddress(pair.baseToken.address, 6)}</code>
                                <button
                                    onClick={handleCopyAddress}
                                    className="p-1 hover:bg-white/10 rounded transition-colors"
                                >
                                    <Copy size={14} className={copied ? 'text-emerald-400' : 'text-gray-500'} />
                                </button>
                            </div>
                            <span className="text-gray-600">•</span>
                            <span className="text-sm text-gray-500">{pair.dexId}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleWatchlistToggle}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${isWatched
                            ? 'bg-yellow-400/20 text-yellow-400'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        <Star size={18} fill={isWatched ? 'currentColor' : 'none'} />
                        {isWatched ? 'Watching' : 'Add to Watchlist'}
                    </button>
                    <a
                        href={pair.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-400 hover:bg-white/10 rounded-xl font-medium transition-colors"
                    >
                        Chart
                    </a>
                    <BoostTokenButton tokenSymbol={pair.baseToken.symbol} />
                </div>
            </div>

            {/* Price */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6">
                <div className="flex items-end gap-4 mb-2">
                    <span className="text-4xl font-bold text-white">{formatPrice(pair.priceUsd)}</span>
                    <div className={`flex items-center gap-1 text-xl font-semibold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                        {formatPercentage(priceChange)}
                    </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                    <div>
                        <span className="text-gray-500">5m: </span>
                        <span className={pair.priceChange?.m5 >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                            {formatPercentage(pair.priceChange?.m5 || 0)}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-500">1h: </span>
                        <span className={pair.priceChange?.h1 >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                            {formatPercentage(pair.priceChange?.h1 || 0)}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-500">6h: </span>
                        <span className={pair.priceChange?.h6 >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                            {formatPercentage(pair.priceChange?.h6 || 0)}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-500">24h: </span>
                        <span className={pair.priceChange?.h24 >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                            {formatPercentage(pair.priceChange?.h24 || 0)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
                <PriceChart chainId={chainId} pairAddress={pairAddress} height={500} />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-5">
                    <div className="text-sm text-gray-500 mb-1">Market Cap</div>
                    <div className="text-xl font-bold text-white">${formatNumber(pair.marketCap || pair.fdv || 0)}</div>
                </div>
                <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-5">
                    <div className="text-sm text-gray-500 mb-1">Liquidity</div>
                    <div className="text-xl font-bold text-white">${formatNumber(pair.liquidity?.usd || 0)}</div>
                </div>
                <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-5">
                    <div className="text-sm text-gray-500 mb-1">Volume 24h</div>
                    <div className="text-xl font-bold text-white">${formatNumber(pair.volume?.h24 || 0)}</div>
                </div>
                <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-5">
                    <div className="text-sm text-gray-500 mb-1">FDV</div>
                    <div className="text-xl font-bold text-white">${formatNumber(pair.fdv || 0)}</div>
                </div>
            </div>

            {/* Transactions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-5">
                    <h3 className="text-lg font-semibold text-white mb-4">Transactions</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">5 min</span>
                            <div>
                                <span className="text-emerald-400">{pair.txns?.m5?.buys || 0} buys</span>
                                <span className="text-gray-500 mx-2">/</span>
                                <span className="text-red-400">{pair.txns?.m5?.sells || 0} sells</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">1 hour</span>
                            <div>
                                <span className="text-emerald-400">{pair.txns?.h1?.buys || 0} buys</span>
                                <span className="text-gray-500 mx-2">/</span>
                                <span className="text-red-400">{pair.txns?.h1?.sells || 0} sells</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">6 hours</span>
                            <div>
                                <span className="text-emerald-400">{pair.txns?.h6?.buys || 0} buys</span>
                                <span className="text-gray-500 mx-2">/</span>
                                <span className="text-red-400">{pair.txns?.h6?.sells || 0} sells</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">24 hours</span>
                            <div>
                                <span className="text-emerald-400">{pair.txns?.h24?.buys || 0} buys</span>
                                <span className="text-gray-500 mx-2">/</span>
                                <span className="text-red-400">{pair.txns?.h24?.sells || 0} sells</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-5">
                    <h3 className="text-lg font-semibold text-white mb-4">Volume</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">5 min</span>
                            <span className="text-white font-medium">${formatNumber(pair.volume?.m5 || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">1 hour</span>
                            <span className="text-white font-medium">${formatNumber(pair.volume?.h1 || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">6 hours</span>
                            <span className="text-white font-medium">${formatNumber(pair.volume?.h6 || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">24 hours</span>
                            <span className="text-white font-medium">${formatNumber(pair.volume?.h24 || 0)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pair Info */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-5">
                <h3 className="text-lg font-semibold text-white mb-4">Pair Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-gray-500">Pair Address</span>
                        <code className="text-gray-300">{shortenAddress(pair.pairAddress, 8)}</code>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-gray-500">Base Token</span>
                        <code className="text-gray-300">{shortenAddress(pair.baseToken.address, 8)}</code>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-gray-500">Quote Token</span>
                        <code className="text-gray-300">{shortenAddress(pair.quoteToken.address, 8)}</code>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-gray-500">DEX</span>
                        <span className="text-gray-300">{pair.dexId}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-gray-500">Chain</span>
                        <span className="text-gray-300">{getChainName(pair.chainId)}</span>
                    </div>
                    {pair.pairCreatedAt && (
                        <div className="flex justify-between py-2 border-b border-white/5">
                            <span className="text-gray-500">Created</span>
                            <span className="text-gray-300">{formatTimeAgo(pair.pairCreatedAt)}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
