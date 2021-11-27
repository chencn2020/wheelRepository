/// <reference types="node" />
import * as http from "http";
import { HttpProvider, HttpProviderOptions, HttpResponse, Route } from "../http";
import { SettingsProvider, UpdateSettings } from "../settings";
export interface Update {
    checked: number;
    version: string;
}
export interface LatestResponse {
    name: string;
}
/**
 * Update HTTP provider.
 */
export declare class UpdateHttpProvider extends HttpProvider {
    readonly enabled: boolean;
    /**
     * The URL for getting the latest version of code-server. Should return JSON
     * that fulfills `LatestResponse`.
     */
    private readonly latestUrl;
    /**
     * The URL for downloading a version of code-server. {{VERSION}} and
     * {{RELEASE_NAME}} will be replaced (for example 2.1.0 and
     * code-server-2.1.0-linux-x86_64.tar.gz).
     */
    private readonly downloadUrl;
    /**
     * Update information will be stored here. If not provided, the global
     * settings will be used.
     */
    private readonly settings;
    private update?;
    private updateInterval;
    constructor(options: HttpProviderOptions, enabled: boolean, 
    /**
     * The URL for getting the latest version of code-server. Should return JSON
     * that fulfills `LatestResponse`.
     */
    latestUrl?: string, 
    /**
     * The URL for downloading a version of code-server. {{VERSION}} and
     * {{RELEASE_NAME}} will be replaced (for example 2.1.0 and
     * code-server-2.1.0-linux-x86_64.tar.gz).
     */
    downloadUrl?: string, 
    /**
     * Update information will be stored here. If not provided, the global
     * settings will be used.
     */
    settings?: SettingsProvider<UpdateSettings>);
    handleRequest(route: Route, request: http.IncomingMessage): Promise<HttpResponse>;
    getRoot(route: Route, request: http.IncomingMessage, appliedUpdate?: string, error?: Error): Promise<HttpResponse>;
    /**
     * Query for and return the latest update.
     */
    getUpdate(force?: boolean): Promise<Update>;
    private _getUpdate;
    get currentVersion(): string;
    /**
     * Return true if the currently installed version is the latest.
     */
    isLatestVersion(latest: Update): boolean;
    private getUpdateHtml;
    tryUpdate(route: Route, request: http.IncomingMessage): Promise<HttpResponse>;
    downloadAndApplyUpdate(update: Update, targetPath?: string): Promise<void>;
    private extractTar;
    private extractZip;
    /**
     * Given an update return the name for the packaged archived.
     */
    getReleaseName(update: Update): Promise<string>;
    private request;
    private requestResponse;
}
