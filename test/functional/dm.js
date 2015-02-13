var DM        = require("../../lib/dm"),
    RSVP      = require("rsvp"),
    RSVPAsync = require("../../lib/async/rsvp"),
    CJSLoader = require("../../lib/loader/cjs"),
    Chance    = require("chance"),
    chai      = require("chai"),

    expect = chai.expect,
    chance = new Chance;


describe("DM`s functionality", function() {
    var dm;

    beforeEach(function() {
        // clear cache
        try {
            delete require.cache[__dirname + "/src/universal.js"];
        } catch (err) {}

        dm = new DM(new RSVPAsync(RSVP), new CJSLoader(require, { base: __dirname }));
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
                    expect(service.method.calledWithExactly(argument));
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
                    expect(service.constructor.calledWithExactly(argument));
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
                        expect(service.method.firstCall.calledWithExactly(text));
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
                        expect(service.method.firstCall.calledWithExactly(liveText));
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
                        expect(service.method.firstCall.calledWithExactly(value));
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
                        expect(service.method.firstCall.calledWithExactly(liveText));
                    })
                    .then(done, done);
            });

        });


        describe("Service", function() {
            var dependency, dependencyService;

            beforeEach(function() {
                dependency = chance.word();

                dependencyService = {
                    toString: (function() {
                        var str;

                        str = chance.word();

                        return function() {
                            return str;
                        }
                    })()
                };

                dm.setDefinition(dependency, {
                    synthetic: true
                });

                dm.set(dependency, dependencyService);
            });

            it("should parse parameter template", function(done) {
                dm.setDefinition("service", {
                    path: "./src/universal.js",
                    "calls": [
                        [ "method", ["@" + dependency] ]
                    ]
                });

                dm
                    .get("service")
                    .then(function(service) {
                        expect(service.method.firstCall.calledWithExactly(dependencyService));
                    })
                    .then(done, done);
            });

            it("should parse parameter live template", function(done) {
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
                        expect(service.method.firstCall.calledWithExactly(liveText));
                    })
                    .then(done, done);
            });

            // todo circular dependency

        });


        // todo fury things
        // todo insane things

    });

});

