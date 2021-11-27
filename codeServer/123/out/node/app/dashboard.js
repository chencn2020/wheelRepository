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
var util_1 = require("../../common/util");
var http_2 = require("../http");
/**
 * Dashboard HTTP provider.
 */
var DashboardHttpProvider = /** @class */ (function (_super) {
    __extends(DashboardHttpProvider, _super);
    function DashboardHttpProvider(options, api, update) {
        var _this = _super.call(this, options) || this;
        _this.api = api;
        _this.update = update;
        return _this;
    }
    DashboardHttpProvider.prototype.handleRequest = function (route, request) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, app;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.isRoot(route)) {
                            throw new http_1.HttpError("Not found", http_1.HttpCode.NotFound);
                        }
                        _a = route.base;
                        switch (_a) {
                            case "/spawn": return [3 /*break*/, 1];
                            case "/app": return [3 /*break*/, 3];
                            case "/": return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 4];
                    case 1:
                        this.ensureAuthenticated(request);
                        this.ensureMethod(request, "POST");
                        return [4 /*yield*/, this.getData(request)];
                    case 2:
                        data = _b.sent();
                        app = data ? querystring.parse(data) : {};
                        if (app.path) {
                            return [2 /*return*/, { redirect: Array.isArray(app.path) ? app.path[0] : app.path }];
                        }
                        if (!app.exec) {
                            throw new Error("No exec was provided");
                        }
                        this.api.spawnProcess(Array.isArray(app.exec) ? app.exec[0] : app.exec);
                        return [2 /*return*/, { redirect: this.options.base }];
                    case 3:
                        {
                            this.ensureMethod(request);
                            if (!this.authenticated(request)) {
                                return [2 /*return*/, { redirect: "/login", query: { to: this.options.base } }];
                            }
                            return [2 /*return*/, route.base === "/" ? this.getRoot(route) : this.getAppRoot(route)];
                        }
                        _b.label = 4;
                    case 4: throw new http_1.HttpError("Not found", http_1.HttpCode.NotFound);
                }
            });
        });
    };
    DashboardHttpProvider.prototype.getRoot = function (route) {
        return __awaiter(this, void 0, void 0, function () {
            var base, apps, response, _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        base = this.base(route);
                        return [4 /*yield*/, this.api.installedApplications()];
                    case 1:
                        apps = _e.sent();
                        return [4 /*yield*/, this.getUtf8Resource(this.rootPath, "src/browser/pages/home.html")];
                    case 2:
                        response = _e.sent();
                        _a = response;
                        _c = (_b = response.content).replace;
                        _d = [/{{UPDATE:NAME}}/];
                        return [4 /*yield*/, this.getUpdate(base)];
                    case 3:
                        _a.content = _c.apply(_b, _d.concat([_e.sent()]))
                            .replace(/{{APP_LIST:EDITORS}}/, this.getAppRows(base, apps.filter(function (app) { return app.categories && app.categories.includes("Editor"); })))
                            .replace(/{{APP_LIST:OTHER}}/, this.getAppRows(base, apps.filter(function (app) { return !app.categories || !app.categories.includes("Editor"); })));
                        return [2 /*return*/, this.replaceTemplates(route, response)];
                }
            });
        });
    };
    DashboardHttpProvider.prototype.getAppRoot = function (route) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUtf8Resource(this.rootPath, "src/browser/pages/app.html")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, this.replaceTemplates(route, response)];
                }
            });
        });
    };
    DashboardHttpProvider.prototype.getAppRows = function (base, apps) {
        var _this = this;
        return apps.length > 0
            ? apps.map(function (app) { return _this.getAppRow(base, app); }).join("\n")
            : "<div class=\"none\">No applications found.</div>";
    };
    DashboardHttpProvider.prototype.getAppRow = function (base, app) {
        return "<form class=\"block-row" + (app.exec ? " -x11" : "") + "\" method=\"post\" action=\"" + util_1.normalize("" + base + this.options.base + "/spawn") + "\">\n      <button class=\"item -row -link\">\n        <input type=\"hidden\" name=\"path\" value=\"" + (app.path || "") + "\">\n        <input type=\"hidden\" name=\"exec\" value=\"" + (app.exec || "") + "\">\n        " + (app.icon
            ? "<img class=\"icon\" src=\"data:image/png;base64," + app.icon + "\"></img>"
            : "<span class=\"icon -missing\"></span>") + "\n        <span class=\"name\">" + app.name + "</span>\n      </button>\n    </form>";
    };
    DashboardHttpProvider.prototype.getUpdate = function (base) {
        return __awaiter(this, void 0, void 0, function () {
            var humanize, update;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.update.enabled) {
                            return [2 /*return*/, "<div class=\"block-row\"><div class=\"item\"><div class=\"sub\">Updates are disabled</div></div></div>"];
                        }
                        humanize = function (time) {
                            var d = new Date(time);
                            var pad = function (t) { return (t < 10 ? "0" : "") + t; };
                            return (d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) +
                                (" " + pad(d.getHours()) + ":" + pad(d.getMinutes())));
                        };
                        return [4 /*yield*/, this.update.getUpdate()];
                    case 1:
                        update = _a.sent();
                        if (this.update.isLatestVersion(update)) {
                            return [2 /*return*/, "<div class=\"block-row\">\n        <div class=\"item\">\n          Latest: " + update.version + "\n          <div class=\"sub\">Up to date</div>\n        </div>\n        <div class=\"item\">\n          " + humanize(update.checked) + "\n          <a class=\"sub -link\" href=\"" + base + "/update/check?to=" + this.options.base + "\">Check now</a>\n        </div>\n        <div class=\"item\" >Current: " + this.update.currentVersion + "</div>\n      </div>"];
                        }
                        return [2 /*return*/, "<div class=\"block-row\">\n      <div class=\"item\">\n        Latest: " + update.version + "\n        <div class=\"sub\">Out of date</div>\n      </div>\n      <div class=\"item\">\n        " + humanize(update.checked) + "\n        <a class=\"sub -link\" href=\"" + base + "/update?to=" + this.options.base + "\">Update now</a>\n      </div>\n      <div class=\"item\" >Current: " + this.update.currentVersion + "</div>\n    </div>"];
                }
            });
        });
    };
    return DashboardHttpProvider;
}(http_2.HttpProvider));
exports.DashboardHttpProvider = DashboardHttpProvider;
//# sourceMappingURL=dashboard.js.map