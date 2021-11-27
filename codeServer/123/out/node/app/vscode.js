"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var crypto = __importStar(require("crypto"));
var path = __importStar(require("path"));
var http_1 = require("../../common/http");
var util_1 = require("../../common/util");
var http_2 = require("../http");
var settings_1 = require("../settings");
var VscodeHttpProvider = /** @class */ (function (_super) {
    __extends(VscodeHttpProvider, _super);
    function VscodeHttpProvider(options, args) {
        var _this = _super.call(this, options) || this;
        _this.args = args;
        _this.vsRootPath = path.resolve(_this.rootPath, "lib/vscode");
        _this.serverRootPath = path.join(_this.vsRootPath, "out/vs/server");
        return _this;
    }
    Object.defineProperty(VscodeHttpProvider.prototype, "running", {
        get: function () {
            return !!this._vscode;
        },
        enumerable: true,
        configurable: true
    });
    VscodeHttpProvider.prototype.dispose = function () {
        return __awaiter(this, void 0, void 0, function () {
            var vscode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._vscode) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._vscode];
                    case 1:
                        vscode = _a.sent();
                        vscode.removeAllListeners();
                        this._vscode = undefined;
                        vscode.kill();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    VscodeHttpProvider.prototype.initialize = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var id, vscode;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = util_1.generateUuid();
                        return [4 /*yield*/, this.fork()];
                    case 1:
                        vscode = _a.sent();
                        logger_1.logger.debug("setting up vs code...");
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                vscode.once("message", function (message) {
                                    logger_1.logger.debug("got message from vs code", logger_1.field("message", message));
                                    return message.type === "options" && message.id === id
                                        ? resolve(message.options)
                                        : reject(new Error("Unexpected response during initialization"));
                                });
                                vscode.once("error", reject);
                                vscode.once("exit", function (code) { return reject(new Error("VS Code exited unexpectedly with code " + code)); });
                                _this.send({ type: "init", id: id, options: options }, vscode);
                            })];
                }
            });
        });
    };
    VscodeHttpProvider.prototype.fork = function () {
        var _this = this;
        if (!this._vscode) {
            logger_1.logger.debug("forking vs code...");
            var vscode_1 = cp.fork(path.join(this.serverRootPath, "fork"));
            vscode_1.on("error", function (error) {
                logger_1.logger.error(error.message);
                _this._vscode = undefined;
            });
            vscode_1.on("exit", function (code) {
                logger_1.logger.error("VS Code exited unexpectedly with code " + code);
                _this._vscode = undefined;
            });
            this._vscode = new Promise(function (resolve, reject) {
                vscode_1.once("message", function (message) {
                    logger_1.logger.debug("got message from vs code", logger_1.field("message", message));
                    return message.type === "ready"
                        ? resolve(vscode_1)
                        : reject(new Error("Unexpected response waiting for ready response"));
                });
                vscode_1.once("error", reject);
                vscode_1.once("exit", function (code) { return reject(new Error("VS Code exited unexpectedly with code " + code)); });
            });
        }
        return this._vscode;
    };
    VscodeHttpProvider.prototype.handleWebSocket = function (route, request, socket) {
        return __awaiter(this, void 0, void 0, function () {
            var magic, reply, vscode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.authenticated(request)) {
                            throw new Error("not authenticated");
                        }
                        magic = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
                        reply = crypto
                            .createHash("sha1")
                            .update(request.headers["sec-websocket-key"] + magic)
                            .digest("base64");
                        socket.write([
                            "HTTP/1.1 101 Switching Protocols",
                            "Upgrade: websocket",
                            "Connection: Upgrade",
                            "Sec-WebSocket-Accept: " + reply,
                        ].join("\r\n") + "\r\n\r\n");
                        return [4 /*yield*/, this._vscode];
                    case 1:
                        vscode = _a.sent();
                        this.send({ type: "socket", query: route.query }, vscode, socket);
                        return [2 /*return*/];
                }
            });
        });
    };
    VscodeHttpProvider.prototype.send = function (message, vscode, socket) {
        if (!vscode || vscode.killed) {
            throw new Error("vscode is not running");
        }
        vscode.send(message, socket);
    };
    VscodeHttpProvider.prototype.handleRequest = function (route, request) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_1, message;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.ensureMethod(request);
                        _a = route.base;
                        switch (_a) {
                            case "/": return [3 /*break*/, 1];
                        }
                        return [3 /*break*/, 5];
                    case 1:
                        if (!this.isRoot(route)) {
                            throw new http_1.HttpError("Not found", http_1.HttpCode.NotFound);
                        }
                        else if (!this.authenticated(request)) {
                            return [2 /*return*/, { redirect: "/login", query: { to: this.options.base } }];
                        }
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.getRoot(request, route)];
                    case 3: return [2 /*return*/, _b.sent()];
                    case 4:
                        error_1 = _b.sent();
                        message = "<div>VS Code failed to load.</div> " + (this.isDev
                            ? "<div>It might not have finished compiling.</div>" +
                                "Check for <code>Finished <span class=\"success\">compilation</span></code> in the output."
                            : "") + " <br><br>" + error_1;
                        return [2 /*return*/, this.getErrorRoot(route, "VS Code failed to load", "500", message)];
                    case 5:
                        this.ensureAuthenticated(request);
                        switch (route.base) {
                            case "/resource":
                            case "/vscode-remote-resource":
                                if (typeof route.query.path === "string") {
                                    return [2 /*return*/, this.getResource(route.query.path)];
                                }
                                break;
                            case "/webview":
                                if (/^\/vscode-resource/.test(route.requestPath)) {
                                    return [2 /*return*/, this.getResource(route.requestPath.replace(/^\/vscode-resource(\/file)?/, ""))];
                                }
                                return [2 /*return*/, this.getResource(this.vsRootPath, "out/vs/workbench/contrib/webview/browser/pre", route.requestPath)];
                        }
                        throw new http_1.HttpError("Not found", http_1.HttpCode.NotFound);
                }
            });
        });
    };
    VscodeHttpProvider.prototype.getRoot = function (request, route) {
        return __awaiter(this, void 0, void 0, function () {
            var remoteAuthority, lastVisited, startPath, _a, response, options, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        remoteAuthority = request.headers.host;
                        return [4 /*yield*/, settings_1.settings.read()];
                    case 1:
                        lastVisited = (_d.sent()).lastVisited;
                        return [4 /*yield*/, this.getFirstPath([
                                { url: route.query.workspace, workspace: true },
                                { url: route.query.folder, workspace: false },
                                this.args._ && this.args._.length > 0 ? { url: path.resolve(this.args._[this.args._.length - 1]) } : undefined,
                                lastVisited,
                            ])];
                    case 2:
                        startPath = _d.sent();
                        _c = (_b = Promise).all;
                        return [4 /*yield*/, this.getUtf8Resource(this.rootPath, "src/browser/pages/vscode.html")];
                    case 3: return [4 /*yield*/, _c.apply(_b, [[
                                _d.sent(),
                                this.initialize({
                                    args: this.args,
                                    remoteAuthority: remoteAuthority,
                                    startPath: startPath,
                                })
                            ]])];
                    case 4:
                        _a = _d.sent(), response = _a[0], options = _a[1];
                        if (startPath) {
                            settings_1.settings.write({
                                lastVisited: startPath,
                            });
                        }
                        if (!this.isDev) {
                            response.content = response.content.replace(/<!-- PROD_ONLY/g, "").replace(/END_PROD_ONLY -->/g, "");
                        }
                        response.content = response.content
                            .replace("\"{{REMOTE_USER_DATA_URI}}\"", "'" + JSON.stringify(options.remoteUserDataUri) + "'")
                            .replace("\"{{PRODUCT_CONFIGURATION}}\"", "'" + JSON.stringify(options.productConfiguration) + "'")
                            .replace("\"{{WORKBENCH_WEB_CONFIGURATION}}\"", "'" + JSON.stringify(options.workbenchWebConfiguration) + "'")
                            .replace("\"{{NLS_CONFIGURATION}}\"", "'" + JSON.stringify(options.nlsConfiguration) + "'");
                        return [2 /*return*/, this.replaceTemplates(route, response, {
                                base: this.base(route),
                                commit: this.options.commit,
                                disableTelemetry: !!this.args["disable-telemetry"],
                            })];
                }
            });
        });
    };
    /**
     * Choose the first non-empty path.
     */
    VscodeHttpProvider.prototype.getFirstPath = function (startPaths) {
        return __awaiter(this, void 0, void 0, function () {
            var i, startPath, url;
            return __generator(this, function (_a) {
                for (i = 0; i < startPaths.length; ++i) {
                    startPath = startPaths[i];
                    url = startPath && (typeof startPath.url === "string" ? [startPath.url] : startPath.url || []).find(function (p) { return !!p; });
                    if (startPath && url) {
                        return [2 /*return*/, {
                                url: url,
                                workspace: !!startPath.workspace,
                            }];
                    }
                }
                return [2 /*return*/, undefined];
            });
        });
    };
    return VscodeHttpProvider;
}(http_2.HttpProvider));
exports.VscodeHttpProvider = VscodeHttpProvider;
//# sourceMappingURL=vscode.js.map