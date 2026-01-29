'use client';

import { useState, useEffect } from 'react';
import { User, Moon, Sun, Bell, Globe, Shield, LogOut, Mail, Key, Eye, EyeOff } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function SettingsPage() {
    const { theme, toggleTheme } = useStore();
    const [user, setUser] = useState<{ email: string; name: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Auth states
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);

    // Settings states
    const [notifications, setNotifications] = useState(true);
    const [priceAlerts, setPriceAlerts] = useState(true);
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        // Check if user is logged in
        const savedUser = localStorage.getItem('dextrend_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError('');
        setAuthLoading(true);

        if (password.length < 6) {
            setAuthError('Password must be at least 6 characters');
            setAuthLoading(false);
            return;
        }

        // Simple registration (localStorage-based for demo)
        const newUser = { email, name, createdAt: Date.now() };
        localStorage.setItem('dextrend_user', JSON.stringify(newUser));
        localStorage.setItem(`dextrend_auth_${email}`, JSON.stringify({ password, name }));

        setUser(newUser);
        setShowRegister(false);
        setEmail('');
        setPassword('');
        setName('');
        setAuthLoading(false);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError('');
        setAuthLoading(true);

        // Simple login check
        const savedAuth = localStorage.getItem(`dextrend_auth_${email}`);
        if (savedAuth) {
            const auth = JSON.parse(savedAuth);
            if (auth.password === password) {
                const loggedUser = { email, name: auth.name };
                localStorage.setItem('dextrend_user', JSON.stringify(loggedUser));
                setUser(loggedUser);
                setShowLogin(false);
                setEmail('');
                setPassword('');
            } else {
                setAuthError('Invalid email or password');
            }
        } else {
            setAuthError('Account not found. Please register first.');
        }
        setAuthLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('dextrend_user');
        setUser(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-white">Settings</h1>

            {/* User Profile Section */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <User size={20} className="text-emerald-400" />
                    Account
                </h2>

                {user ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-2xl font-bold text-black">
                                {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="text-lg font-semibold text-white">{user.name || 'User'}</div>
                                <div className="text-gray-400">{user.email}</div>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-gray-400">Login to sync your watchlist and settings across devices.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setShowLogin(true); setShowRegister(false); }}
                                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-xl transition-colors"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => { setShowRegister(true); setShowLogin(false); }}
                                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors"
                            >
                                Register
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Login Modal */}
            {showLogin && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-white mb-6">Login</h3>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            {authError && (
                                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                    {authError}
                                </div>
                            )}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={authLoading}
                                    className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-xl transition-colors disabled:opacity-50"
                                >
                                    {authLoading ? 'Logging in...' : 'Login'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowLogin(false)}
                                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                        <p className="text-center text-gray-500 text-sm mt-4">
                            Don&apos;t have an account?{' '}
                            <button onClick={() => { setShowLogin(false); setShowRegister(true); }} className="text-emerald-400 hover:underline">
                                Register
                            </button>
                        </p>
                    </div>
                </div>
            )}

            {/* Register Modal */}
            {showRegister && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-white mb-6">Create Account</h3>
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                                    placeholder="Your name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                                        placeholder="Min 6 characters"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            {authError && (
                                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                    {authError}
                                </div>
                            )}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={authLoading}
                                    className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-xl transition-colors disabled:opacity-50"
                                >
                                    {authLoading ? 'Creating...' : 'Create Account'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowRegister(false)}
                                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                        <p className="text-center text-gray-500 text-sm mt-4">
                            Already have an account?{' '}
                            <button onClick={() => { setShowRegister(false); setShowLogin(true); }} className="text-emerald-400 hover:underline">
                                Login
                            </button>
                        </p>
                    </div>
                </div>
            )}

            {/* Appearance */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    {theme === 'dark' ? <Moon size={20} className="text-emerald-400" /> : <Sun size={20} className="text-emerald-400" />}
                    Appearance
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-white font-medium">Dark Mode</div>
                            <div className="text-sm text-gray-500">Use dark theme for the interface</div>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`w-14 h-8 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-emerald-500' : 'bg-gray-600'}`}
                        >
                            <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Bell size={20} className="text-emerald-400" />
                    Notifications
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-white font-medium">Push Notifications</div>
                            <div className="text-sm text-gray-500">Receive alerts in your browser</div>
                        </div>
                        <button
                            onClick={() => setNotifications(!notifications)}
                            className={`w-14 h-8 rounded-full transition-colors relative ${notifications ? 'bg-emerald-500' : 'bg-gray-600'}`}
                        >
                            <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${notifications ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-white font-medium">Price Alerts</div>
                            <div className="text-sm text-gray-500">Get notified of significant price changes</div>
                        </div>
                        <button
                            onClick={() => setPriceAlerts(!priceAlerts)}
                            className={`w-14 h-8 rounded-full transition-colors relative ${priceAlerts ? 'bg-emerald-500' : 'bg-gray-600'}`}
                        >
                            <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${priceAlerts ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Language */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Globe size={20} className="text-emerald-400" />
                    Language
                </h2>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                >
                    <option value="en">English</option>
                    <option value="id">Bahasa Indonesia</option>
                    <option value="zh">中文</option>
                    <option value="ja">日本語</option>
                    <option value="ko">한국어</option>
                </select>
            </div>

            {/* Security */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Shield size={20} className="text-emerald-400" />
                    Security
                </h2>
                <div className="space-y-4">
                    <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                        <div className="text-white font-medium">Change Password</div>
                        <div className="text-sm text-gray-500">Update your account password</div>
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                        <div className="text-white font-medium">Two-Factor Authentication</div>
                        <div className="text-sm text-gray-500">Add extra security to your account</div>
                    </button>
                </div>
            </div>
        </div>
    );
}
