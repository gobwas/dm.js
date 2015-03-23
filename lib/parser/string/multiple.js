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

                        resolve(result);
                    }
                );
            });
        }
    }
);

module.exports = MultipleStringParser;