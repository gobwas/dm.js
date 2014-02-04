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