//(function(){

    _SJL = function(elementList)
    {
        this.elements = elementList;
        this._id = 0;

        /** Extend the class _SJL
         * @param {string} names - the names of the property or method. An array of string can be passed. When array is passed, a list of identical properties (or method) will be created.
         * @param {func} value - the value of new propertie of the callback of new method.
         */
        this.extend = function(names, value){
            if (names.constructor !== Array)
            {
                names = [names];
            }

            for (var index in names)
                eval("_SJL.prototype." + names[index] + " = value;");

            return this;
        };

        /** Run func on time by each element in the elements list of this instance of _SJL
         * @param {Function} func - The function to be called with the current element and this instance of SJL by parameter
         * @param {object} _context_ - An optional context to call "func". If not passed, the current instance of _SJL will be used as context
         */
        this.do = function(func, _context_){
            _context_ = _context_ || this;
            for (c in this.elements)
            {
                func.call(_context_, this.elements[c], _context_);
            }

            return this;
        };


        //the function bellow is used to add to new object same methods of element in "this.elements" list
        this._importElementsPoperties = function()
        {
           for (var index in this.elements)
            {
                //creat a global pointer for this _SJL instance
                var globalName = "window.__SJL_"+this.getId();
                eval (globalName + " = this");

                var currElement = this.elements[index];
                for (var propname in currElement)
                {
                    if (!this.hasOwnProperty(propname))
                    {
                        if ((propname.indexOf("on") == 0) || (propname == "addEventListener"))
                        {
                            if ((typeof(currElement[propname]) != "undefined") && (currElement[propname] != null))
                            {
                                eval ("this."+propname + " = function(...args){"+
                                    'for (var index3 = 0; index3 < this.elements.length; index3++){'+
                                        'try{'+
                                            //'if ('+globalName + '.elements[index3].hasOwnProperty("'+propname+'")){'+
                                            //    'console.log("Achou um onClick");'+
                                               globalName + '.elements[index3]["'+propname+'"](...args);'+
                                            //'}'+
                                        '}catch(e){ console.error(e, index);}'+

                                    '}'+
                                '}');
                            }
                        }
                    }
                }
            }
        };
        
        /** Returns an unique ID */
        this.getId = function(){
            //use a property in the window to control the IDS. 
            if (!(window.hasOwnProperty("__id__")))
                window.__id__ = 0;
            ret = window.__id__++;

            ret = "ID"+ret;

            return ret;
        };

        //the argument _forceNewInstance_ just do effect if the pool of instances is in use
        this.S = function (selector, _forceNewInstance_) {

            if (typeof (selector) == 'undefined')
                return this;//SJL;

            var vector = [];

            if (selector.constructor !== Array)
                selector = [selector];

        
            for (var c in this.elements)
            {
                var currEl = this.elements[c];
                selector.forEach(currSelector => {
                    //request the elements from DOM
                    var nodeList = currEl.querySelectorAll(currSelector);

                    //scrolls throught the elements and add its to "vector" array
                    for (var c = 0; c < nodeList.length; c++)
                        vector.push(nodeList[c]);
                });
            }

            //create a new _SJL with the vector of elements
            //ret = new _SJL(vector);
            ret = __getSJLInstance(vector, _forceNewInstance_);

            //return the new _SJL object
            return ret;

        };
        this.$ = this.S;

        this._importElementsPoperties();
    }

    /** Returns a new _SJL instance to work with elements catched by css selector argument "selector" 
     * @param {string} selector - The css selector that will be used to select a list of elements (or unique element) from DOM. These elements are puted in the "elements" property of new _SJL instance
     */


     __SJLPool={
        use: false,
        max: 2,
        currIndex:0,
        instances:[],
        _infoTotalUses: 0
     }

     //allow the limitation of instance os SJL. If used a pool of instances will be used. The application can use 
     //_forceNewInstance_ to ignore pool and create a permanent instance.
     //
     //Pool of instances is disabled by default, bit, in large application, it can reduce memory usage
     __setSJLInstancesPool = function(usePool, maxIntances, preStartInstances){
        __SJLPool.use = usePool;
        __SJLPool.max = maxIntances;
        __SJLPool.currIndex = 0;
        if (preStartInstances)
        {
            for (var c = 0; c < maxIntances; c++)
                __SJLPool.instances[c] = new _SJL();
        }
     }

    //the argument _forceNewInstance_ just do effect if the pool of instances is in use
    __getSJLInstance = function(vector, _forceNewInstance_)
    {
        if ((!__SJLPool.use) || (_forceNewInstance_ === true))
        {
            if (_forceNewInstance_ === true)
                console.log("new SJL instance has forced");
            return new _SJL(vector)
        }
        else
        {
            __SJLPool._infoTotalUses++;
            
            if (__SJLPool.instances.length <= __SJLPool.currIndex)
                __SJLPool.instances[__SJLPool.currIndex] = new _SJL();
            
            var ret = __SJLPool.instances[__SJLPool.currIndex++];
            if (__SJLPool.currIndex >= __SJLPool.max)
                __SJLPool.currIndex = 0;

            eval("window.__SJL_"+ret._id + " = null");

            ret.elements = vector;
            ret._importElementsPoperties();
            return ret;
            
        }
     }

    //the argument _forceNewInstance_ just do effect if the pool of instances is in use
    S = function(selector, _forceNewInstance_)
    {
        if (typeof (selector) == 'undefined')
            return SJL;


        //create a vector to convert nodeList in to an array
        var vector = [];
        
        if (selector.constructor !== Array)
            selector = [selector];

        selector.forEach(currSelector => {
            
            
            if (currSelector instanceof Element) {
                vector.push(currSelector);
            }
            else if ((currSelector != null) && (currSelector != "")){

                //request the elements from DOM
                var nodeList = document.querySelectorAll(currSelector);

                //scrolls throught the elements and add its to "vector" array
                for (var c = 0; c < nodeList.length; c++)
                    vector.push(nodeList[c]);
            }
        });

        //create a new _SJL with the vector of elements
        ret = __getSJLInstance(vector, _forceNewInstance_);


        //return the new _SJL object
        return ret;
    };
    /** A pointer to "S" function: Returns a new _SJL instance to work with elements catched by css selector argument "selector" 
     * @param {string} selector - The css selector that will be used to select a list of elements (or unique element) from DOM. These elements are puted in the "elements" property of new _SJL instance
     */
    $ = S;

    //default SJL instance
    SJL = new _SJL();
