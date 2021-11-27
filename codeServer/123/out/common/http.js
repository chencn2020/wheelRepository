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
Object.defineProperty(exports, "__esModule", { value: true });
var HttpCode;
(function (HttpCode) {
    HttpCode[HttpCode["Ok"] = 200] = "Ok";
    HttpCode[HttpCode["Redirect"] = 302] = "Redirect";
    HttpCode[HttpCode["NotFound"] = 404] = "NotFound";
    HttpCode[HttpCode["BadRequest"] = 400] = "BadRequest";
    HttpCode[HttpCode["Unauthorized"] = 401] = "Unauthorized";
    HttpCode[HttpCode["LargePayload"] = 413] = "LargePayload";
    HttpCode[HttpCode["ServerError"] = 500] = "ServerError";
})(HttpCode = exports.HttpCode || (exports.HttpCode = {}));
var HttpError = /** @class */ (function (_super) {
    __extends(HttpError, _super);
    function HttpError(message, code) {
        var _this = _super.call(this, message) || this;
        _this.code = code;
        _this.name = _this.constructor.name;
        return _this;
    }
    return HttpError;
}(Error));
exports.HttpError = HttpError;
var ApiEndpoint;
(function (ApiEndpoint) {
    ApiEndpoint["applications"] = "/applications";
    ApiEndpoint["process"] = "/process";
    ApiEndpoint["recent"] = "/recent";
    ApiEndpoint["run"] = "/run";
    ApiEndpoint["status"] = "/status";
})(ApiEndpoint = exports.ApiEndpoint || (exports.ApiEndpoint = {}));
//# sourceMappingURL=http.js.map