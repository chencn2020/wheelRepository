/// <reference types="node" />
import * as http from "http";
import * as net from "net";
import { HttpProvider, HttpResponse, HttpProviderOptions, Route } from "../http";
export declare class SshProvider extends HttpProvider {
    private readonly wss;
    private sshServer;
    constructor(options: HttpProviderOptions, hostKeyPath: string);
    listen(): Promise<number>;
    handleRequest(): Promise<HttpResponse>;
    handleWebSocket(_route: Route, request: http.IncomingMessage, socket: net.Socket, head: Buffer): Promise<void>;
    /**
     * Determine how to handle incoming SSH connections.
     */
    private handleSsh;
}