//})();



SJL.extend("hide", function(){
    for (var c in this.elements)
    {
        //save the original display property to be used by the "show" method
        this.elements[c].__oldDisplay = this.elements[c].style.display || null;
        this.elements[c].style.display = "none";
    }

    return this;
});

SJL.extend("show", function(){
    for (var c in this.elements)
    {
        //checks if the "hide" method saved the style property
        if (this.elements[c].hasOwnProperty("__oldDisplay") && this.elements[c].__oldDisplay != null)
        {
            this.elements[c].style.display = this.elements[c].__oldDisplay;
            delete this.elements[c].__oldDisplay;
        }
        else
            this.elements[c].style.display = "block";
    }

    return this;
});

/** Sets the value or */
SJL.extend("setValue", function (data) {
    for (var c in this.elements)
    {
        var curr = this.elements[c];

        if (typeof(curr.value) != 'undefined') {
            if (data.constructor === Array)
                curr.value = data[c];
            else
                curr.value = data;
        }
        else {
            if (data.constructor === Array) {
                curr.innerHTML = data[c];
            }
            else
                curr.innerHTML = data;
        }
    }

    return this;
});

SJL.extend("getValue", function () {
    var ret = [];
    for (var c in this.elements)
    {
        var curr = this.elements[c];
        if (curr.hasOwnProperty("value"))
            ret.push(curr.value);
        else
            ret.push(curr.innerHTML);
    }

    if (ret.length == 0)
        return null;
    else if (ret.length == 1)
        return ret[0];
    else
        return ret;
});

