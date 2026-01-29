'use client';

import { useStore } from '@/store/useStore';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

export function MainLayout({ children }: { children: React.ReactNode }) {
    const { sidebarOpen, toggleSidebar, setSidebarOpen } = useStore();

    // Optional: Auto-open sidebar on large screens on first load
    useEffect(() => {
        if (window.innerWidth >= 1024) {
            setSidebarOpen(true);
        }
    }, [setSidebarOpen]);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-1 pt-16 relative">
                <Sidebar />
                <main
                    className={cn(
                        "flex-1 p-4 lg:p-6 transition-all duration-300 w-full",
                        sidebarOpen ? "lg:ml-64" : "lg:ml-0"
                    )}
                >
                    {children}
                </main>

                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                        onClick={toggleSidebar}
                    />
                )}
            </div>
        </div>
    );
}
