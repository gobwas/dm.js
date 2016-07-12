var toString = Object.prototype.toString,
    createObject;

function assert(statement, msg, Err) {
    var ctor;

    ctor = isFunction(Err) ? Err : Error;

    if (!statement) {
        throw new ctor(msg || "Assertion error");
    }
}

function objectType(obj) {
    if (obj === void 0) {
        return 'Undefined';
    } else if (obj === null) {
        return 'Null';
    } else {
        return toString.call(obj).replace(/\[object ([a-zA-Z]+)\]/i, '$1');
    }
}

function has(obj, key) {
    return obj ? hasOwnProperty.call(obj, key) : false;
}

function isString(obj) {
    return toString.call(obj) == '[object String]';
}

function isNumber(obj) {
    return toString.call(obj) == '[object Number]';
}

function isFunction(obj) {
    return toString.call(obj) == '[object Function]';
}

function isBoolean(obj) {
    return toString.call(obj) == '[object Boolean]';
}

function isDate(obj) {
    return toString.call(obj) == '[object Date]';
}

function isObject(obj) {
    return toString.call(obj) == '[object Object]' && obj !== void 0;
}

function isObjectLike(obj) {
    var type = typeof obj;
    return type == 'function' || (!!obj && type == 'object');
}

function isRegExp(obj) {
    return toString.call(obj) == '[object RegExp]';
}

function isArray(obj) {
    return toString.call(obj) == '[object Array]';
}

function isUndefined(obj) {
    return toString.call(obj) == '[object Undefined]' || obj === void 0;
}

function isNull(obj) {
    return obj === null;
}

function noop() {
    //
}

function deprecate(method, instead) {
    return function() {
        throw new Error("Method '" + method + "' is deprecated now. Use '" + instead + "' method instead.");
    };
}

var breaker = {};

var async = {
    each: function(obj, iterator, callback) {
        var remain, next;

        callback = callback || noop;

        remain = keys(obj).length;

        if (!remain) {
            return callback();
        }

        next = function(err) {
            if (err) {
                callback(err);
                callback = noop;
            } else {
                remain--;

                if (!remain) {
                    callback();
                }
            }
        };

        forEach(obj, function(value, index) {
            iterator(value, index, next);
        });

        return null;
    },

    eachSeries: function(obj, iterator, callback) {
        var index, iteration, next, indexes, remain;

        callback = callback || noop;

        indexes = keys(obj);
        remain = indexes.length;
        index = 0;
        
        if (!remain) {
            return callback();
        }

        next = function(err) {
            if (err) {
                callback(err);
            } else {
                remain--;
                index++;

                if (!remain) {
                    callback();
                } else {
                    iteration();
                }
            }
        };

        iteration = function() {
            var key;

            key = indexes[index];

            iterator(obj[key], key, next);
        };

        iteration();
    },

    _doParallel: function(fn) {
        var args;

        args = Array.prototype.slice.call(arguments, 1);

        return fn.apply(this, [ this.each ].concat(args));
    },

    _doSeries: function(fn) {
        var args;

        args = Array.prototype.slice.call(arguments, 1);

        return fn.apply(this, [ this.eachSeries ].concat(args));
    },

    _find: function(eacher, obj, iterator, callback) {
        eacher(
            obj,
            function(value, key, next) {
                iterator(value, key, function(err, result) {
                    if (err) {
                        callback(err);
                        callback = noop;
                        next(err);
                        return;
                    }

                    if (result) {
                        callback(null, value, key);
                        callback = noop;
                    } else {
                        next();
                    }
                });
            },
            function(err) {
                callback(err);
            }
        );
    },

    find: function(obj, iterator, callback) {
        this._doParallel(this._find, obj, iterator, callback);
    },

    findSeries: function(obj, iterator, callback) {
        this._doSeries(this._find, obj, iterator, callback);
    },

    whilst: function(test, iterator, callback) {
        var self = this,
            args;

        args = Array.prototype.slice.call(arguments, 3);

        test.apply(null, [ function(truth) {

            if (truth) {
                iterator.apply(null, [ function(err) {
                    var args;

                    if (err) {
                        callback(err);
                        return;
                    }

                    args = Array.prototype.slice.call(arguments, 1);

                    self.whilst.apply(self, [ test, iterator, callback ].concat(args));
                } ].concat(args));
            } else {
                callback.apply(null, [ null ].concat(args));
            }

        } ].concat(args));
    },

    doWhilst: function(test, iterator, callback) {
        var self = this,
            args;

        args = Array.prototype.slice.call(arguments, 3);

        iterator.apply(null, [ function(err) {
            var args;

            if (err) {
                callback(err);
                return;
            }

            args = Array.prototype.slice.call(arguments, 1);

            test.apply(null, [ function(truth) {

                if (truth) {
                    self.doWhilst.apply(self, [ test, iterator, callback ].concat(args));
                } else {
                    callback.apply(null, [ null ].concat(args));
                }

            } ].concat(args));

        } ].concat(args));
    },

    map: function(arr, iterator, callback) {
        var result;

        result = [];

        this.each(arr, function(value, index, next) {
            iterator(value, index, function(err, value) {
                result[index] = value;
                next(err);
            });
        }, function(err) {
            callback(err, result);
        });
    },

    reduce: function(obj, memo, iterator, callback) {
        this.eachSeries(obj, function(value, index, next) {
            iterator(memo, value, index, function(err, value) {
                memo = value;
                next(err);
            });
        }, function(err) {
            callback(err, memo);
        });
    }
};

