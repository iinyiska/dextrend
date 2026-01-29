'use client';

import { useState } from 'react';
import { BarChart3, CandlestickChart, TrendingUp, ExternalLink } from 'lucide-react';
import { useSiteSettings } from '@/components/admin/DynamicContent';

interface DexScreenerChartProps {
    pairAddress: string;
    chainId: string;
    height?: number;
}

type ChartType = 'candles' | 'lines';
type TimeRange = '5m' | '15m' | '1h' | '4h' | '1d';

// Map our chain IDs to DexScreener chain names
const CHAIN_MAP: Record<string, string> = {
    'solana': 'solana',
    'ethereum': 'ethereum',
    'bsc': 'bsc',
    'base': 'base',
    'arbitrum': 'arbitrum',
    'polygon': 'polygon',
    'avalanche': 'avalanche',
    'optimism': 'optimism',
    'fantom': 'fantom',
    'cronos': 'cronos',
};

export function DexScreenerChart({
    pairAddress,
    chainId,
    height = 450
}: DexScreenerChartProps) {
    const [chartType, setChartType] = useState<ChartType>('candles');
    const [timeRange, setTimeRange] = useState<TimeRange>('1h');
    const [isLoading, setIsLoading] = useState(true);

    // Get site settings from admin panel
    const { settings, isLoaded } = useSiteSettings();

    const dexChain = CHAIN_MAP[chainId] || chainId;

    // Build DexScreener embed URL with params
    const embedUrl = `https://dexscreener.com/${dexChain}/${pairAddress}?embed=1&theme=dark&trades=0&info=0`;

    // DexScreener direct link 
    const directLink = `https://dexscreener.com/${dexChain}/${pairAddress}`;

    // Get logo and site name from admin settings
    const siteName = isLoaded && settings.logo_text ? settings.logo_text : 'DexTrend';
    const logoUrl = isLoaded && settings.logo_url ? settings.logo_url : null;

    return (
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden">
            {/* Chart Controls */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-4">
                    {/* Chart Type Toggle */}
                    <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                        <button
                            onClick={() => setChartType('candles')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${chartType === 'candles'
                                ? 'bg-emerald-500 text-black'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <CandlestickChart size={14} />
                            Candles
                        </button>
                        <button
                            onClick={() => setChartType('lines')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${chartType === 'lines'
                                ? 'bg-emerald-500 text-black'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <TrendingUp size={14} />
                            Line
                        </button>
                    </div>

                    {/* Time Range Selector */}
                    <div className="flex items-center gap-1">
                        {(['5m', '15m', '1h', '4h', '1d'] as TimeRange[]).map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${timeRange === range
                                    ? 'bg-white/10 text-white'
                                    : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                {range.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Open in DexScreener */}
                <a
                    href={directLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                >
                    <BarChart3 size={14} />
                    Open in DexScreener
                    <ExternalLink size={12} />
                </a>
            </div>

            {/* Chart iframe container */}
            <div className="relative" style={{ height }}>
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a] z-10">
                        <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
                            <span className="text-gray-500 text-sm">Loading chart...</span>
                        </div>
                    </div>
                )}
                <iframe
                    src={embedUrl}
                    className="w-full h-full border-0"
                    title="DexScreener Chart"
                    onLoad={() => setIsLoading(false)}
                    allow="clipboard-write"
                />
            </div>

            {/* Chart Legend with Dynamic Branding */}
            <div className="flex items-center gap-4 px-4 py-3 border-t border-white/10 bg-[#141414]">
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-3 h-3 rounded bg-emerald-500" />
                    Buy
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-3 h-3 rounded bg-red-500" />
                    Sell
                </span>

                {/* Dynamic Branding from Admin Panel */}
                <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs text-gray-500">Tracked by</span>
                    {logoUrl ? (
                        <img
                            src={logoUrl}
                            alt={siteName}
                            className="h-5 w-auto"
                        />
                    ) : (
                        <span className="text-sm font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            {siteName}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

