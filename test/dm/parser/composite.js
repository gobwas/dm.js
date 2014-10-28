var CompositeParser = require("../../../src/dm/parser/composite"),
    AbstractParser  = require("../../../src/dm/parser"),
    Async           = require("../../../src/dm/async"),
    chance          = require("chance"),
    _               = require("lodash"),
    sinon           = require("sinon"),
    RSVP            = require("rsvp"),
    chai            = require("chai");

chance = new chance;
assert = chai.assert;

describe("CompositeParser", function() {
    var parser, async;

    beforeEach(function() {
        async = new Async();

        sinon.stub(async, "promise", function(cb) {
            return new RSVP.Promise(cb);
        });
        sinon.stub(async, "resolve", function(v) {
            return RSVP.Promise.resolve(v);
        });

        parser = new CompositeParser(async);
    });

    describe("#test", function() {

        it("Should call #test on every child until someone not returned true", function(done) {
            var word, children, verify;

            word = chance.word();

            children = _.chain([1,2,3])
                .map(function(value, index, list) {
                    var child;

                    child = new AbstractParser(async);

                    sinon.stub(child, "test", function(word) {
                        return async.resolve(index == list.length - 1)
                    });

                    parser.add(child);

                    return function() {
                        assert.equal(child.test.callCount, 1);
                        assert.isTrue(child.test.calledWith(word));
                    }
                })
                .value();

            verify = _.compose.apply(_, children);

            parser.test(word)
                .then(function() {
                    verify();
                    done();
                })
                .catch(done);
        });

    })

})