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
        return this.async.promise(function(resolve, reject) {
            fs.readFile(path, function(err, src) {
                if (err) {
                    reject(err);
                } else {
                    resolve(src);
                }
            });
        });
    }
});

module.exports = CJS;