"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Emitter typecasts for a single event type.
 */
var Emitter = /** @class */ (function () {
    function Emitter() {
        this.listeners = [];
    }
    Object.defineProperty(Emitter.prototype, "event", {
        get: function () {
            var _this = this;
            return function (cb) {
                _this.listeners.push(cb);
                return {
                    dispose: function () {
                        var i = _this.listeners.indexOf(cb);
                        if (i !== -1) {
                            _this.listeners.splice(i, 1);
                        }
                    },
                };
            };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Emit an event with a value.
     */
    Emitter.prototype.emit = function (value) {
        this.listeners.forEach(function (cb) { return cb(value); });
    };
    Emitter.prototype.dispose = function () {
        this.listeners = [];
    };
    return Emitter;
}());
exports.Emitter = Emitter;
//# sourceMappingURL=emitter.js.map