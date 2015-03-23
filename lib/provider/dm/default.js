var DMProvider = require("../dm"),
    _          = require("../../utils"),
    DefaultDMProvider;

/**
 * DefaultDMProvider
 *
 * @class
 * @extends DMProvider
 */
DefaultDMProvider = DMProvider.extend(
    /**
     * @lends DefaultDMProvider.prototype
     */
    {
        get: function(definition) {
            return this.async.resolve(this.dm);
        }
    }
);

module.exports = DefaultDMProvider;