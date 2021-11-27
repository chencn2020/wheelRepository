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
var fs = __importStar(require("fs-extra"));
var path = __importStar(require("path"));
var url = __importStar(require("url"));
var WebSocket = __importStar(require("ws"));
var api_1 = require("../../common/api");
var http_1 = require("../../common/http");
var http_2 = require("../http");
var bin_1 = require("./bin");
/**
 * API HTTP provider.
 */
var ApiHttpProvider = /** @class */ (function (_super) {
    __extends(ApiHttpProvider, _super);
    function ApiHttpProvider(options, server, vscode, dataDir) {
        var _this = _super.call(this, options) || this;
        _this.server = server;
        _this.vscode = vscode;
        _this.dataDir = dataDir;
        _this.ws = new WebSocket.Server({ noServer: true });
        return _this;
    }
    ApiHttpProvider.prototype.handleRequest = function (route, request) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        this.ensureAuthenticated(request);
                        if (!this.isRoot(route)) {
                            throw new http_1.HttpError("Not found", http_1.HttpCode.NotFound);
                        }
                        _a = route.base;
                        switch (_a) {
                            case http_1.ApiEndpoint.applications: return [3 /*break*/, 1];
                            case http_1.ApiEndpoint.process: return [3 /*break*/, 3];
                            case http_1.ApiEndpoint.recent: return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 6];
                    case 1:
                        this.ensureMethod(request);
                        _b = {
                            mime: "application/json"
                        };
                        _c = {};
                        return [4 /*yield*/, this.applications()];
                    case 2: return [2 /*return*/, (_b.content = (_c.applications = _e.sent(),
                            _c),
                            _b)];
                    case 3: return [2 /*return*/, this.process(request)];
                    case 4:
                        this.ensureMethod(request);
                        _d = {
                            mime: "application/json"
                        };
                        return [4 /*yield*/, this.recent()];
                    case 5: return [2 /*return*/, (_d.content = _e.sent(),
                            _d)];
                    case 6: throw new http_1.HttpError("Not found", http_1.HttpCode.NotFound);
                }
            });
        });
    };
    ApiHttpProvider.prototype.handleWebSocket = function (route, request, socket, head) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.authenticated(request)) {
                    throw new Error("not authenticated");
                }
                switch (route.base) {
                    case http_1.ApiEndpoint.status:
                        return [2 /*return*/, this.handleStatusSocket(request, socket, head)];
                    case http_1.ApiEndpoint.run:
                        return [2 /*return*/, this.handleRunSocket(route, request, socket, head)];
                }
                throw new http_1.HttpError("Not found", http_1.HttpCode.NotFound);
            });
        });
    };
    ApiHttpProvider.prototype.handleStatusSocket = function (request, socket, head) {
        return __awaiter(this, void 0, void 0, function () {
            var getMessageResponse;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        getMessageResponse = function (event) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _a = event;
                                        switch (_a) {
                                            case "health": return [3 /*break*/, 1];
                                        }
                                        return [3 /*break*/, 3];
                                    case 1:
                                        _b = { event: event };
                                        return [4 /*yield*/, this.server.getConnections()];
                                    case 2: return [2 /*return*/, (_b.connections = _c.sent(), _b)];
                                    case 3: throw new Error("unexpected message");
                                }
                            });
                        }); };
                        return [4 /*yield*/, new Promise(function (resolve) {
                                _this.ws.handleUpgrade(request, socket, head, function (ws) {
                                    var send = function (event) {
                                        ws.send(JSON.stringify(event));
                                    };
                                    ws.on("message", function (data) {
                                        logger_1.logger.trace("got message", logger_1.field("message", data));
                                        try {
                                            var message = JSON.parse(data.toString());
                                            getMessageResponse(message.event).then(send);
                                        }
                                        catch (error) {
                                            logger_1.logger.error(error.message, logger_1.field("message", data));
                                        }
                                    });
                                    resolve();
                                });
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * A socket that connects to the process.
     */
    ApiHttpProvider.prototype.handleRunSocket = function (_route, request, socket, head) {
        return __awaiter(this, void 0, void 0, function () {
            var ws;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger_1.logger.debug("connecting to process");
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                _this.ws.handleUpgrade(request, socket, head, function (socket) {
                                    socket.binaryType = "arraybuffer";
                                    socket.on("error", function (error) {
                                        socket.close(api_1.SessionError.FailedToStart);
                                        logger_1.logger.error("got error while connecting socket", logger_1.field("error", error));
                                        reject(error);
                                    });
                                    resolve(socket);
                                });
                            })];
                    case 1:
                        ws = _a.sent();
                        logger_1.logger.debug("connected to process");
                        // Send ready message.
                        ws.send(Buffer.from(JSON.stringify({
                            protocol: "TODO",
                        })));
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Return whitelisted applications.
     */
    ApiHttpProvider.prototype.applications = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, bin_1.findWhitelistedApplications()];
            });
        });
    };
    /**
     * Return installed applications.
     */
    ApiHttpProvider.prototype.installedApplications = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, bin_1.findApplications()];
            });
        });
    };
    /**
     * Handle /process endpoint.
     */
    ApiHttpProvider.prototype.process = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var data, parsed, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this.ensureMethod(request, ["DELETE", "POST"]);
                        return [4 /*yield*/, this.getData(request)];
                    case 1:
                        data = _d.sent();
                        if (!data) {
                            throw new http_1.HttpError("No data was provided", http_1.HttpCode.BadRequest);
                        }
                        parsed = JSON.parse(data);
                        _a = request.method;
                        switch (_a) {
                            case "DELETE": return [3 /*break*/, 2];
                            case "POST": return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 10];
                    case 2:
                        if (!parsed.pid) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.killProcess(parsed.pid)];
                    case 3:
                        _d.sent();
                        return [3 /*break*/, 7];
                    case 4:
                        if (!parsed.path) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.killProcess(parsed.path)];
                    case 5:
                        _d.sent();
                        return [3 /*break*/, 7];
                    case 6: throw new Error("No pid or path was provided");
                    case 7: return [2 /*return*/, {
                            mime: "application/json",
                            code: http_1.HttpCode.Ok,
                        }];
                    case 8:
                        if (!parsed.exec) {
                            throw new Error("No exec was provided");
                        }
                        _b = {
                            mime: "application/json"
                        };
                        _c = {
                            created: true
                        };
                        return [4 /*yield*/, this.spawnProcess(parsed.exec)];
                    case 9: return [2 /*return*/, (_b.content = (_c.pid = _d.sent(),
                            _c),
                            _b)];
                    case 10: throw new http_1.HttpError("Not found", http_1.HttpCode.NotFound);
                }
            });
        });
    };
    /**
     * Kill a process identified by pid or path if a web app.
     */
    ApiHttpProvider.prototype.killProcess = function (pid) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(typeof pid === "string")) return [3 /*break*/, 5];
                        _a = pid;
                        switch (_a) {
                            case bin_1.Vscode.path: return [3 /*break*/, 1];
                        }
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.vscode.dispose()];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3: throw new Error("Process \"" + pid + "\" does not exist");
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        process.kill(pid);
                        _b.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Spawn a process and return the pid.
     */
    ApiHttpProvider.prototype.spawnProcess = function (exec) {
        return __awaiter(this, void 0, void 0, function () {
            var proc;
            return __generator(this, function (_a) {
                proc = cp.spawn(exec, {
                    shell: process.env.SHELL || true,
                    env: __assign({}, process.env),
                });
                proc.on("error", function (error) { return logger_1.logger.error("process errored", logger_1.field("pid", proc.pid), logger_1.field("error", error)); });
                proc.on("exit", function () { return logger_1.logger.debug("process exited", logger_1.field("pid", proc.pid)); });
                logger_1.logger.debug("started process", logger_1.field("pid", proc.pid));
                return [2 /*return*/, proc.pid];
            });
        });
    };
    /**
     * Return VS Code's recent paths.
     */
    ApiHttpProvider.prototype.recent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var state, _a, _b, setting, pathPromises_1, workspacePromises_1, _c, paths, workspaces, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 3, , 4]);
                        if (!this.dataDir) {
                            throw new Error("data directory is not set");
                        }
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, fs.readFile(path.join(this.dataDir, "User/state/global.json"), "utf8")];
                    case 1:
                        state = _b.apply(_a, [_d.sent()]);
                        setting = Array.isArray(state) && state.find(function (item) { return item[0] === "recently.opened"; });
                        if (!setting) {
                            return [2 /*return*/, { paths: [], workspaces: [] }];
                        }
                        pathPromises_1 = {};
                        workspacePromises_1 = {};
                        Object.values(JSON.parse(setting[1])).forEach(function (recents) {
                            recents.forEach(function (recent) {
                                try {
                                    var target = typeof recent === "string" ? pathPromises_1 : workspacePromises_1;
                                    var pathname_1 = url.parse(typeof recent === "string" ? recent : recent.configURIPath).pathname;
                                    if (pathname_1 && !target[pathname_1]) {
                                        target[pathname_1] = new Promise(function (resolve) {
                                            fs.stat(pathname_1)
                                                .then(function () { return resolve(pathname_1); })
                                                .catch(function () { return resolve(); });
                                        });
                                    }
                                }
                                catch (error) {
                                    logger_1.logger.debug("invalid path", logger_1.field("path", recent));
                                }
                            });
                        });
                        return [4 /*yield*/, Promise.all([
                                Promise.all(Object.values(pathPromises_1)),
                                Promise.all(Object.values(workspacePromises_1)),
                            ])];
                    case 2:
                        _c = _d.sent(), paths = _c[0], workspaces = _c[1];
                        return [2 /*return*/, {
                                paths: paths.filter(function (p) { return !!p; }),
                                workspaces: workspaces.filter(function (p) { return !!p; }),
                            }];
                    case 3:
                        error_1 = _d.sent();
                        if (error_1.code !== "ENOENT") {
                            throw error_1;
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, { paths: [], workspaces: [] }];
                }
            });
        });
    };
    /**
     * For these, just return the error message since they'll be requested as
     * JSON.
     */
    ApiHttpProvider.prototype.getErrorRoot = function (_route, _title, _header, error) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        mime: "application/json",
                        content: JSON.stringify({ error: error }),
                    }];
            });
        });
    };
    return ApiHttpProvider;
}(http_2.HttpProvider));
exports.ApiHttpProvider = ApiHttpProvider;
//# sourceMappingURL=api.js.map