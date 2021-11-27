"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("@coder/logger");
var cp = __importStar(require("child_process"));
var path = __importStar(require("path"));
var api_1 = require("./app/api");
var dashboard_1 = require("./app/dashboard");
var login_1 = require("./app/login");
var proxy_1 = require("./app/proxy");
var static_1 = require("./app/static");
var update_1 = require("./app/update");
var vscode_1 = require("./app/vscode");
var cli_1 = require("./cli");
var http_1 = require("./http");
var server_1 = require("./ssh/server");
var util_1 = require("./util");
var wrapper_1 = require("./wrapper");
process.on("uncaughtException", function (error) {
    logger_1.logger.error("Uncaught exception: " + error.message);
    if (typeof error.stack !== "undefined") {
        logger_1.logger.error(error.stack);
    }
});
var pkg = {};
try {
    pkg = require("../../package.json");
}
catch (error) {
    logger_1.logger.warn(error.message);
}
var version = pkg.version || "development";
var commit = pkg.commit || "development";
var main = function (args) { return __awaiter(void 0, void 0, void 0, function () {
    var auth, originalPassword, _a, _b, options, _c, _d, httpServer, vscode, api, update, serverAddress, sshHostKey, error_1, sshPort, sshProvider, error_2, openAddress;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                auth = args.auth || http_1.AuthType.Password;
                _a = auth === http_1.AuthType.Password;
                if (!_a) return [3 /*break*/, 3];
                _b = process.env.PASSWORD;
                if (_b) return [3 /*break*/, 2];
                return [4 /*yield*/, util_1.generatePassword()];
            case 1:
                _b = (_e.sent());
                _e.label = 2;
            case 2:
                _a = (_b);
                _e.label = 3;
            case 3:
                originalPassword = _a;
                _c = [{ auth: auth,
                        commit: commit, host: args.host || (args.auth === http_1.AuthType.Password && typeof args.cert !== "undefined" ? "0.0.0.0" : "localhost"), password: originalPassword ? util_1.hash(originalPassword) : undefined, port: typeof args.port !== "undefined" ? args.port : process.env.PORT ? parseInt(process.env.PORT, 10) : 8080, proxyDomains: args["proxy-domain"], socket: args.socket }];
                if (!(args.cert && !args.cert.value)) return [3 /*break*/, 5];
                return [4 /*yield*/, util_1.generateCertificate()];
            case 4:
                _d = _e.sent();
                return [3 /*break*/, 6];
            case 5:
                _d = {
                    cert: args.cert && args.cert.value,
                    certKey: args["cert-key"],
                };
                _e.label = 6;
            case 6:
                options = __assign.apply(void 0, _c.concat([(_d)]));
                if (options.cert && !options.certKey) {
                    throw new Error("--cert-key is missing");
                }
                httpServer = new http_1.HttpServer(options);
                vscode = httpServer.registerHttpProvider("/", vscode_1.VscodeHttpProvider, args);
                api = httpServer.registerHttpProvider("/api", api_1.ApiHttpProvider, httpServer, vscode, args["user-data-dir"]);
                update = httpServer.registerHttpProvider("/update", update_1.UpdateHttpProvider, !args["disable-updates"]);
                httpServer.registerHttpProvider("/proxy", proxy_1.ProxyHttpProvider);
                httpServer.registerHttpProvider("/login", login_1.LoginHttpProvider);
                httpServer.registerHttpProvider("/static", static_1.StaticHttpProvider);
                httpServer.registerHttpProvider("/dashboard", dashboard_1.DashboardHttpProvider, api, update);
                wrapper_1.ipcMain().onDispose(function () { return httpServer.dispose(); });
                logger_1.logger.info("code-server " + version + " " + commit);
                return [4 /*yield*/, httpServer.listen()];
            case 7:
                serverAddress = _e.sent();
                logger_1.logger.info("HTTP server listening on " + serverAddress);
                if (auth === http_1.AuthType.Password && !process.env.PASSWORD) {
                    logger_1.logger.info("  - Password is " + originalPassword);
                    logger_1.logger.info("    - To use your own password set the PASSWORD environment variable");
                    if (!args.auth) {
                        logger_1.logger.info("    - To disable use `--auth none`");
                    }
                }
                else if (auth === http_1.AuthType.Password) {
                    logger_1.logger.info("  - Using custom password for authentication");
                }
                else {
                    logger_1.logger.info("  - No authentication");
                }
                if (httpServer.protocol === "https") {
                    logger_1.logger.info(args.cert && args.cert.value
                        ? "  - Using provided certificate and key for HTTPS"
                        : "  - Using generated certificate and key for HTTPS");
                }
                else {
                    logger_1.logger.info("  - Not serving HTTPS");
                }
                if (httpServer.proxyDomains.size > 0) {
                    logger_1.logger.info("  - Proxying the following domain" + (httpServer.proxyDomains.size === 1 ? "" : "s") + ":");
                    httpServer.proxyDomains.forEach(function (domain) { return logger_1.logger.info("    - *." + domain); });
                }
                logger_1.logger.info("Automatic updates are " + (update.enabled ? "enabled" : "disabled"));
                sshHostKey = args["ssh-host-key"];
                if (!(!args["disable-ssh"] && !sshHostKey)) return [3 /*break*/, 11];
                _e.label = 8;
            case 8:
                _e.trys.push([8, 10, , 11]);
                return [4 /*yield*/, util_1.generateSshHostKey()];
            case 9:
                sshHostKey = _e.sent();
                return [3 /*break*/, 11];
            case 10:
                error_1 = _e.sent();
                logger_1.logger.error("Unable to start SSH server", logger_1.field("error", error_1.message));
                return [3 /*break*/, 11];
            case 11:
                if (!(!args["disable-ssh"] && sshHostKey)) return [3 /*break*/, 15];
                sshProvider = httpServer.registerHttpProvider("/ssh", server_1.SshProvider, sshHostKey);
                _e.label = 12;
            case 12:
                _e.trys.push([12, 14, , 15]);
                return [4 /*yield*/, sshProvider.listen()];
            case 13:
                sshPort = _e.sent();
                return [3 /*break*/, 15];
            case 14:
                error_2 = _e.sent();
                logger_1.logger.warn("SSH server: " + error_2.message);
                return [3 /*break*/, 15];
            case 15:
                if (typeof sshPort !== "undefined") {
                    logger_1.logger.info("SSH server listening on localhost:" + sshPort);
                    logger_1.logger.info("  - To disable use `--disable-ssh`");
                }
                else {
                    logger_1.logger.info("SSH server disabled");
                }
                if (!(serverAddress && !options.socket && args.open)) return [3 /*break*/, 17];
                openAddress = serverAddress.replace(/:\/\/0.0.0.0/, "://localhost");
                return [4 /*yield*/, util_1.open(openAddress).catch(console.error)];
            case 16:
                _e.sent();
                logger_1.logger.info("Opened " + openAddress);
                _e.label = 17;
            case 17: return [2 /*return*/];
        }
    });
}); };
var tryParse = function () {
    try {
        return cli_1.parse(process.argv.slice(2));
    }
    catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};
