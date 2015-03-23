<a name="DM"></a>
#class: DM
DM

**Members**

* [class: DM](#DM)
  * [new DM(async, loader, [config])](#new_DM)
  * [dM.setDefinition(key, definition)](#DM#setDefinition)
  * [dM.getDefinition(key)](#DM#getDefinition)
  * [dM.getDefinitions()](#DM#getDefinitions)
  * [dM.setParameter(key, value)](#DM#setParameter)
  * [dM.getParameter(key)](#DM#getParameter)
  * [dM.getParameters()](#DM#getParameters)
  * [dM.parse(value)](#DM#parse)
  * [dM.has(key)](#DM#has)
  * [dM.initialized(key)](#DM#initialized)
  * [dM.set(key, service)](#DM#set)
  * [dM.get(key)](#DM#get)
  * [dM.build(definition)](#DM#build)
  * [DM.escape()](#DM.escape)
  * [DM.unEscape()](#DM.unEscape)
  * [DM.extend()](#DM.extend)

<a name="new_DM"></a>
##new DM(async, loader, [config])
**Params**

- async `Async`  
- loader `Loader`  
- \[config\] `Object`  

**Type**: `Error`  
<a name="DM#setDefinition"></a>
##dM.setDefinition(key, definition)
Sets up service definition.

**Params**

- key `string`  
- definition `Object`  

<a name="DM#getDefinition"></a>
##dM.getDefinition(key)
Returns service definition.

**Params**

- key `string`  

**Returns**: `Object`  
<a name="DM#getDefinitions"></a>
##dM.getDefinitions()
Returns map of definitions.

**Returns**: `Object`  
<a name="DM#setParameter"></a>
##dM.setParameter(key, value)
Sets up parameter.

**Params**

- key   
- value   

**Type**: `Error`  
<a name="DM#getParameter"></a>
##dM.getParameter(key)
Returns parameter.

**Params**

- key   

**Type**: `TypeError`  
**Returns**: `*`  
<a name="DM#getParameters"></a>
##dM.getParameters()
Returns all parameters.

**Returns**: `Object`  
<a name="DM#parse"></a>
##dM.parse(value)
Finds out references to services, parameters and resources in given object.
Returns promise of getting them, which is resolved then with object having parsed values.

**Params**

- value `*`  

**Returns**: `Promise`  
<a name="DM#has"></a>
##dM.has(key)
Checks for service being configured.

**Params**

- key `string`  

**Type**: `TypeError`  
**Returns**: `boolean`  
<a name="DM#initialized"></a>
##dM.initialized(key)
Checks for service being built.

**Params**

- key `string`  

**Returns**: `boolean`  
<a name="DM#set"></a>
##dM.set(key, service)
Builds in built service.

**Params**

- key `string`  
- service `Object`  

<a name="DM#get"></a>
##dM.get(key)
Retrieves service.

**Params**

- key `string`  

**Returns**: `Promise`  
<a name="DM#build"></a>
##dM.build(definition)
Builds service.

**Params**

- definition `Object`  

**Returns**: `Promise`  
<a name="DM.escape"></a>
##DM.escape()
<a name="DM.unEscape"></a>
##DM.unEscape()
<a name="DM.extend"></a>
##DM.extend()
