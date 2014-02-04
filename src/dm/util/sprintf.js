// Shallow copy of sprintf
// Only uses '%s' placeholder
export default function sprintf(pattern) {
    var args = Array.prototype.slice.call(arguments, 1),
        counter = 0;

    if (!isString(pattern)) throw new Error("String is expected");

    return pattern.replace(/%s/g, function(match) {
        return (args[counter++]).toString() || match;
    });
}