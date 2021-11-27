import { Args as VsArgs } from "../../lib/vscode/src/vs/server/ipc";
import { AuthType } from "./http";
export declare class Optional<T> {
    readonly value?: T | undefined;
    constructor(value?: T | undefined);
}
export declare enum LogLevel {
    Trace = "trace",
    Debug = "debug",
    Info = "info",
    Warn = "warn",
    Error = "error"
}
export declare class OptionalString extends Optional<string> {
}
export interface Args extends VsArgs {
    readonly auth?: AuthType;
    readonly cert?: OptionalString;
    readonly "cert-key"?: string;
    readonly "disable-updates"?: boolean;
    readonly "disable-telemetry"?: boolean;
    readonly help?: boolean;
    readonly host?: string;
    readonly json?: boolean;
    log?: LogLevel;
    readonly open?: boolean;
    readonly port?: number;
    readonly socket?: string;
    readonly "ssh-host-key"?: string;
    readonly "disable-ssh"?: boolean;
    readonly version?: boolean;
    readonly force?: boolean;
    readonly "list-extensions"?: boolean;
    readonly "install-extension"?: string[];
    readonly "show-versions"?: boolean;
    readonly "uninstall-extension"?: string[];
    readonly "proxy-domain"?: string[];
    readonly locale?: string;
    readonly _: string[];
}
export declare const optionDescriptions: () => string[];
export declare const parse: (argv: string[]) => Args;
