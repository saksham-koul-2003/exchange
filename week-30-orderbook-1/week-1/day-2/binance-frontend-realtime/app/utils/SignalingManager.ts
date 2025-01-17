import { Ticker } from "./types";

export const BASE_URL = "wss://ws.backpack.exchange/";

type CallbackFunction = (data: any) => void;
//using singleton for the ws connection
export class SignalingManager {
    private ws: WebSocket;
    private static instance: SignalingManager;
    private bufferedMessages: any[] = [];
    private callbacks: Record<string, { callback: CallbackFunction; id: string }[]> = {};
    private id: number;
    private initialized: boolean = false;//attributes

    private constructor() { 
        this.ws = new WebSocket(BASE_URL);//creates a ws connection
        this.bufferedMessages = [];
        this.id = 1;
        this.init();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new SignalingManager();//object of the class
        }
        return this.instance;
    }

    init() {
        this.ws.onopen = () => {
            this.initialized = true;
            this.bufferedMessages.forEach((message) => {
                this.ws.send(JSON.stringify(message));
            });
            this.bufferedMessages = [];
        };
        this.ws.onmessage = (event) => {//when you recieve a message you should forward it to component
            const message = JSON.parse(event.data);
            const type = message.data.e;
            if (this.callbacks[type]) {//if there is a callback waiting for this event
                this.callbacks[type].forEach(({ callback }) => {
                    if (type === "ticker") {//if the event is of type ticker for all the callbacks
                        const newTicker: Partial<Ticker> = {
                            lastPrice: message.data.c,
                            high: message.data.h,
                            low: message.data.l,
                            volume: message.data.v,
                            quoteVolume: message.data.V,
                            symbol: message.data.s,
                        };

                        callback(newTicker);
                    }
                    if (type === "depth") {
                        const updatedBids = message.data.b;
                        const updatedAsks = message.data.a;
                        callback({ bids: updatedBids, asks: updatedAsks });
                    }
                });
            }
        };
    }

    sendMessage(message: any) {
        const messageToSend = {
            ...message,
            id: this.id++,
        };
        if (!this.initialized) {
            this.bufferedMessages.push(messageToSend);
            return;
        }
        this.ws.send(JSON.stringify(messageToSend));//after the ws connection opens the go to the other side without buffered
    }

    async registerCallback(type: string, callback: CallbackFunction, id: string) {
        this.callbacks[type] = this.callbacks[type] || [];
        this.callbacks[type].push({ callback, id });
    } //ticker => callback function // it puts something on the callback variable

    async deRegisterCallback(type: string, id: string) {
        if (this.callbacks[type]) {
            const index = this.callbacks[type].findIndex((cb) => cb.id === id);
            if (index !== -1) {
                this.callbacks[type].splice(index, 1);
            }
        }
    }
}
