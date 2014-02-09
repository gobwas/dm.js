/**
 * Each iterator.
 *
 * @param {object}   props
 * @param {function} func
 * @param {object} [context]
 *
 * @returns {*}
 */
var each = function(props, func, context) {
    var result;

    context || (context = null);

    for (var x in props) {
        if (props.hasOwnProperty(x)) {
            result = func.call(context, props[x], x, props);

            if (result !== undefined) {
                return result;
            }
        }
    }

    return result;
};

/**
 * Extends one object by multiple others.
 *
 * @param {object} to
 *
 * @returns {object}
 */
var extend = function(to) {
    var from = Array.prototype.slice.call(arguments, 1);

    var func = function(value, prop) {
        to[prop] = value;
    };

    for (var x = 0; x < from.length; x++) {
        each(from[x], func);
    }

    return to;
};

/**
 * Inheritance function.
 *
 * @param {function} Parent
 * @param {object} [protoProps]
 * @param {object} [staticProps]
 *
 * @returns {function}
 */
var inherits = function(Parent, protoProps, staticProps) {
    var Child;

    protoProps || (protoProps = {});
    staticProps || (staticProps = {});

    if (protoProps.hasOwnProperty("constructor") && typeof protoProps.constructor === 'function') {
        Child = protoProps.constructor;
    } else {
        Child = function Child(){Parent.apply(this, arguments);};
    }

    // set the static props to the new Enum
    extend(Child, Parent, staticProps);

    // create prototype of Child, that created with Parent prototype
    // (without making Child.prototype = new Parent())
    //
    // __proto__  <----  __proto__
    //     ^                 ^
    //     |                 |
    //   Parent            Child
    //
    function Surrogate(){}
    Surrogate.prototype = Parent.prototype;
    Child.prototype = new Surrogate();

    // extend prototype
    extend(Child.prototype, protoProps, {constructor: Child});

    // link to Parent prototype
    Child.__super__ = Parent.prototype;

    return Child;
};

export default inherits;