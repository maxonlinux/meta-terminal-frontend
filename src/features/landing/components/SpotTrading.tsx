import {
  CandlestickSeries,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type Time,
} from "lightweight-charts";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { Button } from "react-aria-components";
import { chartOptions, seriesOptions } from "@/lib/chart-config";

const generateRandomCurve = (
  startValue: number,
  endValue: number,
  numPoints: number,
) => {
  if (numPoints < 2) throw new Error("Number of points cannot be less than 2");

  const points = [startValue];
  const step = (endValue - startValue) / (numPoints - 1);
  const volatility = Math.abs(endValue - startValue) / (numPoints / 55);

  let time = Math.floor(Date.now() / 1000);

  for (let i = 1; i < numPoints - 1; i++) {
    const randomStep = (Math.random() - 0.5) * volatility;
    const newValue = points[i - 1] + step + randomStep;

    const progress = i / (numPoints - 1);
    const rangeLimit = Math.abs(endValue - startValue) * (1 - progress) * 0.5;
    const upperBound = startValue + step * i + rangeLimit;
    const lowerBound = startValue + step * i - rangeLimit;

    points.push(Math.max(lowerBound, Math.min(upperBound, newValue)));
  }

  points.push(endValue);

  return points.map((value) => ({ time: time++ as Time, value }));
};

type PricePoint = { time: Time; value: number };
type OHLC = {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
};

function aggregateToOHLC(data: PricePoint[], secondsPerCandle = 60): OHLC[] {
  const grouped: { [minute: number]: PricePoint[] } = {};

  // Группируем данные по минутам
  data.forEach(({ time, value }) => {
    const minute = Math.floor((time as number) / secondsPerCandle);
    if (!grouped[minute]) grouped[minute] = [];
    grouped[minute].push({ time, value });
  });

  // Создаём свечи OHLC
  return Object.entries(grouped).map(([minute, points]) => ({
    time: (Number(minute) * secondsPerCandle) as Time,
    open: points[0].value,
    high: Math.max(...points.map((p) => p.value)),
    low: Math.min(...points.map((p) => p.value)),
    close: points[points.length - 1].value,
  }));
}

function SpotTrading() {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      ...chartOptions,
      handleScale: false,
      handleScroll: false,
    });
    const series = chart.addSeries(CandlestickSeries, seriesOptions);

    const randomCurve = generateRandomCurve(10, 456, 700);

    const ohlc = aggregateToOHLC(randomCurve);

    series.setData(ohlc);

    chartRef.current = chart;
    seriesRef.current = series;
    chart.timeScale().fitContent();

    return () => chart.remove();
  }, []);

  return (
    <motion.div
      className="size-full"
      initial={{ opacity: 0, y: "70px" }}
      transition={{ duration: 0.5 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="relative size-full">
        <div className="size-full inset-0" ref={chartContainerRef} />
        <div className="absolute top-20 left-10 z-10 flex gap-4">
          <Button className="cursor-pointer bg-accent px-10 py-4 rounded-md font-bold uppercase shadow-[0px_0px_60px_10px_#4299e1] hover:scale-150 transition-transform">
            Buy
          </Button>
          <Button className="cursor-pointer bg-red-500 px-10 py-4 rounded-md font-bold uppercase shadow-[0px_0px_60px_10px_#e53e3e] hover:scale-150 transition-transform">
            Sell
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default SpotTrading;
