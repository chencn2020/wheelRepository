"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("@coder/logger");
var emitter_1 = require("../common/emitter");
var util_1 = require("../common/util");
var decoder = new TextDecoder("utf8");
exports.decode = function (buffer) {
    return typeof buffer !== "string" ? decoder.decode(buffer) : buffer;
};
/**
 * A web socket that reconnects itself when it closes. Sending messages while
 * disconnected will throw an error.
 */
var ReconnectingSocket = /** @class */ (function () {
    function ReconnectingSocket(path, id) {
        var _this = this;
        if (id === void 0) { id = util_1.generateUuid(4); }
        this.path = path;
        this.id = id;
        this._onMessage = new emitter_1.Emitter();
        this.onMessage = this._onMessage.event;
        this._onDisconnect = new emitter_1.Emitter();
        this.onDisconnect = this._onDisconnect.event;
        this._onClose = new emitter_1.Emitter();
        this.onClose = this._onClose.event;
        this._onConnect = new emitter_1.Emitter();
        this.onConnect = this._onConnect.event;
        this.closed = false;
        this.openTimeout = 10000;
        // Every time the socket fails to connect, the retry will be increasingly
        // delayed up to a maximum.
        this.retryBaseDelay = 1000;
        this.retryMaxDelay = 10000;
        this.retryDelayFactor = 1.5;
        this.resetRetryDelay = 10000;
        this._binaryType = "arraybuffer";
        // On Firefox the socket seems to somehow persist a page reload so the close
        // event runs and we see "attempting to reconnect".
        if (typeof window !== "undefined") {
            window.addEventListener("beforeunload", function () { return _this.close(); });
        }
        this.logger = logger_1.logger.named(this.id);
    }
    Object.defineProperty(ReconnectingSocket.prototype, "binaryType", {
        set: function (b) {
            this._binaryType = b;
            if (this.socket) {
                this.socket.binaryType = b;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Permanently close the connection. Will not attempt to reconnect. Will
     * remove event listeners.
     */
    ReconnectingSocket.prototype.close = function (code) {
        if (this.closed) {
            return;
        }
        if (code) {
            this.logger.info("closing with code " + code);
        }
        if (this.resetRetryTimeout) {
            clearTimeout(this.resetRetryTimeout);
        }
        this.closed = true;
        if (this.socket) {
            this.socket.close();
        }
        else {
            this._onClose.emit(code);
        }
    };
    ReconnectingSocket.prototype.dispose = function () {
        this._onMessage.dispose();
        this._onDisconnect.dispose();
        this._onClose.dispose();
        this._onConnect.dispose();
        this.logger.debug("disposed handlers");
    };
    /**
     * Send a message on the socket. Logs an error if currently disconnected.
     */
    ReconnectingSocket.prototype.send = function (message) {
        this.logger.trace(function () { return ["sending message", logger_1.field("message", exports.decode(message))]; });
        if (!this.socket) {
            return logger_1.logger.error("tried to send message on closed socket");
        }
        this.socket.send(message);
    };
    /**
     * Connect to the socket. Can also be called to wait until the connection is
     * established in the case of disconnections. Multiple calls will be handled
     * correctly.
     */
    ReconnectingSocket.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!this.connecting) {
                    this.connecting = new Promise(function (resolve, reject) {
                        var tryConnect = function () {
                            if (_this.closed) {
                                return reject(new Error("disconnected")); // Don't keep trying if we've closed permanently.
                            }
                            if (typeof _this.retryDelay === "undefined") {
                                _this.retryDelay = 0;
                            }
                            else {
                                _this.retryDelay = _this.retryDelay * _this.retryDelayFactor || _this.retryBaseDelay;
                                if (_this.retryDelay > _this.retryMaxDelay) {
                                    _this.retryDelay = _this.retryMaxDelay;
                                }
                            }
                            _this._connect()
                                .then(function (socket) {
                                _this.logger.info("connected");
                                _this.socket = socket;
                                _this.socket.binaryType = _this._binaryType;
                                if (_this.resetRetryTimeout) {
                                    clearTimeout(_this.resetRetryTimeout);
                                }
                                _this.resetRetryTimeout = setTimeout(function () { return (_this.retryDelay = undefined); }, _this.resetRetryDelay);
                                _this.connecting = undefined;
                                _this._onConnect.emit();
                                resolve();
                            })
                                .catch(function (error) {
                                _this.logger.error("failed to connect: " + error.message);
                                tryConnect();
                            });
                        };
                        tryConnect();
                    });
                }
                return [2 /*return*/, this.connecting];
            });
        });
    };
    ReconnectingSocket.prototype._connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var socket;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, _reject) {
                            if (_this.retryDelay) {
                                _this.logger.info("retrying in " + _this.retryDelay + "ms...");
                            }
                            setTimeout(function () {
                                _this.logger.info("connecting...", logger_1.field("path", _this.path));
                                var socket = new WebSocket(_this.path);
                                var reject = function () {
                                    _reject(new Error("socket closed"));
                                };
                                var timeout = setTimeout(function () {
                                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
                                    socket.removeEventListener("open", open);
                                    socket.removeEventListener("close", reject);
                                    _reject(new Error("timeout"));
                                }, _this.openTimeout);
                                var open = function () {
                                    clearTimeout(timeout);
                                    socket.removeEventListener("close", reject);
                                    resolve(socket);
                                };
                                socket.addEventListener("open", open);
                                socket.addEventListener("close", reject);
                            }, _this.retryDelay);
                        })];
                    case 1:
                        socket = _a.sent();
                        socket.addEventListener("message", function (event) {
                            _this.logger.trace(function () { return ["got message", logger_1.field("message", exports.decode(event.data))]; });
                            _this._onMessage.emit(event.data);
                        });
                        socket.addEventListener("close", function (event) {
                            _this.socket = undefined;
                            if (!_this.closed) {
                                _this._onDisconnect.emit(event.code);
                                // It might be closed in the event handler.
                                if (!_this.closed) {
                                    _this.logger.info("connection closed; attempting to reconnect");
                                    _this.connect();
                                }
                            }
                            else {
                                _this._onClose.emit(event.code);
                                _this.logger.info("connection closed permanently");
                            }
                        });
                        return [2 /*return*/, socket];
                }
            });
        });
    };
    return ReconnectingSocket;
}());
exports.ReconnectingSocket = ReconnectingSocket;
//# sourceMappingURL=socket.js.map