var test          = require("./../test"),
    jQuery        = require('jquery'),
    jQueryAdapter = require('../../../../src/dm/async/jquery'),
    jsdom         = require("jsdom");

// browser fallback
if (!jsdom.env) {
    jsdom.env = function(name, callback) {
        callback(null, window);
    }
}

jsdom.env(
    "dm.js",
    function (errors, window) {
        if (!jQuery.fn) {
            jQuery = jQuery(window);
        }

        test(jQuery, jQuery.Deferred().promise().constructor, jQueryAdapter, {
            title: "jquery.js"
        });
    }
);