/**
 * Dependency manager.
 * @package DM
 *
 * @author Sergey Kamardin <gobwas@gmail.com>
 */
(function () { "use strict";

    // Helpers
    // -------

    var slice = Array.prototype.slice,
        toString = Object.prototype.toString,
        Async;

    // Shallow copy of sprintf
    // Only uses '%s' placeholder
    function sprintf(pattern) {
        var args = slice.call(arguments, 1),
            counter = 0;

        if (!isString(pattern)) throw new Error("String is expected");

        return pattern.replace(/%s/g, function(match) {
            return (args[counter++]).toString() || match;
        });
    }

    function objectType(obj) {
        if (obj === void 0) {
            return 'Undefined';
        } else if (obj == null) {
            return 'Null'
        } else {
            return toString.call(obj).replace(/\[object ([a-zA-Z]+)\]/i, '$1');
        }
    }

    function isString(obj) {
        return toString.call(obj) == '[object String]';
    }

    function isNumber(obj) {
        return toString.call(obj) == '[object Number]';
    }

    function isFunction(obj) {
        return toString.call(obj) == '[object Function]';
    }

    function isBoolean(obj) {
        return toString.call(obj) == '[object Boolean]';
    }

    function isDate(obj) {
        return toString.call(obj) == '[object Date]';
    }

    function isObject(obj) {
        return toString.call(obj) == '[object Object]' && obj !== void 0;
    }

    function isRegExp(obj) {
        return toString.call(obj) == '[object RegExp]';
    }

    function isArray(obj) {
        return toString.call(obj) == '[object Array]';
    }

    function isUndefined(obj) {
        return toString.call(obj) == '[object Undefined]' || obj === void 0;
    }

    // Iterates over object
    // Breaks, if iterator return the value
    function forEachOwn(obj, iterator, context) {
        var result;

        for (var x in obj) {
            if (obj.hasOwnProperty(x)) {
                result = iterator.call(context, obj[x], x, obj);

                if (result !== undefined) {
                    return result;
                }
            }
        }

        return result;
    }

    // Iterates over array
    // Breaks, if iterator return the value
    function forEachSimple(arr, iterator, context) {
        var result;

        for (var x = 0; x < arr.length; x++) {
            result = iterator.call(context, arr[x], x, arr);

            if (result !== undefined) {
                return result;
            }
        }

        return result;
    }

    // Clone deeply
    function clone(value) {
        var result, isArr;

        if (typeof value == "object") {

            if (isBoolean(value)) return new Boolean(+value);
            if (isDate(value))    return new Date(+value);
            if (isNumber(value))  return new Number(value);
            if (isString(value))  return new String(value);

            if (isRegExp(value)) {
                result = new RegExp(value.source, /\w*$/.exec(value));
                result.lastIndex = value.lastIndex;
                return result;
            }

            isArr = isArray(value);

            result = isArr ? new Array(value.length) : new Object();

        } else {
            return value;
        }

        (isArr ? forEachSimple : forEachOwn)(value, function(value, key) {
            result[key] = clone(value);
        });

        return result;
    }

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
        var	SERVICE_REGEX = /^@(.*)$/i;

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
                this.async = {
                    all: adapter.all,
                    promise: adapter.promise
                };


                return this.promise(function(reject, resolve) {
                    resolve();
                });
            },


            promise: function(resolver) {
                return new this.async.promise(resolver);
            },

            parseString: function(string) {
                var self = this,
                    args, handler, path;

                if (isString(string)) {
                    if (string.match(PROPERTY_REGEX)) {
                        return this.getParameter(string.replace(PROPERTY_REGEX, '$1'));
                    }

                    if (string.match(SERVICE_REGEX)) {
                        return this.get(string.replace(SERVICE_REGEX, '$1'));
                    }

                    if (string.match(RESOURCE_REGEX)) {
                        args = string.match(RESOURCE_REGEX);
                        handler = args[1];
                        path    = args[2];
                        return this.getResource.call(self, path, handler);
                    }

                    return new Promise(function(resolve){resolve(string)});
                }

                throw new Error("String is expected");
            },

            /**
             * Finds out references to services, parameters and resources in given object.
             * Returns promise of getting them, which is resolved then with object
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
                        promises = [],
                        parsed, iterator;

                    return new Promise(function(resolve, reject) {
                        if (isArray(config)) {
                            parsed = [];
                            iterator = forEachSimple;
                        } else if (isObject(config)) {
                            parsed = {};
                            iterator = forEachOwn;
                        } else {
                            return config;
                        }

                        iterator(config, function(value, key) {
                            var parsedValue;

                            switch (objectType(value)) {
                                case 'String':
                                    parsedValue = self.parseString(value);
                                    break;
                                case 'Object':
                                case 'Array':
                                    parsedValue = escaper(value) || self.parse(value);
                                    break;
                                default:
                                    parsedValue = value;
                                    break;
                            }

                            promises.push(parsedValue);

                            parsedValue
                                .then(function(value) {
                                    parsed[key] = value;
                                });
                        });

                        Promise.all(promises)
                            .then(function() {
                                deferred.resolve(parsed);
                            })
                            .catch(reject);


                        return deferred.promise();
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
                    var self     =  this,
                        config, path, args, calls, properties;

                    if (!(config = this.getConfig(key))) {
                        throw new Error(sprintf("Service with key '%s' is not present in configuration", key));
                    }

                    path       = config.path;
                    args       = config.arguments  || [];
                    calls      = config.calls      || [];
                    properties = config.properties || {};

                    require([path], function(constructor) {
                        // Need parse things here to prevent premature load of service dependencies
                        // They could be included via r.js in upper module level
                        var args       = self.parse(args),
                            calls      = self.parse(calls),
                            properties = self.parse(properties);

                        $.when(args, calls, properties)
                            .done(function(args, calls, properties) {
                                // Arguments
                                var service = newInstanceArgs(constructor, args);

                                // Calls
                                forEachSimple(calls, function(call) {
                                    makeCall(service, call[0], call[1]);
                                });

                                // Properties
                                forEachOwn(properties, function(value, key) {
                                    service[key] = value;
                                });

                                deferred.resolve(service);
                            });

                    }, function(err) {
                        console.error("Could not load path for service: %s", path, err);
                        deferred.reject(err);
                    });

                    return deferred.promise();
                }
            })(),

            getResource: function(path, handler) {
                var deferred = $.Deferred();

                if (handler) {
                    this.parseString(handler).done(function(handler) {
                        if (isString(handler)) {
                            require([sprintf('%s!%s', handler, path)], function(resource) {
                                deferred.resolve(resource);
                            });
                        } else if (isFunction(handler)) {
                            require([path], function(resource) {
                                deferred.resolve(handler.call(null, resource));
                            });
                        } else {
                            deferred.reject(new Error("Can not parse handler"));
                        }
                    });
                } else {
                    require([path], function(resource) {
                        deferred.resolve(resource);
                    });
                }

                return deferred.promise();
            },

            /**
             * Возвращает сервис.
             *
             * @param key {String}
             *
             * @returns {$.Deferred.promise}
             */
            get: function(key) {
                var self = this;

                if (!isString(key)) {
                    throw new Error(sprintf("Necessary string parameter expected, '%s' given", typeof key));
                }

                if (this.services[key]) {
                    return this.services[key];
                }

                return this.services[key] = this.build(key).done(function(service) {
                    self.servicesInstances[key] = service;
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



    // Module registration
    // -------------------

    var isNode = typeof module !== "undefined" && module.exports,
        isAMD = typeof define === 'function' && typeof define.amd === 'object' && define.amd;

    if (isNode) {
        module.exports = DependencyManager;
    } else if (isAMD) {
        define([], function() {return DependencyManager;});
    } else if ( typeof window === "object" && typeof window.document === "object" ) {
        window.DependencyManager = DependencyManager;
    }

})();