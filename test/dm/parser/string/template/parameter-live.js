var Test              = require("./test"),
    ParameterTemplate = require('../../../../../src/dm/parser/string/template/parameter-live'),
    test;

test = Test(function() { return new ParameterTemplate() }, { title: "ParameterLiveTemplate" });

test.yes("%{parameter}", [{ name: "parameter" }]);
test.no("{parameter}");

test.run();