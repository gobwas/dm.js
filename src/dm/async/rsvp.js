var Async = require("../async"),
    _      = require("lodash"),
    RSVPAsync;

/**
 * RSVPAsync
 *
 * @class RSVPAsync
 * @extends Async
 * @author Sergey Kamardin <s.kamardin@tcsbank.ru>
 */
RSVPAsync = Async.extend(
    /**
     * @lends RSVPAsync.prototype
     */
    {
        constructor: function() {
            Async.prototype.constructor.apply(this, arguments);
            this.RSVP = this.adaptee;
        },

        promise: function(resolver) {
            return new this.RSVP.Promise(resolver);
        },

        all: function(promises) {
            return this.RSVP.all(promises);
        },

        resolve: function(value) {
            return this.RSVP.Promise.resolve(value);
        },

        reject: function(error) {
            return this.RSVP.Promise.reject(error);
        }
    }
);

module.exports = RSVPAsync;
