// Clone deeply
export default function clone(value) {
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