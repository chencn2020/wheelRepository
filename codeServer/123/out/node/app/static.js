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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
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
var path = __importStar(require("path"));
var tarFs = __importStar(require("tar-fs"));
var zlib = __importStar(require("zlib"));
var http_1 = require("../http");
/**
 * Static file HTTP provider. Regular static requests (the path is the request
 * itself) do not require authentication and they only allow access to resources
 * within the application. Requests for tars (the path is in a query parameter)
 * do require permissions and can access any directory.
 */
var StaticHttpProvider = /** @class */ (function (_super) {
    __extends(StaticHttpProvider, _super);
    function StaticHttpProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StaticHttpProvider.prototype.handleRequest = function (route, request) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ensureMethod(request);
                        if (typeof route.query.tar === "string") {
                            this.ensureAuthenticated(request);
                            return [2 /*return*/, this.getTarredResource(request, route.query.tar)];
                        }
                        return [4 /*yield*/, this.getReplacedResource(route)];
                    case 1:
                        response = _a.sent();
                        if (!this.isDev) {
                            response.cache = true;
                        }
                        return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     * Return a resource with variables replaced where necessary.
     */
    StaticHttpProvider.prototype.getReplacedResource = function (route) {
        return __awaiter(this, void 0, void 0, function () {
            var split, _a, response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        split = route.requestPath.split("/").slice(1);
                        _a = split[split.length - 1];
                        switch (_a) {
                            case "manifest.json": return [3 /*break*/, 1];
                        }
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getUtf8Resource.apply(this, __spreadArrays([this.rootPath], split))];
                    case 2:
                        response = _b.sent();
                        return [2 /*return*/, this.replaceTemplates(route, response)];
                    case 3: return [2 /*return*/, this.getResource.apply(this, __spreadArrays([this.rootPath], split))];
                }
            });
        });
    };
    /**
     * Tar up and stream a directory.
     */
    StaticHttpProvider.prototype.getTarredResource = function (request) {
        var parts = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            parts[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var filePath, stream, headers, compress_1;
            return __generator(this, function (_a) {
                filePath = path.join.apply(path, parts);
                stream = tarFs.pack(filePath);
                headers = {};
                if (request.headers["accept-encoding"] && request.headers["accept-encoding"].includes("gzip")) {
                    logger_1.logger.debug("gzipping tar", logger_1.field("filePath", filePath));
                    compress_1 = zlib.createGzip();
                    stream.pipe(compress_1);
                    stream.on("error", function (error) { return compress_1.destroy(error); });
                    stream.on("close", function () { return compress_1.end(); });
                    stream = compress_1;
                    headers["content-encoding"] = "gzip";
                }
                return [2 /*return*/, { stream: stream, filePath: filePath, mime: "application/x-tar", cache: true, headers: headers }];
            });
        });
    };
    return StaticHttpProvider;
}(http_1.HttpProvider));
exports.StaticHttpProvider = StaticHttpProvider;
//# sourceMappingURL=static.js.map