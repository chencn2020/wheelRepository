/// <reference types="node" />
import * as http from "http";
import * as net from "net";
import { Application, RecentResponse } from "../../common/api";
import { HttpProvider, HttpProviderOptions, HttpResponse, HttpServer, Route } from "../http";
import { VscodeHttpProvider } from "./vscode";
/**
 * API HTTP provider.
 */
export declare class ApiHttpProvider extends HttpProvider {
    private readonly server;
    private readonly vscode;
    private readonly dataDir?;
    private readonly ws;
    constructor(options: HttpProviderOptions, server: HttpServer, vscode: VscodeHttpProvider, dataDir?: string | undefined);
    handleRequest(route: Route, request: http.IncomingMessage): Promise<HttpResponse>;
    handleWebSocket(route: Route, request: http.IncomingMessage, socket: net.Socket, head: Buffer): Promise<void>;
    private handleStatusSocket;
    /**
     * A socket that connects to the process.
     */
    private handleRunSocket;
    /**
     * Return whitelisted applications.
     */
    applications(): Promise<ReadonlyArray<Application>>;
    /**
     * Return installed applications.
     */
    installedApplications(): Promise<ReadonlyArray<Application>>;
    /**
     * Handle /process endpoint.
     */
    private process;
    /**
     * Kill a process identified by pid or path if a web app.
     */
    killProcess(pid: number | string): Promise<void>;
    /**
     * Spawn a process and return the pid.
     */
    spawnProcess(exec: string): Promise<number>;
    /**
     * Return VS Code's recent paths.
     */
    recent(): Promise<RecentResponse>;
    /**
     * For these, just return the error message since they'll be requested as
     * JSON.
     */
    getErrorRoot(_route: Route, _title: string, _header: string, error: string): Promise<HttpResponse>;
}
