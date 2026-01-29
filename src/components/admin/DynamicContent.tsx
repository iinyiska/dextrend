'use client';

import { useEffect, useState } from 'react';
import { Rocket, ExternalLink, Send, MessageCircle } from 'lucide-react';

interface SiteSettings {
    logo_url: string;
    logo_text: string;
    site_title: string;
    site_description: string;
    primary_color: string;
    header_bg_color: string;
    promote_link: string;
    promote_button_text: string;
    telegram_link: string;
    twitter_link: string;
    discord_link: string;
    footer_text: string;
}

interface Banner {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    image_url: string;
    link_url: string;
    button_text: string;
    is_active: boolean;
    position: string;
    gradient_from: string;
    gradient_to: string;
}

interface Ad {
    id: number;
    name: string;
    ad_code: string;
    position: string;
    is_active: boolean;
}

const defaultSettings: SiteSettings = {
    logo_url: '',
    logo_text: 'DexTrend',
    site_title: 'DexTrend - Real-Time DEX Analytics',
    site_description: 'Track trending tokens across multiple blockchains',
    primary_color: '#00ff88',
    header_bg_color: '#0d0d0d',
    promote_link: 'https://t.me/yourusername',
    promote_button_text: '🚀 Boost Token',
    telegram_link: '',
    twitter_link: '',
    discord_link: '',
    footer_text: '© 2024 DexTrend. All rights reserved.'
};

export function useSiteSettings() {
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [ads, setAds] = useState<Ad[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const savedSettings = localStorage.getItem('dextrend_site_settings');
        if (savedSettings) {
            setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
        }

        const savedBanners = localStorage.getItem('dextrend_banners');
        if (savedBanners) {
            setBanners(JSON.parse(savedBanners));
        }

        const savedAds = localStorage.getItem('dextrend_ads');
        if (savedAds) {
            setAds(JSON.parse(savedAds));
        }

        setIsLoaded(true);
    }, []);

    const getBannersByPosition = (position: string) => {
        return banners.filter(b => b.position === position && b.is_active);
    };

    const getAdsByPosition = (position: string) => {
        return ads.filter(a => a.position === position && a.is_active);
    };

    return {
        settings,
        banners,
        ads,
        isLoaded,
        getBannersByPosition,
        getAdsByPosition
    };
}

// Attractive Interactive Banner Component
export function BannerDisplay({ position }: { position: string }) {
    const { getBannersByPosition, isLoaded } = useSiteSettings();
    const positionBanners = getBannersByPosition(position);

    if (!isLoaded || positionBanners.length === 0) return null;

    return (
        <div className="space-y-4">
            {positionBanners.map((banner) => (
                <a
                    key={banner.id}
                    href={banner.link_url || '#'}
                    target={banner.link_url ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="block group"
                >
                    <div
                        className="relative overflow-hidden rounded-2xl border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:shadow-2xl"
                        style={{
                            background: banner.image_url
                                ? `url(${banner.image_url}) center/cover`
                                : `linear-gradient(135deg, ${banner.gradient_from || '#10b981'}, ${banner.gradient_to || '#06b6d4'})`
                        }}
                    >
                        {/* Overlay for text readability */}
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

                        {/* Animated glow effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 p-6 md:p-8">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                            <Rocket className="w-5 h-5 text-white" />
                                        </div>
                                        {banner.subtitle && (
                                            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                                                {banner.subtitle}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform">
                                        {banner.title}
                                    </h3>
                                    {banner.description && (
                                        <p className="text-white/80 text-sm md:text-base max-w-xl">
                                            {banner.description}
                                        </p>
                                    )}
                                </div>

                                {banner.button_text && (
                                    <div className="flex-shrink-0">
                                        <span className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl group-hover:bg-white/90 transition-colors shadow-lg">
                                            {banner.button_text}
                                            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
                    </div>
                </a>
            ))}
        </div>
    );
}

// Ad Component
export function AdDisplay({ position }: { position: string }) {
    const { getAdsByPosition, isLoaded } = useSiteSettings();
    const positionAds = getAdsByPosition(position);

    if (!isLoaded || positionAds.length === 0) return null;

    return (
        <div className="ad-container space-y-4">
            {positionAds.map((ad) => (
                <div
                    key={ad.id}
                    className="ad-slot"
                    dangerouslySetInnerHTML={{ __html: ad.ad_code }}
                />
            ))}
        </div>
    );
}

// Dynamic Logo Component
export function DynamicLogo() {
    const { settings, isLoaded } = useSiteSettings();

    if (!isLoaded) {
        return (
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                DexTrend
            </span>
        );
    }

    if (settings.logo_url) {
        return (
            <img
                src={settings.logo_url}
                alt={settings.logo_text}
                className="h-8 w-auto"
            />
        );
    }

    const text = settings.logo_text || 'DexTrend';
    const midPoint = Math.floor(text.length / 2);
    const firstPart = text.substring(0, midPoint);
    const secondPart = text.substring(midPoint);

    return (
        <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            {firstPart}{secondPart}
        </span>
    );
}

// Boost Token Button (replaces DexScreener link)
export function BoostTokenButton({ tokenSymbol }: { tokenSymbol?: string }) {
    const { settings, isLoaded } = useSiteSettings();

    if (!isLoaded) return null;

    const handleClick = () => {
        const link = settings.promote_link || 'https://t.me/yourusername';
        const message = tokenSymbol
            ? `Hi! I want to promote my token: ${tokenSymbol}`
            : 'Hi! I want to promote my token';

        // If it's a Telegram link, add the message
        if (link.includes('t.me')) {
            window.open(`${link}?text=${encodeURIComponent(message)}`, '_blank');
        } else {
            window.open(link, '_blank');
        }
    };

    return (
        <button
            onClick={handleClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-orange-500/20"
        >
            <Rocket className="w-4 h-4" />
            {settings.promote_button_text || '🚀 Boost Token'}
        </button>
    );
}

// Social Links Component
export function SocialLinks() {
    const { settings, isLoaded } = useSiteSettings();

    if (!isLoaded) return null;

    const links = [
        { url: settings.telegram_link, icon: Send, label: 'Telegram' },
        { url: settings.twitter_link, icon: MessageCircle, label: 'Twitter' },
        { url: settings.discord_link, icon: MessageCircle, label: 'Discord' },
    ].filter(link => link.url);

    if (links.length === 0) return null;

    return (
        <div className="flex items-center gap-3">
            {links.map((link, i) => (
                <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                    title={link.label}
                >
                    <link.icon className="w-5 h-5 text-gray-400" />
                </a>
            ))}
        </div>
    );
}

// Footer Component
export function DynamicFooter() {
    const { settings, isLoaded } = useSiteSettings();

    return (
        <footer className="border-t border-white/10 mt-12 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-gray-500 text-sm">
                    {isLoaded ? settings.footer_text : '© 2024 DexTrend. All rights reserved.'}
                </p>
                <SocialLinks />
            </div>
        </footer>
    );
}
