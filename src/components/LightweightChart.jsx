import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

export default function LightweightChart({ data, color }) {
  const chartContainerRef = useRef();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    let chart;
    try {
      chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth || 300,
        height: 300,
        layout: {
          background: { type: 'solid', color: 'transparent' },
          textColor: '#94a3b8',
          fontFamily: 'Inter, sans-serif',
        },
        grid: {
          vertLines: { visible: false },
          horzLines: { color: 'rgba(241, 245, 249, 0.5)' },
        },
        crosshair: {
          mode: 0,
        },
        rightPriceScale: {
          borderVisible: false,
        },
        timeScale: {
          borderVisible: false,
          visible: false,
        },
        handleScroll: false,
        handleScale: false,
      });

      const series = chart.addAreaSeries({
        lineColor: color,
        topColor: color + '44',
        bottomColor: color + '00',
        lineWidth: 3,
        priceLineVisible: false,
        lastValueVisible: false,
      });

      const formattedData = data.length > 0 
        ? data.map((d, idx) => ({ time: idx, value: d.value })) 
        : Array.from({ length: 50 }, (_, i) => ({ time: i, value: 100 + Math.sin(i / 5) * 5 + Math.random() * 2 }));
      
      series.setData(formattedData);
      
      requestAnimationFrame(() => {
        if (chart) chart.timeScale().fitContent();
      });

      const handleResize = () => {
        if (chart && chartContainerRef.current) {
          chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (chart) chart.remove();
      };
    } catch (err) {
      console.error("Chart initialization error:", err);
    }
  }, [data, color]); // Recalculate on any data or color change for consistency

  return <div ref={chartContainerRef} className="w-full h-[300px]" stroke="none" />;
}


