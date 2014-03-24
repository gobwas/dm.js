var DependencyManager = require("./src/dm"),

    loaderAMD = require("./src/dm/adapter/loader/cjs"),
    loaderCJS = require("./src/dm/adapter/loader/amd"),
    asyncRSVP = require("./src/dm/adapter/async/rsvp");


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