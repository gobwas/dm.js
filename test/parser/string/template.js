var _              = require('lodash'),
    sinon          = require('sinon'),
    chai           = require('chai'),
    Template       = require('../../../lib/parser/string/template'),
    Async          = require('../../../lib/async'),
    Chance         = require("chance"),
    RSVP           = require("rsvp"),
    assert, expect;

assert = chai.assert;
expect = chai.expect;
chance = new Chance;


describe("Template", function() {
    var template;

    beforeEach(function() {
        Template.REGEXP = {
            exec: function(){}
        };
        Template.REGEXP.global = true;
        Template.REGEXP.lastIndex = 0;

        template = new Template;
    });

    describe("#all", function() {

        it("should exec all matches and return defined results", function() {
            var execCount, execStub, defineStub, matches, definitions, result;

            definitions = [];
            defineStub = sinon.stub(template, "define", function() {
                var result;

                definitions.push((result = {}));

                return result;
            });

            execCount = 5;
            matches = [];
            execStub = sinon.stub(Template.REGEXP, "exec", function() {
                var match;

                if ((this.lastIndex + 1) > execCount) {
                    return null;
                }

                this.lastIndex++;

                match = [];
                match.push(chance.word());

                matches.push(match);

                return match;
            });

            result = template.all(chance.word());

            expect(execStub.callCount).equal(execCount + 1);
            expect(defineStub.callCount).equal(execCount);

            // on every exec we should reset lastIndex
            expect(Template.REGEXP.lastIndex).equal(0);

            _.forEach(matches, function(match, i) {
                expect(defineStub.getCall(i).calledWithExactly(match)).to.be.true();
            });

            _.forEach(result, function(result, i) {
                expect(result.definition).equal(definitions[i]);
                expect(result.match.string).equal(matches[i][0]);
            });
        });

    });

    describe("#match", function() {

        it("should call define exec result", function() {
            var execStub, defineStub, match, definition, result;

            defineStub = sinon.stub(template, "define", function() {
                return (definition = {});
            });

            execStub = sinon.stub(Template.REGEXP, "exec", function() {
                this.lastIndex++;
                return (match = [chance.word()]);
            });

            result = template.match(chance.word());

            expect(execStub.callCount).equal(1);
            expect(defineStub.callCount).equal(1);

            // on every match we should reset lastIndex
            expect(Template.REGEXP.lastIndex).equal(0);

            expect(defineStub.getCall(0).calledWithExactly(match)).to.be.true();

            expect(result.definition).equal(definition);
            expect(result.match.string).equal(match[0]);
        });

    });

    describe("#test", function() {
        it("should match and return boolean", function() {
            var result;

            sinon.stub(template, "match", function() {
                return [];
            });

            result = template.test(chance.word());

            expect(result).to.be.a("boolean");
            expect(result).to.be.true();
        });
    });

});
