"use client";

import {
  type CandlestickData,
  CandlestickSeries,
  createChart,
  type IChartApi,
  type IPriceLine,
  type ISeriesApi,
  LineStyle,
  type LogicalRange,
  type MouseEventParams,
  type Time,
} from "lightweight-charts";
import { useCallback, useEffect, useRef } from "react";
import useSWRInfinite from "swr/infinite";
import type { Candle } from "@/features/assets/types";
import { getCandles } from "@/api/multiplexer";
import type { TradingInstrument } from "@/features/trading/types";
import { chartOptions, seriesOptions } from "@/lib/chart-config";
import {
  type PositionControlsModel,
  PositionControlsPrimitive,
} from "@/lib/chart-position-controls-primitive";
import { useRealTimeCandle } from "./useRealTimeCandle";

const toChartCandle = (c: Candle): CandlestickData<Time> => ({
  time: c.time as Time,
  open: c.open,
  high: c.high,
  low: c.low,
  close: c.close,
});

export function useCandlestickChart(
  containerRef: React.RefObject<HTMLDivElement | null>,
  instrument: TradingInstrument,
  interval: number,
  pricePrecision: number | null,
) {
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const positionPrimitiveRef = useRef<PositionControlsPrimitive | null>(null);
  const positionEntryLineRef = useRef<IPriceLine | null>(null);
  const positionEntryLineSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(
    null,
  );

  // Candles
  type CandlesKey = {
    symbol: string;
    interval: number;
    outputsize: number;
    before?: number;
  };

  const getKey = (pageIndex: number, previousPageData: Candle[] | null) => {
    if (previousPageData && previousPageData.length === 0) return null;

    const base: CandlesKey = {
      symbol: instrument.symbol,
      interval,
      outputsize: 50,
    };

    if (pageIndex === 0) return base;

    const first = previousPageData?.[0];
    if (!first) return null;

    return { ...base, before: first.time - interval };
  };

  const fetcher = async (key: CandlesKey) => {
    return await getCandles({
      symbol: String(key.symbol),
      interval: Number(key.interval),
      outputsize: Number(key.outputsize),
      before: key.before ? Number(key.before) : undefined,
    });
  };

  const {
    size,
    setSize,
    data: candles,
    isLoading,
    isValidating,
    error,
  } = useSWRInfinite(getKey, fetcher);

  const chartCandles = candles?.map((page) => page.map(toChartCandle));

  // Live updates
  const { candle } = useRealTimeCandle(instrument.symbol, interval);

  const handleRangeChange = useCallback(
    (range: LogicalRange | null) => {
      if (!range || isValidating || isLoading) return;
      if (!candles) return;

      if (size > candles.length) return;

      if (range.from < -10) {
        void setSize((prev) => prev + 1);
      }
    },
    [candles, size, setSize, isLoading, isValidating],
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const primitive = new PositionControlsPrimitive((action) => {
      if (action === "reverse") {
        // TODO: reverse position
      }
      if (action === "close") {
        // TODO: close position
      }
    });

    const chart = createChart(containerRef.current, chartOptions);
    const series = chart.addSeries(CandlestickSeries, seriesOptions);

    chartRef.current = chart;
    seriesRef.current = series;
    chart.timeScale().fitContent();

    series.attachPrimitive(primitive);
    positionPrimitiveRef.current = primitive;

    const onClick = (p: MouseEventParams<Time>) => {
      positionPrimitiveRef.current?.handleClick(p.hoveredObjectId);
    };

    chart.subscribeClick(onClick);
    chart.timeScale().fitContent();

    return () => {
      chart.unsubscribeClick(onClick);
      chart.remove();

      positionEntryLineRef.current = null;
      positionEntryLineSeriesRef.current = null;
      positionPrimitiveRef.current = null;

      seriesRef.current = null;
      chartRef.current = null;
    };
  }, [containerRef]);

  useEffect(() => {
    if (pricePrecision === null) return;
    seriesRef.current?.applyOptions({
      priceFormat: {
        precision: pricePrecision,
        minMove: 1 / 10 ** pricePrecision,
      },
    });
  }, [pricePrecision]);

  useEffect(() => {
    if (!candles) return;

    try {
      const mergedMap = new Map<number, CandlestickData<Time>>();

      // Flatten and deduplicate by 'time'
      candles.flat().forEach((candle) => {
        mergedMap.set(Number(candle.time), toChartCandle(candle));
      });

      const deduplicatedSorted = Array.from(mergedMap.values()).sort(
        (a, b) => Number(a.time) - Number(b.time),
      );

      seriesRef.current?.setData(deduplicatedSorted);
    } catch (error) {
      // ignore bad data, keep last valid render
      void error;
    }
  }, [candles]);

  useEffect(() => {
    if (!candle) return;

    try {
      seriesRef.current?.update(toChartCandle(candle));
    } catch (error) {
      // ignore bad data, keep last valid render
      void error;
    }
  }, [candle]);

  useEffect(() => {
    chartRef.current
      ?.timeScale()
      .subscribeVisibleLogicalRangeChange(handleRangeChange);
    return () =>
      chartRef.current
        ?.timeScale()
        .unsubscribeVisibleLogicalRangeChange(handleRangeChange);
  }, [handleRangeChange]);

  const setPositionOverlayModel = useCallback(
    (model: PositionControlsModel | null) => {
      const series = seriesRef.current;

      // ✅ FIX: даже если series сейчас нет (например при переключении),
      // мы обязаны “логически” очистить refs, иначе останется stale IPriceLine.
      if (!series) {
        if (!model) {
          positionEntryLineRef.current = null;
          positionEntryLineSeriesRef.current = null;
        }
        // primitive тоже некуда сетить, серия отсутствует
        return;
      }

      // primitive badge
      positionPrimitiveRef.current?.setModel(model);

      // ✅ FIX: если серия поменялась (новый chart/series), старая линия неприменима
      if (positionEntryLineSeriesRef.current !== series) {
        positionEntryLineRef.current = null;
        positionEntryLineSeriesRef.current = series;
      }

      if (!model) {
        if (positionEntryLineRef.current) {
          series.removePriceLine(positionEntryLineRef.current);
          positionEntryLineRef.current = null;
        }
        return;
      }

      const options = {
        price: model.entryPrice,
        lineStyle: LineStyle.Solid,
        color: "rgb(74, 222, 128)",
        axisLabelVisible: true,
      };

      // ✅ FIX: если линии нет — создаём.
      // Если есть — обновляем.
      if (!positionEntryLineRef.current) {
        positionEntryLineRef.current = series.createPriceLine(options);
        return;
      }

      positionEntryLineRef.current.applyOptions(options);
    },
    [],
  );

  return {
    chart: chartRef,
    candles: chartCandles,
    isLoading,
    error,
    setPositionOverlayModel,
  };
}
