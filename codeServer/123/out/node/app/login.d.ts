/// <reference types="node" />
import * as http from "http";
import { HttpProvider, HttpResponse, Route } from "../http";
/**
 * Login HTTP provider.
 */
export declare class LoginHttpProvider extends HttpProvider {
    handleRequest(route: Route, request: http.IncomingMessage): Promise<HttpResponse>;
    getRoot(route: Route, error?: Error): Promise<HttpResponse>;
    /**
     * Try logging in. On failure, show the login page with an error.
     */
    private tryLogin;
    /**
     * Return a cookie if the user is authenticated otherwise throw an error.
     */
    private login;
}
