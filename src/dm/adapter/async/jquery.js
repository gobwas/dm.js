var Async = require("../async"),
    jQuery;

jQuery = Async.extend({
    constructor: function() {
        Async.prototype.constructor.apply(this, arguments);
        this.jQuery = this.adaptee;
    },

    promise: function(resolver) {
        var deferred, resolve, reject;

        deferred = this.jQuery.Deferred();

        resolve = function(value) {
            deferred.resolve(value);
        };

        reject = function(error) {
            deferred.reject(error);
        };

        resolver(resolve, reject);

        return deferred.promise();
    },

    all: function(promises) {
        var deferred;

        deferred = this.jQuery.Deferred();

        this.jQuery.when.apply(this.jQuery, promises)
            .then(function() {
                var dones;

                dones = Array.prototype.slice.call(arguments);

                deferred.resolve(dones);
            })
            .fail(function(err) {
                deferred.reject(err);
            });


        return deferred.promise();
    },

    resolve: function(value) {
        var deferred;

        deferred = this.jQuery.Deferred();

        deferred.resolve(value);

        return deferred.promise();
    },

    reject: function(error) {
        var deferred;

        deferred = this.jQuery.Deferred();

        deferred.reject(error);

        return deferred.promise();
    }
});

module.exports = jQuery;