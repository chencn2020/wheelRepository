"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../common/util");
var options = util_1.getOptions();
if ("serviceWorker" in navigator) {
    var path = util_1.normalize(options.base + "/static/" + options.commit + "/dist/serviceWorker.js");
    navigator.serviceWorker
        .register(path, {
        scope: options.base || "/",
    })
        .then(function () {
        console.log("[Service Worker] registered");
    });
}
//# sourceMappingURL=register.js.map