var Test     = require("./../test"),
    Template = require('../../../../../lib/parser/string/template/resource/live'),
    test;

test = Test(function() { return new Template() }, { title: "ResourceLiveTemplate" });

test.yes("#{resource}",                 [{ path: "resource", handler: undefined }]);
test.yes("#{handler!resource}",         [{ path: "resource", handler: "handler" }]);
test.yes("#{@handler!resource}",        [{ path: "resource", handler: "@handler" }]);
test.yes("#{@handler:method!resource}", [{ path: "resource", handler: "@handler:method" }]);

test.no("#parameter");
test.no("parameter#");

test.run();