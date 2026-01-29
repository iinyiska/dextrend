'use client';

import { useEffect, useRef, useState } from 'react';

interface PriceChartProps {
    pairAddress?: string;
    chainId?: string;
    height?: number;
}

export function PriceChart({ height = 400 }: PriceChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chartRef = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!chartContainerRef.current) return;
        if (typeof window === 'undefined') return;

        // Dynamic import to avoid SSR issues
        const initChart = async () => {
            try {
                const LightweightCharts = await import('lightweight-charts');

                if (!chartContainerRef.current) return;
                if (chartRef.current) return; // Already initialized

                // Generate mock line data for demo
                const now = Math.floor(Date.now() / 1000);
                let lastValue = 100 + Math.random() * 50;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const data: any[] = [];

                for (let i = 200; i >= 0; i--) {
                    const time = now - i * 3600;
                    const volatility = 0.02 + Math.random() * 0.03;
                    const change = (Math.random() - 0.5) * volatility * lastValue;
                    lastValue = lastValue + change;

                    data.push({
                        time,
                        value: lastValue,
                    });
                }

                // Create chart
                const chart = LightweightCharts.createChart(chartContainerRef.current, {
                    layout: {
                        background: { color: 'transparent' },
                        textColor: '#888888',
                    },
                    grid: {
                        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
                        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
                    },
                    rightPriceScale: {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    timeScale: {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        timeVisible: true,
                        secondsVisible: false,
                    },
                    width: chartContainerRef.current.clientWidth,
                    height: height,
                });

                // Add line series
                const lineSeries = chart.addSeries(LightweightCharts.LineSeries, {
                    color: '#00ff88',
                    lineWidth: 2,
                });

                // Set data with type assertion
                lineSeries.setData(data as Parameters<typeof lineSeries.setData>[0]);

                // Fit content
                chart.timeScale().fitContent();

                chartRef.current = chart;
                setIsLoading(false);

                // Handle resize
                const handleResize = () => {
                    if (chartContainerRef.current && chartRef.current) {
                        chartRef.current.applyOptions({
                            width: chartContainerRef.current.clientWidth,
                        });
                    }
                };

                window.addEventListener('resize', handleResize);
                return () => window.removeEventListener('resize', handleResize);
            } catch (error) {
                console.error('Failed to initialize chart:', error);
                setIsLoading(false);
            }
        };

        initChart();

        return () => {
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, [height]);

    return (
        <div className="relative">
            {isLoading && (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a] rounded-xl"
                    style={{ height }}
                >
                    <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
                </div>
            )}
            <div
                ref={chartContainerRef}
                style={{ height }}
                className="w-full bg-[#1a1a1a] rounded-xl"
            />

            {/* Time range buttons */}
            <div className="absolute top-2 right-2 flex gap-1 z-10">
                {['5m', '1H', '4H', '1D', '1W'].map((range) => (
                    <button
                        key={range}
                        className="px-3 py-1 text-xs font-medium rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        {range}
                    </button>
                ))}
            </div>
        </div>
    );
}
