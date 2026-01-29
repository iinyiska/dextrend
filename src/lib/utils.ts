import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Format large numbers with abbreviations
export function formatNumber(num: number, decimals: number = 2): string {
    if (num === null || num === undefined || isNaN(num)) return '0';

    const absNum = Math.abs(num);

    if (absNum >= 1e12) {
        return (num / 1e12).toFixed(decimals) + 'T';
    }
    if (absNum >= 1e9) {
        return (num / 1e9).toFixed(decimals) + 'B';
    }
    if (absNum >= 1e6) {
        return (num / 1e6).toFixed(decimals) + 'M';
    }
    if (absNum >= 1e3) {
        return (num / 1e3).toFixed(decimals) + 'K';
    }

    return num.toFixed(decimals);
}

// Format price with appropriate decimals
export function formatPrice(price: string | number): string {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(num)) return '$0.00';

    if (num >= 1) {
        return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (num >= 0.01) {
        return '$' + num.toFixed(4);
    }
    if (num >= 0.0001) {
        return '$' + num.toFixed(6);
    }

    // For very small numbers, use scientific notation or subscript
    const str = num.toFixed(12);
    const match = str.match(/^0\.(0+)(\d+)/);
    if (match) {
        const zeros = match[1].length;
        const significant = match[2].slice(0, 4);
        return `$0.0₍${zeros}₎${significant}`;
    }

    return '$' + num.toExponential(4);
}

// Format percentage change
export function formatPercentage(value: number): string {
    if (value === null || value === undefined || isNaN(value)) return '0%';
    const sign = value >= 0 ? '+' : '';
    return sign + value.toFixed(2) + '%';
}

// Format time ago
export function formatTimeAgo(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;

    return new Date(timestamp).toLocaleDateString();
}

// Shorten address
export function shortenAddress(address: string, chars: number = 4): string {
    if (!address) return '';
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// Get chain color
export function getChainColor(chainId: string): string {
    const colors: Record<string, string> = {
        ethereum: '#627EEA',
        bsc: '#F0B90B',
        solana: '#9945FF',
        polygon: '#8247E5',
        arbitrum: '#28A0F0',
        base: '#0052FF',
        avalanche: '#E84142',
        optimism: '#FF0420',
        fantom: '#1969FF',
        cronos: '#002D74',
    };
    return colors[chainId] || '#888888';
}

// Get chain name
export function getChainName(chainId: string): string {
    const names: Record<string, string> = {
        ethereum: 'Ethereum',
        bsc: 'BNB Chain',
        solana: 'Solana',
        polygon: 'Polygon',
        arbitrum: 'Arbitrum',
        base: 'Base',
        avalanche: 'Avalanche',
        optimism: 'Optimism',
        fantom: 'Fantom',
        cronos: 'Cronos',
    };
    return names[chainId] || chainId;
}

// Debounce function
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