function keys(obj) {
    var result;

    result = [];

    if (!isObject(obj) && !isArray(obj)) {
        throw new TypeError("Object or Array is expected");
    }

    if (Object.keys) {
        return Object.keys(obj);
    }

    forEach(obj, function(value, key) {
        result.push(key);
    });

    return result;
}

function forEach(obj, iterator, context) {
    if (isArray(obj)) {
        return forEachSimple(obj, iterator, context);
    } else if (isObject(obj)) {
        return forEachOwn(obj, iterator, context);
    }

    throw new TypeError("Array or Object is expected");
}

// Iterates over object
// Breaks, if iterator return the value
function forEachOwn(obj, iterator, context) {
    var result;

    for (var x in obj) {
        if (has(obj, x)) {
            result = iterator.call(context, obj[x], x, obj);

            if (result !== undefined) {
                return result;
            }
        }
    }

    return result;
}

// Iterates over array
// Breaks, if iterator return the value
function forEachSimple(arr, iterator, context) {
    var result;

    for (var x = 0; x < arr.length; x++) {
        result = iterator.call(context, arr[x], x, arr);

        if (result !== undefined) {
            return result;
        }
    }

    return result;
}

function map(array, iterator, context) {
    var results = [];

    if (array === null) {
        return results;
    }

    if (isFunction(array.map)) {
        return array.map(iterator, context);
    }

    forEachSimple(array, function(value, index, list) {
        results[results.length] = iterator.call(context, value, index, list);
    });

    return results;
}

function reduce(obj, iterator, memo, context) {
    if (!obj) {
        return memo;
    }

    if (isFunction(obj.reduce)) {
        return obj.reduce(iterator, memo, context);
    }

    forEach(obj, function(value, index, list) {
        memo = iterator.call(context, memo, value, index, list);
    });

    return memo;
}

function omit(obj, ignore) {
    var blacklist;

    if (isArray(ignore)) {
        blacklist = ignore;
    } else {
        blacklist = Array.prototype.slice.call(arguments, 1);
    }

    return reduce(obj, function(memo, value, key) {
        if (blacklist.indexOf(key) == -1) {
            memo[key] = value;
        }

        return memo;
    }, {});
}

