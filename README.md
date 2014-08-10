# dm.[js](https://developer.mozilla.org/en/docs/JavaScript)

[![NPM version](https://badge.fury.io/js/dm.svg)](http://badge.fury.io/js/dm)
[![Build Status](https://travis-ci.org/gobwas/dm.js.svg?branch=master)](https://travis-ci.org/gobwas/dm.js)

> Dependency [Injection](http://en.wikipedia.org/wiki/Dependency_injection) Manager for javascript.

## Introduction

**dm.js** is a javascript library that implements dependency injection pattern. It could work both in node or browser.

It takes care of asynchronous creating, configuring and injecting objects aka *services* inside of your code.

There is a good chance to keep your application design loose coupled, well structured and flexible with dependency injection pattern.

If you interested in theory you can check things about:
+ [the inversion of control](http://en.wikipedia.org/wiki/Inversion_of_control),
+ [dependency injection](http://en.wikipedia.org/wiki/Dependency_injection),
+ [service locator](http://en.wikipedia.org/wiki/Service_locator_pattern).

And it strongly recommended to read [Martin Fowler's article about Dependency Injection](http://martinfowler.com/articles/injection.html).

## What is Service?

Service is just a javascript object. It realize some piece of logic of your application.

It is good idea to think your application is many to many services negotiations.
Since each service is responsible just for one job, you can use its functionality in any place of your application.
Each service can be simply tested and configured, when it sliced out from other logic of your application.

What do you need to create a service? Nothing special - just create some javascript constructor function, as usual.
Put it in separate file, as good guidelines tell you to do, and register it in **_dm_**. Then dm will load it by your [preferred way of resolving assets (amd, cjs etc)](#loader).

## What is Dependency?

Dependency is usually just another javascript object aka *service*, that some other service is depends on to make his job.
For example, some cache service for storing purposes needs to have the way to generate unique hash for each record.
So it depends on unique hash generator service.

Realizing services and their dependencies in that way gives you abilities to:
+ switch implementations of dependencies without changing dependent service;
+ mock dependencies for easy unit testing;
+ configure each of services independently;
+ store all the configuration in one place.

## What is Injection and who is Manager?

There are three types of injection:
+ Constructor injection;
+ Setter injection;
+ Property injection.

Dependency Injection Manager is an object, very close to *Service Locator* pattern, that knows all about services - their dependencies and configuration.
He knows which implementation of service to use, which arguments pass to constructor, which calls with which arguments to do after instantiating,
and finally, which properties with which values set up for created instance.

Its a good idea to keep all application configuration in one place. This gives ability for developers concentrate just on service developing,
and not on how to get some other object, nor on the configuration parameters, that service will use.

> Note, that using DM as Service Locator (when service asks DM for other service) removes this advantage from your design - because,
instead of controlling all services, you give ability to service ask whatever he wants and whenever he wants.
This blurs control over your application. But in modern development there are some cases for purposes of optimization,
when it needed to require services just when they really need. So it is your choice.

## How it works together?

**dm.js** use async way to resolve service building. It uses [Promises/A+](http://promisesaplus.com/) compatible libraries, and most popular module definition notations.
So, all you need to configure DM is select needed adapters for promises and module loaders. And of course, you can write your own adapters easily.

Out of the box at the moment DM has these async adapters:
+ RSVP;
+ jQuery.Deferred;
+ Q.js
+ Harmony Promises.

And these loaders:
+ CJS (node way);
+ AMD (requirejs).

If you want to not configure adapters and some other things, prebuilt versions are planned to the future.

## The Hello World Example

Lets greet the Great Big World in best principles of software architect:

```js

var config;

config = {
    // the 'world' service
    "world": {
        path: "/script/world/great-big-white-world.js",
        arguments: [{
            options: {
                worldId: "world-unique-identifier"
            }
        }]
    },

    // the 'greeter' service
    "greeter": {
        path: "/script/greeter/hello.js",
        calls: [
            ["injectTheWorld",      ["@world"]],
            ["injectTheOtherWorld", ["@world.other"]] // some other world
        ],
        properties: {
            greeting: "Hello!"
        }
    }
}

```

What happens here?

We just created `config` object. It contains our application's services configuration.

There are two services in our configuration - "world" and "greeter". The "world" contains some logic for interacting with world.

The "greeter" contains some logic for greeting some injected, not known as well, but known as an interface **_world_**.

> Also, later, some client of "greeter" service will not know which implementation he use, nor the world, that he greeting.
> He just know the interface of world greeter. And call the #greet method from it.
> Isn't it a perfect way to develop services independently and totally loose coupled? =)

```js

var dm, async, loader,
    hello;

// here the configuration of DM part
// it can be put in some bootstrap.js or main.js file
// at the beginning of your application
dm     = new DM.DependencyManager();
async  = new DM.async.RSVP(RSVP);
loader = new DM.loader.cjs();

dm.setAsync(async);
dm.setLoader(loader.setAsync(async));
dm.setConfig(config);

// here some application action
greeter = dm
    .get("greeter")
    .then(function(greeter) {
        greeter.greet("Everybody, I am dm.js!");
    });

```

## Configuration

As you can see, DM config is an object, that contains your all your services definition.
All available properties is:

Property   | Type      | Expected  | Default       | Example                    | Explanation
-----------|-----------|-----------|---------------|----------------------------|-------------
path       | `String`  | necessary |               | `"/script/service.js"`     | Path to service constructor
share      | `Boolean` | optional  | `true`        | `true`                     | Cache the instantiated object, or create new one every time when asked
factory    | `String`  | optional  |               | `"@my.custom.factory"`     | Factory of object, that receives parsed object's definition and returns created object
arguments  | `Array`   | optional  |               | `[{ id: 1 }, "@service"]`  | List of arguments to be passed to constructor (like Function.apply method)
calls      | `Array`   | optional  |               | `[["myCall", [1,2,"@b"]]]` | List of calls, where each item is Array with first item name of the method, and second - Array of arguments for method
properties | `Object`  | optional  |               | `{ a: 1, b: "@c", d: [] }` | Hash of object properties, to be set on

### Syntax

DM uses this symbols to identify parsing action:

Pattern       | Mean
--------------|------
@xxx          | Link to `xxx` named in config service
@xxx:yyy      | Link to `xxx` service's `yyy` method
@xxx:yyy[]    | Calling `xxx` service's `yyy` method with JSON stringified arguments list (`[]`)
%xxx%         | Parameter `xxx` from configuration (type safe)
#xxx#         | `xxx` resource loading
#xxx!yyy#     | `yyy` resource loading and passing through `xxx` handler (where `xxx` must have `handle` method)
#xxx:zzz!yyy# | `yyy` resource loading and passing through `xxx` service's `zzz` method as handler
%{xxx}        | Live insertion parameter
@{xxx}        | Live insertion service
#{xxx}        | Live insertion resource
@_@           | Link to DM instance 8-)

> All live insertion patterns are use `toString` method calling on each value, if it is not a String.

All patterns (instead of live patterns) will be recursively parsed, while DM cant get the primitive type or escaped type.

### Hooks

#### Escape object

You can use the DM method `escape` to avoid parsing of object properties values.

```js

var config = {
    "service": {
        "path": "...",
        "arguments": [{
            val: DM.escape({
                my_key: "@some_same_syntax_but_not_parsed"
            })
        }]
    }
}

```

If you don't have link to DM instance in your config file, you can use this hack to wrap your value like this:

> Note, that this snipped cant be stable at 100%. Use the #escape method instead.

```js

var config = {
    "service": {
        path: "...",
        arguments: [{
            val: {
                __escape__: true,
                __value__: {
                   my_key: "@some_same_syntax_but_not_parsed"
               }
            }
        }]
    }
}

```


## API

### DM
______

#### constructor([options])

Creates new instance of DM.

##### Parameters

**_options_**

Type: `Object`

##### Return value

Type: `DM`

#### setConfig(config, [parameters])

Sets up configuration for DM.

##### Parameters

**_config_**

Type: `Object`

Services map.

**_parameters_**

Type: `Object`

Parameters hash.

#### getConfig([key])

Returns copy of a configuration.

##### Parameters

**_key_**

Type: `string`

If given, gets configuration of service with that key.

##### Return value

Type: `mixed`


#### setParameter(key, value)

Sets up parameter. Can not replace already existing parameter.

##### Parameters

**_key_**

Type: `string`

**_value_**

Type: `mixed`

#### getParameter(key)

Returns parameter if exists.

##### Parameters

**_key_**

Type: `string`

##### Return value


#### setAsync(adapter)

##### Parameters

**_adapter_**

Type: `Async`

Async adapter for some Promises library.

#### setLoader(adapter)

**_adapter_**

Type: `Loader`

Loader adapter for some module loader.

##### Return value


#### set(key, service)

Set up synthetic service in DM services map. Must be declared in configuration by given `key` as `synthetic`.

##### Parameters

**_key_**

Type: `string`

**_service_**

Type: `Object`

#### has(key)

##### Parameters

**_key_**

Type: `string`

##### Return value


#### initialized(key)

##### Parameters

**_key_**

Type: `string`

##### Return value


#### get(key)

##### Parameters

**_key_**

Type: `string`

##### Return value


### Async
_________

#### constructor(adaptee)

##### Parameters

**_adaptee_**

Type: `Object`

##### Return value


#### promise(resolver)

##### Parameters

**_resolver_**

Type: `Function`

##### Return value


#### all(promises)

##### Parameters

**_promises_**

Type: `Array`

##### Return value


#### resolve(value)

##### Parameters

**_value_**

Type: `mixed`

##### Return value


#### reject(error)

##### Parameters

**_error_**

Type: `Error`

##### Return value


### Loader
__________

#### constructor(adaptee)

##### Parameters

**_adaptee_**

Type: `Object`

##### Return value


#### setAsync(adapter)

##### Parameters

**_adapter_**

Type: `Async`

##### Return value


#### require(path, [options])

##### Parameters

**_path_**

Type: `string`

**_options_**

Type: `Object`

##### Return value


#### read(path, [options])

##### Parameters

**_path_**

Type: `string`

**_options_**

Type: `Object`

##### Return value


## Contributing

All developing version are available to install from npm as `dm@x.y.z-rc`.
To publish new release candidate (rc abbr) just do `npm publish --tag x.y.z-rc` and bump version in package.json `x.y.z-rc0`.
