SJL - A component based javascript library.

SJL is javascript library I use to make my SPA’s. I wrote it to understant more about Javascript and to make my work easier.

SJL can work together another frameworks, like Vue.js, ReactJS or Angular.

SJL also can be used as a framework. If you choose this option, take a look in 'SJL.init' function

---

# 1) Resources overview
## 1.1) Selector

The first thing I need to tell to you about is the element selector of SJL. The selector uses  CSS selectors to get DOM elements 	and create an SJL instance to work with them. Once selected, you can do many things with the elements. 
To do  things with these elements, you must call methodos of returned object. Bellow these methods will be described in detail.
The selector function is ‘$’. 

See bellow an use example of the oselector:

```javascript
$(“.allElementsWithThisClass”)
```

### 1.1.1) SJL Methods to work with elements	

Bellow, you can see some things SJL can do with selected elements
	
#### 1.1.1.1) clearObject
#### 1.1.1.2) hide
This method just set 'display' css property to 'none', hidding the element.

```javascript
$(“.allElementsWithThisClass”).hide();
```
#### 1.1.1.3) show
As 'hide', this method just set 'display' css property, but to 'block', showing the element.

```javascript
$(“.allElementsWithThisClass”).show();
```

#### 1.1.1.4) setValue
Changes the innerHTML or value of an element. If element contains the 'value' property, this will be changed. If element does't contains the 'value' property, the innerHTML will be changed.

```javascript
$(“.allElementsWithThisClass”).setValue("New value of my element");
```

#### 1.1.1.5) getValue
If element contaisn the 'value' property, it will be returned. If element does't contains this property, this method will return the 'innerHTML' of the element.

```javascript
var elementValue = $(“.allElementsWithThisClass”).getValue("New value of my element");
```
#### 1.1.1.6) animate
This method uses browser resources (requestAnimationFrame) to allow your to make animations using javascript. The animatin is based in sum or decreasing of a value. You must supply a start value and a end value and SJL will scrol from 'start value' to 'end value' calling a callback with current value.

This method has following parameters:

    from: the start value 
    to: the end value
    milisseconds: the duration of animation
    callback: the callback to be called with current scroll value
    [endCallback]: An optional callback to be called at end of animation
    [_pointers_]: Optional argument to be sent to each 'callback' call and to 'endCallback'
    
About callback param: Callback param is a function that will be called in each animation step. This funciton will be called with following arguments:

    currentValue: The current scroll value (the current value of animation)
    _pointer_: The value you ifromed to 'animate' method in the '_pointers_' argument;

About endCallback param: endCallback param is a function that will be called when SJL finish the animation. This funciton will be called with following arguments:

    _pointer_: The value you ifromed to 'animate' method in the '_pointers_' argument;

An example of 'animation' call:

```javascript
$(“.allElementsWithThisClass”).animate(0, 1, 250, (currValue) => {
    this.setCssProperty("opacity", currValue);
});
```

#### 1.1.1.7) upSpeedAnimate

The difference between upSpeedAnimate and animate is the function used to get the current value. While the animate function uses a linear function, upSpeedAnimate uses an exponential function, as shown below. The parameters are the same of 'animate'.

    (animation speed)
       .
      / \
       |                               o
       |                              o
       |                            o 
       |                         o
       |                     o
       |                o 
       |         o
       |o 
     --+--------------------------------> (time)
       |

#### 1.1.1.8) downSpeedAnimate

The difference between downSpeedAnimate and animate is the function used to get the current value. While the animate function uses a linear function, downSpeedAnimate uses an exponential function, as shown below. The parameters are the same of 'animate'.

    (animation speed)
       .
      / \
       |o
       | o
       |   o 
       |      o
       |          o
       |               o 
       |                      o
       |                               o 
     --+--------------------------------> (time)
       |

#### 1.1.1.19) setAttribute

This method allow you to set attributes of HTML elements

#### 1.1.1.20) getProperty
#### 1.1.1.21) setCssProperty
#### 1.1.1.22) getCssProperty
#### 1.1.1.23) getComputedCssProperty
#### 1.1.1.24) download
#### 1.1.1.25) stringify


---

## 1.2) Includding css and javascript files
### 1.2.1) include

This method can be used to load another javascript or css files form server. You call this method directly from 'SJL' object

The arguments of this method are:
    src: The adress of file to be loaded
    onDone: A callback to be called when file is loaded.


```javascript
$(“.allElementsWithThisClass”).include('myScriptFolder/MyScript.js', ()=>{
    console.log("The file was loaded");
});
```

#### 1.1.1.14) preloadHtml
#### 1.1.1.10) includeUsingTags


## filling elemnts with HTML files
#### 1.1.1.12) loadHtmlText
#### 1.1.1.13) loadHtml


## Loading components
SJL can load components by addresses in the elements in the DOM. When SJL loads a component, it perform many operations and creste many references in the created object. 
The first thing to be highlited is the instance of loaded component: When SJL loads an html file into a DOM element, its create an instance of the component class if this name is equals to filename witout the extension, eg: If the file “MyComponent.html” contains a class “MyComponent”, this class will be instantiated. Once time instantiated, the chosen DOM element will receive an reference to new object. This reference will be the same name of classe (on our example, the new property of the element will be called “MyComponent”).

#### 1.1.1.16) loadActivity

---

