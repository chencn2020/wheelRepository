import * as ssh from "ssh2";
/**
 * Fills out all of the functionality of SSH using node equivalents.
 */
export declare function fillSshSession(accept: () => ssh.Session): void;
/**
 * Pipes a requested port over SSH
 */
export declare function forwardSshPort(accept: () => ssh.ServerChannel, reject: () => boolean, info: ssh.TcpipRequestInfo): void;
