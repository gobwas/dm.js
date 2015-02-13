var Async = require("../async"),
    _      = require("../utils"),
    BroodyPromisesAsync;

/**
 * BroodyPromisesAsync
 *
 * @class BroodyPromisesAsync
 * @extends Async
 * @author Sergey Kamardin <s.kamardin@tcsbank.ru>
 */
BroodyPromisesAsync = Async.extend(
    /**
     * @lends BroodyPromisesAsync.prototype
     */
    {
        constructor: function() {
            Async.prototype.constructor.apply(this, arguments);
            this.BroodyPromise = this.adaptee;
        },

        promise: function(resolver) {
            return new this.BroodyPromise(resolver);
        },

        all: function(promises) {
            return this.BroodyPromise.all(promises);
        },

        resolve: function(value) {
            return this.BroodyPromise.resolve(value);
        },

        reject: function(error) {
            return this.BroodyPromise.reject(error);
        }
    }
);

module.exports = BroodyPromisesAsync;
