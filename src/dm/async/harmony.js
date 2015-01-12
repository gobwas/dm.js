var Async = require("../async"),
    _      = require("lodash"),
    HarmonyAsync;

/**
 * HarmonyAsync
 *
 * @class HarmonyAsync
 * @extends Async
 * @author Sergey Kamardin <s.kamardin@tcsbank.ru>
 */
HarmonyAsync = Async.extend(
    /**
     * @lends HarmonyAsync.prototype
     */
    {
        constructor: function() {
            Async.prototype.constructor.apply(this, arguments);
            this.Promise = this.adaptee || Promise;
        },

        promise: function(resolver) {
            return new this.Promise(resolver);
        },

        all: function(promises) {
            return this.Promise.all(promises);
        },

        resolve: function(value) {
            return this.Promise.resolve(value);
        },

        reject: function(error) {
            return this.Promise.reject(error);
        }
    }
);

module.exports = HarmonyAsync;