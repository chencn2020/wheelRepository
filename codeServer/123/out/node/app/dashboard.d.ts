/// <reference types="node" />
import * as http from "http";
import { HttpProvider, HttpProviderOptions, HttpResponse, Route } from "../http";
import { ApiHttpProvider } from "./api";
import { UpdateHttpProvider } from "./update";
/**
 * Dashboard HTTP provider.
 */
export declare class DashboardHttpProvider extends HttpProvider {
    private readonly api;
    private readonly update;
    constructor(options: HttpProviderOptions, api: ApiHttpProvider, update: UpdateHttpProvider);
    handleRequest(route: Route, request: http.IncomingMessage): Promise<HttpResponse>;
    getRoot(route: Route): Promise<HttpResponse>;
    getAppRoot(route: Route): Promise<HttpResponse>;
    private getAppRows;
    private getAppRow;
    private getUpdate;
}
