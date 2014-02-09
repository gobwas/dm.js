var toString = Object.prototype.toString;

export function objectType(obj) {
    if (obj === void 0) {
        return 'Undefined';
    } else if (obj == null) {
        return 'Null'
    } else {
        return toString.call(obj).replace(/\[object ([a-zA-Z]+)\]/i, '$1');
    }
}

export function isString(obj) {
    return toString.call(obj) == '[object String]';
}

export function isNumber(obj) {
    return toString.call(obj) == '[object Number]';
}

export function isFunction(obj) {
    return toString.call(obj) == '[object Function]';
}

export function isBoolean(obj) {
    return toString.call(obj) == '[object Boolean]';
}

export function isDate(obj) {
    return toString.call(obj) == '[object Date]';
}

export function isObject(obj) {
    return toString.call(obj) == '[object Object]' && obj !== void 0;
}

export function isRegExp(obj) {
    return toString.call(obj) == '[object RegExp]';
}

export function isArray(obj) {
    return toString.call(obj) == '[object Array]';
}

export function isUndefined(obj) {
    return toString.call(obj) == '[object Undefined]' || obj === void 0;
}

// Iterates over object
// Breaks, if iterator return the value
export function forEachOwn(obj, iterator, context) {
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
export function forEachSimple(arr, iterator, context) {
    var result;

    for (var x = 0; x < arr.length; x++) {
        result = iterator.call(context, arr[x], x, arr);

        if (result !== undefined) {
            return result;
        }
    }

    return result;
}

// Shallow copy of sprintf
// Only uses '%s' placeholder
export function sprintf(pattern) {
    var args = Array.prototype.slice.call(arguments, 1),
        counter = 0;

    if (!isString(pattern)) throw new Error("String is expected");

    return pattern.replace(/%s/g, function(match) {
        return (args[counter++]).toString() || match;
    });
}

// Clone deeply
export function clone(value) {
    var result, isArr;

    if (typeof value == "object") {

        if (isBoolean(value)) return new Boolean(+value);
        if (isDate(value))    return new Date(+value);
        if (isNumber(value))  return new Number(value);
        if (isString(value))  return new String(value);

        if (isRegExp(value)) {
            result = new RegExp(value.source, /\w*$/.exec(value));
            result.lastIndex = value.lastIndex;
            return result;
        }

        isArr = isArray(value);

        result = isArr ? new Array(value.length) : new Object();

    } else {
        return value;
    }

    (isArr ? forEachSimple : forEachOwn)(value, function(value, key) {
        result[key] = clone(value);
    });

    return result;
}