'use client';

import Link from 'next/link';
import { usePromotedTokens, PromotedToken } from '@/components/admin/DynamicContent';
import { TokenLogo } from './TokenLogo';
import { Star, TrendingUp } from 'lucide-react';
import { getChainName, getChainColor } from '@/lib/utils';

// Promoted Token Card for manually added tokens
function PromotedTokenCard({ token }: { token: PromotedToken }) {
    return (
        <Link
            href={`/${token.chain_id}/${token.pair_address}`}
            className="group block bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-2xl border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-orange-500/10 relative"
        >
            {/* Promoted Badge */}
            <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full text-xs font-bold text-white flex items-center gap-1">
                <Star size={10} fill="currentColor" />
                PROMOTED
            </div>

            <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                    <TokenLogo
                        imageUrl={token.logo_url || undefined}
                        symbol={token.token_symbol}
                        chainId={token.chain_id}
                        size="lg"
                    />
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{token.token_symbol}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{
                                    backgroundColor: getChainColor(token.chain_id) + '20',
                                    color: getChainColor(token.chain_id)
                                }}
                            >
                                {getChainName(token.chain_id)}
                            </span>
                        </div>
                    </div>
                </div>

                {token.token_name && (
                    <p className="text-sm text-gray-400 truncate">{token.token_name}</p>
                )}

                <div className="mt-3 flex items-center gap-2 text-sm text-orange-400">
                    <TrendingUp size={14} />
                    <span>View Details</span>
                </div>
            </div>
        </Link>
    );
}

// Grid component that shows promoted tokens first, then API tokens
export function PromotedTokensGrid({
    apiTokens = [],
    isLoading = false,
    maxItems = 4
}: {
    apiTokens?: any[];
    isLoading?: boolean;
    maxItems?: number;
}) {
    const { promotedTokens, hasPromotedTokens, isLoaded } = usePromotedTokens();

    // Show loading skeleton
    if (isLoading || !isLoaded) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-4 animate-pulse">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-white/10" />
                            <div>
                                <div className="h-4 w-20 bg-white/10 rounded mb-1" />
                                <div className="h-3 w-16 bg-white/10 rounded" />
                            </div>
                        </div>
                        <div className="h-6 w-24 bg-white/10 rounded mb-2" />
                        <div className="h-4 w-16 bg-white/10 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    // If we have promoted tokens, show them first
    if (hasPromotedTokens) {
        const displayTokens = promotedTokens.slice(0, maxItems);

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayTokens.map((token) => (
                    <PromotedTokenCard key={token.id} token={token} />
                ))}
            </div>
        );
    }

    // Fallback to API tokens if no promoted tokens
    if (!apiTokens || apiTokens.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p>No tokens to display</p>
            </div>
        );
    }

    // Import TokenGrid dynamically to avoid circular deps
    const { TokenGrid } = require('./TokenGrid');
    return <TokenGrid pairs={apiTokens.slice(0, maxItems)} isLoading={isLoading} />;
}