/** Function to create animations. A callback is executed with current value beetween from and to, in function of time
@function animate 
@param {double} from - The start value
@param {double} to - The end value
@param {int} milisseconds - The time of the animations (in milisseconds)
@param {Function} callback - The callback to be executed with current value
@param {Function} endCallback - The callback to be executed when the animation is done
@param {object} _pointers_ - The optional params to be passed to callback and endCallback
*/
SJL.extend(["animate", "ani"],  function (from, to, milisseconds, callback, endCallback, _pointers_, __data__) {
    //ons first run (__data__ is private like), create a object for __data__ with the all data necessary to make the
    //animation.
    __data__ = __data__ ||  {
        from: from,
        to: to,
        total: parseFloat(to) - parseFloat(from),
        startTime: new Date(),
        time: milisseconds,
        callback: callback,
        aborted: false,
        abort: function () { this.aborted = true; },
        endCallback: endCallback || null,
        pointers: _pointers_
    };


    //calculates the current time of the animation
    var currTime = (new Date()) - __data__.startTime;

    //checks if the animation time has been reached
    if (currTime > __data__.time)
        currTime = __data__.time;
        
    //determine the current value (between "from" and "to")
    var currValue = (__data__.total / __data__.time * currTime) + __data__.from;

    //call the callback for each element of this _SJL instance, passing the respective element and current value of the animation
    __data__.callback.call(this, currValue, __data__.pointers);

    //checks if animation is done
    if (currTime == __data__.time)
    {
        //call the end callback for each element in this _SJL instance
        if (__data__.endCallback != null) {
            __data__.endCallback.call(this, __data__.pointers);
        }
        
    }

    
    //checks if the animatin is aborted. In case of "false", continue animating
    if ((currTime < __data__.time) && (!__data__.aborted)) {
        setTimeout(function (__this, __data) {
            __this.animate(null, null, null, null, null, null, __data);
        }, 1, this, __data__);
    }

    return this;

});

/** Function to create animations with speedup Math function. A callback is executed with current value beetween from and to, in function of time
@param {double} from - The start value
@param {double} to - The end value
@param {int} milisseconds - The time of the animations (in milisseconds)
@param {Function} callback - The callback to be executed with current value
@param {Function} endCallback - The callback to be executed when the animation is done
@param {object} _pointers_ - The optional params to be passed to callback and endCallback
*/
SJL.extend(["upSpeedAnimate", "upAni"], function (from, to, milisseconds, callback, endCallback, _pointers_) {


    var valMax = to - from;
    var fatorMult = 0;
    var calculatedVal = 0;

    this.animate(0, 20, milisseconds, function (currVal) {
        //var multFactor = (Math.pow(1.171, currVal) - 1) / 100;
        var multFactor = (1 - Math.pow(currVal, -1.5) + 0.01);


        if (multFactor > 1)
            multFactor = 1;
        //calcula o valor atual

        calculatedVal = multFactor * valMax;
        //aplica o offset
        calculatedVal += from;


        if (to > from) {
            if (calculatedVal < from)
                calculatedVal = from;
            else if (calculatedVal > to)
                calculatedVal = to;
        }
        else {
            if (calculatedVal < to)
                calculatedVal = to;
            else if (calculatedVal > from)
                calculatedVal = from;
        }

        //chama a função passada por parametro
        if (currVal != 15)
            callback.call(this, calculatedVal, _pointers_);
        //else
        //    callback.call(this, to, _pointers_);
    }, function(){
        callback.call(this, to, _pointers_);
        endCallback.call(this);
    }, _pointers_);

    return this;
});



SJL.extend("request", function (method, url, data, callback, _context_, _callbackAditionalArgs_, _progressCallback_) {
    callback = callback || null;
    var xhttp = new XMLHttpRequest();
    if (typeof(_progressCallback_) != 'undefined')
    {
        xhttp.onprogress = function(evt){
            if (evt.lengthComputable)
            {
                _progressCallback_.call(_context_ || this, 100.0 / evt.total * evt.loaded, evt.total, evt.loaded, url, evt, xhttp);
            }
        }
    }
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4){// && this.status == 200) {
            if (callback != null) {
                callback.call(_context_ || this, this.responseText, this, _callbackAditionalArgs_, xhttp);
            }
        }
    };
    xhttp.open(method, url, true);
    xhttp.method = method.toUpperCase();
    if ("post put".indexOf(method.toLowerCase()) > -1)
    {
        xhttp.send(data);
    }
    else
    {
        xhttp.send();
    }

    return this;
});

SJL.extend("get", function (url, callback, _context_, _callbackAditionalArgs_, _progressCallback_) {
    this.request("GET", url, null, callback, _context_, _callbackAditionalArgs_, _progressCallback_);
    return this;
});

