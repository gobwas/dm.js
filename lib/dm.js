var inherits = require("inherits-js"),
    _        = require("./utils"),
    Async    = require("./async"),
    Loader   = require("./loader"),

    ConstructorFactory = require("./factory/constructor"),
    FunctionFactory = require("./factory/function"),
    ProxyFactory = require("./factory/proxy"),

    DeferredProvider        = require("./provider/deferred"),
    ServiceProvider         = require("./provider/service/default"),
    ParameterProvider       = require("./provider/parameter/default"),
    ResourceProvider        = require("./provider/resource/default"),
    DMProvider              = require("./provider/dm/default"),
    SlugProvider            = require("./provider/slug/default"),
    SimpleLoadProvider      = require("./provider/load/simple"),
    JSONPointerLoadProvider = require("./provider/load/json-pointer"),

    ServiceTemplate          = require("./parser/string/template/service"),
    ServiceLiveTemplate      = require("./parser/string/template/service/live"),
    ServiceDeferredTemplate  = require("./parser/string/template/service/deferred"),
    ParameterTemplate        = require("./parser/string/template/parameter"),
    ParameterLiveTemplate    = require("./parser/string/template/parameter/live"),
    ResourceTemplate         = require("./parser/string/template/resource"),
    ResourceLiveTemplate     = require("./parser/string/template/resource/live"),
    ResourceDeferredTemplate = require("./parser/string/template/resource/deferred"),
    HypnofrogTemplate        = require("./parser/string/template/hypnofrog"),
    SlugTemplate             = require("./parser/string/template/slug"),
    SlugLiveTemplate         = require("./parser/string/template/slug/live"),
    PathTemplate             = require("./parser/string/template/path"),
    JSONPointerPathTemplate  = require("./parser/string/template/json-pointer"),

    SingleStringParser   = require("./parser/string/single"),
    MultipleStringParser = require("./parser/string/multiple"),

    StringifyProcessingParser = require("./parser/wrapping/processing/stringify"),

    CompositeParser = require("./parser/composite"),
    EventualParser  = require("./parser/wrapping/eventual"),

    DM;

/**
 * @class DM
 * @constructor
 *
 * @param {Async}  async
 * @param {Loader} loader
 * @param {Object} [config]
 *
 * @throws {Error}
 * @throws {TypeError}
 */
