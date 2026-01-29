'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Flame, Zap, TrendingUp, TrendingDown, Star, Settings } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn, getChainColor } from '@/lib/utils';
import { SUPPORTED_CHAINS } from '@/lib/types';

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/trending', label: 'Trending', icon: Flame },
    { href: '/new-pairs', label: 'New Pairs', icon: Zap },
    { href: '/gainers', label: 'Gainers', icon: TrendingUp },
    { href: '/losers', label: 'Losers', icon: TrendingDown },
    { href: '/watchlist', label: 'Watchlist', icon: Star },
];

export function Sidebar() {
    const pathname = usePathname();
    const { sidebarOpen, selectedChain, setSelectedChain } = useStore();

    return (
        <aside
            className={cn(
                'fixed left-0 top-16 bottom-0 z-40 w-64 bg-[#0d0d0d] border-r border-white/10',
                'transition-transform duration-300 ease-in-out',
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            )}
        >
            <div className="flex flex-col h-full p-4">
                {/* Navigation */}
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
                                    isActive
                                        ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400'
                                        : 'hover:bg-white/5 text-gray-400 hover:text-white'
                                )}
                            >
                                <item.icon size={18} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Divider */}
                <div className="my-6 h-px bg-white/10" />

                {/* Chain Filter */}
                <div className="flex-1 overflow-y-auto">
                    <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Chains
                    </h3>
                    <div className="space-y-1">
                        {/* All Chains option */}
                        <button
                            onClick={() => setSelectedChain(null)}
                            className={cn(
                                'w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-left',
                                selectedChain === null
                                    ? 'bg-white/10 text-white'
                                    : 'hover:bg-white/5 text-gray-400 hover:text-white'
                            )}
                        >
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs">
                                ∞
                            </div>
                            <span className="font-medium">All Chains</span>
                        </button>

                        {SUPPORTED_CHAINS.map((chain) => (
                            <button
                                key={chain.id}
                                onClick={() => setSelectedChain(chain.id)}
                                className={cn(
                                    'w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-left',
                                    selectedChain === chain.id
                                        ? 'bg-white/10 text-white'
                                        : 'hover:bg-white/5 text-gray-400 hover:text-white'
                                )}
                            >
                                <div
                                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                                    style={{ backgroundColor: getChainColor(chain.id) + '30' }}
                                >
                                    {chain.icon}
                                </div>
                                <span className="font-medium">{chain.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Settings */}
                <div className="mt-4 pt-4 border-t border-white/10">
                    <Link
                        href="/settings"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all"
                    >
                        <Settings size={18} />
                        <span className="font-medium">Settings</span>
                    </Link>
                </div>
            </div>
        </aside>
    );
}