var args = tryParse();
if (args.help) {
    console.log("code-server", version, commit);
    console.log("");
    console.log("Usage: code-server [options] [path]");
    console.log("");
    console.log("Options");
    cli_1.optionDescriptions().forEach(function (description) {
        console.log("", description);
    });
}
else if (args.version) {
    if (args.json) {
        console.log({
            codeServer: version,
            commit: commit,
            vscode: require("../../lib/vscode/package.json").version,
        });
    }
    else {
        console.log(version, commit);
    }
    process.exit(0);
}
else if (args["list-extensions"] || args["install-extension"] || args["uninstall-extension"]) {
    logger_1.logger.debug("forking vs code cli...");
    var vscode_2 = cp.fork(path.resolve(__dirname, "../../lib/vscode/out/vs/server/fork"), [], {
        env: __assign(__assign({}, process.env), { CODE_SERVER_PARENT_PID: process.pid.toString() }),
    });
    vscode_2.once("message", function (message) {
        logger_1.logger.debug("Got message from VS Code", logger_1.field("message", message));
        if (message.type !== "ready") {
            logger_1.logger.error("Unexpected response waiting for ready response");
            process.exit(1);
        }
        var send = { type: "cli", args: args };
        vscode_2.send(send);
    });
    vscode_2.once("error", function (error) {
        logger_1.logger.error(error.message);
        process.exit(1);
    });
    vscode_2.on("exit", function (code) { return process.exit(code || 0); });
}
else {
    wrapper_1.wrap(function () { return main(args); });
}
//# sourceMappingURL=entry.js.map