SJL.extend("post", function (url, data, callback, _context_, _callbackAditionalArgs_, _progressCallback_) {
    this.request("POST", url, data, callback, _context_, _callbackAditionalArgs_, _progressCallback_);
    return this;
});

SJL.extend("put", function (url, data, callback, _context_, _callbackAditionalArgs_, _progressCallback_) {
    this.request("PUT", url, data, callback, _context_, _callbackAditionalArgs_, _progressCallback_);
    return this;
});

SJL.extend("delete", function (url, callback, _context_, _callbackAditionalArgs_, _progressCallback_) {
    this.request("DELETE", url, null, callback, _context_, _callbackAditionalArgs_, _progressCallback_);
    return this;
});

SJL.extend(["includeUsingTags", "loadScriptUsingTags", "scriptUsingTags", "requireUsingTags"], function (scriptsSrc, onDone, _context_) {
    onDone = onDone || null;

    if (scriptsSrc.constructor !== Array)
        scriptsSrc =[scriptsSrc];
    var dones = scriptsSrc.length;
    for (var c in scriptsSrc)
    {
        var type = "text/javascript";
        if (scriptsSrc[0].toLowerCase().endsWith(".css"))
            type = "text/css";


        if (type == "text/javascript")
        {
            //create the script element
            var script = document.createElement("script");
            //set the src of the new script
        }
        else
        {
            var script = document.createElement('link');
            script.rel = "Stylesheet";
        }
        script.src = scriptsSrc[c];
        
        //determine the type of the new script
        script.type = type;

        //set the onloadFunction
        script.onload = function () {
            dones --;
            if (dones == 0)
            {
                if (onDone != null)
                    onDone.call(_context_ || this);
            }
        };
        //add the new script to DOM. After this, the browser will be load the new script.
        document.head.appendChild(script);
    }

    return this;
});

SJL.extend(["include", "loadScript", "script", "require"], function (scriptsSrc, onDone, _context_, _progressCallback_) {
    onDone = onDone || null;

    if (scriptsSrc.constructor !== Array)
        scriptsSrc =[scriptsSrc];
        
    var dones = scriptsSrc.length;
    for (var c in scriptsSrc)
    {
        var type = "text/javascript";
        if (scriptsSrc[c].toLowerCase().endsWith(".css"))
            type = "text/css";

        this.get(scriptsSrc[c], function(response){

            if (type == "text/javascript")
            {
                //create the script element
                var script = document.createElement("script");
                //set the src of the new script
                eval (response);
            }
            else
            {
                var script = document.createElement('link');
                script.rel = "Stylesheet";
                script.innerHTML = response;
            
            //determine the type of the new script
            script.type = type;

                //set the onloadFunction
                
                //add the new script to DOM. After this, the browser will be load the new script.
                document.documentElement.appendChild(script);
            }

            //script.onload = function () {
                dones --;
                if (dones == 0)
                {
                    if (onDone != null)
                        onDone.call(_context_ || this);
                }
            //};
            
        }, _context_ || this, null, _progressCallback_);
    }

    return this;
});

/** this method load an additional html. Scripts and Styles are automatically parsed and moved to header*/
SJL.extend(["autoLoadComponents", "loadComponentsFromTags"], function(element, onDone) {
    //scrolls through all subelements and, for elements that have "SJLload"  attribute, try auto load
    var allElements = $(element).$("*");
    var length = allElements.elements.length;

    if (allElements.elements.length == 0)
    {
        onDone.call(this);
    }
    else
    {
        var waitings = 0;
        var _this = this;
        allElements.do(function(currElement){
            var componentName = currElement.getAttribute("SJLLoad");
            if (componentName != null)
            {
                //SJL_CurrAPP
                var active = currElement.getAttribute("SJLActive") ||
                currElement.getAttribute("SJLInstanciate") ||
                currElement.getAttribute("SJLIntance") || "none";
                
                if ((active != "none") && (active != "") && (active != "false"))
                {
                    console.log("active instance")
                    $(currElement).loadActiveComponent(componentName, function(newInstance){
                        waitings++;

                        //app and SJL_CurrAPP has are same value
                        newInstance.controlledElement.app = newInstance;
                        if (waitings == length)
                        {
                            onDone.call(_this);
                        }
                    });
                }
                else
                {
                    console.log("normal component include");
                    $(currElement).loadComponent(componentName, function(){
                        waitings++;
                        if (waitings == length)
                        {
                            onDone.call(_this);
                        }
                    });
                }
            }
            else
            {
                waitings++;
                if (waitings == length)
                {
                    onDone.call(_this);
                }
            }
        });
        //onDone.call(_this);
    }
});

