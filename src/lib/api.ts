import { SearchResponse, Pair, TokenProfile, BoostedToken } from './types';

const BASE_URL = 'https://api.dexscreener.com';

// List of stablecoins and wrapped tokens to filter out from base token
const EXCLUDED_SYMBOLS = [
    'USDT', 'USDC', 'BUSD', 'DAI', 'TUSD', 'USDP', 'USDD', 'FRAX', 'LUSD',
    'GUSD', 'SUSD', 'CUSD', 'MIM', 'DOLA', 'FEI', 'UST', 'HUSD', 'USDJ',
    'WETH', 'WBTC', 'WBNB', 'WSOL', 'WMATIC', 'WAVAX', 'WFTM'
];

// Filter out stablecoins from pairs (base token should not be a stablecoin)
function filterStablecoins(pairs: Pair[]): Pair[] {
    return pairs.filter(p => {
        const symbol = p.baseToken.symbol.toUpperCase();
        return !EXCLUDED_SYMBOLS.includes(symbol);
    });
}

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

// Get new pairs (search with varied queries for diversity)
export async function getNewPairs(chainId?: string): Promise<Pair[]> {
    try {
        // Use varied search terms for diverse results
        const queries = ['pepe', 'doge', 'inu', 'ai', 'meme', 'cat', 'trump', 'elon'];
        const results: Pair[] = [];

        // Fetch from multiple queries for variety
        const promises = queries.slice(0, 3).map(q => searchPairs(q));
        const responses = await Promise.all(promises);
        responses.forEach(pairs => results.push(...pairs));

        // Filter out stablecoins and sort by creation time (newest first)
        const filtered = filterStablecoins(results)
            .filter(p => chainId ? p.chainId === chainId : true)
            .filter(p => p.liquidity?.usd > 1000) // Minimum liquidity
            .sort((a, b) => (b.pairCreatedAt || 0) - (a.pairCreatedAt || 0));

        // Remove duplicates
        const seen = new Set<string>();
        return filtered.filter(p => {
            const key = `${p.chainId}-${p.pairAddress}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        }).slice(0, 50);
    } catch (error) {
        console.error('Get new pairs error:', error);
        return [];
    }
}

// Get gainers (tokens with highest price change)
export async function getGainers(): Promise<Pair[]> {
    try {
        // Use varied search terms
        const queries = ['pepe', 'inu', 'ai', 'meme'];
        const results: Pair[] = [];

        const promises = queries.slice(0, 2).map(q => searchPairs(q));
        const responses = await Promise.all(promises);
        responses.forEach(pairs => results.push(...pairs));

        return filterStablecoins(results)
            .filter(p => p.priceChange?.h24 > 0 && p.liquidity?.usd > 5000)
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
        // Use varied search terms
        const queries = ['doge', 'cat', 'elon', 'trump'];
        const results: Pair[] = [];

        const promises = queries.slice(0, 2).map(q => searchPairs(q));
        const responses = await Promise.all(promises);
        responses.forEach(pairs => results.push(...pairs));

        return filterStablecoins(results)
            .filter(p => p.priceChange?.h24 < 0 && p.liquidity?.usd > 5000)
            .sort((a, b) => (a.priceChange?.h24 || 0) - (b.priceChange?.h24 || 0))
            .slice(0, 20);
    } catch (error) {
        console.error('Get losers error:', error);
        return [];
    }
}

// Get trending tokens (using boosted tokens or high volume)
export async function getTrendingTokens(): Promise<Pair[]> {
    try {
        const queries = ['pepe', 'trump', 'meme', 'ai'];
        const results: Pair[] = [];

        const promises = queries.slice(0, 2).map(q => searchPairs(q));
        const responses = await Promise.all(promises);
        responses.forEach(pairs => results.push(...pairs));

        return filterStablecoins(results)
            .filter(p => p.liquidity?.usd > 10000)
            .sort((a, b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0))
            .slice(0, 20);
    } catch (error) {
        console.error('Get trending error:', error);
        return [];
    }
}
