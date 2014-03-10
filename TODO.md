+ Finalize tests
+ Requirejs plugin
+ DOM notation plugin (think it for ModuleManager, based on DM)
+ Factory for services
+ Default factory (new instance -> default-factory)
+ Service method calling (someProp: "@service:method(1,2,3, %my.prop%, @another)")

Some example config
___________________

service:
    factory: "@factory:create"
    arguments: [
        1,2,3
    ],
    properties: [
        template: "/var/templates/some.html",
        function: "@template:make!/var/templates/real.html"
        another:  "tpl!%path.to.template%
        again:    "%tpl%!@waytofind:find('factory', 1, @some, %property%, @provider:function, @provider:call(1))
    ]
    calls: [
        ["setSome", []]
    ]

factory:
    path: ../../../factory.js
    arguments: [
        a: 1
    ]