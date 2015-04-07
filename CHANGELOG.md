Change log
==========

### 0.3.1 (08-04-2015)
______________________

#### Features

+ `definition.path` now accepts JSONPointer ([RFC6901](https://tools.ietf.org/html/rfc6901))

### 0.3.0 (23-03-2015)
______________________

> This version is almost absolutely not compatible with 0.2.2 and below.

#### Breaking Changes

+ `DM` instantiating;
+ `DM` interface;
+ `Async`, `Loader` interfaces;
+ Removed `Adapter` interface;
+ Now calls from configuration throws Errors when method does not exists;

#### Features

+ Live templates;

#### Core

+ [Big Refactoring Issue](https://github.com/gobwas/dm.js/issues/10);
+ Removed `.coffee` tests ([issue](https://github.com/gobwas/dm.js/issues/5));
+ Removed Grunt (to Gulp);

### 0.2.2 (28-10-2014)
______________________

+ Bug #21 fix.

### 0.2.1 (10-08-2014)
______________________

+ Async adapters for jQuery, Broody-Promises, Q, Harmony;
+ Tests for adapters;
+ Testling.CI adaptation.

### 0.2.0 (19-07-2014)
______________________

+ Project structure;
+ Ability to use parameter links in part of string (live properties);
+ Ability to set base path for loading modules and resources [issue#1](https://github.com/gobwas/dm.js/issues/1);
+ Synthetic services [issue#8](https://github.com/gobwas/dm.js/issues/8);
+ Added dependency for `inherits-js` instead of using self developed;

### 0.1.3 (02-04-2014)
______________________

+ Option 'share' for service (create new service or get it from cache);
+ Make DependencyManager extendable;
+ Ability to link for dm in configurations via "@_@" key;
+ Default property "factory" for factory objects;
+ CJS Adapter's #read method is now trying to require path first;
+ Bugfix on factory calling - now on factory object;
+ Bugfix in IE8 on #catch method of promises;
+ Bugfix in IE on parsing strings;
+ Implemented universal #bind and #map methods in utils package;


### 0.1.2 (24-03-2014)
______________________

+ Implement base logic;
+ Finalize tests;
