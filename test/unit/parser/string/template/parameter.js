var Test              = require("./test"),
    ParameterTemplate = require('../../../../../lib/parser/string/template/parameter'),
    test;

test = Test(function() { return new ParameterTemplate() }, { title: "ParameterTemplate" });

test.yes("%parameter%", [{ name: "parameter" }]);

test.no("%parameter");
test.no("parameter%");

test.run();