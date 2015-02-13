var Processing = require("../processing"),
    _          = require("../../../utils"),
    StringifyProcessing;

/**
 * StringifyProcessing
 *
 * @class
 * @extends Processing
 */
StringifyProcessing = Processing.extend(
    /**
     * @lends StringifyProcessing.prototype
     */
    {
        process: function(str, result) {
            // just think about it
            // may be we need to use wrapper class for parser result
            // for 100% identify it is list or is it single
            if (!_.isArray(result)) {
                result = [{ match: str, result: result }];
            }

            return _
                .reduce(result, function(buffer, def, index, list) {
                    var previous, from, to;

                    from = def.match.position[0];
                    to   = def.match.position[1];

                    if (!(previous = list[index - 1])) {
                        buffer.push(str.substring(0, from));
                    } else {
                        buffer.push(str.substring(previous.match.position[1] + 1, from));
                    }

                    buffer.push(def.result);

                    // if the last one
                    if (index == (list.length - 1)) {
                        buffer.push(str.substr(to + 1));
                    }

                    return buffer;
                }, [])
                .join("");
        }
    }
);

module.exports = StringifyProcessing; 