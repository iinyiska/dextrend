'use client';

import { useState } from 'react';
import { getChainColor } from '@/lib/utils';

interface TokenLogoProps {
    imageUrl?: string;
    symbol: string;
    chainId?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
    xl: 'w-16 h-16 text-xl',
};

export function TokenLogo({ imageUrl, symbol, chainId, size = 'md', className = '' }: TokenLogoProps) {
    const [imgError, setImgError] = useState(false);
    const sizeClass = sizeClasses[size];

    // Fallback gradient based on chain or symbol
    const fallbackBg = chainId
        ? `linear-gradient(135deg, ${getChainColor(chainId)}, #1a1a1a)`
        : `linear-gradient(135deg, #10b981, #06b6d4)`;

    // If we have an image URL and it hasn't errored, show the image
    if (imageUrl && !imgError) {
        return (
            <div className={`${sizeClass} rounded-full overflow-hidden flex-shrink-0 ${className}`}>
                <img
                    src={imageUrl}
                    alt={symbol}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                    loading="lazy"
                />
            </div>
        );
    }

    // Fallback to symbol initials with gradient
    return (
        <div
            className={`${sizeClass} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${className}`}
            style={{ background: fallbackBg }}
        >
            {symbol.slice(0, 2).toUpperCase()}
        </div>
    );
}

// Helper function to get token logo URL from various sources
export function getTokenLogoUrl(pair: {
    info?: { imageUrl?: string };
    baseToken: { address: string; symbol: string };
    chainId: string;
}): string | undefined {
    // 1. First try DexScreener's imageUrl
    if (pair.info?.imageUrl) {
        return pair.info.imageUrl;
    }

    // 2. Try Trust Wallet Assets (works for many tokens)
    const chainMap: Record<string, string> = {
        'ethereum': 'ethereum',
        'bsc': 'smartchain',
        'polygon': 'polygon',
        'arbitrum': 'arbitrum',
        'avalanche': 'avalanchec',
        'base': 'base',
        'optimism': 'optimism',
    };

    const trustWalletChain = chainMap[pair.chainId];
    if (trustWalletChain && pair.baseToken.address) {
        return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${trustWalletChain}/assets/${pair.baseToken.address}/logo.png`;
    }

    return undefined;
}
