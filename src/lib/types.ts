// DexScreener API Types

export interface Token {
  address: string;
  name: string;
  symbol: string;
}

export interface PriceChange {
  m5: number;
  h1: number;
  h6: number;
  h24: number;
}

export interface Liquidity {
  usd: number;
  base: number;
  quote: number;
}

export interface Volume {
  h24: number;
  h6: number;
  h1: number;
  m5: number;
}

export interface Txns {
  m5: { buys: number; sells: number };
  h1: { buys: number; sells: number };
  h6: { buys: number; sells: number };
  h24: { buys: number; sells: number };
}

export interface Pair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: Token;
  quoteToken: Token;
  priceNative: string;
  priceUsd: string;
  txns: Txns;
  volume: Volume;
  priceChange: PriceChange;
  liquidity: Liquidity;
  fdv: number;
  marketCap: number;
  pairCreatedAt: number;
  info?: {
    imageUrl?: string;
    header?: string;
    openGraph?: string;
    websites?: { label: string; url: string }[];
    socials?: { type: string; url: string }[];
  };
}

export interface SearchResponse {
  schemaVersion: string;
  pairs: Pair[];
}

export interface TokenProfile {
  url: string;
  chainId: string;
  tokenAddress: string;
  icon?: string;
  header?: string;
  description?: string;
  links?: { type: string; label: string; url: string }[];
}

export interface BoostedToken {
  url: string;
  chainId: string;
  tokenAddress: string;
  icon?: string;
  header?: string;
  description?: string;
  amount: number;
  totalAmount: number;
}

export interface Chain {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const SUPPORTED_CHAINS: Chain[] = [
  { id: 'ethereum', name: 'Ethereum', icon: '⟠', color: '#627EEA' },
  { id: 'bsc', name: 'BNB Chain', icon: '⛓', color: '#F0B90B' },
  { id: 'solana', name: 'Solana', icon: '◎', color: '#9945FF' },
  { id: 'polygon', name: 'Polygon', icon: '⬡', color: '#8247E5' },
  { id: 'arbitrum', name: 'Arbitrum', icon: '🅐', color: '#28A0F0' },
  { id: 'base', name: 'Base', icon: '🅱', color: '#0052FF' },
  { id: 'avalanche', name: 'Avalanche', icon: '🔺', color: '#E84142' },
  { id: 'optimism', name: 'Optimism', icon: '⭕', color: '#FF0420' },
  { id: 'fantom', name: 'Fantom', icon: '👻', color: '#1969FF' },
  { id: 'cronos', name: 'Cronos', icon: '🔷', color: '#002D74' },
];
