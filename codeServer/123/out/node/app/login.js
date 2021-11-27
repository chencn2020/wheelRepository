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
var querystring = __importStar(require("querystring"));
var http_1 = require("../../common/http");
var http_2 = require("../http");
var util_1 = require("../util");
/**
 * Login HTTP provider.
 */
var LoginHttpProvider = /** @class */ (function (_super) {
    __extends(LoginHttpProvider, _super);
    function LoginHttpProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LoginHttpProvider.prototype.handleRequest = function (route, request) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.options.auth !== http_2.AuthType.Password || !this.isRoot(route)) {
                    throw new http_1.HttpError("Not found", http_1.HttpCode.NotFound);
                }
                switch (route.base) {
                    case "/":
                        switch (request.method) {
                            case "POST":
                                this.ensureMethod(request, ["GET", "POST"]);
                                return [2 /*return*/, this.tryLogin(route, request)];
                            default:
                                this.ensureMethod(request);
                                if (this.authenticated(request)) {
                                    return [2 /*return*/, {
                                            redirect: (Array.isArray(route.query.to) ? route.query.to[0] : route.query.to) || "/",
                                            query: { to: undefined },
                                        }];
                                }
                                return [2 /*return*/, this.getRoot(route)];
                        }
                }
                throw new http_1.HttpError("Not found", http_1.HttpCode.NotFound);
            });
        });
    };
    LoginHttpProvider.prototype.getRoot = function (route, error) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUtf8Resource(this.rootPath, "src/browser/pages/login.html")];
                    case 1:
                        response = _a.sent();
                        response.content = response.content.replace(/{{ERROR}}/, error ? "<div class=\"error\">" + error.message + "</div>" : "");
                        return [2 /*return*/, this.replaceTemplates(route, response)];
                }
            });
        });
    };
    /**
     * Try logging in. On failure, show the login page with an error.
     */
    LoginHttpProvider.prototype.tryLogin = function (route, request) {
        return __awaiter(this, void 0, void 0, function () {
            var providedPassword, data, payload, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        providedPassword = this.authenticated(request);
                        if (providedPassword) {
                            return [2 /*return*/, { code: http_1.HttpCode.Ok }];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.getData(request)];
                    case 2:
                        data = _a.sent();
                        payload = data ? querystring.parse(data) : {};
                        return [4 /*yield*/, this.login(payload, route, request)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_1 = _a.sent();
                        return [2 /*return*/, this.getRoot(route, error_1)];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Return a cookie if the user is authenticated otherwise throw an error.
     */
    LoginHttpProvider.prototype.login = function (payload, route, request) {
        return __awaiter(this, void 0, void 0, function () {
            var password;
            return __generator(this, function (_a) {
                password = this.authenticated(request, {
                    key: typeof payload.password === "string" ? [util_1.hash(payload.password)] : undefined,
                });
                if (password) {
                    return [2 /*return*/, {
                            redirect: (Array.isArray(route.query.to) ? route.query.to[0] : route.query.to) || "/",
                            query: { to: undefined },
                            cookie: typeof password === "string"
                                ? {
                                    key: "key",
                                    value: password,
                                    path: payload.base,
                                }
                                : undefined,
                        }];
                }
                // Only log if it was an actual login attempt.
                if (payload && payload.password) {
                    console.error("Failed login attempt", JSON.stringify({
                        xForwardedFor: request.headers["x-forwarded-for"],
                        remoteAddress: request.connection.remoteAddress,
                        userAgent: request.headers["user-agent"],
                        timestamp: Math.floor(new Date().getTime() / 1000),
                    }));
                    throw new Error("Incorrect password");
                }
                throw new Error("Missing password");
            });
        });
    };
    return LoginHttpProvider;
}(http_2.HttpProvider));
exports.LoginHttpProvider = LoginHttpProvider;
//# sourceMappingURL=login.js.map