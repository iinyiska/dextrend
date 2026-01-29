'use client';

import Link from 'next/link';
import { Pair } from '@/lib/types';
import { formatPrice, formatPercentage, formatNumber, getChainName, getChainColor, formatTimeAgo } from '@/lib/utils';
import { ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
import { useState, useMemo } from 'react';
import { TokenLogo, getTokenLogoUrl } from '@/components/tokens/TokenLogo';

interface PairsTableProps {
    pairs: Pair[];
    showChain?: boolean;
    showCreatedAt?: boolean;
    isLoading?: boolean;
}

type SortField = 'price' | 'priceChange' | 'volume' | 'liquidity' | 'marketCap' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export function PairsTable({ pairs, showChain = true, showCreatedAt = false, isLoading = false }: PairsTableProps) {
    const [sortField, setSortField] = useState<SortField>('volume');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const sortedPairs = useMemo(() => {
        return [...pairs].sort((a, b) => {
            let valueA: number, valueB: number;

            switch (sortField) {
                case 'price':
                    valueA = parseFloat(a.priceUsd) || 0;
                    valueB = parseFloat(b.priceUsd) || 0;
                    break;
                case 'priceChange':
                    valueA = a.priceChange?.h24 || 0;
                    valueB = b.priceChange?.h24 || 0;
                    break;
                case 'volume':
                    valueA = a.volume?.h24 || 0;
                    valueB = b.volume?.h24 || 0;
                    break;
                case 'liquidity':
                    valueA = a.liquidity?.usd || 0;
                    valueB = b.liquidity?.usd || 0;
                    break;
                case 'marketCap':
                    valueA = a.marketCap || a.fdv || 0;
                    valueB = b.marketCap || b.fdv || 0;
                    break;
                case 'createdAt':
                    valueA = a.pairCreatedAt || 0;
                    valueB = b.pairCreatedAt || 0;
                    break;
                default:
                    return 0;
            }

            return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
        });
    }, [pairs, sortField, sortDirection]);

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) {
            return <ArrowUpDown size={14} className="text-gray-500" />;
        }
        return sortDirection === 'asc'
            ? <ChevronUp size={14} className="text-emerald-400" />
            : <ChevronDown size={14} className="text-emerald-400" />;
    };

    if (isLoading) {
        return <PairsTableSkeleton />;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Token
                        </th>
                        {showChain && (
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Chain
                            </th>
                        )}
                        <th
                            className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                            onClick={() => handleSort('price')}
                        >
                            <span className="flex items-center justify-end gap-1">
                                Price <SortIcon field="price" />
                            </span>
                        </th>
                        <th
                            className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                            onClick={() => handleSort('priceChange')}
                        >
                            <span className="flex items-center justify-end gap-1">
                                24h % <SortIcon field="priceChange" />
                            </span>
                        </th>
                        <th
                            className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                            onClick={() => handleSort('volume')}
                        >
                            <span className="flex items-center justify-end gap-1">
                                Volume 24h <SortIcon field="volume" />
                            </span>
                        </th>
                        <th
                            className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                            onClick={() => handleSort('liquidity')}
                        >
                            <span className="flex items-center justify-end gap-1">
                                Liquidity <SortIcon field="liquidity" />
                            </span>
                        </th>
                        <th
                            className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                            onClick={() => handleSort('marketCap')}
                        >
                            <span className="flex items-center justify-end gap-1">
                                MCap <SortIcon field="marketCap" />
                            </span>
                        </th>
                        {showCreatedAt && (
                            <th
                                className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                                onClick={() => handleSort('createdAt')}
                            >
                                <span className="flex items-center justify-end gap-1">
                                    Age <SortIcon field="createdAt" />
                                </span>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {sortedPairs.map((pair, index) => {
                        const priceChange = pair.priceChange?.h24 || 0;
                        const isPositive = priceChange >= 0;
                        const logoUrl = getTokenLogoUrl(pair);

                        return (
                            <tr
                                key={`${pair.chainId}-${pair.pairAddress}`}
                                className="border-b border-white/5 hover:bg-white/5 transition-colors"
                            >
                                <td className="py-3 px-4">
                                    <Link
                                        href={`/${pair.chainId}/${pair.pairAddress}`}
                                        className="flex items-center gap-3 hover:text-emerald-400 transition-colors"
                                    >
                                        <span className="text-gray-500 text-sm w-6">{index + 1}</span>
                                        <TokenLogo
                                            imageUrl={logoUrl}
                                            symbol={pair.baseToken.symbol}
                                            chainId={pair.chainId}
                                            size="md"
                                        />
                                        <div>
                                            <div className="font-medium text-white">{pair.baseToken.symbol}</div>
                                            <div className="text-xs text-gray-500">/{pair.quoteToken.symbol}</div>
                                        </div>
                                    </Link>
                                </td>
                                {showChain && (
                                    <td className="py-3 px-4">
                                        <span
                                            className="text-xs px-2 py-1 rounded-full"
                                            style={{
                                                backgroundColor: getChainColor(pair.chainId) + '20',
                                                color: getChainColor(pair.chainId)
                                            }}
                                        >
                                            {getChainName(pair.chainId)}
                                        </span>
                                    </td>
                                )}
                                <td className="py-3 px-4 text-right font-mono font-medium">
                                    {formatPrice(pair.priceUsd)}
                                </td>
                                <td className={`py-3 px-4 text-right font-semibold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {formatPercentage(priceChange)}
                                </td>
                                <td className="py-3 px-4 text-right text-gray-300">
                                    ${formatNumber(pair.volume?.h24 || 0)}
                                </td>
                                <td className="py-3 px-4 text-right text-gray-300">
                                    ${formatNumber(pair.liquidity?.usd || 0)}
                                </td>
                                <td className="py-3 px-4 text-right text-gray-300">
                                    ${formatNumber(pair.marketCap || pair.fdv || 0)}
                                </td>
                                {showCreatedAt && (
                                    <td className="py-3 px-4 text-right text-gray-500 text-sm">
                                        {pair.pairCreatedAt ? formatTimeAgo(pair.pairCreatedAt) : '-'}
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

function PairsTableSkeleton() {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4"><div className="h-4 w-16 bg-white/10 rounded" /></th>
                        <th className="text-left py-3 px-4"><div className="h-4 w-12 bg-white/10 rounded" /></th>
                        <th className="text-right py-3 px-4"><div className="h-4 w-12 bg-white/10 rounded ml-auto" /></th>
                        <th className="text-right py-3 px-4"><div className="h-4 w-12 bg-white/10 rounded ml-auto" /></th>
                        <th className="text-right py-3 px-4"><div className="h-4 w-16 bg-white/10 rounded ml-auto" /></th>
                        <th className="text-right py-3 px-4"><div className="h-4 w-16 bg-white/10 rounded ml-auto" /></th>
                        <th className="text-right py-3 px-4"><div className="h-4 w-12 bg-white/10 rounded ml-auto" /></th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(10)].map((_, i) => (
                        <tr key={i} className="border-b border-white/5 animate-pulse">
                            <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-4 bg-white/10 rounded" />
                                    <div className="w-8 h-8 bg-white/10 rounded-full" />
                                    <div>
                                        <div className="h-4 w-16 bg-white/10 rounded mb-1" />
                                        <div className="h-3 w-10 bg-white/10 rounded" />
                                    </div>
                                </div>
                            </td>
                            <td className="py-3 px-4"><div className="h-5 w-16 bg-white/10 rounded" /></td>
                            <td className="py-3 px-4"><div className="h-4 w-16 bg-white/10 rounded ml-auto" /></td>
                            <td className="py-3 px-4"><div className="h-4 w-12 bg-white/10 rounded ml-auto" /></td>
                            <td className="py-3 px-4"><div className="h-4 w-16 bg-white/10 rounded ml-auto" /></td>
                            <td className="py-3 px-4"><div className="h-4 w-16 bg-white/10 rounded ml-auto" /></td>
                            <td className="py-3 px-4"><div className="h-4 w-12 bg-white/10 rounded ml-auto" /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
