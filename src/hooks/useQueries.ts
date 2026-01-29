'use client';

import { useQuery } from '@tanstack/react-query';
import {
    searchPairs,
    getBoostedTokens,
    getTopBoostedTokens,
    getNewPairs,
    getGainers,
    getLosers,
    getTokenPools,
    getPairsByAddress
} from '@/lib/api';

// Search pairs hook
export function useSearchPairs(query: string) {
    return useQuery({
        queryKey: ['search', query],
        queryFn: () => searchPairs(query),
        enabled: query.length >= 2,
        staleTime: 30000, // 30 seconds
    });
}

// Trending tokens hook (boosted tokens)
export function useTrendingTokens() {
    return useQuery({
        queryKey: ['trending'],
        queryFn: getBoostedTokens,
        staleTime: 60000, // 1 minute
        refetchInterval: 60000,
    });
}

// Top boosted tokens hook
export function useTopBoostedTokens() {
    return useQuery({
        queryKey: ['topBoosted'],
        queryFn: getTopBoostedTokens,
        staleTime: 60000,
        refetchInterval: 60000,
    });
}

// New pairs hook
export function useNewPairs(chainId?: string) {
    return useQuery({
        queryKey: ['newPairs', chainId],
        queryFn: () => getNewPairs(chainId),
        staleTime: 30000,
        refetchInterval: 30000,
    });
}

// Gainers hook
export function useGainers() {
    return useQuery({
        queryKey: ['gainers'],
        queryFn: getGainers,
        staleTime: 60000,
        refetchInterval: 60000,
    });
}

// Losers hook
export function useLosers() {
    return useQuery({
        queryKey: ['losers'],
        queryFn: getLosers,
        staleTime: 60000,
        refetchInterval: 60000,
    });
}

// Token pools hook
export function useTokenPools(chainId: string, tokenAddress: string) {
    return useQuery({
        queryKey: ['tokenPools', chainId, tokenAddress],
        queryFn: () => getTokenPools(chainId, tokenAddress),
        enabled: !!chainId && !!tokenAddress,
        staleTime: 30000,
    });
}

// Single pair hook
export function usePair(chainId: string, pairAddress: string) {
    return useQuery({
        queryKey: ['pair', chainId, pairAddress],
        queryFn: () => getPairsByAddress(chainId, pairAddress),
        enabled: !!chainId && !!pairAddress,
        staleTime: 10000, // 10 seconds for real-time feel
        refetchInterval: 10000,
    });
}
