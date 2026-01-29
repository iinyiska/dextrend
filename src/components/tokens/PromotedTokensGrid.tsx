'use client';

import Link from 'next/link';
import { usePromotedTokens, PromotedToken } from '@/components/admin/DynamicContent';
import { TokenLogo } from './TokenLogo';
import { TokenCard } from './TokenCard';
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
            <div className="relative group">
                {/* Horizontal Scrolling Container */}
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                    {displayTokens.length > 0 ? (
                        displayTokens.map((token) => (
                            <div key={token.id} className="snap-center shrink-0 w-[85vw] sm:w-[320px]">
                                <PromotedTokenCard token={token} />
                            </div>
                        ))
                    ) : (
                        <div className="w-full text-center py-8 bg-[#1a1a1a]/50 rounded-xl border border-dashed border-white/10">
                            <p className="text-gray-500">No promoted tokens active</p>
                        </div>
                    )}
                </div>

                {/* Fade overlays for smooth edges */}
                <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#0d0d0d] to-transparent pointer-events-none md:hidden" />
                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#0d0d0d] to-transparent pointer-events-none md:hidden" />
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

    // API Tokens Slider (same layout as promoted)
    return (
        <div className="relative group">
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                {apiTokens.slice(0, maxItems).map((pair) => (
                    <div key={`${pair.chainId}-${pair.pairAddress}`} className="snap-center shrink-0 w-[85vw] sm:w-[320px]">
                        {/* We use TokenCard but ensure it styles nicely in slider */}
                        <div className="h-full">
                            <TokenCard pair={pair} />
                        </div>
                    </div>
                ))}
            </div>
            {/* Fade overlays */}
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#0d0d0d] to-transparent pointer-events-none md:hidden" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#0d0d0d] to-transparent pointer-events-none md:hidden" />
        </div>
    );
}
