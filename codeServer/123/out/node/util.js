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
var cp = __importStar(require("child_process"));
var crypto = __importStar(require("crypto"));
var fs = __importStar(require("fs-extra"));
var os = __importStar(require("os"));
var path = __importStar(require("path"));
var util = __importStar(require("util"));
exports.tmpdir = path.join(os.tmpdir(), "code-server");
var getXdgDataDir = function () {
    switch (process.platform) {
        case "win32":
            return path.join(process.env.XDG_DATA_HOME || path.join(os.homedir(), "AppData/Local"), "code-server/Data");
        case "darwin":
            return path.join(process.env.XDG_DATA_HOME || path.join(os.homedir(), "Library/Application Support"), "code-server");
        default:
            return path.join(process.env.XDG_DATA_HOME || path.join(os.homedir(), ".local/share"), "code-server");
    }
};
exports.xdgLocalDir = getXdgDataDir();
exports.generateCertificate = function () { return __awaiter(void 0, void 0, void 0, function () {
    var paths, checks, pem_1, certs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                paths = {
                    cert: path.join(exports.tmpdir, "self-signed.cert"),
                    certKey: path.join(exports.tmpdir, "self-signed.key"),
                };
                return [4 /*yield*/, Promise.all([fs.pathExists(paths.cert), fs.pathExists(paths.certKey)])];
            case 1:
                checks = _a.sent();
                if (!(!checks[0] || !checks[1])) return [3 /*break*/, 5];
                pem_1 = require("pem");
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        pem_1.createCertificate({ selfSigned: true }, function (error, result) {
                            return error ? reject(error) : resolve(result);
                        });
                    })];
            case 2:
                certs = _a.sent();
                return [4 /*yield*/, fs.mkdirp(exports.tmpdir)];
            case 3:
                _a.sent();
                return [4 /*yield*/, Promise.all([fs.writeFile(paths.cert, certs.certificate), fs.writeFile(paths.certKey, certs.serviceKey)])];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [2 /*return*/, paths];
        }
    });
}); };
exports.generateSshHostKey = function () { return __awaiter(void 0, void 0, void 0, function () {
    var certKey;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.generateCertificate()];
            case 1:
                certKey = (_a.sent()).certKey;
                return [2 /*return*/, certKey];
        }
    });
}); };
exports.generatePassword = function (length) {
    if (length === void 0) { length = 24; }
    return __awaiter(void 0, void 0, void 0, function () {
        var buffer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    buffer = Buffer.alloc(Math.ceil(length / 2));
                    return [4 /*yield*/, util.promisify(crypto.randomFill)(buffer)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, buffer.toString("hex").substring(0, length)];
            }
        });
    });
};
exports.hash = function (str) {
    return crypto
        .createHash("sha256")
        .update(str)
        .digest("hex");
};
var mimeTypes = {
    ".aac": "audio/x-aac",
    ".avi": "video/x-msvideo",
    ".bmp": "image/bmp",
    ".css": "text/css",
    ".flv": "video/x-flv",
    ".gif": "image/gif",
    ".html": "text/html",
    ".ico": "image/x-icon",
    ".jpe": "image/jpg",
    ".jpeg": "image/jpg",
    ".jpg": "image/jpg",
    ".js": "application/javascript",
    ".json": "application/json",
    ".m1v": "video/mpeg",
    ".m2a": "audio/mpeg",
    ".m2v": "video/mpeg",
    ".m3a": "audio/mpeg",
    ".mid": "audio/midi",
    ".midi": "audio/midi",
    ".mk3d": "video/x-matroska",
    ".mks": "video/x-matroska",
    ".mkv": "video/x-matroska",
    ".mov": "video/quicktime",
    ".movie": "video/x-sgi-movie",
    ".mp2": "audio/mpeg",
    ".mp2a": "audio/mpeg",
    ".mp3": "audio/mpeg",
    ".mp4": "video/mp4",
    ".mp4a": "audio/mp4",
    ".mp4v": "video/mp4",
    ".mpe": "video/mpeg",
    ".mpeg": "video/mpeg",
    ".mpg": "video/mpeg",
    ".mpg4": "video/mp4",
    ".mpga": "audio/mpeg",
    ".oga": "audio/ogg",
    ".ogg": "audio/ogg",
    ".ogv": "video/ogg",
    ".png": "image/png",
    ".psd": "image/vnd.adobe.photoshop",
    ".qt": "video/quicktime",
    ".spx": "audio/ogg",
    ".svg": "image/svg+xml",
    ".tga": "image/x-tga",
    ".tif": "image/tiff",
    ".tiff": "image/tiff",
    ".txt": "text/plain",
    ".wav": "audio/x-wav",
    ".wasm": "application/wasm",
    ".webm": "video/webm",
    ".webp": "image/webp",
    ".wma": "audio/x-ms-wma",
    ".wmv": "video/x-ms-wmv",
    ".woff": "application/font-woff",
};
exports.getMediaMime = function (filePath) {
    return (filePath && mimeTypes[path.extname(filePath)]) || "text/plain";
};
exports.isWsl = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = (process.platform === "linux" &&
                    os
                        .release()
                        .toLowerCase()
                        .indexOf("microsoft") !== -1);
                if (_a) return [3 /*break*/, 2];
                return [4 /*yield*/, fs.readFile("/proc/version", "utf8")];
            case 1:
                _a = (_b.sent()).toLowerCase().indexOf("microsoft") !== -1;
                _b.label = 2;
            case 2: return [2 /*return*/, (_a)];
        }
    });
}); };
/**
 * Try opening a URL using whatever the system has set for opening URLs.
 */
exports.open = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var args, options, platform, command, proc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                args = [];
                options = {};
                return [4 /*yield*/, exports.isWsl()];
            case 1:
                platform = (_a.sent()) ? "wsl" : process.platform;
                command = platform === "darwin" ? "open" : "xdg-open";
                if (platform === "win32" || platform === "wsl") {
                    command = platform === "wsl" ? "cmd.exe" : "cmd";
                    args.push("/c", "start", '""', "/b");
                    url = url.replace(/&/g, "^&");
                }
                proc = cp.spawn(command, __spreadArrays(args, [url]), options);
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        proc.on("error", reject);
                        proc.on("close", function (code) {
                            return code !== 0 ? reject(new Error("Failed to open with code " + code)) : resolve();
                        });
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
/**
 * For iterating over an enum's values.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
exports.enumToArray = function (t) {
    var values = [];
    for (var k in t) {
        values.push(t[k]);
    }
    return values;
};
/**
 * For displaying all allowed options in an enum.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
exports.buildAllowedMessage = function (t) {
    var values = exports.enumToArray(t);
    return "Allowed value" + (values.length === 1 ? " is" : "s are") + " " + values.map(function (t) { return "'" + t + "'"; }).join(", ");
};
exports.isObject = function (obj) {
    return !Array.isArray(obj) && typeof obj === "object" && obj !== null;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extend() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var c = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
        var obj = args_1[_a];
        if (!exports.isObject(obj)) {
            continue;
        }
        for (var key in obj) {
            c[key] = exports.isObject(obj[key]) ? extend(c[key], obj[key]) : obj[key];
        }
    }
    return c;
}
exports.extend = extend;
//# sourceMappingURL=util.js.map