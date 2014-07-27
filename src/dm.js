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


var utils    = require("./dm/utils"),
    Async    = require("./dm/adapter/async"),
    Loader   = require("./dm/adapter/loader"),
    Factory  = require("./dm/factory"),
    inherits = require("inherits-js"),

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
    forEach       = utils.forEach,
    forEachOwn    = utils.forEachOwn,
    forEachSimple = utils.forEachSimple,
    map           = utils.map,
    bind          = utils.bind,
    clone         = utils.clone,
    extend        = utils.extend,
    sprintf       = utils.sprintf,
    async         = utils.async,

    DefaultFactory = require("./dm/factory/default"),
    defaultFactory,

    DependencyManager;


// may be turn it inside as internal service? "@:::factory.default"
defaultFactory = new DefaultFactory();

/**
 * DM Constructor.
 * @constructor
 */
DependencyManager = function(options) {
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
     * Options for DM.
     * @type {Object}
     */
    this.options = extend({}, this.constructor.DEFAULTS, options || {});

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
        if (_config === null) {
            throw new Error("Dependency Manager is not configured yet");
        }
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

    /**
     * Services map
     * @type {{}}
     */
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
    var	SERVICE_REGEX = /^@([^:]+)(?::([^\[\]]+)(\[.*\])?)?$/i;

    /**
     * Template for checking reference to property.
     *
     * @type {RegExp}
     * @private
     * @static
     */
    var PROPERTY_REGEX = /^%(.*)%$/i;

    /**
     * Template for checking reference to property in string context.
     *
     * @type {RegExp}
     * @private
     * @static
     */
    var LIVE_PROPERTY_REGEX = /%\{([^%]+?)\}/gi;

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

            return this;
        },

        setLoader: function(adapter) {
            if (!(adapter instanceof Loader)) {
                throw new Error("Loader is expected");
            }

            this.loader = adapter;

            return this;
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

            // todo Refactor parsing in this way:
            //
            // [PropertyTemplateParser, PropertyLinkParser, ContainerLinkParser, ServiceLinkParser, ResourceParser]
            // chain.add(...);
            // chain.add(...);
            // chain.parse(string);
            //
            // Finally there could be:
            // - final (returning) link parsers
            // - continuous (not returning) template parses
            //
            // Links are @, #...#, %...%
            // Templates are @{service[method|property|toString]}, #{resource}, %{parameter}

            // Live replacement property
            // We do not resolve promise with this
            // Cause it can contain another useful matching
            if (string.match(LIVE_PROPERTY_REGEX)) {
                string = string.replace(LIVE_PROPERTY_REGEX, function(match, name) {
                    return self.getParameter(name) || match;
                });
            }

            // Property
            if ((args = string.match(PROPERTY_REGEX))) {
                name = args[1];
                return self.async.resolve(self.getParameter(name));
            }

            // Self link
            if (string === DependencyManager.SELF) {
                return this.async.resolve(this);
            }

            // Service
            if ((args = string.match(SERVICE_REGEX))) {
                name     = args[1];
                property = args[2];
                callArgs = args[3];

                promises = [this.parseString(name)];

                if (property && isString(property)) {
                    promises.push(this.parseString(property));

                    if (callArgs) {
                        try {
                            callArgs = JSON.parse(args[3]);
                        } catch (err) {
                            return self.async.reject(new Error("Service method call parse error"));
                        }

                        callArgs = map(callArgs, this.parse, this);

                        promises.push(this.async.all(callArgs));
                    }
                }

                return this.async.all(promises)
                    .then(function(results) {
                        var key, options;

                        key = results[0];
                        options = {
                            property:  results[1],
                            arguments: results[2]
                        };

                        return self.get(key, options);
                    });
            }

            // Resource
            if ((args = string.match(RESOURCE_REGEX))) {
                path    = args[2];
                handler = args[1];

                promises = [this.parseString(path)];

                if (handler && isString(handler)) {
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
         * @param config {Object}
         *
         * @returns {Promise}
         */
        build: function(config) {
            var self = this,
                options;

            options = {
                base: this.options.base
            };

            // do not combine path loading and parsing arguments, cause it can produce side effects
            // on amd builds - when dependencies compiled in 'path' file, but loaded earlier from separate files
            return this.loader.require(config.path, options)
                .then(function(constructor) {
                    return self.async.all([
                            self.parse(config.arguments  || []),
                            self.parse(config.calls      || []),
                            self.parse(config.properties || {}),
                            self.parse(config.factory)
                        ])
                        .then(function(inputs) {
                            var definition, factory;

                            definition = {
                                constructor: constructor,
                                arguments:   inputs[0],
                                calls:       inputs[1],
                                properties:  inputs[2]
                            };

                            factory = inputs[3] || defaultFactory;

                            if (isObject(factory)) {
                                if (!isFunction(factory.factory)) {
                                    throw new TypeError("Given factory object does not have #factory method");
                                }

                                factory = bind(factory.factory, factory);
                            } else if (!isFunction(factory)) {
                                throw new TypeError("Given factory must be a function");
                            }

                            // could be a value or a Promise
                            return factory(definition);
                        });
                });
        },


        // @handler:handle!/var/resource
        // %tpl%!/var/template.html
        // %tpl%!%path%
        getResource: function(path, handler) {
            var options;

            if (!isString(path)) {
                return this.async.reject(new Error("Path must be a string"));
            }

            options = {
                base: this.options.base
            };

            if (isFunction(handler)) {
                return this.loader.read(path, options).then(handler);
            }

            // path handler to loader for any cases
            options.handler = handler;

            return this.loader.read(path, options);
        },

        /**
         *
         * @param {string} key
         * @param {Object} [options]
         */
        has: function(key, options) {
            return !!this.getConfig(key);
        },

        /**
         *
         * @param {string} key
         * @param {Object} [options]
         */
        initialized: function(key, options) {
            return !!this.services[key];
        },

        /**
         *
         * @param {string} key
         * @param {*} service
         * @param {Object} [options]
         */
        set: function(key, service, options) {
            var config;

            if (!(config = this.getConfig(key))) {
                throw new Error(sprintf("Service with key '%s' is not present in configuration", key));
            }

            if (!config.synthetic) {
                throw new Error(sprintf("Could not inject service with key '%s', cause it is not synthetic", key));
            }

            this.services[key] = this.async.resolve(service);
        },

        /**
         *
         */
        get: function(key, options) {
            var config, promise,
                alias,
                isShared, isSynthetic, isAlias, isSingleProperty;

            if (!isString(key)) {
                return this.async.reject(new Error(sprintf("Key is expected to be string, %s given", typeof key)));
            }

            if (!(config = this.getConfig(key))) {
                return this.async.reject(new Error(sprintf("Service with key '%s' is not present in configuration", key)));
            }

            options = options || {};

            isShared    = isBoolean(config.share)     ? config.share     : true;
            isSynthetic = isBoolean(config.synthetic) ? config.synthetic : false;
            isAlias     = isString(config.alias)      ? true             : false;

            // Sign of custom property (synthetic, aliased or smth)
            isSingleProperty = isSynthetic || isAlias;

            if (!isSingleProperty && !isString(config.path)) {
                return this.async.reject(new Error(sprintf("Path is expected in service configuration with key '%s'", key)));
            }

            if (isSynthetic && !this.initialized(key)) {
                return this.async.reject(new Error(sprintf("Service with key '%s' is synthetic, and not injected yet", key)));
            }

            if (isAlias) {
                if (!this.has(alias = config.alias)) {
                    return this.async.reject(new Error(sprintf("Service with key '%s' could not be alias for not existing '%s' service", key, alias)));
                }

                return this.get(alias);
            }

            if (!isShared) {
                promise = this.build(config);
            } else if (!(promise = this.services[key])) {
                promise = this.services[key] = this.build(config);
            }

            // todo move this logic in Service parser
            return promise.then(function(service) {
                var property, isFunc;

                if (isString(options.property)) {
                    property = service[options.property];
                    isFunc = isFunction(property);

                    if (isArray(options.arguments)) {
                        if (!isFunc) {
                            throw new TypeError(sprintf("Service '%s' does not have the method '%s'", key, options.property));
                        }


                        return property.apply(service, options.arguments);
                    }


                    return isFunc ? bind(property, service) : property;
                }


                return service;
            });
        }
    };
})();

// Default options
DependencyManager.DEFAULTS = {
    base: null
};

DependencyManager.ESCAPE_FLAG  = '__escape__';
DependencyManager.ESCAPE_VALUE = '__value__';
DependencyManager.SELF         = "@_@";

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

DependencyManager.extend = function(prototypeProps, staticProps) {
    return inherits(this, prototypeProps, staticProps);
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
