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
    clone,
    sprintf
} from "./dm/utils";
import Async from "./dm/adapter/async";
import Loader from "./dm/adapter/loader";

/**
 * DM Constructor.
 * @constructor
 */
var DependencyManager = function(options) {

    options || (options = {});

    /**
     * Service map.
     *
     * @private
     * @type {Object}
     */
    var _config = null;

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
        if (_config != null) {
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
    };

    /**
     * Returns the deep copy of config.
     *
     * @returns {Object}
     */
    this.getConfig = function() {
        return clone(_config);
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


    this.initialize(options);
};

DependencyManager.prototype = (function() {

    /**
     * Template for checking reference to service.
     *
     * @type {RegExp}
     * @private
     * @static
     */
    var	SERVICE_REGEX = /^@([^:]*)(?::([^:()]*))?$/i;

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

        /**
         * Initialization.
         *
         * @param {Object} options
         */
        initialize: function(options) {
            this.services = {};
            this.servicesInstances = {};
        },

        setAsync: function(adapter) {
            if (!(adapter instanceof Async)) throw new Error("Async is expected");
            this.async = adapter;
        },

        setLoader: function(adapter) {
            if (!(adapter instanceof Loader)) throw new Error("Loader is expected");
            this.loader = adapter;
        },

        parseString: function(string) {
            var self = this,
                args, name, handler, path;


            if (isString(string)) {
                if (args = string.match(PROPERTY_REGEX)) {
                    name = args[1];
                    return self.async.resolve(self.getParameter(name));
                }

                if (args = string.match(SERVICE_REGEX)) {
                    name    = args[1];
                    handler = args[2];
                    return self.get(name, handler);
                }

                if (args = string.match(RESOURCE_REGEX)) {
                    handler = args[1];
                    path    = args[2];

                    return self.getResource(path, handler, string);
                }

                return self.async.resolve(string);
            }

            return self.async.reject(new Error("String is expected"));
        },

        /**
         * Finds out references to services, parameters and resources in given object.
         * Returns promise of getting them, which is resolved then with object having
         * parsed values.
         *
         * @param config {Object|Array}
         */
        parse: (function() {

            var escaper = function(obj) {
                if (obj[DependencyManager.ESCAPE_FLAG] === true) {
                    return obj[DependencyManager.ESCAPE_VALUE];
                }

                return null;
            };

            return function(config) {
                var self = this,
                    parsed, iterator;

                if (isArray(config)) {
                    parsed = [];
                    iterator = forEachSimple;
                } else if (isObject(config)) {
                    parsed = {};
                    iterator = forEachOwn;
                } else {
                    return config;
                }

                var promises = [];

                iterator(config, function(value, key) {
                    var promise, escaped;

                    switch (objectType(value)) {
                        case 'String':
                            promise = self.parseString(value);
                            break;
                        case 'Object':
                        case 'Array':
                            promise = (escaped = escaper(value)) ? self.async.resolve(escaped) : self.parse(value);
                            break;
                        default:
                            promise = self.async.resolve(value);
                            break;
                    }

                    promises.push(promise);

                    promise.then(function(value) {
                        parsed[key] = value;
                    });
                });

                return self.async.all(promises).then(function() {
                    return parsed;
                });
            }
        })(),

        /**
         * Собирает сервис.
         *
         * @param key {String}
         *
         * @returns {$.Deferred.promise}
         */
        build: (function() {

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
            var newInstanceArgs = function(constructor, args) {
                function Service(){}
                Service.prototype = constructor.prototype;

                var service = new Service();
                try {
                    constructor.apply(service, args);
                } catch (error) {
                    console.error("Cannot instantiate service", error);
//                            throw error;
                }

                return service;
            };

            var makeCall = function(service, key, args) {
                if (isFunction(service[key])) {
                    service[key].apply(service, args);
                }
            };

            return function(key) {
                var self = this,
                    config, path, args, calls, properties;

                if (!(config = this.getConfig(key))) {
                    throw new Error(sprintf("Service with key '%s' is not present in configuration", key));
                }

                path       = config.path;
                args       = config.arguments  || [];
                calls      = config.calls      || [];
                properties = config.properties || {};


                return self.loader.require(path)
                    .then(function(constructor) {
                        // Need parse things here to prevent premature load of service dependencies
                        // They could be included via r.js in upper module level
                        var args       = self.parse(args),
                            calls      = self.parse(calls),
                            properties = self.parse(properties);

                        self.async.all([args, calls, properties])
                            .then(function(inputs) {
                                var args       = inputs[0],
                                    calls      = inputs[1],
                                    properties = inputs[2],
                                    service;

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
                            });
                    });
            }
        })(),


        // @handler:handle!/var/resource
        getResource: function(path, handler, string) {
            var self = this;

            if (handler) {
                this.parseString(handler).then(function(handler) {

                    if (isString(handler)) {
                        return self.loader.require(string);
                    } else if (isFunction(handler)) {
                        return self.loader.require(path).then(handler);
                    } else {
                        return self.async.reject(new Error("Can not parse handler"));
                    }

                });
            }

            return this.loader.require(path);
        },

        /**
         *
         */
        get: function(name, method) {
            var self = this,
                promise;

            if (!isString(name)) {
                throw new Error(sprintf("Necessary string parameter expected, '%s' given", typeof name));
            }

            if (!(promise = this.services[name])) {
                promise = this.services[name] = this.build(name)
                    .then(function(service) {
                        self.servicesInstances[name] = service;
                        return service;
                    });
            }

            return promise.then(function(service) {
                var func;

                if (!isUndefined(method)) {
                    if (!isFunction(func = service[method])) {
                        throw new TypeError(sprintf("Service %s does not have method %s", name, method));
                    }

                    return func;
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

export default DependencyManager;

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
