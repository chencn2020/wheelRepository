import { Emitter } from "../common/emitter";
export declare const decode: (buffer: string | ArrayBuffer) => string;
/**
 * A web socket that reconnects itself when it closes. Sending messages while
 * disconnected will throw an error.
 */
export declare class ReconnectingSocket {
    private path;
    readonly id: string;
    protected readonly _onMessage: Emitter<string | ArrayBuffer>;
    readonly onMessage: import("../common/emitter").Event<string | ArrayBuffer>;
    protected readonly _onDisconnect: Emitter<number | undefined>;
    readonly onDisconnect: import("../common/emitter").Event<number | undefined>;
    protected readonly _onClose: Emitter<number | undefined>;
    readonly onClose: import("../common/emitter").Event<number | undefined>;
    protected readonly _onConnect: Emitter<void>;
    readonly onConnect: import("../common/emitter").Event<void>;
    private readonly logger;
    private socket?;
    private connecting?;
    private closed;
    private readonly openTimeout;
    private readonly retryBaseDelay;
    private readonly retryMaxDelay;
    private retryDelay?;
    private readonly retryDelayFactor;
    private resetRetryTimeout?;
    private readonly resetRetryDelay;
    private _binaryType;
    constructor(path: string, id?: string);
    set binaryType(b: typeof WebSocket.prototype.binaryType);
    /**
     * Permanently close the connection. Will not attempt to reconnect. Will
     * remove event listeners.
     */
    close(code?: number): void;
    dispose(): void;
    /**
     * Send a message on the socket. Logs an error if currently disconnected.
     */
    send(message: string | ArrayBuffer): void;
    /**
     * Connect to the socket. Can also be called to wait until the connection is
     * established in the case of disconnections. Multiple calls will be handled
     * correctly.
     */
    connect(): Promise<void>;
    private _connect;
}
