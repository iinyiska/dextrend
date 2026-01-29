'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Simple admin auth using localStorage
// In production, use proper session management
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'dextrend2024' // Change this!
};

export default function AdminLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simple credential check
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            // Set admin session
            localStorage.setItem('dextrend_admin', JSON.stringify({
                isAdmin: true,
                loginTime: Date.now(),
                expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
            }));
            router.push('/admin/dashboard');
        } else {
            setError('Invalid username or password');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        Dex<span className="text-emerald-400">Trend</span>
                    </h1>
                    <p className="text-gray-400 mt-2">Admin Panel</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                    <h2 className="text-xl font-semibold text-white mb-6">Login to Admin</h2>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                                placeholder="Enter username"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                                placeholder="Enter password"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-500 text-sm mt-6">
                    Default: admin / dextrend2024
                </p>
            </div>
        </div>
    );
}
