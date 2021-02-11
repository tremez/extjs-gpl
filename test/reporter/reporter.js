/**
 * We use Test namespace for all Reporter code to avoid contaminating either
 * Jazzman or Ext.
 */

var Test = Test || {};

/* eslint-disable vars-on-top */
(function() {
'use strict';

/**
 * Maximum levels of nesting that will be included when an object is pretty-printed
 */
Test.MAX_PRETTY_PRINT_DEPTH = 40;

/**
 * Maximum number of test specs to run individually via URL parameters.
 * This number depends on the browser and server URL length limitations.
 */
Test.MAX_INDIVIDUAL_SPECS = 180;

/**
 * Status update interval in ms. By default the interval is 0, and status is updated
 * immediately whenever a new spec is started. However updating the status is quite taxing
 * on time in slower browsers, and is almost completely useless in CI environment
 * so it's better to set this to something reasonable for unattended test runs.
 */
Test.STATUS_UPDATE_INTERVAL = 100;

(function() {
    var objectPrototype = Object.prototype,
        toString = objectPrototype.toString,
        enumerables = ['valueOf', 'toLocaleString', 'toString', 'constructor'],
        enumerable; // eslint-disable-line no-unused-vars
    
    for (enumerable in { toString: 1 }) {
        enumerables = null;
    }
    
    Test.apply = function(object, config, defaults) {
        var i, j, k;

        if (defaults) {
            Test.apply(object, defaults);
        }

        if (object && config && typeof config === 'object') {
            for (i in config) {
                object[i] = config[i];
            }

            if (enumerables) {
                for (j = enumerables.length; j--;) {
                    k = enumerables[j];
                    
                    if (config.hasOwnProperty(k)) {
                        object[k] = config[k];
                    }
                }
            }
        }

        return object;
    };
    
    Test.apply(Test, {
        array: {},
        browser: {},
        
        util: {
            isArray: function(value) {
                return toString.apply(value) === '[object Array]';
            },
            
            isObjectEmpty: function(object) {
                var key;
                
                for (key in object) {
                    if (object.hasOwnProperty(key)) {
                        return false;
                    }
                }
                
                return true;
            },
            
            cloneObject: function(object) {
                var result = {},
                    key;
                
                if (object) {
                    for (key in object) {
                        if (object.hasOwnProperty(key)) {
                            result[key] = object[key];
                        }
                    }
                }
                
                return result;
            },
            
            htmlEscape: function(str) {
                if (!str) {
                    return str;
                }
                
                // Avoid mangling &smth; HTML entities by matching only ampersand
                // characters _not_ followed by either one or more word chars or
                // # and one or more digits, finished by semicolon
                return str.replace(/&(?!(?:#\d+|\w+);)/g, '&amp;')
                          .replace(/</g, '&lt;')
                          .replace(/>/g, '&gt;');
            }
        }
    });
})();

Test.getCookie = function(name) {
    var parts = document.cookie.split('; '),
        len = parts.length,
        item, i, ret;

    // In modern browsers, a cookie with an empty string will be stored:
    // MyName=
    // In older versions of IE, it will be stored as:
    // MyName
    // So here we iterate over all the parts in an attempt to match the key.
    for (i = 0; i < len; ++i) {
        item = parts[i].split('=');

        if (item[0] === name) {
            ret = item[1];
            
            return ret ? unescape(ret) : '';
        }
    }

    return null;
};

Test.removeCookie = function(name, path) {
    if (Test.getCookie(name)) {
        path = path || '/';
        document.cookie = name + '=' + '; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=' + path;
    }
};

Test.setCookie = function(name, value) {
    var argv = arguments,
        argc = arguments.length,
        expires = (argc > 2) ? argv[2] : null,
        path = (argc > 3) ? argv[3] : '/',
        domain = (argc > 4) ? argv[4] : null,
        secure = (argc > 5) ? argv[5] : false;

    document.cookie = name + "=" +
        escape(value) +
        ((expires === null) ? "" : ("; expires=" + expires.toUTCString())) +
        ((path === null) ? "" : ("; path=" + path)) +
        ((domain === null) ? "" : ("; domain=" + domain)) +
        ((secure === true) ? "; secure" : "");
};

if (!Function.prototype.bind) {
    Function.prototype.bind = (function() {
        var slice = Array.prototype.slice,
            emptyArgs = [];
        
        emptyArgs.isEmpty = true;
        
        return function(me) {
            var method = this,
                args = arguments.length > 1 ? slice.call(arguments, 1) : emptyArgs;
            
            if (args.isEmpty) {
                return function() {
                    return method.apply(me, arguments);
                };
            }
            else {
                return function() {
                    return method.apply(
                        me, arguments.length ? args.concat(slice.call(arguments)) : args
                    );
                };
            }
        };
    })();
}

/**
 * Basic browsers detection.
 */
Test.browser = (function() {
    var ua = navigator.userAgent,
        isIE = !!window.ActiveXObject || /Trident/.test(ua),
        isIE6 = isIE && !window.XMLHttpRequest,
        isIE7 = isIE && !!window.XMLHttpRequest && !document.documentMode,
        isIE8 = isIE && (!!window.XMLHttpRequest && !!document.documentMode && !window.performance) || /MSIE 8/.test(ua),
        isIE9 = isIE && !!window.performance && !/MSIE 8/.test(ua),
        isIE10 = isIE && /MSIE 10/.test(ua),
        isIE11 = isIE && /rv:11/.test(ua),
        isOpera = !!window.opera,
        isOpera11 = isOpera && parseInt(window.opera.version(), 10) > 10,
        isSafari = /safari/.test(ua.toLowerCase()),
        isEdge = /Edge\//.test(ua),
        isIOS = /AppleWebKit.+Mobile/.test(ua),
        isAndroid = /Android/.test(ua),
        isGecko = /Gecko\//.test(ua);

    return {
        isIE: isIE,
        isIE6: isIE6,
        isIE6m: isIE6,
        isIE6p: isIE6 || isIE6 || isIE8 || isIE9 || isIE10 || isIE11,
        isIE7: isIE7,
        isIE7m: isIE6 || isIE7,
        isIE7p: isIE7 || isIE8 || isIE9 || isIE10 || isIE11,
        isIE8: isIE8,
        isIE8m: isIE8 || isIE7 || isIE6,
        isIE8p: isIE8 || isIE9 || isIE10 || isIE11,
        isIE9: isIE9,
        isIE9m: isIE9 || isIE8 || isIE7 || isIE6,
        isIE9p: isIE9 || isIE10 || isIE11,
        isIE10: isIE10,
        isIE10m: isIE10 || isIE9 || isIE8 || isIE7 || isIE6,
        isIE10p: isIE10 || isIE11,
        isIE11: isIE11,
        isIE11m: isIE11 || isIE10 || isIE9 || isIE8 || isIE7 || isIE6,
        isIE11p: isIE11,
        isEdge: isEdge,
        isOpera: isOpera,
        isOpera11: isOpera11,
        isSafari: isSafari,
        isIOS: isIOS,
        isAndroid: isAndroid,
        isGecko: isGecko,
        isSlow: isIE6 || isIE7 || isIE8 || isIE9 || isIOS || isAndroid
    };
})();


/**
 * Checks whether or not the specified item exists in the array.
 * Array.prototype.indexOf is missing in Internet Explorer, unfortunately.
 * We always have to use this static method instead for consistency
 * @param {Array} array The array to check
 * @param {Mixed} item The item to look for
 * @param {Number} from (Optional) The index at which to begin the search
 * @return {Number} The index of item in the array (or -1 if it is not found)
 */
Test.array.indexOf = function(array, item, from) {
    var i, length;
    
    if (array.indexOf) {
        return array.indexOf(item, from);
    }
    
    length = array.length;
    
    for (i = (from < 0) ? Math.max(0, length + from) : from || 0; i < length; i++) {
        if (array[i] === item) {
            return i;
        }
    }
    
    return -1;
};

/**
 * Removes the specified item from the array. If the item is not found nothing happens.
 * @param {Array} array The array
 * @param {Mixed} item The item to remove
 * @return {Array} The passed array itself
 */
Test.array.remove = function(array, item) {
    var index = Test.array.indexOf(array, item);
    
    if (index !== -1) {
        array.splice(index, 1);
    }
    
    return array;
};

// Jazzman intercepts Ajax calls
var _XMLHttpRequestSend = XMLHttpRequest.prototype.send;

var Remote = Test.Remote = {
    enabled: false,
    
    setOptions: function(json) {
        var options, prop;
        
        try {
            options = JSON.parse(json);
            
            for (prop in options) {
                if (options.hasOwnProperty(prop)) {
                    Remote[prop] = options[prop];
                }
            }
            
            if (!Remote.commandURL) {
                throw new Error("Remote command URL is required!");
            }
            
            if (!Remote.resultURL) {
                throw new Error("Remote result URL is required!");
            }
        }
        catch (e) {
            throw new Error("Cannot set remote reporter options: " + e.message);
        }
    },

    queueMessage: function(message, callback, notify) {
        Remote._messageQueue[Remote._queueSize++] = message;
        
        if (notify === 'flush') {
            Remote._flushQueue(callback);
        }
        else if (notify === 'notify') {
            Remote._notifyWebDriver(callback);
        }
        else if (callback) {
            Remote.runCallback(callback);
        }
    },
    
    sendMessage: function(message, callback) {
        if (!message.type) {
            message.type = 'message';
        }
        
        if (message.type === 'message' && !message.status) {
            message.status = 'NORMAL';
        }
        
        Remote._setStatus("Sending message of type '" + message.type + "' to server...");
        
        Remote._doSend(Remote.resultURL, message, function(success, error) {
            if (success) {
                Remote._setStatus("Successfully sent message.", true);
            }
            else {
                Remote._setStatus("Error sending message to server: " + error);
            }
            
            Remote.runCallback(callback, true);
        });
    },

    sendCommand: function(command, callback) {
        var type = command.type;
        
        Remote._setStatus("Sending driver command '" + type + "'...");
        
        Remote._doSend(Remote.commandURL, command, function(success, error) {
            if (success) {
                Remote._setStatus("Driver command '" + type + "' executed successfully.", true);
            }
            else {
                Remote._setStatus("Error executing driver command '" + type + "': " + error);
            }
            
            Remote.runCallback(callback, true);
        });
    },
    
    // This API is a bit awkward but the callback logic is the same regardless of whether
    // remote reporting is enabled or not, and we need to keep counters somewhere
    // to avoid duplicating code.
    // The reason we need to keep count of results is simple: asynchronous reporting
    // has a side effect of significantly increased call stack depth, and some slow
    // and memory limited platforms like IE8-, iOS/Safari, and Android are experiencing
    // problems because of that; e.g. in IE8 simple DOM operations like setting innerHTML
    // on freshly created element start to fail with "Unspecified error" exceptions.
    // I strongly suspect that the same reason might be behind "Unspecified errors" when
    // focusing elements in IE as well.
    // These problems are easily avoided by unwinding call stack, which is what we're doing
    // here at the cost of slightly increased test run time.
    runCallback: function(callback, forceTimeout) {
        if (!callback) {
            return;
        }
        
        if (forceTimeout || ++Remote._resultsReported > Remote.resultsReportedTheshold) {
            Remote._resultsReported = 0;
            
            // Note that both setTimeout and setImmediate are safe to use here.
            // Jazzman intercepts these functions in the sandbox iframe only.
            if (window.setImmediate) {
                setImmediate(callback);
            }
            else {
                setTimeout(callback, 0);
            }
        }
        else {
            callback();
        }
    },
    
    driver: {
        getWindowHandle: function(callback) {
            Remote.sendCommand({
                type: 'getWindowHandle'
            }, callback);
        },

        getWindowHandles: function(callback) {
            Remote.sendCommand({
                type: 'getWindowHandles'
            }, callback);
        },
        
        switchTo: function(options, callback) {
            options.type = 'switchTo';
            Remote.sendCommand(options, callback);
        },

        close: function(callback) {
            Remote.sendCommand({
                type: 'close'
            }, callback);
        },

        screenshot: function(name, callback) {
            Remote.sendCommand({
                type: 'screenshot',
                name: name
            }, callback);
        },

        click: function(domElement, callback) {
            Remote.sendCommand({
                type: 'click',
                elementId: domElement.id
            }, callback);
        },
        
        sendKeys: function(domElement, keys, callback) {
            Remote.sendCommand({
                type: 'sendKeys',
                elementId: domElement.id,
                keys: keys
            }, callback);
        }
    },

    // ----------------------------------------------------------------------------
    // Private API
    
    // Reduce GC churn by pre-sizing the queue
    _messageQueue: new Array(10000),
    _lastSendTime: 0,
    _queueSize: 0,
    _resultsReported: 0,
    commandURL: null,
    resultURL: null,
    queueSizeThreshold: 1000,
    queueTimeThreshold: 30000, // 30 seconds
    ajaxTimeout: 120000, // 2 minutes
    ajaxRetries: 3,
    flushTopSuites: false,
    statusClearTimeout: 2000, // So it is visible in session video/screenshots
    resultsReportedTheshold: Test.browser.isSlow ? 10 : 100,
    
    _statusClearTimer: null,
    
    _setStatus: function(statusText, clear) {
        Test.SandBox.setRemoteStatus(statusText);
        
        if (Remote._statusClearTimer) {
            clearTimeout(Remote._statusClearTimer);
            Remote._statusClearTimer = null;
        }
        
        if (clear) {
            Remote._statusClearTimer = setTimeout(function() {
                Test.SandBox.setRemoteStatus('');
                Remote._statusClearTimer = null;
            }, Remote.statusClearTimeout);
        }
    },
    
    _ajax: function(options, callback, scope) {
        var url = options.url,
            data = options.data || null,
            method, xhr;
        
        if (!url) {
            throw new Error("Ajax URL is required!");
        }
        
        if (typeof callback !== "function") {
            throw new Error("Ajax callback argument expected!");
        }
        
        if (typeof data === "function") {
            data = data();
        }
        
        if (options.retries == null) {
            options.retries = 0;
        }
        
        method = options.method || (data ? 'POST' : 'GET');
    
        xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        
        if (data && typeof data !== 'string') {
            try {
                data = JSON.stringify(data);
                
                xhr.setRequestHeader('Content-Type', 'application/json');
            }
            catch (e) {
                callback.call(scope || this, false, options, e);
                
                return e;
            }
        }
        
        xhr.timeout = Remote._ajaxTimeout;
        
        xhr.ontimeout = function() {
            xhr.ontimeout = xhr.onreadystatechange = null;
            callback.call(scope || this, false, options, 'timeout');
        };
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                xhr.ontimeout = xhr.onreadystatechange = null;
                
                if (xhr.status === 200 || xhr.status === 0) {
                    callback.call(scope || this, true, options, xhr);
                }
                else {
                    callback.call(scope || this, false, options, xhr);
                }
            }
        };
        
        _XMLHttpRequestSend.call(xhr, data);
    
        return xhr;
    },
    
    _doSend: function(url, messages, _next) {
        var jazzman, options, callback;
        
        callback = function(success, options, xhr) {
            var spec;
            
            if (success) {
                if (_next) {
                    if (jazzman) {
                        jazzman.startQueueWatchdog();
                    }
                    
                    _next(true);
                }
            }
            else {
                spec = Test.SandBox.getJazzman().env.currentSpec;
                
                if (xhr === 'timeout') {
                    if (++options.retries < Remote._ajaxRetries) {
                        Remote._setStatus("Timed out sending test results, retrying...");
                        Remote._ajax(options, callback);
                    }
                    else {
                        var err = "Sending results failed " + options.retries + " times! " +
                                  "Aborting all tests.";
                        
                        if (spec) {
                            // This is not useless because even if Ajax requests
                            // failed or timed out there are still screenshots
                            // and test videos in SauceLabs that can be examined.
                            spec.fail(err);
                        }
                        
                        Test.SandBox.setFatalError(err);
                        Test.SandBox.stopAllTests();
                        
                        if (_next) {
                            _next(false, err);
                        }
                    }
                }
                else if (xhr instanceof XMLHttpRequest) {
                    if (xhr.status < 400 && ++options.retries < Remote._ajaxRetries) {
                        Remote._ajax(options, callback);
                    }
                    else {
                        err = "Sending test results failed: " + xhr.statusText;
                        
                        // Uh-oh, probably nothing we can do about this.
                        if (spec) {
                            spec.fail(err);
                        }
                        
                        Test.SandBox.setFatalError(err);
                        Test.SandBox.stopAllTests();
                        
                        if (_next) {
                            _next(false, err);
                        }
                    }
                }
                else {
                    if (spec) {
                        spec.fail(xhr);
                    }
                    
                    Test.SandBox.setFatalError(xhr + '');
                    
                    if (_next) {
                        _next(false, xhr + '');
                    }
                }
            }
        };
        
        options = {
            url: url,
            method: 'POST',
            data: messages
        };
        
        jazzman = Test.SandBox.getJazzman();
        
        if (jazzman) {
            jazzman.stopQueueWatchdog();
        }

        Remote._ajax(options, callback);
        Remote._lastSendTime = new Date().getTime();
    },
    
    _flushQueue: function(callback) {
        var queue = Remote._messageQueue,
            messages, i, status;
        
        messages = queue.slice(0, Remote._queueSize);
        
        for (i = 0; i < Remote._queueSize; i++) {
            queue[i] = null;
        }
        
        queue.length = Remote._queueSize = 0;
        
        status = messages.length === 1
            ? "Sending 1 message to server..."
            : "Sending " + messages.length + " messages to server...";
        
        Remote._setStatus(status);
        
        Remote._doSend(Remote.resultURL, messages, function(success, error) {
            if (success) {
                Remote._setStatus("Successfully flushed result message queue to server.", true);
            }
            else {
                Remote._setStatus("Error flushing result message queue to server: " + error);
            }
            
            Remote.runCallback(callback, true);
        });
    },

    _notifyWebDriver: function(callback) {
        if (Remote._queueSize > Remote.queueSizeThreshold ||
            (new Date().getTime() - Remote._lastSendTime) >= Remote.queueTimeThreshold) {
            Remote._flushQueue(callback);
        }
        else {
            Remote.runCallback(callback);
        }
    }
};

/**
 * Pretty printer for expectations. Takes any object and turns it into a human-readable string.
 *
 * @param {Mixed} value A value to be outputted
 *
 * @return {String} Resulting string representation
 */
Test.pp = function(value) {
    var prettyPrinter = new Test.PrettyPrinter();
    
    prettyPrinter.format(value);
    
    return prettyPrinter.toString();
};

Test.PrettyPrinter = function(config) {
    Test.apply(this, config);
    
    this.ppNestLevel = 0;
    this.string = '';
    
    if (!this.MAX_PRETTY_PRINT_DEPTH) {
        this.MAX_PRETTY_PRINT_DEPTH = Test.MAX_PRETTY_PRINT_DEPTH;
    }
};

Test.apply(Test.PrettyPrinter.prototype, {
    /**
     * Takes the passed value and formats it into the internal string
     * representation. Returns nothing. To get the resulting string value,
     * do not forget to call prettyPrinter.toString().
     * 
     * @param {Mixed} value
     */
    format: function(value) {
        var className, superclass, isArray;
        
        if (this.ppNestLevel > this.MAX_PRETTY_PRINT_DEPTH) {
            throw new Error('Test.PrettyPrinter: format() nested too deeply!');
        }
        
        this.ppNestLevel++;
        
        try {
            if (value === undefined) {
                this.append('undefined');
            }
            else if (value === null) {
                this.append('null');
            }
            // If all these are present it's most probably a Window
            else if (value.document && value.location && value.alert && value.setInterval) {
                this.append('<window>');
            }
            else if (typeof value === 'string') {
                this.append('"' + value + '"');
            }
            else if (value instanceof RegExp) {
                this.append(value.toString());
            }
            else if (value.expectedClass) {
                this.append(value.toString());
            }
            else if (value.isSpy) {
                this.append("spy on " + (value.identity || 'unknown'));
            }
            else if (typeof value === 'function') {
                this.append('Function');
            }
            else if (typeof value.nodeType === 'number') {
                this.append('HTMLNode');
            }
            else if (value instanceof Date) {
                this.append('Date(' + value + ')');
            }
            // Assignment in conditional is intended
            else if ((className = value.$className) !== undefined) {
                // support for pretty printing instances of Ext classes
    
                if (!className) {
                    // support for anonymous classes - Ext.define(null, ...)
                    // loop up the inheritance chain to find nearest non-anonymous ancestor
                    superclass = value.superclass;
                    
                    while (superclass && !superclass.$className) {
                        superclass = superclass.superclass;
                    }
                    
                    if (superclass) {
                        className = superclass.$className;
                    }
                }
                
                this.append(className + '#' + (value.id || (value.getId && value.getId())));
            }
            else if (value.__Jasmine_been_here_before__) {
                this.append('<circular reference: ' + (Test.util.isArray(value) ? 'Array' : 'Object') + '>');
            }
            else if ((isArray = Test.util.isArray(value)) || typeof value === 'object') {
                value.__Jasmine_been_here_before__ = true;
                
                if (isArray) {
                    this.emitArray(value);
                }
                else {
                    this.emitObject(value);
                }
                
                delete value.__Jasmine_been_here_before__;
            }
            else {
                this.append(value.toString());
            }
        }
        catch (e) {
            // ignore
        }
        finally {
            this.ppNestLevel--;
        }
    },
    
    append: function(value) {
        this.string += value;
    },
    
    iterateObject: function(obj, fn, scope) {
        var property;
        
        scope = scope || this;
        
        for (property in obj) {
            if (!obj.hasOwnProperty(property) || property === '__Jasmine_been_here_before__') {
                continue;
            }
            
            fn.call(
                scope,
                property,
                obj.__lookupGetter__
                    ? (obj.__lookupGetter__(property) !== undefined && obj.__lookupGetter__(property) !== null)
                    : false
            );
        }
    },
    
    emitArray: function(array) {
        var i, len;
        
        if (this.ppNestLevel > this.MAX_PRETTY_PRINT_DEPTH) {
            this.append("Array");
            
            return;
        }
        
        this.append('[ ');
        
        for (i = 0, len = array.length; i < len; i++) {
            if (i > 0) {
                this.append(', ');
            }
            
            this.format(array[i]);
        }
        
        this.append(' ]');
    },
    
    emitObject: function(obj) {
        var first = true,
            indent;
        
        if (this.ppNestLevel > this.MAX_PRETTY_PRINT_DEPTH) {
            this.append("Object");
            
            return;
        }
        
        this.append('{\n');
        
        if (!this.ws) {
            this.ws = 0;
        }
        
        this.ws += 4;
        
        indent = this.getIndent();
        
        this.iterateObject(obj, function(property, isGetter) {
            if (first) {
                first = false;
            }
            else {
                this.append(',\n');
            }
            
            this.append(indent + property + ': ');
            
            if (isGetter) {
                this.append('<getter>');
            }
            else {
                if (typeof obj[property] !== "object") {
                    this.format(obj[property]);
                }
                else {
                    this.append("<Object>");
                }
            }
        });
    
        this.ws -= 4;
        indent = this.getIndent();
        
        this.append(indent + '\n' + indent + '}');
    },
    
    getIndent: function() {
        var whiteSpaces = [],
            i, len;
            
        for (i = 0, len = this.ws; i < len; i++) {
            whiteSpaces.push(' ');
        }
    
        return whiteSpaces.join('');
    },
    
    toString: function() {
        return this.string;
    }
});

/**
 * Creates an HTMLElement.
 * @param {Object/HTMLElement} config Ext DomHelper style element config object.
 * If no tag is specified (e.g., {tag:'input'}) then a div will be automatically generated
 * with the specified attributes.
 * @return {HTMLElement} The created HTMLElement
 */
Test.Dom = function(config) {
    var element, children, length, child, i, property;
    
    config = config || {};
    
    if (config.tagName) {
        return config;
    }
    
    element = document.createElement(config.tag || "div");
    children = config.children || [];
    length = children.length;

    delete config.tag;
    
    for (i = 0; i < length; i++) {
        child = children[i];
        element.appendChild(new Test.Dom(child));
    }
    
    delete config.children;
    
    if (config.cls) {
        Test.Dom.setCls(element, config.cls);
        delete config.cls;
    }

    if (config.html) {
        element.innerHTML = config.html;
        delete config.html;
    }

    if (config.style) {
        Test.Dom.setStyle(element, config.style);
        delete config.style;
    }
    
    for (property in config) {
        if (!config.hasOwnProperty(property)) {
            continue;
        }
        
        element[property] = config[property];
    }

    return element;
};

/**
 * Adds className to an HTMLElement.
 * @param {HTMLElement} element The HTMLElement
 * @param {String} cls The className string
 */
Test.Dom.addCls = function(element, cls) {
    var split, len, i;
    
    if (cls.indexOf(' ') !== -1) {
        split = cls.split(' ');
        
        for (i = 0, len = split.length; i < len; i++) {
            Test.Dom.addCls(element, split[i]);
        }
        
        return;
    }
    
    if (!element.className) {
        Test.Dom.setCls(element, cls);
        
        return;
    }
    
    split = element.className.split(" ");
    
    for (i = 0, len = split.length; i < len; i++) {
        if (split[i] === cls) {
            return;
        }
    }
    
    element.className = element.className + " " + cls;
};

/**
 * Removes className to HTMLElement.
 * @param {HTMLElement} element The HTMLElement
 * @param {String} cls The className string
 */
Test.Dom.removeCls = function(element, cls) {
    var split, len, classArray, i;
    
    if (!element.className) {
        return;
    }
    
    if (cls.indexOf(' ') !== -1) {
        split = cls.split(' ');
        
        for (i = 0, len = split.length; i < len; i++) {
            Test.Dom.removeCls(element, split[i]);
        }
        
        return;
    }
    
    classArray = [];
    split = element.className.split(" ");
    
    for (i = 0, len = split.length; i < len; i++) {
        if (split[i] !== cls) {
            classArray.push(split[i]);
        }
    }
    
    element.className = classArray.join(" ");
};

/**
 * Checks if a dom element has a className.
 * @param {HTMLElement} element The HTMLElement
 * @param {String} cls The className string
 * @return {Boolean}
 */
Test.Dom.hasCls = function(element, cls) {
    var split, length, i;
    
    if (!element.className) {
        return;
    }
    
    split = element.className.split(" ");
    length = split.length;
    
    for (i = 0; i < length; i++) {
        if (split[i] === cls) {
            return true;
        }
    }
    
    return false;
};

/**
 * Sets HTMLElement className.
 * @param {HTMLElement} element The HTMLElement
 * @param {String} cls The className string
 */
Test.Dom.setCls = function(element, cls) {
    element.className = cls;
};

/**
 * Sets HTMLElement style
 * @param {HTMLElement} element The HTMLElement
 * @param {String} style The style property to set
 */
Test.Dom.setStyle = function(element, style) {
    var property;
    
    for (property in style) {
        if (style.hasOwnProperty(property)) {
            element.style[property] = style[property];
        }
    }
};

Test.OptionsImpl = function() {
    this.optionCheckBoxesEl = {};
    this.options = this.urlDecode(window.location.search.substring(1));
    this.startAutoReloadTask();
};

Test.OptionsImpl.prototype.get = function() {
    return this.options;
};

Test.OptionsImpl.prototype.getCurrentChunk = function(array, split) {
    var chunkerFn = Test.chunker,
        chunk, numChunks, len, chunks, i, size;

    split = split || this.options.chunkify;

    if (split) {
        split = split.split('/');
        chunk = +split[0];
        numChunks = +split[1];

        // chunkerFn can be injected to allow custom chunking based on browser,
        // OS, etc. Mostly used for really slow platforms like iOS/Safari and IE8.
        if (chunkerFn) {
            chunks = chunkerFn(array, chunk, numChunks);
            
            if (chunks !== false) {
                return chunks;
            }
        }

        chunks = [];

        for (i = 0, len = array.length; i < len;) {
            size = Math.ceil((len - i) / numChunks--);  // TODO "numChunks--" ???
            chunks.push(array.slice(i, i += size));
        }

        array = chunks[chunk];
    }

    return array;
};

/**
 * Takes an object and converts it to an encoded URL.
 * @param {Object} object The object to encode
 * @return {String}
 */
Test.OptionsImpl.prototype.urlEncode = function(object, skipOwn) {
    var buf = [],
        testIds = {},
        topSuites, property, value, id, length, i;
    
    for (property in object) {
        if (property === 'topSuites' || property === 'testIds') {
            continue;
        }
        
        if (skipOwn && property === 'remote-test') {
            continue;
        }
        
        value = object[property];
        
        if (Test.util.isArray(value)) {
            length = value.length;
            
            for (i = 0; i < length; i++) {
                buf.push(property + '=' + encodeURIComponent(value[i]));
            }
        }
        else {
            buf.push(property + '=' + encodeURIComponent(value));
        }
    }
    
    if (!skipOwn) {
        // We don't want to mutate the original options object
        topSuites = Test.util.cloneObject(object.topSuites);
        
        if (object.testIds) {
            for (id in object.testIds) {
                value = object.testIds[id];
                testIds[id] = value.toString(16);
            }
        }
        
        for (id in topSuites) {
            // This looks shorter than topSuites * number of suites
            buf.push('load=' + encodeURIComponent(id));
        }
        
        // Make sure test ids are always coming last in the URI
        for (id in testIds) {
            value = testIds[id];
            
            // Again looks shorter than testIds * number of ids
            buf.push('run=' + encodeURIComponent(value));
        }
    }
    
    return buf.join('&');
};

/**
 * Takes an encoded URL and and converts it to an object. Example:
 * @param {String} string
 * @return {Object} A literal with members
 */
Test.OptionsImpl.prototype.urlDecode = function(string) {
    var obj = {},
        pairs, name, value, pair, i, len;
    
    if (string !== "") {
        pairs = string.split('&');
        
        for (i = 0, len = pairs.length; i < len; i++) {
            pair = pairs[i].split('=');
            name = decodeURIComponent(pair[0]);
            value = decodeURIComponent(pair[1]);
            value = value === 'true' ? true : value === 'false' ? false : value;
            obj[name] = !obj[name] ? value : [].concat(obj[name], value);
        }
    }
    
    obj.topSuites = {};
    obj.testIds = {};
    
    // If load map is populated, only top level suites listed in it
    // will be allowed to load and run describe(). Any other top level
    // suites will be rejected by the filter.
    // We convert input array to map for speedier lookups.
    if (obj.load) {
        pairs = Test.util.isArray(obj.load) ? obj.load : [obj.load];
        
        for (i = 0, len = pairs.length; i < len; i++) {
            obj.topSuites[pairs[i]] = true;
        }
        
        delete obj.load;
    }
    
    // The run map contains ids for suites and specs allowed to execute.
    if (obj.run) {
        pairs = Test.util.isArray(obj.run) ? obj.run : [obj.run];
        
        for (i = 0, len = pairs.length; i < len; i++) {
            value = parseInt(pairs[i], 16);
            obj.testIds[value] = value;
        }
        
        delete obj.run;
    }
    
    // Old array holds the originally requested top suites, saved for coming back
    // from Checked or Failed runs.
    if (obj.old) {
        obj.old = Test.util.isArray(obj.old) ? obj.old : [obj.old];
    }
    
    // suites and specs parameters are supported for backwards compatibility
    if (obj.suites) {
        pairs = Test.util.isArray(obj.suites) ? obj.suites : [obj.suites];
        
        for (i = 0, len = pairs.length; i < len; i++) {
            // This could be either top suite name or decimal id
            if (isNaN(+pairs[i])) {
                obj.topSuites[pairs[i]] = true;
            }
            else {
                obj.testIds[value] = +pairs[i];
            }
        }
        
        delete obj.suites;
    }
    
    if (obj.specs) {
        pairs = Test.util.isArray(obj.specs) ? obj.specs : [obj.specs];
        
        for (i = 0, len = pairs.length; i < len; i++) {
            // This can only be decimal id
            value = +pairs[i];
            obj.testIds[value] = value;
        }
        
        delete obj.specs;
    }
    
    return obj;
};

Test.OptionsImpl.prototype.mapNameToId = function(name, id) {
    var tests = this.options.testIds;
    
    if (tests[name]) {
        delete tests[name];
        tests[id] = name;
    }
};

/**
 * Renders option checkbox and label.
 * @param {String} name The option name.
 * @param {String} labelText The label text.
 * @return {HTMLElement} The option HTMLElement
 */ 
Test.OptionsImpl.prototype.renderCheckbox = function(name, labelText) {
    var me = this,
        checkbox = new Test.Dom({
            tag: "input",
            cls: "option " + name,
            id: name,
            type: "checkbox",
            onclick: function() {
                me.onCheckboxClick.apply(me, arguments);
            }
        });
        
    me.optionCheckBoxesEl[name] = checkbox;
      
    return new Test.Dom({
        tag: "span",
        cls: "show",
        children: [checkbox, {
            tag: "label",
            html: labelText,
            htmlFor: name
        }]
    });
};

/**
 * Checks options checkboxs if needed. 
 */
Test.OptionsImpl.prototype.check = function() {
    var property, checkbox;
    
    for (property in this.options) {
        if (!this.options.hasOwnProperty(property)) {
            continue;
        }
        
        checkbox = this.optionCheckBoxesEl[property];
        
        if (checkbox) {
            checkbox.checked = this.options[property];
        }
    }
};

/**
 * Options checkbox check/uncked handler.
 * @param {HTMLElement} el The checkbox HTMLElement
 */
Test.OptionsImpl.prototype.onCheckboxClick = function(event) {
    var el, i, opt, url;

    event = event || window.event;
    el = event.target || event.srcElement;
    opt = el.className.split(" ")[1];
    
    if (el.checked) {
        this.options[opt] = true;
    }
    else {
        delete this.options[opt];
    }

    // Put the proper URL in the address bar but don't reload
    if (history.pushState) {
        url = location.href;

        i = url.indexOf('?');
        
        if (i > -1) {
            url = url.substr(0, i);
        }

        url += '?' + this.formLoadUrl(false);

        history.pushState(null, '', url);
    }
};

Test.OptionsImpl.prototype.mergeSuites = function(options) {
    // This is a dirty hack, no time to do it properly now :/
    var treeGrid = Test.SandBox.reporter.treeGrid,
        suites = treeGrid.suites,
        specs = treeGrid.specs,
        topSuites, testIds, result, old, id, suiteOrSpec, topSuite;
    
    // We don't want to mutate inbound objects
    result = Test.util.cloneObject(options);
    topSuites = Test.util.cloneObject(options.topSuites);
    testIds = Test.util.cloneObject(options.testIds);
    
    // topSuiteRe should be regenerated every time
    if (result.topSuiteRe) {
        delete result.topSuiteRe;
        old = [];
        
        if (!Test.util.isObjectEmpty(testIds)) {
            // Reducing the object dynamically is safe
            for (topSuite in topSuites) {
                if (topSuite.substr(topSuite.length - 1) === '*') {
                    old.push(topSuite);
                    delete topSuites[topSuite];
                }
            }
        }
        
        if (old.length) {
            result.old = old;
        }
    }
    
    for (id in options.testIds) {
        suiteOrSpec = specs[id] || suites[id];
        
        if (suiteOrSpec) {
            topSuite = suiteOrSpec.getTopSuite();
            topSuites[topSuite.fullName] = true;
            
            // If top suite is marked to run, unmark child suite/spec
            if (options.testIds[topSuite.getId()]) {
                delete testIds[id];
            }
        }
    }
    
    result.topSuites = topSuites;
    result.testIds = testIds;
    
    return result;
};

/**
 * Forms the URL for further window reloading
 */
Test.OptionsImpl.prototype.formLoadUrl = function(reset, options) {
    var suite, i, len;

    options = options || Test.util.cloneObject(this.options);
    
    if (reset) {
        options.topSuites = {};
        options.testIds = {};
        
        if (options.old && options.old.length) {
            for (i = 0, len = options.old.length; i < len; i++) {
                suite = options.old[i];
                options.topSuites[suite] = true;
            }
            
            delete options.old;
        }
    }
    
    return this.urlEncode(this.mergeSuites(options));
};

/**
 * Reloads current page with reporter options.
 */
Test.OptionsImpl.prototype.reloadWindow = function(reset) {
    var location = window.location,
        encoded;
    
    encoded = this.formLoadUrl(reset);
    
    if (location.search === '?' + encoded) {
        location.reload();
    }
    else {
        location.search = encoded;
    }
};

/**
 * Collect the failed test suite ids into the options.
 */
Test.OptionsImpl.prototype.collectFailed = function(limit) {
    var items = document.querySelectorAll('.spec.failed'),
        options = Test.util.cloneObject(Test.Options.options),
        specs = [],
        id, spec, suites, i, len, compressed;
    
    // reset so as not to compete with any previously set checkboxes
    if (options.topSuiteRe) {
        delete options.topSuiteRe;
        suites = [];
        
        for (id in options.topSuites) {
            if (id.substr(id.length - 1) === '*') {
                suites.push(id);
            }
        }
        
        if (suites.length) {
            options.old = suites;
        }
    }
    
    options.topSuites = {};
    options.testIds = {};
    
    for (i = 0, len = items.length; i < len; i++) {
        id = items[i].id.replace('spec-', '');
        spec = this.specs[id];
        
        if (spec) {
            specs.push(spec);
        }
        else {
            throw 'Spec not found: ' + id;
        }
    }
    
    // With a large number of specs we can hit URL length limit;
    // it depends on the browser and server configuration but generally
    // we can fit about 180 spec ids in the URL. If there's more specs
    // to run, we need to compress the list by finding parent suite
    // for two or more specs and running the suite instead of the
    // individual specs.
    compressed = true;
    
    while (specs.length > Test.MAX_INDIVIDUAL_SPECS && compressed) {
        suites = {};

        // Replace specs with suites
        compressed = false;
        
        for (i = 0, len = specs.length; i < len; i++) {
            if (specs[i].getParentSuite) {
                spec = specs[i].getParentSuite();

                // If we hit the root, do not include it.
                if (!spec.getParentSuite()) {
                    continue;
                }
                
                compressed = true;
            }
            
            suites[spec.getId()] = spec;
        }
        
        specs.length = 0;
        
        for (id in suites) {
            specs.push(suites[id]);
        }
    }
    
    len = limit != null ? limit : specs.length;
    
    for (i = 0; i < len; i++) {
        spec = specs[i];
        
        // These will always be Spec or Suite objects
        if (spec.id) {
            options.testIds[spec.id] = spec.id;
        }
    }
    
    return options;
};

/**
 * Starts autoReload task.
 */
Test.OptionsImpl.prototype.startAutoReloadTask = function() {
    var me = this,
        interval;
    
    if (me.options.autoReload) {
        interval = setInterval(function() {
            if (Test.SandBox.isRunning()) {
                clearInterval(interval);
            
                setTimeout(function() {
                    me.reloadWindow();
                }, 2000);
            }
        }, 1500);
    }
};

Test.OptionsImpl.prototype.isChecked = function(o) {
    var options = this.options;
    
    return options.testIds[o.getId()] || (options.topSuites[o.fullName] && !o.filtered);
};

Test.Options = new Test.OptionsImpl();

Test.SandBoxImpl = function() {};

Test.SandBoxImpl.prototype.domReady = function(fn) {
    if (window.addEventListener) {
        window.addEventListener('load', fn, false);
    }
    else {
        window.attachEvent('onload', fn);
    }
};

Test.SandBoxImpl.prototype.setup = function(config) {
    var me = this;
    
    Test.apply(me, config);
    
    me.domReady(function() {
        me.reporter = new Test.Reporter(config);
        
        me.reportProgress("Setting up iframe...", function() {
            me.createIframe();
        });
    });
};

Test.SandBoxImpl.prototype.createIframe = function() {
    var me = this,
        options, iframe, onIframeLoad, prop, hasTopSuites, src; // eslint-disable-line no-unused-vars

    me.options = options = Test.Options.get();
    
    // See if there *are* any top suites.
    for (prop in options.topSuites) {
        hasTopSuites = true;
        break;
    }
    
    onIframeLoad = function() {
        var win, doc;
        
        if (iframe.removeEventListener) {
            iframe.removeEventListener('load', onIframeLoad);
        }
        else {
            iframe.detachEvent('onload', onIframeLoad);
        }
        
        win = iframe.contentWindow || window.frames[iframe.name];
        doc = iframe.contentDocument || win.document;
    
        me.iframe = iframe;
        me.win = win;
        me.doc = doc;
        
        win.id = 'sandboxWindow';
        
        // We need a reliable way to detect if we're running under the test harness
        // while executing Ext startup code.
        win.__UNIT_TESTING__ = true;
        
        // start-tests.js needs a way to detect that remote driver is available.
        // Cmd is legacy API compatible with Sencha Test.
        win.Cmd = Test.Remote;
    };
    
    // We load the specs from bootstrap-specs.js prepared by Cmd.
    // There's a big array of URLs in there, which we can filter
    // by installing a hook function called from bootstrap-specs.
    // Returning URLs for only the specs we need is especially
    // helpful on low-powered devices like tablets that struggle
    // with loading many megabytes of code.
    if (hasTopSuites) {
        Test.Options.getCurrentChunk = function(urls) {
            var topSuites = options.topSuites,
                topSuiteMatchers = [],
                result = [],
                matchers = [],
                topSuite, re, url, i, len;
            
            for (topSuite in topSuites) {
                // Only basic wildcards now
                if (topSuite.substr(topSuite.length - 1) === '*') {
                    re = topSuite.replace(/\./g, '\\.');
                    topSuiteMatchers.push(re.replace(/\*$/, '.*$'));
                    topSuite = topSuite.replace(/\*$/, '.*');
                }
                
                topSuite = topSuite.replace(/^Ext\./, 'specs.');
                matchers.push(topSuite + '.js$');
            }
            
            if (topSuiteMatchers.length) {
                options.topSuiteRe = new RegExp(topSuiteMatchers.join('|'));
            }
            
            re = new RegExp(matchers.join('|'));
            
            for (i = 0, len = urls.length; i < len; i++) {
                url = urls[i];
                
                if (re.test(url)) {
                    result.push(url);
                }
            }
            
            // If we can't find anything, default to load everything.
            // Potential speedups are not worth breaking the world.
            return result.length ? result : urls;
        };
    }
    
    src = 'iframe.html?' + Test.Options.urlEncode(options, true);
    
    iframe = document.createElement('iframe');
    iframe.id = "sandboxIframe";
    iframe.className = "sandboxIframe";
    iframe.name = "sandbox";
    iframe.frameBorder = 0;
    iframe.src = src;
    
    if (iframe.addEventListener) {
        iframe.addEventListener('load', onIframeLoad);
    }
    else {
        iframe.attachEvent('onload', onIframeLoad);
    }
    
    // iOS needs this or else it will auto-size the iframe to its content
    // iframe.scrolling = 'no'; 

    // This will start loading
    me.reporter.getIframeContainer().appendChild(iframe);
};

Test.SandBoxImpl.prototype.getIframe = function() {
    return this.iframe;
};

Test.SandBoxImpl.prototype.getWin = function() {
    return this.win;
};

Test.SandBoxImpl.prototype.getDoc = function() {
    return this.iframeDoc ||
          (this.iframeDoc = (this.getIframe().contentDocument || this.getWin().document));
};

Test.SandBoxImpl.prototype.getBody = function() {
    return this.iframeBody || (this.iframeBody = this.getDoc().body);
};

Test.SandBoxImpl.prototype.getHead = function() {
    return this.iframeHead || (this.iframeHead = this.getDoc().getElementsByTagName("head")[0]);
};

Test.SandBoxImpl.prototype.getJazzman = function() {
    var win = this.getWin();
    
    return win ? win.jazzman : null;
};

Test.SandBoxImpl.prototype.stopAllTests = function() {
    this.getJazzman().abortAll();
};

Test.SandBoxImpl.prototype.isRunning = function() {
    return !this.getWin().jazzman.env.currentRunner.queue.isRunning();
};

Test.SandBoxImpl.prototype.iScope = function(o) {
    if (typeof o === "function") {
        o = "(" + o.toString() + ")();";
    }
    
    return Test.SandBox.getWin().eval(o);
};

Test.SandBoxImpl.prototype.reportProgress = function(text, callback) {
    this.reporter.treeGrid.setStatus(text);
    
    if (Test.Remote.enabled) {
        Test.Remote.sendMessage({
            type: 'message',
            text: text
        }, callback);
    }
    else {
        Test.Remote.runCallback(callback);
    }
};

Test.SandBoxImpl.prototype.setFatalError = function(error) {
    document.body.appendChild(new Test.Dom({
        cls: 'fatal-error-mask'
    }));
    
    document.body.appendChild(new Test.Dom({
        cls: 'fatal-error',
        children: [{
            cls: 'frame',
            children: [{
                cls: 'header',
                html: 'FATAL ERROR:'
            }, {
                cls: 'message',
                html: error
            }]
        }]
    }));
};

Test.SandBoxImpl.prototype.setStatus = function(text) {
    this.reporter.treeGrid.setStatus(text);
};

Test.SandBoxImpl.prototype.setRemoteStatus = function(text) {
    this.reporter.treeGrid.setRemoteStatus(text);
};

Test.SandBox = new Test.SandBoxImpl();
Test.panel = {};

/**
 * Renders spec dom sandbox tool.
 * @param {jazzman.spec} spec The spec.
 * @param {HTMLElement} panelsEl The HTMLElement which encapsulate the tools panels.
 */
Test.panel.Sandbox = function(config) {
    this.persist = true;

    this.render();

    return this;
};

/**
 * Renders spec dom sandbox innerHTML.
 * @return {HTMElement} The formatted dom sandbox innerHTML.
 */
Test.panel.Sandbox.prototype.render = function() {
    this.el = new Test.Dom({
        // cls: "panel sandbox hideMe"
        cls: "panel sandbox"
    });
};

/**
 * Renders infos panel.
 */
Test.panel.Infos = function() {
    this.el = new Test.Dom({
        tag: "div",
        cls: "panel infos",
        children: [{
            cls: "logs"
        }]
    });
    
    this.logs = this.el.childNodes[0];
    this.persist = true;
    
    return this;
};

/**
 * Print a message into console.
 * @param {String} message The message.
 * @param {String} cls (optional) an extra cls to add to the message.
 */
Test.panel.Infos.prototype.log = function(message, cls) {
    var log = this.logs.appendChild(new Test.Dom({
        cls: "infoMessage",
        html: message
    }));
    
    if (cls) {
        Test.Dom.addCls(log, cls);
    }
};

/**
 * @class Test.panel.TabPanel
 * Renders inspection tools htmlElement.
 * @param {Object} config The configuration object.
 */
Test.panel.TabPanel = function(config) {
    var me = this;
    
    me.options = Test.Options.get();
    
    me.spec = config.spec;
    me.container = config.container;
    me.el = new Test.Dom({
        cls: "tabpanel",
        onclick: function() {
            me.onTabPanelClick.apply(me, arguments);
        },
        children: [{
            cls: "toolBar"
        }, {
            cls: "panels"
        }]
    });
        
    me.toolbar = me.el.childNodes[0];
    me.body = me.el.childNodes[1];
    
    // Some tests cause the panels body element to scroll.
    // If that happens we need to reset scroll position.
    me.panelScrollListener = function() {
        me.panelScrolled = true;
    };
    
    if (document.addEventListener) {
        me.body.addEventListener('scroll', me.panelScrollListener, { capture: true, passive: true });
    }
    else {
        me.body.attachEvent('onscroll', me.panelScrollListener);
    }

    me.children = [];
    me.tabs = [];
    
    me.container.appendChild(me.el);
    me.renderToolBar();
    // me.add(new Test.panel.Infos({}));
    me.add(new Test.panel.Sandbox({}));
    
    if (me.options.panel) {
        me.activatePanel(me.options.panel);
    }
    
    return me;
};

Test.panel.TabPanel.prototype.resetPanelScroll = function() {
    if (this.panelScrolled) {
        this.body.scrollTop = this.body.scrollLeft = 0;
        this.panelScrolled = false;
    }
};

/**
 * Adds a panel.
 * @param {Object} panel the panel to be added to this tabPanel.
 */
Test.panel.TabPanel.prototype.add = function(panel) {
    if (panel.el) {
        this.body.appendChild(panel.el);
    }
    
    if (panel.afterRender) {
        panel.afterRender();
    }
    
    this.children.push(panel);
    
    if (panel.afterRender) {
        panel.afterRender();
    }
};

/**
 * Adds a tab
 * @param {Object} panel the panel to be added to this tabPanel.
 */
Test.panel.TabPanel.prototype.addTab = function(cls, name, persist) {
    var el = this.toolbar.appendChild(new Test.Dom({
        tag: "span",
        cls: "toolbarTab " + cls,
        html: name
    }));
    
    this.tabs.push({
        el: el,
        persist: persist
    });
};

/**
 * Activate a tool panel and render it if needed.
 * @param {String} cls The panel className.
 */
Test.panel.TabPanel.prototype.activatePanel = function(cls) {
    var children = this.children,
        length = children.length,
        child, i;
        
    for (i = 0; i < length; i++) {
        child = children[i].el;
        Test.Dom.addCls(child, "hideMe");
        
        if (Test.Dom.hasCls(child, cls)) {
            Test.Dom.removeCls(child, "hideMe");
            
            if (children[i].persist && cls !== "jsCoverageSummary") {
                this.options.panel = cls;
            }
            else {
                delete this.options.panel;
            }
        }
    }
};

/**
 * Reporter HTMLElement click dispatcher.
 * @param {Event} event The event
 */
Test.panel.TabPanel.prototype.onTabPanelClick = function(event) {
    var el;
    
    event = event || window.event;
    el = event.target || event.srcElement;

    if (Test.Dom.hasCls(el, "toolbarTab")) {
        this.onTabClick(el);
    }
};

/**
 * Handle spec tools tab click.
 * @param {HTMLElement} el The tab HTMLElement.
 */
Test.panel.TabPanel.prototype.onTabClick = function(el) {
    var tools, length, child, i;
    
    Test.Dom.addCls(el, "selected");

    tools = this.toolbar.childNodes;

    for (i = 0, length = tools.length; i < length; i++) {
        child = tools[i];
        
        if (child !== el) {
            Test.Dom.removeCls(child, "selected");
        }
    }
    
    this.activatePanel(el.className.split(" ")[1]);
};


/**
 * Renders inspection tabpanel toolbar which contain tabs.
 * @param {jazzman.Spec} spec The Jazzman spec.
 * @param {HTMLElement} toolBarEl The toolbar HTMLElement
 */
Test.panel.TabPanel.prototype.renderToolBar = function() {
    if (this.tabs.length === 0) {
        this.addTab("infos selected", "Console", true);
        this.addTab("sandbox", "Iframe", true);
    }
    else {
        Test.Dom.addCls(this.tabs[0].el, "selected");
    }
};

/**
 * Removes all non-persistant tabs.
 */
Test.panel.TabPanel.prototype.resetToolBar = function() {
    var children = this.tabs,
        length = children.length,
        child, i;

    for (i = length - 1; i >= 0; i--) {
        child = children[i];
        
        if (!child.persist) {
            this.toolbar.removeChild(child.el);
            Test.array.remove(children, child);
        }
        
        Test.Dom.removeCls(child.el, "selected");
    }
    
    this.renderToolBar();
};

/**
 * Removes all non-persistant panels.
 */
Test.panel.TabPanel.prototype.resetPanels = function() {
    var children = this.children,
        length = children.length,
        child, i;

    for (i = length - 1; i >= 0; i--) {
        child = children[i];
        
        if (!child.persist) {
            child.remove();
            Test.array.remove(children, child);
        }
        
        Test.Dom.addCls(child.el, "hideMe");
    }
    
    if (children[0]) {
        Test.Dom.removeCls(children[0].el, "hideMe");
    }
};

/**
 * Sets TabPanel current spec.
 */
Test.panel.TabPanel.prototype.setSpec = function(spec) {
    this.spec = spec;
    delete this.suite;
    this.resetToolBar();
    this.resetPanels();
};

/**
 * Sets TabPanel current suite.
 */
Test.panel.TabPanel.prototype.setSuite = function(suite) {
    this.suite = suite;
    delete this.spec;
    this.resetToolBar();
    this.resetPanels();
};

/**
 * Resize TabPanel dom element.
 */
Test.panel.TabPanel.prototype.resize = function(val) {
    this.el.style.height = val + "px";
    
    // IE8 balks at setting negative height :)
    this.body.style.height = (val || 40) - 40 + "px";
};

/**
 * @class Test.panel.TreeGrid
 * Creates and renders reporter treegrid.
 * @param {Object} config The configuration object.
 */
Test.panel.TreeGrid = function(config) {
    var me = this,
        toolbar;
    
    me.options = Test.Options.get();

    toolbar = [
        Test.Options.renderCheckbox("showPassed", "Show passed"),
        Test.Options.renderCheckbox("showDisabled", "Show disabled"),
        Test.Options.renderCheckbox("collapseAll", "Collapse all"),
        Test.Options.renderCheckbox("expandResults", "Expand results"),
        Test.Options.renderCheckbox("disableTryCatch", "No Jazzman try/catch"),
        Test.Options.renderCheckbox("breakOnFail", "Break on fail")
    ];
    
    toolbar.push(Test.Options.renderCheckbox("disableLeakChecks", "Disable leak checks"));
    
    if (window.console && window.console.profile) {
        toolbar.push(Test.Options.renderCheckbox("profile", "Profile CPU"));
    }
        
    me.el = document.body.appendChild(new Test.Dom({
        tag: "div",
        cls: "treegrid" + (Test.browser.isIE9m ? ' x-ie9m' : ''),
        children: [{
            cls: "header",
            children: [{
                cls: "logo",
                html: "Sencha"
            }, {
                cls: 'remoteStatus',
                html: ''
            }, {
                cls: 'headerBar',
                children: [{
                    cls: "statusMessage",
                    children: [{
                        tag: 'span',
                        cls: 'statusMessageText',
                        html: '&#160;'
                    }, {
                        // This is the actual *progressBar* -- it fills up to 100% and
                        // is then hidden.
                        cls: 'progressBar passed'
                    }, {
                        // This is actually the bottom border of the status area when
                        // done but is the unfinished part of the progressBar during the
                        // run.
                        cls: 'progressBar'
                    }]
                }, {
                    cls: 'runActions',
                    children: [{
                        tag: 'a',
                        'data-ref': 'stopAll',
                        cls: 'actionLink stop-all',
                        html: '&#9724;',
                        title: 'Stop all tests currently in progress',
                        onmousedown: function(e) {
                            Test.SandBox.stopAllTests();
                        }
                    }, {
                        tag: "span",
                        cls: "runLabel",
                        html: "Run:"
                    }, {
                        tag: "div",
                        cls: "actionLink run-failed",
                        unselectable: 'on',
                        html: '&#10008;',
                        title: "Run only failed specs in the current set\n" +
                               "Shift-click to run only first failed spec",
                        onmousedown: function(e) {
                            var options, limit;
                            
                            e = e || window.event;
                            
                            // Stop text selection
                            if (e.preventDefault) {
                                e.preventDefault();
                            }
                            else {
                                e.returnValue = false;
                            }
                            
                            limit = e.shiftKey ? 1 : null;
                            
                            options = Test.Options.collectFailed.call(me, limit);
                            
                            if (limit) {
                                options.expandResults = true;
                            }
                            
                            if (e.ctrlKey) {
                                options.disableTryCatch = true;
                            }
                            
                            window.location.href = '?' + Test.Options.formLoadUrl(false, options);
                        }
                    }, {
                        tag: "a",
                        href: '#',
                        cls: "actionLink run-checked",
                        html: '&#10004;',
                        title: "Run only checked specs in the current set",
                        onmousedown: function(e) {
                            e = e || window.event;
                            var target = e.target || e.srcElement;

                            target.href = '?' + Test.Options.formLoadUrl();
                        }
                    }, {
                        tag: "a",
                        href: '#',
                        cls: "actionLink run-all",
                        html: '&#10033;',
                        title: "Run all suites and specs in the original set",
                        onmousedown: function(e) {
                            e = e || window.event;

                            e.target.href = '?' + Test.Options.formLoadUrl(true);
                        }
                    }, {
                        tag: 'a',
                        cls: 'actionLink',
                        html: '&#9986;',
                        title: "Run a chunk like TeamCity",
                        onmousedown: function(e) {
                            if (e.button === 0) {
                                var chunk = prompt('Enter chunk descriptor (e.g., "0/3")'),
                                    qs;

                                // qs = 'chunkify=2%2F1';
                                if (chunk) {
                                    qs = Test.Options.formLoadUrl(true);
                                    
                                    if (qs) {
                                        qs += '&';
                                    }

                                    qs += 'chunkify=' + encodeURIComponent(chunk);

                                    location.search = '?' + qs;
                                }
                            }
                        }
                    }]
                }]
            }, {
                cls: "toolBar",
                children: [{
                    tag: "span",
                    cls: "options",
                    children: toolbar
                }]
            }]
        }, {
            tag: "div",
            cls: "tbody",
            onclick: function() {
                me.onBodyClick.apply(me, arguments);
            }
        }, {
            cls: "resizer",
            html: "&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;",
            ondblclick: function(e) {
                me.onDoubleClick(e);
            },
            onmousedown: function() {
                me.onMouseDown.apply(me, arguments);
            }
        }]
    }));
    
    me.tabPanel = new Test.panel.TabPanel({
        container: me.el
    });
  
    Test.Options.check();
    
    me.header = me.el.childNodes[0];
    me.remoteStatusEl = me.header.childNodes[1];
    me.statusMessage = me.header.childNodes[2].childNodes[0];
    me.progressBar = me.statusMessage.childNodes[1];
    me.toolBar = me.header.childNodes[2];
    me.body = me.el.childNodes[1];
    me.resizer = me.el.childNodes[2];

    me.suites = {};
    me.specs = {};
    me.suitesEls = {};
    me.specsEls = {};
    
    if (me.options.resizer) {
        me.tabPanel.resize(parseInt(me.options.resizer, 10));
    }
    else {
        // Usually it is more important to see what is happening in iframe
        // while tests are running than watching results
        me.tabPanel.resize(me.getInnerHeight() * 0.7);
    }
    
    me.resizeBody();
    
    window.onresize = function() {
        me.resizeBody();
    };
    
    // Top document body can scroll, we need to track and reset it
    me.bodyScrollListener = function() {
        me.bodyScrolled = true;
    };
    
    if (document.addEventListener) {
        document.body.addEventListener('scroll', me.bodyScrollListener, { capture: true, passive: true });
    }
    else {
        document.body.attachEvent('onscroll', me.bodyScrollListener);
    }
};

Test.panel.TreeGrid.prototype.resetBodyScroll = function() {
    if (this.bodyScrolled) {
        document.body.scrollTop = document.body.scrollLeft = 0;
        this.bodyScrolled = false;
    }
};

Test.panel.TreeGrid.prototype.checkUpdateTimer = function() {
    if (Test.STATUS_UPDATE_INTERVAL && !this.statusUpdateTimer) {
        this.statusUpdateTimer = setInterval(
            this.updateRunningSpec.bind(this), Test.STATUS_UPDATE_INTERVAL
        );
    }
};

Test.panel.TreeGrid.prototype.stopUpdateTimer = function() {
    if (this.statusUpdateTimer) {
        clearTimeout(this.statusUpdateTimer);
    }
};

/**
 * Renders suite htmlElement.
 * @param {jazzman.Suite} suite The Jazzman suite.
 * @return {HTMLElement} The suite HTMLElement
 */
Test.panel.TreeGrid.prototype.addSuite = function(suite) {
    var topSuite = suite.isTopSuite,
        padding = suite.level * 18,
        parent = suite.parentSuite,
        suiteId = suite.getId(),
        disabled = suite.isDisabled(),
        prefix = disabled ? "xdescribe: " : "describe: ",
        cls = "noexpand",
        suiteEl, row, clear;
    
    if (suite.children().length !== 0) {
        cls = this.options.collapseAll ? "expand" : "collapse";
    }
    
    if (parent && !parent.isRootSuite) {
        if (!this.suitesEls[parent.getId()]) {
            this.addSuite(parent);
        }
    }
    
    if (!Test.CI_ENVIRONMENT) {
        this.suites[suiteId] = suite;
    }
    
    row = this.createRow(this.options.collapseAll && !topSuite, suite);
    
    this.suitesEls[suiteId] = suiteEl = new Test.Dom({
        tag: "div",
        id: "suite-" + suiteId,
        cls: "suite" + (disabled ? " disabled" : "") + (topSuite ? " parent-suite" : ""),
        style: {
            "paddingLeft": padding + "px"
        },
        children: [{
            cls: cls
        }, {
            tag: "span",
            cls: "description",
            html: prefix + suite.description
        }]
    });
    
    if (suite.isDisabled()) {
        Test.Dom.addCls(row, 'disabled');
    }
    
    if (!Test.CI_ENVIRONMENT) {
        suiteEl.topSuite = topSuite;
    }
    
    row.appendChild(suiteEl);
    
    clear = new Test.Dom({ tag: 'div' });
    
    clear.style.clear = 'both';
    row.appendChild(clear);
    
    return suiteEl;
};

/**
 * Updates suite dom element by adding a code coverage percentage to it's description.
 * @param {HTMLElement} The suite dom element.
 * @param {jazzman.Suite} The Jazzman suite.
 */
Test.panel.TreeGrid.prototype.updateSuiteEl = function(suite, text) {
    var description = this.suitesEls[suite.getId()].childNodes[1];
    
    description.innerHTML = description.innerHTML + text;
};

/**
 * Renders spec htmlElement.
 * @param {jazzman.Spec} spec The Jazzman spec.
 * @return {HTMLElement} The spec HTMLElement
 */
Test.panel.TreeGrid.prototype.addSpec = function(spec) {
    var suite = spec.suite,
        padding = (suite.level + 1) * 18,
        specId = spec.getId(),
        enabled = spec.isEnabled(),
        suffix = spec.time ? " (" + spec.time + "s)" : "",
        row, clear, prefix, status, specEl, resultPanel;
        
    if (enabled) {
        prefix = "it ";
        status = spec.results().passed() ? "passed" : "failed";
    }
    else {
        prefix = "xit ";
        status = "disabled";
    }
    
    if (suite) {
        if (!this.suitesEls[suite.getId()]) {
            this.addSuite(suite);
        }
    }
    
    if (!Test.CI_ENVIRONMENT) {
        this.specs[specId] = spec;
    }
    
    row = this.createRow(this.options.collapseAll, spec);
    resultPanel = this.renderSpecResults(spec, this.options.expandResults);
    
    specEl = {
        id: "spec-" + specId,
        cls: "spec " + status,
        style: {
            "paddingLeft": padding + "px"
        },
        children: [{
            tag: "span",
            cls: "description",
            html: prefix + spec.description + suffix
        }]
    };
    
    if (enabled) {
        specEl.children.unshift({
            cls: this.options.collapseAll ? "expand" : "collapse"
        });
    }

    if (this.options.collapseAll) {
        resultPanel.style.display = "none";
    }
    
    if (resultPanel.innerHTML === "") {
        specEl.children[0].cls = "noexpand";
    }
    
    specEl.children.push(resultPanel);
    
    specEl = new Test.Dom(specEl);
    this.specsEls[specId] = specEl;
    
    row.appendChild(specEl);
    Test.Dom.addCls(row, status);
    
    clear = new Test.Dom({ tag: 'div' });
    clear.style.clear = 'both';
    row.appendChild(clear);
    
    if (resultPanel.scrollHeight > 26) {
        Test.Dom.addCls(row, 'results-collapsed');
    }
};

/**
 * Returns a suite by id.
 * @param {String/Number} id The suite id.
 * @return {jazzman.Suite} The Jazzman suite.
 */
Test.panel.TreeGrid.prototype.getSuite = function(id) {
    return this.suites[id];
};

/**
 * Returns a spec by id.
 * @param {String/Number} id The spec id.
 * @return {jazzman.Spec} The Jazzman spec.
 */
Test.panel.TreeGrid.prototype.getSpec = function(id) {
    return this.specs[parseInt(id, 10)];
};

/**
 * Body elements click event dispatcher.
 */
Test.panel.TreeGrid.prototype.onBodyClick = function(event) {
    event = event || window.event;
    
    var el = event.target || event.srcElement,
        cls = el.className,
        i;
        
    if (cls) {
        if (Test.Dom.hasCls(el, "results-expander")) {
            return;
        }

        if (Test.Dom.hasCls(el, "collapse")) {
            this.onCollapse(el);
            
            return;
        }

        if (Test.Dom.hasCls(el, "expand")) {
            this.onExpand(el);
            
            return;
        }
        
        if (Test.Dom.hasCls(el, "select-checkbox")) {
            this.onCheck(el);
            
            return;
        }
        
        for (i = 0; i < 6; i++) {
            if (cls && Test.Dom.hasCls(el, "row")) {
                this.onRowClick(el);
                
                return;
            }
            
            el = el.parentNode;
            
            if (!el) {
                break;
            }
            
            cls = el.className;
        }
    }
};

/**
 * Checkboxes listener.
 */
Test.panel.TreeGrid.prototype.onCheck = function(el) {
    var next = el.parentNode.nextSibling,
        id;

    if (Test.Dom.hasCls(next, "spec")) {
        id = parseInt(next.id.replace("spec-", ""), 10);
    }
    else {
        id = parseInt(next.id.replace("suite-", ""), 10);
    }
    
    if (el.checked) {
        this.options.testIds[id] = id;
    }
    else {
        delete this.options.testIds[id];
    }
};

/**
 * Returns row dom element by spec or suite.
 * @param {jazzman.Suite/jazzman.Spec} o A suite or a spec.
 * @return {HTMLElement} The row dom element.
 */
Test.panel.TreeGrid.prototype.getRow = function(o) {
    var id = o.getId();
    
    if (o.isSuite && this.suitesEls[id]) {
        return this.suitesEls[id].parentNode;
    }
    else if (this.specsEls[id]) {
        return this.specsEls[id].parentNode;
    }
};

/**
 * Iterates nested rows calling the supplied function.
 * @param {HTMLElement} row The row.
 * @param {Function} fn The function.
 * @param {Boolean} recursive recurse in all children suite (default to true)
 */
Test.panel.TreeGrid.prototype.onEachRow = function(row, fn, recursive) {
    var me = this,
        id = row.childNodes[1].id,
        suite, spec;
        
    function traverse(s, func) {
        var children = s.children && s.children(),
            child, i, len, r;
    
        if (children && children.length) {
            for (i = 0, len = children.length; i < len; i++) {
                child = children[i];
                r = me.getRow(child);
                
                if (r) {
                    func.call(me, r, child);
                    
                    if (child.children && recursive !== false) {
                        traverse(child, func);
                    }
                }
            }
        }
    }
    
    if (id.search("suite") !== -1) {
        suite = this.getSuite(id.replace("suite-", ""));
        traverse(suite, fn);
    }
    else {
        spec = this.getSpec(id.replace("spec-", ""));
        traverse(spec, fn);
    }
};

/**
 * Collapse click handler.
 */
Test.panel.TreeGrid.prototype.onCollapse = function(el) {
    el = el.parentNode;
    Test.Dom.setCls(el.childNodes[0], "expand");
    
    if (Test.Dom.hasCls(el, "suite")) {
        this.onEachRow(el.parentNode, function(row, o) {
            var childNode = row.childNodes[1],
                icon = childNode.childNodes[0],
                content = childNode.childNodes[2];
                
            row.style.display = "none";
            
            if (Test.Dom.hasCls(icon, "collapse")) {
                Test.Dom.setCls(icon, "expand");
            }
            
            if (o.suite) {
                content.style.display = "none";
            }
        });
    }
    else {
        el.childNodes[2].style.display = "none";
    }
};

/**
 * Expand click handler.
 */
Test.panel.TreeGrid.prototype.onExpand = function(el) {
    el = el.parentNode;
    Test.Dom.setCls(el.childNodes[0], "collapse");
    
    if (Test.Dom.hasCls(el, "suite")) {
        this.onEachRow(el.parentNode, function(row, o) {
            row.style.display = "block";
        }, false);
    }
    else {
        el.childNodes[2].style.display = "block";
    }
};

/**
 * Row click click handler.
 */
Test.panel.TreeGrid.prototype.onRowClick = function(el) {
    var rows = el.parentNode.childNodes,
        length = rows.length,
        id, i;
        
    for (i = 0; i < length; i++) {
        Test.Dom.removeCls(rows[i], "selected");
    }
    
    Test.Dom.addCls(el, "row selected");
    id = el.childNodes[1].id;
    
    if (id.search("spec") !== -1) {
        this.tabPanel.setSpec(this.getSpec(id.replace("spec-", "")));
    }
    
    if (id.search("suite") !== -1) {
        this.tabPanel.setSuite(this.getSuite(id.replace("suite-", "")));
    }
};

/**
 * Creates row dom element.
 * @param {Boolean} hide Sets the row visibility.
 * @param {jazzman.Suite/jazzman.Spec} The suite or the spec.
 * @return {HTMLElement} The row.
 */
Test.panel.TreeGrid.prototype.createRow = function(hide, o) {
    var row = this.body.appendChild(new Test.Dom({
        tag: "div",
        cls: "row",
        style: {
            display: hide ? "none" : "block"
        },
        children: [{
            cls: "checkbox-col",
            children: [{
                tag: "input",
                cls: "select-checkbox",
                type: "checkbox"
            }]
        }]
    }));
    
    if (Test.Options.isChecked(o)) {
        row.childNodes[0].childNodes[0].checked = true;
    }
        
    return row;
};

/**
 * Resizer
 */
Test.panel.TreeGrid.prototype.onDoubleClick = function(event) {
    var el;

    event = event || window.event;
    el = event.target || event.srcElement;

    if (Test.Dom.hasCls(el, "resizer")) {
        if (event.preventDefault) {
            event.preventDefault();
        }
        else {
            event.returnValue = false;
        }

        this.options.resizer = 0;
        this.tabPanel.el.style.height = '0';
        this.resizeBody();
    }
};

/**
 * MouseDown event listener. (resizing starts)
 */
Test.panel.TreeGrid.prototype.onMouseDown = function(event) {
    var me = this;
    
    event = event || window.event;

    if (event.preventDefault) {
        event.preventDefault();
    }
    else {
        event.returnValue = false;
    }

    this.pageY = event.pageY || event.clientY;

    this.startHeight = this.tabPanel.el.clientHeight;
    document.body.style.cursor = "row-resize";
    
    document.onmousemove = function(e) {
        me.onMouseMove(e);
    };
    
    document.onmouseup = function(e) {
        me.onMouseUp(e);
    };
};

/**
 * MouseDown event listener. (resize in progress)
 */
Test.panel.TreeGrid.prototype.onMouseMove = function(event) {
    var diff;
    
    if (this.pageY) {
        event = event || window.event;
        diff = Math.max(200, this.startHeight - ((event.pageY || event.clientY) - this.pageY));
        diff = Math.min(diff, document.body.clientHeight - 200);
        
        this.tabPanel.resize(diff);
        this.options.resizer = diff;
        this.resizeBody();
    }
};

/**
 * MouseUp event listener. (resize ends)
 */
Test.panel.TreeGrid.prototype.onMouseUp = function(event) {
    document.body.style.cursor = "auto";
    delete this.pageY;
    document.onmousemove = document.onmouseup = null;
};

/**
 * Returns treegrid innerHeight.
 * @return {Number} The innerHeight.
 */
Test.panel.TreeGrid.prototype.getInnerHeight = function() {
    return (window.innerHeight || document.documentElement.clientHeight) - this.header.offsetTop * 2;
};

/**
 * Resizes treegrid.
 */
Test.panel.TreeGrid.prototype.resizeBody = function() {
    var height = this.getInnerHeight();
    
    height -= this.resizer.offsetHeight + this.tabPanel.el.offsetHeight + this.header.offsetHeight;
    height -= 2;
    height = Math.max(30, height);
    this.body.style.height = height + 'px';
};

/**
 * Results expander click toggle handler.
 * @param {Event} event The event
 */
Test.panel.TreeGrid.prototype.onExpanderClick = function(resultsEl, e) {
    var el = e.target || e.srcElement,
        expanderCollapseCls = 'expander-collapse',
        resultsExpandedCls = 'results-expanded',
        isCollapsed = Test.Dom.hasCls(el, expanderCollapseCls) ? 'removeCls' : 'addCls';

    Test.Dom[isCollapsed](el, expanderCollapseCls);
    Test.Dom[isCollapsed](resultsEl, resultsExpandedCls);
};

/**
 * Renders specs results.
 * @param {jazzman.Spec} spec The spec.
 * @return {HTMLElement} The spec results dom element.
 */
Test.panel.TreeGrid.prototype.renderSpecResults = function(spec, expand) {
    var me = this,
        resultItems = spec.results().items(),
        length = resultItems.length,
        resultsEl,
        resultEl,
        result,
        i;
            
    resultsEl = new Test.Dom({
        cls: "results",
        children: [{
            cls: 'results-expander expander-expand',
            onclick: function(e) {
                e = e || window.event;
                me.onExpanderClick.apply(me, [resultsEl, e]);
            }
        }]
    });
        
    for (i = 0; i < length; i++) {
        result = resultItems[i];
        
        if (result.type === "expect" && result.passed) {
            
            if (result.passed()) {
                resultEl = this.renderPassedResult(result);
            }
            else {
                resultEl = this.renderFailedResult(result);
            }
            
            if (i === 0) {
                Test.Dom.addCls(resultEl, "first");
            }
            
            resultsEl.appendChild(resultEl);

            if (result.error) {
                break;
            }
        }
    }
    
    if (expand) {
        me.onExpanderClick(resultsEl, { target: resultsEl.firstChild });
    }

    return resultsEl;
};

/**
 * Renders failed spec result.
 * @param {Object} result The spec result.
 * @return {HTMLElement} The spec result message HTMLElement
 */
Test.panel.TreeGrid.prototype.renderFailedResult = function(result) {
    var message = result.message,
        children;

    children = [{
        cls: "prettyPrint",
        html: Test.util.htmlEscape(message)
    }];
    
    return new Test.Dom({
        cls: "resultMessage fail",
        children: children
    });
};

/**
 * Renders failed spec result.
 * @param {Object} result The spec result.
 * @return {HTMLElement} The spec result message HTMLElement
 */
Test.panel.TreeGrid.prototype.renderPassedResult = function(result) {
    var children = [{
        cls: "prettyPrint",
        html: "Actual: " + Test.pp(result.actual) +
              // Spies do not have an expected value
              (result.actual && result.actual.isSpy ? '' : "\nExpected: " + Test.pp(result.expected)) +
              "\nMatcher: " + result.matcherName + "."
    }];
    
    return new Test.Dom({
        cls: "resultMessage pass",
        children: children
    });
};

/**
 * Returns tabPanel console.
 */
Test.panel.TreeGrid.prototype.getInfoPanel = function() {
    return this.tabPanel.children[0];
};

/**
 * Print a message into info console.
 * @param {String} message The message.
 * @param {String} cls (optional) an extra cls to add to the message.
 */
Test.panel.TreeGrid.prototype.log = function(message, cls) {
    // this.getInfoPanel().log(message, cls);
};

/**
 * Sets statubar message, this method can also add a className.
 * @param {String} message The message.
 * @param {String} cls The className (optional).
 */ 
Test.panel.TreeGrid.prototype.setStatus = function(message, cls) {
    this.statusMessage.firstChild.innerHTML = message;
    
    if (cls) {
        Test.Dom.addCls(this.statusMessage, cls);
    }
    
    // Some test (somehow) cause the body to scroll, so fix it
    // document.body.scrollTop = 0;
};

Test.panel.TreeGrid.prototype.setRemoteStatus = function(message) {
    this.remoteStatusEl.innerHTML = message;
};

Test.panel.TreeGrid.prototype.setRunningSpec = function(specName) {
    this.runningSpec = specName;
    
    if (Test.STATUS_UPDATE_INTERVAL === 0) {
        this.updateRunningSpec();
    }
};

Test.panel.TreeGrid.prototype.updateRunningSpec = function() {
    if (this.runningSpec) {
        this.setStatus("Running: " + Test.util.htmlEscape(this.runningSpec));
    }
};

Test.toggleDarkMode = function(ev) {
    if (ev.charCode === 100) { // 'd'
        var body = document.body;

        if (/dark-mode/.test(body.className)) {
            Test.Dom.removeCls(body, 'dark-mode');
            Test.removeCookie('testrunner-dark-mode');
        }
        else {
            Test.Dom.addCls(body, 'dark-mode');
            Test.setCookie('testrunner-dark-mode', '1');
        }
    }
};

/**
 * @class Test.Reporter
 * The Sencha Unit Tests Reporter
 */

Test.Reporter = function(config) {
    config = config || {};

    this.options = Test.Options.get();
    
    if (this.options['remote-test']) {
        Test.Remote.setOptions(this.options['remote-test']);
        Test.Remote.enabled = true;
    }
    
    this.runnedSpecsCount = 0;
    this.failedSpecsCount = 0;
    this.disabledSpecsCount = 0;
    this.optionCheckBoxesEl = {};
    this.treeGrid = new Test.panel.TreeGrid(config);
};

Test.Reporter.prototype.reportEnvSetupStarting = function(env, callback) {
    var options = this.options,
        suites = options.topSuites,
        topSuiteRe = options.topSuiteRe;
    
    // By default we do not keep passed suites' results to conserve RAM
    if (!options.showPassed) {
        env.keepPassedResults = false;
    }
    
    this.treeGrid.setStatus("Executing describe() blocks...");
    
    var _next = function() {
        if (!Test.util.isObjectEmpty(suites)) {
            env.topSuiteFilter = function(name) {
                return !!suites[name] || (topSuiteRe && topSuiteRe.test(name));
            };
        }
        
        if (Test.Remote.enabled) {
            Test.Remote.sendMessage({
                type: 'message',
                text: 'Finished executing describe() blocks'
            }, function() {
                setTimeout(callback, 0);
            });
        }
        else {
            setTimeout(callback, 0);
        }
    };
    
    if (Test.Remote.enabled) {
        Test.Remote.sendMessage({
            type: 'message',
            text: 'Executing describe() blocks...'
        }, _next);
    }
    else {
        _next();
    }
};

Test.Reporter.prototype.reportEnvSetupFinishing = function(env, callback) {
    var tests = this.options.testIds;
    
    if (!Test.util.isObjectEmpty(tests)) {
        this.treeGrid.setStatus("Filtering tests...");
        env.currentRunner().filter(tests);
    }
    
    this.treeGrid.setStatus("Preparing to run tests...");
    
    if (Test.Remote.enabled) {
        Test.Remote.sendMessage({
            type: 'message',
            text: 'Preparing to run tests...'
        }, callback);
    }
    else {
        setTimeout(callback, 0);
    }
};

Test.Reporter.prototype.reportDependencyLoadStarting = function(env, callback) {
    this.treeGrid.setStatus("Loading test dependencies...");
    
    if (Test.Remote.enabled) {
        Test.Remote.sendMessage({
            type: 'dependencyLoadStarted'
        }, callback);
    }
    else {
        setTimeout(callback, 0);
    }
};

Test.Reporter.prototype.reportDependencyLoadFinishing = function(env, callback) {
    this.treeGrid.setStatus("Finished loading test dependencies.");
    
    if (Test.Remote.enabled) {
        Test.Remote.sendMessage({
            type: 'dependencyLoadFinished'
        }, callback);
    }
    else {
        setTimeout(callback, 0);
    }
};

/**
 * Called before runner execution.
 * @param {jazzman.Runner} runner The Jazzman Runner
 */ 
Test.Reporter.prototype.reportRunnerStarting = function(runner, callback) {
    this.startedAt = new Date();
    
    Test.Dom.addCls(this.treeGrid.header, 'running');
    
    this.logger = this.treeGrid;
    
    if (this.options.profile && window.console && window.console.profile) {
        console.profile('Unit tests');
    }
    
    this.treeGrid.checkUpdateTimer();
    
    if (Test.Remote.enabled) {
        Test.Remote.queueMessage({
            type: 'testRunnerStarted',
            plan: {
                totalSpecs: runner.env.totalSpecs,
                enabledSpecs: runner.env.enabledSpecs,
                disabledSpecs: runner.env.disabledSpecs
            }
        }, callback, 'flush');
    }
    else {
        setTimeout(callback, 0);
    }
};

/**
 * Called after Jazzman runner execution ends.
 * @param {jazzman.Runner} runner The Jazzman Runner
 */ 
Test.Reporter.prototype.reportRunnerResults = function(runner, callback) {
    if (this.options.profile && window.console && window.console.profileEnd) {
        console.profileEnd('Unit tests');
    }
    
    this.treeGrid.stopUpdateTimer();
    
    Test.Dom.removeCls(this.treeGrid.header, 'running');

    this.renderResults(runner);
    
    if (!this.options.resizer) {
        var treeGrid = this.treeGrid;
        
        treeGrid.tabPanel.resize(0);
        treeGrid.resizeBody();
    }
    
    if (Test.Remote.enabled) {
        Test.Remote.queueMessage({
            type: 'testRunnerFinished',
            plan: {
                totalSpecs: runner.env.totalSpecs,
                enabledSpecs: runner.env.enabledSpecs,
                disabledSpecs: runner.env.disabledSpecs,
                finishedSpecs: runner.env.finishedSpecs
            }
        }, callback, 'flush');
    }
    else {
        setTimeout(callback, 0);
    }
};

/**
 * Called before spec execution.
 * @param {jazzman.Runner} suite The Jazzman spec
 */ 
Test.Reporter.prototype.reportSuiteStarting = function(suite, callback) {
    var msg;
    
    if (this.options.showTimings) {
        suite.startedAt = new Date();
    }
    
    if (Test.Remote.enabled) {
        msg = {
            type: 'testSuiteStarted',
            name: suite.description
        };
        
        if (suite.isTopSuite) {
            msg.topSuite = true;
        }
        
        Test.Remote.queueMessage(msg);
    }
    
    Test.Remote.runCallback(callback, !!suite.isTopSuite);
};

/**
 * Called after suite execution ends.
 * @param {jazzman.Runner} suite A Jazzman suite
 */ 
Test.Reporter.prototype.reportSuiteResults = function(suite, callback) {
    var suiteId = suite.getId(),
        suiteEl = this.treeGrid ? this.treeGrid.suitesEls[suiteId] : undefined,
        status, msg;
    
    if (suite.isTopSuite) {
        Test.Options.mapNameToId(suite.fullName, suiteId);
        
        if (this.treeGrid && !Test.CI_ENVIRONMENT) {
            this.treeGrid.suites[suiteId] = suite;
        }
    }
    
    if (suite.isEnabled()) {
        if (this.options.showTimings) {
            suite.time = (((new Date()).getTime() - suite.startedAt.getTime()) / 1000).toFixed(3);
        }
        
        if (this.treeGrid && this.options.showPassed && !suiteEl) {
            suiteEl = this.treeGrid.addSuite(suite);
        }
        
        if (suiteEl) {
            status = suite.results().passed() ? "passed" : "failed";
            Test.Dom.addCls(suiteEl, status);
            Test.Dom.addCls(suiteEl.parentNode, status);
            
            if (suite.time) {
                this.treeGrid.updateSuiteEl(suite, " (" + suite.time + "s)");
            }
        }
    }
    else if (this.treeGrid && this.options.showDisabled && !suiteEl) {
        this.treeGrid.addSuite(suite);
    }
    
    if (Test.Remote.enabled) {
        msg = {
            type: 'testSuiteFinished',
            name: suite.description
        };
        
        if (suite.isTopSuite) {
            msg.topSuite = true;
        }
        
        Test.Remote.queueMessage(
            msg,
            callback,
            Test.Remote._flushTopSuites && suite.isTopSuite ? 'flush' : 'notify'
        );
    }
    else {
        Test.Remote.runCallback(callback);
    }
};

/**
 * Called before spec execution.
 * @param {jazzman.Runner} suite The Jazzman spec
 */ 
Test.Reporter.prototype.reportSpecStarting = function(spec, callback) {
    if (spec.isEnabled()) {
        if (this.options.showTimings) {
            spec.startedAt = new Date();
        }
        
        this.treeGrid.setRunningSpec(spec.getFullName());
    }
    
    Test.Remote.runCallback(callback);
};

/**
 * Called after spec execution.
 * @param {jazzman.Runner} suite The Jazzman spec
 */
Test.Reporter.prototype.reportSpecResults = function(spec, callback) {
    var options = this.options,
        treeGrid = this.treeGrid,
        progressBar = treeGrid.progressBar,
        results, passed, items, item, msg, total, remaining, percent,
        i, len;
    
    if (spec.isEnabled()) {
        if (options.showTimings) {
            spec.time = (((new Date()).getTime() - spec.startedAt.getTime()) / 1000).toFixed(3);
        }
        
        results = spec.results();
        passed = results.passed();

        if (!passed && !this.failedSpecsCount++) {
            progressBar.className += ' failed';
        }
        
        if (Test.Remote.enabled) {
            Test.Remote.queueMessage({
                type: 'testStarted',
                name: results.description
            });
            
            items = results.items();
            
            for (i = 0, len = items.length; i < len; i++) {
                item = items[i];
                
                if (!item.passed()) {
                    msg = {
                        type: 'testFailed',
                        name: results.description,
                        message: item.message
                    };
                    
                    /* eslint-disable indent */
                    msg.details = item.error && item.trace ? item.error + ' ' + item.trace.stack
                                : item.error               ? item.error
                                : item.trace               ? item.trace
                                :                            null
                                ;
                    /* eslint-enable indent */
                    
                    if (msg.details == null) {
                        delete msg.details;
                    }
                    
                    // if (item.type === 'expect') {
                    //     msg.actual = item.actual;
                    //     msg.expected = item.expected;
                    // }
                    
                    Test.Remote.queueMessage(msg);
                }
            }
            
            Test.Remote.queueMessage({
                type: 'testFinished',
                name: results.description
            });
        }

        if ((!passed || options.showPassed) && spec.isEnabled()) {
            treeGrid.addSpec(spec);
        }

        this.runnedSpecsCount += spec.totalSpecs;
    }
    else {
        this.disabledSpecsCount += spec.totalSpecs;
        
        if (options.showDisabled) {
            treeGrid.addSpec(spec);
        }
    }

    spec.env.remainingSpecs -= spec.totalSpecs;
    
    total = spec.env.totalSpecs;
    remaining = spec.env.remainingSpecs;
    
    if (remaining) {
        percent = Math.round((total - remaining) / total * 1000) / 10;
        percent = Math.min(Math.max(percent, 0), 100);
        progressBar.style.width = (percent || 0) + '%';
    }
    else {
        progressBar.style.display = 'none';
    }
    
    this.treeGrid.resetBodyScroll();
    this.treeGrid.tabPanel.resetPanelScroll();
    
    Test.Remote.runCallback(callback);
};

/**
 * Updates runner message with failed and passed specs
 * @param {jazzman.Runner} runner The Jazzman runner.
 */
Test.Reporter.prototype.renderResults = function(runner) {
    var cls, runTime, message;
    
    if (runner.errorNoTestsFound) {
        cls = "failed";
        message = "No tests found!";
    }
    else {
        cls = (this.failedSpecsCount > 0) ? "failed" : "passed";
        
        runTime = (new Date().getTime() - this.startedAt.getTime()) / 1000;
    
        message = this.runnedSpecsCount + " spec" +
                  (this.runnedSpecsCount === 1 ? "" : "s") + " ran, " +
                  this.failedSpecsCount + " failure" +
                  (this.failedSpecsCount === 1 ? "" : "s") +
                  " and " + this.disabledSpecsCount + " disabled " +
                  "(" + runner.env.totalSpecs + " specs total)";
                     
        message += " in " + runTime + "s";
    }
    
    if (this.treeGrid) {
        this.treeGrid.setStatus(message, cls);
    }
};

Test.Reporter.prototype.log = function() {
    if (this.options.verbose || arguments.length === 2) {
        this.logger.log.apply(this.logger, arguments);
    }
    
    if (Test.Remote.enabled) {
        var args = Array.prototype.slice.call(arguments),
            toSend = [],
            i, len;
        
        for (i = 0, len = args.length; i < len; i++) {
            if (typeof args[i] !== 'function') {
                toSend.push({
                    type: 'message',
                    text: args[i]
                });
            }
        }
        
        Remote.sendMessage(toSend);
    }
};

Test.Reporter.prototype.getIframeContainer = function() {
    if (this.treeGrid) {
        return this.treeGrid.tabPanel.children[0].el;
    }
    
    return document.body;
};

})();
