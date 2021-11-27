"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Provides utilities for handling SSH connections
 */
var net = __importStar(require("net"));
var cp = __importStar(require("child_process"));
var nodePty = __importStar(require("node-pty"));
var sftp_1 = require("./sftp");
/**
 * Fills out all of the functionality of SSH using node equivalents.
 */
function fillSshSession(accept) {
    var pty;
    var activeProcess;
    var ptyInfo;
    var env = {};
    var session = accept();
    // Run a command, stream back the data
    var cmd = function (command, channel) {
        if (ptyInfo) {
            // Remove undefined and project env vars
            // keysToRemove taken from sanitizeProcessEnvironment
            var keysToRemove_1 = [/^ELECTRON_.+$/, /^GOOGLE_API_KEY$/, /^VSCODE_.+$/, /^SNAP(|_.*)$/];
            var env_1 = Object.keys(process.env).reduce(function (prev, k) {
                if (process.env[k] === undefined) {
                    return prev;
                }
                var val = process.env[k];
                if (keysToRemove_1.find(function (rx) { return val.search(rx); })) {
                    return prev;
                }
                prev[k] = val;
                return prev;
            }, {});
            pty = nodePty.spawn(command, [], {
                cols: ptyInfo.cols,
                rows: ptyInfo.rows,
                env: env_1,
            });
            pty.onData(function (d) { return channel.write(d); });
            pty.on("exit", function (exitCode) {
                channel.exit(exitCode);
                channel.close();
            });
            channel.on("data", function (d) { return pty && pty.write(d); });
            return;
        }
        var proc = cp.spawn(command, { shell: true });
        proc.stdout.on("data", function (d) { return channel.stdout.write(d); });
        proc.stderr.on("data", function (d) { return channel.stderr.write(d); });
        proc.on("exit", function (exitCode) {
            channel.exit(exitCode || 0);
            channel.close();
        });
        channel.stdin.on("data", function (d) { return proc.stdin.write(d); });
        channel.stdin.on("close", function () { return proc.stdin.end(); });
    };
    session.on("pty", function (accept, _, info) {
        ptyInfo = info;
        accept && accept();
    });
    session.on("shell", function (accept) {
        cmd(process.env.SHELL || "/usr/bin/env bash", accept());
    });
    session.on("exec", function (accept, _, info) {
        cmd(info.command, accept());
    });
    session.on("sftp", sftp_1.fillSftpStream);
    session.on("signal", function (accept, _, info) {
        accept && accept();
        process.kill((pty || activeProcess).pid, info.name);
    });
    session.on("env", function (accept, _reject, info) {
        accept && accept();
        env[info.key] = info.value;
    });
    session.on("auth-agent", function (accept) {
        accept();
    });
    session.on("window-change", function (accept, reject, info) {
        if (pty) {
            pty.resize(info.cols, info.rows);
            accept && accept();
        }
        else {
            reject();
        }
    });
}
exports.fillSshSession = fillSshSession;
/**
 * Pipes a requested port over SSH
 */
function forwardSshPort(accept, reject, info) {
    var fwdSocket = net.createConnection(info.destPort, info.destIP);
    fwdSocket.on("error", function () { return reject(); });
    fwdSocket.on("connect", function () {
        var channel = accept();
        channel.pipe(fwdSocket);
        channel.on("close", function () { return fwdSocket.end(); });
        fwdSocket.pipe(channel);
        fwdSocket.on("close", function () { return channel.close(); });
        fwdSocket.on("error", function () { return channel.end(); });
        fwdSocket.on("end", function () { return channel.end(); });
    });
}
exports.forwardSshPort = forwardSshPort;
//# sourceMappingURL=ssh.js.map