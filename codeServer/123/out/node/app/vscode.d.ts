/// <reference types="node" />
import * as http from "http";
import * as net from "net";
import { Args } from "../cli";
import { HttpProvider, HttpProviderOptions, HttpResponse, Route } from "../http";
export declare class VscodeHttpProvider extends HttpProvider {
    private readonly args;
    private readonly serverRootPath;
    private readonly vsRootPath;
    private _vscode?;
    constructor(options: HttpProviderOptions, args: Args);
    get running(): boolean;
    dispose(): Promise<void>;
    private initialize;
    private fork;
    handleWebSocket(route: Route, request: http.IncomingMessage, socket: net.Socket): Promise<void>;
    private send;
    handleRequest(route: Route, request: http.IncomingMessage): Promise<HttpResponse>;
    private getRoot;
    /**
     * Choose the first non-empty path.
     */
    private getFirstPath;
}
