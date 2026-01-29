'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Search, Moon, Sun, Menu, TrendingUp, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { searchPairs } from '@/lib/api';
import { Pair } from '@/lib/types';
import { formatPrice, formatPercentage, debounce, getChainName } from '@/lib/utils';
import { DynamicLogo, AdDisplay } from '@/components/admin/DynamicContent';

export function Header() {
    const { theme, toggleTheme, toggleSidebar } = useStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Pair[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Close search results when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search
    const debouncedSearch = useRef(
        debounce(async (query: string) => {
            if (query.length < 2) {
                setSearchResults([]);
                setIsSearching(false);
                return;
            }
            setIsSearching(true);
            const results = await searchPairs(query);
            setSearchResults(results.slice(0, 8));
            setIsSearching(false);
        }, 300)
    ).current;

    useEffect(() => {
        debouncedSearch(searchQuery);
    }, [searchQuery, debouncedSearch]);

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0d0d0d]/95 backdrop-blur-xl">
                {/* Header Ad Slot */}
                <div className="hidden md:block">
                    <AdDisplay position="header" />
                </div>

                <div className="flex items-center justify-between px-4 py-3">
                    {/* Left: Menu + Logo */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="p-3 mr-2 rounded-xl hover:bg-white/10 active:bg-white/20 transition-all lg:hidden"
                            aria-label="Toggle Menu"
                        >
                            <Menu size={24} />
                        </button>

                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                                <TrendingUp size={18} className="text-black" />
                            </div>
                            <DynamicLogo />
                        </Link>
                    </div>

                    {/* Center: Search */}
                    <div ref={searchRef} className="relative flex-1 max-w-xl mx-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search tokens, addresses..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowResults(true);
                                }}
                                onFocus={() => setShowResults(true)}
                                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 
                         focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20
                         placeholder:text-gray-500 transition-all text-sm"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSearchResults([]);
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Search Results Dropdown */}
                        {showResults && searchQuery.length >= 2 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                                {isSearching ? (
                                    <div className="p-4 text-center text-gray-400">
                                        <div className="animate-spin w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto" />
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <div className="max-h-96 overflow-y-auto">
                                        {searchResults.map((pair) => (
                                            <Link
                                                key={`${pair.chainId}-${pair.pairAddress}`}
                                                href={`/${pair.chainId}/${pair.pairAddress}`}
                                                onClick={() => {
                                                    setShowResults(false);
                                                    setSearchQuery('');
                                                }}
                                                className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-xs font-bold">
                                                        {pair.baseToken.symbol.slice(0, 2)}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {pair.baseToken.symbol}
                                                            <span className="text-gray-500 text-sm">/{pair.quoteToken.symbol}</span>
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {getChainName(pair.chainId)} • {pair.dexId}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-medium">{formatPrice(pair.priceUsd)}</div>
                                                    <div className={`text-xs ${pair.priceChange?.h24 >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                        {formatPercentage(pair.priceChange?.h24 || 0)}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-gray-400">
                                        No tokens found
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </header>
        </>
    );
}
