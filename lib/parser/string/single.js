var StringParser = require("../string"),
    _            = require("../../utils"),
    SingleStringParser;

/**
 * SingleStringParser
 *
 * @class SingleStringParser
 * @extends StringParser
 * @author Sergey Kamardin <s.kamardin@tcsbank.ru>
 */
SingleStringParser = StringParser.extend(
    /**
     * @lends SingleStringParser.prototype
     */
    {
        parse: function(str) {
            var obj;

            obj = this.template.match(str);

            return this.provider.get(obj.definition);
        }
    }
);

module.exports = SingleStringParser;
