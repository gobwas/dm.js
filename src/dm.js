var inherits = require("inherits-js"),
    _        = require("./dm/utils"),
    Async    = require("./dm/async"),
    Loader   = require("./dm/loader"),

    DefaultFactory = require("./dm/factory/default"),

    ServiceProvider   = require("./dm/provider/service"),
    ParameterProvider = require("./dm/provider/parameter"),
    ResourceProvider  = require("./dm/provider/resource"),

    CompositeParser = require("./dm/parser/composite"),

    ServiceStringParser   = require("./dm/parser/string/service"),
    ParameterStringParser = require("./dm/parser/string/parameter"),
    ResourceStringParser  = require("./dm/parser/string/resource"),

    ServiceTemplateStringParser   = require("./dm/parser/string/template/service"),
    ParameterTemplateStringParser = require("./dm/parser/string/template/parameter"),
    ResourceTemplateStringParser  = require("./dm/parser/string/template/resource"),

    DependencyManager;

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
    var _configCopy;

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
    this.options = _.extend({}, this.constructor.DEFAULTS, options || {});

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

        if (!_.isObject(config)) {
            throw new Error("Config is expected to be an Object");
        }

        if (_.isObject(parameters)) {
            _.forEach(parameters, function(value, key) {
                this.setParameter(key, value);
            }, this);
        }

        _config = config;
        _configCopy = _.clone(config);
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
        if (!_.isUndefined(_parameters[key])) {
            throw new Error("Dependency Manager parameter '" + key + "' is already exists");
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
        return !_.isUndefined(_parameters[key]) ? _parameters[key] : null;
    };

    /**
     * Services map
     * @type {{}}
     */
    this.services = {};

    this.factory = new DefaultFactory();
};

DependencyManager.prototype = (function() {

    return {
        constructor: DependencyManager,

        /**
         * Temporary method, will die in 0.3.1
         * @todo (content of this func will be moved in constructor) @ 0.3.1
         * @deprecated
         * @private
         */
        _initialize: function(async) {
            var serviceProvider, parameterProvider, resourceProvider;
            // assemble parser
            serviceProvider   = new ServiceProvider(this, async);
            parameterProvider = new ParameterProvider(this, async);
            resourceProvider  = new ResourceProvider(this, async);

            this.parser = (new CompositeParser(async))
                .add((new ServiceStringParser(async))          .injectProvider(serviceProvider))
                .add((new ParameterStringParser(async))        .injectProvider(parameterProvider))
                .add((new ResourceStringParser(async))         .injectProvider(resourceProvider))
                .add((new ServiceTemplateStringParser(async))  .injectProvider(serviceProvider))
                .add((new ParameterTemplateStringParser(async)).injectProvider(parameterProvider))
                .add((new ResourceTemplateStringParser(async)) .injectProvider(resourceProvider));
        },

        /**
         *
         * @deprecated will die in 0.3.1
         * @param adapter
         * @returns {DependencyManager}
         */
        setAsync: function(adapter) {
            console.warn("'setAsync' is deprecated. Use arguments injection in DM");

            if (!(adapter instanceof Async)) {
                throw new Error("Async is expected");
            }

            this.async = adapter;

            this._initialize(adapter);

            return this;
        },

        /**
         * @deprecated will die in 0.3.1
         * @param adapter
         * @returns {DependencyManager}
         */
        setLoader: function(adapter) {
            console.warn("'setLoader' is deprecated. Use arguments injection in DM");

            if (!(adapter instanceof Loader)) {
                throw new Error("Loader is expected");
            }

            this.loader = adapter;

            return this;
        },

        parseString: function(string) {
            var self = this,
                parser;

            if (!_.isString(string)) {
                return self.async.reject(new Error("String is expected"));
            }

            parser = this.parser;

            return this.async.promise(function(resolve, reject) {
                _.async.doWhilst(
                    function(truth, value, initial) {
                        var mustRepeat;

                        console.log('truth test', value, initial);

                        // if some parser has returned string
                        // try to parse it again
                        mustRepeat = _.isString(value) && value !== initial;

                        truth(mustRepeat);
                    },
                    function(next, initial) {
                        console.log('parse iteration with string', initial);

                        parser
                            .test(initial)
                            .then(function(acceptable) {
                                console.log('parser accepts', acceptable);

                                if (!acceptable) {
                                    next(initial, initial);
                                    return;
                                }

                                parser
                                    .parse(string, self)
                                    .then(function(parsed) {
                                        console.log('parsed', parsed, 'from', initial);
                                        next(parsed, initial);
                                    });
                            });
                    },
                    function(err, value) {
                        if (err) {
                            reject(err);
                            return;
                        }

                        resolve(value);
                    },
                    string
                );
            });
        },

        parseObject: function(object) {
            var self = this,
                parsed, promises, escaped;

            switch (_.objectType(object)) {
                case "Object": {
                    parsed = {};
                    break;
                }

                case "Array": {
                    parsed = [];
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

            _.forEach(object, function(value, key) {
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
            switch (_.objectType(config)) {
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

                            factory = inputs[3] || self.factory;

                            if (_.isObject(factory)) {
                                if (!_.isFunction(factory.factory)) {
                                    throw new TypeError("Given factory object does not have #factory method");
                                }

                                factory = _.bind(factory.factory, factory);
                            } else if (!_.isFunction(factory)) {
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

            if (!_.isString(path)) {
                return this.async.reject(new Error("Path must be a string"));
            }

            options = {
                base: this.options.base
            };

            if (_.isFunction(handler)) {
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
                throw new Error(_.sprintf("Service with key '%s' is not present in configuration", key));
            }

            if (!config.synthetic) {
                throw new Error(_.sprintf("Could not inject service with key '%s', cause it is not synthetic", key));
            }

            this.services[key] = this.async.resolve(service);
        },

        /**
         *
         */
        get: function(key) {
            var config, promise,
                alias,
                isShared, isSynthetic, isAlias, isSingleProperty;

            if (!_.isString(key)) {
                return this.async.reject(new Error(_.sprintf("Key is expected to be string, %s given", typeof key)));
            }

            if (!(config = this.getConfig(key))) {
                return this.async.reject(new Error(_.sprintf("Service with key '%s' is not present in configuration", key)));
            }

            isShared    = _.isBoolean(config.share)     ? config.share     : true;
            isSynthetic = _.isBoolean(config.synthetic) ? config.synthetic : false;
            isAlias     = _.isString(config.alias)      ? true             : false;

            // Sign of custom property (synthetic, aliased or smth)
            isSingleProperty = isSynthetic || isAlias;

            if (!isSingleProperty && !_.isString(config.path)) {
                return this.async.reject(new Error(_.sprintf("Path is expected in service configuration with key '%s'", key)));
            }

            if (isSynthetic && !this.initialized(key)) {
                return this.async.reject(new Error(_.sprintf("Service with key '%s' is synthetic, and not injected yet", key)));
            }

            if (isAlias) {
                if (!this.has(alias = config.alias)) {
                    return this.async.reject(new Error(_.sprintf("Service with key '%s' could not be alias for not existing '%s' service", key, alias)));
                }

                return this.get(alias);
            }

            if (!isShared) {
                promise = this.build(config);
            } else if (!(promise = this.services[key])) {
                promise = this.services[key] = this.build(config);
            }

            return promise;
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
