var StringParser = require("../string"),
    _            = require("../../utils"),
    TemplateStringParser;

/**
 * TemplateStringParser
 *
 * @class
 * @extends StringParser
 */
TemplateStringParser = StringParser.extend(
    /**
     * @lends TemplateStringParser.prototype
     */
    {
        parse: function(str) {
            var self = this;

            return this.async.promise(function(resolve, reject) {
                _.async.map(
                    self._execMultiple(str),
                    function(match, next) {
                        self._make(match)
                            .then(function(result) {
                                next(null, { match: match[0], result: result });
                            })
                            .catch(function(err) {
                                next(err);
                            });
                    },
                    function(err, result) {
                        if (err) {
                            reject(err);
                            return;
                        }

                        result = _.reduce(result, function(memo, def) {
                            var obj, string, from, to;

                            obj    = def.result;
                            string = _.isString(obj) ? obj : obj.toString();

                            from = memo.indexOf(def.match);
                            to   = from + def.match.length;

                            memo = memo.substr(0, from) + string + memo.substr(to);

                            return memo;
                        }, str);

                        resolve(result);
                    }
                )
            });
        },

        _make: function(match) {
            throw new Error("Method '_make' must be implemented");
        }
    }
);

module.exports = TemplateStringParser;