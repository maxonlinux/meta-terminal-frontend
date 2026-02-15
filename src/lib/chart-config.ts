import {
  type ChartOptions,
  CrosshairMode,
  type DeepPartial,
  LineStyle,
} from "lightweight-charts";

export const chartOptions: DeepPartial<ChartOptions> = {
  layout: {
    background: { color: "#0000" },
    textColor: "#fff",
    attributionLogo: false,
  },
  crosshair: {
    mode: CrosshairMode.Normal,
    vertLine: {
      color: "#C3BCDB44",
      style: LineStyle.Solid,
      labelBackgroundColor: "#525252",
    },
    horzLine: {
      color: "#525252",
      style: LineStyle.Dashed,
      labelBackgroundColor: "#525252",
    },
  },
  autoSize: true,
  rightPriceScale: {
    borderColor: "#0000",
    textColor: "#737373",
  },
  timeScale: {
    barSpacing: 10,
    maxBarSpacing: 30,
    minBarSpacing: 5,
    lockVisibleTimeRangeOnResize: true,
    borderColor: "#0000",
    timeVisible: true,
    secondsVisible: true,
  },
  grid: {
    vertLines: { color: "#ffffff10" },
    horzLines: { color: "#ffffff10" },
  },
};

export const seriesOptions = {
  wickUpColor: "rgb(54, 116, 217)",
  upColor: "rgb(54, 116, 217)",
  wickDownColor: "rgb(225, 50, 85)",
  downColor: "rgb(225, 50, 85)",
  borderVisible: false,
};
