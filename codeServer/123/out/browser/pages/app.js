"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../common/util");
var http_1 = require("../../common/http");
require("./error.css");
require("./global.css");
require("./home.css");
require("./login.css");
require("./update.css");
var options = util_1.getOptions();
var isInput = function (el) {
    return !!el.name;
};
document.querySelectorAll("form").forEach(function (form) {
    if (!form.classList.contains("-x11")) {
        return;
    }
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        var values = {};
        Array.from(form.elements).forEach(function (element) {
            if (isInput(element)) {
                values[element.name] = element.value;
            }
        });
        fetch(util_1.normalize(options.base + "/api/" + http_1.ApiEndpoint.process), {
            method: "POST",
            body: JSON.stringify(values),
        });
    });
});
// TEMP: Until we can get the real ready event.
var event = new CustomEvent("ide-ready");
window.dispatchEvent(event);
//# sourceMappingURL=app.js.map