SJL.extend("loadHtmlText", function (htmlText, onLoad, _clearHtml, _context_, _onLoadArguments_, _discardCssAndJs_)
{
    if ((typeof(_clearHtml_) == 'undefined') || (_clearHtml_ == true))
    {
        this.setProperty("innerHTML", "");
    }

    var processeds = 0;

    this.do(function(c){
        var nHtml = htmlText;

        if ((nHtml.indexOf("__rnd__") > -1) || ((nHtml.indexOf("__uid__") > -1)))
        {
            if (!SJL.hasOwnProperty("UniqueIdCount"))
            {
                SJL.UniqueIdCount = 1;
            }

            var rep = "uid"+SJL.UniqueIdCount;
            SJL.UniqueIdCount++;

            nHtml =nHtml.replace(/__rnd__/g, rep).replace(/__uid__/g, rep);

            //if have random data in scripts and css, the system could not ignore a new css and javascript text
            _discardCssAndJs_ = false; 
        }
        //the argument _discardCssAndJs_ can be used to prevend excessive css and javascript loading (when components are loading)

        if (typeof (_discardCssAndJs_) == 'undefined')
            _discardCssAndJs_ = false;

        //try put any header in heaer
        var temp = document.createElement("div");
        temp.innerHTML = nHtml;

        
    

        var scripts = $(temp).$("script").do(function (currEl) {
            if (!_discardCssAndJs_)
                eval(currEl.innerHTML);

            currEl.parentNode.removeChild(currEl); 
        });

        var css = $(temp).$("style").do(function (currEl) {
            if (!_discardCssAndJs_) {
                document.head.appendChild(currEl);
            }
            else
                currEl.parentNode.removeChild(currEl);
        });

        nHtml = temp.innerHTML;
        
        //checks if to be clear the html
            
        c.innerHTML += nHtml;

        this.autoLoadComponents(c, function(){
            processeds++;
            if (processeds == this.elements.length)
            {
                onLoad.call(_context_ || this, htmlText, this, _onLoadArguments_);

                if (c.getAttribute("onload") != null)
                {
                    eval(c.getAttribute("onload"));
                }
            }
        });
    });
    //onLoad.call(_context_ || this, htmlText, this, _onLoadArguments_);
    
    
})

SJL.extend(["loadHtml", "setHtml"], function (htmlName, onLoad, _onFailure_, _clearHtml_, _context_, _onLoadArguments_, _progressCallback_) {
    if (!SJL.hasOwnProperty("_loadedComponents"))
        SJL._loadedComponents = [];
    
    
    //try to find the htmlName in loadedComponents
    var index = SJL._loadedComponents.findIndex(function(currEl){ 
        return currEl.htmlName.toLowerCase() == htmlName.toLowerCase();
    });

    if (index == -1)
    {
        //load the html file
        this.get(htmlName, function (result, request) {
            if ((request.status >= 200) && (request.status < 300)) {    
                SJL._loadedComponents.push({ htmlName: htmlName, htmlContent: result, alreadyLoaded: true });
                this.loadHtmlText(result, onLoad, _clearHtml_, _context_, _onLoadArguments_);
            }
            else
            {
                if (typeof(_onFailure_) != 'undefined' && _onFailure_ != null)
                    _onFailure_.call (_context_ || this, request);
            }
        }, this, null, _progressCallback_);
    }
    else
    {
        //the property alreadyLoaded is used by the preloadHtml method to loadHTMl without start the javascript. Is this specific case, the javascript is started bellow
        if (!SJL._loadedComponents[index].hasOwnProperty("alreadyLoaded"))
            SJL._loadedComponents[index].alreadyLoaded = false;
        this.loadHtmlText(SJL._loadedComponents[index].htmlContent, onLoad, _clearHtml_, _context_, _onLoadArguments_, SJL._loadedComponents[index].alreadyLoaded);
        SJL._loadedComponents[index].alreadyLoaded = true;
    }

    return this;
});

