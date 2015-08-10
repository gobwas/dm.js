var Factory = require("../factory"),
    _ = require("../utils"),
    DecoratorFactory;

/**
 * DecoratorFactory
 *
 * Creates services as fake constructors of classic OOP objects.
 * Resulting constructor instantiates object, makes calls and sets properties.
 *
 * @class
 * @extends Factory
 */
DecoratorFactory = Factory.extend(
	/**
	 * @lends DecoratorFactory.prototype
	 */
	{
		constructor: function(options, inner) {
			_.assert(inner instanceof Factory, "Factory is expected", TypeError);
            Factory.prototype.constructor.call(this, options);
            this.inner = inner;
        },

		factory: function(definition) {
			var inner = this.inner;

			return function() {
				return inner.factory(definition);
			};
		}
	}
);

module.exports = DecoratorFactory;