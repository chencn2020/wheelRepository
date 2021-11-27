/// <reference types="node" />
import * as http from "http";
import { HttpProvider, HttpResponse, Route } from "../http";
/**
 * Static file HTTP provider. Regular static requests (the path is the request
 * itself) do not require authentication and they only allow access to resources
 * within the application. Requests for tars (the path is in a query parameter)
 * do require permissions and can access any directory.
 */
export declare class StaticHttpProvider extends HttpProvider {
    handleRequest(route: Route, request: http.IncomingMessage): Promise<HttpResponse>;
    /**
     * Return a resource with variables replaced where necessary.
     */
    protected getReplacedResource(route: Route): Promise<HttpResponse>;
    /**
     * Tar up and stream a directory.
     */
    private getTarredResource;
}
