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

    DM;

/**
 * DM.
 *
 * @class DM
 * @constructor
 *
 * @param {Async}  async
 * @param {Loader} loader
 * @param {Object} [options]
 *
 * @throws {Error}
 * @throws {TypeError}
 */
DM = function(async, loader, options) {
    var _config, _parameters,
        serviceProvider, parameterProvider, resourceProvider;

    _.assert(this   instanceof DM,     "Use constructor with the `new` operator");
    _.assert(async  instanceof Async,  "Async is expected",  TypeError);
    _.assert(loader instanceof Loader, "Loader is expected", TypeError);

    if (!_.isUndefined(options)) {
        _.assert(_.isObject(options), "Options is expected to be an Object", TypeError);
    }

    /**
     * Services map.
     *
     * @private
     * @type {Object}
     */
    _config = null;

    /**
     * Parameters.
     *
     * @private
     * @type {Object}
     */
    _parameters = {};


    /**
     * Options for DM.
     * @type {Object}
     */
    this.options = _.extend({}, this.constructor.DEFAULTS, options || {});

    /**
     * Sets up service map.
     *
     * @param {Object} config
     *
     * @throws {Error}
     * @throws {TypeError}
     */
    this.setConfig = function(config) {
        _.assert(_.isNull(_config),  "Dependency Manager is already configured");
        _.assert(_.isObject(config), "Config is expected to be an Object", TypeError);

        // set up private config
        _config = config;
    };

    /**
     * Returns cloned definition of a configuration for service.
     *
     * @param key
     *
     * @throws {Error}
     *
     * @returns {*}
     */
    this.getConfig = function(key) {
        _.assert(_.isString(key), "Key is expected to be a string", TypeError);
        return _.clone(_config[key]) || null;
    };

    /**
     * Sets up parameters.
     *
     * @param {Object} parameters
     *
     * @throws {TypeError}
     */
    this.setParameters = function(parameters) {
        _.assert(_.isObject(parameters), "Parameters is expected to be an Object", TypeError);

        _.forEach(parameters, function(value, key) {
            this.setParameter(key, value);
        }, this);
    };

    /**
     * Sets up parameter.
     *
     * @param {string} key
     * @param {*}      value
     *
     * @throws {Error}
     * @throws {TypeError}
     */
    this.setParameter = function(key, value) {
        _.assert(_.isString(key),          "Key is expected to be a string", TypeError);
        _.assert(!_.has(_parameters, key), _.sprintf("Parameter '%s' is already exists", key));

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
        _.assert(_.isString(key), "Key is expected to be a string", TypeError);
        return !_.isUndefined(_parameters[key]) ? _parameters[key] : null;
    };

    /**
     * Instances map.
     *
     * @private
     * @type {Object}
     */
    this.services = {};

    // assemble parser
    serviceProvider   = new ServiceProvider(this, async);
    parameterProvider = new ParameterProvider(this, async);
    resourceProvider  = new ResourceProvider(this, async);

    /**
     * Composite parser.
     *
     * @private
     * @type {CompositeParser}
     */
    this.parser = (new CompositeParser(async))
        .add((new ServiceStringParser(async))          .injectProvider(serviceProvider))
        .add((new ParameterStringParser(async))        .injectProvider(parameterProvider))
        .add((new ResourceStringParser(async))         .injectProvider(resourceProvider))
        .add((new ServiceTemplateStringParser(async))  .injectProvider(serviceProvider))
        .add((new ParameterTemplateStringParser(async)).injectProvider(parameterProvider))
        .add((new ResourceTemplateStringParser(async)) .injectProvider(resourceProvider));

    /**
     * Default factory.
     *
     * @private
     * @type {DefaultFactory}
     */
    this.factory = new DefaultFactory();
};

