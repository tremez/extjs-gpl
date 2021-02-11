/**
 * Top level namespace for Jazzman, a virtuoso JavaScript BDD/spec/testing framework.
 *
 * @namespace
 */
var jazzman = {};

// Compatibility
var jasmine = jazzman;

// This needs to happen outside strict mode to capture global object as function context
jazzman.getGlobal = function() {
    function getGlobal() {
        return this;
    }
    
    return getGlobal();
};

(function() {
'use strict';

/**
 * Set to `true` to enable a set of optimizations for unattended test runs
 * in CI environments.
 */
jazzman.CI_ENVIRONMENT = false;

/**
 * Set to `true` to skip executing tests. This is done in CI environment to warm up
 * remote cache by loading all test specs and their dependencies.
 */
jasmine.SKIP_ALL_TESTS = false;

/**
 * Set to `true` to enable debugging facilities like console dumps for leaked resources,
 * breaking on caught exceptions, etc. This mode is assumed to be mutually exclusive with
 * the above CI_ENVIRONMENT, but even when not in CI it is turned off by default.
 * Local runner will turn it on when a specific set of suites/specs is loaded, as opposed
 * to whole test suite.
 */
jazzman.DEBUGGING_MODE = false;

/**
 * Show diagnostic messages in the console if set to true
 *
 */
jazzman.VERBOSE = !jazzman.CI_ENVIRONMENT;

/**
 * Maximum levels of nesting that will be included when an object is pretty-printed.
 */
jazzman.MAX_PRETTY_PRINT_DEPTH = 1;

/**
 * Set to `true` to shuffle the execution order of specs and suites to get
 * less predictable results.
 */
jazzman.SHUFFLE = false;

/**
 * Default interval in milliseconds for event loop yields (e.g. to allow network activity
 * or to refresh the screen with the HTML-based runner). Small values here may result in
 * slow test running. Zero means no updates until all tests have completed.
 *
 */
jazzman.DEFAULT_UPDATE_INTERVAL = 250;

/**
 * Default timeout interval in milliseconds for waitsFor() blocks.
 */
jazzman.DEFAULT_TIMEOUT_INTERVAL = 5000;

/**
 * Default timeout interval in milliseconds for WaitsForEvent blocks.
 */
jazzman.DEFAULT_EVENT_TIMEOUT = 1000;

/**
 * Default watchdog timeout interval used to abort runaway blocks that are
 * taking too long to complete. Set this reasonably high to accommodate for
 * the old and slow browsers; we want to catch otherwise catastrophic things
 * like endless loops.
 */
jazzman.DEFAULT_WATCHDOG_INTERVAL = 120000;

/**
 * By default exceptions thrown in the context of a test are caught by jazzman
 * so that it can run the remaining tests in the suite.
 * Set to false to let the exception bubble up in the browser.
 *
 */
jazzman.CATCH_EXCEPTIONS = true;

/**
 * Set this option to `true` to enable debugger breakpoint whenever an expectation
 * is failed.
 */
jazzman.BREAK_ON_FAIL = false;

/**
 * Set to `false` to disable all leak checks performed after completion of every
 * spec. At the moment, we're checking for global variables, DOM nodes, Component
 * instances, timers, data Stores, etc. added but not removed in the spec.
 */
jazzman.CHECK_LEAKS = true;

/**
 * Set to `false` to disable Component creation point tracking. This is done by
 * capturing call stack in Component constructor, and this operation adds some
 * overhead that is only useful when debugging.
 * While this option is enabled by default, it is advised to disable it in CI
 * environments.
 */
jazzman.CAPTURE_CALL_STACK = !jazzman.CI_ENVIRONMENT;

/**
 * Set to `false` to disable clearing prototype upon object destruction. This is
 * a very useful option for unit tests so think hard before disabling it!
 */
jazzman.CLEAR_PROTOTYPE = true;

/**
 * Set to `false` to prevent saving result details for passed expectations.
 * By default we keep stringified details for expected and actual values
 * because the user might want to evaluate these; however there is a cost to it
 * that is meaningless when running in automated TC environments that only report
 * details for spec failures.
 */
jazzman.KEEP_PASSED_RESULTS = !jazzman.CI_ENVIRONMENT;

/**
 * The regular expression used by {@link #topSuite} to match class name
 * requirements.
 */
jazzman.TOP_SUITE_PREFIX = new RegExp('');

/**
 * The delimiter to use when computing full name of a spec. To prevent collisions
 * we use HTML character entity for space that looks ordinary when rendered in HTML
 * but is highly unlikely to be used in suite/spec descriptions:
 *
 * // Spec full name is "foo bar&#32;baz"
 * describe("foo bar", function() {
 *     it("baz", function() {});
 * });
 *
 * // Spec full name is "foo&#32;bar baz"
 * describe("foo", function() {
 *     it("bar baz", function() {});
 * });
 */
jazzman.FULL_NAME_DELIMITER = '&#32;';
jazzman.FULL_NAME_DELIMITER_RE = new RegExp(jazzman.FULL_NAME_DELIMITER, 'g');

/**
 * @private
 */
jazzman._unimplementedMethod = function() {
    throw new Error("unimplemented method");
};

/**
 * Use `jazzman.undefined` instead of `undefined`, since `undefined` is just
 * a plain old variable and may be redefined by somebody else.
 *
 * @private
 */
jazzman.undefined = jazzman.___undefined___;

// Usually Ext will install this polyfill but it may be loaded later
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

(function() {
    var enumerables = ['valueOf', 'toLocaleString', 'toString', 'constructor'],
        enumerable; // eslint-disable-line no-unused-vars
    
    for (enumerable in { toString: 1 }) {
        enumerables = null;
    }
    
    jazzman.apply = function(object, config, defaults) {
        var i, j, k;

        if (defaults) {
            jazzman.apply(object, defaults);
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
})();

jazzman.abortAll = function() {
    jazzman.ABORT_ALL_QUEUES = true;
};

jazzman.isReady = function() {
    return jazzman.env.isReady();
};

jazzman.onReady = function() {
    var env = jazzman.env;
    
    return env.onReady.apply(env, arguments);
};

jazzman.blockReady = function() {
    return jazzman.env.blockReady();
};

jazzman.unblockReady = function() {
    return jazzman.env.unblockReady();
};

jazzman.emptyFn = function() {};

jazzman.startLoadingDependencies = jazzman.emptyFn;
jazzman.installDependenciesCallback = jazzman.emptyFn;

/**
 * Allows for bound functions to be compared. Internal use only.
 *
 * @ignore
 * @private
 * @param base {Object} bound 'this' for the function
 * @param name {Function} function to find
 */
jazzman._bindOriginal = function(base, name) {
    var original = base[name];
  
    if (original.apply) {
        return function() {
            return original.apply(base, arguments);
        };
    }
    else {
        // IE support
        return jazzman.getGlobal()[name];
    }
};

(function() {
    var global = jazzman.getGlobal();
    
    jazzman.setTimeout = jazzman._bindOriginal(global, 'setTimeout');
    jazzman.clearTimeout = jazzman._bindOriginal(global, 'clearTimeout');
    jazzman.setInterval = jazzman._bindOriginal(global, 'setInterval');
    jazzman.clearInterval = jazzman._bindOriginal(global, 'clearInterval');
    
    jazzman._setTimeout = global.setTimeout;
    jazzman._clearTimeout = global.clearTimeout;
    jazzman._setInterval = global.setInterval;
    jazzman._clearInterval = global.clearInterval;
    
    if (global.setImmediate) {
        jazzman._setImmediate = global.setImmediate;
    }
    
    if (global.clearImmediate) {
        jazzman._clearImmediate = global.clearImmediate;
    }
    
    jazzman._requestAnimationFrame = (function() {
        var requestAnimFrame = global.requestAnimationFrame ||
                global.webkitRequestAnimationFrame ||
                global.mozRequestAnimationFrame ||
                global.oRequestAnimationFrame ||
                function(callback) {
                    var currTime = jazzman.util.now(),
                        timeToCall = Math.max(0, 16 - (currTime - jazzman._lastFakeFrameTime)),
                        id;
                        
                    id = jazzman.setTimeout(function() {
                        callback(currTime + timeToCall);
                    }, timeToCall);
                    
                    jazzman._lastFakeFrameTime = currTime + timeToCall;
                    
                    return id;
                };
    
        return function(fn) {
            if (requestAnimFrame.apply) {
                return requestAnimFrame.apply(global, arguments);
            }
            else {
                return requestAnimFrame(fn);
            }
        };
    })();
})();

jazzman._lastFakeFrameTime = 0;

jazzman.MessageResult = function(values) {
    this.type = 'log';
    this.values = values;
    this.trace = new Error(); // todo: test better
};

jazzman.MessageResult.prototype.toString = function() {
    var text = "",
        i;
    
    for (i = 0; i < this.values.length; i++) {
        if (i > 0) {
            text += " ";
        }
        
        if (jazzman.isString(this.values[i])) {
            text += this.values[i];
        }
        else {
            text += jazzman.pp(this.values[i]);
        }
    }
    
    return text;
};

jazzman.ErrorResult = function(params) {
    this.type = 'error';
    this.message = params.message || 'Error.';
    
    if (params.trace) {
        this.trace = params.trace;
    }
};

jazzman.ErrorResult.prototype.toString = function() {
    return this.message;
};

jazzman.ErrorResult.prototype.passed = function() {
    return false;
};

jazzman.ExpectationResult = function(params) {
    this.type = 'expect';
    this.matcherName = params.matcherName;
    this._passed = params.passed;
    this.message = this._passed ? 'Passed.' : params.message;
    
    if (!this._passed || params.keepPassed) {
        this.expected = params.expected;
        this.actual = params.actual;
    }
    
    this.error = this._passed ? '' : (params.error || '');
    this.trace = this._passed ? '' : (params.trace || '');
};

jazzman.ExpectationResult.prototype.toString = function() {
    return this.message;
};

jazzman.ExpectationResult.prototype._passed = function() {
    return this._passed;
};

jazzman.ExpectationResult.prototype.passed = function() {
    return this._passed;
};

/**
 * Getter for the jazzman environment. Ensures one gets created
 */
jazzman.getEnv = function() {
    return jazzman.env;
};

/**
 * @ignore
 * @private
 * @param value
 * @returns {Boolean}
 */
jazzman.isArray = function(value) {
    return jazzman._isA("Array", value);
};

/**
 * @ignore
 * @private
 * @param value
 * @returns {Boolean}
 */
jazzman.isString = function(value) {
    return jazzman._isA("String", value);
};

/**
 * @ignore
 * @private
 * @param value
 * @returns {Boolean}
 */
jazzman.isNumber = function(value) {
    return jazzman._isA("Number", value);
};

/**
 * @ignore
 * @private
 * @param {String} typeName
 * @param value
 * @returns {Boolean}
 */
jazzman._isA = function(typeName, value) {
    return Object.prototype.toString.apply(value) === '[object ' + typeName + ']';
};

/**
 * Pretty printer for expectations. Takes any object and turns it into a human-readable string.
 *
 * @param {Object} value an object to be outputted
 * @param {Number} [depth] Optional nested object depth
 *
 * @returns {String}
 */
jazzman.pp = function(value, depth) {
    var stringPrettyPrinter = new jazzman.StringPrettyPrinter(depth);
    
    stringPrettyPrinter.format(value);
    
    return stringPrettyPrinter.string;
};

/**
 * Returns true if the object is a DOM Node.
 *
 * @param {Object} obj object to check
 * @returns {Boolean}
 */
jazzman.isDomNode = function(obj) {
    return obj.nodeType > 0;
};

/**
 * Returns a matchable 'generic' object of the class type.  For use in expecations of type when values don't matter.
 *
 * @example
 * // don't care about which function is passed in, as long as it's a function
 * expect(mySpy).toHaveBeenCalledWith(jazzman.any(Function));
 *
 * @param {Class} clazz
 * @returns matchable object of the type clazz
 */
jazzman.any = function(clazz) {
    return new jazzman.Matchers.Any(clazz);
};

/**
 * Returns a matchable subset of a JSON object. For use in expectations when you don't care about all of the
 * attributes on the object.
 *
 * @example
 * // don't care about any other attributes than foo.
 * expect(mySpy).toHaveBeenCalledWith(jazzman.objectContaining({foo: "bar"});
 *
 * @param sample {Object} sample
 * @returns matchable object for the sample
 */
jazzman.objectContaining = function(sample) {
    return new jazzman.Matchers.ObjectContaining(sample);
};

/**
 * jazzman Spies are test doubles that can act as stubs, spies, fakes or when used in an expectation,
 * mocks.
 *
 * Spies should be created in test setup, before expectations.  They can then be checked,
 * using the standard jazzman expectation syntax. Spies can be checked if they were called or not
 * and what the calling params were.
 *
 * A Spy has the following fields: wasCalled, callCount, mostRecentCall, and argsForCall (see docs).
 *
 * Spies are torn down at the end of every spec.
 *
 * Note: Do <b>not</b> call new jazzman.Spy() directly - a spy must be created using spyOn,
 * jazzman.createSpy or jazzman.createSpyObj.
 *
 * @example
 * // a stub
 * var myStub = jazzman.createSpy('myStub');  // can be used anywhere
 *
 * // spy example
 * var foo = {
 *   not: function(bool) { return !bool; }
 * }
 *
 * // actual foo.not will not be called, execution stops
 * spyOn(foo, 'not');

 // foo.not spied upon, execution will continue to implementation
 * spyOn(foo, 'not').andCallThrough();
 *
 * // fake example
 * var foo = {
 *   not: function(bool) { return !bool; }
 * }
 *
 * // foo.not(val) will return val
 * spyOn(foo, 'not').andCallFake(function(value) {return value;});
 *
 * // mock example
 * foo.not(7 == 7);
 * expect(foo.not).toHaveBeenCalled();
 * expect(foo.not).toHaveBeenCalledWith(true);
 *
 * @constructor
 * @see spyOn, jazzman.createSpy, jazzman.createSpyObj
 * @param {String} name
 */
jazzman.Spy = function(name) {
    this.identity = name || 'unknown';
    this.isSpy = true;
    
    // The actual function this spy stubs.
    this.plan = jazzman.emptyFn;
    
    /**
     * Tracking of the most recent call to the spy.
     * @example
     * var mySpy = jazzman.createSpy('foo');
     * mySpy(1, 2);
     * mySpy.mostRecentCall.args = [1, 2];
     */
    this.mostRecentCall = {};
    
    /**
     * Holds arguments for each call to the spy, indexed by call count
     * @example
     * var mySpy = jazzman.createSpy('foo');
     * mySpy(1, 2);
     * mySpy(7, 8);
     * mySpy.mostRecentCall.args = [7, 8];
     * mySpy.argsForCall[0] = [1, 2];
     * mySpy.argsForCall[1] = [7, 8];
     */
    this.argsForCall = [];
    this.calls = [];
};

/**
 * Tells a spy to call through to the actual implemenatation.
 *
 * @example
 * var foo = {
 *   bar: function() { // do some stuff }
 * }
 *
 * // defining a spy on an existing property: foo.bar
 * spyOn(foo, 'bar').andCallThrough();
 */
jazzman.Spy.prototype.andCallThrough = function() {
    this.plan = this.originalValue;
    
    return this;
};

/**
 * For setting the return value of a spy.
 *
 * @example
 * // defining a spy from scratch: foo() returns 'baz'
 * var foo = jazzman.createSpy('spy on foo').andReturn('baz');
 *
 * // defining a spy on an existing property: foo.bar() returns 'baz'
 * spyOn(foo, 'bar').andReturn('baz');
 *
 * @param {Object} value
 */
jazzman.Spy.prototype.andReturn = function(value) {
    this.plan = function() {
        return value;
    };
    
    return this;
};

/**
 * For throwing an exception when a spy is called.
 *
 * @example
 * // defining a spy from scratch: foo() throws an exception w/ message 'ouch'
 * var foo = jazzman.createSpy('spy on foo').andThrow('baz');
 *
 * // defining a spy on an existing property: foo.bar() throws an exception w/ message 'ouch'
 * spyOn(foo, 'bar').andThrow('baz');
 *
 * @param {String} exceptionMsg
 */
jazzman.Spy.prototype.andThrow = function(exceptionMsg) {
    this.plan = function() {
        throw exceptionMsg;
    };
    
    return this;
};

/**
 * Calls an alternate implementation when a spy is called.
 *
 * @example
 * var baz = function() {
 *   // do some stuff, return something
 * }
 * // defining a spy from scratch: foo() calls the function baz
 * var foo = jazzman.createSpy('spy on foo').andCall(baz);
 *
 * // defining a spy on an existing property: foo.bar() calls an anonymnous function
 * spyOn(foo, 'bar').andCall(function() { return 'baz';} );
 *
 * @param {Function} fakeFunc
 */
jazzman.Spy.prototype.andCallFake = function(fakeFunc) {
    this.plan = fakeFunc;
    
    return this;
};

/**
 * Resets all of a spy's the tracking variables so that it can be used again.
 *
 * @example
 * spyOn(foo, 'bar');
 *
 * foo.bar();
 *
 * expect(foo.bar.callCount).toEqual(1);
 *
 * foo.bar.reset();
 *
 * expect(foo.bar.callCount).toEqual(0);
 */
jazzman.Spy.prototype.reset = function() {
    this.wasCalled = false;
    this.callCount = 0;
    this.argsForCall = [];
    this.calls = [];
    this.mostRecentCall = {};
};

jazzman.Spy.callSequence = 0;

jazzman.createSpy = function(name) {
    var spyObj,
        spy = new jazzman.Spy(name),
        emptyArgs = [],
        prop;

    spyObj = function() {
        var callIndex = spyObj.callCount,
            args = arguments.length ? jazzman.util.argsToArray(arguments) : emptyArgs,
            result, doAfter;

        spyObj.callSequence = jazzman.Spy.callSequence++;
        spyObj.wasCalled = true;
        spyObj.callCount++;
        spyObj.mostRecentCall.object = spyObj.mostRecentCall.scope = this;
        spyObj.mostRecentCall.args = args;

        // N.B.: This is where the original function is called. Careful stepping through!
        spyObj.mostRecentCall.result = result = spyObj.plan.apply(this, arguments);

        spyObj.argsForCall[callIndex] = args;
        
        spyObj.calls[callIndex] = { object: this, scope: this, args: args, result: result };

        // Call any configured follow on unless it's too late.
        // Used in waitsForSpy.
        doAfter = spyObj.doAfter;
        
        if (doAfter) {
            spyObj.doAfter = null;
            delete spyObj.doAfter;
            
            doAfter();
        }

        return result;
    };
    
    for (prop in spy) {
        spyObj[prop] = spy[prop];
    }
    
    // We don't want spies to be cleaned up in Base destructor
    spyObj.$noClearOnDestroy = true;
    
    spyObj.reset();
    
    return spyObj;
};

/**
 * Determines whether an object is a spy.
 *
 * @param {jazzman.Spy|Object} putativeSpy
 * @returns {Boolean}
 */
jazzman.isSpy = function(putativeSpy) {
    return putativeSpy && putativeSpy.isSpy;
};

/**
 * Creates a more complicated spy: an Object that has every property a function that is a spy.
 * Used for stubbing something large in one call.
 *
 * @param {String} baseName name of spy class
 * @param {Array} methodNames array of names of methods to make spies
 */
jazzman.createSpyObj = function(baseName, methodNames) {
    var obj = {},
        i;
    
    if (!jazzman.isArray(methodNames) || methodNames.length === 0) {
        throw new Error('createSpyObj requires a non-empty array of method names to create spies for');
    }
    
    for (i = 0; i < methodNames.length; i++) {
        obj[methodNames[i]] = jazzman.createSpy(baseName + '.' + methodNames[i]);
    }
    
    return obj;
};

/**
 * All parameters are pretty-printed and concatenated together, then written
 * to the current spec's output.
 *
 * Be careful not to leave calls to <code>jazzman.log</code> in production code.
 */
jazzman.log = function() {
    var spec = jazzman.env.currentSpec;
    
    spec.log.apply(spec, arguments);
};

/**
 * Creates a jazzman spec that will be added to the current suite.
 *
 * // TODO: pending tests
 *
 * @example
 * it('should be true', function() {
 *   expect(true).toEqual(true);
 * });
 *
 * @param {String} desc description of this specification
 * @param {Function} func defines the preconditions and expectations of the spec
 * @param {Object} [options] Options specific to this spec
 * @param {Number} [options.timeout] Override for global jazzman.DEFAULT_WATCHDOG_INTERVAL
 * @param {Boolean} [options.disableTryCatch] Override for global jazzman.CATCH_EXCEPTIONS
 */
jazzman.getGlobal().it = function(desc, func, options) {
    return jazzman.env.it(desc, func, options);
};

/**
 * Creates a *disabled* jazzman spec.
 *
 * A convenience method that allows existing specs to be disabled temporarily during development.
 *
 * @param {String} desc description of this specification
 * @param {Function} func defines the preconditions and expectations of the spec
 * @param {Object} [options] Options specific to this spec
 */
jazzman.getGlobal().xit = function(desc, func, options) {
    return jazzman.env.it(desc, func, options).disable();
};

/**
 * Creates a jazzman spec for an object.
 */
jazzman.getGlobal().specFor = function(object, specForFn) {
    jazzman.env.specFor(object, specForFn);
};

/**
 * Creates a *disabled* jazzman spec for an object.
 */
jazzman.getGlobal().xspecFor = function(object, specForFn) {
    jazzman.env.xspecFor(object, specForFn);
};

/**
 * Function that installs a spy on an existing object's method name. 
 * Used within a Spec to create a spy.
 *
 * @example
 * // spy example
 * var foo = {
 *   not: function(bool) { return !bool; }
 * }
 * spyOn(foo, 'not'); // actual foo.not will not be called, execution stops
 *
 * @see jazzman.createSpy
 * @param obj
 * @param methodName
 * @return {jazzman.Spy} a jazzman spy that can be chained with all spy methods
 */
jazzman.getGlobal().spyOn = function(obj, methodName) {
    return jazzman.env.spyOn(obj, methodName);
};

/**
 * Starts a chain for a jazzman expectation.
 *
 * It is passed an Object that is the actual value and should chain to one of the many
 * jazzman.Matchers functions.
 *
 * @param {Object} actual Actual value to test against and expected value
 * @return {jazzman.Matchers}
 */
jazzman.getGlobal().expect = function(actual) {
    return jazzman.env.expect(actual);
};

/**
 * Defines part of a jazzman spec. Used in cominbination with waits or waitsFor
 * in asynchronous specs.
 *
 * @param {Function} func Function that defines part of a jazzman spec.
 */
jazzman.getGlobal().runs = function(func) {
    jazzman.env.runs(func);
};

jazzman.getGlobal().run = runs;

/**
 * Waits a fixed time period before moving to the next block.
 *
 * @deprecated Use waitsFor() instead
 * @param {Number} timeout milliseconds to wait
 */
jazzman.getGlobal().waits = function(timeout) {
    jazzman.env.waits(timeout);
};

jazzman.getGlobal().wait = waits;

/**
 * Waits for the latchFunction to return true before proceeding to the next block.
 *
 * @param {Function} latchFunction
 * @param {String} timeoutMessage
 * @param {Number} timeout
 * @param {Number} timeout_increment
 */
jazzman.getGlobal().waitsFor = function() {
    jazzman.env.waitsFor.apply(jazzman.env, arguments);
};

jazzman.getGlobal().waitFor = waitsFor;

/**
 * Waits for the Spy to have been called before proceeding to the next block.
 *
 * @param {jazzman.Spy} spy to wait for
 * @param {String} [timeoutMessage] Optional timeout message
 * @param {Number} [timeout] Optional timeout in ms
 */
jazzman.getGlobal().waitsForSpy = function() {
    return jazzman.env.waitsForSpy.apply(jazzman.env, arguments);
};

jazzman.getGlobal().waitForSpy = waitsForSpy;

jazzman.getGlobal().waitsForSpyCalled = function(spy, timeoutMessage, timeout) {
    waitsForSpy(spy, timeoutMessage, timeout);
    
    runs(function() {
        expect(spy).toHaveBeenCalled();
    });
};

jazzman.getGlobal().waitForSpyCalled = jazzman.getGlobal().waitsForSpyCalled;

jazzman.getGlobal().spyOnEvent = jazzman.spyOnEvent = function(object, eventName, fn) {
    var obj = {
            fn: fn || jazzman.emptyFn
        },
        spy;
    
    spy = spyOn(obj, "fn").andCallThrough();
    object.addListener(eventName, obj.fn);
    
    return spy;
};

/**
 * Works just like waits() and waitsFor(), except waits for the next animationFrame.
 * Must wait an extra while for platforms which do not have RAF and which
 * just wait on a 16ms timer.
 */
jazzman.getGlobal().waitsForAnimation = function() {
    var setTimeout = jazzman._setTimeout,
        requestAnimationFrame = jazzman._requestAnimationFrame;

    waitsFor(function(done) {
        var doneCalled = false;

        requestAnimationFrame(function() {
            if (!doneCalled) {
                doneCalled = true;
                setTimeout(done, 1);
            }
        });

        // Set a secondary timeout in case the animation frame does not fire.
        // On iOS simulation devices animation frames can be indefinitely delayed,
        // so ensure that we signal done eventually.
        setTimeout(function() {
            if (!doneCalled) {
                doneCalled = true;
                done();
            }
        }, 60);
    }, 'animation frame to fire');
};

/**
 * A function that is called before each spec in a suite.
 *
 * Used for spec setup, including validating assumptions.
 *
 * @param {Function} beforeEachFunction
 */
jazzman.getGlobal().beforeEach = function(beforeEachFunction) {
    jazzman.env.beforeEach(beforeEachFunction);
};

/**
 * A function that is called before all specs and `beforeEach` functions
 * in a suite, and only once per suite. Use this function for setup
 * when individual specs can safely share the test subject.
 *
 * See also the corresponding {@link #afterAll}.
 *
 * @param {Function} beforeAllFunction
 */
jazzman.getGlobal().beforeAll = function(beforeAllFunction) {
    jazzman.env.beforeAll(beforeAllFunction);
};

/**
 * A function that is called after each spec in a suite.
 *
 * Used for restoring any state that is hijacked during spec execution.
 *
 * @param {Function} afterEachFunction
 */
jazzman.getGlobal().afterEach = function(afterEachFunction) {
    jazzman.env.afterEach(afterEachFunction);
};

/**
 * A function that is called after all specs and `afterEach` functions
 * in a suite, and only once per suite. Use this function for tear down
 * of any resources allocated in `beforeAll`.
 *
 * See also corresponding {@link #beforeAll}.
 *
 * @param {Function} afterAllFunction
 */
jazzman.getGlobal().afterAll = function(afterAllFunction) {
    jazzman.env.afterAll(afterAllFunction);
};

/**
 * A "keyword" that inverts the meaning of the suite or spec that immediately
 * follows, to allow writing specs for cases not yet implemented, or not yet
 * working, or never expected to pass. This "keyword" function accepts an optional
 * Boolean condition value, or a function that should return a value; when the value
 * is `true` (or omitted), the following spec or suite is considered "to do".
 *
 * A "to do" spec **will be executed** but its result is reverted: when one or more
 * expectations in a "to do" spec are not met and the spec fails, that is considered
 * a success because the code under test is "to be implemented". However when all
 * expectations are met and the spec succeeds, such result is considered *a failure*
 * and the spec will be failed with corresponding error, on the premise that something
 * could possibly go wrong and somebody should look into that.
 *
 * Suites marked as "to do" behave in a similar way: all enabled specs are duly executed,
 * and if at least one of them fails that is considered normal. However if all specs
 * within the "to do" suite pass, that is considered a failure.
 *
 * When the condition is `false`, that means that the following spec or suite
 * should be considered implemented and working, and result inversion logic
 * is *not* applied. In effect, `toDo(false, "foo")` is equivalent to not having
 * `toDo` prefix at all.
 *
 * If an optional description is given, it will be attached to the tests that
 * wrongly pass in a toDo suite or spec.
 *
 * Suites or specs marked as "to do" and disabled with xdescribe() and xit()
 * will not be executed.
 *
 * Example usage:
 *
 *      toDo(). // Defaults to `true`
 *      describe('foo', function() {
 *          ...
 *      });
 *
 *      toDo("Not yet implemented").
 *      describe("new feature", function() {
 *          ...
 *      });
 *
 *      toDo(!window.addEventListener, 'IE8 and below are not supported').
 *      it('bar', function() {
 *          ...
 *      });
 *
 * Note that by convention, toDo() call should precede the suite or spec
 * without indenting it. This allows minimal changes to the code when
 * the pending functionality is implemented and toDo() prefix is removed.
 *
 * Parameters are recognized in any order, for convenience.
 *
 * @param {Boolean/Function} [condition=true] The condition that should be met
 * for the following suite or spec to be considered "to do". If the condition
 * is `false`, the suite or spec will behave in a normal way.
 *
 * @param {String} [description] Optional description for "to do".
 *
 */
jazzman.getGlobal().toDo = function() {
    return jazzman.env.toDo.apply(jazzman.env, arguments);
};

// People tend to forget the case, and TODO() might be easier to find.
jazzman.getGlobal().todo = jazzman.getGlobal().toDo;
jazzman.getGlobal().TODO = jazzman.getGlobal().toDo;

/**
 * Defines a top suite of unit tests for a particular module. Spec definitions
 * will be processed after optional module requirements are met.
 *
 * @param {String} description Name of the suite, usually the class under test.
 * @param {String/String[]} [requirements] The list of classes to load before
 * processing spec definitions. If this argument is omitted, and `description`
 * matches {@link jazzman.TOP_DESCRIBE_PREFIX} expression, then description
 * is assumed to be the class name to require.
 * @param {Function} specDefinitions Function that defines specs and suites
 *
 * Example:
 *
 *      // Require Ext.panel.Panel before defining specs for it
 *      topSuite("Ext.panel.Panel", function() {
 *          ...
 *      });
 *      
 *      // Explicitly list dependencies
 *      topSuite("grid-general", ["Ext.grid.Panel", "Ext.data.ProxyStore"],
 *      function() {
 *          ...
 *      });
 * 
 */
jazzman.getGlobal().topSuite = function() {
    return jazzman.env.topSuite.apply(jazzman.env, arguments);
};

jazzman.getGlobal().xtopSuite = jazzman.emptyFn;

/**
 * Defines a suite of specifications.
 *
 * Stores the description and all defined specs in the jazzman environment as one suite of specs.
 * Variables declared are accessible by calls to beforeEach, it, and afterEach. Describe blocks
 * can be nested, allowing for specialization of setup in some tests.
 *
 * @example
 *
 *      describe("this should work", function() {
 *          beforeEach(function() {
 *              setUpForTests();
 *          });
 *          
 *          it("should be true", function() {
 *              expect(true).toBe(true);
 *          });
 *      });
 *      
 *      describe("this should work, too", function() {
 *          beforeEach(function() {
 *              doSomethingBeforeEachSpec();
 *          });
 *          
 *          it("should be false", function() {
 *              expect(false).toBe(false);
 *          });
 *          
 *          describe("nested suite", function() {
 *              beforeEach(function() {
 *                  doSomethingBeforeEachSpecInThisSuiteOnly();
 *              });
 *              
 *              it("should be obvious", function() {
 *                  expect(42 === 42).toBeTruthy();
 *              });
 *          });
 *      });
 *
 * @param {String} description A string, usually the class under test.
 * @param {Function} specDefinitions function that defines several specs and/or nested suites.
 */
jazzman.getGlobal().describe = function(description, specDefinitions) {
    var env = jazzman.env;
    
    if (env.currentSuite.isRootSuite && specDefinitions.enabled !== false) {
        return env.topSuite(description, '*', specDefinitions);
    }
    else {
        return env.describe(description, specDefinitions);
    }
};

/**
 * Disables a suite of specifications.  Used to disable some suites in a file, or files,
 * temporarily during development.
 *
 * @param {String} description A string, usually the class under test.
 * @param {Function} specDefinitions function that defines several specs.
 */
jazzman.getGlobal().xdescribe = function(description, specDefinitions) {
    // The reason we do it this way instead of passing as an argument is backward compat.
    // There are some ancient suites that pass extra arguments to describe(), which may
    // accidentally disable otherwise runnable suites.
    specDefinitions.enabled = false;
    
    return describe(description, specDefinitions);
};

jazzman.debuggerStatement = function(e) {
    // See the exception variable below
    // eslint-disable-next-line no-unused-vars
    var exception = e.message;
    
    debugger;
};

/**
 * @namespace
 */
jazzman.util = {};

jazzman.util.now = (typeof Date.now === 'function')
    ? Date.now
    : function now() {
        return new Date().getTime();
    };

/**
 * Declare that a child class inherit it's prototype from the parent class.
 *
 * @private
 * @param {Function} childClass
 * @param {Function} parentClass
 */
jazzman.util.inherit = function(childClass, parentClass) {
    /**
     * @private
     */
    var subclass = function() {};
    
    subclass.prototype = parentClass.prototype;
    childClass.prototype = new subclass();
};

jazzman.util.getOrigin = function() {
    var port = window.location.port,
        origin;

    origin = window.location.protocol + "//" + window.location.hostname;

    if (port) {
        origin += ":" + port;
    }

    return origin;
};

jazzman.util.getFileFromContextMapping = function(file) {
    var contextMapping = jazzman.contextMapping,
        origin, context;
    
    if (file && contextMapping) {
        origin = jazzman.util.getOrigin();
        
        for (context in contextMapping) {
            file = file.replace(origin + context, contextMapping[context]);
        }
    }
    
    return file;
};

jazzman.util.formatException = function(e) {
    var lineNumber, file, message;
    
    if (e.line) {
        lineNumber = e.line;
    }
    else if (e.lineNumber) {
        lineNumber = e.lineNumber;
    }
    
    if (e.sourceURL) {
        file = e.sourceURL;
    }
    else if (e.fileName) {
        file = e.fileName;
    }
    
    file = jazzman.util.getFileFromContextMapping(file);
    
    message = (e.name && e.message) ? (e.name + ': ' + e.message) : e.toString();
    
    if (file && lineNumber) {
        message += ' in ' + file + ' (line ' + lineNumber + ')';
    }
    
    return message;
};

jazzman.util.htmlEscape = function(str) {
    if (!str) {
        return str;
    }
    
    // Avoid mangling &smth; HTML entities by matching only ampersand
    // characters *not* followed by either one or more word chars or
    // # and one or more digits, finished by semicolon
    return str.replace(/&(?!(?:#\d+|\w+);)/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');
};

jazzman.util.argsToArray = function(args) {
    var arrayOfArgs = [],
        i, len;
    
    for (i = 0, len = args.length; i < len; i++) {
        arrayOfArgs.push(args[i]);
    }
    
    return arrayOfArgs;
};

jazzman.util.extend = function(destination, source) {
    var property;
    
    for (property in source) {
        destination[property] = source[property];
    }
    
    return destination;
};

jazzman.util.isObjectEmpty = function(object) {
    var key;
    
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            return false;
        }
    }
    
    return true;
};

jazzman.util.hashString = function(s, hash) {
    var i, len;
    
    hash = hash || 0;
    
    // This is the fastest hashing algorithm of the "simple" bunch (in IE8)
    // http://jsperf.com/hashing-strings/53
    for (i = 0, len = s.length; i < len; i++) {
        hash = hash * 31 + s.charCodeAt(i);
        hash &= hash;
    }
    
    // Convert to unsigned
    return hash >>> 0;
};

/**
 * Basic browsers detection.
 */
jazzman.browser = (function() {
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
        isSafari3 = /safari/.test(ua.toLowerCase()) && /version\/3/.test(ua.toLowerCase()),
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
        isSafari3: isSafari3,
        isIOS: isIOS,
        isAndroid: isAndroid,
        isGecko: isGecko
    };
})();

jazzman.console = (function() {
    var slice = Array.prototype.slice;
        
    if (!jazzman.VERBOSE) {
        return {
            log: jazzman.emptyFn,
            warn: jazzman.emptyFn,
            error: jazzman.emptyFn,
            dir: jazzman.emptyFn
        };
    }
    else if (jazzman.browser.isIE9m) {
        return {
            log: function() {
                if (window.console) {
                    console.log(slice.apply(arguments).join(', '));
                }
            },
            warn: function() {
                if (window.console) {
                    console.warn(slice.apply(arguments).join(', '));
                }
            },
            error: function() {
                if (window.console) {
                    console.error(slice.apply(arguments).join(', '));
                }
            },
            dir: function() {
                if (window.console) {
                    if (console.dir) {
                        console.dir(arguments);
                    }
                    else {
                        console.log(slice.apply(arguments).join(', '));
                    }
                }
            }
        };
    }
    else {
        return {
            log: function() {
                if (window.console && window.console.log) {
                    console.log.apply(console, arguments);
                }
            },
            warn: function() {
                if (window.console && window.console.warn) {
                    console.warn.apply(console, arguments);
                }
            },
            error: function() {
                if (window.console && window.console.error) {
                    console.error.apply(console, arguments);
                }
            },
            dir: function() {
                if (window.console && window.console.dir) {
                    console.dir.apply(console, arguments);
                }
            }
        };
    }
})();

jazzman.array = {};

/**
 * Checks whether or not the specified item exists in the array.
 * Array.prototype.indexOf is missing in Internet Explorer, unfortunately.
 * We always have to use this static method instead for consistency.
 *
 * @param {Array} array The array to check
 * @param {Mixed} item The item to look for
 * @param {Number} from (Optional) The index at which to begin the search
 *
 * @return {Number} The index of item in the array (or -1 if it is not found)
 */
jazzman.array.indexOf = function(array, item, from) {
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
 *
 * @param {Array} array The array
 * @param {Mixed} item The item to remove
 *
 * @return {Array} The passed array itself
 */
jazzman.array.remove = function(array, item) {
    var index = this.indexOf(array, item);

    if (index > -1) {
        // Splicing is slow so we try faster option first
        if (index === array.length - 1) {
            array.length--;
        }
        else {
            array.splice(index, 1);
        }
    }
    
    return array;
};

/**
 * Convert array of items to a map: [1, 2] -> { 1: true, 2: true }
 * If the optional property is given, the value of that property on the
 * array item is used as the key:
 * [{ id: 'foo' }, { id: 'bar' }] ->  { foo: { id: 'foo' }, bar: { id: 'bar' } }
 *
 * @param {Array} items Array of items
 * @param {String} [property] Key property
 *
 * @return {Object} map of items
 */
jazzman.array.toMap = function(items, property) {
    var map = {},
        item, key, value, i, len;
    
    for (i = 0, len = items.length; i < len; i++) {
        item = items[i];
        
        if (property) {
            key = item[property];
            value = item;
        }
        else {
            key = item;
            value = true;
        }
        
        if (map[key] !== undefined && map[key] !== value) {
            jazzman.console.error('Whoa! Duplicate ' + property + ': ', key, value);
        }
        
        map[key] = value;
    }

    return map;
};

/**
 * Shuffle the source array into a copy and return the copy. This does not
 * modify the source array. This function uses the "inside out" version of
 * Fisher-Yates algorithm: https://en.wikipedia.org/wiki/Fisher–Yates_shuffle
 *
 * @param {Array} source Array to be shuffled
 *
 * @return {Array} Shuffled copy of the source.
 */
jazzman.array.shuffle = function(source) {
    var random = Math.random,
        floor = Math.floor,
        copy = [],
        i, j, len;
    
    for (i = 0, len = source.length; i < len; i++) {
        j = floor(random() * i);
        
        if (i !== j) {
            copy[i] = copy[j];
        }
        
        copy[j] = source[i];
    }
    
    return copy;
};

jazzman.object = {};

/**
 * Object.keys() polyfill with IE8- optimization
 */
jazzman.object.keys = (typeof Object.keys === 'function')
    ? Object.keys
    : (function() {
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        
        return function keys(object) {
            var keys = [],
                counter = 0,
                property;
            
            for (property in object) {
                if (hasOwnProperty.call(object, property)) {
                    keys[counter++] = property;
                }
            }
            
            return keys;
        };
    })();

jazzman.object.clone = (typeof Object.assign === 'function')
    ? (function() {
        return function clone(source) {
            var target = {};
            
            return Object.assign(target, source);
        };
    })()
    : (function() {
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        
        return function clone(source) {
            var target = {},
                property;
            
            for (property in source) {
                if (hasOwnProperty.call(source, property)) {
                    target[property] = source[property];
                }
            }
            
            return target;
        };
    })();

/**
 * Environment for jazzman
 *
 * @constructor
 */
jazzman.Env = function() {
    // We start not ready by default. Calling env.execute() will unblock readiness,
    // and we will proceed as usual unless something external blocked us additionally,
    // in which case we must wait until these external conditions are met.
    this.ready = false;
    this.readyBlockCounter = 1;
    this.readyCallbacks = [];
    this.testDependencies = {};
    
    // This is used to check suite/spec name collisions
    this.allTestNames = {};
    
    this._currentRunner = new jazzman.Runner(this);
    
    // Runner's root suite is the parentSuite for all
    this.currentSuite = this.rootSuite = this._currentRunner.rootSuite;
    this.currentSpec = null;
    this.suiteStack = [];
    
    this.totalSpecs = 0;
    this.remainingSpecs = 0;
    
    this.reporter = new jazzman.MultiReporter();
    
    this.updateInterval = jazzman.DEFAULT_UPDATE_INTERVAL;
    this.defaultTimeoutInterval = jazzman.DEFAULT_TIMEOUT_INTERVAL;
    this.keepPassedResults = jazzman.KEEP_PASSED_RESULTS;
    this.lastUpdate = 0;
    this.activeQueue = null;
    
    this.specFilter = this.topSuiteFilter = function() {
        return true;
    };
    
    this.describeQueue = new jazzman.Queue(this);
    this._nextSpecId = 0;
    this._nextSuiteId = 0;
    this._equalityTesters = [];
    this.startupHooks = [];
    this.teardownHooks = [];
    
    this.allowedGlobalVariables = {};
    this.allowedComponents = {};
    this.allowedListeners = {};
    this.importantElementInstances = [];
    this.allowedImportantElementInstanceMethods = {};
    this.allowedResourceStack = [];
    
    this.bodyScrolled = false;
    
    // eslint-disable-next-line vars-on-top
    var me = this;
    
    me.bodyScrollListener = function() {
        me.bodyScrolled = true;
    };
};

jazzman.Env.prototype.setTimeout = jazzman.setTimeout;
jazzman.Env.prototype.clearTimeout = jazzman.clearTimeout;
jazzman.Env.prototype.setInterval = jazzman.setInterval;
jazzman.Env.prototype.clearInterval = jazzman.clearInterval;

jazzman.Env.prototype.isReady = function() {
    return this.ready;
};

jazzman.Env.prototype.onReady = function(callback) {
    if (this.ready) {
        callback();
    }
    else {
        this.readyCallbacks.push(callback);
    }
};

jazzman.Env.prototype.blockReady = function() {
    if (!this.ready) {
        this.readyBlockCounter++;
    }
    else {
        throw "This jazzman environment has reached ready state before!";
    }
};

jazzman.Env.prototype.unblockReady = function() {
    if (!this.ready) {
        this.readyBlockCounter--;
        
        if (this.readyBlockCounter <= 0) {
            this.ready = true;
            this._runReadyCallbacks();
        }
    }
    else {
        throw "Mismatched call to jazzman.Env.unblockReady()";
    }
};

jazzman.Env.prototype._runReadyCallbacks = function() {
    var readyCallbacks = this.readyCallbacks,
        i, len, fn;
    
    for (i = 0, len = readyCallbacks.length; i < len; i++) {
        fn = readyCallbacks[i];
        
        if (fn) {
            fn();
            readyCallbacks[i] = null;
        }
    }
};

/**
 * @returns an object containing jazzman version build info, if set.
 */
jazzman.Env.prototype.version = function() {
    if (jazzman._version) {
        return jazzman._version;
    }
    else {
        throw new Error('Version not set');
    }
};

/**
 * @returns string containing jazzman version build info, if set.
 */
jazzman.Env.prototype.versionString = function() {
    var version, versionString;
    
    if (!jazzman._version) {
        return "version unknown";
    }
    
    version = this.version();
    versionString = version.major + "." + version.minor + "." + version.build;
    
    if (version.release_candidate) {
        versionString += ".rc" + version.release_candidate;
    }
    
    versionString += " revision " + version.revision;
    
    return versionString;
};

/**
 * @returns a sequential integer starting at 0
 */
jazzman.Env.prototype.nextSpecId = function() {
    return this._nextSpecId++;
};

/**
 * @returns a sequential integer starting at 0
 */
jazzman.Env.prototype.nextSuiteId = function() {
    return this._nextSuiteId++;
};

jazzman.Env.prototype.checkName = function(name) {
    var names = this.allTestNames;
    
    if (names) {
        if (names[name]) {
            return true;
        }
        
        names[name] = true;
    }
    
    return false;
};

/**
 * Register a reporter to receive status updates from jazzman.
 *
 * @param {jazzman.Reporter} reporter An object which will receive status updates.
 */
jazzman.Env.prototype.addReporter = function(reporter) {
    this.reporter.addReporter(reporter);
};

/**
 * Register a startup hook function that will be called before Env starts executing.
 * The function will be passed Env instance as the only argument.
 *
 * @param {Function} hook Function to call.
 */
jazzman.Env.prototype.addStartupHook = function(hook) {
    this.startupHooks.push(hook);
};

/**
 * Register a teardown hook function that will be called after Env stops executing.
 * The function will be passed Env instance as the only argument.
 *
 * @param {Function} hook Function to call.
 */
jazzman.Env.prototype.addTeardownHook = function(hook) {
    this.teardownHooks.push(hook);
};

jazzman.Env.prototype.setup = function(done) {
    var me = this;
    
    if (me.describeQueue) {
        me.runningDescribeQueue = true;
        
        me.reporter.reportEnvSetupStarting(me, function() {
            me.describeQueue.start(function() {
                me.runningDescribeQueue = false;
                
                // We don't need this anymore
                me.describeQueue = me.currentSuite = me.allTestNames = null;
                
                me.reporter.reportEnvSetupFinishing(me, function() {
                    if (done) {
                        me.setTimeout(done, 0);
                    }
                    
                    // eslint-disable-next-line no-cond-assign
                    if (done = me.setupDone) {
                        me.setTimeout(done, 0);
                    }
                });
            });
        });
    }
};

jazzman.Env.prototype.execute = function(testIds) {
    var me = this,
        deps = jazzman.object.keys(me.testDependencies),
        _next;

    // Studio may send file names in the testIds array. This function maps these file names
    // back to their top level suite id(s), and should only be invoked after the describe
    // queue has finished running.
    function getTestIds() {
        var rootSuiteIdsByFile, ids, id, suiteIds, i, ln;

        if (window.ST) {
            rootSuiteIdsByFile = window.ST.rootSuiteIdsByFile;

            if (testIds) {
                ids = [];
                
                for (i = 0, ln = testIds.length; i < ln; i++) {
                    id = testIds[i].toString();

                    if (id.substr(id.length - 3) === '.js') {
                        suiteIds = rootSuiteIdsByFile[id];

                        if (suiteIds) {
                            ids = ids.concat(suiteIds);
                        }
                    }
                    else {
                        ids.push(id);
                    }
                }

                return ids;
            }
        }

        return testIds;
    }
    
    _next = function() {
        var setupDone = function() {
            me._execute(getTestIds());
        };
        
        // We could be blocked only internally by the default counter in which case
        // it will unblock in the next statement. Otherwise we will wait for dependencies
        // to load, or some external condition to meet.
        me.onReady(function() {
            var queue = me.describeQueue;
            
            if (queue) {
                if (queue.isRunning()) {
                    me.setupDone = setupDone;
                }
                else {
                    me.setup(setupDone);
                }
            }
            else {
                setupDone();
            }
        });
        
        // Unblock the default not ready state set up in the Env constructor.
        jazzman.unblockReady();
    };
    
    // We wrap matchers this late to allow Jazzman extensions to inject
    // custom globally available matchers without having to define them
    // before Env object is created.
    this.matchersClass = function() {
        jazzman.Matchers.apply(this, arguments);
    };
    
    jazzman.util.inherit(this.matchersClass, jazzman.Matchers);
    
    jazzman.Matchers._wrapInto(jazzman.Matchers.prototype, this.matchersClass);
    
    if (deps.length) {
        jazzman.blockReady();
        
        me.reporter.reportDependencyLoadStarting(me, function() {
            jazzman.startLoadingDependencies(deps, function() {
                me.reporter.reportDependencyLoadFinishing(me, function() {
                    jazzman.unblockReady();
                });
            });
            
            _next();
        });
    }
    else {
        _next();
    }
};

jazzman.Env.prototype._execute = function(testIds) {
    var me = this,
        startupHooks = me.startupHooks,
        teardownHooks = me.teardownHooks,
        hook, i, len;
    
    // Prevent double dipping
    if (me.executing) {
        return;
    }
    
    me.executing = true;
    
    for (i = 0, len = startupHooks.length; i < len; i++) {
        hook = startupHooks[i];
        
        if (typeof hook === 'function') {
            hook(me);
        }
        
        // The hook function can be a closure that could potentially retain
        // a lot of objects. An ounce of preventive cleanup could be worth
        // a ton of RAM (especially when profiling code and hunting for leaks).
        hook = startupHooks[i] = null;
    }
    
    if (testIds) {
        me._currentRunner.filter(testIds);
    }
    
    me._currentRunner.execute(function() {
        for (i = 0, len = teardownHooks.length; i < len; i++) {
            hook = teardownHooks[i];
            
            if (typeof hook === 'function') {
                hook(me);
            }
            
            hook = teardownHooks[i] = null;
        }
    });
};

jazzman.Env.prototype.startQueueWatchdog = function(next) {
    var env = this,
        // Have to assign these to variables, otherwise some browsers
        // will barf at object context invocation
        setTimeout = jazzman._setTimeout,
        clearTimeout = jazzman._clearTimeout,
        watchdogTimeout = jazzman.DEFAULT_WATCHDOG_INTERVAL,
        watchdogFn;
    
    env.lastUpdate = jazzman.util.now();
    
    if (next) {
        env._watchdogNextFn = next;
    }
    
    watchdogFn = function() {
        if (env.watchdogTimer) {
            clearTimeout(env.watchdogTimer);
            env.watchdogTimer = null;
        }
        
        env.watchdogTimer = setTimeout(watchdogFn, watchdogTimeout);
        
        if ((jazzman.util.now() - env.lastUpdate) > watchdogTimeout) {
            if (env.activeQueue) {
                env.activeQueue.kick({
                    name: 'timeout',
                    message: 'Execution aborted after ' + watchdogTimeout + ' milliseconds'
                });
            }
            else {
                env.reporter.log('Execution watchdog timer invoked, no active queue found!');
                
                clearTimeout(env.watchdogTimer);
                next = next || env._watchdogNextFn;
                
                if (next) {
                    next();
                }
            }
        }
    };
    
    if (env.watchdogTimer) {
        clearTimeout(env.watchdogTimer);
        env.watchdogTimer = null;
    }
    
    env.watchdogTimer = setTimeout(watchdogFn, watchdogTimeout);
};

jazzman.startQueueWatchdog = function() {
    this.env.startQueueWatchdog();
};

jazzman.Env.prototype.stopQueueWatchdog = function(next) {
    // See above
    var setTimeout = jazzman._setTimeout,
        clearTimeout = jazzman._clearTimeout;
    
    clearTimeout(this.watchdogTimer);
    this.watchdogTimer = null;
    
    if (next) {
        setTimeout(next, 0);
    }
};

jazzman.stopQueueWatchdog = function() {
    this.env.stopQueueWatchdog();
};

jazzman.Env.prototype.startSuite = function(suite) {
    if (this.currentSuite) {
        this.suiteStack.push(this.currentSuite);
    }
    
    this.currentSuite = suite;
};

jazzman.Env.prototype.finishSuite = function(suite) {
    if (this.currentSuite === suite) {
        this.currentSuite = this.suiteStack.pop();
    }
    else {
        throw new Error("Mismatched suite: " + suite.getId());
    }
    
    if (this.activeQueue === suite.queue) {
        this.activeQueue = null;
    }
    else {
        throw new Error("Mismatched queue!");
    }
};

jazzman.Env.prototype.require = function(dependencies) {
    var reqs = this.testDependencies,
        i, len, req;
    
    // Save a bit of time
    if (reqs['*']) {
        return;
    }
    
    if (!jazzman.isArray(dependencies)) {
        dependencies = [dependencies];
    }
    
    for (i = 0, len = dependencies.length; i < len; i++) {
        req = dependencies[i];
        reqs[req] = true;
    }
};

jazzman.Env.prototype.toDo = function() {
    var me = this,
        len = arguments.length,
        condition, description, arg, i;
    
    if (len === 0) {
        condition = true;
    }
    else {
        for (i = 0; i < len; i++) {
            arg = arguments[i];
            
            if (typeof arg === 'string') {
                description = arg;
            }
            else if (typeof arg === 'function') {
                condition = arg;
            }
            else {
                condition = !!arg;
            }
        }
        
        if (condition === undefined) {
            condition = true;
        }
    }
    
    return new jazzman.ToDo(me, condition, description);
};

jazzman.Env.prototype.topSuite = function() {
    var desc, reqs, specs, suite, skipSelf;
    
    if (arguments.length === 2) {
        desc = reqs = arguments[0];
        specs = arguments[1];
    }
    else {
        desc = arguments[0];
        reqs = arguments[1];
        specs = arguments[2];
    }
    
    if (reqs !== false) {
        if (reqs !== '*') {
            if (!jazzman.isArray(reqs)) {
                reqs = [reqs];
            }
            
            if (reqs[0] === false) {
                skipSelf = true;
                reqs.shift();
            }
            
            if (!skipSelf && jazzman.TOP_SUITE_PREFIX.test(desc) &&
                jazzman.array.indexOf(reqs, desc) === -1) {
                reqs.unshift(desc);
            }
        }
        
        this.require(reqs);
    }
    
    suite = this.describe(desc, specs);
    
    return suite;
};

jazzman.Env.prototype.describe = function(desc, specDefinitions) {
    var me = this,
        declarationError = null,
        suite, parentSuite;
    
    if (!me.runningDescribeQueue) {
        me.describeQueue.add(
            new jazzman.Block(me, function() {
                me.describe.call(me, desc, specDefinitions);
            }, {
                fail: function(e) {
                    jazzman.console.error(e);
                }
            })
        );
        
        return;
    }
    
    parentSuite = me.currentSuite;
    
    // We only allow filtering top suites via filter function
    if (parentSuite.isRootSuite && !me.topSuiteFilter(desc)) {
        return;
    }
    
    // Try creating a suite first; this can throw an exception if something goes wrong.
    try {
        suite = new jazzman.Suite(this, desc, specDefinitions, parentSuite);
    }
    catch (e) {
        declarationError = e;
        
        // We need to create a suite in any case, to report the exception.
        // The new suite should NOT throw an exception even if identical name
        // is detected again - this is what the last argument is for.
        suite = new jazzman.Suite(me, desc + ' declaration exception', jazzman.emptyFn, parentSuite, true);
    }
    
    parentSuite.add(suite);
    
    if (parentSuite.ToDo && !specDefinitions.ToDo) {
        suite.ToDo = parentSuite.ToDo;
    }
    
    // currentSuite is what describe() and it() operate on so it needs to be set
    // BEFORE spec definition function is called!
    me.currentSuite = suite;
    
    // Now try to call the actual definitions, if the suite is valid
    if (!declarationError) {
        try {
            specDefinitions.call(suite);
        }
        catch (e) {
            declarationError = e;
        }
    }
    
    if (declarationError) {
        // We are explicitly enabling try/catch sequence for this spec only
        // because it's not very helpful when exceptions are allowed globally
        me.it("encountered a declaration exception", function() {
            throw declarationError;
        }, { disableTryCatch: false });
    }
    
    me.currentSuite = parentSuite;
    
    return suite;
};

jazzman.Env.prototype.spyOn = function(obj, methodName) {
    return this.currentSpec.spyOn(obj, methodName);
};

jazzman.Env.prototype.expect = function(actual) {
    return this.currentSpec.expect(actual);
};

jazzman.Env.prototype.runs = function(func, timeout, ensured) {
    (this.currentSpec || this.currentSuite).runs(func, timeout, ensured);
};

jazzman.Env.prototype.waits = function(timeout) {
    (this.currentSpec || this.currentSuite).waits(timeout);
};

jazzman.Env.prototype.waitsFor = function() {
    var runnable = this.currentSpec || this.currentSuite;
    
    runnable.waitsFor.apply(runnable, arguments);
};

jazzman.Env.prototype.waitsForSpy = (function() {
    var setTimeout = jazzman._setTimeout;
    
    return function(spy, message, timeout) {
        if (!jazzman.isSpy(spy)) {
            this.fail("Expected spy but got " + jazzman.pp(spy));
        }
        
        // Usually there's no point in specifying a message because default one with
        // spy identity will suffice, but providing a specific timeout is useful.
        if (typeof message === 'number') {
            timeout = message;
            message = null;
        }
    
        jazzman.env.waitsFor(function(done) {
            if (spy.wasCalled) {
                done();
            }
            else {
                // Need to unwind the stack in case the spy was a listener
                spy.doAfter = function() {
                    setTimeout(done, 1);
                };
            }
        }, message || (spy ? spy.identity : 'Unknown') + ' spy to fire', timeout);
    };
})();

jazzman.Env.prototype.waitsForEvent = function(source, event, message, timeout) {
    var runnable = this.currentSpec || this.currentSuite,
        block;
    
    if (source == null) {
        throw new Error("Expected event source but got " + source + " instead!");
    }
    
    if (!message) {
        if (source.$className) {
            message = source.$className;
        }
        else if (source.dom) {
            message = source.dom.tagName;
        }
        else if (source.tagName) {
            message = source.tagName;
        }
        else {
            message = 'Entity';
        }
        
        if (source.id) {
            message += '#' + source.id;
        }
        
        message += ' to fire "' + event + '" event';
    }

    timeout = timeout != null ? timeout : jazzman.DEFAULT_EVENT_TIMEOUT;
    
    block = new jazzman.WaitsForEventBlock(this, source, event, message, timeout, runnable);
    
    runnable.addToQueue(block);
};

jazzman.Env.prototype.currentRunner = function() {
    return this._currentRunner;
};

jazzman.Env.prototype.beforeEach = function(beforeEachFunction) {
    this.currentSuite.beforeEach(beforeEachFunction);
};

jazzman.Env.prototype.afterEach = function(afterEachFunction) {
    this.currentSuite.afterEach(afterEachFunction);
};

jazzman.Env.prototype.beforeAll = function(beforeAllFunction) {
    this.currentSuite.beforeAll(beforeAllFunction);
};

jazzman.Env.prototype.afterAll = function(afterAllFunction) {
    this.currentSuite.afterAll(afterAllFunction);
};

jazzman.Env.prototype.it = function(description, func, options) {
    return this.currentSuite.it(description, func, options);
};

jazzman.Env.prototype.specFor = function(object, specForFn) {
    var index = 0,
        property;

    for (property in object) {
        if (!object.hasOwnProperty(property)) {
            continue;
        }
        
        specForFn.call(this, property, object[property], index, object);
        index = index + 1;
    }
};

jazzman.Env.prototype.xspecFor = function(object, specForFn) {};

jazzman.Env.prototype._compareRegExps = function(a, b, mismatchKeys, mismatchValues) {
    if (a.source !== b.source) {
        mismatchValues.push("expected pattern /" + b.source + "/ is not equal to the pattern /" +
                            a.source + "/");
    }
    
    if (a.ignoreCase !== b.ignoreCase) {
        mismatchValues.push("expected modifier i was" + (b.ignoreCase ? " " : " not ") +
                            "set and does not equal the origin modifier");
    }
    
    if (a.global !== b.global) {
        mismatchValues.push("expected modifier g was" + (b.global ? " " : " not ") +
                            "set and does not equal the origin modifier");
    }
    
    if (a.multiline !== b.multiline) {
        mismatchValues.push("expected modifier m was" + (b.multiline ? " " : " not ") +
                            "set and does not equal the origin modifier");
    }
    
    if (a.sticky !== b.sticky) {
        mismatchValues.push("expected modifier y was" + (b.sticky ? " " : " not ") +
                            "set and does not equal the origin modifier");
    }
    
    return (mismatchValues.length === 0);
};

jazzman.Env.prototype._compareObjects = function(a, b, mismatchKeys, mismatchValues) {
    var property;
    
    if (a.__Jasmine_been_here_before__ === b && b.__Jasmine_been_here_before__ === a) {
        return true;
    }
    
    a.__Jasmine_been_here_before__ = b;
    b.__Jasmine_been_here_before__ = a;
    
    function hasKey(obj, keyName) {
        return obj !== null && obj[keyName] !== jazzman.undefined;
    }
    
    for (property in b) {
        if (!hasKey(a, property) && hasKey(b, property)) {
            mismatchKeys.push("expected has key '" + property + "', but missing from actual.");
        }
    }
    
    for (property in a) {
        if (!hasKey(b, property) && hasKey(a, property)) {
            mismatchKeys.push("expected missing key '" + property + "', but present in actual.");
        }
    }
    
    for (property in b) {
        if (property === '__Jasmine_been_here_before__') {
            continue;
        }
        
        if (!this._equals(a[property], b[property], mismatchKeys, mismatchValues)) {
            mismatchValues.push(
                "'" + property + "' was '" +
                (b[property] ? jazzman.util.htmlEscape(b[property].toString()) : b[property]) +
                "' in expected, but was '" +
                (a[property] ? jazzman.util.htmlEscape(a[property].toString()) : a[property]) +
                "' in actual."
            );
        }
    }
    
    if (jazzman.isArray(a) && jazzman.isArray(b) && a.length !== b.length) {
        mismatchValues.push("arrays were not the same length");
    }
    
    delete a.__Jasmine_been_here_before__;
    delete b.__Jasmine_been_here_before__;
    
    return (mismatchKeys.length === 0 && mismatchValues.length === 0);
};

jazzman.Env.prototype._equals = function(a, b, mismatchKeys, mismatchValues) {
    var equalityTesters = this._equalityTesters,
        i, len, equalityTester, result;
    
    mismatchKeys = mismatchKeys || [];
    mismatchValues = mismatchValues || [];

    for (i = 0, len = equalityTesters.length; i < len; i++) {
        equalityTester = this._equalityTesters[i];
        result = equalityTester(a, b, this, mismatchKeys, mismatchValues);
        
        if (result !== jazzman.undefined) {
            return result;
        }
    }

    if (a === b) {
        return true;
    }
    
    if (a === jazzman.undefined || a === null || b === jazzman.undefined || b === null) {
        // eslint-disable-next-line eqeqeq
        return (a == jazzman.undefined && b == jazzman.undefined);
    }
    
    if (jazzman.isDomNode(a) && jazzman.isDomNode(b)) {
        return a === b;
    }
    
    if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
    }
    
    if (a.jasmineMatches) {
        return a.jasmineMatches(b);
    }
    
    if (b.jasmineMatches) {
        return b.jasmineMatches(a);
    }
    
    if (a instanceof jazzman.Matchers.ObjectContaining) {
        return a.matches(b);
    }
    
    if (b instanceof jazzman.Matchers.ObjectContaining) {
        return b.matches(a);
    }
    
    if (jazzman.isString(a) && jazzman.isString(b)) {
        return (a === b);
    }
    
    if (jazzman.isNumber(a) && jazzman.isNumber(b)) {
        return (a === b);
    }
    
    if (a instanceof RegExp && b instanceof RegExp) {
        return this._compareRegExps(a, b, mismatchKeys, mismatchValues);
    }
    
    if (typeof a === "object" && typeof b === "object") {
        return this._compareObjects(a, b, mismatchKeys, mismatchValues);
    }
    
    // Straight check
    return (a === b);
};

jazzman.Env.prototype._contains = function(haystack, needle) {
    var i;
    
    if (jazzman.isArray(haystack)) {
        for (i = 0; i < haystack.length; i++) {
            if (this._equals(haystack[i], needle)) {
                return true;
            }
        }
        
        return false;
    }
    
    return haystack.indexOf(needle) >= 0;
};

jazzman.Env.prototype.addEqualityTester = function(equalityTester) {
    this._equalityTesters.push(equalityTester);
};

jazzman.getGlobal().addGlobal = function(property) {
    jazzman.env.addAllowedGlobalVariable(property);
};

jazzman.Env.prototype.addAllowedGlobalVariable = function(property) {
    var allowedGlobals = this.allowedGlobalVariables,
        i, len;
    
    if (property.charAt) { // string
        allowedGlobals[property] = true;
    }
    else {
        for (i = 0, len = property.length; i < len; i++) {
            allowedGlobals[property[i]] = true;
        }
    }
};

/**
 * @constructor
 * @param {jazzman.Env} env
 * @param actual
 * @param {jazzman.Spec} spec
 */
jazzman.Matchers = function(env, actual, spec, opt_isNot) {
    this.env = env;
    this.actual = actual;
    this.spec = spec;
    this.isNot = opt_isNot || false;
};

jazzman.Matchers._wrapInto = function(prototype, matchersClass) {
    var methodName, orig;
    
    for (methodName in prototype) {
        if (methodName === 'report') {
            continue;
        }
        
        orig = prototype[methodName];
        matchersClass.prototype[methodName] = jazzman.Matchers._matcherFn(methodName, orig);
    }
};

jazzman.Matchers._matcherFn = function(matcherName, matcherFunction) {
    return function() {
        var matcherArgs, result, message, englishyPredicate, expectationResult, i, len;
        
        matcherArgs = jazzman.util.argsToArray(arguments);
        
        // N.B.: This is where matching happens. Careful stepping through!
        result = matcherFunction.apply(this, arguments);
        
        if (this.isNot) {
            result = !result;
        }
        
        if (result) {
            message = this.message;
        }
        else {
            if (this.message) {
                if (typeof this.message === 'function') {
                    message = this.message.apply(this, arguments);
                }
                else {
                    message = this.message;
                }
                
                if (jazzman.isArray(message)) {
                    message = message[this.isNot ? 1 : 0];
                }
            }
            else {
                englishyPredicate = matcherName.replace(/[A-Z]/g, function(s) {
                    return ' ' + s.toLowerCase();
                });
                
                message = "Expected " + jazzman.pp(this.actual) + (this.isNot ? " not " : " ") +
                          englishyPredicate;
                
                if (matcherArgs.length > 0) {
                    for (i = 0, len = matcherArgs.length; i < len; i++) {
                        if (i > 0) {
                            message += ",";
                        }
                        
                        message += " " + jazzman.pp(matcherArgs[i]);
                    }
                }
                
                message += ".";
            }
        }
        
        expectationResult = new jazzman.ExpectationResult({
            keepPassed: this.spec.env.keepPassedResults,
            matcherName: matcherName,
            passed: result,
            expected: matcherArgs.length > 1 ? matcherArgs : matcherArgs[0],
            actual: this.actual,
            message: message
        });
        
        this.spec.addMatcherResult(expectationResult);
        
        if (!result && jazzman.BREAK_ON_FAIL) {
            // Stepping out from here will come up in the spec function body,
            // or within a runs() block. This might be the last statement in that block!
            debugger;
        }
        
        return result;
    };
};

/**
 * toBe: compares the actual to the expected using ===
 * @param expected
 */
jazzman.Matchers.prototype.toBe = function(expected) {
    return this.actual === expected;
};

/**
 * toEqual: compares the actual to the expected using common sense equality. Handles Objects, Arrays, etc.
 *
 * @param expected
 */
jazzman.Matchers.prototype.toEqual = function(expected) {
    return this.env._equals(this.actual, expected);
};

/**
 * Matcher that compares the actual to the expected using a regular expression.  Constructs a RegExp, so takes
 * a pattern or a String.
 *
 * @param expected
 */
jazzman.Matchers.prototype.toMatch = function(expected) {
    return new RegExp(expected).test(this.actual);
};

/**
 * Matcher that compares the actual to jazzman.undefined.
 */
jazzman.Matchers.prototype.toBeDefined = function() {
    return (this.actual !== jazzman.undefined);
};

/**
 * Matcher that compares the actual to jazzman.undefined.
 */
jazzman.Matchers.prototype.toBeUndefined = function() {
    return (this.actual === jazzman.undefined);
};

/**
 * Matcher that compares the actual to null.
 */
jazzman.Matchers.prototype.toBeNull = function() {
    return (this.actual === null);
};

/**
 * Matcher that compares the actual to NaN.
 */
jazzman.Matchers.prototype.toBeNaN = function() {
    this.message = "Expected " + jazzman.pp(this.actual) + " to be NaN.";

    return (this.actual !== this.actual);
};

/**
 * Matcher that boolean not-nots the actual.
 */
jazzman.Matchers.prototype.toBeTruthy = function() {
    return !!this.actual;
};

/**
 * Matcher that boolean nots the actual.
 */
jazzman.Matchers.prototype.toBeFalsy = function() {
    return !this.actual;
};

/**
 * Matcher that checks to see if the actual, a jazzman spy, was called.
 */
jazzman.Matchers.prototype.toHaveBeenCalled = function() {
    if (arguments.length > 0) {
        throw new Error('toHaveBeenCalled does not take arguments, use toHaveBeenCalledWith');
    }
    
    if (!jazzman.isSpy(this.actual)) {
        throw new Error('Expected a spy, but got ' + jazzman.pp(this.actual) + '.');
    }
    
    this.message = [
        "Expected spy " + this.actual.identity + " to have been called.",
        "Expected spy " + this.actual.identity + " not to have been called."
    ];
    
    return this.actual.wasCalled;
};

/**
 * Matcher that checks to see if the actual, a jazzman spy, was called with a set of parameters.
 *
 */
jazzman.Matchers.prototype.toHaveBeenCalledWith = function() {
    var expectedArgs = jazzman.util.argsToArray(arguments),
        invertedMessage, positiveMessage;
    
    if (!jazzman.isSpy(this.actual)) {
        throw new Error('Expected a spy, but got ' + jazzman.pp(this.actual) + '.');
    }
    
    this.message = function() {
        positiveMessage = "";
        invertedMessage = "Expected spy " + this.actual.identity +
                          " not to have been called with " + jazzman.pp(expectedArgs) +
                          " but it was.";
        
        if (this.actual.callCount === 0) {
            positiveMessage = "Expected spy " + this.actual.identity +
                              " to have been called with " + jazzman.pp(expectedArgs) +
                              " but it was never called.";
        }
        else {
            positiveMessage = "Expected spy " + this.actual.identity +
                              " to have been called with " + jazzman.pp(expectedArgs) +
                              " but actual calls were " +
                              jazzman.pp(this.actual.argsForCall).replace(/^\[ | \]$/g, '');
        }
        
        return [positiveMessage, invertedMessage];
    };
    
    return this.env._contains(this.actual.argsForCall, expectedArgs);
};

/**
 * Matcher that checks that the expected item is an element in the actual Array.
 *
 * @param {Object} expected
 */
jazzman.Matchers.prototype.toBeIn = function(expected) {
    return this.env._contains(expected, this.actual);
};

/**
 * Matcher that checks that the expected item is an element in the actual Array.
 *
 * @param {Object} expected
 */
jazzman.Matchers.prototype.toContain = function(expected) {
    return this.env._contains(this.actual, expected);
};

/**
 * Check that the actual value is less than expected.
 * Synomym: `toBeLT`
 *
 * @param {Number} expected
 */
jazzman.Matchers.prototype.toBeLessThan = function(expected) {
    this.message = [
        "Expected " + this.actual + " to be less than " + expected,
        "Expected " + this.actual + " not to be less than " + expected
    ];
    
    return this.actual < expected;
};

jazzman.Matchers.prototype.toBeLT = jazzman.Matchers.prototype.toBeLessThan;

/**
 * Check that the actual value is greater than expected.
 * Synonym: `toBeGT`
 *
 * @param {Number} expected
 */
jazzman.Matchers.prototype.toBeGreaterThan = function(expected) {
    this.message = [
        "Expected " + this.actual + " to be greater than " + expected,
        "Expected " + this.actual + " not to be greater than " + expected
    ];
    
    return this.actual > expected;
};

jazzman.Matchers.prototype.toBeGT = jazzman.Matchers.prototype.toBeGreaterThan;

/*
 * Check that the actual value is less than or equal to expected.
 * Synonyms: `toBeLE`, `toBeEqualOrLessThan`, `toBeAtMost`.
 *
 * @param {Number} expected
 *
 */
jazzman.Matchers.prototype.toBeLessThanOrEqual = function(expected) {
    this.message = [
        "Expected " + this.actual + " to be less than or equal to " + expected,
        "Expected " + this.actual + " not to be less than or equal to " + expected
    ];
    
    return this.actual <= expected;
};

jazzman.Matchers.prototype.toBeLE =
jazzman.Matchers.prototype.toBeEqualOrLessThan =
jazzman.Matchers.prototype.toBeAtMost =
    jazzman.Matchers.prototype.toBeLessThanOrEqual;

/**
 * Check that the actual value is greater than or equal to the expected.
 * Synonyms: `toBeGE`, `toBeEqualOrGreaterThan`, `toBeAtLeast`.
 *
 * @param {Number} expected
 */
jazzman.Matchers.prototype.toBeGreaterThanOrEqual = function(expected) {
    this.message = [
        "Expected " + this.actual + " to be greater than or equal to " + expected,
        "Expected " + this.actual + " not to be greater than or equal to " + expected
    ];
    
    return this.actual >= expected;
};

jazzman.Matchers.prototype.toBeGE =
jazzman.Matchers.prototype.toBeEqualOrGreaterThan =
jazzman.Matchers.prototype.toBeAtLeast =
    jazzman.Matchers.prototype.toBeGreaterThanOrEqual;


/**
 * Matcher that checks that the expected item is equal to the actual item
 * up to a given level of decimal precision (default 2).
 *
 * @param {Number} expected
 * @param {Number} precision, as number of decimal places
 */
jazzman.Matchers.prototype.toBeCloseTo = function(expected, precision) {
    if (!(precision === 0)) {
        precision = precision || 2;
    }
    
    this.message = "Expected " + this.actual + " to be close to " + expected +
                   " within " + precision + " decimal points";
    
    return Math.abs(expected - this.actual) < (Math.pow(10, -precision) / 2);
};

/**
 * Check that the actual value is within the margin of error from the expected.
 * Synonyms: `toBeAppr`, `toBeApproximately`.
 *
 * @param {Number} expected
 * @param {Number} [errorMargin=1]
 */
jazzman.Matchers.prototype.toBeApprox = function(expected, errorMargin) {
    var min, max;
    
    errorMargin = errorMargin || 1;
    
    min = expected - errorMargin;
    max = expected + errorMargin;
    
    this.message = "Expected " + this.actual + " to be approximately " +
                   expected + " by margin of " + errorMargin;
    
    return this.actual >= min && this.actual <= max;
};

jazzman.Matchers.prototype.toBeAppr =
jazzman.Matchers.prototype.toBeApproximately =
    jazzman.Matchers.prototype.toBeApprox;

/**
 * Check that the actual value is within the allowed deviation from expected.
 *
 * @param {Number} deviation
 * @param {Number} expected
 */
jazzman.Matchers.prototype.toBeWithin = function(deviation, expected) {
    var actual = this.actual;
    
    this.message = "Expected " + this.actual + " to be within " + deviation + " from " + expected;

    if (deviation > 0) {
        return actual >= (expected - deviation) && actual <= (expected + deviation);
    }
    else {
        return actual >= (expected + deviation) && actual <= (expected - deviation);
    }
};

/**
 * Matcher that checks that the expected exception was thrown by the actual.
 *
 * @param {String} [expected]
 */
jazzman.Matchers.prototype.toThrow = function(expected) {
    var oldOnError = window.onError,
        result = false,
        exception, not;
    
    if (typeof this.actual !== 'function') {
        throw new Error('Actual is not a function');
    }
    
    // Exceptions thrown in event handlers for synthetic events like mousedown
    // are not catchable by try/catch block. Such exceptions bubble up to the
    // window though, and can be detected in onerror handler. We can also
    // "catch" these in Firefox and WebKit by returning true; that makes
    // the browser think that the exception was handled and it's not logged
    // in the console anymore. Unfortunately that doesn't work in IE,
    // and exceptions are still logged.
    window.onerror = function(msg) {
        exception = msg;
        
        if (oldOnError) {
            oldOnError();
        }
        
        return true;
    };
    
    try {
        this.actual();
    }
    catch (e) {
        exception = e;
    }
    
    if (exception) {
        result = (expected === jazzman.undefined ||
                 this.env._contains(exception.message || exception, expected.message || expected));
    }
    
    // IE8 throws "Not implemented" when trying to assign undefined
    window.onerror = oldOnError || null;
    
    not = this.isNot ? "not " : "";
    
    this.message = function() {
        if (exception && (expected === jazzman.undefined ||
            !this.env._contains(exception.message || exception, expected.message || expected))) {
            return ["Expected function " + not + "to throw",
                    expected ? expected.message || expected : " an exception",
                    ", but it threw", exception.message || exception
            ].join(' ');
        }
        else {
            return "Expected function to throw an exception.";
        }
    };
    
    return result;
};

/**
 * Check that the actual DOM node has the expected HTML markup.
 * Synomyms: `toHaveHTML`, `hasHTML`.
 *
 * @param {String} expected
 */
jazzman.Matchers.prototype.toHaveHtml = function(expected) {
    var me = this,
        actual = me.actual,
        normalizedHTML;

    if (actual && actual.isElement) {
        actual = actual.dom;
    }
    
    if (!actual || !actual.tagName) {
        throw new Error('Actual is not a dom element');
    }
    
    if (jazzman.browser.isSafari3) {
        expected = expected.replace(/&gt;/g, '>');
    }
    
    // this will normalize innerHTML which could vary a lot
    normalizedHTML = actual.innerHTML.replace(/<[^>]*>/g, function(match1) {
        return match1.toLowerCase().replace(/=\w+/g, function(match2) {
            return '="' + match2.split('=')[1] + '"';
        });
    });
    
    me.message = function() {
        return [
            "Expected DOM element innerHTML to be " + expected + " but was " + normalizedHTML,
            "Expected DOM element innerHTML to not be " + expected + "."
        ];
    };
    
    return normalizedHTML === expected;
};

jazzman.Matchers.prototype.toHaveHTML =
    jazzman.Matchers.prototype.hasHTML = jazzman.Matchers.prototype.toHaveHtml;

/**
 * Check if an object has a property. This uses `hasOwnProperty`
 * to check for existence to make it type agnostic.
 *
 * @param {String} property The property to check existence on the taret.
 */
jazzman.Matchers.prototype.toHaveProperty = function(property) {
    var target = this.actual,
        hasProp;

    if (target) {
        hasProp = target.hasOwnProperty(property);

        if (this.isNot) {
            this.message = hasProp
                ? 'Expected target to not have the property "' + property + '"'
                : 'Target has property "' + property + '"';
        }
        else {
            this.message = hasProp
                ? 'Target has property "' + property + '"'
                : 'Expected target to have the property "' + property + '"';
        }
    }

    return hasProp;
};

/**
 * Checks if an object has all properties passed. This function
 * will iterate through all arguments to check for existence:
 *
 *     expect(target).toHaveProperties('foo', 'bar');
 */
jazzman.Matchers.prototype.toHaveProperties = function() {
    var target = this.actual,
        properties = jazzman.util.argsToArray(arguments),
        length = properties.length,
        bad = [],
        i, property, hasProp;

    if (target) {
        for (i = 0; i < length; i++) {
            property = properties[i];
            hasProp = target.hasOwnProperty(property);

            if (this.isNot) {
                if (hasProp) {
                    bad.push(property);
                }
            }
            else {
                if (!hasProp) {
                    bad.push(property);
                }
            }
        }

        this.message = bad.length
            ? 'Expected target to' + (this.isNot ? ' not' : '') + ' have properties: ' + bad.join(', ')
            : 'Target ' + (this.isNot ? 'does not have' : 'has') + ' properties: ' + properties.join(', ');

        return this.isNot ? bad.length : !bad.length;
    }

    return false;
};

/*
 * Check that the actual Date value equals expected hour/minute/second/ms.
 *
 * @param {Number} hour Expected hour
 * @param {Number} [minute] Expected minute
 * @param {Number} [second] Expected second
 * @param {Number} [ms] Expected microsecond
 */
jazzman.Matchers.prototype.toEqualTime = function(hour, minute, second, ms) {
    var actual = this.actual;
    
    return actual instanceof Date &&
           actual.getHours() === hour &&
           actual.getMinutes() === (minute || 0) &&
           actual.getSeconds() === (second || 0) &&
           actual.getMilliseconds() === (ms || 0);
};

// This matcher is used to pass or fail TODO suites. It is never to be used
// as inverted .not.toHaveFailed!
jazzman.Matchers.prototype.toHaveFailed = function(desc) {
    var specOrSuite = this.actual,
        passed = specOrSuite.results(true)._passed(),
        msg;
    
    if (specOrSuite.isSpec) {
        if (passed) {
            msg = 'Expected To Do spec to fail but it passed' + (desc ? ': ' + desc : '');
        }
        else {
            msg = 'Expected To Do spec to fail and it did';
        }
    }
    else {
        // Own ToDo means we expect one or more of own specs to fail
        if (specOrSuite.ownToDo) {
            if (passed) {
                msg = 'Expected To DO suite to fail at least one spec or nested suite' +
                      ' but all specs passed' + (desc ? ': ' + desc : '');
            }
            else {
                msg = 'Expected To Do suite to fail at least one spec or nested suite, and it did.';
            }
        }
        else {
            msg = 'foo';
            passed = false;
        }
    }
    
    this.message = msg;
    this.actual = passed;
    
    return !passed;
};

jazzman.Matchers.Any = function(expectedClass) {
    this.expectedClass = expectedClass;
};

jazzman.Matchers.Any.prototype.jasmineMatches = function(other) {
    /* eslint-disable eqeqeq */
    if (this.expectedClass == String) {
        return typeof other === 'string' || other instanceof String;
    }
    
    if (this.expectedClass == Number) {
        return typeof other === 'number' || other instanceof Number;
    }
    
    if (this.expectedClass == Function) {
        return typeof other === 'function' || other instanceof Function;
    }
    
    if (this.expectedClass == Object) {
        return typeof other === 'object';
    }
    /* eslint-enable eqeqeq */
    
    return other instanceof this.expectedClass;
};

jazzman.Matchers.Any.prototype.jasmineToString = function() {
    return '<jasmine.any(' + this.expectedClass + ')>';
};

jazzman.Matchers.ObjectContaining = function(sample) {
    this.sample = sample;
};

jazzman.Matchers.ObjectContaining.prototype.jasmineMatches = function(other, mismatchKeys, mismatchValues) {
    var env = jazzman.env,
        sample = this.sample,
        property;

    function hasKey(obj, keyName) {
        return obj != null && obj[keyName] !== jazzman.undefined;
    }
    
    mismatchKeys = mismatchKeys || [];
    mismatchValues = mismatchValues || [];
    
    for (property in sample) {
        if (!hasKey(other, property) && hasKey(sample, property)) {
            mismatchKeys.push("expected has key '" + property + "', but missing from actual.");
        }
        else if (!env._equals(sample[property], other[property], mismatchKeys, mismatchValues)) {
            mismatchValues.push(
                "'" + property + "' was '" +
                (other[property] ? jazzman.util.htmlEscape(other[property].toString()) : other[property]) +
                "' in expected, but was '" +
                (sample[property] ? jazzman.util.htmlEscape(sample[property].toString()) : sample[property]) +
                "' in actual."
            );
        }
    }
    
    return (mismatchKeys.length === 0 && mismatchValues.length === 0);
};

jazzman.Matchers.ObjectContaining.prototype.jasmineToString = function() {
    return "<jasmine.objectContaining(" + jazzman.pp(this.sample) + ")>";
};

/**
 * @constructor
 */
jazzman.MultiReporter = function() {
    this.subReporters = [];
};

jazzman.MultiReporter.prototype.addReporter = function(reporter) {
    var previousReportFn;
    
    this.subReporters.push(reporter);
    
    previousReportFn = this.report;
    
    // All reporter methods (except `log`) accept one argument + callback
    this.report = function(methodName, arg, callback) {
        var cb = previousReportFn
            ? function() {
                previousReportFn(methodName, arg, callback);
            }
            : callback;
        
        if (reporter[methodName]) {
            reporter[methodName].call(reporter, arg, cb);
        }
        else {
            cb();
        }
    };
};

(function() {
    jazzman.MultiReporter.prototype.reportDependencyLoadStarting = function(env, callback) {
        return this.report('reportDependencyLoadStarting', env, callback);
    };
    
    jazzman.MultiReporter.prototype.reportDependencyLoadFinishing = function(env, callback) {
        return this.report('reportDependencyLoadFinishing', env, callback);
    };
    
    jazzman.MultiReporter.prototype.reportEnvSetupStarting = function(env, callback) {
        return this.report('reportEnvSetupStarting', env, callback);
    };
    
    jazzman.MultiReporter.prototype.reportEnvSetupFinishing = function(env, callback) {
        return this.report('reportEnvSetupFinishing', env, callback);
    };
    
    jazzman.MultiReporter.prototype.reportRunnerStarting = function(runner, callback) {
        return this.report('reportRunnerStarting', runner, callback);
    };
    
    jazzman.MultiReporter.prototype.reportRunnerResults = function(runner, callback) {
        return this.report('reportRunnerResults', runner, callback);
    };
    
    jazzman.MultiReporter.prototype.reportSuiteStarting = function(suite, callback) {
        return this.report('reportSuiteStarting', suite, callback);
    };
    
    jazzman.MultiReporter.prototype.reportSuiteResults = function(suite, callback) {
        return this.report('reportSuiteResults', suite, callback);
    };
    
    jazzman.MultiReporter.prototype.reportSpecStarting = function(spec, callback) {
        return this.report('reportSpecStarting', spec, callback);
    };
    
    jazzman.MultiReporter.prototype.reportSpecResults = function(spec, callback) {
        return this.report('reportSpecResults', spec, callback);
    };
    
    // SYNCHRONOUS, does not accept callback!
    jazzman.MultiReporter.prototype.log = function() {
        var reporter, i, len;
        
        for (i = 0, len = this.subReporters.length; i < len; i++) {
            reporter = this.subReporters[i];
            
            if (reporter.log) {
                reporter.log.apply(reporter, arguments);
            }
        }
    };
})();

/**
 * Holds results for a set of jazzman spec. Allows for the results array
 * to hold another jazzman.NestedResults.
 *
 * @constructor
 */
jazzman.NestedResults = function() {
    this._items = [];
    this.reset();
};

jazzman.NestedResults.prototype.reset = function() {
    this.totalCount = 0;
    this.passedCount = 0;
    this.failedCount = 0;
    this.skipped = false;
    this._items.length = 0;
};

/**
 * Roll up the result counts.
 *
 * @param result
 */
jazzman.NestedResults.prototype.rollupCounts = function(result) {
    this.totalCount += result.totalCount;
    this.passedCount += result.passedCount;
    this.failedCount += result.failedCount;
};

/**
 * Adds a log message.
 * @param values Array of message parts which will be concatenated later.
 */
jazzman.NestedResults.prototype.log = function(values) {
    this._items.push(new jazzman.MessageResult(values));
};

/**
 * Getter for the results: message & results.
 */
jazzman.NestedResults.prototype.items = function() {
    return this._items;
};

/**
 * Adds a result, tracking counts (total, passed, & failed)
 * @param {jazzman.ExpectationResult|jazzman.NestedResults} result
 */
jazzman.NestedResults.prototype.addResult = function(result) {
    if (result.type !== 'log') {
        if (result._items) {
            this.rollupCounts(result);
        }
        else {
            this.totalCount++;
            
            if (result.passed()) {
                this.passedCount++;
            }
            else {
                this.failedCount++;
            }
        }
    }
    
    this._items.push(result);
};

jazzman.NestedResults.prototype._passed = function() {
    return this.passedCount === this.totalCount;
};

/**
 * @returns {Boolean} True if *everything* below passed. This is a public API
 * and may return forced result for the sake of green runs.
 */
jazzman.NestedResults.prototype.passed = function() {
    // If this is a ToDo spec or suite, forced result will be injected
    return this.forcedResult != null ? this.forcedResult : this._passed();
};

/**
 * Base class for pretty printing for expectation results.
 */
jazzman.PrettyPrinter = function(depth) {
    this._ppNestLevel = 0;
    this._ppDepth = depth != null ? depth : jazzman.MAX_PRETTY_PRINT_DEPTH;
};

/**
 * Formats a value in a nice, human-readable string.
 *
 * @param value
 */
jazzman.PrettyPrinter.prototype.format = function(value) {
    var className, superclass;

    if (this._ppNestLevel > this._ppDepth) {
        throw new Error('jazzman.PrettyPrinter: format() nested too deeply!');
    }
    
    this._ppNestLevel++;
    
    try {
        if (value === jazzman.undefined) {
            this.emitScalar('undefined');
        }
        else if (value === null) {
            this.emitScalar('null');
        }
        else if (value === jazzman.getGlobal()) {
            this.emitScalar('<global>');
        }
        else if (value.jasmineToString) {
            this.emitScalar(value.jasmineToString());
        }
        else if (typeof value === 'string') {
            this.emitString(value);
        }
        else if (jazzman.isSpy(value)) {
            this.emitScalar("spy on " + value.identity);
        }
        else if (value instanceof RegExp) {
            this.emitScalar(value.toString());
        }
        else if (typeof value === 'function') {
            this.emitScalar('Function');
        }
        else if (typeof value.nodeType === 'number') {
            this.emitScalar('HTMLNode');
        }
        else if (value instanceof Date) {
            this.emitScalar('Date(' + value + ')');
        }
        else if (value.__Jasmine_been_here_before__) {
            this.emitScalar('<circular reference: ' + (jazzman.isArray(value) ? 'Array' : 'Object') + '>');
        }
        // Support for pretty printing instances of Ext classes.
        // Assignment within conditional is not accidental.
        else if ((className = value.$className) !== undefined) {
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
            
            this.emitScalar(className + '#' + (value.id || (value.getId && value.getId())));
        }
        else if (jazzman.isArray(value) || typeof value === 'object') {
            value.__Jasmine_been_here_before__ = true;
            
            if (jazzman.isArray(value)) {
                this.emitArray(value);
            }
            else {
                this.emitObject(value);
            }
            
            delete value.__Jasmine_been_here_before__;
        }
        else {
            this.emitScalar(value.toString());
        }
    }
    catch (e) {
        // ignore
    }
    finally {
        this._ppNestLevel--;
    }
};

jazzman.PrettyPrinter.prototype.iterateObject = function(obj, fn, scope) {
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
                ? (obj.__lookupGetter__(property) !== jazzman.undefined && obj.__lookupGetter__(property) !== null)
                : false
        );
    }
};

jazzman.PrettyPrinter.prototype.emitArray = jazzman._unimplementedMethod;
jazzman.PrettyPrinter.prototype.emitObject = jazzman._unimplementedMethod;
jazzman.PrettyPrinter.prototype.emitScalar = jazzman._unimplementedMethod;
jazzman.PrettyPrinter.prototype.emitString = jazzman._unimplementedMethod;

jazzman.StringPrettyPrinter = function() {
    jazzman.PrettyPrinter.apply(this, arguments);
    
    this.string = '';
};

jazzman.util.inherit(jazzman.StringPrettyPrinter, jazzman.PrettyPrinter);

jazzman.StringPrettyPrinter.prototype.emitScalar = function(value) {
    this.append(value);
};

jazzman.StringPrettyPrinter.prototype.emitString = function(value) {
    this.append("'" + value + "'");
};

jazzman.StringPrettyPrinter.prototype.emitArray = function(array) {
    var i;
    
    if (this._ppNestLevel > this._ppDepth) {
        this.append("Array");
        
        return;
    }
    
    this.append('[ ');
    
    for (i = 0; i < array.length; i++) {
        if (i > 0) {
            this.append(', ');
        }
        
        this.format(array[i]);
    }
    
    this.append(' ]');
};

jazzman.StringPrettyPrinter.prototype.getIndent = function() {
    var whiteSpaces = [],
        i, len;
    
    for (i = 0, len = this.ws; i < len; i++) {
        whiteSpaces.push(' ');
    }
    
    return whiteSpaces.join('');
};

jazzman.StringPrettyPrinter.prototype.emitObject = function(obj) {
    var first = true,
        indent;
    
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
};

jazzman.StringPrettyPrinter.prototype.append = function(value) {
    this.string += value;
};

jazzman.Queue = function(env) {
    this.env = env;
    this.blocks = [];
    
    this.reset();
};

jazzman.Queue.prototype.reset = function() {
    this.blocks.length = 0;
    this.running = false;
    this.index = 0;
    this.offset = 0;
    this.abort = false;
};

jazzman.Queue.prototype.add = function(block, ensure) {
    if (ensure) {
        block.ensured = ensure;
    }
    
    this.blocks.push(block);
};

jazzman.Queue.prototype.remove = function(block) {
    jazzman.array.remove(this.blocks, block);
};

jazzman.Queue.prototype.insertNext = function(block, ensure) {
    block.ensured = !!ensure;
    this.blocks.splice((this.index + this.offset + 1), 0, block);
    this.offset++;
};

jazzman.Queue.prototype.start = function(onComplete) {
    this.running = true;
    this.onComplete = onComplete;
    this._next();
};

jazzman.Queue.prototype.stop = function() {
    this.abort = true;
};

jazzman.Queue.prototype.isRunning = function() {
    return this.running;
};

(function() {
    var setTimeout = jazzman._setTimeout;
    
    jazzman.Queue.prototype._next = function() {
        var me = this,
            goAgain, calledSynchronously, completedSynchronously, onComplete, now;
        
        goAgain = true;
    
        while (goAgain) {
            goAgain = false;
            me.env.activeQueue = me;
            
            if (me.index < me.blocks.length) {
                calledSynchronously = true;
                completedSynchronously = false;
    
                onComplete = function() {
                    if (calledSynchronously) {
                        completedSynchronously = true;
                        
                        return;
                    }
    
                    if (me.blocks[me.index].abort || jazzman.ABORT_ALL_QUEUES) {
                        me.abort = true;
                    }
    
                    me.offset = 0;
                    me.index++;
    
                    now = jazzman.util.now();
                    
                    if (me.env.updateInterval && now - me.env.lastUpdate > me.env.updateInterval) {
                        me.env.lastUpdate = now;
                        
                        setTimeout(function() {
                            me._next();
                        }, 0);
                    }
                    else {
                        if (completedSynchronously) {
                            goAgain = true;
                        }
                        else {
                            me._next();
                        }
                    }
                };
    
                // Can't use closed-over variable for block because reentrancy
                if (!me.abort || me.blocks[me.index].ensured) {
                    me.blocks[me.index].execute(onComplete);
                }
                else {
                    onComplete();
                }
    
                calledSynchronously = false;
                
                if (completedSynchronously) {
                    onComplete();
                }
            }
            else {
                me.running = false;
                
                // Assignment is intentional, this is to unbind the Queue instance
                // from onComplete scope.
                // eslint-disable-next-line no-cond-assign
                if (onComplete = me.onComplete) {
                    onComplete();
                }
            }
        }
    };
})();

jazzman.Queue.prototype.kick = function(exception) {
    var block = this.running && this.blocks[this.index];
    
    if (block) {
        // This will clear any pending timers for the block, fail its spec and move along
        block.stop(exception);
    }
    else {
        throw new Error("Whoa! What is going on here?!");
    }
};

/**
 * Runner is a thin wrapper around root suite object with additional filtering
 * and reporting capabilities. It is kept mostly for backward API compatibility.
 *
 * @constructor
 * @param {jazzman.Env} env
 */
jazzman.Runner = function(env) {
    var rootSuite = new jazzman.Suite(env, 'Root', jazzman.emptyFn);
    
    rootSuite.id = 0;
    rootSuite.level = 0;
    rootSuite.isRootSuite = true;
    
    this.env = env;
    this.rootSuite = rootSuite;
};

jazzman.Runner.prototype.execute = function(done) {
    var me = this;
    
    me.env.totalSpecs = me.env.remainingSpecs = me.rootSuite.totalSpecs;
    me.env.enabledSpecs = me.rootSuite.countSpecs('enabled');
    me.env.disabledSpecs = me.rootSuite.countSpecs('disabled');
    
    me.env.reporter.reportRunnerStarting(me, function() {
        var env = me.env,
            reporter = env.reporter,
            setTimeout = jazzman._setTimeout,
            _next;
        
        _next = function() {
            me.env.stopQueueWatchdog();
            
            me.env.finishedSpecs = me.rootSuite.finishedSpecs;
            
            reporter.reportRunnerResults(me, function() {
                if (done) {
                    done();
                }
            });
        };
        
        me.env.startQueueWatchdog(_next);
        
        if (jasmine.SKIP_ALL_TESTS) {
            _next();
        }
        else {
            // Unwind call stack before running tests
            setTimeout(function() {
                me.rootSuite.execute(_next);
            }, 0);
        }
    });
};

jazzman.Runner.prototype.suites = function() {
    return this.rootSuite.suites();
};

jazzman.Runner.prototype.results = function() {
    return this.rootSuite.results();
};

jazzman.Runner.prototype._convergeIds = function(testIds, oldSpecIds) {
    var result = {},
        key, value, id;
    
    // convert [1, 2] into { 1: true, 2: true }
    if (typeof testIds.length === 'number') {
        result = jazzman.array.toMap(testIds);
    }
    
    // Test runner may pass string names instead of ids for top level suites
    for (key in testIds) {
        value = testIds[key];
        id = typeof value === 'number' ? value : jazzman.util.hashString(value);
        
        result[id] = id;
    }
    
    // Old API support for backwards compatibility
    if (oldSpecIds) {
        if (typeof oldSpecIds.length === 'number') {
            oldSpecIds = jazzman.array.toMap(oldSpecIds);
        }
        
        for (id in oldSpecIds) {
            if (oldSpecIds.hasOwnProperty(id)) {
                result[id] = oldSpecIds[id];
            }
        }
    }
    
    return result;
};

jazzman.Runner.prototype.filter = function(testIds, oldSpecIds) {
    testIds = this._convergeIds(testIds, oldSpecIds);
    
    if (!jazzman.util.isObjectEmpty(testIds)) {
        this.rootSuite.filter(testIds);
        
        // If testIds were provided, that was because the dev wanted to run only
        // the specs or suites specified. If these can't be found, most probably
        // that means there was a typo in a spec name, or recent changes to the
        // test code changed the hash and it's no longer valid. Either way that
        // is something that happens only when debugging and is going to be
        // corrected soon. So instead of defaulting to run the whole nine yards,
        // just bail out.
        if (this.rootSuite.empty) {
            this.errorNoTestsFound = true;
        }
    }
    
    return this;
};

/**
 * To Do block.
 */
jazzman.ToDo = function(env, condition, description) {
    this.env = env;
    this.condition = condition;
    this.description = description;
    
    this.resolved = typeof condition === 'boolean';
};

jazzman.ToDo.prototype.describe = function(desc, specFunc) {
    // If ToDo is already resolved with condition being `false`
    // we treat it as if there is no ToDo at all, so we only
    // inject special logic in the spec when either condition
    // is *not* resolved yet (being a function to call), or
    // when condition is already resolved and is true.
    if (!this.resolved || this.condition) {
        specFunc.ToDo = this;
        specFunc.ownToDo = true;
    }
    
    return this.env.describe(desc, specFunc);
};

jazzman.ToDo.prototype.xdescribe = function(desc, specFunc) {
    specFunc.enabled = false;
    
    return this.env.describe(desc, specFunc);
};

jazzman.ToDo.prototype.it = function(desc, func, options) {
    var spec = this.env.it(desc, func, options);
    
    // See above
    if (!this.resolved || this.condition) {
        spec.ToDo = this;
    }
    
    return spec;
};

jazzman.ToDo.prototype.xit = function(desc, func, options) {
    var spec = this.env.it(desc, func, options);
    
    spec.disable();
    
    return spec;
};

jazzman.ToDo.prototype.topSuite = function() {
    var i, len;
    
    for (i = 0, len = arguments.length; i < len; i++) {
        if (typeof arguments[i] === 'function') {
            arguments[i].ToDo = this;
        }
    }
    
    return this.env.topSuite.apply(this.env, arguments);
};

jazzman.ToDo.prototype.resolve = function() {
    if (!this.resolved) {
        this.condition = !!this.condition();
        this.resolved = true;
    }
    
    return this.condition;
};

jazzman.ToDo.prototype.getDescription = function() {
    return 'TODO' + (this.description ? ': ' + this.description : '');
};

jazzman.setCurrentScript = function(file) {
    if (typeof Ext !== "undefined" && Ext.cmd && Ext.cmd.api && Ext.cmd.api.adapter) {
        Ext.cmd.api.adapter.setCurrentScript(file);
    }
};

jazzman.getCurrentScript = function() {
    if (typeof Ext !== "undefined" && Ext.cmd && Ext.cmd.api && Ext.cmd.api.adapter) {
        return Ext.cmd.api.adapter.getCurrentScript();
    }
    
    return null;
};

/**
 * Internal representation of a jazzman suite.
 *
 * @constructor
 * @param {jazzman.Env} env
 * @param {String} description
 * @param {Function} specDefinitions
 * @param {jazzman.Suite} parentSuite
 */
jazzman.Suite = function(env, description, specDefinitions, parentSuite, ignoreDuplicates) {
    var prop;
    
    this.description = description;
    this.queue = new jazzman.Queue(env);
    this.parentSuite = parentSuite;
    this.env = env;
    
    this._beforeAll = [];
    this._beforeEach = [];
    this._afterEach = [];
    this._afterAll = [];
    this._children = [];
    this._suites = [];
    this._specs = [];
    
    this.totalSpecs = 0;
    this.finishedSpecs = 0;
    this.fileName = jazzman.getCurrentScript();
    
    if (parentSuite && !parentSuite.isRootSuite) {
        this.fullName = parentSuite.fullName + jazzman.FULL_NAME_DELIMITER + description;
        this.level = parentSuite.level + 1;
    }
    else {
        this.fullName = description;
        this.level = 1;
        this.isTopSuite = true;
    }
    
    if (env.checkName(this.fullName) && !ignoreDuplicates) {
        throw 'Duplicate suite name found: "' + this.fullName + '"';
    }
    
    this.enabled = true;
    
    for (prop in specDefinitions) {
        if (specDefinitions.hasOwnProperty(prop)) {
            this[prop] = specDefinitions[prop];
        }
    }
};

jazzman.Suite.prototype.isSuite = true;

jazzman.Suite.prototype.isEnabled = function() {
    return this.enabled;
};

jazzman.Suite.prototype.isDisabled = function() {
    return !this.enabled;
};

jazzman.Suite.prototype.disable = function() {
    this.enabled = false;
    
    return this;
};

jazzman.Suite.prototype.enable = function() {
    this.enabled = true;
    
    return this;
};

jazzman.Suite.prototype.disableChildren = function() {
    var children = this.children(),
        i, len;
    
    for (i = 0, len = children.length; i < len; i++) {
        children[i].disable();
    }
    
    return this;
};

jazzman.Suite.prototype.getFullName = function(printable) {
    var name;
    
    if (printable) {
        name = this.printableFullName;
        
        if (!name) {
            this.printableFullName = name =
                (this.fullName || '').replace(jazzman.FULL_NAME_DELIMITER_RE, ' ');
        }
    }
    else {
        name = this.fullName;
    }
    
    return name;
};

jazzman.Suite.prototype.getId = function() {
    var id = this.id;
    
    if (id === undefined) {
        this.id = id = jazzman.util.hashString(this.fullName, this.parentSuite.getId());
    }
    
    return id;
};

jazzman.Suite.prototype.it = function(description, func, options) {
    var env = this.env,
        spec, timeout;
    
    spec = new jazzman.Spec(env, this, description);
    
    if (options && options.totalSpecs != null) {
        spec.totalSpecs = options.totalSpecs;
    }
    
    if (options && options.toStart) {
        this.addToStart(spec);
    }
    else {
        this.add(spec);
    }
    
    env.currentSpec = spec;
    
    if (func) {
        func.typeName = 'it';
        
        // Support for legacy third argument
        if (typeof options === 'number') {
            timeout = options;
        }
        else if (typeof options === 'object') {
            timeout = options.timeout;
            delete options.timeout;
            
            jazzman.apply(func, options);
        }
        
        // Timeout is applied to the block NOT to the func. It's historical.
        spec.runs(func, timeout);
    }
    
    env.currentSpec = null;
    
    return spec;
};

// TODO Eliminate this code duplication
jazzman.Suite.prototype.runs = function(func, timeout, ensure) {
    var block = new jazzman.Block(this.env, func, this);
    
    if (timeout != null) {
        block.timeout = parseInt(timeout);
    }
    
    this.addToQueue(block, ensure);
    
    return this;
};

jazzman.Suite.prototype.addToQueue = function(block, ensure) {
    var queue = this.queue;
    
    if (queue.isRunning()) {
        queue.insertNext(block, ensure);
    }
    else {
        queue.add(block, ensure);
    }
};

jazzman.Suite.prototype.waits = function(timeout) {
    var waitsFunc = new jazzman.WaitsBlock(this.env, timeout, this);
    
    this.addToQueue(waitsFunc);
    
    return this;
};

jazzman.Suite.prototype.waitsFor = function() {
    var _latchFunction = null,
        _timeoutMessage = null,
        _timeout = null,
        _timeout_increment = null,
        numberFound = false,
        i, arg, waitsForFunc;
    
    for (i = 0; i < arguments.length; i++) {
        arg = arguments[i];
        
        switch (typeof arg) {
            case 'function':
                _latchFunction = arg;
                break;
            
            case 'string':
                _timeoutMessage = arg;
                break;
            
            case 'number':
                // SECOND number is the increment
                if (numberFound) {
                    _timeout_increment = arg;
                }
                // FIRST number is the timeout
                else {
                    _timeout = arg;
                    numberFound = true;
                }
                
                break;
        }
    }
    
    waitsForFunc = new jazzman.WaitsForBlock(
        this.env,
        _timeout,
        _latchFunction,
        _timeoutMessage,
        _timeout_increment,
        this
    );
    
    this.addToQueue(waitsForFunc);
    
    return this;
};

jazzman.Suite.prototype.beforeEach = function(beforeEachFunction) {
    // We can't create blocks here because a block is bound to its spec,
    // and beforeEach() is called in a suite context.
    beforeEachFunction.typeName = 'beforeEach';
    this._beforeEach.push(beforeEachFunction);
    this._beforeCache = null;
};

jazzman.Suite.prototype.getBefores = function() {
    var parent = this.parentSuite,
        parentBefores;
    
    if (this._beforeCache) {
        return this._beforeCache;
    }
    
    parentBefores = parent ? parent.getBefores() : [];
    
    return this._beforeCache = [].concat(parentBefores, this._beforeEach);
};

jazzman.Suite.prototype.afterEach = function(afterEachFunction) {
    // Same as beforeEach
    afterEachFunction.typeName = 'afterEach';
    this._afterEach.push(afterEachFunction);
    this._afterCache = null;
};

jazzman.Suite.prototype.getAfters = function() {
    var parent = this.parentSuite,
        parentAfters;
    
    if (this._afterCache) {
        return this._afterCache;
    }
    
    parentAfters = parent ? parent.getAfters() : [];
    
    return this._afterCache = [].concat(this._afterEach, parentAfters);
};

jazzman.Suite.prototype.beforeAll = function(beforeAllFunction) {
    var block;
    
    beforeAllFunction.typeName = 'beforeAll';
    
    // beforeAll block runs in the suite scope so we can create it upfront
    block = new jazzman.Block(this.env, beforeAllFunction, this);
    
    this._beforeAll.push(block);
};

jazzman.Suite.prototype.afterAll = function(afterAllFunction) {
    var block;
    
    afterAllFunction.typeName = 'afterAll';
    
    // Ditto
    block = new jazzman.Block(this.env, afterAllFunction, this);
    
    this._afterAll.push(block);
};

jazzman.Suite.prototype.add = function(test) {
    this._children.push(test);
    
    if (test.isSuite) {
        this._suites.push(test);
    }
    else {
        this._specs.push(test);
    }
    
    this.adjustCounts(test.totalSpecs);
};

jazzman.Suite.prototype.addToStart = function(test) {
    this._children.unshift(test);
    
    if (test.isSuite) {
        this._suites.unshift(test);
    }
    else {
        this._specs.unshift(test);
    }
    
    this.adjustCounts(test.totalSpecs);
};

jazzman.Suite.prototype.remove = function(suiteOrSpec) {
    jazzman.array.remove(this._children, suiteOrSpec);
    
    if (suiteOrSpec.isSuite) {
        jazzman.array.remove(this._suites, suiteOrSpec);
    }
    else {
        jazzman.array.remove(this._specs, suiteOrSpec);
    }
    
    this.adjustCounts(-suiteOrSpec.totalSpecs);
};

jazzman.Suite.prototype.removeAll = function() {
    this.adjustCounts(-this.totalSpecs);
    
    this._beforeEach.length = 0;
    this._afterEach.length = 0;
    this._beforeAll.length = 0;
    this._afterAll.length = 0;
    this._children.length = 0;
    this._suites.length = 0;
    this._specs.length = 0;
    
    this.queue.reset();
};

jazzman.Suite.prototype.specs = function() {
    return this._specs;
};

jazzman.Suite.prototype.suites = function() {
    return this._suites;
};

jazzman.Suite.prototype.children = function() {
    return this._children;
};

jazzman.Suite.prototype.execute = function(onComplete) {
    var me = this;
    
    var _next = function() {
        var env = me.env,
            queue = me.queue,
            children = me._children,
            beforeAll = me._beforeAll,
            afterAll = me._afterAll,
            todo = me.ToDo,
            haveBeforeAll = beforeAll.length > 0,
            child, i, len;
    
        if (!me.enabled) {
            me.disableChildren();
        }
        else if (todo) {
            me.invertResults = todo.resolve();
            me.ToDo = null;
            
            if (!me.invertResults) {
                todo = null;
            }
        }
        
        if (haveBeforeAll) {
            for (i = 0, len = beforeAll.length; i < len; i++) {
                queue.add(beforeAll[i]);
            }
            
            // beforeAll is supposed to allocate some resources that are going to be available
            // for any specs in the same suite and child suites. Therefore we need to account
            // for those resources as not being leaked when we run leak checks after each spec.
            child = new jazzman.Block(env, function() {
                env.pushResources();
                env.enumerateResources(false, me.isRootSuite ? true : me.getId());
            }, me);
            
            queue.add(child);
        }
        
        if (me.shuffle != null ? me.shuffle : jazzman.SHUFFLE) {
            children = jazzman.array.shuffle(children);
        }
        
        for (i = 0, len = children.length; i < len; i++) {
            child = children[i];
            
            if (todo && !child.ToDo) {
                child.forcedResult = true;
            }
            
            queue.add(children[i]);
        }
        
        if (me.invertResults) {
            child = me.todoSpec = new jazzman.Spec(env, me, 'is To Do');
            child.skipBeforesAndAfters = true;
            child.totalSpecs = 0;
            
            child.runs(function() {
                expect(this.suite).toHaveFailed(this.suite.todoDesc);
            });
            
            // this block should run regardless of previous blocks results
            queue.add(child, true);
        }
        
        // If there were any beforeAll blocks we need to revert resource accounting stack
        // to where it was before this suite started, as well as check if everything was
        // cleaned up properly. It is not our responsibility to clean up, just to check.
        if (haveBeforeAll) {
            child = new jazzman.Block(env, env.popResources.bind(env), me);
            
            queue.add(child, true);
        }
        
        for (i = 0, len = afterAll.length; i < len; i++) {
            // afterAll blocks should run regardless of previous blocks results
            queue.add(afterAll[i], true);
        }
        
        if (haveBeforeAll) {
            // We make this a Spec insted of plain Block so that it could fail.
            // However its *only* function is to pass or fail, and we don't want
            // this Spec to do anything else, including running beforeEach/afterEach
            child = new jazzman.Spec(env, me, 'should clean up resources allocated in beforeAll');
            child.skipBeforesAndAfters = true;
            
            me.add(child);
            queue.add(child, true);
        }
        
        env.startSuite(me);
        
        queue.start(function() {
            me.finish(onComplete);
        });
    };

    if (me.isRootSuite) {
        _next();
    }
    else {
        me.env.reporter.reportSuiteStarting(me, _next);
    }
};

jazzman.Suite.prototype.finish = function(onComplete) {
    var me = this,
        isTopSuite = me.isTopSuite,
        results, _next;
    
    // Walk child results once and cache if not in CI
    results = me.results(!jazzman.CI_ENVIRONMENT);
    
    if (me.forcedResult != null) {
        results.forcedResult = me.forcedResult;
    }
    else if (me.invertResults) {
        if (!results._passed()) {
            results.forcedResult = true;
        }
    }
    
    me.finished = true;
    
    if (me.parentSuite) {
        me.parentSuite.finishedSpecs += me.finishedSpecs;
    }
    
    me.env.finishSuite(me);
    
    // MUST NOT null the _children property now because it is needed
    // to traverse the suite's child nodes upon expand and collapse
    // in local runner; also when collecting results. Since child
    // suites and specs are kept in _children array, clearing _specs
    // and _suites doesn't make much sense either.
    me._beforeEach = me._beforeCache = me._afterEach = me._afterCache = me.queue = null;
    me._beforeAll = me._afterAll = me.todoSpec = null;
    
    _next = function() {
        var spec, i, len, fireEmUp;
        
        // When in CI environment, results are collected once and sent to the orchestrator.
        // We don't need these properties anymore, guaranteed.
        if (jazzman.CI_ENVIRONMENT) {
            me._resultsReported = true;
            
            for (i = 0, len = me._specs.length; i < len; i++) {
                spec = me._specs[i];
                spec._results = spec.queue = spec.suite = null;
            }
            
            me._children = me._specs = me._suites = null;
        }
        
        if (onComplete) {
            // This is to allow call stack to unwind and let previous suites finish
            // before advancing the queue. We only do this for top level suites
            // to avoid performance penalty.
            if (isTopSuite) {
                // Assignment is to avoid odd call scope problems in older IEs
                fireEmUp = jazzman._setTimeout;
                
                fireEmUp(onComplete, 0);
            }
            else {
                onComplete();
            }
        }
    };
    
    if (me.isRootSuite) {
        _next();
    }
    else {
        me.env.reporter.reportSuiteResults(me, _next);
    }
};

jazzman.Suite.prototype.fail = function(args, typeName) {
    // We only store the first error message because whenever there is one
    // we abort the queue immediately. However afterEach and afterAll blocks
    // are ensured and will run even after queue abort, and it is very possible
    // that some of these will throw exceptions too. Since these potential errors
    // most probably will be caused by the first one, it's no use to store them.
    if (!this._error) {
        this._error = new jazzman.ErrorResult(args);
        this._error.typeName = typeName;
    }
    
    this.queue.stop();
};

jazzman.Suite.prototype.countSpecs = function(which) {
    var children = this._children,
        count = 0,
        i, len;
    
    for (i = 0, len = children.length; i < len; i++) {
        count += children[i].countSpecs(which);
    }
    
    return count;
};

jazzman.Suite.prototype.adjustCounts = function(amount) {
    var suite;
    
    // This *should* adjust root suite counters, too!
    if (amount > 0) {
        for (suite = this; suite; suite = suite.parentSuite) {
            suite.totalSpecs += amount;
        }
    }
};

jazzman.Suite.prototype.results = function(cacheResults) {
    var children = this._children,
        error = this._error,
        results = this._results,
        todoSpec = this.todoSpec,
        result, i, len;
    
    if (results || this._resultsReported) {
        return results;
    }
    
    results = new jazzman.NestedResults();
    results.description = this.description;
    
    if (error && error.typeName === 'beforeAll') {
        results.addResult(error);
    }
    
    for (i = 0, len = children.length; i < len; i++) {
        result = children[i].results(cacheResults);
        
        if (result) {
            results.addResult(result);
        }
    }
    
    if (error && error.typeName !== 'beforeAll') {
        results.addResult(error);
    }
    
    if (todoSpec) {
        results.addResult(todoSpec.results(cacheResults));
    }
    
    if (!this.enabled) {
        results.skipped = true;
    }
    
    if (cacheResults) {
        this._results = results;
    }
    
    return results;
};

jazzman.Suite.prototype.filter = function(testIds) {
    var toRemove = [],
        specs, suites, spec, suite, i, len;
    
    if (!testIds[this.getId()]) {
        suites = this.suites();
        specs = this.specs();
        
        for (i = 0, len = specs.length; i < len; i++) {
            spec = specs[i];
            
            if (!testIds[spec.getId()]) {
                toRemove.push(spec);
            }
        }
        
        for (i = 0, len = suites.length; i < len; i++) {
            suite = suites[i];
            
            suite.filter(testIds);
            
            if (suite.empty) {
                toRemove.push(suite);
            }
        }
        
        // Filtering out entire suite happens quite often so we optimize for that
        if ((suites.length + specs.length) === toRemove.length) {
            this.removeAll();
            this.empty = true;
        }
        else {
            for (i = 0, len = toRemove.length; i < len; i++) {
                this.remove(toRemove[i]);
            }
            
            this.filtered = true;
        }
    }
    
    return this;
};

jazzman.Suite.prototype.getParentSuite = function() {
    return this.parentSuite;
};

jazzman.Suite.prototype.getTopSuite = function() {
    var suite = this;

    while (suite.parentSuite && !suite.parentSuite.isRootSuite) {
        suite = suite.parentSuite;
    }

    return suite;
};

/**
 * Internal representation of a jazzman specification, or test.
 *
 * @constructor
 * @param {jazzman.Env} env
 * @param {jazzman.Suite} suite
 * @param {String} description
 */
jazzman.Spec = function(env, suite, description) {
    if (!env) {
        throw new Error('jazzman.Env() required');
    }
    
    if (!suite) {
        throw new Error('jazzman.Suite() required');
    }
    
    this.env = env;
    this.suite = suite;
    this.description = description;
    this.queue = new jazzman.Queue(env);
    
    this._spies = [];
    
    this._results = new jazzman.NestedResults();
    this._results.description = description;
    this._results.isSpecResults = true;
    
    this.matchersClass = null;
    
    this.fileName = jazzman.getCurrentScript();
    
    // The dot at the end is added to prevent the possibility of collisions
    // with similar suite names, like this: "foo bar" -> "foo bar."
    this.fullName = this.suite.fullName + jazzman.FULL_NAME_DELIMITER + this.description + '.';
    
    if (env.checkName(this.fullName)) {
        throw 'Duplicate spec name found: "' + this.fullName + '"';
    }
    
    this.totalSpecs = 1;
    
    this.enabled = true;
};

jazzman.Spec.prototype.isSpec = true;

jazzman.Spec.prototype.getFullName = function(printable) {
    var name = this.fullName;
    
    return printable ? (name || '').replace(jazzman.FULL_NAME_DELIMITER_RE, ' ') : name;
};

jazzman.Spec.prototype.getId = function() {
    var id = this.id;
    
    if (id === undefined) {
        this.id = id = jazzman.util.hashString(this.fullName, this.suite.getId());
    }
    
    return id;
};

jazzman.Spec.prototype.results = function() {
    return this._results;
};

/**
 * All parameters are pretty-printed and concatenated together, then written to the spec's output.
 *
 * Be careful not to leave calls to <code>jazzman.log</code> in production code.
 */
jazzman.Spec.prototype.log = function() {
    return this._results.log(arguments);
};

jazzman.Spec.prototype.runs = function(func, timeout, ensure) {
    var block = new jazzman.Block(this.env, func, this);
    
    if (timeout != null) {
        block.timeout = parseInt(timeout);
    }
    
    this.addToQueue(block, ensure);
    
    return this;
};

jazzman.Spec.prototype.addToQueue = function(block, ensure) {
    var queue = this.queue;
    
    if (queue.isRunning()) {
        queue.insertNext(block, ensure);
    }
    else {
        queue.add(block, ensure);
    }
};

/**
 * @param {jazzman.ExpectationResult} result
 */
jazzman.Spec.prototype.addMatcherResult = function(result) {
    this._results.addResult(result);
};

jazzman.Spec.prototype.expect = function(actual) {
    var MatchersClass = this._getMatchersClass(),
        positive;
    
    positive = new MatchersClass(this.env, actual, this);
    positive.not = new MatchersClass(this.env, actual, this, true);
    
    return positive;
};

/**
 * Waits a fixed time period before moving to the next block.
 *
 * @deprecated Use waitsFor() instead
 * @param {Number} timeout milliseconds to wait
 */
jazzman.Spec.prototype.waits = function(timeout) {
    var waitsFunc = new jazzman.WaitsBlock(this.env, timeout, this);
    
    this.addToQueue(waitsFunc);
    
    return this;
};

/**
 * Waits for the latchFunction to return true before proceeding to the next block.
 *
 * @param {Function} latchFunction Function to execute
 * @param {String} [timeoutMessage] Message to use if the condition is never met
 * @param {Number} [timeout] Time to wait for condition to be met.
 * @param {Number} [timeout_increment] Number of milliseconds to wait between invocations.
 */
jazzman.Spec.prototype.waitsFor = function() {
    var _latchFunction = null,
        _timeoutMessage = null,
        _timeout = null,
        _timeout_increment = null,
        numberFound = false,
        i, arg, waitsForFunc;
    
    for (i = 0; i < arguments.length; i++) {
        arg = arguments[i];
        
        switch (typeof arg) {
            case 'function':
                _latchFunction = arg;
                break;
            
            case 'string':
                _timeoutMessage = arg;
                break;
            
            case 'number':
                // SECOND number is the increment
                if (numberFound) {
                    _timeout_increment = arg;
                }
                // FIRST number is the timeout
                else {
                    _timeout = arg;
                    numberFound = true;
                }
                
                break;
        }
    }
    
    waitsForFunc = new jazzman.WaitsForBlock(
        this.env,
        _timeout,
        _latchFunction,
        _timeoutMessage || (_latchFunction && _latchFunction.toString()),
        _timeout_increment,
        this
    );
    
    this.addToQueue(waitsForFunc);
    
    return this;
};

jazzman.Spec.prototype.fail = function(e) {
    var expectationResult, params;
    
    params = {
        keepPassed: this.env.keepPassedResults,
        passed: false,
        message: e ? jazzman.util.formatException(e) : 'Exception'
    };

    if (e instanceof Error) {
        params.error = e;
        params.trace = {
            stack: e.stack
        };
    }
    else if (e && e.stack) {
        params.message += '\n' + e.stack;
    }
    
    expectationResult = new jazzman.ExpectationResult(params);
    
    this._results.addResult(expectationResult);
};

jazzman.Spec.prototype._getMatchersClass = function() {
    return this.matchersClass || this.env.matchersClass;
};

jazzman.Spec.prototype.addMatchers = function(matchersPrototype) {
    var parent = this._getMatchersClass();
    
    var newMatchersClass = function() {
        parent.apply(this, arguments);
    };
    
    jazzman.util.inherit(newMatchersClass, parent);
    jazzman.Matchers._wrapInto(matchersPrototype, newMatchersClass);
    
    this.matchersClass = newMatchersClass;
};

jazzman.Spec.prototype.execute = function(onComplete) {
    var spec = this,
        _next;
    
    _next = function() {
        var todo;
        
        if (!spec.env.specFilter(spec) || spec.isDisabled()) {
            spec._results.skipped = true;
            spec.finish(onComplete);
            
            return;
        }
        
        // eslint-disable-next-line no-cond-assign
        if (todo = spec.ToDo) {
            spec.invertResults = todo.resolve();
            
            if (spec.invertResults) {
                spec.todoDescription = todo.getDescription();
            }
            
            // We don'need this anymore
            spec.ToDo = null;
        }
        
        spec.env.currentSpec = spec;
        
        if (!spec.skipBeforesAndAfters) {
            spec.addBeforesAndAftersToQueue();
        }
        
        spec.queue.start(function() {
            spec.finish(onComplete);
        });
    };

    if (spec.skipReporting) {
        _next();
    }
    else {
        spec.env.reporter.reportSpecStarting(spec, _next);
    }
};

jazzman.Spec.prototype.addBeforesAndAftersToQueue = function() {
    var queue = this.queue,
        suite = this.suite,
        env = this.env,
        blocks = [],
        befores, afters, block, i, len;
    
    befores = suite.getBefores();
    
    // Befores and afters are arrays of functions, we need to create blocks for them.
    // We also must not mutate the original arrays on the suite, because they're cached
    // and reused between different specs.
    for (i = 0, len = befores.length; i < len; i++) {
        block = new jazzman.Block(env, befores[i], this);
        
        // Note that we don't call queue.addBefore here because it would unshift
        // the block to the head of the queue; we have the before and after arrays
        // in the order we want them here so just push on.
        blocks.push(block);
    }
    
    for (i = 0, len = queue.blocks.length; i < len; i++) {
        blocks.push(queue.blocks[i]);
    }
    
    afters = suite.getAfters();
    
    for (i = 0, len = afters.length; i < len; i++) {
        block = new jazzman.Block(env, afters[i], this);
        block.ensured = true;
        
        // Ditto with after functions; we have them in proper order already.
        blocks.push(block);
    }
    
    queue.blocks = blocks;
};

jazzman.Spec.prototype.finish = function(onComplete) {
    var spec = this,
        _next;
    
    spec.removeAllSpies();

    if (typeof Ext !== 'undefined') {
        // TouchMode is decided upon the time since the last touch gesture.
        // Between tests, that needs to be reset. Also reset keyboard mode.
        Ext.lastTouchTime = 0;
        Ext.keyboardMode = false;
        
        // Complete destruction of dead objects
        if (Ext.Reaper) {
            Ext.Reaper.flush();
        }
    }

    // We run resource checks *before* reporting, so that if anything leaked
    // the spec would have a chance to fail
    if (jazzman.CHECK_LEAKS && spec.env.checkResourceLeaks) {
        spec.env.checkResourceLeaks(spec);
    }

    if (spec.forcedResult != null) {
        spec._results.forcedResult = spec.forcedResult;
    }
    else if (spec.invertResults) {
        if (spec._results.passed()) {
            expect(spec).toHaveFailed(spec.todoDescription);
        }
        else {
            spec._results.forcedResult = true;
        }
    }

    spec.finished = true;
    spec.suite.finishedSpecs += spec.totalSpecs;
    spec._spies = spec.matchersClass = spec.queue = null;
    
    _next = function() {
        spec.env.currentSpec = null;
        
        if (onComplete) {
            onComplete();
        }
    };
    
    if (spec.skipReporting) {
        _next();
    }
    else {
        spec.env.reporter.reportSpecResults(spec, _next);
    }
};

jazzman.Spec.prototype.explodes = function() {
    throw 'explodes function should not have been called';
};

jazzman.Spec.prototype.spyOn = function(obj, methodName, ignoreMethodDoesntExist) {
    var className = obj.$className,
        spyObj;

    if (obj === jazzman.undefined) {
        throw "spyOn could not find an object to spy upon for " + methodName + "()";
    }
    
    if (!ignoreMethodDoesntExist && obj[methodName] === jazzman.undefined) {
        throw methodName + '() method does not exist';
    }
    
    if (!ignoreMethodDoesntExist && obj[methodName] && obj[methodName].isSpy) {
        throw new Error(methodName + ' has already been spied upon');
    }
    
    spyObj = jazzman.createSpy(methodName);
    
    this._spies.push(spyObj);
    
    spyObj.baseObj = obj;
    spyObj.methodName = methodName;
    spyObj.originalValue = obj[methodName];
    
    // If we are spying on a prototype property of an instance, we must
    // set up to delete the property
    if (className) {
        if (obj !== Ext.ClassManager.get(className).prototype) {
            spyObj.wasPrototypeValue = !obj.hasOwnProperty(methodName);
        }
    }
    
    obj[methodName] = spyObj;
    
    return spyObj;
};

jazzman.Spec.prototype.removeAllSpies = function() {
    var spies = this._spies,
        spy, i, len;
        
    for (i = 0, len = spies.length; i < len; i++) {
        spy = spies[i];

        // If we injected an instance value, overrideing what was a prototype method
        // we must delete the property
        if (spy.wasPrototypeValue) {
            delete spy.baseObj[spy.methodName];
        }
        else {
            spy.baseObj[spy.methodName] = spy.originalValue;
        }
    }
    
    this._spies.length = 0;
};

jazzman.Spec.prototype.isEnabled = function() {
    return this.enabled;
};

jazzman.Spec.prototype.isDisabled = function() {
    return !this.enabled;
};

jazzman.Spec.prototype.disable = function() {
    this.enabled = false;
    
    // Release bound contexts and closures
    this.queue = null;

    return this;
};

jazzman.Spec.prototype.enable = function() {
    this.enabled = true;

    return this;
};

jazzman.Spec.prototype.getParentSuite = function() {
    return this.suite;
};

jazzman.Spec.prototype.getTopSuite = function() {
    return this.suite.getTopSuite();
};

jazzman.Spec.prototype.countSpecs = function(which) {
    if (which === 'disabled') {
        return this.enabled ? 0 : this.totalSpecs;
    }
    else if (which === 'enabled') {
        return this.enabled ? this.totalSpecs : 0;
    }
    else {
        return this.totalSpecs;
    }
};

/**
 * Blocks are functions with executable code that make up a spec.
 *
 * @constructor
 * @param {jazzman.Env} env
 * @param {Function} func
 * @param {jazzman.Spec} spec
 */
jazzman.Block = function(env, func, spec) {
    this.env = env;
    this.func = func;
    this.spec = spec;
};

jazzman.Block.prototype.execute = function(onComplete) {
    var me = this,
        spec = me.spec,
        func = me.func,
        wantCallback = func.length > 0,
        setTimeout = jazzman._setTimeout,
        disableTryCatch, done;
    
    // We store onComplete on the block itself in case it times out.
    // If that happens Runner's watchdog timer will expire and Runner
    // will kick the queue to move along. We will need onComplete then.
    me.onComplete = onComplete;
    
    // A block can be created in numerous ways, and the property may or may not be set.
    // We can't assume that it will be always properly configured so have to fall back
    // to the global variables at run time.
    disableTryCatch = func.disableTryCatch != null ? func.disableTryCatch : !jazzman.CATCH_EXCEPTIONS;
    
    if (this.timeout != null) {
        this.timeoutId = setTimeout(function() {
            me.stop();
        }, this.timeout);
    }
    
    // We pass this callback to the block fn so that it could finish block execution
    // immediately after doing its thing, if the block is aware of that.
    // If it's not then we're going to do the cleanup automatically.
    if (wantCallback) {
        done = function() {
            done = null;
            
            me.finish();
        };
    }

    if (disableTryCatch) {
        func.call(spec, done);
        
        if (!wantCallback) {
            me.finish();
        }
    }
    else {
        try {
            func.call(spec, done);
        }
        catch (e) {
            if (jazzman.DEBUG_ON_ERROR) {
                // The function below contains only one debugger statement and nothing else.
                // This is because some browsers have trouble optimizing functions with
                // debugger statements even if conditional. We can't afford Block.execute
                // not to be optimized.
                jazzman.debuggerStatement(e);
            }

            spec.fail(e, func.typeName);
        }

        if (!wantCallback) {
            me.finish();
        }
    }
};

jazzman.Block.prototype.finish = function() {
    var onComplete = this.onComplete,
        setTimeout = jazzman._setTimeout,
        clearTimeout = jazzman._clearTimeout;
    
    this.onComplete = null;
    delete this.onComplete;
    
    if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        delete this.timeoutId;
    }
    
    this.finished = true;
    
    // Could have been nulled already, if this kicks in from watchdogFn
    if (onComplete) {
        if (this.asyncOnComplete) {
            setTimeout(onComplete, 0);
        }
        else {
            onComplete();
        }
    }
};

// DO NOT CALL THIS METHOD `abort`! It will conflict with the boolean of the same name!
jazzman.Block.prototype.stop = function(exception) {
    var spec = this.spec,
        func = this.func;
    
    if (spec) {
        spec.fail(exception || {
            name: 'timeout',
            message: this.message ||
                ('Spec execution timed out after ' +
                 (this.timeout != null ? this.timeout : jazzman.DEFAULT_WATCHDOG_INTERVAL) +
                 ' milliseconds')
        }, func ? func.typeName : null);
    }
    
    this.abort = true;
    
    this.finish();
};

jazzman.WaitsBlock = function(env, timeout, spec) {
    this.timeout = timeout;
    jazzman.Block.call(this, env, null, spec);
};

jazzman.util.inherit(jazzman.WaitsBlock, jazzman.Block);

jazzman.WaitsBlock.prototype.execute = function(onComplete) {
    var me = this,
        setTimeout = jazzman._setTimeout;
    
    me.onComplete = onComplete;
    
    me.timeoutId = setTimeout(function() {
        me.finish();
    }, me.timeout);
};

/**
 * A block which waits for some condition to become true, with timeout.
 *
 * @constructor
 * @extends jazzman.Block
 * @param {jazzman.Env} env The jazzman environment.
 * @param {Number} timeout The maximum time in milliseconds to wait for the condition to become true.
 * @param {Function} latchFunction A function which returns true when the desired condition has been
 * met.
 * @param {String} message The message to display if the desired condition hasn't been met within
 ( the given time period.
 * @param {NUmber} timeout_increment Time in milliseconds to wait between invocations.
 * @param {jazzman.Spec} spec The jazzman spec.
 */
jazzman.WaitsForBlock = function(env, timeout, latchFunction, message, timeout_increment, spec) {
    jazzman.Block.call(this, env, null, spec);
    
    this.timeout = timeout != null ? timeout : env.defaultTimeoutInterval;
    this.latchFunction = latchFunction;
    this.message = message;
    this.totalTimeSpentWaitingForLatch = 0;
    this.timeout_increment = timeout_increment != null ? timeout_increment : jazzman.WaitsForBlock.TIMEOUT_INCREMENT;
};

jazzman.util.inherit(jazzman.WaitsForBlock, jazzman.Block);

jazzman.WaitsForBlock.prototype.isWaitsForBlock = true;
jazzman.WaitsForBlock.prototype.asyncOnComplete = true;

// Longer poll interval in slower browser to allow intervening events to fire.
jazzman.WaitsForBlock.TIMEOUT_INCREMENT = jazzman.browser.isIE8m ? 50 : 10;

jazzman.WaitsForBlock.prototype.execute = function(onComplete) {
    var setTimeout = jazzman._setTimeout;
    
    this.wantCallback = this.latchFunction.length > 0;
    this.onComplete = onComplete;
    
    this.fail = this.fail.bind(this);
    this.done = this.done.bind(this);
    this.next = this.next.bind(this);
    
    if (this.wantCallback) {
        this.watchdogTimeout = setTimeout(this.fail, this.timeout);
    }
    
    this.next();
};

// Fail callback can be fired either upon expiration of watchdog timeout,
// or explicitly if latch function throws an exception. In latter case
// we will have an exception to report.
jazzman.WaitsForBlock.prototype.fail = function(exception) {
    if (jazzman.BREAK_ON_FAIL) {
        debugger;
    }

    this.stop(exception || {
        name: 'timeout',
        message: 'Timed out after ' + this.timeout + ' msec waiting for ' +
                 (this.message || 'something to happen')
    });
};

// We pass this callback to the latch function so that it could yield control
// and finish waiting asynchronously after its condition was met, without polling
// every now and then. The latch function needs to be aware of that though,
// which is optional.
jazzman.WaitsForBlock.prototype.done = function() {
    var clearTimeout = jazzman._clearTimeout;
    
    // This too can be reached via various paths.
    if (this.watchdogTimeout) {
        clearTimeout(this.watchdogTimeout);
        delete this.watchdogTimeout;
    }
    
    if (this.nextTimeout) {
        clearTimeout(this.nextTimeout);
        delete this.nextTimeout;
    }
    
    if (!this.abort) {
        this.finish();
    }
};

jazzman.WaitsForBlock.prototype.next = function() {
    var setTimeout = jazzman._setTimeout,
        result;
    
    // Watchdog could have kicked in and aborted the latch sequence.
    // Sometimes nextTimeout fails to clear in IE. :(
    if (this.abort) {
        return;
    }
    
    // We can't avoid try/catch block here because any unhandled exception
    // will wreak queue flow.
    try {
        result = !!this.latchFunction.call(this.spec, this.done, this.fail);
    }
    catch (e) {
        this.fail(e);
        
        return;
    }
    
    // We only poll if the latch function does not accept arguments.
    // If it does we assume that it is responsible for calling done()
    // when it's done. If it so happens that the latch function accepts
    // some arguments by mistake and is not aware of the done() callback,
    // it's no big deal - there's a global watchdog in the Env that will
    // take care of this.
    if (!this.finished && !this.wantCallback) {
        if (result) {
            this.done();
        }
        else {
            this.totalTimeSpentWaitingForLatch += this.timeout_increment;
            
            if (this.totalTimeSpentWaitingForLatch >= this.timeout) {
                this.fail();
                
                return;
            }
            
            this.nextTimeout = setTimeout(this.next, this.timeout_increment);
        }
    }
};

jazzman.WaitsForBlock.prototype.finish = function() {
    var clearTimeout = jazzman._clearTimeout;
    
    if (this.watchdogTimeout) {
        clearTimeout(this.watchdogTimeout);
        delete this.watchdogTimeout;
    }
    
    if (this.nextTimeout) {
        clearTimeout(this.nextTimeout);
        delete this.nextTimeout;
    }
    
    this.fail = this.done = this.next = this.latchFunction = null;
    delete this.fail;
    delete this.done;
    delete this.next;
    
    jazzman.Block.prototype.finish.call(this);
};

jazzman.WaitsForEventBlock = function(env, target, event, message, timeout, spec) {
    var latchFn = this.waitFn.bind(this);
    
    jazzman.WaitsForBlock.call(this, env, timeout, latchFn, message, null, spec);
    
    this.target = target;
    this.event = event;
};

jazzman.util.inherit(jazzman.WaitsForEventBlock, jazzman.WaitsForBlock);

jazzman.WaitsForEventBlock.prototype.isWaitsForEventBlock = true;

jazzman.WaitsForEventBlock.prototype.waitFn = function(done) {
    var noTarget;
    
    if (!this.target) {
        this.fail({
            name: 'Error',
            message: 'Expected valid event source, got ' + jazzman.pp(this.target)
        });
        
        noTarget = true;
    }
    
    if (noTarget || this.alreadyDone()) {
        done();
    }
    else {
        this.listenerFunction = done;
        this.addListener();
    }
};

jazzman.WaitsForEventBlock.prototype.focusEvents = {
    focus: true,
    focusin: true
};

jazzman.WaitsForEventBlock.prototype.blurEvents = {
    blur: true,
    focusout: true
};

jazzman.WaitsForBlock.prototype.specialEvents = {
    render: 'rendered',
    hide: 'hidden',
    show: function(target) {
        return !target.hidden;
    }
};

jazzman.WaitsForEventBlock.prototype.alreadyDone = function() {
    var event = this.event,
        target = this.target,
        focusEl, test;
    
    if (this.focusEvents[event] || this.blurEvents[event]) {
        // We do target resolution at *block execution time* to allow Components to render!
        if (target.$isFocusableEntity) {
            focusEl = target.getFocusEl();
                
            // Drill down to the actual element
            while (focusEl && !focusEl.isElement) {
                focusEl = focusEl.getFocusEl();
            }
            
            focusEl = focusEl && focusEl.dom;
        }
        else if (target.isElement) {
            focusEl = target.dom;
        }
        else {
            focusEl = target;
        }
        
        if (!focusEl) {
            this.fail({
                name: 'Error',
                message: "Cannot find focusable HTMLElement" +
                         (target && target.$className ? " for " + target.$className + '#' + target.id : '') + '!'
            });
            
            // If there is nothing to wait for, we're done
            return true;
        }
        
        this.target = target = focusEl;
        
        return (this.focusEvents[event] && document.activeElement === target) ||
               (this.blurEvents[event] && document.activeElement !== target);
    }
    // eslint-disable-next-line no-cond-assign
    else if (test = this.specialEvents[event]) {
        if (typeof test === 'function') {
            return target && test(target);
        }
        else {
            return target && target[test];
        }
    }
    
    return false;
};

jazzman.WaitsForEventBlock.prototype.addListener = function() {
    var event = this.event,
        target = this.target;
    
    if (target.isObservable) {
        // We have to introduce a delay to allow the stack to unwind
        target.addListener(event, this.listenerFunction, this, { single: true, delay: 1 });
    }
    else if (target.addEventListener) {
        target.addEventListener(event, this.listenerFunction);
    }
    else {
        target.attachEvent('on' + event, this.listenerFunction);
    }
    
    this.listenerInstalled = true;
};

jazzman.WaitsForEventBlock.prototype.removeListener = function() {
    var event, target;
    
    if (!this.listenerInstalled) {
        return;
    }
    
    event = this.event;
    target = this.target;
    
    if (target) {
        if (target.isObservable) {
            target.removeListener(event, this.listenerFunction);
        }
        else if (target.removeEventListener) {
            target.removeEventListener(event, this.listenerFunction);
        }
        else {
            target.detachEvent('on' + event, this.listenerFunction);
        }
    }
    
    this.listenerInstalled = false;
};

jazzman.WaitsForEventBlock.prototype.done = function() {
    this.removeListener();
    this.listenerFunction = null;
    this.target = null;
    
    jazzman.WaitsForBlock.prototype.done.call(this);
};

jazzman.WaitsForEventBlock.prototype.fail = function(exception) {
    this.removeListener();
    this.listenerFunction = null;
    this.target = null;
    
    jazzman.WaitsForBlock.prototype.fail.call(this, exception);
};

jazzman.env = new jazzman.Env();

// Mock setTimeout, clearTimeout
// Contributed by Pivotal Computer Systems, www.pivotalsf.com

jazzman.FakeTimer = function() {
    var me = this;
    
    me.reset();
    
    me.setTimeout = function(funcToCall, millis) {
        me.timeoutsMade++;
        me.scheduleFunction(me.timeoutsMade, funcToCall, millis, false);
        
        return me.timeoutsMade;
    };
    
    me.setInterval = function(funcToCall, millis) {
        me.timeoutsMade++;
        me.scheduleFunction(me.timeoutsMade, funcToCall, millis, true);
        
        return me.timeoutsMade;
    };
    
    me.clearTimeout = me.clearInterval = function(timeoutKey) {
        me.scheduledFunctions[timeoutKey] = null;
    };
};

jazzman.FakeTimer.prototype.reset = function() {
    this.timeoutsMade = 0;
    this.scheduledFunctions = {};
    this.nowMillis = 0;
};

jazzman.FakeTimer.prototype.tick = function(millis) {
    var oldMillis = this.nowMillis,
        newMillis = oldMillis + millis;
    
    this.runFunctionsWithinRange(oldMillis, newMillis);
    this.nowMillis = newMillis;
};

jazzman.FakeTimer.prototype.runFunctionsWithinRange = function(oldMillis, nowMillis) {
    var funcsToRun = [],
        fn, timeoutKey, i;
    
    for (timeoutKey in this.scheduledFunctions) {
        fn = this.scheduledFunctions[timeoutKey];
        
        if (fn != null && fn.runAtMillis >= oldMillis && fn.runAtMillis <= nowMillis) {
            funcsToRun.push(fn);
            this.scheduledFunctions[timeoutKey] = null;
        }
    }
    
    if (funcsToRun.length > 0) {
        funcsToRun.sort(function(a, b) {
            return a.runAtMillis - b.runAtMillis;
        });
        
        for (i = 0; i < funcsToRun.length; ++i) {
            try {
                fn = funcsToRun[i];
                
                this.nowMillis = fn.runAtMillis;
                
                fn.funcToCall();
                
                if (fn.recurring) {
                    this.scheduleFunction(fn.timeoutKey, fn.funcToCall, fn.millis, true);
                }
            }
            catch (e) {
                // ignore
            }
        }
        
        this.runFunctionsWithinRange(oldMillis, nowMillis);
    }
};

jazzman.FakeTimer.prototype.scheduleFunction = function(timeoutKey, funcToCall, millis, recurring) {
    this.scheduledFunctions[timeoutKey] = {
        runAtMillis: this.nowMillis + millis,
        funcToCall: funcToCall,
        recurring: recurring,
        timeoutKey: timeoutKey,
        millis: millis
    };
};

/**
 * @namespace
 */
jazzman.Clock = (function() {
    var scheduledFunctions = {},
        global = jazzman.getGlobal(),
        realSetTimeout = global.setTimeout,
        realClearTimeout = global.clearTimeout,
        realSetInterval = global.setInterval,
        realClearInterval = global.clearInterval,
        realSetImmediate = global.setImmediate,
        realClearImmediate = global.clearImmediate,
        noOp = function() {},
        me = {
            scheduledFunctions: scheduledFunctions,

            reset: function() {
                var timeoutKey;

                for (timeoutKey in scheduledFunctions) {
                    me.installed.clearTimeout(timeoutKey);
                }
            },

            tick: noOp,

            runFunctionsWithinRange: noOp,

            useMock: noOp,

            installMock: noOp,

            unInstallMock: noOp,

            scheduleFunction: function() {
                throw "Not supported";
            },

            nextTimeoutKey: 100000,

            installed: {
                setTimeout: function(funcToCall, millis) {
                    var wrapFunc = function() {
                            delete scheduledFunctions[timeoutKey];
                            funcToCall();
                        },
                        timeoutKey = me.nextTimeoutKey++,
                        realTimeoutKey,
                        spec = jazzman.env.currentSpec;
                    
                    // if (timeoutKey === 100005) {
                    //     debugger;
                    // }

                    if (jazzman.browser.isIE8) {
                        global.setTimeout = realSetTimeout;
                        realTimeoutKey = setTimeout(wrapFunc, millis);
                        global.setTimeout = jazzman.Clock.installed.setTimeout;
                    }
                    else {
                        realTimeoutKey = realSetTimeout.apply(global, [wrapFunc, millis]);
                    }
                    
                    // Functions deemed safe will have the flag set
                    scheduledFunctions[timeoutKey] = {
                        type: 'setTimeout',
                        realTimeoutKey: realTimeoutKey,
                        scheduledFn: funcToCall,
                        funcToCall: wrapFunc,
                        created: jazzman.CAPTURE_CALL_STACK ? new Error().stack : null,
                        spec: spec ? spec.getFullName(true) : null,
                        $skipTimerCheck: funcToCall.$skipTimerCheck
                    };
                    
                    return timeoutKey;
                },

                setInterval: function(funcToCall, millis) {
                    var timeoutKey = me.nextTimeoutKey++,
                        realTimeoutKey,
                        spec = jazzman.env.currentSpec;
                    
                    // if (timeoutKey === 100004) {
                    //     debugger;
                    // }

                    if (jazzman.browser.isIE8) {
                        global.setInterval = realSetInterval;
                        realTimeoutKey = setTimeout(funcToCall, millis);
                        global.setInterval = jazzman.Clock.installed.setInterval;
                    }
                    else {
                        realTimeoutKey = realSetInterval.apply(global, [funcToCall, millis]);
                    }

                    scheduledFunctions[timeoutKey] = {
                        type: 'setInterval',
                        realTimeoutKey: realTimeoutKey,
                        scheduledFn: funcToCall,
                        funcToCall: funcToCall,
                        created: jazzman.CAPTURE_CALL_STACK ? new Error().stack : null,
                        spec: spec ? spec.getFullName(true) : null,
                        $skipTimerCheck: funcToCall.$skipTimerCheck
                    };
                    
                    return timeoutKey;
                },

                clearTimeout: function(timeoutKey) {
                    var scheduledObject = scheduledFunctions[timeoutKey],
                        realTimeoutKey;

                    // We can only handle it if it is one of ours
                    if (scheduledObject) {
                        realTimeoutKey = scheduledObject.realTimeoutKey;
                        delete scheduledFunctions[timeoutKey];
                        
                        if (jazzman.browser.isIE8) {
                            global.clearTimeout = realClearTimeout;
                            global.clearInterval = realClearInterval;
                            clearInterval(realTimeoutKey);
                            clearTimeout(realTimeoutKey);
                            global.clearTimeout = jazzman.Clock.installed.clearTimeout;
                            global.clearInterval = jazzman.Clock.installed.clearInterval;
                        }
                        else {
                            realClearTimeout.call(global, realTimeoutKey);
                            realClearInterval.call(global, realTimeoutKey);
                        }
                        
                        if (realClearImmediate) {
                            realClearImmediate.call(global, realTimeoutKey);
                        }
                    }
                },

                clearInterval: function(timeoutKey) {
                    me.installed.clearTimeout(timeoutKey);
                }
            }
        };
    
    if (realSetImmediate && realClearImmediate) {
        me.installed.setImmediate = function(funcToCall) {
            var timeoutKey = me.nextTimeoutKey++,
                realTimeoutKey,
                spec = jazzman.env.currentSpec;

            realTimeoutKey = realSetImmediate.apply(jazzman.getGlobal(), [funcToCall]);

            scheduledFunctions[timeoutKey] = {
                type: 'setImmediate',
                realTimeoutKey: realTimeoutKey,
                scheduledFn: funcToCall,
                funcToCall: funcToCall,
                created: jazzman.CAPTURE_CALL_STACK ? new Error().stack : null,
                spec: spec ? spec.getFullName(true) : null,
                $skipTimerCheck: funcToCall.$skipTimerCheck
            };
            
            return timeoutKey;
        };
        
        me.installed.clearImmediate = function(timeoutKey) {
            me.installed.clearTimeout(timeoutKey);
        };
    }

    return me;
})();

// Use the instrumented timer functions
(function() {
    var global = jazzman.getGlobal();
    
    global.setTimeout = jazzman.Clock.installed.setTimeout;
    global.setInterval = jazzman.Clock.installed.setInterval;
    global.clearTimeout = jazzman.Clock.installed.clearTimeout;
    global.clearInterval = jazzman.Clock.installed.clearInterval;
    
    if (global.setImmediate) {
        jazzman._setImmediate = global.setImmediate;
        global.setImmediate = jazzman.Clock.installed.setImmediate;
    }
    
    if (global.clearImmediate) {
        jazzman._clearImmediate = global.clearImmediate;
        global.clearImmediate = jazzman.Clock.installed.clearImmediate;
    }
})();

/**
 * Simple Mock class to represent an XMLHttpRequest
 */
jazzman.getGlobal().MockAjax = function() {
    /**
     * Contains all request headers
     */
    this.headers = {};
    
    /**
     * Contains any options specified during sending
     */
    this.ajaxOptions = {};
    
    this.readyState = 0;
    
    this.status = null;
    
    this.responseText = this.responseXML = null;
};

/**
 * Contains a default response for any synchronous request.
 */
MockAjax.prototype.syncDefaults = {
    responseText: 'data',
    status: 200,
    statusText: '',
    responseXML: null,
    responseHeaders: { "Content-type": "application/json" }
};

MockAjax.prototype.readyChange = function() {
    if (this.onreadystatechange) {
        this.onreadystatechange();
    }
};

/**
 * Simulate the XHR open method
 * @param {Object} method
 * @param {Object} url
 * @param {Object} async
 * @param {Object} username
 * @param {Object} password
 */
MockAjax.prototype.open = function(method, url, async, username, password) {
    var options = this.ajaxOptions;
    
    options.method = method;
    options.url = url;
    options.async = async;
    options.username = username;
    options.password = password;
    
    this.readyState = 1;
    this.readyChange();
};

/**
 * Simulate the XHR send method
 * @param {Object} data
 */
MockAjax.prototype.send = function(data) {
    this.ajaxOptions.data = data;
    this.readyState = 2;
    
    // if it's a synchronous request, let's just assume it's already finished
    if (!this.ajaxOptions.async) {
        this.complete(this.syncDefaults);
    }
    else {
        this.readyChange();
    }
};

/**
 * Simulate the XHR abort method
 */
MockAjax.prototype.abort = function() {
    this.readyState = 0;
    this.readyChange();
};

/**
 * Simulate the XHR setRequestHeader method
 * @param {Object} header
 * @param {Object} value
 */
MockAjax.prototype.setRequestHeader = function(header, value) {
    this.headers[header] = value;
};

/**
 * Simulate the XHR getAllResponseHeaders method
 */
MockAjax.prototype.getAllResponseHeaders = function() {
    var headers = this.responseHeaders,
        lines = [],
        header;
    
    for (header in headers) {
        if (headers.hasOwnProperty(header)) {
            lines.push(header + ': ' + headers[header]);
        }
    }
    
    return lines.join('\r\n');
};

/**
 * Simulate the XHR getResponseHeader method
 * @param {Object} name
 */
MockAjax.prototype.getResponseHeader = function(name) {
    return this.responseHeaders[name];
};

/**
 * Simulate the XHR onreadystatechange method
 */
MockAjax.prototype.onreadystatechange = function() {
};

/**
 * Method for triggering a response completion
 */
MockAjax.prototype.complete = function(response) {
    delete this.responseType;
    
    this.responseText = response.responseText || '';
    this.status = response.status;
    this.statusText = response.statusText;
    this.responseXML = response.responseXML || this.xmlDOM(response.responseText);
    this.responseHeaders = response.responseHeaders ||
                           { "Content-type": response.contentType || "application/json" };
    
    this.readyState = 4;
    this.readyChange();
};

/**
 * Converts string to XML DOM
 */
MockAjax.prototype.xmlDOM = function(xml) {
    var doc;
    
    // IE DOMParser support
    if (!window.DOMParser && window.ActiveXObject) {
        /* global ActiveXObject, DOMParser */
        doc = new ActiveXObject('Microsoft.XMLDOM');
        doc.async = 'false';
        
        // eslint-disable-next-line no-global-assign
        DOMParser = jazzman.emptyFn;
        
        DOMParser.prototype.parseFromString = function(xmlString) {
            var doc = new ActiveXObject('Microsoft.XMLDOM');
            
            doc.async = 'false';
            doc.loadXML(xmlString);
            
            return doc;
        };
    }
    
    if (xml && xml.substr(0, 1) === '<') {
        try {
            return (new DOMParser()).parseFromString(xml, "text/xml");
        }
        catch (e) {
            // ignore
        }
    }
    
    return null;
};

/**
 * Exports go here
 */
if (typeof window === "undefined" && typeof exports === "object") {
    /* global exports */
    exports.jazzman = jazzman;
    exports.spyOn = jazzman.getGlobal().spyOn;
    exports.it = jazzman.getGlobal().it;
    exports.xit = jazzman.getGlobal().xit;
    exports.specFor = jazzman.getGlobal().specFor;
    exports.xspecFor = jazzman.getGlobal().xspecFor;
    exports.expect = jazzman.getGlobal().expect;
    exports.runs = jazzman.getGlobal().runs;
    exports.waits = jazzman.getGlobal().waits;
    exports.waitsFor = jazzman.getGlobal().waitsFor;
    exports.waitsForSpy = jazzman.getGlobal().waitsForSpy;
    exports.waitsForAnimation = jazzman.getGlobal().waitsForAnimation;
    exports.beforeEach = jazzman.getGlobal().beforeEach;
    exports.afterEach = jazzman.getGlobal().afterEach;
    exports.describe = jazzman.getGlobal().describe;
    exports.xdescribe = jazzman.getGlobal().xdescribe;
    exports.waitForFocus = jazzman.getGlobal().waitForFocus;
    exports.waitAWhile = jazzman.waitAWhile;
    exports.focusAndWait = jazzman.getGlobal().focusAndWait;
    exports.pressTabKey = jazzman.pressTabKey;
    exports.pressKey = jazzman.pressKey;
    exports.expectFocused = jazzman.expectFocused;
    exports.focusAndExpect = jazzman.focusAndExpect;
}

})();