var DependencyManager = require("./src/dm"),

    loaderAMD = require("./src/dm/loader/amd"),
    loaderCJS = require("./src/dm/loader/cjs"),
    asyncRSVP = require("./src/dm/async/rsvp");


module.exports = {
    DependencyManager: DependencyManager,
    loader: {
        amd: loaderAMD,
        cjs: loaderCJS
    },
    async: {
        RSVP: asyncRSVP
    }
};