var _      = require('lodash'),
    sinon  = require('sinon'),
    chai   = require('chai'),
    Chance = require("chance"),
    assert, expect;

assert = chai.assert;
expect = chai.expect;
chance = new Chance;

module.exports = function(factory, options) {
    var yes, no;

    yes = [];
    no = [];

    return {
        yes: function(string, definition) {
            yes.push({ string: string, definition: definition });
        },

        no: function(string) {
            no.push(string);
        },

        run: function() {
            describe(options.title, function() {
                var template;

                beforeEach(function() {
                    template = factory();
                });

                describe("#test", function() {

                    yes.forEach(function(obj) {
                        it("should say 'yes, I can' on '" + obj.string + "'", function() {
                            expect(template.test(obj.string)).to.be.true();
                        });
                    });

                    no.forEach(function(string) {
                        it("should say 'no, I can't' on '" + string + "'", function() {
                            expect(template.test(string)).to.be.false();
                        });
                    });

                });

                describe("#match", function() {

                    yes.forEach(function(obj) {
                        it("should return as expected", function() {
                            expect(template.match(obj.string).definition).deep.equal(obj.definition[0]);
                        });
                    });

                });

                describe("#all", function() {

                    yes.forEach(function(obj) {
                        it("should return as expected", function() {
                            template.all(obj.string).forEach(function(response, index) {
                                expect(response.definition).deep.equal(obj.definition[index]);
                            });
                        });
                    });

                });


            });
        }
    };
};
