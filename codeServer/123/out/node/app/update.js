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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
var adm_zip_1 = __importDefault(require("adm-zip"));
var cp = __importStar(require("child_process"));
var fs = __importStar(require("fs-extra"));
var http = __importStar(require("http"));
var https = __importStar(require("https"));
var os = __importStar(require("os"));
var path = __importStar(require("path"));
var semver = __importStar(require("semver"));
var tar = __importStar(require("tar-fs"));
var url = __importStar(require("url"));
var util = __importStar(require("util"));
var zlib = __importStar(require("zlib"));
var http_1 = require("../../common/http");
var http_2 = require("../http");
var settings_1 = require("../settings");
var util_1 = require("../util");
var wrapper_1 = require("../wrapper");
/**
 * Update HTTP provider.
 */
var UpdateHttpProvider = /** @class */ (function (_super) {
    __extends(UpdateHttpProvider, _super);
    function UpdateHttpProvider(options, enabled, 
    /**
     * The URL for getting the latest version of code-server. Should return JSON
     * that fulfills `LatestResponse`.
     */
    latestUrl, 
    /**
     * The URL for downloading a version of code-server. {{VERSION}} and
     * {{RELEASE_NAME}} will be replaced (for example 2.1.0 and
     * code-server-2.1.0-linux-x86_64.tar.gz).
     */
    downloadUrl, 
    /**
     * Update information will be stored here. If not provided, the global
     * settings will be used.
     */
    settings) {
        if (latestUrl === void 0) { latestUrl = "https://api.github.com/repos/cdr/code-server/releases/latest"; }
        if (downloadUrl === void 0) { downloadUrl = "https://github.com/cdr/code-server/releases/download/{{VERSION}}/{{RELEASE_NAME}}"; }
        if (settings === void 0) { settings = settings_1.settings; }
        var _this = _super.call(this, options) || this;
        _this.enabled = enabled;
        _this.latestUrl = latestUrl;
        _this.downloadUrl = downloadUrl;
        _this.settings = settings;
        _this.updateInterval = 1000 * 60 * 60 * 24; // Milliseconds between update checks.
        return _this;
    }
    UpdateHttpProvider.prototype.handleRequest = function (route, request) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.ensureAuthenticated(request);
                this.ensureMethod(request);
                if (!this.isRoot(route)) {
                    throw new http_1.HttpError("Not found", http_1.HttpCode.NotFound);
                }
                switch (route.base) {
                    case "/check":
                        this.getUpdate(true);
                        if (route.query && route.query.to) {
                            return [2 /*return*/, {
                                    redirect: Array.isArray(route.query.to) ? route.query.to[0] : route.query.to,
                                    query: { to: undefined },
                                }];
                        }
                        return [2 /*return*/, this.getRoot(route, request)];
                    case "/apply":
                        return [2 /*return*/, this.tryUpdate(route, request)];
                    case "/":
                        return [2 /*return*/, this.getRoot(route, request)];
                }
                throw new http_1.HttpError("Not found", http_1.HttpCode.NotFound);
            });
        });
    };
    UpdateHttpProvider.prototype.getRoot = function (route, request, appliedUpdate, error) {
        return __awaiter(this, void 0, void 0, function () {
            var update, response, _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!(request.headers["content-type"] === "application/json")) return [3 /*break*/, 2];
                        if (!this.enabled) {
                            return [2 /*return*/, {
                                    content: {
                                        isLatest: true,
                                    },
                                }];
                        }
                        return [4 /*yield*/, this.getUpdate()];
                    case 1:
                        update = _f.sent();
                        return [2 /*return*/, {
                                content: __assign(__assign({}, update), { isLatest: this.isLatestVersion(update) }),
                            }];
                    case 2: return [4 /*yield*/, this.getUtf8Resource(this.rootPath, "src/browser/pages/update.html")];
                    case 3:
                        response = _f.sent();
                        _a = response;
                        _c = (_b = response.content).replace;
                        _d = [/{{UPDATE_STATUS}}/];
                        if (!appliedUpdate) return [3 /*break*/, 4];
                        _e = "Updated to " + appliedUpdate;
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.getUpdateHtml()];
                    case 5:
                        _e = _f.sent();
                        _f.label = 6;
                    case 6:
                        _a.content = _c.apply(_b, _d.concat([_e]))
                            .replace(/{{ERROR}}/, error ? "<div class=\"error\">" + error.message + "</div>" : "");
                        return [2 /*return*/, this.replaceTemplates(route, response)];
                }
            });
        });
    };
    /**
     * Query for and return the latest update.
     */
    UpdateHttpProvider.prototype.getUpdate = function (force) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!this.enabled) {
                    throw new Error("updates are not enabled");
                }
                // Don't run multiple requests at a time.
                if (!this.update) {
                    this.update = this._getUpdate(force);
                    this.update.then(function () { return (_this.update = undefined); });
                }
                return [2 /*return*/, this.update];
            });
        });
    };
    UpdateHttpProvider.prototype._getUpdate = function (force) {
        return __awaiter(this, void 0, void 0, function () {
            var now, update, _a, buffer, data, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        now = Date.now();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 8, , 9]);
                        if (!!force) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.settings.read()];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = { update: undefined };
                        _b.label = 4;
                    case 4:
                        update = (_a).update;
                        if (!(!update || update.checked + this.updateInterval < now)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.request(this.latestUrl)];
                    case 5:
                        buffer = _b.sent();
                        data = JSON.parse(buffer.toString());
                        update = { checked: now, version: data.name };
                        return [4 /*yield*/, this.settings.write({ update: update })];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7:
                        logger_1.logger.debug("got latest version", logger_1.field("latest", update.version));
                        return [2 /*return*/, update];
                    case 8:
                        error_1 = _b.sent();
                        logger_1.logger.error("Failed to get latest version", logger_1.field("error", error_1.message));
                        return [2 /*return*/, {
                                checked: now,
                                version: "unknown",
                            }];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(UpdateHttpProvider.prototype, "currentVersion", {
        get: function () {
            return require(path.resolve(__dirname, "../../../package.json")).version;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Return true if the currently installed version is the latest.
     */
    UpdateHttpProvider.prototype.isLatestVersion = function (latest) {
        var version = this.currentVersion;
        logger_1.logger.debug("comparing versions", logger_1.field("current", version), logger_1.field("latest", latest.version));
        try {
            return latest.version === version || semver.lt(latest.version, version);
        }
        catch (error) {
            return true;
        }
    };
    UpdateHttpProvider.prototype.getUpdateHtml = function () {
        return __awaiter(this, void 0, void 0, function () {
            var update;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.enabled) {
                            return [2 /*return*/, "Updates are disabled"];
                        }
                        return [4 /*yield*/, this.getUpdate()];
                    case 1:
                        update = _a.sent();
                        if (this.isLatestVersion(update)) {
                            return [2 /*return*/, "No update available"];
                        }
                        return [2 /*return*/, "<button type=\"submit\" class=\"apply -button\">Update to " + update.version + "</button>"];
                }
            });
        });
    };
    UpdateHttpProvider.prototype.tryUpdate = function (route, request) {
        return __awaiter(this, void 0, void 0, function () {
            var update, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.getUpdate()];
                    case 1:
                        update = _a.sent();
                        if (!!this.isLatestVersion(update)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.downloadAndApplyUpdate(update)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this.getRoot(route, request, update.version)];
                    case 3: return [2 /*return*/, this.getRoot(route, request)];
                    case 4:
                        error_2 = _a.sent();
                        return [2 /*return*/, this.getRoot(route, request, undefined, error_2)];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UpdateHttpProvider.prototype.downloadAndApplyUpdate = function (update, targetPath) {
        return __awaiter(this, void 0, void 0, function () {
            var releaseName, url, downloadPath, response, directoryPath, backupPath, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getReleaseName(update)];
                    case 1:
                        releaseName = _a.sent();
                        url = this.downloadUrl.replace("{{VERSION}}", update.version).replace("{{RELEASE_NAME}}", releaseName);
                        downloadPath = path.join(util_1.tmpdir, "updates", releaseName);
                        fs.mkdirp(path.dirname(downloadPath));
                        return [4 /*yield*/, this.requestResponse(url)];
                    case 2:
                        response = _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 12, , 13]);
                        if (!downloadPath.endsWith(".tar.gz")) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.extractTar(response, downloadPath)];
                    case 4:
                        downloadPath = _a.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.extractZip(response, downloadPath)];
                    case 6:
                        downloadPath = _a.sent();
                        _a.label = 7;
                    case 7:
                        logger_1.logger.debug("Downloaded update", logger_1.field("path", downloadPath));
                        directoryPath = path.join(downloadPath, path.basename(downloadPath));
                        return [4 /*yield*/, fs.stat(directoryPath)];
                    case 8:
                        _a.sent();
                        if (!targetPath) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            targetPath = path.resolve(__dirname, "../../../");
                        }
                        backupPath = path.resolve(targetPath, "../" + path.basename(targetPath) + "." + Date.now().toString());
                        logger_1.logger.debug("Replacing files", logger_1.field("target", targetPath), logger_1.field("backup", backupPath));
                        return [4 /*yield*/, fs.move(targetPath, backupPath)
                            // Move the new directory.
                        ];
                    case 9:
                        _a.sent();
                        // Move the new directory.
                        return [4 /*yield*/, fs.move(directoryPath, targetPath)];
                    case 10:
                        // Move the new directory.
                        _a.sent();
                        return [4 /*yield*/, fs.remove(downloadPath)];
                    case 11:
                        _a.sent();
                        if (process.send) {
                            wrapper_1.ipcMain().relaunch(update.version);
                        }
                        return [3 /*break*/, 13];
                    case 12:
                        error_3 = _a.sent();
                        response.destroy(error_3);
                        throw error_3;
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    UpdateHttpProvider.prototype.extractTar = function (response, downloadPath) {
        return __awaiter(this, void 0, void 0, function () {
            var decompress, destination;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        downloadPath = downloadPath.replace(/\.tar\.gz$/, "");
                        logger_1.logger.debug("Extracting tar", logger_1.field("path", downloadPath));
                        response.pause();
                        return [4 /*yield*/, fs.remove(downloadPath)];
                    case 1:
                        _a.sent();
                        decompress = zlib.createGunzip();
                        response.pipe(decompress);
                        response.on("error", function (error) { return decompress.destroy(error); });
                        response.on("close", function () { return decompress.end(); });
                        destination = tar.extract(downloadPath);
                        decompress.pipe(destination);
                        decompress.on("error", function (error) { return destination.destroy(error); });
                        decompress.on("close", function () { return destination.end(); });
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                destination.on("finish", resolve);
                                destination.on("error", reject);
                                response.resume();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, downloadPath];
                }
            });
        });
    };
    UpdateHttpProvider.prototype.extractZip = function (response, downloadPath) {
        return __awaiter(this, void 0, void 0, function () {
            var write, zipPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger_1.logger.debug("Downloading zip", logger_1.field("path", downloadPath));
                        response.pause();
                        return [4 /*yield*/, fs.remove(downloadPath)];
                    case 1:
                        _a.sent();
                        write = fs.createWriteStream(downloadPath);
                        response.pipe(write);
                        response.on("error", function (error) { return write.destroy(error); });
                        response.on("close", function () { return write.end(); });
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                write.on("error", reject);
                                write.on("close", resolve);
                                response.resume;
                            })];
                    case 2:
                        _a.sent();
                        zipPath = downloadPath;
                        downloadPath = downloadPath.replace(/\.zip$/, "");
                        return [4 /*yield*/, fs.remove(downloadPath)];
                    case 3:
                        _a.sent();
                        logger_1.logger.debug("Extracting zip", logger_1.field("path", zipPath));
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                new adm_zip_1.default(zipPath).extractAllToAsync(downloadPath, true, function (error) {
                                    return error ? reject(error) : resolve();
                                });
                            })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, fs.remove(zipPath)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, downloadPath];
                }
            });
        });
    };
    /**
     * Given an update return the name for the packaged archived.
     */
    UpdateHttpProvider.prototype.getReleaseName = function (update) {
        return __awaiter(this, void 0, void 0, function () {
            var target, result, arch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        target = os.platform();
                        if (!(target === "linux")) return [3 /*break*/, 2];
                        return [4 /*yield*/, util
                                .promisify(cp.exec)("ldd --version")
                                .catch(function (error) { return ({
                                stderr: error.message,
                                stdout: "",
                            }); })];
                    case 1:
                        result = _a.sent();
                        if (/musl/.test(result.stderr) || /musl/.test(result.stdout)) {
                            target = "alpine";
                        }
                        _a.label = 2;
                    case 2:
                        arch = os.arch();
                        if (arch === "x64") {
                            arch = "x86_64";
                        }
                        return [2 /*return*/, "code-server-" + update.version + "-" + target + "-" + arch + "." + (target === "darwin" ? "zip" : "tar.gz")];
                }
            });
        });
    };
    UpdateHttpProvider.prototype.request = function (uri) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestResponse(uri)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                var chunks = [];
                                var bufferLength = 0;
                                response.on("data", function (chunk) {
                                    bufferLength += chunk.length;
                                    chunks.push(chunk);
                                });
                                response.on("error", reject);
                                response.on("end", function () {
                                    resolve(Buffer.concat(chunks, bufferLength));
                                });
                            })];
                }
            });
        });
    };
    UpdateHttpProvider.prototype.requestResponse = function (uri) {
        return __awaiter(this, void 0, void 0, function () {
            var redirects, maxRedirects;
            return __generator(this, function (_a) {
                redirects = 0;
                maxRedirects = 10;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var request = function (uri) {
                            logger_1.logger.debug("Making request", logger_1.field("uri", uri));
                            var httpx = uri.startsWith("https") ? https : http;
                            var client = httpx.get(uri, { headers: { "User-Agent": "code-server" } }, function (response) {
                                if (response.statusCode &&
                                    response.statusCode >= 300 &&
                                    response.statusCode < 400 &&
                                    response.headers.location) {
                                    ++redirects;
                                    if (redirects > maxRedirects) {
                                        return reject(new Error("reached max redirects"));
                                    }
                                    response.destroy();
                                    return request(url.resolve(uri, response.headers.location));
                                }
                                if (!response.statusCode || response.statusCode < 200 || response.statusCode >= 400) {
                                    return reject(new Error("" + (response.statusCode || "500")));
                                }
                                resolve(response);
                            });
                            client.on("error", reject);
                        };
                        request(uri);
                    })];
            });
        });
    };
    return UpdateHttpProvider;
}(http_2.HttpProvider));
exports.UpdateHttpProvider = UpdateHttpProvider;
//# sourceMappingURL=update.js.map