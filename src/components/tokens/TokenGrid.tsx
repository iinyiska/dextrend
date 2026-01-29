'use client';

import { Pair, BoostedToken } from '@/lib/types';
import { TokenCard, TokenCardSkeleton } from './TokenCard';

interface TokenGridProps {
    pairs?: Pair[];
    boostedTokens?: BoostedToken[];
    isLoading?: boolean;
    emptyMessage?: string;
}

export function TokenGrid({ pairs, boostedTokens, isLoading = false, emptyMessage = 'No tokens found' }: TokenGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                    <TokenCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    // If we have boosted tokens, we need to fetch their pair data
    // For now, just show pairs
    if (!pairs || pairs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <div className="text-6xl mb-4">🔍</div>
                <p>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pairs.map((pair) => (
                <TokenCard key={`${pair.chainId}-${pair.pairAddress}`} pair={pair} />
            ))}
        </div>
    );
}
