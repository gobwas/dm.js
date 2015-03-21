#Index

**Classes**

* [class: DM](#DM)
  * [new DM(async, loader, [config])](#new_DM)

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
- loader `Loader`  
- \[config\] `Object`  

**Type**: `Error`  
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
