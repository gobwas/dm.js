var sinon = require("sinon");

module.exports = {
    service: require("./klass"),
    universal: require("./universal"),
    children: [
        require("./klass")
    ],
    func: sinon.spy(function() {
        return {
            args: arguments,
            method: sinon.spy()
        };
    }),
    obj: {
        method: sinon.spy()
    },
    str: "hello",
    num: 7
};