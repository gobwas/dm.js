var Test              = require("./test"),
    JSONPointerTemplate = require('../../../../../lib/parser/string/template/json-pointer'),
    test;

test = Test(function() { return new JSONPointerTemplate() }, { title: "JSONPointerTemplate" });

test.yes("abc#/pointer", [{ path: "abc", pointer: "/pointer" }]);
test.yes("abc#",         [{ path: "abc", pointer: "" }]);

test.no("acb##");
test.no("#");
test.no("##");

test.run();