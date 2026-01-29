'use client';

import { useEffect, useState } from 'react';

interface SiteSettings {
    logo_url: string;
    logo_text: string;
    site_title: string;
    site_description: string;
    primary_color: string;
    header_bg_color: string;
}

interface Banner {
    id: number;
    title: string;
    description: string;
    image_url: string;
    link_url: string;
    is_active: boolean;
    position: string;
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
    header_bg_color: '#0d0d0d'
};

export function useSiteSettings() {
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [ads, setAds] = useState<Ad[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Load settings from localStorage
        const savedSettings = localStorage.getItem('dextrend_site_settings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
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

// Banner Component
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
                    className="block"
                >
                    <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-white/10">
                        {banner.image_url ? (
                            <img
                                src={banner.image_url}
                                alt={banner.title}
                                className="w-full h-auto object-cover"
                            />
                        ) : (
                            <div className="px-6 py-8">
                                <h3 className="text-xl font-bold text-white">{banner.title}</h3>
                                {banner.description && (
                                    <p className="text-gray-400 mt-2">{banner.description}</p>
                                )}
                            </div>
                        )}
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
            <span className="text-xl font-bold text-white">
                Dex<span className="text-emerald-400">Trend</span>
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

    // Split logo text for styling
    const text = settings.logo_text || 'DexTrend';
    const midPoint = Math.floor(text.length / 2);
    const firstPart = text.substring(0, midPoint);
    const secondPart = text.substring(midPoint);

    return (
        <span className="text-xl font-bold text-white">
            {firstPart}<span style={{ color: settings.primary_color }}>{secondPart}</span>
        </span>
    );
}
