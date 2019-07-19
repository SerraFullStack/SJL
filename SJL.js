//(function(){

    _SJL = function(elementList)
    {
		
		//console.log(new Error().stack);
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
        this.do = function(func, _context_, _args_){
            _context_ = _context_ || this;

            for (c in this.elements)
            {
                func.call(_context_, this.elements[c], _context_, _args_);
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
                                eval ("this."+propname + " = function(){"+
                                    'for (var index3 = 0; index3 < this.elements.length; index3++){'+
                                        'try{'+
                                            //'if ('+globalName + '.elements[index3].hasOwnProperty("'+propname+'")){'+
                                            //    'console.log("Achou um onClick");'+
                                               globalName + '.elements[index3]["'+propname+'"](this, arguments);'+
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

		
		this.SInstancesBySelector = {};
        //the argument _forceNewInstance_ just do effect if the pool of instances is in use
        this.S = function (selector, disableUpdate) {
			if (typeof(disableUpdate) == 'undefined')
				disableUpdate = false;

            if (typeof (selector) == 'undefined')
                return this;//SJL;
			
			var originalSelector = selector;

            var vector = [];


            if (selector.constructor !== Array)
                selector = [selector];

        
            for (var c in this.elements)
            {
                var currEl2 = this.elements[c];
				for (var propIndex in selector)
				{
					var currSelector = selector[propIndex];
                    //request the elements from DOM
                    var nodeList = currEl2.querySelectorAll(currSelector);

                    //scrolls throught the elements and add its to "vector" array
                    for (var c = 0; c < nodeList.length; c++)
                        vector.push(nodeList[c]);
                };
            }
			
			if (disableUpdate)
			{
				return new _SJL(vector);
			}

			if (this.SInstancesBySelector[originalSelector])
			{
				this.SInstancesBySelector[originalSelector].elements = vector;
				return this.SInstancesBySelector[originalSelector];
			}
			else
			{
				//create a new _SJL with the vector of elements
				//ret = new _SJL(vector);
				ret = new _SJL(vector);
				this.SInstancesBySelector[originalSelector] = ret;
			}

            //return the new _SJL object
            return ret;

        };
        this.$ = this.S;

        this._importElementsPoperties();
    };

	_SJL.SInstancesBySelector = {};
    S = function(selector, disableUpdate)
    {
		if (typeof(disableUpdate) == 'undefined')
			disableUpdate = false;
		
        if (typeof (selector) == 'undefined')
            return SJL;


        //create a vector to convert nodeList in to an array
        var vector = [];
		
        
		var originalSelector = selector;
		
        if (selector.constructor !== Array)
            selector = [selector];

        //selector.forEach(currSelector => {
		for (var propIndex in selector)
		{
			var currSelector = selector[propIndex];
            
            
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
		}
        //});
		
		if (disableUpdate)
			return new _SJL(vector);
			
		if (_SJL.SInstancesBySelector[originalSelector])
		{
			_SJL.SInstancesBySelector[originalSelector].elements = vector;
			return _SJL.SInstancesBySelector[originalSelector];
		}
		else{
			//create a new _SJL with the vector of elements
			ret = new _SJL(vector);
			_SJL.SInstancesBySelector[originalSelector] = ret;
		}


        //return the new _SJL object
        return ret;
    };
    /** A pointer to "S" function: Returns a new _SJL instance to work with elements caught by css selector argument "selector" 
     * @param {string} selector - The css selector that will be used to select a list of elements (or unique element) from DOM. These elements are puted in the "elements" property of new _SJL instance
     */
    $ = S;

    //default SJL instance
    SJL = new _SJL();
//})();

SJL.extend(["clearObject", "clear"], function(object, _currStack_size_){
	object = object || this;
	_currStack_size_ = _currStack_size_ || 1;
	
	if (_currStack_size_ >= 3)
		return;
	
	for (var c in object)
	{
		if (object[c] instanceof Object)
			this.clearObject(object[c], (parseInt(_currStack_size_)+1));
		
		if (object[c] instanceof Array)
		{
			while (object[c].length > 0)
				object[c].pop();
			
			object[c].length = 0;
		}
		
		//object[c] = null;
		delete object[c];
		
	}
});

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
SJL.extend("setValue", function (data, autoLoadComponents_default_false) {
	autoLoadComponents_default_false = autoLoadComponents_default_false || false;
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

			if (autoLoadComponents_default_false)
				this.autoLoadComponents(this.elements[c], function(){});
        }
    }

    return this;
});

SJL.extend("getValue", function () {
    var ret = [];
    for (var c in this.elements)
    {
        var curr = this.elements[c];
        if (typeof(curr.value) != 'undefined')
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
_SJL._minAnimationFrameTime = 5;
SJL.extend(["animate", "ani"],  function (from, to, milisseconds, callback, endCallback, _pointers_, _minFrameTime_, __data__) {
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
        pointers: _pointers_,
		minFrameTime: _minFrameTime_ || _SJL._minAnimationFrameTime
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
            __this.animate(null, null, null, null, null, null, null, __data);
        }, __data__.minFrameTime, this, __data__);
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
SJL.extend(["downSpeedAnimate", "downAni"], function (from, to, milisseconds, callback, endCallback, _pointers_, _minFrameTime_) {


    var valMax = to - from;
    var fatorMult = 0;
    var calculatedVal = 0;

    this.animate(0, 20, milisseconds, function (currVal) {
        //var multFactor = (Math.pow(1.171, currVal) - 1) / 100;
        var multFactor = (1 - Math.pow(currVal, -1.5    ) + 0.01);


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
        callback.call(this, calculatedVal, _pointers_);
    }, function(){
        callback.call(this, to, _pointers_);
        if (endCallback)
            endCallback.call(this);
    }, _pointers_, _minFrameTime_);

    return this;
});

/** Function to create animations with speeddown Math function. A callback is executed with current value beetween from and to, in function of time
@param {double} from - The start value
@param {double} to - The end value
@param {int} milisseconds - The time of the animations (in milisseconds)
@param {Function} callback - The callback to be executed with current value
@param {Function} endCallback - The callback to be executed when the animation is done
@param {object} _pointers_ - The optional params to be passed to callback and endCallback
*/
SJL.extend(["upSpeedAnimate", "upAni"], function (from, to, milisseconds, callback, endCallback, _pointers_, _minFrameTime_) {


    var valMax = to - from;
    var fatorMult = 0;
    var calculatedVal = 0;

    this.animate(5, 10, milisseconds, function (currVal) {
        //var multFactor = (Math.pow(1.171, currVal) - 1) / 100;
        var multFactor = (Math.pow(currVal/10, 10));


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
        callback.call(this, calculatedVal, _pointers_);
    }, function(){
        callback.call(this, to, _pointers_);
        if (endCallback)
            endCallback.call(this);
    }, _pointers_, _minFrameTime_);

    return this;
});



SJL.extend("request", function (method, url, data, callback, _context_, _callbackAditionalArgs_, _progressCallback_, _optionalHeaders_, _onBeforeSend_) {
    callback = callback || null;
    var xhttp = new XMLHttpRequest();
    //set headers

    xhttp.open(method, url, true);
    xhttp.method = method.toUpperCase();

    if ((data) && (typeof(data) != "string")){
        data = JSON.stringify(data);
        xhttp.setRequestHeader("Content-Type", "Application/Json");
    }
    
    if (_optionalHeaders_)
    {
        //_optionalHeaders_.forEach(element => {
		for (var prop in _optionalHeaders_)
		{
			var element = _optionalHeaders_[prop];
            xhttp.setRequestHeader(element[0], element[1]);
		}
        //});
    }

    if (typeof(_progressCallback_) != 'undefined')
    {
        xhttp.onprogress = function(evt){
            if ((evt.lengthComputable) && (_progressCallback_))
            {
                _progressCallback_.call(_context_ || this, 100.0 / evt.total * evt.loaded, evt.total, evt.loaded, url, evt, xhttp);
            }
        }
    }
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4){// && this.status == 200) {
            if (callback != null) {
                var resp = this.responseText;
				var contentType = xhttp.getResponseHeader("Content-Type");
                if (contentType && contentType.toLowerCase().indexOf("application/json") > -1)
                    resp = JSON.parse(resp);

                callback.call(_context_ || this, resp, _callbackAditionalArgs_, xhttp, this);
            }
        }
    };

    
    
    if (_onBeforeSend_)
        _onBeforeSend_.call(_context_, xhttp);
        
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

SJL.extend("get", function (url, callback, _context_, _callbackAditionalArgs_, _progressCallback_, _optionalHeaders_, _onBeforeSend_) {
    this.request("GET", url, null, callback, _context_, _callbackAditionalArgs_, _progressCallback_, _optionalHeaders_, _onBeforeSend_);
    return this;
});



SJL.extend("cacheOrGet", function (url, callback, _context_, _callbackAditionalArgs_, _progressCallback_, _optionalHeaders_, _onBeforeSend_) {
    if (SJL.cache.exists(url)){
        var cachedDT = SJL.cache.get(url);
        if (cachedDT == "loading"){
            var intervalWaiter = setInterval(function(_this){
                var cachedDT = SJL.cache.get(url);
                if (cachedDT != "loading"){
                    clearInterval(intervalWaiter);
                    callback.call(_context_ || _this, SJL.cache.get(url), _callbackAditionalArgs_);
                }
            }, 10, this);
        }
        else
            callback.call(_context_ || this, SJL.cache.get(url), _callbackAditionalArgs_);
    }
    else {
        SJL.cache.set(url, "loading", SJL.cache.destinations.RAM);
        this.get(url, function(response, sjl, addArgs, request){
            if ((request.status >= 200) && (request.status < 300)) {    
                SJL.cache.set(url, response);
            }
            callback.call(_context_ || this, response, _callbackAditionalArgs_, request, sjl);
        }, _context_, _callbackAditionalArgs_, _progressCallback_, _optionalHeaders_, _onBeforeSend_);
        
        return this;
    }
});

SJL.extend("post", function (url, data, callback, _context_, _callbackAditionalArgs_, _progressCallback_, _optionalHeaders_, _onBeforeSend_) {
    this.request("POST", url, data, callback, _context_, _callbackAditionalArgs_, _progressCallback_, _optionalHeaders_, _onBeforeSend_);
    return this;
});

SJL.extend("put", function (url, data, callback, _context_, _callbackAditionalArgs_, _progressCallback_, _optionalHeaders_, _onBeforeSend_) {
    this.request("PUT", url, data, callback, _context_, _callbackAditionalArgs_, _progressCallback_, _optionalHeaders_, _onBeforeSend_);
    return this;
});

SJL.extend("delete", function (url, callback, _context_, _callbackAditionalArgs_, _progressCallback_, _optionalHeaders_, _onBeforeSend_) {
    this.request("DELETE", url, null, callback, _context_, _callbackAditionalArgs_, _progressCallback_, _optionalHeaders_, _onBeforeSend_);
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
        if (scriptsSrc[c].toLowerCase().indexOf(".css") == scriptsSrc[c].length-4)
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
        if (scriptsSrc[c].toLowerCase().indexOf(".css") == scriptsSrc[c].length-4)
            type = "text/css";
        
        this.cacheOrGet(scriptsSrc[c], function(response){
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
                //document.documentElement.appendChild(script);
				document.head.appendChild(script);
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
    var allElements = $(element).$("*", true);
    var length = allElements.elements.length;

    if (allElements.elements.length == 0)
    {
        if (onDone)
            onDone.call(this);
    }
    else
    {
        var waitings = 0;
        var _this = this;
        allElements.do(function(currElement){
            var componentName = null;

            //checks if the tag name starts with sjl
                //try extract component name from tagname
                var name = currElement.outerHTML.substr(0, 128).split('>')[0].split(' ')[0].replace(/\-/g, "/");
                
                if (name.toLowerCase().indexOf('sjl') > -1)
                {
                    componentName = name.substr(name.toLowerCase().indexOf('sjl')+4);
                    componentName = componentName.replace(/\./g, "/");
                    componentName = componentName.replace(/\-/g, "/");
                    componentName = componentName.replace(/\:/g, "/");
                globalName = currElement;
                    console.log("Found sjl component tag: "+componentName);
                }

                
                


            if (componentName == null)
                componentName = currElement.getAttribute("SJLLoad");

            if (componentName != null)
            {
                //SJL_CurrAPP
                var active = currElement.getAttribute("SJLActive") ||
                currElement.getAttribute("SJLInstanciate") ||
                currElement.getAttribute("SJLInstance") || "yes";
                
                if ((active != "none") && (active != "") && (active != "false"))
                {
                    //active instance
                    $(currElement, true).loadActiveComponent(componentName, function(newInstance){
                        waitings++;

                        //app and SJL_CurrAPP has are same value
                        newInstance.controlledElement.app = newInstance;
                        newInstance.controlledElement.instance = newInstance;
                        newInstance.controlledElement.appInstance = newInstance;
                        newInstance.controlledElement.classInstance = newInstance;
                        newInstance.controlledElement.activeInstance = newInstance;
                        if (waitings == length)
                        {
                            if (onDone)
                                onDone.call(_this);
                        }
                    });
                }
                else
                {
                    $(currElement, true).loadComponent(componentName, function(){
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
                    if (onDone)
                        onDone.call(_this);
                }
            }
        });
        //onDone.call(_this);
    }
	
	allElements.clearObject();
	delete allElements;
});

SJL.extend(["loadHtmlText", "setHtmlText"], function (htmlText, onLoad, _clearHtml, _context_, _onLoadArguments_, _discardCssAndJs_)
{
    onLoad = onLoad || null;

    if ((typeof(_clearHtml_) == 'undefined') || (_clearHtml_ == true))
    {
        this.setProperty("innerHTML", "");
    }

    var processeds = 0;

    this.do(function(c){
        var nHtml = htmlText;

		try{
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
		} catch(e){console.log("SJL LoadHtmlText(",nHtml,") Exception: ", e);}
			
    

        var scripts = $(temp).$("script").do(function (currEl) {
            if (!_discardCssAndJs_)
			{
				try{
					eval(currEl.innerHTML);
				}
				catch(err){
					console.error(err);
				}
			}
            currEl.parentNode.removeChild(currEl); 
        });

        var css = $(temp).$("style").do(function (currEl) {
            if (!_discardCssAndJs_) {
                document.head.appendChild(currEl);
            }
            else
                currEl.parentNode.removeChild(currEl);
        });
		
		delete scripts;
		delete css;

        nHtml = temp.innerHTML;
        
        //checks if to be clear the html
            
        c.innerHTML += nHtml;

        this.autoLoadComponents(c, function(){
            processeds++;
            if (processeds == this.elements.length)
            {
                if (onLoad != null)
                    onLoad.call(_context_ || this, htmlText, this, _onLoadArguments_);

                if (c.getAttribute("onload") != null)
                {
                    eval(c.getAttribute("onload"));
                }
            }
        });
    });
    //onLoad.call(_context_ || this, htmlText, this, _onLoadArguments_);
    
    
});

SJL.extend(["loadHtml", "setHtml"], function (htmlName, onLoad, _onFailure_, _clearHtml_, _context_, _onLoadArguments_, _progressCallback_) {
    if (!SJL.hasOwnProperty("_loadedComponents"))
        SJL._loadedComponents = [];
    
    this.cacheOrGet(htmlName, function (result, adicionalArgs,  request) {
        if (!request || ((request.status >= 200) && (request.status < 300))) {    
            this.loadHtmlText(result, onLoad, _clearHtml_, _context_, _onLoadArguments_);
        }
        else
        {
            if (_onFailure_)
                _onFailure_.call (_context_ || this, request);
        }
    }, this, null, _progressCallback_);
    

    return this;
});

//the function bellow can be used to create a cache to functions like 'loadApp' and 'loadComponents'
SJL.extend(["preloadHtml", "preload"], function (htmlFileName, onDone, _context_, _progressCallback_) {

    if (htmlFileName.constructor !== Array)
        htmlFileName = [htmlFileName];

    var loading = 0;
    for (var c = 0; c < htmlFileName.length; c++) 
    {
    
        loading++;
        if ((htmlFileName[c].indexOf(".htm") == -1) && htmlFileName[c].indexOf(".js") == -1 && htmlFileName[c].indexOf(".css") == -1)
        {
            htmlFileName[c] += ".html";
        }
        
        //load the html file    
        this.cacheOrGet(htmlFileName[c], function (result, contAtt, xhr) 
        {
            SJL._loadedComponents.push({ htmlName: htmlFileName[contAtt], htmlContent: result, alreadyLoaded: false });
            loading--;

            if ((loading == 0) && (onDone))
            {
                onDone.call(_context_ || this);
            }

        }, this, c, _progressCallback_);
    }

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

    /*If there is any content in the innerHTML of the container element, this content 
    will be sent to an attribute called "content". Below, the "content" property will
    be created (or set if it already exists) in the new object (appInstance) and, if
    it exists, the setContent method of this same object will be executed with this
    innerHTML as a paramete....*/
    //{
        //convert innerHTML to an attribute, to be sented to appInstance
        appSPointer.do(function(curr){ //(curr) => {
            if (curr.innerHTML.trim().length > 0)
            {
                curr.setAttribute("content", curr.innerHTML);
            }
        });
    //}

	this.loadHtml(appName + ".html", function () {
        var appInstance = null;
        appArgumentsArray = appArgumentsArray || null;

        //create a reference to appSPointer in appInstance (create a new SJL, ignoring the use of pool, i.e., creating a permanent instance)
        var fixAppSPointer = $(appSPointer.elements, true);

        //if this method has called with '/' at end of appName, remove them
        if (appName.indexOf("/") > 0) {
            appName = appName.split('/');
            appName = appName[appName.length - 1];
        }

        //create a new instance of component javascript class
        eval('if (typeof(' + appName + ') != "undefined"){ appInstance = new ' + appName +'(fixAppSPointer, appArgumentsArray);}else{console.log("SJL could not locate the class \'"+appName+"\'");}');
        
        //create a pointer to appIntance in the appIntance as SJL_currApp. This will be used at possible next object load to destroy the instance (look at start of this function)
        appSPointer.setProperty("SJL_CurrAPP", appInstance);
		try{
			appInstance.controlledElement = appSPointer.elements[0];
		}
		catch(e){
			console.error(e);
		}
        
        //to facilitate the development, create some more references to the new instance of the component (one of which is with the class name in camelCase)
        //{
            var camelizedAppName = appName[0].toLowerCase() + (appName.length > 1 ? appName.substring(1) : ""); 

            //create references in the container element
		    appSPointer.setProperty(appName, appInstance);
            appSPointer.setProperty(appName + "Instance", appInstance);
		    appSPointer.setProperty(camelizedAppName, appInstance);
			
			
			//create pointer too in a property called javascript
			//{
				var jsApps = appSPointer.getProperty("javascript");
				if (!jsApps)
				{
					jsApps = {};
				}
			
				eval ("jsApps."+appName+" = appName");
				eval ("jsApps."+appName + "Instance = appName");
				eval ("jsApps."+camelizedAppName+" = appName");
			
				appSPointer.setProperty('javascript', jsApps);
			//}
		
            //Now, it creates some references to the new instance of the component in child elements. This will allow events (such as onclick, onouseover, 
            //ontouchstart, ...) to be easily accessed by HTML (eg: <div onclick = "componentCamelCaseName.Method)
            appSPointer.$("*").do(function(currEl){ //currEl) => {
                eval ("currEl."+appName+"=appInstance");
                eval ("currEl."+appName+"Instance=appInstance");
				
				//add a reference in the "javascript" property"
				eval ("if (!currEl.javascript){ currEl.javascript ={}}; currEl.javascript."+appName+"=appInstance");
				
                //create a camelized name
                eval ("currEl."+camelizedAppName+"=appInstance");
				
            
                if (!currEl.app){
                    //don't set appInstance property, because it is used by SJL to destroy activities. If you use appInstance here and try to load a component inside the elements of appSPointer, the curren appInstance will be destroyed (the desctructor function will be called);
                    currEl.ctrl = appInstance;
                    currEl.app = appInstance;
                }
				
            });
        //}
        
        //Just as references to the new object were created in the HTML elements, references to the container element in the new object are created below.
        //{
            if (appInstance && !appInstance.rootS){
    			appInstance.sRoot = fixAppSPointer;
                appInstance.rootS = fixAppSPointer;
                appInstance.html = fixAppSPointer;
                appInstance.body = fixAppSPointer;
                appInstance.containerSElement = fixAppSPointer;
                eval("appInstance." + camelizedAppName +"=fixAppSPointer")

            }
        //}

        //Now, to help further the development, in the container element (only in the container element) are created methods with the same 
        //names of the methods of the new object. This way it is easy to call methods of the new object, just take the container element 
        //and call the methodo with the same name. These methods will redirect execution into the new object.
        //{
            //get methods defineds in the contructor
			if (appInstance){
				var appInstanceMethods = Object.getOwnPropertyNames(appInstance).filter(function (p) {
					return typeof appInstance[p] === 'function';
				});

				//get methods  defineds with  prototype
				var filtred = Object.getOwnPropertyNames(Object.getPrototypeOf(appInstance)).filter(function (p) {
					return typeof appInstance[p] === 'function';
				});
				for (var currProp in filtred)
				{
					var curr = filtred[currProp];
					appInstanceMethods.push(curr);
				};

			

				fixAppSPointer.appInstance = appInstance;
				for (var currProp in appInstanceMethods)
				{
					var currMethod = appInstanceMethods[currProp];
					
					eval ('appSPointer.setProperty("'+currMethod+'", function(){'+
						'this.' + camelizedAppName + '.' + currMethod + '.call(this.' + camelizedAppName+', arguments);'+
					'})');
				}

				appSPointer.setProperty("appInstanceMethods", appInstanceMethods);
			}
        //}


        
        //It now takes all the attributes of the container element and creates properties with the same names and values in the new object 
        //(appIntance). Also check if there is a set method on the object, if it exists, call it with, sending the value by parameter
        //{
            

            SJL.__AttributeChanged = function(element, attribute, newValue){
                var appInstancesMethods = element.appInstanceMethods;
                var destinationInstance = element.SJL_CurrAPP;
                eval("destinationInstance."+attribute +" = newValue");

                var setName = "set" + attribute[0].toUpperCase() + (attribute.length > 1 ? attribute.substring(1) : "");
				for (var currProp in appInstancesMethods)
				{
					var currMethod = appInstancesMethods[currProp];
                    if (currMethod.toLowerCase() == setName.toLowerCase())
                        destinationInstance[currMethod].call(destinationInstance, newValue, element);
                };
            }


            //hooks setAttribute method of elements
            appSPointer.do(function(curr){
                
                if (!curr.__setAttribute)
                {
                    curr.__setAttribute = curr.setAttribute;
                    
                    
                    curr.setAttribute = function(name, value){
                        this.__setAttribute(name, value);
                        /*  When an  activitiy is loaded (see the beginning of this method), the searches 
                        looks the root element for any html content. If something is found, SJL move that
                        content  to an attribute called "content". This attribute is sent to class of the
                        new activity in a for loop that is implemented bellow (out of current if). 
                        
                            But  there  is  one  thing  that  should  be  considered  here  (before  call
                        __AttributeChanged). __AttributeChanged uses the property 'SJL_CurrAPP', which is
                        a  reference  to class instance of new activity. When this 'content' attribute is
                        created  in  the root element (with its HTML content), the 'SJL_CurrAPP' property
                        (also   of   root   element)   is   not  yet  exists,  raising  an  exception  in
                        __AttributeChanged   event.  Therefore,  it  is  necessary  to  verify  that  the
                        'SJL_CurrAPP'  property  already  exists in the 'curr' element before calling SJL
                        method '__AttributeChanged'.*/
                        try{
                            if (this.SJL_CurrAPP)
                                SJL.__AttributeChanged(this, name, value);
                        }catch{
                            console.log("erro ao setar o attributo ", name, " como valor ", value, "do elemento", this);
                        }
                    };
                }

                var attributes = curr.attributes;
                for (var cAttribute = 0; cAttribute < attributes.length; cAttribute++)
                {
                    var currAttribute = attributes[cAttribute];
                    SJL.__AttributeChanged.call(window, curr, currAttribute.name, currAttribute.value);
                }
            });
        //}

        


        //try call new instance initilizers
        //{
            /*if (typeof (appInstance.constructor) != 'undefined')
                appInstance.constructor();*/
            if (typeof (appInstance.init) != 'undefined')
                appInstance.init(appArgumentsArray);
            if (typeof (appInstance.initialize) != 'undefined')
                appInstance.initialize(appArgumentsArray);
            if (typeof (appInstance.start) != 'undefined')
                appInstance.start(appArgumentsArray);
            if (typeof (appInstance.create) != 'undefined')
                appInstance.create(appArgumentsArray);
        //}
		delete fixAppSPointer;


		onLoad = onLoad || null;
        if (onLoad != null)
		    onLoad.call(_context_ || appSPointer, appInstance, appSPointer, _onLoadArguments_);
	}, _onFailure_, _clearHtml_, _context_, _onLoadArguments_, _progressCallback_);

    return this;
});

/* call atributes like "onDoSomething" */
//callEvent("onChange", {var:value, var2:value})
SJL.extend(["callEvent", "callEventAttribute"], function(attributeName, keysValuesObject){ 
    
    //separe properties names in a csv (to be informed in function with eval) and their values in a vector
    var argsNames = "";
    var values = [];
    for (var name in keysValuesObject)
    {
        argsNames = argsNames + name + ","
        values.push(keysValuesObject[name])
    }

    //remove the las ',' from argsNames csv
    if (argsNames.length > 0 && argsNames[argsNames.length-1] == ',')
        argsNames = argsNames.substr(0, argsNames.length-1);

    //find the attribute name in all elements cotnroled by current SJL instance
    this.do(function(currEl){
        for (var cA in currEl.attributes){
            var currAttrib = currEl.attributes[cA];
            
            if (currAttrib.name && currAttrib.name.toLowerCase() == attributeName.toLowerCase())
            {
                if (typeof(currAttrib.value) == "function")
                    currAttrib.value.apply(currEl, values);
                else
                    //func a function with arguments names as properties names of 'keysValuesObject' object and 
                    //and arguments values as 'values' vector
                    eval(
                        '(function('+argsNames+'){'+
                            'try{'+
                                'eval(currAttrib.value);'+
                            '}'+
                            'catch(e){console.error("Error caught in SJL.callEvent: ", e)}'+
                        '}).apply(currEl, values);'
                    );
            }
        }
    });
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
            args = args.replace(/\//g, ',');
            args = args.split(',');
            temp = temp.substr(0, temp.indexOf('/'));
        }

        if (typeof(_prefixOrFolder_) != 'undefined' )
        {
            if (_prefixOrFolder_.lastIndexOf('.') == _prefixOrFolder_.length-1)
                temp = _prefixOrFolder_ + temp;
            else
                temp = _prefixOrFolder_ +'.' + temp;
        }

        //uses '.' to allow organization of activities inside folders
        temp = temp.replace(/\./g, "/");
        //let stateObject = { foo: "bar" };
        //history.pushState(stateObject, "page 2", "newpage.html");
        

        this.loadApp(temp, onLoad, args, function(request){onNotLoad(request);}, _clearHtml_, _context_, _onLoadArguments_, _progressCallback_);
    }
    else {
        onNotLoad(_onLoadArguments_);
    }
});


//the flag bellow can be used to pause url monitor and change the url without SJL change activity
_SJL.pauseAutoLoadAppFromUrl = false;
//monitores the url, autoloading apps
/** When this method is called, the SJL will start to monitor changes in the location.href
 *  and will, automatically, load activities when the url is changed. 
 * @param {function} onNotLoad - A function to be called when SJL encounters an error to load an activity 
 * @param {function} onLoad - A function to be called when SJL loads an activity with sucessfull
 * @param {boolean} _forceFirst_ - Indicates if the SJL must parse the current URL. This argument is optional 
 *                               - and its defautl value is 'true'. If you pass 'false' to this, the SJL just will load first activity when the 
 *                               - url is changed by first time.
 * @param {boolean} _prefixOrFolder_ - Uses a prefix folder for load activities. It can be used to best organize 
 *                                   - application and prevent poluition of the url. Example: If you specify 
 *                                   - 'MyApp/MyActivities' for this parameter and try to open url 
 *                                   - 'myAppUrl.com/#Main', the SJL will try to locate the activity 'main' 
 *                                   - inside a folder named 'MyActivities', which is inside of another folder 
 *                                   - named ''MyApp'.
 * */
SJL.extend(["autoLoadAppFromUrl", "autoLoadActivityFromUrl"], function (onNotLoad, onLoad, _default_, _prefixOrFolder_, _progressCallback_) {
    var __this = this;

    /*window.onbeforeunload = function(){
        preventDefault();
    }*/


    window.addEventListener("hashchange", function (event) {
        //event.preventDefault();
        if (!_SJL.pauseAutoLoadAppFromUrl)
            __this.loadActivityFromUrl(onNotLoad, onLoad, _prefixOrFolder_, _progressCallback_);
    });



    _default_ == _default_ || null;
    if (_default_ != null)
    {
        if (window.location.href.indexOf('#') == -1)
            window.location.href += "#"+_default_;
        else
            __this.loadActivityFromUrl(onNotLoad, onLoad, _prefixOrFolder_, _progressCallback_);
    }
    else if (window.location.href.indexOf('#') > -1)
            __this.loadActivityFromUrl(onNotLoad, onLoad, _prefixOrFolder_, _progressCallback_);

});

SJL.extend(["changeUrlHash", "changeUrl"], function (url, allow_activity_autoload_default_true) {
    if (typeof(allow_activity_autoload_default_true) == 'undefined')
        allow_activity_autoload_default_true = true;

    if (allow_activity_autoload_default_true != true)
    {
        var currPauseState = _SJL.pauseAutoLoadAppFromUrl;
        console.log("currPauseState", currPauseState);
        _SJL.pauseAutoLoadAppFromUrl = true;
    }
    location.hash = url;
    
    if (allow_activity_autoload_default_true != true)
    {
        setTimeout(function(){
            _SJL.pauseAutoLoadAppFromUrl = currPauseState;
        }, 10);
    }
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

/** Set a property in the elements
 * @param {string} name - the name of property
 * @param {any} value - the property value
 */
SJL.extend("setProperty", function (name, value, _try_set_attribute_) {
    _try_set_attribute_ = _try_set_attribute_ || "defValue";
    if (_try_set_attribute_ == "defValue")
        _try_set_attribute_ = true;

    for (var c in this.elements)
    {
        if (_try_set_attribute_ == true)
        {
            if (this.elements[c].getAttribute(name) != null)
            {
                this.elements[c].setAttribute(name, value);
            }
        }
            
        eval("this.elements[c]." + name + " = value;");
    }

    return this;
});

SJL.extend("setAttribute", function (name, value, _try_set_property_) {
    _try_set_property_ = _try_set_property_ || "defValue";
    if (_try_set_property_ == "defValue")
    _try_set_property_ = true;

    for (var c in this.elements)
    {
        if (_try_set_property_ == true)
        if (this.elements[c].hasOwnProperty(name))
            eval("this.elements[c]."+name+" = value;");
            
        this.elements[c].setAttribute(name, value);
    }

    return this;
});

/** Get a property from the elements
 * @param {string} name - the property name
 * @param {any} _defaultValue_ - A value that will be return if the system not locate the property in anyone element
 * @returns {any} - If SJL is working with one element, this methos returns a value of property or _defaultValue_. If 
 * the SJL instance is working with a list of elements, the return will be an array with values of 'name' 
 * (only for elements that contais the property specified by 'name'). If the SJL is working with a list of elements and
 * anyone element contains the property specified by 'name', this methos will return _defaultValue_
 */
SJL.extend("getProperty", function (name, _defaultValue_) {
    _defaultValue_ = _defaultValue_ || null;
    var ret = [];
    for (var c in this.elements) {
        eval("if ("+
            "this.elements[c]."+name+"){"+
                "ret.push(this.elements[c]." + name + ");"+
            "} "+
            "else if (this.elements[c].attributes['"+name+"']){"+
                "ret.push(this.elements[c].getAttribute('"+name+"'));"+
            "}"
        );
    }

    if (ret.length == 1)
        return ret[0];
    else if (ret.length > 1)
        return ret;
    else
        return _defaultValue_;
});


SJL.extend("setCssProperty", function (property, value) {
    for (var c in this.elements)
        this.elements[c].style.setProperty(property, value);

    return this;
});

SJL.extend("getCssProperty", function (property, _defaultValue_) {
    var ret = [];
    for (var c in this.elements) {
        var value = this.elements[c].style.getPropertyValue(property);

        ret.push(value);
    }

    if ((ret.length == 1) && (ret[0] != ""))
        return ret[0];
    else if (ret.length > 1)
        return ret;
    else
        return _defaultValue_;
});

/** Remove elements from their parent */
SJL.extend(["remove", "exclude"], function () {
    for (var c in this.elements) {
        this.elements[c].parentNode.removeChild(this.elements[c]);
        delete this.elements[c];
    }

    return this;

});

/** Get a css property from elements
 * @param {string} propertyName - the css property name
 * @param {any} _defaultValue - The value to be return when the property was not found in anyone element. This 
 * parameter is optional, and its default value is null.
 * @returns {any} - return the css value or a list of css values (if SJL instance is working with more than 
 * one element). If the property was not found, the SJL will return _defaultValue_.
 */
SJL.extend("getComputedCssProperty", function(propertyName, _defaultValue_){
    _defaultValue_ = _defaultValue_ || null;
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
    else if (result.length > 1)
        return result;
    else 
        return _defaultValue_;
});


SJL.cache = new (function(){
    this.destinations={
        RAM: "USERAM",
        LOCALSTORAGE: "USELOCALSTORAGE",
        DEFAULT: "DEFAULT"
    };

    this.defaultDestination = this.destinations.RAM;
    this.ramCache = {};

    this.set= function(key, data, _destination_){
        _destination_ = _destination_ || this.defaultDestination;

        if (_destination_ == this.destinations.LOCALSTORAGE)
        {
            localStorage.setItem("SJLCache__"+this.getValidKey(key), data);
            delete this.ramCache[this.getValidKey(key)];
        }
        else
        {
            this.ramCache[this.getValidKey(key)] = data;
            localStorage.removeItem("SJLCache__"+this.getValidKey(key));
        }
    };

    this.get = function(key){

        if (this.ramCache[this.getValidKey(key)])
            return this.ramCache[this.getValidKey(key)];
        else if (localStorage.hasOwnProperty("SJLCache__"+this.getValidKey(key)))
            return localStorage.getItem("SJLCache__"+this.getValidKey(key));
        else
            return null;

    };

    this.exists = function(key){
        return  typeof(this.ramCache[this.getValidKey(key)]) != 'undefined' ||
                localStorage.hasOwnProperty("SJLCache__"+this.getValidKey(key))
    };

    this.del = function(key){

        localStorage.removeItem("SJLCache__"+this.getValidKey(key));
        delete this.ramCache[this.getValidKey(key)];
    };
    
    this.clear = function(){
        for (var p in localStorage){
            if (p.startsWith("SJLCache__"))
                delete localStorage[p];
        }

        this.ramCache = {};
    };


    this.getValidKey = function(key){
        var ret = "";
        for (var c = 0; c < key.length; c++){
            if ("abcdefghijklmnopqrsuvxywz1234567890ABCDEFGHIJKLMNOPQRSTUVXYWZ".indexOf(key[c]) > -1)
                ret += key[c];
        }

        return ret;
    };
});

/** This class can be used to monitor some varible or data.
 * @param {object} varName_Or_GetValueFunc - A string with a path to variable or property or a function that return some value
 * @param {Function} func - A function to be called when the varname_Or_GetValueFunc value or return value is changed
 * @param {object} _context_ - A context to execute 'func' and 'varName_Or_GetValueFun' (when a function is passed to this argument). This parameter is optional and default value is null (system will use 'window' object as context)
 * @param {boolean} _logErrors_ - If true, errors during functions executions will be logged in the console. This parameter is optional and default value is "true"
 */
_SJL._watchInterval = 50;
SJL.Watch = function(varName_Or_GetValueFunc, func, _context_, _arguments_, _logErrors_, _stopOnError_){
    
    //check if the watches system was alrady started. If not, star this
    if (!SJL._watches)
    {
        //creates the vector to contains the observations data
        SJL._watches = [];

        //create a interval to monitor the variables and call functions
        setInterval(function(){ //() =>{
            currIndex = -1;
			for (var currI in SJL._watches) {
				var element = SJL._watches[currI];
                currIndex++;
                try{

                    if (element != null)
                    {
                        var exists = false;
                        var currVal = null; 

                        //checks if current variable still exists
                        if (typeof(element.variableOrFunc) == 'function')
                            exists = true;
                        else
                            eval("exists = typeof("+element.variableOrFunc+") != 'undefined'");

                        if (exists){
                            //get the current value of the variable or return of function
                            if (typeof(element.variableOrFunc) == 'function')
                                currVal = element.variableOrFunc.call(element.context, element._arguments_);
                            else
                                eval ("currVal = "+element.variableOrFunc);

                            //checks if the value was changed
                            if (currVal != element.lastValue){
                                //call de observation function
                                element.func.call(element.context, currVal, element.lastValue, element._arguments_);

                                //update the lastValue (to look for new changes)
                                element.lastValue = currVal;
                            };
                            element.lastValue = currVal;
                        }
                    }
                }catch(error){
                    try{
                        if (element.stopOnError)
                            SJL._watches[currIndex] = null;

                        if (element.logErrors)
                            console.error("Error caught in SJLWatch. Watch params: ", element, ". Error: ", error);
                    }catch(SJLError){
                        SJL._watches[currIndex] = null;
                        console.error("SJL Watch internal error: ", SJLError);
                    }
                }
            };
        }, _SJL._watchInterval);
    }

    this.indexes = [];


    this.watch = function (varName_Or_GetValueFunc, func, _context_, _arguments_, _logErrors_, _stopOnError_){
        if(typeof(_stopOnError_) == 'undefined')
            _stopOnError_ = true;
        _logErrors_ = typeof(_logErrors_) == 'undefined'? true : _logErrors_;

        this.indexes.push(SJL._watches.length);
        SJL._watches.push({ variableOrFunc: varName_Or_GetValueFunc, func: func, logErrors: _logErrors_, stopOnError: _stopOnError_, lastValue: "---invalid---value---sjl---interval---value", context: _context_ || window, _arguments_: _arguments_ || null});
    };

    this.stop = function(){
		for (var currI in this.indexes) {
			var element = this.indexes[currI];
            SJL._watches[element] = null;
        };
    };

    if ((varName_Or_GetValueFunc) && (func))
        this.watch(varName_Or_GetValueFunc, func, _context_, _arguments_, _logErrors_, _stopOnError_);
};


SJL.SJLStartConf = {
    usePermanentCache: false,
    autoLoadComponents: true,
	watchInterval:_SJL._watchInterval,
	minAnimationFrameTime:_SJL._minAnimationFrameTime,
	urlMonitor:{
		active: false,
		activitiesLocation:null,
		activityNotFoundCallback: function(){},
		activityFoundCallback: function(){},
		element: "body"
	}
};

SJL.start = function(_conf_){
    _conf_ = _conf_ || SJL.SJLStartConf;

    if (typeof(_conf_.autoLoadComponents) == 'undefined' || _conf_.autoLoadComponents == true)
        SJL.autoLoadComponents(document.body);
        SJL.autoLoadComponents(document.body);

    
    if (_conf_.usePermanentCache || false)
        SJL.cache.defaultDestination = SJL.cache.destinations.LOCALSTORAGE;
	
	if (_conf_.watchInterval)
		_SJL._watchInterval = _conf_.watchInterval
	
	if (_conf_.minAnimationFrameTime)
		_SJL._minAnimationFrameTime = _conf_.minAnimationFrameTime;
	
	if ((_conf_.urlMonitor || false) && (_conf_.urlMonitor.active || false)){
		$(_conf_.urlMonitor.element, true).autoLoadActivityFromUrl(
			_conf_.urlMonitor.activityNotFoundCallback,
			_conf_.urlMonitor.activityFoundCallback,
			true, 
			_conf_.urlMonitor.activitiesLocation
		);
	};
};