//the function bellow can be used to create a cache to functions like 'loadApp' and 'loadComponents'
SJL.extend(["preloadHtml", "preload"], function (htmlFileName, onDone, _context_, _progressCallback_) {

    if (htmlFileName.constructor !== Array)
        htmlFileName = [htmlFileName];

    if (!SJL.hasOwnProperty("_loadedComponents"))
        SJL._loadedComponents = [];

    var loading = 0;
    for (var c = 0; c < htmlFileName.length; c++) {
        loading++;
        if ((htmlFileName[c].indexOf(".htm") == -1) && htmlFileName[c].indexOf(".js") == -1 && htmlFileName[c].indexOf(".css") == -1)
            htmlFileName[c] += ".html";
        //try to find the htmlName in loadedComponents
        var index = SJL._loadedComponents.findIndex(function (currEl) {
            return currEl.htmlName == htmlFileName[c];
        });

        if (index == -1) {
            //load the html file
            this.get(htmlFileName[c], function (result, xhr, contAtt) {
                SJL._loadedComponents.push({ htmlName: htmlFileName[contAtt], htmlContent: result, alreadyLoaded: false });
                loading--;
            }, this, c, _progressCallback_);
        }
        else {
            loading--;
        }
    }

    var waiter = setInterval(function () {
        if (loading == 0)
        {
            clearTimeout(waiter);
            onDone.call(_context_ || this);
        }
    }, 10);

    return this;
});


SJL.extend(["loadComponent", "loadStaticComponent"], function (htmlName, onLoad, _onFailure_, _clearHtml_, _context_, _onLoadArguments_, _progressCallback_) {
    if (htmlName.indexOf(".htm") == -1)
        htmlName += ".html";
    return this.loadHtml(htmlName, onLoad, _onFailure_, _clearHtml_, _context_, _onLoadArguments_, _progressCallback_);
});


/** This method load an html named [appName].html and automaticaly instanciate an javascript class named [appName].
 * Is very similiar to loadComponent, but with de advantage of auto instanciate the class.
 */
SJL.extend(["loadApp", "loadActivity", "loadActiveComponent"], function (appName, onLoad, appArgumentsArray, _onFailure_, _clearHtml_, _context_, _onLoadArguments_, _progressCallback_) {

	//checks by old running app and notify them	
	if ((this.elements[0].hasOwnProperty("SJL_CurrAPP") && this.elements[0].SJL_CurrAPP != null))
	{
        var app = this.elements[0].SJL_CurrAPP;
        var elementP = this.elements[0];
        var _this = this;
        
        if (app != null)
        {
            if (typeof(app.destructor) != 'undefined')
                app.destructor();
            if (typeof(app.stop) != 'undefined')
                app.stop();
            if (typeof(app.release) != 'undefined')
                app.release();
            if (typeof(app.free) != 'undefined')
                app.free();
            if (typeof(app.destroy) != 'undefined')
                app.destroy();

            //dispose needs thats a callback is called to continue
            if (typeof(app.dispose) != 'undefined') //(app.hasOwnProperty("dispose"))
            {
                var _this = this;
                app.dispose(function(){
                    elementP.SJL_CurrAPP = null;
                    _this.loadApp(appName, onLoad, appArgumentsArray, _onFailure_, _clearHtml_, _context_, _onLoadArguments_, _progressCallback_);

                });
                return;
            }

        }
    };
    
    var elementsBackup = this.elements;
    var appSPointer = this;
	this.loadHtml(appName + ".html", function () {
        var appInstance = null;
        appArgumentsArray = appArgumentsArray || null;


        if (appName.indexOf("/") > 0) {
            appName = appName.split('/');
            appName = appName[appName.length - 1];
        }

        eval('if (typeof('+appName+') != "undefined"){ appInstance = new '+appName+'(appArgumentsArray, appSPointer);}else{console.log("SJL could not locate the class \'"+appName+"\'");}');
        
        appSPointer.elements[0].SJL_CurrAPP = appInstance;
        appInstance.controlledElement = appSPointer.elements[0];

		onLoad = onLoad || null;
        if (onLoad != null)
		    onLoad.call(_context_ || appSPointer, appInstance, appSPointer, _onLoadArguments_);
	}, _onFailure_, _clearHtml_, _context_, _onLoadArguments_, _progressCallback_);

    return this;
});


