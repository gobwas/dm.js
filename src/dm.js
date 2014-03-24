/*
 import {
 objectType,
 isString,
 isNumber,
 isFunction,
 isBoolean,
 isDate,
 isObject,
 isRegExp,
 isArray,
 isUndefined,
 forEachOwn,
 forEachSimple,
 map,
 clone,
 sprintf
 } from "./dm/utils";
 import Async from "./dm/adapter/async";
 import Loader from "./dm/adapter/loader";
 */


var utils  = require("./dm/utils"),
    Async  = require("./dm/adapter/async"),
    Loader = require("./dm/adapter/loader"),

    objectType    = utils.objectType,
    isString      = utils.isString,
    isNumber      = utils.isNumber,
    isFunction    = utils.isFunction,
    isBoolean     = utils.isBoolean,
    isDate        = utils.isDate,
    isObject      = utils.isObject,
    isRegExp      = utils.isRegExp,
    isArray       = utils.isArray,
    isUndefined   = utils.isUndefined,
    forEachOwn    = utils.forEachOwn,
    forEachSimple = utils.forEachSimple,
    map           = utils.map,
    clone         = utils.clone,
    sprintf       = utils.sprintf,

    DependencyManager;


/**
 * DM Constructor.
 * @constructor
 */
DependencyManager = function(options) {

    options = options || {};

    /**
     * Service map.
     *
     * @private
     * @type {Object}
     */
    var _config = null;

    var _configCopy = null;

    /**
     * Global properties.
     *
     * @private
     * @type {Object}
     */
    var _parameters = {};

    /**
     * Sets up the service map.
     *
     * @param {Object} config
     * @param {Object} [parameters]
     * @throws {Error}
     */
    this.setConfig = function(config, parameters) {
        if (_config !== null) {
            throw new Error("Dependency Manager is already configured");
        }

        if (!isObject(config)) {
            throw new Error("Config is expected to be an Object");
        }

        if (isObject(parameters)) {
            forEachOwn(parameters, function(value, key) {
                this.setParameter(key, value);
            }, this);
        }

        _config = config;
        _configCopy = clone(config);
    };

    /**
     * Returns the deep copy of config.
     *
     * @returns {Object}
     */
    this.getConfig = function(key) {
        return key ? _configCopy[key] : _configCopy;
    };

    /**
     * Sets up the global parameter.
     */
    this.setParameter = function(key, value) {
        if (!isUndefined(_parameters[key])) {
            throw new Error("Dependency Manager property '" + key + "' is already set");
        }

        _parameters[key] = value;
    };

    /**
     * Returns value of property.
     *
     * @param {String} key
     *
     * @returns {*}
     */
    this.getParameter = function(key) {
        return !isUndefined(_parameters[key]) ? _parameters[key] : null;
    };

    this.services = {};
};

