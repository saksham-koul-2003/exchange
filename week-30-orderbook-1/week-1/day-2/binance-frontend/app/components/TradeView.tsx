import { useEffect, useRef } from "react";
import { ChartManager } from "../utils/ChartManager";
import { getKlines } from "../utils/httpClient";
import { KLine } from "../utils/types";

export function TradeView({ market }: { market: string }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartManagerRef = useRef<ChartManager | null>(null);

  const init = async () => {
    let klineData: KLine[] = [];
    try {
      klineData = await getKlines(
        market,
        "1h",
        Math.floor((new Date().getTime() - 1000 * 60 * 60 * 24 * 7) / 1000), // Start time in seconds
        Math.floor(new Date().getTime() / 1000) // End time in seconds
      );
    } catch (e) {
      console.error("Error fetching KLine data:", e);
    }

    if (chartRef.current) {
      if (chartManagerRef.current) {
        chartManagerRef.current.destroy();
      }

      const chartManager = new ChartManager(
        chartRef.current,
        klineData
          ?.map((x) => ({
            close: parseFloat(x.close),
            high: Number(x.high),
            low: Number(x.low),
            open: parseFloat(x.open),
            timestamp: new Date(x.end * 1000), // Convert seconds to milliseconds
          }))
          .sort((x, y) => (x.timestamp < y.timestamp ? -1 : 1)) || [],
        {
          background: "#0e0f14",
          color: "white",
        }
      );

      chartManagerRef.current = chartManager;
    }
  };

  useEffect(() => {
    init();
  }, [market, chartRef]);

  return (
    <div ref={chartRef} style={{ height: "520px", width: "100%", marginTop: 4 }}></div>
  );
}
