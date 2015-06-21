var Test     = require("./test"),
    Template = require('../../../../../lib/parser/string/template/slug'),
    test;

test = Test(function() { return new Template() }, { title: "SlugTemplate" });

test.yes("$1", [{ index: 1 }]);
test.yes("$0", [{ index: 0 }]);

test.no("$_1");
test.no("$a");

test.run();