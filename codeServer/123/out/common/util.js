"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("@coder/logger");
/**
 * Split a string up to the delimiter. If the delimiter doesn't exist the first
 * item will have all the text and the second item will be an empty string.
 */
exports.split = function (str, delimiter) {
    var index = str.indexOf(delimiter);
    return index !== -1 ? [str.substring(0, index).trim(), str.substring(index + 1)] : [str, ""];
};
exports.plural = function (count) { return (count === 1 ? "" : "s"); };
exports.generateUuid = function (length) {
    if (length === void 0) { length = 24; }
    var possible = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    return Array(length)
        .fill(1)
        .map(function () { return possible[Math.floor(Math.random() * possible.length)]; })
        .join("");
};
/**
 * Remove extra slashes in a URL.
 */
exports.normalize = function (url, keepTrailing) {
    if (keepTrailing === void 0) { keepTrailing = false; }
    return url.replace(/\/\/+/g, "/").replace(/\/+$/, keepTrailing ? "/" : "");
};
/**
 * Get options embedded in the HTML or query params.
 */
exports.getOptions = function () {
    var options;
    try {
        var el = document.getElementById("coder-options");
        if (!el) {
            throw new Error("no options element");
        }
        var value = el.getAttribute("data-settings");
        if (!value) {
            throw new Error("no options value");
        }
        options = JSON.parse(value);
    }
    catch (error) {
        options = {};
    }
    var params = new URLSearchParams(location.search);
    var queryOpts = params.get("options");
    if (queryOpts) {
        options = __assign(__assign({}, options), JSON.parse(queryOpts));
    }
    if (typeof options.logLevel !== "undefined") {
        logger_1.logger.level = options.logLevel;
    }
    if (options.base) {
        var parts = location.pathname.replace(/^\//g, "").split("/");
        parts[parts.length - 1] = options.base;
        var url = new URL(location.origin + "/" + parts.join("/"));
        options.base = exports.normalize(url.pathname, true);
    }
    logger_1.logger.debug("got options", logger_1.field("options", options));
    return options;
};
//# sourceMappingURL=util.js.map