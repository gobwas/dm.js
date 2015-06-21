var DM        = require("../../lib/dm"),
    RSVP      = require("rsvp"),
    RSVPAsync = require("../../lib/async/rsvp"),
    CJSLoader = require("../../lib/loader/cjs"),
    Chance    = require("chance"),
    chai      = require("chai"),
    sinon     = require("sinon"),

    expect = chai.expect,
    chance = new Chance;


describe("DM`s functionality", function() {
    var dm, async, loader;

    beforeEach(function() {
        // clear cache
        delete require.cache[__dirname + "/src/universal.js"];
        delete require.cache[__dirname + "/src/package.js"];

        dm = new DM((async = new RSVPAsync(RSVP)), (loader = new CJSLoader(require, { base: __dirname })));
    });

    describe("configuration actions", function() {

        it("should make calls", function(done) {
            var argument;

            argument = {};

            dm.setDefinition("service", {
                path: "./src/universal.js",
                "calls": [
                    [ "method", [argument] ]
                ]
            });

            dm
                .get("service")
                .then(function(service) {
                    expect(service.method.callCount).equal(1);
                    expect(service.method.calledWithExactly(argument)).true();
                })
                .then(done, done);
        });

        it("should pass arguments", function(done) {
            var argument;

            argument = {};

            dm.setDefinition("service", {
                path: "./src/universal.js",
                "arguments": [argument]
            });

            dm
                .get("service")
                .then(function(service) {
                    expect(service.constructor.callCount).equal(1);
                    expect(service.constructor.calledWithExactly(argument)).true();
                })
                .then(done, done);
        });

        it("should set properties", function(done) {
            var property, value, properties;

            property = chance.word();
            value = {a: chance.word()};

            (properties = {})[property] = value;

            dm.setDefinition("service", {
                path: "./src/universal.js",
                properties: properties
            });

            dm
                .get("service")
                .then(function(service) {
                    // deep here means, that value !== service[property]
                    // dm tries to parse object recursively, so it just cloned
                    // to prevent this unequality use DM.escape
                    expect(service).have.property(property).that.deep.equal(value);
                })
                .then(done, done);
        });

        it("should alias service", function(done) {
            dm.setDefinition("service", {
                path: "./src/universal.js"
            });

            dm.setDefinition("alias", {
                alias: "service"
            });

            RSVP
                .all([dm.get("service"), dm.get("alias")])
                .then(function(list) {
                    var service, alias;

                    service = list[0];
                    alias   = list[1];

                    expect(service).equal(alias);
                })
                .then(done, done);
        });

        it("should not share service", function(done) {
            dm.setDefinition("service", {
                path: "./src/universal.js",
                share: false
            });

            RSVP
                .all([dm.get("service"), dm.get("service")])
                .then(function(list) {
                    expect(list[0]).not.equal(list[1]);
                })
                .then(done, done);
        });

        it("should use synthetic service", function(done) {
            var obj;

            obj = {};

            dm.setDefinition("service", {
                synthetic: true
            });

            dm
                .get("service")
                .then(function(service) {
                    expect(service).equal(obj);
                })
                .then(done, done);

            dm.set("service", obj);
        });

        it("should use factory 'constructor'", function(done) {
            var obj, ctor, args, argument, properties,
                Service, property, value;

            Service = require("./src/universal.js");

            args = [chance.word()];
            (properties = {})[(property = chance.word())] = (value = {});

            argument = {};

            dm.setDefinition("service", {
                path: "./src/package.js#/universal",
                factory: "constructor",
                arguments: DM.escape(args),
                calls: [
                    [ "method", [ DM.escape(argument) ] ]
                ],
                properties: DM.escape(properties)
            });

            dm
                .get("service")
                .then(function(service) {
                    expect(service.constructor.callCount).equal(1);
                    expect(service.constructor.firstCall.args).deep.equal(args);

                    expect(service.method.callCount).equal(1);
                    expect(service.method.calledWithExactly(argument)).true();

                    expect(service).have.property(property).that.equal(value);
                })
                .then(done, done);
        });

        it("should use factory 'function'", function(done) {
            var obj, ctor, args, argument, properties,
                pkg, property, value;

            pkg = require("./src/package.js");

            args = [chance.word()];
            (properties = {})[(property = chance.word())] = (value = {});

            argument = {};

            dm.setDefinition("service", {
                path: "./src/package.js#/func",
                factory: "function",
                arguments: DM.escape(args),
                calls: [
                    [ "method", [ DM.escape(argument) ] ]
                ],
                properties: DM.escape(properties)
            });

            dm
                .get("service")
                .then(function(service) {
                    expect(pkg.func.callCount).equal(1);
                    expect(pkg.func.firstCall.args).deep.equal(args);

                    expect(service.method.callCount).equal(1);
                    expect(service.method.calledWithExactly(argument)).true();

                    expect(service).have.property(property).that.equal(value);
                })
                .then(done, done);
        });

        it("should use factory 'proxy'", function(done) {
            var obj, ctor, args, argument, properties,
                pkg, property, value;

            (properties = {})[(property = chance.word())] = (value = {});

            argument = {};

            dm.setDefinition("service", {
                path: "./src/package.js#/obj",
                factory: "proxy",
                calls: [
                    [ "method", [ DM.escape(argument) ] ]
                ],
                properties: DM.escape(properties)
            });

            dm
                .get("service")
                .then(function(service) {
                    expect(service.method.callCount).equal(1);
                    expect(service.method.calledWithExactly(argument)).true();

                    expect(service).have.property(property).that.equal(value);
                })
                .then(done, done);
        });

        it("should throw error when factory is 'proxy' and needle is primitive but properties was declared", function(done) {
            var obj, ctor, args, argument, properties,
                pkg, property, value;

            (properties = {})[(property = chance.word())] = (value = {});

            argument = {};

            dm.setDefinition("service", {
                path: "./src/package.js#/str",
                factory: "proxy",
                properties: DM.escape(properties)
            });

            dm
                .get("service")
                .then(function() {
                    done(new Error("Expected error"));
                })
                .catch(function(err) {
                    expect(err).instanceOf(TypeError);
                    expect(err.message).equal("Trying to set property of non object")
                })
                .then(done, done);
        });

        it("should throw error when factory is 'proxy' and needle is primitive but calls was declared", function(done) {
            var obj, ctor, args, argument, properties,
                pkg, property, value;

            argument = {};

            dm.setDefinition("service", {
                path: "./src/package.js#/num",
                factory: "proxy",
                calls: [
                    [ "method", [ DM.escape(argument) ] ]
                ]
            });

            dm
                .get("service")
                .then(function() {
                    done(new Error("Expected error"));
                })
                .catch(function(err) {
                    expect(err).instanceOf(TypeError);
                    expect(err.message).equal("Trying to call method of non object")
                })
                .then(done, done);
        });

        it("should use given factory", function(done) {
            var factory,
                ctor, args, calls, properties;

            factory = sinon.spy();
            ctor = function(){};

            args = [];
            calls = [];
            properties = {};

            dm.setDefinition("service", {
                path: "./src/universal.js",
                arguments:  DM.escape(args),
                calls:      DM.escape(calls),
                properties: DM.escape(properties),
                factory: "@factory"
            });

            dm.setDefinition("factory", {
                synthetic: true
            });

            dm.set("factory", factory);

            sinon.stub(loader, "require", function() {
                return RSVP.Promise.resolve(ctor);
            });

            dm
                .get("service")
                .then(function() {
                    var call;

                    expect(call = factory.firstCall).to.exist();
                    expect(call.args[0].operand).equal(ctor);
                    expect(call.args[0].arguments).equal(args);
                    expect(call.args[0].calls).equal(calls);
                    expect(call.args[0].properties).equal(properties);
                })
                .then(done, done);
        });

        // todo lazy
    });

    describe("configuration parsing", function() {
        var text;

        before(function(done) {
            var fs = require("fs");

            text = fs.readFile(__dirname + "/resource/text.txt", function(err, contents) {
                if (err) {
                    done(err);
                    return;
                }

                text = contents.toString();
                done();
            });
        });

        describe("Resource", function() {

            it("should parse resource template", function(done) {
                dm.setDefinition("service", {
                    path: "./src/universal.js",
                    "calls": [
                        [ "method", ["#./resource/text.txt#"] ]
                    ]
                });

                dm
                    .get("service")
                    .then(function(service) {
                        expect(service.method.firstCall.calledWithExactly(text)).true();
                    })
                    .then(done, done);
            });

            it("should parse resource live template", function(done) {
                var addition,
                    liveText;

                addition = chance.word();
                liveText = text + addition;

                dm.setDefinition("service", {
                    path: "./src/universal.js",
                    "calls": [
                        [ "method", ["#{./resource/text.txt}" + addition] ]
                    ]
                });

                dm
                    .get("service")
                    .then(function(service) {
                        expect(service.method.firstCall.calledWithExactly(liveText)).true();
                    })
                    .then(done, done);
            });

        });


        describe("Parameter", function() {
            var parameter, value;

            beforeEach(function() {
                parameter = chance.word();

                value = {};
                value[chance.word()] = chance.word();
                value.toString = (function() {
                    var str;

                    str = chance.word();

                    return function() {
                        return str;
                    }
                })();

                dm.setParameter(parameter, value);
            });

            it("should parse parameter template", function(done) {
                dm.setDefinition("service", {
                    path: "./src/universal.js",
                    "calls": [
                        [ "method", ["%" + parameter + "%"] ]
                    ]
                });

                dm
                    .get("service")
                    .then(function(service) {
                        expect(service.method.firstCall.calledWithExactly(value)).true();
                    })
                    .then(done, done);
            });

            it("should parse parameter live template", function(done) {
                var addition,
                    liveText;

                addition = chance.word();
                liveText = value.toString() + addition;

                dm.setDefinition("service", {
                    path: "./src/universal.js",
                    "calls": [
                        [ "method", ["%{" + parameter + "}" + addition] ]
                    ]
                });

                dm
                    .get("service")
                    .then(function(service) {
                        expect(service.method.firstCall.calledWithExactly(liveText)).true();
                    })
                    .then(done, done);
            });

        });


        describe("Service", function() {
            var dependency, dependencyService, dependencyMethodResult;

            beforeEach(function() {
                dependency = chance.word();
                dependencyMethodResult = {};

                dependencyService = {
                    toString: (function() {
                        var str;

                        str = chance.word();

                        return function() {
                            return str;
                        }
                    })(),

                    method: sinon.spy(function() {
                        return dependencyMethodResult;
                    })
                };

                dm.setDefinition(dependency, {
                    synthetic: true
                });

                dm.set(dependency, dependencyService);
            });

            it("should parse service template", function(done) {
                dm.setDefinition("service", {
                    path: "./src/universal.js",
                    "calls": [
                        [ "method", ["@" + dependency] ]
                    ]
                });

                dm
                    .get("service")
                    .then(function(service) {
                        expect(service.method.firstCall.calledWithExactly(dependencyService)).true();
                    })
                    .then(done, done);
            });

            it("should parse lazy service", function(done) {
                var slug;

                slug = {};

                dm.setDefinition("service", {
                    path: "./src/universal.js",
                    lazy: true,
                    "calls": [
                        [ "method", ["$0"] ]
                    ]
                });

                dm
                    .get("service")
                    .then(function(provider) {
                        expect(typeof provider).equal("function");
                        return provider(slug);
                    })
                    .then(function(service) {
                        expect(service.method.firstCall.calledWithExactly(slug)).true();
                    })
                    .then(done, done);
            });

            it("should parse lazy service with live slug", function(done) {
                dm.setDefinition("service", {
                    path: "./src/universal.js",
                    lazy: true,
                    "calls": [
                        [ "method", ["${0}abc"] ]
                    ]
                });

                dm
                    .get("service")
                    .then(function(provider) {
                        expect(typeof provider).equal("function");
                        return provider(123);
                    })
                    .then(function(service) {
                        expect(service.method.firstCall.args[0]).equal("123abc");
                    })
                    .then(done, done);
            });

            it("should parse lazy shared service", function(done) {
                var firstProvider, firstService, slug1, slug2;

                slug1 = {};
                slug2 = {};

                dm.setDefinition("service", {
                    path: "./src/universal.js",
                    lazy: true,
                    share: true,
                    "calls": [
                        [ "method", ["$0"] ]
                    ]
                });

                dm
                    .get("service")
                    .then(function(provider) {
                        firstProvider = provider;
                        return provider(slug1);
                    })
                    .then(function(service) {
                        firstService = service;

                        expect(service.method.firstCall.calledWithExactly(slug1)).true();

                        return dm.get("service");
                    })
                    .then(function(provider) {
                        expect(provider).equal(firstProvider);

                        return provider(slug2);
                    })
                    .then(function(service) {
                        expect(service).not.equal(firstService);

                        expect(service.method.firstCall.calledWithExactly(slug2)).true();
                    })
                    .then(done, done);
            });

            it("should parse service live template", function(done) {
                var addition,
                    liveText;

                addition = chance.word();
                liveText = dependencyService.toString() + addition;

                dm.setDefinition("service", {
                    path: "./src/universal.js",
                    "calls": [
                        [ "method", ["@{" + dependency + "}" + addition] ]
                    ]
                });

                dm
                    .get("service")
                    .then(function(service) {
                        expect(service.method.firstCall.calledWithExactly(liveText)).true();
                    })
                    .then(done, done);
            });

            it("should parse service calling", function(done) {
                var args;

                args = [chance.word(), chance.integer(), {}];

                dm.setDefinition("service", {
                    path: "./src/universal.js",
                    "calls": [
                        [ "method", [ "@" + dependency + ":method" + JSON.stringify(args) ] ]
                    ]
                });

                dm
                    .get("service")
                    .then(function(service) {
                        var firstCall;

                        expect(firstCall = dependencyService.method.firstCall).to.exist();
                        expect(firstCall.calledWithExactly.apply(firstCall, args)).true();
                        expect(service.method.firstCall.calledWithExactly(dependencyMethodResult)).true();

                    })
                    .then(done, done);
            });

            it("should parse service path as json-pointer", function(done) {
                var args, Service;

                Service = require("./src/klass.js");

                dm.setDefinition("package.service", {
                    path: "./src/package.js#/service"
                });

                dm.setDefinition("package.child", {
                    path: "./src/package.js#/children/0"
                });

                RSVP
                    .all([dm.get("package.service"), dm.get("package.child")])
                    .then(function(list) {
                        var packageService, packageChild;

                        packageService = list[0];
                        packageChild   = list[1];

                        expect(packageService).to.be.instanceOf(Service);
                        expect(packageChild).to.be.instanceOf(Service);
                    })
                    .then(done, done);
            });

            // todo circular dependency

        });

        describe("DM", function() {

            it("should parse hypnofrog link to the dm", function(done) {
                dm.setDefinition("service", {
                    path: "./src/universal.js",
                    "calls": [
                        [ "method", [ "@_@" ] ]
                    ]
                });

                dm
                    .get("service")
                    .then(function(service) {
                        expect(service.method.firstCall.calledWithExactly(dm)).true();
                    })
                    .then(done, done);
            });

        });


        describe("Fury", function() {

            it("should parse live parameter, then resource", function(done) {
                var dir;

                dir = chance.word();

                dm.setParameter(dir, "./resource");

                dm.setDefinition("service", {
                    path: "./src/universal.js",
                    "calls": [
                        [ "method", ["#%{" + dir + "}/text.txt#"] ]
                    ]
                });

                dm
                    .get("service")
                    .then(function(service) {
                        expect(service.method.firstCall.calledWithExactly(text)).true();
                    })
                    .then(done, done);

            });

            it("should parse live parameter, then live resource, then add text", function(done) {
                var dir, addition, liveText;

                addition = chance.word();
                liveText = text + addition;

                dir = chance.word();

                dm.setParameter(dir, "./resource");

                dm.setDefinition("service", {
                    path: "./src/universal.js",
                    "calls": [
                        [ "method", ["#{%{" + dir + "}/text.txt}" + addition] ]
                    ]
                });

                dm
                    .get("service")
                    .then(function(service) {
                        expect(service.method.firstCall.calledWithExactly(liveText)).true();
                    })
                    .then(done, done);
            });

            it("should parse live parameter, then live resource, then add text, then get service", function(done) {
                var dir, addition, liveText, dependency;

                addition = chance.word();
                liveText = text + addition;
                dependency = {};

                dir = chance.word();

                dm.setParameter(dir, "./resource");

                dm.setDefinition(liveText, {
                    synthetic: true
                });

                dm.setDefinition("service", {
                    path: "./src/universal.js",
                    "calls": [
                        [ "method", ["@#{%{" + dir + "}/text.txt}" + addition] ]
                    ]
                });

                dm
                    .get("service")
                    .then(function(service) {
                        expect(service.method.firstCall.calledWithExactly(dependency)).true();
                    })
                    .then(done, done);

                dm.set(liveText, dependency);
            });

        });

        // todo insane things

    });

});

