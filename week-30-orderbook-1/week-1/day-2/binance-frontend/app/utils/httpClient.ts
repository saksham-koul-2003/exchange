import axios from "axios";
import { Depth, KLine, Ticker, Trade } from "./types";

const BASE_URL = "https://exchange-proxy.100xdevs.com/api/v1";

// Mocked getTickers function
export async function getTickers(): Promise<Ticker[]> {
    return [
        {
            symbol: "BTCUSDT",
            firstPrice: 49000,
            high: 50500,
            lastPrice: 50000,
            low: 49500,
            priceChange: 100,
            priceChangePercent: 0.2,
            quoteVolume: 120000000,
            trades: 15000,
            volume: 2500,
        },
        {
            symbol: "ETHUSDT",
            firstPrice: 3950,
            high: 4050,
            lastPrice: 4000,
            low: 3900,
            priceChange: 50,
            priceChangePercent: 1.25,
            quoteVolume: 80000000,
            trades: 12000,
            volume: 600,
        },
        {
            symbol: "SOLUSDC",
            firstPrice: 24,
            high: 26,
            lastPrice: 25,
            low: 24,
            priceChange: 1,
            priceChangePercent: 4.17,
            quoteVolume: 5000000,
            trades: 800,
            volume: 1000,
        },
    ];
}

// Fetch specific ticker
export async function getTicker(market: string): Promise<Ticker> {
    const tickers = await getTickers();
    const normalizedMarket = market.replace("_", ""); // Normalize market string
    const ticker = tickers.find((t) => t.symbol === normalizedMarket);
    if (!ticker) throw new Error(`No ticker found for ${market}`);
    return ticker;
}

// Fetch depth
export async function getDepth(market: string): Promise<Depth> {
    try {
        const response = await axios.get(`${BASE_URL}/depth`, {
            params: { symbol: market },
        });
        return response.data;
    } catch (error: any) {
        console.error(`Failed to fetch depth for market ${market}:`, error.message || error);
        throw new Error(`Network error: Could not fetch depth for ${market}`);
    }
}

// Fetch trades
export async function getTrades(market: string): Promise<Trade[]> {
    try {
        const response = await axios.get(`${BASE_URL}/trades`, {
            params: { symbol: market },
        });
        return response.data;
    } catch (error: any) {
        console.error(`Failed to fetch trades for market ${market}:`, error.message || error);
        throw new Error(`Network error: Could not fetch trades for ${market}`);
    }
}

// Fetch KLines
export async function getKlines(
    market: string,
    interval: string,
    startTime: number,
    endTime: number
): Promise<KLine[]> {
    try {
        const response = await axios.get(`${BASE_URL}/klines`, {
            params: { symbol: market, interval, startTime, endTime },
        });
        const data: KLine[] = response.data;
        return data.sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));
    } catch (error: any) {
        console.error(`Failed to fetch KLines for market ${market}:`, error.message || error);
        throw new Error(`Network error: Could not fetch KLines for ${market}`);
    }
}

// Fetch markets
export async function getMarkets(): Promise<string[]> {
    try {
        const response = await axios.get(`${BASE_URL}/markets`);
        return response.data;
    } catch (error: any) {
        console.error(`Failed to fetch markets:`, error.message || error);
        throw new Error(`Network error: Could not fetch markets`);
    }
}
