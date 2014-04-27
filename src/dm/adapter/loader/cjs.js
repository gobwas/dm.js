var Loader = require("../loader"),
    fs     = require("fs"),
    CJS;

CJS = Loader.extend({
    require: function(path) {
        return this.async.promise(function(resolve, reject) {
            try {
                resolve(require(path));
            } catch (err) {
                reject(err);
            }
        });
    },

    read: function(path) {
        var self = this;

        // todo is this hack for client-side loading? (i.e. browserify building)
        // todo maybe need to use browserify features to stub 'fs' module
        return this.require(path)
            ['catch'](function() {
                return self.async.promise(function(resolve, reject) {
                    fs.readFile(path, function(err, src) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(src);
                        }
                    });
                });
            });
    }
});

module.exports = CJS;