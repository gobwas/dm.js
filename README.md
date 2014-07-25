# dm.[js](https://developer.mozilla.org/en/docs/JavaScript) [![Build Status](https://travis-ci.org/gobwas/dm.js.svg?branch=master)](https://travis-ci.org/gobwas/dm.js)

> Dependency Injection Manager for javascript.

## Introduction

**dm.js** is a small javascript library for dependency injection. It could work both in node or browser.

In few words, this is a library, that makes your job of creating, configuring and injecting other objects inside of your application.

If you interested in theory, you can check things about [the inversion of control](http://en.wikipedia.org/wiki/Inversion_of_control)
and software design patterns like [dependency injection](http://en.wikipedia.org/wiki/Dependency_injection), [service locator](http://en.wikipedia.org/wiki/Service_locator_pattern), etc.

There is a many explanations in the Internet about why it is a good design principle, and which advantages does it gives.

There is just few of them:
+ loose coupling;
+ easy configuring;
+ easy switching implementations;
+ sweet unit testing;
+ one place where all dependencies are.


## The Hello World

In few lines of code, dm.js is:

```javascript

var config;

config = {
    // the 'world' service
    "world": {
        path: "/script/world/big-world.js",
        arguments: [{
            options: {
                worldId: "world-unique-identifier"
            }
        }]
    },

    // the 'hello' service
    "hello": {
        path: "/script/greeting/hello.js",
        calls: [
            ["injectTheWorld", ["@world"]]
        ]
    }
}

```

What happens here?

We just created object ```config```. It contains our application's objects (we could name they as services) configuration.
Configuration says what object implementation to use, which arguments pass to constructor, which calls to do after instantiating, and finally,
which properties with which values set up for created instance.

There are two objects in our configuration - "world" and "hello". The "world" object contains some logic for interacting with world.

The "hello" object contains some logic for greeting some injected, not known as well, but known as an interface **world**.

> Also, later, some client of "hello" object will not know which implementation he use, nor the world, that he greeting.
> He just know the interface of world greeter. And call the #greet method from it.

So where the magic? Simply, just create the ```DM``` object, configure it and greet the world!

```javascript

var dm,
    hello;

dm = new DM();
dm.setConfig(config);

hello = dm.get("hello");
hello.greet("Hello everybody, I am dm.js!");

```

If you think that this is a useful layer for your application architecture - welcome!

## What is inside?

dm.js consists of few linked components:

- core (DM class);
- async adapter;
- resource loader adapter;

### DM

DM class contains the core logic of parsing, resolving, constructing, injecting and storing dependent objects and resources.
Because of known reasons, it uses async style of work - the [Promises](html 5 promises). But, because you can use different libraries of
Promises, DM uses the abstraction over it, called 'async adapter'.

Another abstraction is used by the same reason is 'loader adapter' - you could use CommonJS loader (in node, or browser with
[browserified](browserify) content), or, AMD loader, like [require.js](require.js), or, whatever you want other.

So, when someone asking for some object, DM returns the Promise for this query, that will be resolved with configured object,
of rejected, when error occurs. Then DM gets the object configuration from config. If configuration says, that object needs
to be cached (by default all objects are needed to be cached) DM tries to get it from cache (see detailed section of
readme about object configuration). If asked service is not cached, DM loads constructor of object, located in
```path``` property of config. When it loaded, DM tries to load all dependencies, placed in ```calls```, ```arguments```
and ```properties``` properties of configuration. Then it calls constructor of an object with necessary ```arguments```,
then makes necessary ```calls```, and, finally, sets up necessary ```properties```. Then, if object is needs to be cached,
DM caches created instance and resolving given Promise with it.

For detailed explanation of all configuration properties see doc section below.

### Async Adapter

There are few built in adapters for most popular async libraries:

- [RSVP.js](rsvp);
- [Q.js](q.js);
- [ES6 Harmony Promises](Promises);
- [jquery deferred](jquery.com);

Of course, you can write adapter for your favorite library and successfully use it.

### Loader Adapter

There are also two built in adapters for most popular resource loading libraries:

- [Require.js](require.js);
- [CommonJS](common.js);

### All together

This code is illustrating all written above:

```javascript

var dm, async, loader, config,
    hello;

async = new Async(RSVP);

loader = new Loader();
loader.setAsync(async);

dm = new DM();
dm.setAsync(async);
dm.setLoader(loader);

dm.setConfig(config);

hello = dm.get("hello");
hello.greet("Hello everybody, I am dm.js!");

```

If you do not write this lines (like in the Hello World example) you can use prebuilt version for your module and async
favorite library.


## Configuration

### Syntax

DM uses this symbols to identify parsing action:

Symbol     | Type
-----------|------
@xxx       | Object
@xxx:xxx   | Object's method
@xxx:xxx[] | Object's method calling
%xxx%      | Parameter (with type safe)
%{xxx}     | Live insertion parameter (without type safe)
#xxx#      | Resource
#xxx!xxx#  | Handler

All of this symbols are recursively parsing, while DM cant get the primitive type or escaped type.

Examples:

String                                             | Link to
---------------------------------------------------|--------
"@my_service"                                      | object
"@my_service:method"                               | object's method
"@my_service:method[1,2,"@other_service", {"a":1}] | object's method's call result
"#my_resource.html#"                               | resource content
"#@my_parser!my_resource.html#"                    | resource content handled by this object's method
"%my_parameter%"                                   | parameter
"%{my_parameter}/replaces/live"                    | parameter (replaces with stringified parameter)
"@my_service:method[%my_argument%]"                | object's method's call result with this property
"%my_parser%!my_resource.html"                     | resource content handled by the object's method, linked in this parameter

### Objects

Property   | Type    | Expected  | Default       | Example                        | Explanation
-----------|---------|-----------|---------------|--------------------------------|-------------
path       | String  | necessary |               | ```"/script/service.js"```     | Path to load for constructor
share      | Boolean | optional  | ```true```    | ```true```                     | Cache the instantiated object, or create new one every time when asked
factory    | String  | optional  | inner factory | ```"@my.custom.factory"```     | Factory of object, that receives parsed object's definition and returns created object
arguments  | Array   | optional  |               | ```[{ id: 1 }, "@service"]```  | List of arguments to be passed to constructor (like Function.apply method)
calls      | Array   | optional  |               | ```[["myCall", [1,2,"@b"]]]``` | List of calls, where each item is Array with first item name of the method, and second - Array of arguments for method
properties | Object  | optional  |               | ```{ a: 1, b: "@c", d: [] }``` | Hash of object properties, to be set on

#### Hooks

##### Escape object

You can use the DM's method #Escape, or simple wrap your value like this:

> Note, that this snipped cant be stable at 100%. Use the #escape method instead.

```javascript

    var config = {

        "service": {
            path: "...",
            arguments: [{
                val: {
                    __escape__: true,
                    __value__: {
                        //...
                    }
                }
            }]
        }

    }

```

##### Link to DM instance

Simply put this string ```"@_@"```.

### Parameters

## API

### DM

### Adapter

#### Async Adapter

#### Loader Adapter

## Contributing

All developing version are available to install from npm as `dm@x.y.z-rc`.
To publish new release candidate (rc abbr) just do `npm publish --tag x.y.z-rc` and bump version in package.json `x.y.z-rc0`.