## 1.3) Other resrouces
#### 1.1.1.17) callEvent
#### 1.1.1.18) setProperty
#### 1.1.1.26) bind
#### 1.1.1.27) bindAttribute

#loops
##SJLForeach
	SJLForeach loop allows you to auto create html based in an Javascript array.
	For each element in the informed element array, the SJL will make a copy of 
	desired element.
	
``` html
<div SJLForeach="c in [1,2,3,4,5,6,7]">
	This div is the {{c}} in the div list
<div>
```

---
---


# using SJL as Framework

## Starting up SJL

## Activities

## Auto loading activities by parsing the current URL

---
---

# Requests 

## Requests with callbacks

## Requests with Promises

## get

## post

## delete

## cacheOrGet

# Other things I want to tell you

## what append when you set an element attribute?

If the element is only a simple html, nothing will happening. But if the element is an SJL component container (element contians SJLLoad attribut) the SJL will try find in the component intance, a method called "set[attributename]". It allow you to easy interract with loaded activities and components.



----
----
# how to (faq)
## generic
### including another js and css files
```javascript
    SJL.include("fileFolder\myfile.js");
    SJL.include("fileFolder\myfile.css");
```
## start activity auto loader
### enabling url monitor
	
### change url
#### changeUrl
		
#### go
```javascript
    SJL.go("otherActivity")
```
	

## elements
### catch elements
	
### do anithing to a list of elements

To do actions with a list of elements uses the 'do' method. 'do' method is very similar to a 'foreach' loop control.

```javascript
$(".allElementsOfWithThisClass").do((currElement) =>{
    currElement.className = "otherClass";
});
```

### show
```javascript
$("#elementId").show();
```

### hide
```javascript
$("#elementId").hide();
```

### animate		
#### linerar
```javascript
$(".slideTheseElements").animate(0, 100, (curr) =>{
    //inside this function, 'this' handles to '$(".slideTheseElements")' SJL instance

    this.setCssProperty("height", curr + "px");
})
```
	
#### upspeed
```javascript
$(".slideTheseElements").upSpeedAnimate(0, 100, (curr) =>{
    this.setCssProperty("height", curr + "px");
})
```
	
#### downspeed

```javascript
$(".slideTheseElements").downSpeedAnimate(0, 100, (curr) =>{
    this.setCssProperty("height", curr + "px");
})
```	

### setValue
```javascript
//setting the innerHTML of a div
$("#aDivWithThisId").setValue("New div html")
//setting a vlaue of an input
$("#anInputWithThisId").setValue("New input value")
```

### getValue
```javascript
//getting the innerHTML of a div
var divHtml = $("#aDivWithThisId").getValue();
//getting a vlaue of an input
var inputValue = $("#anInputWithThisId").getValue();
```
### filling elements with html files
```javascript
$("#myElement").loadHtml("folderOnServer/myHtmlFile.html", ()=>{
    console.log("Ok, html was loaded in the element");
});
```

### filling an element with a html text
```javascript
$("#myElement").loadHtmlText(
    `<div class="myContainer">
        <div 
            sjlonload="components/myComponent
        ></div>
    </div>`, 
    ()=>{
        console.log("Ok, html was loaded in the element");
    }
);
/* the difference between loadHtmlText and setValue is that 'loadHtmlText' will triger SJL to load activities and components (the elements with 'SJLLoad' attribute will be loaded).*/
```


### loading a activity/component inside a element

#### SJLEnable - enabling or disable Css and Javascript parsing

### autoload components using SJLLoad

### autoload component using <sjl-folder.componentname

### using attributes

### create my own events
	
### setting Attributes and 'properties' of elements
	
### download of an element content

It's possible do downlod a elemnt content as a file. To do this, follow this example:

```javascript
$("#myElement").download("suggestFilename.html");

//if yout want, you can specify the mimetype
#("#myElement").download("suggest.txt", "text/plain");
```
	
	
## requests
SJL allow a easy way to load resources from the server using request functions. Each function can be used with callback functions or Promises to receive the  result data.

### making requests
		
#### get
To make an GET request, use the "get" function.

```javascript
    //using promises
    SJL.get("server/resource").then((result) => {
        console.log("result: ", result);
    });

    //using callback function
    SJL.get("server/resource", (result) => {
        console.log("result: ", result);
    });
``` 
		
#### post
post function is ver similar to another request methods, but receive a adicional parameter with the data to be sent to the server.

```javascript
    //using promises
    SJL.post("server/resource", "some data, like string or object").then((result) => {
        console.log("result: ", result);
    });

    //using callback function
    SJL.post("server/resource", "some data, like string or object", (result) => {
        console.log("result: ", result);
    });
``` 
		
#### delete
To delete some resource from server, just call 'delete' function:

```javascript
    //using promises
    SJL.delete("server/resource").then((result) => {
        console.log("result: ", result);
    });

    //using callback function
    SJL.delete("server/resource", (result) => {
        console.log("result: ", result);
    });
``` 
		
#### generic requests

## HTML Loops

#### Foreach inside a foreach
``` html
<div sjlforeach="a in [1, 2, 3, 4, 5, 6, 7, 8, 9]">
	childs of {{a}}:
	<div sjlforeach="b in [1, 2, 3, 4, 5, 6, 7, 8, 9]" style="padding-left:15px">
		Div {{a}}.{{b}}
	</div>
</div>
```