/// <reference types="node" />
import * as http from "http";
import { HttpProvider, HttpResponse, Route, WsResponse } from "../http";
/**
 * Proxy HTTP provider.
 */
export declare class ProxyHttpProvider extends HttpProvider {
    handleRequest(route: Route, request: http.IncomingMessage): Promise<HttpResponse>;
    handleWebSocket(route: Route, request: http.IncomingMessage): Promise<WsResponse>;
}
