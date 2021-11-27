import { SFTPStream } from "ssh2-streams";
/**
 * Fills out all the functionality of SFTP using fs.
 */
export declare function fillSftpStream(accept: () => SFTPStream): void;
