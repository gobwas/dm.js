var test          = require("./../test"),
    $             = require('jquery'),
    jQueryAdapter = require('../../../../../src/dm/adapter/async/jquery'),
    jsdom         = require("jsdom");


jsdom.env(
    "dm.js",
    function (errors, window) {
        var jQuery;

        jQuery = $(window);

        test(jQuery, jQuery.Deferred().promise().constructor, jQueryAdapter, {
            title: "jquery.js"
        });
    }
);