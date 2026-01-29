'use client';

import { useEffect, useRef } from 'react';

interface PriceChartProps {
    pairAddress?: string;
    chainId?: string;
    height?: number;
}

// Generate mock line data for demo
function generateMockData() {
    const data = [];
    const now = Math.floor(Date.now() / 1000);
    let lastValue = 100 + Math.random() * 50;

    for (let i = 200; i >= 0; i--) {
        const time = now - i * 3600;
        const volatility = 0.02 + Math.random() * 0.03;
        const change = (Math.random() - 0.5) * volatility * lastValue;
        lastValue = lastValue + change;

        data.push({
            time: time,
            value: lastValue,
        });
    }

    return data;
}

export function PriceChart({ height = 400 }: PriceChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chartRef = useRef<any>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Dynamic import to avoid SSR issues
        import('lightweight-charts').then((LightweightCharts) => {
            if (!chartContainerRef.current) return;

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

            // Add line series using addSeries
            const lineSeries = chart.addSeries(LightweightCharts.LineSeries, {
                color: '#00ff88',
                lineWidth: 2,
            });

            // Set data
            const data = generateMockData();
            lineSeries.setData(data);

            // Fit content
            chart.timeScale().fitContent();

            chartRef.current = chart;

            // Handle resize
            const handleResize = () => {
                if (chartContainerRef.current && chartRef.current) {
                    chartRef.current.applyOptions({
                        width: chartContainerRef.current.clientWidth,
                    });
                }
            };

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
            };
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, [height]);

    return (
        <div className="relative">
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
