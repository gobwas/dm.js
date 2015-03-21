#Index

**Classes**

* [class: DM](#DM)
  * [new DM(async, loader, [config])](#new_DM)
* [class: Factory](#Factory)
  * [factory.factory(definition)](#Factory#factory)
* [class: Loader](#Loader)
  * [new Loader()](#new_Loader)
  * [loader.require(path, async, [options])](#Loader#require)
  * [loader.read(path, async, [options])](#Loader#read)
* [class: Provider](#Provider)
  * [provider.get(attributes)](#Provider#get)
* [class: BroodyPromisesAsync](#BroodyPromisesAsync)
  * [new BroodyPromisesAsync()](#new_BroodyPromisesAsync)
  * [broodyPromisesAsync.promise(resolver)](#BroodyPromisesAsync#promise)
  * [broodyPromisesAsync.all(list)](#BroodyPromisesAsync#all)
  * [broodyPromisesAsync.resolve(value)](#BroodyPromisesAsync#resolve)
  * [broodyPromisesAsync.reject(value)](#BroodyPromisesAsync#reject)
  * [broodyPromisesAsync.defer()](#BroodyPromisesAsync#defer)
* [class: HarmonyAsync](#HarmonyAsync)
  * [new HarmonyAsync()](#new_HarmonyAsync)
  * [harmonyAsync.promise(resolver)](#HarmonyAsync#promise)
  * [harmonyAsync.all(list)](#HarmonyAsync#all)
  * [harmonyAsync.resolve(value)](#HarmonyAsync#resolve)
  * [harmonyAsync.reject(value)](#HarmonyAsync#reject)
  * [harmonyAsync.defer()](#HarmonyAsync#defer)
* [class: JQueryAsync](#JQueryAsync)
  * [new JQueryAsync()](#new_JQueryAsync)
  * [jQueryAsync.promise(resolver)](#JQueryAsync#promise)
  * [jQueryAsync.all(list)](#JQueryAsync#all)
  * [jQueryAsync.resolve(value)](#JQueryAsync#resolve)
  * [jQueryAsync.reject(value)](#JQueryAsync#reject)
  * [jQueryAsync.defer()](#JQueryAsync#defer)
* [class: QAsync](#QAsync)
  * [new QAsync()](#new_QAsync)
  * [qAsync.promise(resolver)](#QAsync#promise)
  * [qAsync.all(list)](#QAsync#all)
  * [qAsync.resolve(value)](#QAsync#resolve)
  * [qAsync.reject(value)](#QAsync#reject)
  * [qAsync.defer()](#QAsync#defer)
* [class: RSVPAsync](#RSVPAsync)
  * [new RSVPAsync()](#new_RSVPAsync)
  * [rsvpAsync.promise(resolver)](#RSVPAsync#promise)
  * [rsvpAsync.all(list)](#RSVPAsync#all)
  * [rsvpAsync.resolve(value)](#RSVPAsync#resolve)
  * [rsvpAsync.reject(value)](#RSVPAsync#reject)
  * [rsvpAsync.defer()](#RSVPAsync#defer)
* [class: DefaultFactory](#DefaultFactory)
  * [new DefaultFactory()](#new_DefaultFactory)
  * [defaultFactory.factory(definition)](#DefaultFactory#factory)
* [class: RequireJSLoader](#RequireJSLoader)
  * [new RequireJSLoader()](#new_RequireJSLoader)
  * [requireJSLoader.require(path, async, [options])](#RequireJSLoader#require)
  * [requireJSLoader.read(path, async, [options])](#RequireJSLoader#read)
* [class: CJSLoader](#CJSLoader)
  * [new CJSLoader()](#new_CJSLoader)
  * [cjsLoader.require(path, async, [options])](#CJSLoader#require)
  * [cjsLoader.read(path, async, [options])](#CJSLoader#read)
* [class: CompositeParser](#CompositeParser)
  * [new CompositeParser()](#new_CompositeParser)
  * [compositeParser.test(str)](#CompositeParser#test)
  * [compositeParser.parse(something)](#CompositeParser#parse)
* [class: StringParser](#StringParser)
  * [new StringParser()](#new_StringParser)
  * [stringParser.test(str)](#StringParser#test)
  * [stringParser.parse(something)](#StringParser#parse)
* [class: WrappingParser](#WrappingParser)
  * [new WrappingParser()](#new_WrappingParser)
  * [wrappingParser.test(str)](#WrappingParser#test)
  * [wrappingParser.parse(something)](#WrappingParser#parse)
* [class: DMProvider](#DMProvider)
  * [new DMProvider()](#new_DMProvider)
  * [dmProvider.get(definition)](#DMProvider#get)
* [class: ParameterProvider](#ParameterProvider)
  * [new ParameterProvider()](#new_ParameterProvider)
  * [parameterProvider.get(definition)](#ParameterProvider#get)
* [class: ResourceProvider](#ResourceProvider)
  * [new ResourceProvider()](#new_ResourceProvider)
  * [resourceProvider.get(definition)](#ResourceProvider#get)
* [class: ServiceProvider](#ServiceProvider)
  * [new ServiceProvider()](#new_ServiceProvider)
  * [serviceProvider.get(definition)](#ServiceProvider#get)
* [class: MultipleStringParser](#MultipleStringParser)
  * [new MultipleStringParser()](#new_MultipleStringParser)
  * [multipleStringParser.test(str)](#MultipleStringParser#test)
  * [multipleStringParser.parse(something)](#MultipleStringParser#parse)
* [class: SingleStringParser](#SingleStringParser)
  * [new SingleStringParser()](#new_SingleStringParser)
  * [singleStringParser.test(str)](#SingleStringParser#test)
  * [singleStringParser.parse(something)](#SingleStringParser#parse)
* [class: Template](#Template)
  * [new Template([options])](#new_Template)
  * [template.define()](#Template#define)
* [class: EventualParser](#EventualParser)
  * [new EventualParser()](#new_EventualParser)
  * [eventualParser.test(str)](#EventualParser#test)
  * [eventualParser.parse(something)](#EventualParser#parse)
* [class: ProcessingParser](#ProcessingParser)
  * [new ProcessingParser()](#new_ProcessingParser)
  * [processingParser.process()](#ProcessingParser#process)
  * [processingParser.test(str)](#ProcessingParser#test)
  * [processingParser.parse(something)](#ProcessingParser#parse)
* [class: DefaultDMProvider](#DefaultDMProvider)
  * [new DefaultDMProvider()](#new_DefaultDMProvider)
  * [defaultDMProvider.get(definition)](#DefaultDMProvider#get)
* [class: DefaultParameterProvider](#DefaultParameterProvider)
  * [new DefaultParameterProvider()](#new_DefaultParameterProvider)
  * [defaultParameterProvider.get(definition)](#DefaultParameterProvider#get)
* [class: DefaultResourceProvider](#DefaultResourceProvider)
  * [new DefaultResourceProvider()](#new_DefaultResourceProvider)
  * [defaultResourceProvider.get(definition)](#DefaultResourceProvider#get)
* [class: DefaultServiceProvider](#DefaultServiceProvider)
  * [new DefaultServiceProvider()](#new_DefaultServiceProvider)
  * [defaultServiceProvider.get(definition)](#DefaultServiceProvider#get)
* [class: HypnofrogTemplate](#HypnofrogTemplate)
  * [new HypnofrogTemplate()](#new_HypnofrogTemplate)
  * [hypnofrogTemplate.define()](#HypnofrogTemplate#define)
* [class: ParameterTemplate](#ParameterTemplate)
  * [new ParameterTemplate()](#new_ParameterTemplate)
  * [parameterTemplate.define()](#ParameterTemplate#define)
* [class: ResourceTemplate](#ResourceTemplate)
  * [new ResourceTemplate()](#new_ResourceTemplate)
  * [resourceTemplate.define()](#ResourceTemplate#define)
* [class: ServiceTemplate](#ServiceTemplate)
  * [new ServiceTemplate()](#new_ServiceTemplate)
  * [serviceTemplate.define()](#ServiceTemplate#define)
* [class: StringifyProcessing](#StringifyProcessing)
  * [new StringifyProcessing()](#new_StringifyProcessing)
* [class: LiveParameterTemplate](#LiveParameterTemplate)
  * [new LiveParameterTemplate()](#new_LiveParameterTemplate)
  * [liveParameterTemplate.define()](#LiveParameterTemplate#define)
* [class: LiveResourceTemplate](#LiveResourceTemplate)
  * [new LiveResourceTemplate()](#new_LiveResourceTemplate)
  * [liveResourceTemplate.define()](#LiveResourceTemplate#define)
* [class: LiveServiceTemplate](#LiveServiceTemplate)
  * [new LiveServiceTemplate()](#new_LiveServiceTemplate)
  * [liveServiceTemplate.define()](#LiveServiceTemplate#define)

**Functions**

* [setDefinition(key, definition)](#setDefinition)
* [getDefinition(key)](#getDefinition)
* [getDefinitions()](#getDefinitions)
* [setParameter(key, value)](#setParameter)
* [getParameter(key)](#getParameter)
* [getParameters()](#getParameters)
* [parse(value)](#parse)
* [has(key)](#has)
* [initialized(key)](#initialized)
* [set(key, service)](#set)
* [get(key)](#get)
* [build(definition)](#build)
 
<a name="DM"></a>
#class: DM
DM

**Members**

* [class: DM](#DM)
  * [new DM(async, loader, [config])](#new_DM)

<a name="new_DM"></a>
##new DM(async, loader, [config])
DM.

**Params**

- async `Async`  
- loader <code>[Loader](#Loader)</code>  
- \[config\] `Object`  

**Type**: `Error`  
<a name="Factory"></a>
#class: Factory
Factory

**Members**

* [class: Factory](#Factory)
  * [factory.factory(definition)](#Factory#factory)

<a name="Factory#factory"></a>
##factory.factory(definition)
Returns constructed object.

**Params**

- definition `Object`  

**Returns**: `Object` | `Promise`  
<a name="Loader"></a>
#class: Loader
Loader

**Members**

* [class: Loader](#Loader)
  * [new Loader()](#new_Loader)
  * [loader.require(path, async, [options])](#Loader#require)
  * [loader.read(path, async, [options])](#Loader#read)

<a name="new_Loader"></a>
##new Loader()
Loader.

<a name="Loader#require"></a>
##loader.require(path, async, [options])
Requires a module.

**Params**

- path `string`  
- async `Async`  
- \[options\] `Object`  

<a name="Loader#read"></a>
##loader.read(path, async, [options])
Loads resource.

**Params**

- path `string`  
- async `Async`  
- \[options\] `Object`  

<a name="Provider"></a>
#class: Provider
Provider

**Members**

* [class: Provider](#Provider)
  * [provider.get(attributes)](#Provider#get)

<a name="Provider#get"></a>
##provider.get(attributes)
**Params**

- attributes `Object`  

**Returns**: `Promise`  
<a name="BroodyPromisesAsync"></a>
#class: BroodyPromisesAsync
**Extends**: `Async`  
**Members**

* [class: BroodyPromisesAsync](#BroodyPromisesAsync)
  * [new BroodyPromisesAsync()](#new_BroodyPromisesAsync)
  * [broodyPromisesAsync.promise(resolver)](#BroodyPromisesAsync#promise)
  * [broodyPromisesAsync.all(list)](#BroodyPromisesAsync#all)
  * [broodyPromisesAsync.resolve(value)](#BroodyPromisesAsync#resolve)
  * [broodyPromisesAsync.reject(value)](#BroodyPromisesAsync#reject)
  * [broodyPromisesAsync.defer()](#BroodyPromisesAsync#defer)

<a name="new_BroodyPromisesAsync"></a>
##new BroodyPromisesAsync()
BroodyPromisesAsync

**Extends**: `Async`  
**Author**: Sergey Kamardin <s.kamardin@tcsbank.ru>  
<a name="BroodyPromisesAsync#promise"></a>
##broodyPromisesAsync.promise(resolver)
Creates new Promise with given resolver.

**Params**

- resolver `function`  

<a name="BroodyPromisesAsync#all"></a>
##broodyPromisesAsync.all(list)
Creates new Promise, that waiting for all given promises/values is resolved.

**Params**

- list `Array`  

<a name="BroodyPromisesAsync#resolve"></a>
##broodyPromisesAsync.resolve(value)
Creates new resolved with given value Promise.

**Params**

- value `*`  

<a name="BroodyPromisesAsync#reject"></a>
##broodyPromisesAsync.reject(value)
Creates new rejected with given value Promise.

**Params**

- value `*`  

<a name="BroodyPromisesAsync#defer"></a>
##broodyPromisesAsync.defer()
Universal defer function.
Could be overriden by async implementors.

**Returns**: `Object`  
<a name="HarmonyAsync"></a>
#class: HarmonyAsync
**Extends**: `Async`  
**Members**

* [class: HarmonyAsync](#HarmonyAsync)
  * [new HarmonyAsync()](#new_HarmonyAsync)
  * [harmonyAsync.promise(resolver)](#HarmonyAsync#promise)
  * [harmonyAsync.all(list)](#HarmonyAsync#all)
  * [harmonyAsync.resolve(value)](#HarmonyAsync#resolve)
  * [harmonyAsync.reject(value)](#HarmonyAsync#reject)
  * [harmonyAsync.defer()](#HarmonyAsync#defer)

<a name="new_HarmonyAsync"></a>
##new HarmonyAsync()
HarmonyAsync

**Extends**: `Async`  
**Author**: Sergey Kamardin <s.kamardin@tcsbank.ru>  
<a name="HarmonyAsync#promise"></a>
##harmonyAsync.promise(resolver)
Creates new Promise with given resolver.

**Params**

- resolver `function`  

<a name="HarmonyAsync#all"></a>
##harmonyAsync.all(list)
Creates new Promise, that waiting for all given promises/values is resolved.

**Params**

- list `Array`  

<a name="HarmonyAsync#resolve"></a>
##harmonyAsync.resolve(value)
Creates new resolved with given value Promise.

**Params**

- value `*`  

<a name="HarmonyAsync#reject"></a>
##harmonyAsync.reject(value)
Creates new rejected with given value Promise.

**Params**

- value `*`  

<a name="HarmonyAsync#defer"></a>
##harmonyAsync.defer()
Universal defer function.
Could be overriden by async implementors.

**Returns**: `Object`  
<a name="JQueryAsync"></a>
#class: JQueryAsync
**Extends**: `Async`  
**Members**

* [class: JQueryAsync](#JQueryAsync)
  * [new JQueryAsync()](#new_JQueryAsync)
  * [jQueryAsync.promise(resolver)](#JQueryAsync#promise)
  * [jQueryAsync.all(list)](#JQueryAsync#all)
  * [jQueryAsync.resolve(value)](#JQueryAsync#resolve)
  * [jQueryAsync.reject(value)](#JQueryAsync#reject)
  * [jQueryAsync.defer()](#JQueryAsync#defer)

<a name="new_JQueryAsync"></a>
##new JQueryAsync()
JQueryAsync

**Extends**: `Async`  
**Author**: Sergey Kamardin <s.kamardin@tcsbank.ru>  
<a name="JQueryAsync#promise"></a>
##jQueryAsync.promise(resolver)
Creates new Promise with given resolver.

**Params**

- resolver `function`  

<a name="JQueryAsync#all"></a>
##jQueryAsync.all(list)
Creates new Promise, that waiting for all given promises/values is resolved.

**Params**

- list `Array`  

<a name="JQueryAsync#resolve"></a>
##jQueryAsync.resolve(value)
Creates new resolved with given value Promise.

**Params**

- value `*`  

<a name="JQueryAsync#reject"></a>
##jQueryAsync.reject(value)
Creates new rejected with given value Promise.

**Params**

- value `*`  

<a name="JQueryAsync#defer"></a>
##jQueryAsync.defer()
Universal defer function.
Could be overriden by async implementors.

**Returns**: `Object`  
<a name="QAsync"></a>
#class: QAsync
**Extends**: `Async`  
**Members**

* [class: QAsync](#QAsync)
  * [new QAsync()](#new_QAsync)
  * [qAsync.promise(resolver)](#QAsync#promise)
  * [qAsync.all(list)](#QAsync#all)
  * [qAsync.resolve(value)](#QAsync#resolve)
  * [qAsync.reject(value)](#QAsync#reject)
  * [qAsync.defer()](#QAsync#defer)

<a name="new_QAsync"></a>
##new QAsync()
QAsync

**Extends**: `Async`  
**Author**: Sergey Kamardin <s.kamardin@tcsbank.ru>  
<a name="QAsync#promise"></a>
##qAsync.promise(resolver)
Creates new Promise with given resolver.

**Params**

- resolver `function`  

<a name="QAsync#all"></a>
##qAsync.all(list)
Creates new Promise, that waiting for all given promises/values is resolved.

**Params**

- list `Array`  

<a name="QAsync#resolve"></a>
##qAsync.resolve(value)
Creates new resolved with given value Promise.

**Params**

- value `*`  

<a name="QAsync#reject"></a>
##qAsync.reject(value)
Creates new rejected with given value Promise.

**Params**

- value `*`  

<a name="QAsync#defer"></a>
##qAsync.defer()
Universal defer function.
Could be overriden by async implementors.

**Returns**: `Object`  
<a name="RSVPAsync"></a>
#class: RSVPAsync
**Extends**: `Async`  
**Members**

* [class: RSVPAsync](#RSVPAsync)
  * [new RSVPAsync()](#new_RSVPAsync)
  * [rsvpAsync.promise(resolver)](#RSVPAsync#promise)
  * [rsvpAsync.all(list)](#RSVPAsync#all)
  * [rsvpAsync.resolve(value)](#RSVPAsync#resolve)
  * [rsvpAsync.reject(value)](#RSVPAsync#reject)
  * [rsvpAsync.defer()](#RSVPAsync#defer)

<a name="new_RSVPAsync"></a>
##new RSVPAsync()
RSVPAsync

**Extends**: `Async`  
**Author**: Sergey Kamardin <s.kamardin@tcsbank.ru>  
<a name="RSVPAsync#promise"></a>
##rsvpAsync.promise(resolver)
Creates new Promise with given resolver.

**Params**

- resolver `function`  

<a name="RSVPAsync#all"></a>
##rsvpAsync.all(list)
Creates new Promise, that waiting for all given promises/values is resolved.

**Params**

- list `Array`  

<a name="RSVPAsync#resolve"></a>
##rsvpAsync.resolve(value)
Creates new resolved with given value Promise.

**Params**

- value `*`  

<a name="RSVPAsync#reject"></a>
##rsvpAsync.reject(value)
Creates new rejected with given value Promise.

**Params**

- value `*`  

<a name="RSVPAsync#defer"></a>
##rsvpAsync.defer()
Universal defer function.
Could be overriden by async implementors.

**Returns**: `Object`  
<a name="DefaultFactory"></a>
#class: DefaultFactory
**Extends**: `Factory`  
**Members**

* [class: DefaultFactory](#DefaultFactory)
  * [new DefaultFactory()](#new_DefaultFactory)
  * [defaultFactory.factory(definition)](#DefaultFactory#factory)

<a name="new_DefaultFactory"></a>
##new DefaultFactory()
DefaultFactory

**Extends**: `Factory`  
<a name="DefaultFactory#factory"></a>
##defaultFactory.factory(definition)
Returns constructed object.

**Params**

- definition `Object`  

**Returns**: `Object` | `Promise`  
<a name="RequireJSLoader"></a>
#class: RequireJSLoader
**Extends**: `Loader`  
**Members**

* [class: RequireJSLoader](#RequireJSLoader)
  * [new RequireJSLoader()](#new_RequireJSLoader)
  * [requireJSLoader.require(path, async, [options])](#RequireJSLoader#require)
  * [requireJSLoader.read(path, async, [options])](#RequireJSLoader#read)

<a name="new_RequireJSLoader"></a>
##new RequireJSLoader()
RequireJSLoader

**Extends**: `Loader`  
<a name="RequireJSLoader#require"></a>
##requireJSLoader.require(path, async, [options])
Requires a module.

**Params**

- path `string`  
- async `Async`  
- \[options\] `Object`  

<a name="RequireJSLoader#read"></a>
##requireJSLoader.read(path, async, [options])
Loads resource.

**Params**

- path `string`  
- async `Async`  
- \[options\] `Object`  

<a name="CJSLoader"></a>
#class: CJSLoader
**Extends**: `Loader`  
**Members**

* [class: CJSLoader](#CJSLoader)
  * [new CJSLoader()](#new_CJSLoader)
  * [cjsLoader.require(path, async, [options])](#CJSLoader#require)
  * [cjsLoader.read(path, async, [options])](#CJSLoader#read)

<a name="new_CJSLoader"></a>
##new CJSLoader()
CJSLoader

**Extends**: `Loader`  
<a name="CJSLoader#require"></a>
##cjsLoader.require(path, async, [options])
Requires a module.

**Params**

- path `string`  
- async `Async`  
- \[options\] `Object`  

<a name="CJSLoader#read"></a>
##cjsLoader.read(path, async, [options])
Loads resource.

**Params**

- path `string`  
- async `Async`  
- \[options\] `Object`  

<a name="CompositeParser"></a>
#class: CompositeParser
**Extends**: `Parser`  
**Members**

* [class: CompositeParser](#CompositeParser)
  * [new CompositeParser()](#new_CompositeParser)
  * [compositeParser.test(str)](#CompositeParser#test)
  * [compositeParser.parse(something)](#CompositeParser#parse)

<a name="new_CompositeParser"></a>
##new CompositeParser()
CompositeParser

**Extends**: `Parser`  
<a name="CompositeParser#test"></a>
##compositeParser.test(str)
Tests given string to be parsed.

**Params**

- str `string`  

**Returns**: `Promise` | `boolean`  
<a name="CompositeParser#parse"></a>
##compositeParser.parse(something)
Parses string.

**Params**

- something `*`  

**Returns**: `Promise` | `*`  
<a name="StringParser"></a>
#class: StringParser
**Extends**: `Parser`  
**Members**

* [class: StringParser](#StringParser)
  * [new StringParser()](#new_StringParser)
  * [stringParser.test(str)](#StringParser#test)
  * [stringParser.parse(something)](#StringParser#parse)

<a name="new_StringParser"></a>
##new StringParser()
StringParser

**Extends**: `Parser`  
<a name="StringParser#test"></a>
##stringParser.test(str)
Tests given string to be parsed.

**Params**

- str `string`  

**Returns**: `Promise` | `boolean`  
<a name="StringParser#parse"></a>
##stringParser.parse(something)
Parses string.

**Params**

- something `*`  

**Returns**: `Promise` | `*`  
<a name="WrappingParser"></a>
#class: WrappingParser
**Extends**: `Parser`  
**Members**

* [class: WrappingParser](#WrappingParser)
  * [new WrappingParser()](#new_WrappingParser)
  * [wrappingParser.test(str)](#WrappingParser#test)
  * [wrappingParser.parse(something)](#WrappingParser#parse)

<a name="new_WrappingParser"></a>
##new WrappingParser()
WrappingParser

**Extends**: `Parser`  
<a name="WrappingParser#test"></a>
##wrappingParser.test(str)
Tests given string to be parsed.

**Params**

- str `string`  

**Returns**: `Promise` | `boolean`  
<a name="WrappingParser#parse"></a>
##wrappingParser.parse(something)
Parses string.

**Params**

- something `*`  

**Returns**: `Promise` | `*`  
<a name="DMProvider"></a>
#class: DMProvider
**Extends**: `Provider`  
**Members**

* [class: DMProvider](#DMProvider)
  * [new DMProvider()](#new_DMProvider)
  * [dmProvider.get(definition)](#DMProvider#get)

<a name="new_DMProvider"></a>
##new DMProvider()
DMProvider

**Extends**: `Provider`  
<a name="DMProvider#get"></a>
##dmProvider.get(definition)
**Params**

- definition `object`  

<a name="ParameterProvider"></a>
#class: ParameterProvider
**Extends**: `Provider`  
**Members**

* [class: ParameterProvider](#ParameterProvider)
  * [new ParameterProvider()](#new_ParameterProvider)
  * [parameterProvider.get(definition)](#ParameterProvider#get)

<a name="new_ParameterProvider"></a>
##new ParameterProvider()
ParameterProvider

**Extends**: `Provider`  
<a name="ParameterProvider#get"></a>
##parameterProvider.get(definition)
**Params**

- definition `object`  
  - name `string`  

<a name="ResourceProvider"></a>
#class: ResourceProvider
**Extends**: `Provider`  
**Members**

* [class: ResourceProvider](#ResourceProvider)
  * [new ResourceProvider()](#new_ResourceProvider)
  * [resourceProvider.get(definition)](#ResourceProvider#get)

<a name="new_ResourceProvider"></a>
##new ResourceProvider()
ResourceProvider

**Extends**: `Provider`  
<a name="ResourceProvider#get"></a>
##resourceProvider.get(definition)
**Params**

- definition `object`  
  - path `string`  
  - handler `string`  

<a name="ServiceProvider"></a>
#class: ServiceProvider
**Extends**: `Provider`  
**Members**

* [class: ServiceProvider](#ServiceProvider)
  * [new ServiceProvider()](#new_ServiceProvider)
  * [serviceProvider.get(definition)](#ServiceProvider#get)

<a name="new_ServiceProvider"></a>
##new ServiceProvider()
ServiceProvider

**Extends**: `Provider`  
<a name="ServiceProvider#get"></a>
##serviceProvider.get(definition)
**Params**

- definition `object`  
  - name `string`  
  - property `string`  
  - args `Array`  

<a name="MultipleStringParser"></a>
#class: MultipleStringParser
**Extends**: `StringParser`  
**Members**

* [class: MultipleStringParser](#MultipleStringParser)
  * [new MultipleStringParser()](#new_MultipleStringParser)
  * [multipleStringParser.test(str)](#MultipleStringParser#test)
  * [multipleStringParser.parse(something)](#MultipleStringParser#parse)

<a name="new_MultipleStringParser"></a>
##new MultipleStringParser()
MultipleStringParser

**Extends**: `StringParser`  
**Author**: Sergey Kamardin <s.kamardin@tcsbank.ru>  
<a name="MultipleStringParser#test"></a>
##multipleStringParser.test(str)
Tests given string to be parsed.

**Params**

- str `string`  

**Returns**: `Promise` | `boolean`  
<a name="MultipleStringParser#parse"></a>
##multipleStringParser.parse(something)
Parses string.

**Params**

- something `*`  

**Returns**: `Promise` | `*`  
<a name="SingleStringParser"></a>
#class: SingleStringParser
**Extends**: `StringParser`  
**Members**

* [class: SingleStringParser](#SingleStringParser)
  * [new SingleStringParser()](#new_SingleStringParser)
  * [singleStringParser.test(str)](#SingleStringParser#test)
  * [singleStringParser.parse(something)](#SingleStringParser#parse)

<a name="new_SingleStringParser"></a>
##new SingleStringParser()
SingleStringParser

**Extends**: `StringParser`  
**Author**: Sergey Kamardin <s.kamardin@tcsbank.ru>  
<a name="SingleStringParser#test"></a>
##singleStringParser.test(str)
Tests given string to be parsed.

**Params**

- str `string`  

**Returns**: `Promise` | `boolean`  
<a name="SingleStringParser#parse"></a>
##singleStringParser.parse(something)
Parses string.

**Params**

- something `*`  

**Returns**: `Promise` | `*`  
<a name="Template"></a>
#class: Template
Template

**Members**

* [class: Template](#Template)
  * [new Template([options])](#new_Template)
  * [template.define()](#Template#define)

<a name="new_Template"></a>
##new Template([options])
Template

**Params**

- \[options\] `Object`  

**Author**: Sergey Kamardin <s.kamardin@tcsbank.ru>  
<a name="Template#define"></a>
##template.define()
**Access**: protected  
<a name="EventualParser"></a>
#class: EventualParser
**Extends**: `Parser`  
**Members**

* [class: EventualParser](#EventualParser)
  * [new EventualParser()](#new_EventualParser)
  * [eventualParser.test(str)](#EventualParser#test)
  * [eventualParser.parse(something)](#EventualParser#parse)

<a name="new_EventualParser"></a>
##new EventualParser()
EventualParser

**Extends**: `Parser`  
**Author**: Sergey Kamardin <s.kamardin@tcsbank.ru>  
<a name="EventualParser#test"></a>
##eventualParser.test(str)
Tests given string to be parsed.

**Params**

- str `string`  

**Returns**: `Promise` | `boolean`  
<a name="EventualParser#parse"></a>
##eventualParser.parse(something)
Parses string.

**Params**

- something `*`  

**Returns**: `Promise` | `*`  
<a name="ProcessingParser"></a>
#class: ProcessingParser
**Extends**: `Parser`  
**Members**

* [class: ProcessingParser](#ProcessingParser)
  * [new ProcessingParser()](#new_ProcessingParser)
  * [processingParser.process()](#ProcessingParser#process)
  * [processingParser.test(str)](#ProcessingParser#test)
  * [processingParser.parse(something)](#ProcessingParser#parse)

<a name="new_ProcessingParser"></a>
##new ProcessingParser()
ProcessingParser

**Extends**: `Parser`  
<a name="ProcessingParser#process"></a>
##processingParser.process()
<a name="ProcessingParser#test"></a>
##processingParser.test(str)
Tests given string to be parsed.

**Params**

- str `string`  

**Returns**: `Promise` | `boolean`  
<a name="ProcessingParser#parse"></a>
##processingParser.parse(something)
Parses string.

**Params**

- something `*`  

**Returns**: `Promise` | `*`  
<a name="DefaultDMProvider"></a>
#class: DefaultDMProvider
**Extends**: `DMProvider`  
**Members**

* [class: DefaultDMProvider](#DefaultDMProvider)
  * [new DefaultDMProvider()](#new_DefaultDMProvider)
  * [defaultDMProvider.get(definition)](#DefaultDMProvider#get)

<a name="new_DefaultDMProvider"></a>
##new DefaultDMProvider()
DefaultDMProvider

**Extends**: `DMProvider`  
<a name="DefaultDMProvider#get"></a>
##defaultDMProvider.get(definition)
**Params**

- definition `object`  

<a name="DefaultParameterProvider"></a>
#class: DefaultParameterProvider
**Extends**: `ParameterProvider`  
**Members**

* [class: DefaultParameterProvider](#DefaultParameterProvider)
  * [new DefaultParameterProvider()](#new_DefaultParameterProvider)
  * [defaultParameterProvider.get(definition)](#DefaultParameterProvider#get)

<a name="new_DefaultParameterProvider"></a>
##new DefaultParameterProvider()
DefaultParameterProvider

**Extends**: `ParameterProvider`  
**Author**: Sergey Kamardin <s.kamardin@tcsbank.ru>  
<a name="DefaultParameterProvider#get"></a>
##defaultParameterProvider.get(definition)
**Params**

- definition `object`  
  - name `string`  

<a name="DefaultResourceProvider"></a>
#class: DefaultResourceProvider
**Extends**: `ResourceProvider`  
**Members**

* [class: DefaultResourceProvider](#DefaultResourceProvider)
  * [new DefaultResourceProvider()](#new_DefaultResourceProvider)
  * [defaultResourceProvider.get(definition)](#DefaultResourceProvider#get)

<a name="new_DefaultResourceProvider"></a>
##new DefaultResourceProvider()
DefaultResourceProvider

**Extends**: `ResourceProvider`  
**Author**: Sergey Kamardin <s.kamardin@tcsbank.ru>  
<a name="DefaultResourceProvider#get"></a>
##defaultResourceProvider.get(definition)
**Params**

- definition `object`  
  - path `string`  
  - handler `string`  

<a name="DefaultServiceProvider"></a>
#class: DefaultServiceProvider
**Extends**: `ServiceProvider`  
**Members**

* [class: DefaultServiceProvider](#DefaultServiceProvider)
  * [new DefaultServiceProvider()](#new_DefaultServiceProvider)
  * [defaultServiceProvider.get(definition)](#DefaultServiceProvider#get)

<a name="new_DefaultServiceProvider"></a>
##new DefaultServiceProvider()
DefaultServiceProvider

**Extends**: `ServiceProvider`  
**Author**: Sergey Kamardin <s.kamardin@tcsbank.ru>  
<a name="DefaultServiceProvider#get"></a>
##defaultServiceProvider.get(definition)
Returns service promise.

**Params**

- definition `Object`  
  - name `string`  
  - \[property\] `string`  
  - \[args\] `Array`  

**Returns**: `Promise`  
<a name="HypnofrogTemplate"></a>
#class: HypnofrogTemplate
**Extends**: `Template`  
**Members**

* [class: HypnofrogTemplate](#HypnofrogTemplate)
  * [new HypnofrogTemplate()](#new_HypnofrogTemplate)
  * [hypnofrogTemplate.define()](#HypnofrogTemplate#define)

<a name="new_HypnofrogTemplate"></a>
##new HypnofrogTemplate()
HypnofrogTemplate

**Extends**: `Template`  
<a name="HypnofrogTemplate#define"></a>
##hypnofrogTemplate.define()
**Access**: protected  
<a name="ParameterTemplate"></a>
#class: ParameterTemplate
**Extends**: `Template`  
**Members**

* [class: ParameterTemplate](#ParameterTemplate)
  * [new ParameterTemplate()](#new_ParameterTemplate)
  * [parameterTemplate.define()](#ParameterTemplate#define)

<a name="new_ParameterTemplate"></a>
##new ParameterTemplate()
ParameterTemplate

**Extends**: `Template`  
**Author**: Sergey Kamardin <s.kamardin@tcsbank.ru>  
<a name="ParameterTemplate#define"></a>
##parameterTemplate.define()
**Access**: protected  
<a name="ResourceTemplate"></a>
#class: ResourceTemplate
**Extends**: `Template`  
**Members**

* [class: ResourceTemplate](#ResourceTemplate)
  * [new ResourceTemplate()](#new_ResourceTemplate)
  * [resourceTemplate.define()](#ResourceTemplate#define)

<a name="new_ResourceTemplate"></a>
##new ResourceTemplate()
ResourceTemplate

**Extends**: `Template`  
**Author**: Sergey Kamardin <s.kamardin@tcsbank.ru>  
<a name="ResourceTemplate#define"></a>
##resourceTemplate.define()
**Access**: protected  
<a name="ServiceTemplate"></a>
#class: ServiceTemplate
**Extends**: `Template`  
**Members**

* [class: ServiceTemplate](#ServiceTemplate)
  * [new ServiceTemplate()](#new_ServiceTemplate)
  * [serviceTemplate.define()](#ServiceTemplate#define)

<a name="new_ServiceTemplate"></a>
##new ServiceTemplate()
ServiceTemplate

**Extends**: `Template`  
**Author**: Sergey Kamardin <s.kamardin@tcsbank.ru>  
<a name="ServiceTemplate#define"></a>
##serviceTemplate.define()
**Access**: protected  
<a name="StringifyProcessing"></a>
#class: StringifyProcessing
**Extends**: `Processing`  
**Members**

* [class: StringifyProcessing](#StringifyProcessing)
  * [new StringifyProcessing()](#new_StringifyProcessing)

<a name="new_StringifyProcessing"></a>
##new StringifyProcessing()
StringifyProcessing

**Extends**: `Processing`  
<a name="LiveParameterTemplate"></a>
#class: LiveParameterTemplate
**Extends**: `ParameterTemplate`  
**Members**

* [class: LiveParameterTemplate](#LiveParameterTemplate)
  * [new LiveParameterTemplate()](#new_LiveParameterTemplate)
  * [liveParameterTemplate.define()](#LiveParameterTemplate#define)

<a name="new_LiveParameterTemplate"></a>
##new LiveParameterTemplate()
LiveParameterTemplate

**Extends**: `ParameterTemplate`  
**Author**: Sergey Kamardin <s.kamardin@tcsbank.ru>  
<a name="LiveParameterTemplate#define"></a>
##liveParameterTemplate.define()
**Access**: protected  
<a name="LiveResourceTemplate"></a>
#class: LiveResourceTemplate
**Extends**: `ResourceTemplate`  
**Members**

* [class: LiveResourceTemplate](#LiveResourceTemplate)
  * [new LiveResourceTemplate()](#new_LiveResourceTemplate)
  * [liveResourceTemplate.define()](#LiveResourceTemplate#define)

<a name="new_LiveResourceTemplate"></a>
##new LiveResourceTemplate()
LiveResourceTemplate

**Extends**: `ResourceTemplate`  
**Author**: Sergey Kamardin <s.kamardin@tcsbank.ru>  
<a name="LiveResourceTemplate#define"></a>
##liveResourceTemplate.define()
**Access**: protected  
<a name="LiveServiceTemplate"></a>
#class: LiveServiceTemplate
**Extends**: `ServiceTemplate`  
**Members**

* [class: LiveServiceTemplate](#LiveServiceTemplate)
  * [new LiveServiceTemplate()](#new_LiveServiceTemplate)
  * [liveServiceTemplate.define()](#LiveServiceTemplate#define)

<a name="new_LiveServiceTemplate"></a>
##new LiveServiceTemplate()
LiveServiceTemplate

**Extends**: `ServiceTemplate`  
**Author**: Sergey Kamardin <s.kamardin@tcsbank.ru>  
<a name="LiveServiceTemplate#define"></a>
##liveServiceTemplate.define()
**Access**: protected  
<a name="setDefinition"></a>
#setDefinition(key, definition)
Sets up service definition.

**Params**

- key `string`  
- definition `Object`  

<a name="getDefinition"></a>
#getDefinition(key)
Returns service definition.

**Params**

- key `string`  

**Returns**: `Object`  
<a name="getDefinitions"></a>
#getDefinitions()
Returns map of definitions.

**Returns**: `Object`  
<a name="setParameter"></a>
#setParameter(key, value)
Sets up parameter.

**Params**

- key   
- value   

**Type**: `Error`  
<a name="getParameter"></a>
#getParameter(key)
Returns parameter.

**Params**

- key   

**Type**: `TypeError`  
**Returns**: `*`  
<a name="getParameters"></a>
#getParameters()
Returns all parameters.

**Returns**: `Object`  
<a name="parse"></a>
#parse(value)
Finds out references to services, parameters and resources in given object.
Returns promise of getting them, which is resolved then with object having parsed values.

**Params**

- value `*`  

**Returns**: `Promise`  
<a name="has"></a>
#has(key)
Checks for service being configured.

**Params**

- key `string`  

**Type**: `TypeError`  
**Returns**: `boolean`  
<a name="initialized"></a>
#initialized(key)
Checks for service being built.

**Params**

- key `string`  

**Returns**: `boolean`  
<a name="set"></a>
#set(key, service)
Builds in built service.

**Params**

- key `string`  
- service `Object`  

<a name="get"></a>
#get(key)
Retrieves service.

**Params**

- key `string`  

**Returns**: `Promise`  
<a name="build"></a>
#build(definition)
Builds service.

**Params**

- definition `Object`  

**Returns**: `Promise`  
