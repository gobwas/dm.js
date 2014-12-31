var StringParser = require("../string"),
    _            = require("../../utils"),
    MultipleStringParser;

/**
 * MultipleStringParser
 *
 * @class MultipleStringParser
 * @extends StringParser
 * @author Sergey Kamardin <s.kamardin@tcsbank.ru>
 */
MultipleStringParser = StringParser.extend(
    /**
     * @lends MultipleStringParser.prototype
     */
    {
        parse: function(str) {
            var self = this;

            return this.async.promise(function(resolve, reject) {
                _.async.map(
                    self.template.all(str),
                    function(obj, index, next) {
                        self.provider.get(obj.definition)
                            .then(function(result) {
                                next(null, { match: obj.match, result: result });
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
                            var from, to;

                            from = memo.indexOf(def.match);
                            to   = from + def.match.length;

                            memo = memo.substr(0, from) + def.result + memo.substr(to);

                            return memo;
                        }, str);

                        resolve(result);
                    }
                );
            });
        }
    }
);

module.exports = MultipleStringParser;