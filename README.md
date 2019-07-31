SJL is javascript framework I use to make my SPA’s. I wrote it to understant more about Javascript and to make my work easier.

# Resources overview
## Selector

The first thing I need to tell to you about is the element selector of SJL. The selector uses  CSS selectors to get DOM elements 	and create an SJL instance to work with them. Once selected, you can do many things with the elements. 
To do  things with these elements, you must call methodos of returned object. Bellow these methods will be described in detail.
The selector function is ‘$’. 

See bellow an use example of the oselector:

```javascript
$(“.allElementsWithThisClass”)
```

## Loading components
SJL can load components by addresses in the elements in the DOM. When SJL loads a component, it perform many operations and creste many references in the created object. 
The first thing to be highlited is the instance of loaded component: When SJL loads an html file into a DOM element, its create an instance of the component class if this name is equals to filename witout the extension, eg: If the file “MyComponent.html” contains a class “MyComponent”, this class will be instantiated. Once time instantiated, the chosen DOM element will receive an reference to new object. This reference will be the same name of classe (on our example, the new property of the element will be called “MyComponent”).