var test          = require("./../test"),
    jQuery        = require('jquery'),
    jQueryAdapter = require('../../../../lib/async/jquery'),
    jsdom;

// browser fallback
try {
    jsdom = require("jsdom");
} catch (err) {
    console.log('err', err.stack);
    jsdom = {
        env: function(name, callback) {
            callback(null, window);
        }
    };
}

jsdom.env(
    "dm.js",
    function (errors, window) {
        if (!jQuery.fn) {
            jQuery = jQuery(window);
        }

        test(jQuery, jQuery.Deferred().promise().constructor, jQueryAdapter, {
            title: "JQueryAsync"
        });
    }
);