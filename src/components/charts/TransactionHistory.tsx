'use client';

import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { formatNumber, formatTimeAgo, shortenAddress } from '@/lib/utils';
import { Pair } from '@/lib/types';

interface Transaction {
    id: string;
    type: 'buy' | 'sell';
    amount: number;
    priceUsd: number;
    totalValue: number;
    maker: string;
    timestamp: number;
    txHash: string;
}

interface TransactionHistoryProps {
    pair: Pair;
    chainId: string;
    itemsPerPage?: number;
}

// Generate mock transactions based on pair data
function generateMockTransactions(pair: Pair, count: number = 50): Transaction[] {
    const transactions: Transaction[] = [];
    const now = Date.now();
    const priceUsd = pair.priceUsd ? parseFloat(pair.priceUsd) : 0;

    for (let i = 0; i < count; i++) {
        const type = Math.random() > 0.5 ? 'buy' : 'sell';
        const amount = Math.random() * 10000 + 100;
        const priceVariation = priceUsd * (0.98 + Math.random() * 0.04); // +/- 2%
        const totalValue = amount * priceVariation;

        transactions.push({
            id: `tx-${i}`,
            type,
            amount,
            priceUsd: priceVariation,
            totalValue,
            maker: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
            timestamp: now - (i * (60000 + Math.random() * 300000)), // 1-6 min intervals
            txHash: `0x${Math.random().toString(16).slice(2, 66)}`,
        });
    }

    return transactions;
}

// Get block explorer URL for chain
function getExplorerUrl(chainId: string, txHash: string): string {
    const explorers: Record<string, string> = {
        'ethereum': `https://etherscan.io/tx/${txHash}`,
        'bsc': `https://bscscan.com/tx/${txHash}`,
        'polygon': `https://polygonscan.com/tx/${txHash}`,
        'arbitrum': `https://arbiscan.io/tx/${txHash}`,
        'optimism': `https://optimistic.etherscan.io/tx/${txHash}`,
        'base': `https://basescan.org/tx/${txHash}`,
        'avalanche': `https://snowtrace.io/tx/${txHash}`,
        'fantom': `https://ftmscan.com/tx/${txHash}`,
        'solana': `https://solscan.io/tx/${txHash}`,
    };
    return explorers[chainId] || `https://etherscan.io/tx/${txHash}`;
}

export function TransactionHistory({
    pair,
    chainId,
    itemsPerPage = 5
}: TransactionHistoryProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState<'all' | 'buy' | 'sell'>('all');

    // Generate mock transactions
    const allTransactions = generateMockTransactions(pair, 50);

    // Filter transactions
    const filteredTransactions = filter === 'all'
        ? allTransactions
        : allTransactions.filter(tx => tx.type === filter);

    // Pagination
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const displayedTransactions = filteredTransactions.slice(startIdx, startIdx + itemsPerPage);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                    {(['all', 'buy', 'sell'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => { setFilter(f); setCurrentPage(1); }}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${filter === f
                                    ? f === 'buy'
                                        ? 'bg-emerald-500 text-black'
                                        : f === 'sell'
                                            ? 'bg-red-500 text-white'
                                            : 'bg-white/10 text-white'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-white/5">
                        <tr className="text-xs text-gray-500 uppercase">
                            <th className="px-4 py-3 text-left font-medium">Type</th>
                            <th className="px-4 py-3 text-right font-medium">Amount</th>
                            <th className="px-4 py-3 text-right font-medium">Price</th>
                            <th className="px-4 py-3 text-right font-medium">Value</th>
                            <th className="px-4 py-3 text-left font-medium">Maker</th>
                            <th className="px-4 py-3 text-right font-medium">Time</th>
                            <th className="px-4 py-3 text-center font-medium">Tx</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {displayedTransactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${tx.type === 'buy'
                                            ? 'bg-emerald-500/20 text-emerald-400'
                                            : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        {tx.type === 'buy'
                                            ? <ArrowUpRight size={12} />
                                            : <ArrowDownRight size={12} />
                                        }
                                        {tx.type.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right font-mono text-sm text-white">
                                    {formatNumber(tx.amount)}
                                </td>
                                <td className="px-4 py-3 text-right font-mono text-sm text-gray-400">
                                    ${tx.priceUsd < 0.01 ? tx.priceUsd.toExponential(2) : tx.priceUsd.toFixed(6)}
                                </td>
                                <td className="px-4 py-3 text-right font-mono text-sm text-white">
                                    ${formatNumber(tx.totalValue)}
                                </td>
                                <td className="px-4 py-3 text-left">
                                    <span className="font-mono text-xs text-gray-400">{tx.maker}</span>
                                </td>
                                <td className="px-4 py-3 text-right text-sm text-gray-500">
                                    {formatTimeAgo(tx.timestamp)}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <a
                                        href={getExplorerUrl(chainId, tx.txHash)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-emerald-400 transition-colors"
                                        title="View on Explorer"
                                    >
                                        <ExternalLink size={12} />
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
                <div className="text-sm text-gray-500">
                    Showing {startIdx + 1}-{Math.min(startIdx + itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft size={14} />
                        Prev
                    </button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum: number;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => goToPage(pageNum)}
                                    className={`w-8 h-8 text-sm font-medium rounded-lg transition-all ${currentPage === pageNum
                                            ? 'bg-emerald-500 text-black'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Next
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
