var toString = Object.prototype.toString;

function objectType(obj) {
    if (obj === void 0) {
        return 'Undefined';
    } else if (obj === null) {
        return 'Null';
    } else {
        return toString.call(obj).replace(/\[object ([a-zA-Z]+)\]/i, '$1');
    }
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

// Iterates over object
// Breaks, if iterator return the value
function forEachOwn(obj, iterator, context) {
    var result;

    for (var x in obj) {
        if (obj.hasOwnProperty(x)) {
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
    // todo make real map if native isnt exists
    return array.map(iterator.bind(context));
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

module.exports = {
    objectType:    objectType,
    isString:      isString,
    isNumber:      isNumber,
    isFunction:    isFunction,
    isBoolean:     isBoolean,
    isDate:        isDate,
    isObject:      isObject,
    isRegExp:      isRegExp,
    isArray:       isArray,
    isUndefined:   isUndefined,
    forEachOwn:    forEachOwn,
    forEachSimple: forEachSimple,
    map:           map,
    sprintf:       sprintf,
    clone:         clone
};