DependencyManager.prototype = (function() {

    /**
     * Template for checking reference to service.
     *
     * Could be applied to string in format:
     * @<service>[:<method>[\[<argument-1>,[<argument-n>]\]]]
     *
     * @type {RegExp}
     * @private
     * @static
     */
    var	SERVICE_REGEX = /^@([^:]*)(?::([^\[\]]+)(\[.*\])?)?$/i;

    /**
     * Template for checking reference to property.
     *
     * @type {RegExp}
     * @private
     * @static
     */
    var PROPERTY_REGEX = /^%(.*)%$/i;

    /**
     * Template for checking reference to resource.
     *
     * @type {RegExp}
     * @private
     * @static
     */
    var RESOURCE_REGEX = /^#(?:([^!]+)!)?(.*)#$/i;


    return {
        constructor: DependencyManager,

        setAsync: function(adapter) {
            if (!(adapter instanceof Async)) {
                throw new Error("Async is expected");
            }
            this.async = adapter;
        },

        setLoader: function(adapter) {
            if (!(adapter instanceof Loader)) {
                throw new Error("Loader is expected");
            }
            this.loader = adapter;
        },

        // @service:getSome(@service:getVar(text, hello, @someService, %property%))
        parseString: function(string) {
            var self = this,
                args, name,
                property, handler, callArgs,
                path,
                promises;

            if (!isString(string)) {
                return self.async.reject(new Error("String is expected"));
            }

            // Property
            if ((args = string.match(PROPERTY_REGEX))) {
                name = args[1];
                return self.async.resolve(self.getParameter(name));
            }

            // Service
            if ((args = string.match(SERVICE_REGEX))) {
                name     = args[1];
                property = args[2];
                callArgs = args[3];

                promises = [this.parseString(name)];

                if (isString(property)) {
                    promises.push(this.parseString(property));

                    if (callArgs) {
                        try {
                            callArgs = JSON.parse(args[3]);
                        } catch (err) {
                            return self.async.reject(new Error("Service method call parse error"));
                        }

                        callArgs = callArgs.map(this.parse, this);

                        promises.push(this.async.all(callArgs));
                    }
                }

                return this.async.all(promises)
                    .then(function(args) {
                        return self.get.apply(self, args);
                    });
            }

            // Resource
            if ((args = string.match(RESOURCE_REGEX))) {
                path    = args[2];
                handler = args[1];

                promises = [this.parseString(path)];

                if (isString(handler)) {
                    promises.push(this.parseString(handler));
                }

                return this.async.all(promises).then(function(args) {
                    return self.getResource.apply(self, args);
                });
            }


            return this.async.resolve(string);
        },

        parseObject: function(object) {
            var self = this,
                iterator, parsed, promises, escaped;

            switch (objectType(object)) {
                case "Object": {
                    parsed = {};
                    iterator = forEachOwn;
                    break;
                }

                case "Array": {
                    parsed = [];
                    iterator = forEachSimple;
                    break;
                }

                default: {
                    return self.async.reject(new Error("Object or Array is expected"));
                }
            }

            if ((escaped = DependencyManager.unEscape(object))) {
                return this.async.resolve(escaped);
            }

            promises = [];

            iterator(object, function(value, key) {
                promises.push(self.parse(value).then(function(value) {
                    parsed[key] = value;
                }));
            });

            return self.async.all(promises)
                .then(function() {
                    return parsed;
                });
        },

        /**
         * Finds out references to services, parameters and resources in given object.
         * Returns promise of getting them, which is resolved then with object having
         * parsed values.
         *
         * @param config {*}
         */
        parse: function(config) {
            switch (objectType(config)) {
                case 'String': {
                    return this.parseString(config);
                }

                case 'Object':
                case 'Array': {
                    return this.parseObject(config);
                }

                default: {
                    return this.async.resolve(config);
                }
            }
        },

        /**
         * Собирает сервис.
         *
         * @param key {String}
         *
         * @returns {$.Deferred.promise}
         */
        build: (function() {
            var defaultFactory = (function() {
                /**
                 * Инстанцирует объект.
                 * Передает массив переменной длины параметров в конструктор.
                 *
                 * @param constructor
                 * @param args
                 *
                 * @returns {object}
                 * @private
                 */
                // default factory
                var newInstanceArgs = function(constructor, args) {
                    var service;

                    function Service() {}
                    Service.prototype = constructor.prototype;

                    service = new Service();

                    try {
                        constructor.apply(service, args);
                    } catch (error) {
                        console.error("Cannot instantiate service", error);
                        throw error;
                    }

                    return service;
                };

                var makeCall = function(service, key, args) {
                    if (isFunction(service[key])) {
                        service[key].apply(service, args);
                    }
                };


                return function(constructor, args, calls, properties) {
                    var service;

                    // Arguments
                    service = newInstanceArgs(constructor, args);

                    // Calls
                    forEachSimple(calls, function(call) {
                        makeCall(service, call[0], call[1]);
                    });

                    // Properties
                    forEachOwn(properties, function(value, key) {
                        service[key] = value;
                    });


                    return service;
                };
            })();


            return function(key) {
                var self = this,
                    config;

                if (!(config = this.getConfig(key))) {
                    return this.async.reject(new Error(sprintf("Service with key '%s' is not present in configuration", key)));
                }

                if (!isString(config.path)) {
                    return this.async.reject(new Error(sprintf("Path is expected in service configuration with key '%s'", key)));
                }


                // do not combine path loading and parsing arguments, cause it can produce side effects
                // on amd builds - when dependencies compiled in 'path' file, but loaded earlier from separate files
                return this.loader.require(config.path)
                    .then(function(constructor) {
                        return self.async.all([
                                self.parse(config.arguments  || []),
                                self.parse(config.calls      || []),
                                self.parse(config.properties || {}),
                                self.parse(config.factory)
                            ])
                            .then(function(inputs) {
                                var args, calls, properties, factory;

                                args       = inputs[0];
                                calls      = inputs[1];
                                properties = inputs[2];

                                if (!isFunction(factory = inputs[3])) {
                                    factory = defaultFactory;
                                }


                                return factory(constructor, args, calls, properties);
                            });
                    });
            };
        })(),


        // @handler:handle!/var/resource
        // %tpl%!/var/template.html
        // %tpl%!%path%
        getResource: function(path, handler) {
            var self = this;

            if (!isString(path)) {
                return this.async.reject(new Error("Path must be a string"));
            }

            if (!isUndefined(handler)) {
                if (isFunction(handler)) {
                    return self.loader.require(path).then(handler);
                } else if (isString(handler)) {
                    return self.loader.require(handler + "!" + path);
                }

                return self.async.reject(new Error("Handler must be a string or function"));
            }


            return this.loader.require(path);
        },

        /**
         *
         */
        get: function(key, prop, args) {
            var promise;

            if (!isString(key)) {
                return this.async.reject(new Error(sprintf("Key is expected to be string, %s given", typeof key)));
            }

            if (!(promise = this.services[key])) {
                promise = this.services[key] = this.build(key);
            }


            return promise.then(function(service) {
                var property, isFunc;

                if (isString(prop)) {
                    property = service[prop];
                    isFunc = isFunction(property);

                    if (isArray(args)) {
                        if (!isFunc) {
                            throw new TypeError(sprintf("Service '%s' does not have the method '%s'", key, prop));
                        }


                        return property.apply(service, args);
                    }


                    return isFunc ? property.bind(service) : property; // todo use universal bind
                }


                return service;
            });
        }
    };
})();

DependencyManager.ESCAPE_FLAG  = '__escape__';
DependencyManager.ESCAPE_VALUE = '__value__';

DependencyManager.escape = function(value) {
    var wrapper = {};

    wrapper[DependencyManager.ESCAPE_FLAG] = true;
    wrapper[DependencyManager.ESCAPE_VALUE] = value;

    return wrapper;
};

DependencyManager.unEscape = function(obj) {
    if (obj[DependencyManager.ESCAPE_FLAG] === true) {
        return obj[DependencyManager.ESCAPE_VALUE];
    }

    return null;
};

module.exports = DependencyManager;

// Module registration
// -------------------
/*
 var isNode = typeof module !== "undefined" && module.exports,
 isAMD = typeof define === 'function' && typeof define.amd === 'object' && define.amd;

 if (isNode) {
 module.exports = DependencyManager;
 } else if (isAMD) {
 define([], function() {return DependencyManager;});
 } else if ( typeof window === "object" && typeof window.document === "object" ) {
 window.DependencyManager = DependencyManager;
 }*/