//auto load app specified in the url (http://server/#app/arg1,arg2)
SJL.extend(["loadAppFromUrl", "loadActivityFromUrl"], function (onNotLoad, onLoad, _prefixOrFolder_, _clearHtml_, _context_, _onLoadArguments_, _progressCallback_) {
    this.elements[0].oldUrl = this.elements[0].currUrl || "";
    this.elements[0].currUrl = location.href;

    if (location.href.indexOf("#") > 0) {
        var temp = location.href.substr(location.href.indexOf('#') + 1, location.href.length);
        var args = [];
        if (temp.indexOf('/') > 0) {
            args = temp.substr(temp.indexOf('/') + 1, temp.length);
            args = args.split(',');
            temp = temp.substr(0, temp.indexOf('/'));
        }

        if (typeof(_prefixOrFolder_) != 'undefined' )
        {
            if (_prefixOrFolder_.endsWith ('.'))
                temp = _prefixOrFolder_ + temp;
            else
                temp = _prefixOrFolder_ +'.' + temp;
        }

        temp = temp.replace(/\./g, "/");
        //let stateObject = { foo: "bar" };
        //history.pushState(stateObject, "page 2", "newpage.html");
        

        this.loadApp(temp, onLoad, args, function(request){onNotLoad(request);}, _clearHtml_, _context_, _onLoadArguments_, _progressCallback_);
    }
    else {
        onNotLoad(_onLoadArguments_);
    }
});

//monitores the url, autoloading apps
SJL.extend(["autoLoadAppFromUrl", "autoLoadActivityFromUrl"], function (onNotLoad, onLoad, _forceFirst_, _prefixOrFolder_, _progressCallback_) {
    var __this = this;

    /*window.onbeforeunload = function(){
        preventDefault();
    }*/
    window.onhashchange = function (event) {
        //event.preventDefault();
        __this.loadActivityFromUrl(onNotLoad, onLoad, _prefixOrFolder_, _progressCallback_);
    }

    _forceFirst_ == _forceFirst_ || null;
    if (_forceFirst_ == null)
        _forceFirst_ = true;

    if (_forceFirst_)
        this.loadActivityFromUrl(onNotLoad, onLoad, _prefixOrFolder_, _progressCallback_);

});

//force an app destructor method
SJL.extend(["unLoadApp", "unLoadActivity"], function (appName, onLoad, appArgumentsArray, _clearHtml_, _context_, _onLoadArguments_) {
    //checks by old running app and notify them	
    if (this.elements[0].hasOwnProperty("SJL_CurrAPP")) {
        var app = this.elements[0].SJL_CurrAPP;
        if (app.hasOwnProperty("destructor"))
            app.destructor();
        if (app.hasOwnProperty("stop"))
            app.stop();
        if (app.hasOwnProperty("release"))
            app.release();
        if (app.hasOwnProperty("free"))
            app.free();
        if (app.hasOwnProperty("destroy"))
            app.destroy();
        if (app.hasOwnProperty("dispose"))
            app.dispose();
    };

    this.setValue("");

    return this;
});

SJL.extend("setProperty", function (name, value) {
    for (var c in this.elements)
        eval("this.elements[c]." + name + " = value;");

    return this;
});

SJL.extend("getProperty", function (name, _defaultValue_) {
    _defaultValue_ = _defaultValue_ || null;
    var ret = [];
    for (var c in this.elements) {
        eval("if (this.elements[c].hasOwnProperty('"+name+"')){ret.push(this.elements[c]." + name + ");}");
    }

    if (ret.length == 1)
        return ret[0];
    else if (ret.length > 1)
        return ret;
    else
        return _defaultValue_;
});

SJL.extend(["delete", "exclude"], function () {
    for (var c in this.elements) {
        this.elements[c].parentNode.removeChild(this.elements[c]);
        delete this.elements[c];
    }

    return this;

});


SJL.extend("getCssProperty", function(propertyName){
    var result = [];
    for (var c in this.elements)
    {
        var tempElement = this.elements[c];
        var value = null;
        eval ("value = window.getComputedStyle(tempElement)."+propertyName);
        result.push(value);
    }

    if (result.length == 1)
        return result[0];
    else
        return result;
});


