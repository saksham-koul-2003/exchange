// Interface for KLine
export interface KLine {
    close: string; // Closing price
    end: number; // End timestamp (as number for calculations)
    high: number; // Highest price (consistently number)
    low: number; // Lowest price (consistently number)
    open: string; // Opening price
    quoteVolume: number; // Quote asset volume
    start: number; // Start timestamp (as number for calculations)
    trades: number; // Number of trades
    volume: number; // Base asset volume
}

// Interface for Trade
export interface Trade {
    id: number; // Unique trade ID
    isBuyerMaker: boolean; // True if buyer is the market maker
    price: number; // Trade price (as number for consistency)
    quantity: number; // Trade quantity
    quoteQuantity: number; // Quote asset quantity
    timestamp: number; // Trade timestamp
}

// Interface for Depth
export interface Depth {
    bids: [number, number][]; // Array of bid price and quantity
    asks: [number, number][]; // Array of ask price and quantity
    lastUpdateId: number; // ID of the last update
}

// Interface for Ticker
export interface Ticker {
    firstPrice: number; // Add this property
    high: number;
    lastPrice: number;
    low: number;
    priceChange: number;
    priceChangePercent: number; // Add this property
    quoteVolume: number; // Add this property
    symbol: string;
    trades: number; // Add this property
    volume: number;
}

