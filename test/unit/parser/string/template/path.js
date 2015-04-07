var Test              = require("./test"),
    PathTemplate = require('../../../../../lib/parser/string/template/path'),
    test;

test = Test(function() { return new PathTemplate() }, { title: "PathTemplate" });

test.yes("abc", [{ path: "abc" }]);
test.no("");

test.run();