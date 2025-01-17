"use client";

import { useEffect, useState } from "react";
import { getDepth, getTicker } from "../../utils/httpClient";
import { BidTable } from "./BidTable";
import { AskTable } from "./AskTable";

// SOL_USDC
export function Depth({ market }: { market: string }) {
    const [bids, setBids] = useState<[string, string][]>();
    const [asks, setAsks] = useState<[string, string][]>();
    const [price, setPrice] = useState<string>();
    const [error, setError] = useState<string | null>(null); // State for error messages

    useEffect(() => {
        const fetchDepthData = async () => {
            try {
                const depth = await getDepth(market);

                // Validate and ensure [string, string][] type
                const formattedBids: [string, string][] = depth.bids
                    .filter((item: any): item is [number, number] => Array.isArray(item) && item.length === 2)
                    .map(([price, size]) => [price.toString(), size.toString()]);
                
                const formattedAsks: [string, string][] = depth.asks
                    .filter((item: any): item is [number, number] => Array.isArray(item) && item.length === 2)
                    .map(([price, size]) => [price.toString(), size.toString()]);

                setBids(formattedBids.reverse()); // Reverse bids for descending order
                setAsks(formattedAsks); // Asks in ascending order
            } catch (error) {
                console.error("Error fetching depth:", error);
                setError("Failed to fetch market depth data.");
            }
        };

        const fetchTickerData = async () => {
            try {
                const ticker = await getTicker(market);
                setPrice(ticker.lastPrice.toString()); // Convert number to string
            } catch (error) {
                console.error("Error fetching ticker:", error);
                setError("Failed to fetch ticker data.");
            }
        };

        fetchDepthData();
        fetchTickerData();
    }, [market]); // Include market as a dependency

    return (
        <div>
            <TableHeader />
            {error && <div className="text-red-500">{error}</div>}
            {asks ? <AskTable asks={asks} /> : <div>Loading asks...</div>}
            {price && <div className="text-green-500 text-lg">Current Price: {price}</div>}
            {bids ? <BidTable bids={bids} /> : <div>Loading bids...</div>}
        </div>
    );
}

function TableHeader() {
    return (
        <div className="flex justify-between text-xs">
            <div className="text-white">Price</div>
            <div className="text-slate-500">Size</div>
            <div className="text-slate-500">Total</div>
        </div>
    );
}
