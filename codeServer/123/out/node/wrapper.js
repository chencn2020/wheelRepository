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
var emitter_1 = require("../common/emitter");
var ProcessError = /** @class */ (function (_super) {
    __extends(ProcessError, _super);
    function ProcessError(message, code) {
        var _this = _super.call(this, message) || this;
        _this.code = code;
        _this.name = _this.constructor.name;
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    return ProcessError;
}(Error));
exports.ProcessError = ProcessError;
/**
 * Allows the wrapper and inner processes to communicate.
 */
var IpcMain = /** @class */ (function () {
    function IpcMain(parentPid) {
        var _this = this;
        this.parentPid = parentPid;
        this._onMessage = new emitter_1.Emitter();
        this.onMessage = this._onMessage.event;
        this._onDispose = new emitter_1.Emitter();
        this.onDispose = this._onDispose.event;
        process.on("SIGINT", function () { return _this._onDispose.emit("SIGINT"); });
        process.on("SIGTERM", function () { return _this._onDispose.emit("SIGTERM"); });
        process.on("exit", function () { return _this._onDispose.emit(undefined); });
        // Ensure we control when the process exits.
        this.exit = process.exit;
        process.exit = function (code) {
            logger_1.logger.warn("process.exit() was prevented: " + (code || "unknown code") + ".");
        };
        this.onDispose(function (signal) {
            // Remove listeners to avoid possibly triggering disposal again.
            process.removeAllListeners();
            // Let any other handlers run first then exit.
            logger_1.logger.debug((parentPid ? "inner process" : "wrapper") + " " + process.pid + " disposing", logger_1.field("code", signal));
            setTimeout(function () { return _this.exit(0); }, 0);
        });
        // Kill the inner process if the parent dies. This is for the case where the
        // parent process is forcefully terminated and cannot clean up.
        if (parentPid) {
            setInterval(function () {
                try {
                    // process.kill throws an exception if the process doesn't exist.
                    process.kill(parentPid, 0);
                }
                catch (_) {
                    // Consider this an error since it should have been able to clean up
                    // the child process unless it was forcefully killed.
                    logger_1.logger.error("parent process " + parentPid + " died");
                    _this._onDispose.emit(undefined);
                }
            }, 5000);
        }
    }
    IpcMain.prototype.handshake = function (child) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var target = child || process;
            var onMessage = function (message) {
                logger_1.logger.debug((child ? "wrapper" : "inner process") + " " + process.pid + " received message from " + (child ? child.pid : _this.parentPid), logger_1.field("message", message));
                if (message.type === "handshake") {
                    target.removeListener("message", onMessage);
                    target.on("message", function (msg) { return _this._onMessage.emit(msg); });
                    // The wrapper responds once the inner process starts the handshake.
                    if (child) {
                        if (!target.send) {
                            throw new Error("child not spawned with IPC");
                        }
                        target.send({ type: "handshake" });
                    }
                    resolve();
                }
            };
            target.on("message", onMessage);
            if (child) {
                child.once("error", reject);
                child.once("exit", function (code) {
                    reject(new ProcessError("Unexpected exit with code " + code, code !== null ? code : undefined));
                });
            }
            else {
                // The inner process initiates the handshake.
                _this.send({ type: "handshake" });
            }
        });
    };
    IpcMain.prototype.relaunch = function (version) {
        this.send({ type: "relaunch", version: version });
    };
    IpcMain.prototype.send = function (message) {
        if (!process.send) {
            throw new Error("not spawned with IPC");
        }
        process.send(message);
    };
    return IpcMain;
}());
exports.IpcMain = IpcMain;
var _ipcMain;
exports.ipcMain = function () {
    if (!_ipcMain) {
        _ipcMain = new IpcMain(typeof process.env.CODE_SERVER_PARENT_PID !== "undefined"
            ? parseInt(process.env.CODE_SERVER_PARENT_PID)
            : undefined);
    }
    return _ipcMain;
};
/**
 * Provides a way to wrap a process for the purpose of updating the running
 * instance.
 */
var WrapperProcess = /** @class */ (function () {
    function WrapperProcess(currentVersion, options) {
        var _this = this;
        this.currentVersion = currentVersion;
        this.options = options;
        exports.ipcMain().onDispose(function () {
            if (_this.process) {
                _this.process.removeAllListeners();
                _this.process.kill();
            }
        });
        exports.ipcMain().onMessage(function (message) { return __awaiter(_this, void 0, void 0, function () {
            var _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = message.type;
                        switch (_a) {
                            case "relaunch": return [3 /*break*/, 1];
                        }
                        return [3 /*break*/, 6];
                    case 1:
                        logger_1.logger.info("Relaunching: " + this.currentVersion + " -> " + message.version);
                        this.currentVersion = message.version;
                        this.started = undefined;
                        if (this.process) {
                            this.process.removeAllListeners();
                            this.process.kill();
                        }
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.start()];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _b.sent();
                        logger_1.logger.error(error_1.message);
                        exports.ipcMain().exit(typeof error_1.code === "number" ? error_1.code : 1);
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        logger_1.logger.error("Unrecognized message " + message);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
    }
    WrapperProcess.prototype.start = function () {
        var _this = this;
        if (!this.started) {
            this.started = this.spawn().then(function (child) {
                logger_1.logger.debug("spawned inner process " + child.pid);
                exports.ipcMain()
                    .handshake(child)
                    .then(function () {
                    child.once("exit", function (code) {
                        logger_1.logger.debug("inner process " + child.pid + " exited unexpectedly");
                        exports.ipcMain().exit(code || 0);
                    });
                });
                _this.process = child;
            });
        }
        return this.started;
    };
    WrapperProcess.prototype.spawn = function () {
        return __awaiter(this, void 0, void 0, function () {
            var nodeOptions;
            return __generator(this, function (_a) {
                nodeOptions = (process.env.NODE_OPTIONS || "") + " " + ((this.options && this.options.nodeOptions) || "");
                if (!/max_old_space_size=(\d+)/g.exec(nodeOptions)) {
                    nodeOptions += " --max_old_space_size=" + ((this.options && this.options.maxMemory) || 2048);
                }
                // Use spawn (instead of fork) to use the new binary in case it was updated.
                return [2 /*return*/, cp.spawn(process.argv[0], process.argv.slice(1), {
                        env: __assign(__assign({}, process.env), { CODE_SERVER_PARENT_PID: process.pid.toString(), NODE_OPTIONS: nodeOptions }),
                        stdio: ["inherit", "inherit", "inherit", "ipc"],
                    })];
            });
        });
    };
    return WrapperProcess;
}());
exports.WrapperProcess = WrapperProcess;
// It's possible that the pipe has closed (for example if you run code-server
// --version | head -1). Assume that means we're done.
if (!process.stdout.isTTY) {
    process.stdout.on("error", function () { return exports.ipcMain().exit(); });
}
exports.wrap = function (fn) {
    if (exports.ipcMain().parentPid) {
        exports.ipcMain()
            .handshake()
            .then(function () { return fn(); })
            .catch(function (error) {
            logger_1.logger.error(error.message);
            exports.ipcMain().exit(typeof error.code === "number" ? error.code : 1);
        });
    }
    else {
        var wrapper = new WrapperProcess(require("../../package.json").version);
        wrapper.start().catch(function (error) {
            logger_1.logger.error(error.message);
            exports.ipcMain().exit(typeof error.code === "number" ? error.code : 1);
        });
    }
};
//# sourceMappingURL=wrapper.js.map