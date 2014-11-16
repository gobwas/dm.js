var toString = Object.prototype.toString;

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

var async = {
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
                    self.whilst.apply(self, [ test, iterator, callback ].concat(args));
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

module.exports = {
    objectType:    objectType,
    has:           has,
    isString:      isString,
    isNumber:      isNumber,
    isFunction:    isFunction,
    isBoolean:     isBoolean,
    isDate:        isDate,
    isObject:      isObject,
    isRegExp:      isRegExp,
    isArray:       isArray,
    isNull:        isNull,
    isUndefined:   isUndefined,
    forEach:       forEach,
    forEachOwn:    forEachOwn,
    forEachSimple: forEachSimple,
    map:           map,
    sprintf:       sprintf,
    clone:         clone,
    extend:        extend,
    bind:          bind,
    async:         async,
    keys:          keys,
    assert:        assert,
    deprecate:     deprecate
};