DM.prototype = (function() {

    return {
        constructor: DM,

        /**
         * @private
         * @param {string} string
         *
         * @throws {TypeError}
         *
         * @returns {Promise}
         */
        parseString: function(string) {
            var self = this,
                parser;

            // we throw here and not rejecting,
            // cause it is not an expected situation for this method
            // @see http://stackoverflow.com/a/21891544/1473140
            _.assert(_.isString(string), "String is expected", TypeError);

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

        /**
         * @private
         *
         * @param {Object} object
         *
         * @throws TypeError
         * @returns {Promise}
         */
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
                    // we throw here and not rejecting,
                    // cause it is not an expected situation for this method
                    // @see http://stackoverflow.com/a/21891544/1473140
                    throw new TypeError("Object or Array is expected");
                }
            }

            if ((escaped = DM.unEscape(object))) {
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
         * @public
         *
         * @param {*} config
         *
         * @returns {Promise}
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
         * Builds service.
         *
         * @private
         *
         * @param {Object} config
         *
         * @rejects {TypeError}
         *
         * @returns {Promise}
         */
        build: function(config) {
            var self = this;

            try {
                _.assert(_.isObject(config),      "Config is expected to be an Object",     TypeError);
                _.assert(_.isString(config.path), "Config.path is expected to be a string", TypeError);
            } catch (err) {
                // here we rejecting, not throwing, cause it is an
                // expected situations, when service is not properly configured
                return this.async.reject(err);
            }

            // do not combine path loading and parsing arguments, cause it can produce side effects
            // on amd builds - when dependencies compiled in 'path' file, but loaded earlier from separate files
            return this.loader.require(config.path, this.async)
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
        /**
         * Retrieves resource.
         *
         * @private
         *
         * @param {string} path
         * @param {*}      [handler]
         *
         * @throws TypeError
         * @returns {Promise}
         */
        getResource: function(path, handler) {
            var isHandling, resource, options;

            _.assert(_.isString(path), "Path is expected to be a string", TypeError);

            isHandling = _.isFunction(handler);

            options = {};

            if (isHandling) {
                options.handler = handler;
            }

            resource = this.loader.read(path, this.async);

            return isHandling ? resource.then(handler) : resource;
        },

        /**
         * Checks for service being configured.
         *
         * @param {string} key
         *
         * @throws {TypeError}
         * @returns {boolean}
         */
        has: function(key) {
            _.assert(_.isString(key), "Key is expected to be a string", TypeError);
            return !!this.getConfig(key);
        },

        /**
         * Checks for service being built.
         *
         * @param {string} key
         *
         * @returns {boolean}
         */
        initialized: function(key) {
            _.assert(_.isString(key), "Key is expected to be a string", TypeError);
            return !!this.services[key];
        },

        /**
         * Builds in built service.
         *
         * @param {string} key
         * @param {Object} service
         *
         * @throws Error
         */
        set: function(key, service) {
            var config;

            _.assert(_.isString(key),                "Key is expected to be a string", TypeError);
            _.assert((config = this.getConfig(key)), _.sprintf("Service '%s' is not present in configuration", key));
            _.assert(config.synthetic,               _.sprintf("Could not inject non synthetic service '%s'", key));

            this.services[key] = this.async.resolve(service);
        },

        /**
         * Retrieves service.
         *
         * @param {string} key
         *
         * @returns {Promise}
         */
        get: function(key) {
            var config, promise,
                alias,
                isShared, isSynthetic, isAlias, isSingleProperty;

            // we throw here and not rejecting,
            // cause it is not an expected situation for this method
            // @see http://stackoverflow.com/a/21891544/1473140
            _.assert(_.isString(key), "Key is expected to be a string", TypeError);


            // here we rejecting,
            // cause it is expected situation, when service is not configured
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
DM.DEFAULTS = {
    base: null
};

DM.ESCAPE_FLAG  = '__escape__';
DM.ESCAPE_VALUE = '__value__';
DM.SELF         = "@_@";

DM.escape = function(value) {
    var wrapper = {};

    wrapper[DM.ESCAPE_FLAG] = true;
    wrapper[DM.ESCAPE_VALUE] = value;

    return wrapper;
};

DM.unEscape = function(obj) {
    if (obj[DM.ESCAPE_FLAG] === true) {
        return obj[DM.ESCAPE_VALUE];
    }

    return null;
};

DM.extend = function(prototypeProps, staticProps) {
    return inherits(this, prototypeProps, staticProps);
};


module.exports = DM;

// Module registration
// -------------------
/*
 var isNode = typeof module !== "undefined" && module.exports,
 isAMD = typeof define === 'function' && typeof define.amd === 'object' && define.amd;

 if (isNode) {
 module.exports = DM;
 } else if (isAMD) {
 define([], function() {return DM;});
 } else if ( typeof window === "object" && typeof window.document === "object" ) {
 window.DM = DM;
 }*/
