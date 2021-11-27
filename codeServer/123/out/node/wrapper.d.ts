/// <reference types="node" />
import * as cp from "child_process";
interface HandshakeMessage {
    type: "handshake";
}
interface RelaunchMessage {
    type: "relaunch";
    version: string;
}
export declare type Message = RelaunchMessage | HandshakeMessage;
export declare class ProcessError extends Error {
    readonly code: number | undefined;
    constructor(message: string, code: number | undefined);
}
/**
 * Allows the wrapper and inner processes to communicate.
 */
export declare class IpcMain {
    readonly parentPid?: number | undefined;
    private readonly _onMessage;
    readonly onMessage: import("../common/emitter").Event<Message>;
    private readonly _onDispose;
    readonly onDispose: import("../common/emitter").Event<"SIGABRT" | "SIGALRM" | "SIGBUS" | "SIGCHLD" | "SIGCONT" | "SIGFPE" | "SIGHUP" | "SIGILL" | "SIGINT" | "SIGIO" | "SIGIOT" | "SIGKILL" | "SIGPIPE" | "SIGPOLL" | "SIGPROF" | "SIGPWR" | "SIGQUIT" | "SIGSEGV" | "SIGSTKFLT" | "SIGSTOP" | "SIGSYS" | "SIGTERM" | "SIGTRAP" | "SIGTSTP" | "SIGTTIN" | "SIGTTOU" | "SIGUNUSED" | "SIGURG" | "SIGUSR1" | "SIGUSR2" | "SIGVTALRM" | "SIGWINCH" | "SIGXCPU" | "SIGXFSZ" | "SIGBREAK" | "SIGLOST" | "SIGINFO" | undefined>;
    readonly exit: (code?: number) => never;
    constructor(parentPid?: number | undefined);
    handshake(child?: cp.ChildProcess): Promise<void>;
    relaunch(version: string): void;
    private send;
}
export declare const ipcMain: () => IpcMain;
export interface WrapperOptions {
    maxMemory?: number;
    nodeOptions?: string;
}
/**
 * Provides a way to wrap a process for the purpose of updating the running
 * instance.
 */
export declare class WrapperProcess {
    private currentVersion;
    private readonly options?;
    private process?;
    private started?;
    constructor(currentVersion: string, options?: WrapperOptions | undefined);
    start(): Promise<void>;
    private spawn;
}
export declare const wrap: (fn: () => Promise<void>) => void;
export {};
