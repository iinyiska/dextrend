'use client';

import { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time } from 'lightweight-charts';

interface PriceChartProps {
    pairAddress?: string;
    chainId?: string;
    height?: number;
}

// Generate mock candlestick data for demo
function generateMockData(): CandlestickData<Time>[] {
    const data: CandlestickData<Time>[] = [];
    const now = Math.floor(Date.now() / 1000);
    let lastClose = 100 + Math.random() * 50;

    for (let i = 200; i >= 0; i--) {
        const time = (now - i * 3600) as Time;
        const volatility = 0.02 + Math.random() * 0.03;
        const change = (Math.random() - 0.5) * volatility * lastClose;

        const open = lastClose;
        const close = open + change;
        const high = Math.max(open, close) + Math.random() * volatility * lastClose * 0.5;
        const low = Math.min(open, close) - Math.random() * volatility * lastClose * 0.5;

        data.push({
            time,
            open,
            high,
            low,
            close,
        });

        lastClose = close;
    }

    return data;
}

export function PriceChart({ height = 400 }: PriceChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Create chart
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { color: 'transparent' },
                textColor: '#888888',
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
            },
            crosshair: {
                mode: 1,
                vertLine: {
                    color: '#00ff88',
                    width: 1,
                    style: 2,
                    labelBackgroundColor: '#00ff88',
                },
                horzLine: {
                    color: '#00ff88',
                    width: 1,
                    style: 2,
                    labelBackgroundColor: '#00ff88',
                },
            },
            rightPriceScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            timeScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                timeVisible: true,
                secondsVisible: false,
            },
            handleScroll: {
                vertTouchDrag: false,
            },
        });

        // Add candlestick series
        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#00ff88',
            downColor: '#ff3b5c',
            borderUpColor: '#00ff88',
            borderDownColor: '#ff3b5c',
            wickUpColor: '#00ff88',
            wickDownColor: '#ff3b5c',
        });

        // Set data
        const data = generateMockData();
        candlestickSeries.setData(data);

        // Fit content
        chart.timeScale().fitContent();

        chartRef.current = chart;
        seriesRef.current = candlestickSeries;

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
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, []);

    return (
        <div className="relative">
            <div
                ref={chartContainerRef}
                style={{ height }}
                className="w-full"
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
