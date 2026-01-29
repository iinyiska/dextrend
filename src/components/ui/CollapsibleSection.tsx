'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleSectionProps {
    title: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
    className?: string;
}

export function CollapsibleSection({
    title,
    children,
    defaultOpen = true,
    className = ''
}: CollapsibleSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <section className={`bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors"
            >
                <div className="flex-1">
                    {title}
                </div>
                <div className={`p-1 rounded-full bg-white/5 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                    <ChevronDown size={20} className="text-gray-400" />
                </div>
            </button>

            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="p-4 pt-0">
                    <div className="mt-4">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
}