DM = function(async, loader, config) {
    var self = this,
        options, parameters, services,
        serviceProvider, parameterProvider, resourceProvider, dmProvider,
        serviceDeferredProvider, resourceDeferredProvider;

    _.assert(this   instanceof DM,     "Use constructor with the `new` operator");
    _.assert(async  instanceof Async,  "Async is expected",  TypeError);
    _.assert(loader instanceof Loader, "Loader is expected", TypeError);

    /**
     * Async adapter.
     *
     * @private
     * @type {Async}
     */
    this.async = async;

    /**
     * Loader adapter.
     *
     * @private
     * @type {Loader}
     */
    this.loader = loader;

    /**
     * Instances map.
     *
     * @private
     * @type {Object}
     */
    this.services = {};

    /**
     * Forthcoming synthetic services map.
     *
     * @private
     * @type {Object}
     */
    this.forthcoming = {};

    /**
     * Definitions map.
     *
     * @private
     * @type {Object}
     */
    this.definitions = {};

    /**
     * Parameters.
     *
     * @private
     * @type {Object}
     */
    this.parameters = {};

    /**
     * Options.
     *
     * @private
     * @type {Object}
     */
    this.options = _.extend({}, this.constructor.DEFAULTS);

    // assemble parser
    serviceProvider   = new ServiceProvider(this, async);
    parameterProvider = new ParameterProvider(this, async);
    resourceProvider  = new ResourceProvider(this, async);
    dmProvider        = new DMProvider(this, async);

    serviceDeferredProvider  = new DeferredProvider(this, async, {}, serviceProvider);
    resourceDeferredProvider = new DeferredProvider(this, async, {}, resourceProvider);

    // assemble parsers chain
    this.parsersChain = (new CompositeParser(async))
        .add(new SingleStringParser(async, new ServiceTemplate(), serviceProvider))
        .add(new SingleStringParser(async, new ParameterTemplate(), parameterProvider))
        .add(new SingleStringParser(async, new ResourceTemplate(), resourceProvider))
        .add(new SingleStringParser(async, new HypnofrogTemplate(), dmProvider))
        .add(new SingleStringParser(async, new ServiceDeferredTemplate(), serviceDeferredProvider))
        .add(new SingleStringParser(async, new ResourceDeferredTemplate(), resourceDeferredProvider))
        .add(new StringifyProcessingParser(async, new MultipleStringParser(async, new ServiceLiveTemplate(), serviceProvider)))
        .add(new StringifyProcessingParser(async, new MultipleStringParser(async, new ParameterLiveTemplate(), parameterProvider)))
        .add(new StringifyProcessingParser(async, new MultipleStringParser(async, new ResourceLiveTemplate(), resourceProvider)));

    /**
     * Parser.
     *
     * @private
     * @type {EventualParser}
     */
    this.parser = new EventualParser(async, this.parsersChain);

    /**
     * Parser.
     *
     * @private
     * @type {CompositeParser}
     */
    this.loadParser = (new CompositeParser(async))
        .add(new SingleStringParser(async, new JSONPointerPathTemplate(), new JSONPointerLoadProvider(loader, async)))
        .add(new SingleStringParser(async, new PathTemplate(), new SimpleLoadProvider(loader, async)));

    /**
     * Default factory.
     *
     * @private
     * @type {ConstructorFactory}
     */
    this.factory = {};
    this.factory["constructor"] = new ConstructorFactory();
    this.factory["function"]    = new FunctionFactory();
    this.factory["proxy"] = new ProxyFactory();

    if (!_.isUndefined(config)) {
        _.assert(_.isObject(config), "Config is expected to be an Object", TypeError);

        if (_.isObject((parameters = config.parameters))) {
            _.forEach(parameters, function(value, key) {
                self.setParameter(key, value);
            });
        }

        if (_.isObject((services = config.services))) {
            _.forEach(services, function(definition, key) {
                self.setDefinition(key, definition);
            });
        }

        if (_.isObject(options = config.options)) {
            _.extend(this.options, options);
        }
    }
};

/**
 * @lends DM.prototype
 */
