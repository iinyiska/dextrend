'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AdminSession {
    isAdmin: boolean;
    loginTime: number;
    expiresAt: number;
}

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

export default function AdminDashboard() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'settings' | 'banners' | 'ads'>('settings');

    // Site Settings State
    const [settings, setSettings] = useState<SiteSettings>({
        logo_url: '',
        logo_text: 'DexTrend',
        site_title: 'DexTrend - Real-Time DEX Analytics',
        site_description: 'Track trending tokens across multiple blockchains',
        primary_color: '#00ff88',
        header_bg_color: '#0d0d0d'
    });

    // Banners State
    const [banners, setBanners] = useState<Banner[]>([]);
    const [newBanner, setNewBanner] = useState<Omit<Banner, 'id'>>({
        title: '',
        description: '',
        image_url: '',
        link_url: '',
        is_active: true,
        position: 'hero'
    });

    // Ads State
    const [ads, setAds] = useState<Ad[]>([]);
    const [newAd, setNewAd] = useState<Omit<Ad, 'id'>>({
        name: '',
        ad_code: '',
        position: 'sidebar',
        is_active: true
    });

    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    useEffect(() => {
        // Check admin session
        const sessionStr = localStorage.getItem('dextrend_admin');
        if (!sessionStr) {
            router.push('/admin');
            return;
        }

        try {
            const session: AdminSession = JSON.parse(sessionStr);
            if (!session.isAdmin || Date.now() > session.expiresAt) {
                localStorage.removeItem('dextrend_admin');
                router.push('/admin');
                return;
            }
        } catch {
            router.push('/admin');
            return;
        }

        // Load saved settings from localStorage
        loadSettings();
        setIsLoading(false);
    }, [router]);

    const loadSettings = () => {
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
    };

    const saveSettings = () => {
        setSaveStatus('saving');
        try {
            localStorage.setItem('dextrend_site_settings', JSON.stringify(settings));
            localStorage.setItem('dextrend_banners', JSON.stringify(banners));
            localStorage.setItem('dextrend_ads', JSON.stringify(ads));
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        } catch {
            setSaveStatus('error');
        }
    };

    const addBanner = () => {
        if (!newBanner.title) return;
        setBanners([...banners, { ...newBanner, id: Date.now() }]);
        setNewBanner({
            title: '',
            description: '',
            image_url: '',
            link_url: '',
            is_active: true,
            position: 'hero'
        });
    };

    const removeBanner = (id: number) => {
        setBanners(banners.filter(b => b.id !== id));
    };

    const addAd = () => {
        if (!newAd.name || !newAd.ad_code) return;
        setAds([...ads, { ...newAd, id: Date.now() }]);
        setNewAd({
            name: '',
            ad_code: '',
            position: 'sidebar',
            is_active: true
        });
    };

    const removeAd = (id: number) => {
        setAds(ads.filter(a => a.id !== id));
    };

    const handleLogout = () => {
        localStorage.removeItem('dextrend_admin');
        router.push('/admin');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0d0d0d]">
            {/* Header */}
            <header className="bg-[#1a1a1a] border-b border-white/10 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-white">
                            Dex<span className="text-emerald-400">Trend</span>
                            <span className="text-gray-400 font-normal ml-2">Admin</span>
                        </h1>
                        <Link
                            href="/"
                            target="_blank"
                            className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                        >
                            View Site →
                        </Link>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-[#1a1a1a] border-r border-white/10 min-h-[calc(100vh-65px)] p-4">
                    <nav className="space-y-2">
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'settings'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'text-gray-400 hover:bg-white/5'
                                }`}
                        >
                            ⚙️ Site Settings
                        </button>
                        <button
                            onClick={() => setActiveTab('banners')}
                            className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'banners'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'text-gray-400 hover:bg-white/5'
                                }`}
                        >
                            🖼️ Banners
                        </button>
                        <button
                            onClick={() => setActiveTab('ads')}
                            className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'ads'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'text-gray-400 hover:bg-white/5'
                                }`}
                        >
                            📢 Advertisements
                        </button>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white">Site Settings</h2>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Logo Text
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.logo_text}
                                            onChange={(e) => setSettings({ ...settings, logo_text: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Logo Image URL (optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.logo_url}
                                            onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Site Title (for SEO)
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.site_title}
                                        onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Site Description
                                    </label>
                                    <textarea
                                        value={settings.site_description}
                                        onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white resize-none"
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Primary Color
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={settings.primary_color}
                                                onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                                                className="w-12 h-12 rounded-lg cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={settings.primary_color}
                                                onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                                                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Header Background Color
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={settings.header_bg_color}
                                                onChange={(e) => setSettings({ ...settings, header_bg_color: e.target.value })}
                                                className="w-12 h-12 rounded-lg cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={settings.header_bg_color}
                                                onChange={(e) => setSettings({ ...settings, header_bg_color: e.target.value })}
                                                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Banners Tab */}
                    {activeTab === 'banners' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white">Banners Management</h2>

                            {/* Add Banner Form */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                                <h3 className="text-lg font-semibold text-white">Add New Banner</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={newBanner.title}
                                        onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                                        placeholder="Banner Title"
                                    />
                                    <select
                                        value={newBanner.position}
                                        onChange={(e) => setNewBanner({ ...newBanner, position: e.target.value })}
                                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                                    >
                                        <option value="hero">Hero (Top)</option>
                                        <option value="sidebar">Sidebar</option>
                                        <option value="footer">Footer</option>
                                    </select>
                                </div>
                                <input
                                    type="text"
                                    value={newBanner.image_url}
                                    onChange={(e) => setNewBanner({ ...newBanner, image_url: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                                    placeholder="Image URL (https://...)"
                                />
                                <input
                                    type="text"
                                    value={newBanner.link_url}
                                    onChange={(e) => setNewBanner({ ...newBanner, link_url: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                                    placeholder="Link URL (optional)"
                                />
                                <textarea
                                    value={newBanner.description}
                                    onChange={(e) => setNewBanner({ ...newBanner, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white resize-none"
                                    rows={2}
                                    placeholder="Description (optional)"
                                />
                                <button
                                    onClick={addBanner}
                                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-xl transition-colors"
                                >
                                    Add Banner
                                </button>
                            </div>

                            {/* Banners List */}
                            <div className="space-y-4">
                                {banners.map((banner) => (
                                    <div key={banner.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {banner.image_url && (
                                                <img src={banner.image_url} alt="" className="w-20 h-12 object-cover rounded-lg" />
                                            )}
                                            <div>
                                                <h4 className="text-white font-medium">{banner.title}</h4>
                                                <p className="text-sm text-gray-400">Position: {banner.position}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeBanner(banner.id)}
                                            className="px-4 py-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                                {banners.length === 0 && (
                                    <p className="text-gray-500 text-center py-8">No banners added yet</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Ads Tab */}
                    {activeTab === 'ads' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white">Advertisement Management</h2>

                            {/* Add Ad Form */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                                <h3 className="text-lg font-semibold text-white">Add New Advertisement</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={newAd.name}
                                        onChange={(e) => setNewAd({ ...newAd, name: e.target.value })}
                                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                                        placeholder="Ad Name (e.g., Google Adsense 1)"
                                    />
                                    <select
                                        value={newAd.position}
                                        onChange={(e) => setNewAd({ ...newAd, position: e.target.value })}
                                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                                    >
                                        <option value="header">Header</option>
                                        <option value="sidebar">Sidebar</option>
                                        <option value="between_content">Between Content</option>
                                        <option value="footer">Footer</option>
                                        <option value="popup">Popup</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Ad Code (HTML/Script)
                                    </label>
                                    <textarea
                                        value={newAd.ad_code}
                                        onChange={(e) => setNewAd({ ...newAd, ad_code: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-sm resize-none"
                                        rows={6}
                                        placeholder="<script>...</script> or <ins class='adsbygoogle'...></ins>"
                                    />
                                </div>
                                <button
                                    onClick={addAd}
                                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-xl transition-colors"
                                >
                                    Add Advertisement
                                </button>
                            </div>

                            {/* Ads List */}
                            <div className="space-y-4">
                                {ads.map((ad) => (
                                    <div key={ad.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <h4 className="text-white font-medium">{ad.name}</h4>
                                                <p className="text-sm text-gray-400">Position: {ad.position}</p>
                                            </div>
                                            <button
                                                onClick={() => removeAd(ad.id)}
                                                className="px-4 py-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                        <pre className="text-xs text-gray-500 bg-black/30 p-2 rounded-lg overflow-x-auto">
                                            {ad.ad_code.substring(0, 100)}...
                                        </pre>
                                    </div>
                                ))}
                                {ads.length === 0 && (
                                    <p className="text-gray-500 text-center py-8">No advertisements added yet</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Save Button */}
                    <div className="fixed bottom-6 right-6">
                        <button
                            onClick={saveSettings}
                            disabled={saveStatus === 'saving'}
                            className={`px-8 py-4 rounded-xl font-semibold shadow-lg transition-all ${saveStatus === 'saved'
                                    ? 'bg-green-500 text-white'
                                    : saveStatus === 'error'
                                        ? 'bg-red-500 text-white'
                                        : 'bg-emerald-500 hover:bg-emerald-600 text-black'
                                }`}
                        >
                            {saveStatus === 'saving' ? 'Saving...' :
                                saveStatus === 'saved' ? '✓ Saved!' :
                                    saveStatus === 'error' ? 'Error!' :
                                        'Save All Changes'}
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
