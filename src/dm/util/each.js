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