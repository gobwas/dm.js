var Test              = require("./test"),
    HypnofrogTemplate = require('../../../../../lib/parser/string/template/hypnofrog'),
    test;

test = Test(function() { return new HypnofrogTemplate() }, { title: "HypnofrogTemplate" });

test.yes("@_@", [{}]);

test.no("@_");
test.no("_@");

test.run();