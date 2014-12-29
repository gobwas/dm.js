var StringParser = require("../string"),
    _            = require("lodash"),
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
                        self.builder.make(obj.definition)
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



            this.template.exec(str).map(function(definition) {
                return this.builder.get(definition);
            });
        }
    }
);

module.exports = MultipleStringParser;