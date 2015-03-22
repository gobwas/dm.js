# dm.[js](https://developer.mozilla.org/en/docs/JavaScript)

[![NPM version](https://badge.fury.io/js/dm.svg)](http://badge.fury.io/js/dm)
[![Build Status](https://travis-ci.org/gobwas/dm.js.svg?branch=0.3.0)](https://travis-ci.org/gobwas/dm.js)
[![Coverage Status](https://coveralls.io/repos/gobwas/dm.js/badge.svg?branch=0.3.0)](https://coveralls.io/r/gobwas/dm.js)
[![Sauce Test Status](https://saucelabs.com/buildstatus/gobwas)](https://saucelabs.com/u/gobwas)

> Dependency Injection Manager for javascript.

## Introduction

**dm.js** is a javascript library that implements dependency injection pattern. It could work both in node or browser.

It takes care of asynchronous creating, configuring and injecting objects aka *services* inside of your code.

There is a good chance to keep your application design loose coupled, well structured and flexible with dependency injection pattern.

If you are not familiar with dependency injection pattern, use [wiki](https://github.com/gobwas/dm.js/wiki) to get more theory info.

## Usage

```js

var DM     = require("dm"),
    Async  = require("dm/lib/async/q"),
    Loader = require("dm/lib/loader/cjs"),
    dm;

dm = new DM(new Async(Q), new Loader(require), {
    parameters: {
        "logs": "/var/log/app/"
    },

    services: {
        "logger": {
            // this is where the loader must get a constructor for this service
            "path": "./src/log/logger/polylogue.js",
            
            // this is what calls dm must do on just created service
            "calls": [
            
                // '@' symbol is the link to another service from config
                [ "addHandler", ["@handler"] ]
                
            ]
        },

        "handler": {
            "path": "./src/log/handler/file.js",
            
            // this is what arguments pass to the constructor
            "arguments": [
                {
                    // '%' symbol is the getter of parameter from config (defined above)
                    // curly braces is a kinda simple templating feature (works with '@', '#' and '%')
                    "path": "%{logs}/log.txt"
                }
            ]
        }
    }
});


dm
    .get("logger")
    .then(function(logger) {
        // now we got instantiated and configured logger
        logger.info("Hello! It works!");
    });

```

## Quick overview

DM can:

+ call constructor of your object with needed arguments;
+ make any calls on created object with any arguments;
+ directly set some properties;
+ pass as dependency another service from configuration, or its property, or its method, or its method call result;
+ pass as dependency some file content (with fs.readFile in cjs, and require(text!) in amd);
+ pass as dependency value of parameters, defined in configuration object;
+ pass as dependency some static string with wildcards, that could be any kind of dependencies above;
+ cache or always create new object;
+ retrieve already created objects and work with them as cached services;
+ be configured on the fly with new definitions of services;
+ use custom factory for the service, to make more complex things;

Full syntax definition you can find in the wiki.

## Documentation

There is a [wiki](https://github.com/gobwas/dm.js/wiki) for dive deep with dm usage, syntax and ideology.

## Contributing

All developing version are available to install from npm as `dm@x.y.z-rc`.
To publish new release candidate (rc abbr) just do `npm publish --tag x.y.z-rc` and bump version in package.json `x.y.z-rc0`.

## License

[MIT](LICENSE)