function bind(func, context) {
    var args, slice;

    slice = Array.prototype.slice;

    if (isFunction(func.bind)) {
        return func.bind.apply(func, slice.call(arguments, 1));
    }

    args = slice.call(arguments, 2);

    return function() {
        return func.apply(context, args.concat(slice.call(arguments)));
    };
}

// Shallow copy of sprintf
// Only uses '%s' placeholder
function sprintf(pattern) {
    var args = Array.prototype.slice.call(arguments, 1),
        counter = 0;

    if (!isString(pattern)) {
        throw new Error("String is expected");
    }

    return pattern.replace(/%s/g, function(match) {
        return (args[counter++]).toString() || match;
    });
}

// Clone deeply
function clone(value) {
    var result, isArr;

    if (typeof value == "object") {
        /* jshint ignore:start */
        if (isBoolean(value)) {
            return new Boolean(+value);
        }

        if (isDate(value)) {
            return new Date(+value);
        }

        if (isNumber(value)) {
            return new Number(value);
        }

        if (isString(value)) {
            return new String(value);
        }


        if (isRegExp(value)) {
            result = new RegExp(value.source, /\w*$/.exec(value));
            result.lastIndex = value.lastIndex;
            return result;
        }

        isArr = isArray(value);

        result = isArr ? new Array(value.length) : new Object();
        /* jshint ignore:end */

    } else {
        return value;
    }

    (isArr ? forEachSimple : forEachOwn)(value, function(value, key) {
        result[key] = clone(value);
    });

    return result;
}

// Extend object with others
function extend(obj) {
    forEachSimple(Array.prototype.slice.call(arguments, 1), function(source) {
        if (source) {
            forEachOwn(source, function(value, key) {
                obj[key] = value;
            });
        }
    });

    return obj;
}

/**
 * Creates object.
 *
 * @see http://jsperf.com/dynamic-arguments-to-the-constructor/4
 *
 * @private
 * @param {Object} prototype
 *
 * @return {Object}
 */
var createObject = (function() {
    if (isFunction(Object.create)) {
        return function(prototype) {
            return Object.create(prototype);
        };
    }

    // we wrap here in immediate invoked function expression
    // to avoid hoisting of the fake constructor function `Service`
    return (function() {
        // fake constructor
        function Service(){}

        return function(prototype) {
            Service.prototype = prototype;
            return new Service();
        };
    })();
})();

/**
 * Constructs object.
 *
 * @see https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Reflect/construct
 *
 * @private
 * @param {Function} constructor
 * @param {Array} args
 */
var construct = (function() {
    var nativeConstruct;
    try {
    nativeConstruct = Reflect.construct;
    } catch (e) {
    // no es6 Reflect.construct;
    }

    if (isFunction(nativeConstruct)) {
        return nativeConstruct;
    } else {
        return function(constructor, args) {
            var that = createObject(constructor.prototype);
            var service = constructor.apply(that, args);

            // if constructor returned object or function - return this value
            if (service && (typeof service == 'object' || typeof service == 'function')) {
                return service;
            }

            return that;
        };
    }
})();


module.exports = {
    objectType:    objectType,
    createObject:  createObject,
    construct:     construct,
    has:           has,
    isString:      isString,
    isNumber:      isNumber,
    isFunction:    isFunction,
    isBoolean:     isBoolean,
    isDate:        isDate,
    isObject:      isObject,
    isObjectLike:  isObjectLike,
    isRegExp:      isRegExp,
    isArray:       isArray,
    isNull:        isNull,
    isUndefined:   isUndefined,
    forEach:       forEach,
    forEachOwn:    forEachOwn,
    forEachSimple: forEachSimple,
    map:           map,
    reduce:        reduce,
    omit:          omit,
    sprintf:       sprintf,
    clone:         clone,
    extend:        extend,
    bind:          bind,
    async:         async,
    keys:          keys,
    assert:        assert,
    deprecate:     deprecate
};
