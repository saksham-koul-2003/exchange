"use client";

import { useEffect, useState } from "react";
import { Ticker } from "../utils/types";
import { getTickers } from "../utils/httpClient";
import { useRouter } from "next/navigation";

export const Markets = () => {
  const [tickers, setTickers] = useState<Ticker[]>([]);

  useEffect(() => {
    getTickers()
      .then((m) => {
        console.log("Fetched tickers:", m);
        if (Array.isArray(m)) {
          setTickers(m);
        } else {
          console.error("Unexpected response format:", m);
          setTickers([]); // Fallback to empty array
        }
      })
      .catch((error) => {
        console.error("Error fetching tickers:", error);
        setTickers([]); // Handle API errors
      });
  }, []);

  return (
    <div className="flex flex-col flex-1 max-w-[1280px] w-full">
      <div className="flex flex-col min-w-[700px] flex-1 w-full">
        <div className="flex flex-col w-full rounded-lg bg-baseBackgroundL1 px-5 py-3">
          <table className="w-full table-auto">
            <MarketHeader />
            <tbody>
              {tickers.map((m) => (
                <MarketRow key={m.symbol} market={m} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function MarketRow({ market }: { market: Ticker }) {
  const router = useRouter();
  return (
    <tr className="cursor-pointer border-t border-baseBorderLight hover:bg-white/7 w-full" onClick={() => router.push(`/trade/${market.symbol}`)}>
      <td className="px-1 py-3">
        <div className="flex shrink">
          <div className="flex items-center">
            <div
              className="relative flex-none overflow-hidden rounded-full border border-baseBorderMed"
              style={{ width: "40px", height: "40px" }}
            >
              <div className="relative">
                <img
                  alt={market.symbol}
                  src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVvBqZC_Q1TSYObZaMvK0DRFeHZDUtVMh08Q&s"}
                  loading="lazy"
                  width="40"
                  height="40"
                  decoding="async"
                />
              </div>
            </div>
            <div className="ml-4 flex flex-col">
              <p className="whitespace-nowrap text-base font-medium text-baseTextHighEmphasis">
                {market.symbol}
              </p>
              <div className="flex items-center justify-start flex-row gap-2">
                <p className="flex-medium text-left text-xs leading-5 text-baseTextMedEmphasis">
                  {market.symbol}
                </p>
              </div>
            </div>
          </div>
        </div>
      </td>
      <td className="px-1 py-3">
        <p className="text-base font-medium tabular-nums">{market.lastPrice}</p>
      </td>
      <td className="px-1 py-3">
        <p className="text-base font-medium tabular-nums">{market.high}</p>
      </td>
      <td className="px-1 py-3">
        <p className="text-base font-medium tabular-nums">{market.volume}</p>
      </td>
      <td className="px-1 py-3">
        <p className="text-base font-medium tabular-nums text-greenText">
          {Number(market.priceChangePercent)?.toFixed(3)} %
        </p>
      </td>
    </tr>
  );
}

function MarketHeader() {
  return (
    <thead>
      <tr>
        <th className="px-2 py-3 text-left text-sm font-normal text-baseTextMedEmphasis">Name</th>
        <th className="px-2 py-3 text-left text-sm font-normal text-baseTextMedEmphasis">Price</th>
        <th className="px-2 py-3 text-left text-sm font-normal text-baseTextMedEmphasis">Market Cap</th>
        <th className="px-2 py-3 text-left text-sm font-normal text-baseTextMedEmphasis">24h Volume</th>
        <th className="px-2 py-3 text-left text-sm font-normal text-baseTextMedEmphasis">24h Change</th>
      </tr>
    </thead>
  );
}
