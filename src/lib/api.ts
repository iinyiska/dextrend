import { SearchResponse, Pair, TokenProfile, BoostedToken } from './types';

const BASE_URL = 'https://api.dexscreener.com';

// Search for pairs matching query
export async function searchPairs(query: string): Promise<Pair[]> {
    try {
        const res = await fetch(`${BASE_URL}/latest/dex/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data: SearchResponse = await res.json();
        return data.pairs || [];
    } catch (error) {
        console.error('Search pairs error:', error);
        return [];
    }
}

// Get pairs by chain and pair address
export async function getPairsByAddress(chainId: string, pairAddress: string): Promise<Pair | null> {
    try {
        const res = await fetch(`${BASE_URL}/latest/dex/pairs/${chainId}/${pairAddress}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        return data.pairs?.[0] || null;
    } catch (error) {
        console.error('Get pair error:', error);
        return null;
    }
}

// Get token pools by chain and token address
export async function getTokenPools(chainId: string, tokenAddress: string): Promise<Pair[]> {
    try {
        const res = await fetch(`${BASE_URL}/token-pairs/v1/${chainId}/${tokenAddress}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        return data || [];
    } catch (error) {
        console.error('Get token pools error:', error);
        return [];
    }
}

// Get tokens by addresses (up to 30)
export async function getTokensByAddresses(chainId: string, addresses: string[]): Promise<Pair[]> {
    try {
        const addressList = addresses.slice(0, 30).join(',');
        const res = await fetch(`${BASE_URL}/tokens/v1/${chainId}/${addressList}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        return data || [];
    } catch (error) {
        console.error('Get tokens error:', error);
        return [];
    }
}

// Get latest token profiles
export async function getTokenProfiles(): Promise<TokenProfile[]> {
    try {
        const res = await fetch(`${BASE_URL}/token-profiles/latest/v1`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        return data || [];
    } catch (error) {
        console.error('Get token profiles error:', error);
        return [];
    }
}

// Get latest boosted tokens (trending)
export async function getBoostedTokens(): Promise<BoostedToken[]> {
    try {
        const res = await fetch(`${BASE_URL}/token-boosts/latest/v1`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        return data || [];
    } catch (error) {
        console.error('Get boosted tokens error:', error);
        return [];
    }
}

// Get top boosted tokens
export async function getTopBoostedTokens(): Promise<BoostedToken[]> {
    try {
        const res = await fetch(`${BASE_URL}/token-boosts/top/v1`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        return data || [];
    } catch (error) {
        console.error('Get top boosted error:', error);
        return [];
    }
}

// Get new pairs (search with empty query, sorted by creation time)
export async function getNewPairs(chainId?: string): Promise<Pair[]> {
    try {
        // Use a popular quote token search to get recent pairs
        const queries = ['USDT', 'USDC', 'WETH', 'SOL'];
        const results: Pair[] = [];

        for (const q of queries.slice(0, 2)) {
            const pairs = await searchPairs(q);
            results.push(...pairs);
        }

        // Sort by creation time (newest first)
        const sorted = results
            .filter(p => chainId ? p.chainId === chainId : true)
            .sort((a, b) => (b.pairCreatedAt || 0) - (a.pairCreatedAt || 0))
            .slice(0, 50);

        // Remove duplicates
        const seen = new Set<string>();
        return sorted.filter(p => {
            const key = `${p.chainId}-${p.pairAddress}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    } catch (error) {
        console.error('Get new pairs error:', error);
        return [];
    }
}

// Get gainers (tokens with highest price change)
export async function getGainers(): Promise<Pair[]> {
    try {
        const pairs = await searchPairs('USDC');
        return pairs
            .filter(p => p.priceChange?.h24 > 0 && p.liquidity?.usd > 10000)
            .sort((a, b) => (b.priceChange?.h24 || 0) - (a.priceChange?.h24 || 0))
            .slice(0, 20);
    } catch (error) {
        console.error('Get gainers error:', error);
        return [];
    }
}

// Get losers (tokens with lowest price change)
export async function getLosers(): Promise<Pair[]> {
    try {
        const pairs = await searchPairs('USDT');
        return pairs
            .filter(p => p.priceChange?.h24 < 0 && p.liquidity?.usd > 10000)
            .sort((a, b) => (a.priceChange?.h24 || 0) - (b.priceChange?.h24 || 0))
            .slice(0, 20);
    } catch (error) {
        console.error('Get losers error:', error);
        return [];
    }
}