DM.prototype = {
    constructor: DM,

    /**
     * Sets up service definition.
     *
     * @param {string} key
     * @param {Object} definition
     */
    setDefinition: function(key, definition) {
        _.assert(_.isString(key),        "Key is expected to be a string",         TypeError);
        _.assert(_.isObject(definition), "Definition is expected to be an Object", TypeError);

        _.assert(!_.has(this.definitions, key), _.sprintf("Definition for the service '%s' has been already set", key));

        this.definitions[key] = definition;
    },

    /**
     * Returns service definition.
     *
     * @param {string} key
     *
     * @returns {Object}
     */
    getDefinition: function(key) {
        _.assert(_.isString(key), "Key is expected to be a string", TypeError);

        return this.definitions[key];
    },

    /**
     * Returns map of definitions.
     *
     * @returns {Object}
     */
    getDefinitions: function() {
        return this.definitions;
    },

    /**
     * Sets up parameter.
     *
     * @param key
     * @param value
     *
     * @throws {Error}
     * @throws {TypeError}
     */
    setParameter: function(key, value) {
        _.assert(_.isString(key),              "Key is expected to be a string", TypeError);
        _.assert(!_.has(this.parameters, key), _.sprintf("Parameter '%s' is already exists", key));

        this.parameters[key] = value;
    },

    /**
     * Returns parameter.
     *
     * @param key
     *
     * @throws {TypeError}
     *
     * @returns {*}
     */
    getParameter: function(key) {
        _.assert(_.isString(key), "Key is expected to be a string", TypeError);

        return this.parameters[key];
    },

    /**
     * Returns all parameters.
     *
     * @returns {Object}
     */
    getParameters: function() {
        return this.parameters;
    },

    /**
     * Finds out references to services, parameters and resources in given object.
     * Returns promise of getting them, which is resolved then with object having parsed values.
     *
     * @public
     *
     * @param {*}      value
     * @param {Parser} parser
     *
     * @returns {Promise}
     */
    parse: function(value, parser) {
        switch (_.objectType(value)) {
            case 'String': {
                return this.parseString(value, parser);
            }

            case 'Object':
            case 'Array': {
                return this.parseIterable(value, parser);
            }

            default: {
                return this.async.resolve(value);
            }
        }
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

        return !!this.getDefinition(key);
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
        var definition, forthcoming;

        _.assert(_.isString(key), "Key is expected to be a string", TypeError);

        // if set will return Promise, these errors must be in rejection state, async.
        _.assert(!this.initialized(key),                 _.sprintf("Service '%s' is already set", key));
        _.assert((definition = this.getDefinition(key)), _.sprintf("Definition is not found for the '%s' service", key));
        _.assert(definition.synthetic,                   _.sprintf("Could not inject non synthetic service '%s'", key));

        this.services[key] = this.async.resolve(service);

        // resolve pending requests came before
        if ((forthcoming = this.forthcoming[key])) {
            forthcoming.resolve(service);
        }
    },

    /**
     * Retrieves service.
     *
     * @param {string}  key
     *
     * @returns {Promise}
     */
    get: function(key) {
        var self = this,
            definition, promise,
            alias,
            isShared, isSynthetic, isAlias, isSingleProperty, isLazy,
            forthcoming;

        // we throw here and not rejecting,
        // cause it is not an expected situation for this method
        // @see http://stackoverflow.com/a/21891544/1473140
        _.assert(_.isString(key), "Key is expected to be a string", TypeError);

        // here we rejecting,
        // cause it is expected situation, when service is not defined
        if (!(definition = this.getDefinition(key))) {
            return this.async.reject(new Error(_.sprintf("Definition is not found for the '%s' service", key)));
        }

        isShared    = _.isBoolean(definition.share)     ? definition.share     : true;
        isSynthetic = _.isBoolean(definition.synthetic) ? definition.synthetic : false;
        isAlias     = _.isString(definition.alias)      ? true                 : false;
        isLazy      = _.isBoolean(definition.lazy)      ? definition.lazy      : false;

        // Sign of custom property (synthetic, aliased or smth)
        isSingleProperty = isSynthetic || isAlias;

        if (!isSingleProperty && !_.isString(definition.path)) {
            return this.async.reject(new Error(_.sprintf("Path is expected in definition of service '%s'", key)));
        }

        if (isSynthetic && !this.initialized(key)) {
            if (!(forthcoming = this.forthcoming[key])) {
                forthcoming = this.forthcoming[key] = this.async.defer();
            }

            return forthcoming.promise;
        }

        if (isAlias) {
            if (!this.has(alias = definition.alias)) {
                return this.async.reject(new Error(_.sprintf("Service '%s' could not be alias for not existing '%s' service", key, alias)));
            }

            return this.get(alias);
        }

        if (isShared && (promise = this.services[key])) {
            return promise;
        }

        if (isLazy) {
            promise = this.async.resolve(
                function() {
                    return self.build(definition, Array.prototype.slice.call(arguments));
                }
            );
        } else {
            promise = this.build(definition);
        }

        if (isShared) {
            this.services[key] = promise;
        }

        return promise;
    },



    /**
     * @private
     *
     * @param {string} string
     * @param {Parser} parser
     *
     * @throws {TypeError}
     *
     * @returns {Promise}
     */
    parseString: function(string, parser) {
        // we throw here and not rejecting,
        // cause it is not an expected situation for this method
        // @see http://stackoverflow.com/a/21891544/1473140
        // also the good example is behaviour of `fs` module
        _.assert(_.isString(string), "String is expected", TypeError);

        return (parser || this.parser).parse(string);
    },

    /**
     * @private
     *
     * @param {Object|Array} object
     * @param {Parser} parser
     *
     * @throws TypeError
     * @returns {Promise}
     */
    parseIterable: function(object, parser) {
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
            promises.push(self.parse(value, parser).then(function(value) {
                parsed[key] = value;
            }));
        });

        return self.async.all(promises)
            .then(function() {
                return parsed;
            });
    },

    /**
     * Builds service.
     *
     * @param {Object} definition
     * @param {Array} [slugs] for the lazy services
     *
     * @rejects {TypeError}
     *
     * @todo should it be private?
     *
     * @returns {Promise}
     */
    build: function(definition, slugs) {
        var self = this,
            parser, slugProvider;

        _.assert(_.isObject(definition), "Object is expected", TypeError);

        if (definition.lazy) {
            _.assert(_.isArray(slugs), "Slugs is expected to be an Array for the lazy services", TypeError);

            slugProvider = new SlugProvider(this, this.async, {}, slugs);

            parser = new EventualParser(
                this.async,
                this.parsersChain.clone()
                    .add(new SingleStringParser(this.async, new SlugTemplate(), slugProvider), true)
                    .add(new StringifyProcessingParser(this.async, new MultipleStringParser(this.async, new SlugLiveTemplate(), slugProvider)))
            );
        } else {
            parser = this.parser;
        }

        try {
            _.assert(_.isString(definition.path), "definition.path is expected to be a string", TypeError);
        } catch (err) {
            // here we rejecting, not throwing, cause it is an
            // expected situations, when service is not properly configured
            return this.async.reject(err);
        }

        // do not combine path loading and parsing arguments, cause it can produce side effects
        // on amd builds - when dependencies compiled in 'path' file, but loaded earlier from separate files
        return this.parse(definition.path)
            .then(function(path) {
                return self.loadParser.parse(path);
            })
            .then(function(operand) {
                return self.parse(_.omit(definition, "path"), parser)
                    .then(function(def) {
                        var definition, factory, make;

                        definition = _.extend({
                            operand:    operand,
                            arguments:  [],
                            calls:      [],
                            properties: {}
                        }, def);

                        switch (_.objectType(factory = definition.factory)) {
                            case "String": {
                                _.assert(_.has(self.factory, factory), 'Unknown type of factory: "' + factory + '"');
                                factory = self.factory[factory];
                                make = _.bind(factory.factory, factory);
                                break;
                            }

                            case "Object": {
                                _.assert(_.isFunction(factory.factory), "Given factory object does not have #factory method");
                                make = _.bind(factory.factory, factory);
                                break;
                            }

                            case "Function": {
                                make = factory;
                                break;
                            }

                            default: {
                                factory = self.factory["constructor"];
                                make = _.bind(factory.factory, factory);
                            }
                        }

                        // could be a value or a Promise
                        return make(definition);
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
    }
};

// Default options
DM.DEFAULTS     = {};
DM.ESCAPE_FLAG  = '__escape__';
DM.ESCAPE_VALUE = '__value__';
DM.SELF         = "@_@";

/**
 * @memberof DM
 * @static
 */
DM.escape = function(value) {
    var wrapper = {};

    wrapper[DM.ESCAPE_FLAG] = true;
    wrapper[DM.ESCAPE_VALUE] = value;

    return wrapper;
};

/**
 * @memberof DM
 * @static
 */
DM.unEscape = function(obj) {
    if (obj[DM.ESCAPE_FLAG] === true) {
        return obj[DM.ESCAPE_VALUE];
    }

    return null;
};

/**
 * @memberof DM
 * @static
 */
DM.extend = function(prototypeProps, staticProps) {
    return inherits(this, prototypeProps, staticProps);
};


module.exports = DM;