# dm.[js](https://developer.mozilla.org/en/docs/JavaScript)

[![NPM version](https://badge.fury.io/js/dm.svg)](http://badge.fury.io/js/dm)
[![Build Status](https://travis-ci.org/gobwas/dm.js.svg?branch=0.3.0)](https://travis-ci.org/gobwas/dm.js)
[![Coverage Status](https://coveralls.io/repos/gobwas/dm.js/badge.svg?branch=0.3.0)](https://coveralls.io/r/gobwas/dm.js)
[![Sauce Test Status](https://saucelabs.com/buildstatus/gobwas)](https://saucelabs.com/u/gobwas)

> Dependency [Injection](http://en.wikipedia.org/wiki/Dependency_injection) Manager for javascript.

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
            "path": "./src/log/logger/polylogue.js",
            "calls": [
                ["addHandler", ["@handler"]]
            ]
        },

        "handler": {
            "path": "./src/log/handler/file.js",
            "arguments": [{
                "path": "#{logs}/log.txt"
            }]
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

## Documentation

There is a [wiki](https://github.com/gobwas/dm.js/wiki) for know hot to use dm.

## Contributing

All developing version are available to install from npm as `dm@x.y.z-rc`.
To publish new release candidate (rc abbr) just do `npm publish --tag x.y.z-rc` and bump version in package.json `x.y.z-rc0`.

## License

[MIT](LICENSE)
