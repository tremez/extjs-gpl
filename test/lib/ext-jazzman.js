/**
 * This file contains all Ext specific Jazzman extensions.
 * The reason we keep this stuff separately is to enable Jazzman core
 * to run under strict mode. Ext cannot do this because it relies heavily
 * on non-strict mode features like `caller`.
 */
/* eslint-disable no-cond-assign */
(function() {
/**
 * The regular expression used by {@link #topSuite} to match class name
 * requirements.
 */
jazzman.TOP_SUITE_PREFIX = /^Ext\./;

/**
 * Check that the actual DOM node has the expected CSS class applied.
 *
 * @param {String} expected
 */
jazzman.Matchers.prototype.toHaveCls = function(expected) {
    // (this.actual.el || this.actual) ensures that this works for
    // Ext.Element, Ext.Component, and HTMLElement instances
    var el = Ext.fly(this.actual.el || this.actual),
        hasClsCount = 0,
        expectedCount, i;
    
    if (!el || !el.dom) {
        this.message = "Expected HTMLElement or Ext.dom.Element but got " + jazzman.pp(this.actual);
        
        return false;
    }

    if (typeof expected === 'string') {
        // Allow space separated class list to be tested.
        expected = expected.split(/\s+/);
    }

    for (i = 0, expectedCount = expected.length; i < expectedCount; i++) {
        if (el.hasCls(expected[i])) {
            ++hasClsCount;
        }
    }

    this.message = [
        "Expected DOM element " + el.dom.tagName + (el.dom.id ? "#" + el.dom.id : "") +
            " to have CSS class " + expected.join(' ') + ".",
        "Expected DOM element " + el.dom.tagName + (el.dom.id ? "#" + el.dom.id : "") +
            " to not have CSS class " + expected.join(' ') + "."
    ];

    return this.isNot ? (hasClsCount > 0) : (hasClsCount === expectedCount);
};

/**
 * Check that Component or Element has the specified attribute.
 * Synonym: `toHaveAttr`
 *
 * @param {String} attr The attribute to check
 * @param {String} [value] Value to check (optional for negative matcher)
 */
jazzman.Matchers.prototype.toHaveAttribute = function(attr, expectedValue) {
    var target = this.actual,
        msg, ret, hasAttr, actualValue;
    
    if (target) {
        target = (target.ariaEl ? target.ariaEl : Ext.fly(target)).dom;
        hasAttr = target.hasAttribute(attr);
        actualValue = target.getAttribute(attr);
        
        // If value is not provided then we're checking attribute existence
        if (arguments.length === 1) {
            ret = hasAttr;
            
            // jazzman.Matcher expectation inversion logic is a bit perverse
            // if you pardon my pun, so it's better to spell out the results
            // to be 100% sure they will get noticed.
            if (this.isNot) {
                msg = !ret
                    ? 'DOM element has no attribute "' + attr + '"'
                    : 'Expected DOM element not to have attribute "' + attr +
                      '" but it is present' + (ret ? ' with value of "' + actualValue + '"' : '');
            }
            else {
                msg = ret
                    ? 'DOM element has attribute "' + attr + '"'
                    : 'Expected DOM element to have attribute "' + attr + '" ' +
                      'but the attribute is not present';
            }
        }
        // Whoa, if we're matching an attribute NOT to have a GIVEN value,
        // what does that even mean? Any other attribute is valid except
        // the expected one? Surely that can't be a sane expectation?
        // It is weird and unlikely but who knows, typos happen.
        else if (this.isNot) {
            ret = false;
            msg = 'Expecting an attribute NOT to have value of "' + expectedValue +
                  '"? Hey that must be an error!';
        }
        else {
            // getAttribute always returns strings but many attributes contain
            // numerical values (tabIndex, etc) and we can accommodate for that
            // so that the dev wouldn't have to remember to write expectations
            // for strings all the time. Makes life a bit easier.
            actualValue = typeof expectedValue === 'number' ? +actualValue : actualValue;
            
            // When we are expecting the element to have attribute with a value,
            // it matches when:
            //  - Attribute is present AND
            //  - Attribute value matches
            //
            ret = hasAttr && actualValue === expectedValue;
            
            msg = ret
                ? 'DOM element has attribute "' + attr + '" with value of "' + expectedValue + '"'
                : (hasAttr
                    ? 'Expected DOM element to have attribute "' + attr + '" with value of "' +
                      expectedValue + '" but the actual value is "' + actualValue + '"'
                    : 'Expected DOM element to have attribute "' + attr + '" with value of "' +
                      expectedValue + '" but the attribute is not present'
                );
        }
    }
    else {
        msg = "Expected DOM element but got " + jazzman.pp(target);
        ret = false;
    }
    
    this.message = msg;
    
    return ret;
};

jazzman.Matchers.prototype.toHaveAttr = jazzman.Matchers.prototype.toHaveAttribute;

/*
 * Check that the DOM element has the expected position.
 *
 * @param {Number} x
 * @param {Number} y
 */
jazzman.Matchers.prototype.toBePositionedAt = function(x, y) {
    var xy = this.actual.getXY();
    
    this.message = "Expected Ext.Element to be positioned at (" + x + "," + y +
                   ") but was positioned at (" + xy[0] + "," + xy[1] + ")";
    
    return xy[0] === x && xy[1] === y;
};

/*
 * Matcher that checks that the expected exception was thrown by the actual.
 *
 * @param {String} [expected]
 */
jazzman.Matchers.prototype.toThrow = function(expected) {
    var global = Ext.global,
        oldOnError = window.onError,
        result = false,
        exception, not;
    
    if (typeof this.actual !== 'function') {
        throw new Error('Actual is not a function');
    }
    
    // mock the console to avoid logging to the real console during the tests
    Ext.global = {
        console: {
            dir: function(s) {
                return s;
            },
            log: function(s) {
                return s;
            },
            error: function(s) {
                return s;
            },
            warn: function(s) {
                return s;
            }
        }
    };
    
    // This is to allow setting breakpoints for console messages
    // that are not expected to be suppressed by jazzman.toThrow and alike
    Ext.global.console.dir.$emptyFn = Ext.global.console.log.$emptyFn = true;
    Ext.global.console.error.$emptyFn = Ext.global.console.warn.$emptyFn = true;
    
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
    
    Ext.global = global;
    
    // IE8 throws "Not implemented" when trying to assign undefined
    window.onerror = oldOnError || null;
    
    not = this.isNot ? "not " : "";
    
    this.message = function() {
        if (exception && (expected === jazzman.undefined ||
            !this.env._contains(exception.message || exception, expected.message || expected))) {
            return [
                "Expected function " + not + "to throw",
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

// This is not a real matcher, it is only used to add a failed resource leak check
// result to the spec.
jazzman.Matchers.prototype.toCleanup = function(desc, depth) {
    if (jazzman.DEBUGGING_MODE) {
        jazzman.console.log(desc + ' resource leaks:');
        jazzman.console.dir(this.actual);
    }

    this.message = 'Leaked resource ' + desc + ': ' + jazzman.pp(this.actual, depth);
    
    return false;
};

(function() {
    var layoutFly, browsers, elementPropGetters;
    
    browsers = [
        "IE6", "IE7", "IE8", "IE9", "IE10", "IE11", "IE",
        "Gecko3", "Gecko4", "Gecko5", "Gecko10", "Gecko",
        "FF3_6", "FF4", "FF5",
        "Chrome",
        "Safari2", "Safari3", "Safari4", "Safari5", "Safari6", "Safari7", "Safari8", "Safari9",
        "Safari"
    ];

    elementPropGetters = {
        x: function(el, root) {
            var x = el.getX(),
                x0 = root ? root.el.getX() : el.getX();
                
            return x - x0;
        },
        y: function(el, root) {
            var y = el.getY(),
                y0 = root ? root.el.getY() : el.getY();
                
            return y - y0;
        },
        w: function(el) {
            return el.dom.offsetWidth;
        },
        h: function(el) {
            return el.dom.offsetHeight;
        },
        xywh: function(el, root) {
            var x = el.getX(),
                x0 = root ? root.el.getX() : el.getX(),
                y = el.getY(),
                y0 = root ? root.el.getY() : el.getY(),
                w = el.dom.offsetWidth,
                h = el.dom.offsetHeight,
                dims = [];
            
            dims.push(x - x0, y - y0, w, h);
            
            return dims.join(' ');
        },
        d: function(el) {
            // display != none
            return el.isVisible(true, 1);
        },
        v: function(el) {
            // visibility != hidden
            return el.isVisible(true, 2);
        },
        dv: function(el) { //
            // display != none && visibility != hidden
            return el.isVisible(true, 3);
        },
        cls: function(el) {
            return el.dom.className;
        }
    };
    
    function browserCheck(expected) {
        var browser, i, len;
        
        if (Ext.isNumeric(expected) || Ext.isArray(expected)) {
            return expected;
        }
        
        for (i = 0, len = browsers.length; i < len; i++) {
            browser = browsers[i];
            
            if (expected.hasOwnProperty(browser) && Ext["is" + browser]) {
                return expected[browser];
            }
        }
        
        return expected['*'] || expected;
    }
    
    function checkLayout(comp, layout, root, path) {
        Ext.Object.each(layout, function(name, value) {
            var el, dims;
            
            if (name === 'items' || name === 'dockedItems') {
                Ext.Object.each(value, function(id, sub) {
                    var isNum = String(parseInt(id, 10)) === id,
                        child = isNum
                            ? comp[name].items[parseInt(id, 10)]
                            : (comp.getComponent(id) || comp.child(id));
                    
                    if (isNum) {
                        id = '.' + name + '[' + id + ']';
                    }
                    else if (id.charAt(0) !== ':') {
                        id = '_' + id;
                    }
                    
                    if (child) {
                        checkLayout(child, sub, comp, path + id);
                    }
                    else {
                        expect(id).toBe('found!');
                    }
                });
            }
            else {
                // the name is an element name like 'body'
                el = comp[name];
                
                if (!el) {
                    layoutFly = layoutFly || new Ext.dom.Fly();
                    
                    // no child el matched, assume the key is a CSS selector
                    el = layoutFly.attach(comp.el.selectNode(name, true));
                }

                if (!el) {
                    throw '"' + name + '" not found on ' + jazzman.pp(comp);
                }
                
                if (el.isComponent) {
                    checkLayout(el, value, el.ownerCt, path + '_' + name);
                }
                else if (el.dom) {
                    value = browserCheck(value);
                    
                    if (value.xywh) {
                        dims = value.xywh.split(' ');
                        
                        value.x = eval('(' + dims[0] + ')');
                        value.y = eval('(' + dims[1] + ')');
                        value.w = eval('(' + dims[2] + ')');
                        value.h = eval('(' + dims[3] + ')');
                        
                        delete value.xywh;
                    }
                    
                    Ext.Object.each(value, function(prop, expected) {
                        var actual, pfx;

                        actual = elementPropGetters[prop](el, root || comp.el);
                        pfx = (path ? path + '.' : '') + name + '.' + prop + '=';

                        if (Ext.isArray(expected)) {
                            if (actual < expected[0] || actual > expected[1]) {
                                expect(pfx + '=' + actual).toBe('in [' + expected[0] + ',' + expected[1] + ']');
                            }
                        }
                        else if (actual !== expected) {
                            expect(pfx + actual).toEqual(expected);
                        }
                    });
                }
            }
        });
    }
    
    jazzman.Matchers.prototype.toHaveLayout = function(expected) {
        var comp = this.actual;
        
        checkLayout(comp, expected, comp.ownerCt, comp.xtype);
        
        return true;
    };
})();

jazzman.Env.prototype.preventGarbageCollection = function(cmp) {
    var cache = Ext.cache,
        nodes, node, el, i, len;
    
    if (cmp.rendered) {
        el = cache[cmp.el.id];
        
        if (el) {
            el.skipGarbageCollection = true;
            
            nodes = el.dom.querySelectorAll('*');
            
            for (i = 0, len = nodes.length; i < len; i++) {
                node = nodes[i];
                el = node.id && cache[node.id];
                
                if (el) {
                    el.skipGarbageCollection = true;
                }
            }
        }
    }
};

jazzman.Env.prototype.addAllowedListener = function(eventName) {
    var listeners = Ext.GlobalEvents.events[eventName];

    listeners = listeners && listeners.listeners;

    if (listeners) {
        this.allowedListeners[eventName] = Ext.Array.push(
            this.allowedListeners[eventName] || [],
            listeners[listeners.length - 1]);
    }
};

jazzman.Env.prototype._allowComponent = function(cmp, preventDestruction, marker) {
    this.allowedComponents[cmp.id] = true;
    cmp.$allowedComponent = marker;
    
    if (cmp.rendered) {
        cmp.el.dom.setAttribute('data-sticky', marker);
    }
    
    if (preventDestruction && !cmp.$originalDestroy) {
        cmp.$originalDestroy = cmp.destroy;
        
        cmp.destroy = function() {
            if (this.$allowedComponent) {
                spec = jazzman.env.currentSpec;
                
                if (spec) {
                    jazzman.console.error(spec.getFullName() + ' attempted to destroy ' + this.id);
                    spec.fail('attempted to destroy ' + this.id);
                }
                else {
                    jazzman.console.error('Attempted to destroy allowed component: ' + this.id);
                }
            }
            else {
                this.$originalDestroy.call(this);
            }
        };
    }
};

jazzman.Env.prototype.addAllowedComponent = function(cmp, preventDestruction, marker) {
    var suite, descendants, i, len;
    
    // This could be a string in certain cases
    if (cmp.charAt) {
        this.allowedComponents[cmp] = true;
        
        return;
    }
    
    if (marker == null) {
        suite = this.currentSuite;
        marker = !suite || suite.isRootSuite ? true : suite.getFullName();
    }

    this._allowComponent(cmp, preventDestruction, marker);
    
    if (cmp.query) {
        descendants = cmp.query('*');
        
        for (i = 0, len = descendants.length; i < len; i++) {
            this._allowComponent(descendants[i], preventDestruction, marker);
        }
    }
};

jazzman.Env.prototype._disallowComponent = function(cmp, marker) {
    delete this.allowedComponents[cmp.id];
    
    // $allowedComponent could have been removed already
    if (cmp.$allowedComponent != null && cmp.$allowedComponent !== marker) {
        throw new Error("Mismatched $allowedComponent: " + marker + " on component " + cmp.id);
    }
    
    delete cmp.$allowedComponent;
    
    if (cmp.rendered && cmp.el.dom.hasAttribute('data-sticky')) {
        if (cmp.el.dom.getAttribute('data-sticky') !== ('' + marker)) {
            throw new Error(
                "Mismatched data-sticky: " + cmp.el.dom.getAttribute('data-sticky') +
                " on el " + cmp.el.id
            );
        }
        
        cmp.el.dom.removeAttribute('data-sticky');
    }
    
    if (cmp.$originalDestroy) {
        cmp.destroy = cmp.$originalDestroy;
        delete cmp.$originalDestroy;
    }
};

jazzman.Env.prototype.removeAllowedComponent = function(cmp, marker) {
    var suite, descendants, i, len;
    
    if (marker == null) {
        suite = this.currentSuite;
        marker = !suite || suite.isRootSuite ? true : suite.getFullName();
    }
    
    this._disallowComponent(cmp, marker);
    
    if (cmp.query) {
        descendants = cmp.query('*');
        
        for (i = 0, len = descendants.length; i < len; i++) {
            this._disallowComponent(descendants[i], marker);
        }
    }
};

jazzman.Env.prototype.pushResources = function() {
    this.allowedResourceStack.push({
        allowedGlobalVariables: this.allowedGlobalVariables,
        originalWindowPropertiesCount: this.originalWindowPropertiesCount,
        allowedComponents: this.allowedComponents,
        allowedListeners: this.allowedListeners
    });
    
    this.allowedGlobalVariables = jazzman.object.clone(this.allowedGlobalVariables);
    this.allowedComponents = jazzman.object.clone(this.allowedComponents);
    this.allowedListeners = jazzman.object.clone(this.allowedListeners);
};

jazzman.Env.prototype.popResources = function() {
    var suite = this.currentSuite,
        resources, marker, timerId, items, item, i, len;
    
    marker = !suite || suite.isRootSuite ? true : suite.getId();
    
    if (Ext.ComponentMgr) {
        items = Ext.ComponentMgr.getAll();
        
        for (i = 0, len = items.length; i < len; i++) {
            item = items[i];
            
            if (item.$allowedComponent === marker) {
                this.removeAllowedComponent(item, marker);
            }
        }
    }
    
    items = jazzman.Clock.scheduledFunctions;
    
    for (timerId in items) {
        item = items[timerId];
        
        if (item.$allowedTimer === marker) {
            delete item.$allowedTimer;
        }
    }
    
    resources = this.allowedResourceStack.pop();
    
    if (resources) {
        this.allowedGlobalVariables = resources.allowedGlobalVariables;
        this.originalWindowPropertiesCount = resources.originalWindowPropertiesCount;
        this.allowedComponents = resources.allowedComponents;
        this.allowedListeners = resources.allowedListeners;
    }
};

jazzman.Env.prototype.enumerateResources = function(preventDestruction, marker) {
    var global = jazzman.getGlobal(),
        allowedGlobals = this.allowedGlobalVariables,
        allowedListeners = this.allowedListeners,
        globalEvents = Ext.globalEvents && Ext.globalEvents.events,
        items, item, eventName, listeners, event, i, len;
    
    // Any properties already in the window object are ok
    items = jazzman.object.keys(global);
    this.originalWindowPropertiesCount = len = items.length;
        
    for (i = 0; i < len; i++) {
        item = items[i];
        allowedGlobals[item] = true;
    }
    
    if (Ext.ComponentMgr) {
        items = Ext.ComponentMgr.getAll();
        
        for (i = 0, len = items.length; i < len; i++) {
            item = items[i];
            
            if (!item.$allowedComponent) {
                this.addAllowedComponent(item, preventDestruction, marker);
            }
        }
    }
    
    if (globalEvents) {
        for (eventName in globalEvents) {
            event = globalEvents[eventName];
            listeners = allowedListeners[eventName] = [];
            
            for (i = 0, len = event.listeners.length; i < len; i++) {
                listeners.push(event.listeners[i]);
            }
        }
    }
    
    // There's no way to reliably associate a scheduled timer with a component
    // to check if the timer was scheduled by an allowed component or not.
    // So we have to pretend that any timers scheduled at this time are allowed.
    items = jazzman.Clock.scheduledFunctions;
    
    for (event in items) {
        item = items[event];
        
        if (!item.$skipTimerCheck) {
            item.$allowedTimer = marker;
        }
    }
};

jazzman.Env.prototype.checkResourceLeaks = function(spec) {
    var body = document.body,
        fail = false,
        specName, focusPublisher, items, i, len;

    // Check that once the viewport scroller has been created, it is left alone
    // and never destroyed. Viewports may come and go, but the global document
    // scroller should not be destroyed.
    if (Ext.scroll) {
        if (!jazzman.viewportScroller) {
            jazzman.viewportScroller = Ext.scroll.Scroller.viewport;
        }
        // TODO: Fix the persistence of the body/Viewport scroller in classic.
        else if (Ext.isModern) {
            if (!Ext.scroll.Scroller.viewport) {
                spec.fail('Removed the Ext.scroll.Scroller.viewport reference');
            }
            else if (Ext.scroll.Scroller.viewport.destroyed) {
                spec.fail('Destroyed the Ext.scroll.Scroller.viewport reference');
            }
        }
    }

    specName = spec.getFullName(true);

    // Clear any tracked touches.
    if (Ext.testHelper) {
        Ext.testHelper.reset();
    }

    // Clear any gesture handlers which may be in progress or waiting for something.
    // We don't have a clear strategy on how to meaningfully fail tests that leave
    // pending gesture timers, so just clear them before running dangling scheduled
    // timers check.
    if (Ext.event && Ext.event.publisher) {
        if (Ext.event.publisher.Gesture) {
            // Not sure what to do with these
            if (Ext.event.publisher.Gesture.instance.reEnterCount) {
                // When using synthetic events errors thrown in event handlers cannot
                // be caught from outside the el.dipatchEvent() call.
                // The best we can do is fail the spec - the browser typically logs the
                // error to the console.
                spec.fail('Unhandled exception in event handler. See log for details.');
            }
            
            items = Ext.event.publisher.Gesture.instance.activeTouches;
            
            // Not sure what to do with these either?
            if (items.length) {
                spec.expect(items).toCleanup('Ext.event.publisher.Gesture active touches');
                fail = true;
            }
            
            Ext.event.publisher.Gesture.instance.reset();
        }
        
        if (Ext.event.gesture && Ext.event.gesture.DoubleTap) {
            Ext.event.gesture.DoubleTap.instance.reset();
        }
        
        if (Ext.event.gesture && Ext.event.gesture.LongPress) {
            Ext.event.gesture.LongPress.instance.reset();
        }
        
        if (Ext.event.publisher.Focus) {
            focusPublisher = Ext.event.publisher.Focus.instance;
            focusPublisher.previousActiveElement = null;
        }
    }

    // Clear any pending ZIndexManager response to window resize
    if (Ext.WindowManager) {
        Ext.Function.cancelAnimationFrame(Ext.WindowManager.containerResizeTimer);
        Ext.WindowManager.containerResizeTimer = null;
    }

    if (jazzman.CHECK_LEAKS) {
        if (Ext.util.Scheduler && Ext.util.Scheduler.instances && Ext.util.Scheduler.instances.length) {
            while (Ext.util.Scheduler.instances.length) {
                Ext.util.Scheduler.instances[Ext.util.Scheduler.instances.length - 1].destroy();
            }
            
            spec.fail("Spec has left Ext.util.Scheduler instances");
        }

        // The number of classes counted at test start must remain
        if (Ext.ClassManager.classCount < this.baseClassCount) {
            spec.fail("Some of the framework's classes have been undefined");
        }
    
        // Certain system timers must be exempt from destruction.
        // But remove all their tasks between Specs.
        if (Ext.state && Ext.state.Stateful.runner) {
            Ext.state.Stateful.runner.stopAll(true);
        }
        
        // Do not allow pending animations to hang over into the next spec.
        // Their target elements will have been destroyed.
        if (Ext.fx && Ext.fx.Manager) {
            // Finish them off quickly
            if (Ext.fx.Manager.items.length) {
                items = Ext.fx.Manager.items.getRange();
                
                spec.expect(items).toCleanup('Ext.fx.Anim animations');
                
                for (i = 0, len = items.length; i < len; i++) {
                    items[i].jumpToEnd();
                }
                
                fail = true;
                items = null;
                
                Ext.fx.Manager.clear();
            }
        }
        
        if (Ext.AnimationQueue) {
            if (Ext.AnimationQueue.queue.length) {
                // This is a battle for another day
                // spec.expect(Ext.AnimationQueue.queue.slice()).toCleanup('Ext.AnimationQueue animations');
                // fail = true;
                Ext.AnimationQueue.clear();
            }
        }
        
        if (Ext.TaskQueue) {
            // This, too is a battle for another day
            // if (
            // Slice here because of very interesting bugs involving console.dir & arguments
            // (Ext.TaskQueue.readQueue.length &&
            //  this.checkTaskQueue(Ext.TaskQueue.readQueue.slice(), 'readQueue', spec, specName)) ||
            // (Ext.TaskQueue.writeQueue.length &&
            //  this.checkTaskQueue(Ext.TaskQueue.writeQueue.slice(), 'writeQueue', spec, specName))
            // )
            if (Ext.TaskQueue.readQueue.length || Ext.TaskQueue.writeQueue.length) {
                // fail = true;
                Ext.TaskQueue.clear();
            }
        }
        
        if (Ext.draw && Ext.draw.Animator) {
            if (Ext.draw.Animator.animations.length) {
                spec.expect(Ext.draw.Animator.animations).toCleanup('Ext.draw.Animator animations');
                fail = true;
                Ext.draw.Animator.clear();
            }
        }
    
        if (Ext.promise) {
            if (Ext.promise.Consequence.queueSize) {
                // The problem with leaked Promises is that we can't do anything about them.
                // leaks = [];
                //                 
                // for (i = 0, len = Ext.promise.Consequence.queueSize; i < len; i++) {
                //     leaks.push(Ext.promise.Consequence.queue[i]);
                // }
                //                 
                // spec.expect(leaks).toCleanup('Ext.promise.Consequence queue');
                // fail = true;
                // leaks.length = 0;

                // dwg - That would include this:
                // Ext.promise.Consequence.queueSize = 0;
                // dwg - The problem is when a then(done()) is called, we are in the
                // promise chain of the last spec... For example the modern panel
                // collapser suite.
            }
        }

        if (Ext.data) {
            // Prototype corruption is quite rare and checks are not free;
            // so we only run them when debugging. They're also especially expensive
            // in IE8- because of missing Object.keys; the chance of code that corrupts
            // any of those prototypes being IE8 specific is sort of rare.
            if (jazzman.DEBUGGING_MODE && !jazzman.browser.isIE8m) {
                if (Ext.data.Store && this.checkPrototype(Ext.data.Store, spec, specName)) {
                    fail = true;
                }
                
                if (Ext.data.ProxyStore && this.checkPrototype(Ext.data.ProxyStore, spec, specName)) {
                    fail = true;
                }
                
                if (Ext.data.BufferedStore && this.checkPrototype(Ext.data.BufferedStore, spec, specName)) {
                    fail = true;
                }
            }
            
            if (Ext.data.StoreManager) {
                if (this.checkDataStores(spec)) {
                    fail = true;
                }
                
                Ext.data.StoreManager.clear();
            }
        }
        
        // In IE8- implicit global variables create non-enumerable properties in window object,
        // which basically means they're undetectable unless we know for sure that such properties
        // exist and what are their names. On the other hand, iterating over window properties
        // is VERY expensive, especially so in slow IE8. So we skip this check hoping that other
        // browsers will detect runaway globals.
        if (!jazzman.browser.isIE8m) {
            if (this.checkGlobalVariables(spec)) {
                fail = true;
            }
        }
        
        if (Ext.GlobalEvents && this.checkGlobalListeners(spec)) {
            fail = true;
        }

        if (Ext.isModern) {
            if (this.checkModalMasks(spec)) {
                fail = true;
            }
        }
        else if (Ext.Component) {
            if (this.checkLayoutSuspension(spec)) {
                fail = true;
            }
            
            if (this.checkFocusSuspension(spec)) {
                fail = true;
            }

            if (Ext.MessageBox && Ext.MessageBox.isVisible()) {
                Ext.MessageBox.hide();
            }
        }

        if (Ext.Element) {
            // This function checks if element instance has been modified, with any extra
            // methods being added that obscure the methods inherited from the prototype.
            // Unfortunately IE8- lacks Object.keys and the only way to compare an object
            // to its prototype is to iterate over all properties. This is extremely expensive,
            // on the order of 50% of the time spent checking leaks; and that adds up a lot.
            // The chance of such elements being modified only in IE8 is non-zero but at the time
            // there are no unit tests failing for this reason, so incurring all that expense
            // for that unlikely case seems to be a waste.
            if (!jazzman.browser.isIE8m && this.checkImportantElements(spec)) {
                fail = true;
            }
            
            if (this.collectDomGarbage(spec, specName)) {
                fail = true;
            }
        }
        
        if (this.checkTaskManager(spec)) {
            fail = true;
        }
        
        if (this.checkTimers(spec, specName)) {
            fail = true;
        }
        
        if (Ext.ComponentMgr) {
            if (this.checkComponents(spec, specName)) {
                fail = true;
            }
        }
        
        if (Ext.drag && Ext.drag.Manager) {
            if (this.checkDragTargets(spec, specName)) {
                fail = true;
            }
        }
        
        // Returns true if failed. DOM check should run AFTER component check,
        // to clean the document body in case there are any undestroyed Components!
        if (this.checkDom(spec)) {
            fail = true;
        }
    }

    // Ensure tests are scrolled to top to avoid iframe pointer position bugs.
    if (this.bodyScrolled && (body.scrollTop || body.scrollLeft)) {
        this.bodyScrolled = false;
        body.scrollTop = body.scrollLeft = 0;

        // Force synchronous layout
        if (Ext.isIE) {
            body.style.width = (body.offsetWidth + 1) + 'px';
            body.clientWidth;
            body.style.width = '';
        }
    }
    
    if (fail) {
        spec.fail('Failed one or more resource leak checks, see expectation results.');
    }

    // In TC testing, ensure body is refocused in case focus left on an indeterminate element
    // This can happen when elements are removed.
    // eslint-disable-next-line dot-notation
    if (top.Cmd && top.Cmd['native']) {
        if (focusPublisher) {
            focusPublisher.$suspendEvents = true;
        }
        
        if (Ext.GlobalEvents) {
            Ext.GlobalEvents.suspendEvents();
        }
        
        document.body.focus();
        
        if (focusPublisher) {
            delete focusPublisher.$suspendEvents;
        }
        
        if (Ext.GlobalEvents) {
            Ext.GlobalEvents.resumeEvents();
        }
    }
    
    // Ext.dom.Fly has a global cache of flyweight instances (?!)
    // that, when populated with named Fly entities, will hold on the
    // referenced HtmlElement instances forever.
    // It is not clear what consequences would ensue if we remove this
    // caching completely or even touch it in any way, so we just
    // clean this cache after the test is done to ease GC burden.
    // Assignment is intentional.
    if (Ext.dom && Ext.dom.Fly) {
        if (items = Ext.dom.Fly.cache) {
            for (i in items) {
                delete items[i];
            }
        }
    }
    
    // All visible components gone, so scrollPosition will be 0.
    // Viewport must not carry over stale scroll position.
    // The reportSpecResults call can fire a scroll event.
    if (Ext.scroll && Ext.scroll.Scroller && Ext.scroll.Scroller.viewport) {
        delete Ext.scroll.Scroller.viewport.trackingScrollTop;
        
        if (Ext.scroll.Scroller.viewport.onDomScrollEnd) {
            clearTimeout(Ext.scroll.Scroller.viewport.onDomScrollEnd.timer);
        }
    }
};

jazzman.Env.prototype.checkDom = function(spec) {
    var body = document.body,
        children = body && body.childNodes || [],
        len = children.length,
        bodyRegion, leaks, badNodes, stickies, child, i, fail;

    if (len) {
        badNodes = [];
        stickies = [];
        
        for (i = 0; i < len; i++) {
            child = children[i];
            
            // Only Element nodes support getAttribute
            if (child.nodeType === 1 && child.getAttribute('data-sticky')) {
                stickies.push(child);
            }
            else {
                badNodes.push(child);
            }
        }
        
        if (len = badNodes.length) {
            leaks = [];
            
            for (i = 0; i < len; i++) {
                child = badNodes[i];
                
                // Yeah this "pretty printing" is pretty lame but it's quick
                // and the result is much better than one long string with outerHTML
                leaks.push(child.tagName + (child.id ? '#' + child.id : '') +
                           (!jazzman.browser.isIE9m
                               ? ': ' + child.outerHTML.split('><').join('>\n<')
                               : ''));
                
                body.removeChild(child);
            }
            
            if (leaks.length) {
                spec.expect(leaks).toCleanup('DOM nodes');
                fail = true;
            }
            
            leaks.length = 0;
        }
        
        // See if there are any visible sticky elements left which obscure the body
        // and prevent mouse interactions from reaching the body.
        // Any tests which leave such elements around fail.
        if (len = stickies.length && Ext.Element) {
            bodyRegion = jazzman._bodyRegion;
            leaks = leaks || [];
            
            for (i = 0; i < len; i++) {
                child = Ext.get(stickies[i]);
                
                if (child.isVisible() && bodyRegion.intersect(child.getRegion()) &&
                    child.getStyle('pointer-events') !== 'none') {
                    leaks.push(child.dom.tagName + (child.id ? '#' + child.id : '') +
                               (!jazzman.browser.isIE9m
                                   ? ': ' + child.dom.outerHTML.split('><').join('>\n<')
                                   : ''));
                    child.destroy();
                }
            }
            
            if (leaks.length) {
                spec.expect(leaks).toCleanup('[data-sticky] element(s) left visible');
                fail = true;
            }
        }
    }
    
    return fail;
};

jazzman.Env.prototype.checkModalMasks = function(spec) {
    var masks = Ext.Element && Ext.Element.query('.x-mask'),
        fail = false,
        el, i;

    if (masks) {
        for (i = masks.length; i-- > 0;) {
            el = masks[i];

            if (Ext.fly(el).isVisible()) {
                spec.expect('Modal mask ' + el.id).toBe('not visible');
                fail = true;
            }
        }
    }

    return fail;
};

jazzman.Env.prototype.checkGlobalListeners = function(spec) {
    var events = Ext.GlobalEvents.events,
        allowedListeners, allowedComponents, eventNames, eventName, event,
        listeners, referenceListeners, scope, fail, leaks,
        listener, leaksFound, evCtr, evLen, i, len;
    
    eventNames = jazzman.object.keys(events);
    evLen = eventNames.length;

    if (evLen) {
        allowedListeners = this.allowedListeners;
        allowedComponents = this.allowedComponents;
        leaks = [];
        
        for (evCtr = 0; evCtr < evLen; evCtr++) {
            eventName = eventNames[evCtr];
            event = events[eventName];
            listeners = event.listeners;
            
            referenceListeners = allowedListeners[eventName];
            
            if (!referenceListeners) {
                for (i = 0, len = listeners.length; i < len; i++) {
                    leaks.push(listeners[i]);
                }
                
                // This is a crude version of cleanup that should do for now
                delete events[eventName];
            }
            else {
                leaksFound = false;
                
                for (i = 0, len = listeners.length; i < len; i++) {
                    listener = listeners[i];
                    
                    if (listener !== referenceListeners[i]) {
                        scope = listener.scope;

                        // Check for anonymous or dissallowed components that
                        // have caused a leak
                        if (!scope || (scope && !allowedComponents[scope.id])) {
                            leaksFound = true;
                            leaks.push(listener);
                        }
                        
                        scope = null;
                    }
                }
                
                // Ditto
                if (leaksFound) {
                    event.listeners = [];
                    
                    for (i = 0, len = referenceListeners.length; i < len; i++) {
                        event.listeners.push(referenceListeners[i]);
                    }
                }
            }
        }
        
        if (leaks.length) {
            spec.expect(leaks).toCleanup('GlobalEvents listeners');
            fail = true;
        }
    }
    
    return fail;
};

jazzman.Env.prototype.checkComponents = function(spec, specName) {
    var allowedComponents = this.allowedComponents,
        quicktip, leaks, components, registeredQuicktips, id, i, len, cmp, cmpRoot, fail;

    if (Ext.ComponentMgr && Ext.ComponentMgr.count > 0) {
        components = Ext.ComponentMgr.all;
        leaks = [];
        
        for (id in components) {
            cmp = components[id];
            
            if (cmp.$allowedComponent) {
                continue;
            }
            
            // We must also check whether a potentially leaked component is WITHIN
            // an allowed component. It may have been added after the allowed component
            // list was created.
            cmpRoot = !cmp.destroyed && cmp.up(':not({getRefOwner && c.getRefOwner()})');
            
            // Allow QuickTips by default, they're mostly harmless
            if (!(allowedComponents[cmp.id] || (cmpRoot && allowedComponents[cmpRoot.id])) &&
                !(cmp.isQuickTip || (cmp.up && cmp.up('[isQuickTip]')))) {
                leaks.push(cmp);
            }
        }

        quicktip = Ext.tip && Ext.tip.QuickTipManager && Ext.tip.QuickTipManager.getQuickTip();
    
        if (quicktip && (registeredQuicktips = jazzman.object.keys(quicktip.targets)).length) {
            if (jazzman.DEBUGGING_MODE) {
                jazzman.console.error('QUICKTIPS STILL REGISTERED AFTER SPEC: ' + specName);
                jazzman.console.dir(registeredQuicktips);
            }
            
            spec.expect(registeredQuicktips).toCleanup("Registered QuickTips targets");
            
            // Do the clean up because this could cause failure in subsequent tests
            for (i = 0, len = registeredQuicktips.length; i < len; i++) {
                Ext.tip.QuickTipManager.unregister({
                    id: registeredQuicktips[i]
                });
            }
            
            fail = true;
        }
    }

    if (leaks && leaks.length) {
        if (jazzman.DEBUGGING_MODE) {
            jazzman.console.error('CLEAN UP YOUR COMPONENT LEAKS IN SPEC: ' + specName);
            jazzman.console.dir(leaks);
        }
        
        spec.expect(leaks).toCleanup("Undestroyed components");
        
        for (i = 0, len = leaks.length; i < len; i++) {
            // We don't destroy the leaked components so that they could be examined,
            // just unregistering them from ComponentManager cache is enough.
            Ext.ComponentMgr.unregister(leaks[i]);
        }
        
        fail = true;
    }
    
    return fail;
};

jazzman.Env.prototype.checkDragTargets = function(spec, specName) {
    var targets = Ext.drag.Manager.targets,
        fail = false,
        target, leaks, i, len;
    
    for (i in targets) {
        target = targets[i];
        
        if (target.spec === spec) {
            leaks = leaks || [];
            
            leaks.push(target);
        }
    }
    
    if (leaks && leaks.length) {
        if (jazzman.DEBUGGING_MODE) {
            jazzman.console.error('CLEAN UP YOUR DRAG TARGET LEAKS IN SPEC: ' + specName);
            jazzman.console.dir(leaks);
        }
        
        spec.expect(leaks).toCleanup("Undestroyed drag targets");
        
        for (i = 0, len = leaks.length; i < len; i++) {
            if (jazzman.CI_ENVIRONMENT) {
                leaks[i].destroy();
            }
            else {
                Ext.drag.Manager.unregister(leaks[i]);
            }
        }
        
        fail = true;
    }
    
    return fail;
};

jazzman.Env.prototype.checkGlobalVariables = function(spec) {
    var allowedGlobals, props, property, value, leaks, fail, i, len;
    
    // This is a very hot code path so care is taken not go assign any variables
    // or do anything at all unless we're fairly sure there are some leaks
    // to be detected.
    props = jazzman.object.keys(window);
    len = props.length;
    
    // We mostly defend against implicit global variable assignments, or explicit
    // window property assignments not properly cleaned up. In both cases we will
    // have extra properties in window object, so len should be > original count.
    // It is possible that some properties will be added while some other properties
    // will be deleted from window so that count check will yield false negative;
    // however this scenario is unlikely.
    // Note that in IE8- implicit global variables create non-enumerable properties
    // in window object, so there is no way to detect those without knowing for a fact
    // that they are there. Which sort of beats the check.
    if (len !== this.originalWindowPropertiesCount) {
        allowedGlobals = this.allowedGlobalVariables;
        leaks = [];
        
        for (i = 0; i < len; i++) {
            property = props[i];
            
            // Do not read the value unless we need to because
            // that can trigger DOM layouts.
            if (property in window && !allowedGlobals[property]) {
                try {
                    // IE throws error when trying to access window.localStorage
                    value = window[property];
                }
                catch (e) {
                    continue;
                }
                
                /* eslint-disable indent */
                if (!value || // make sure we don't try to do a property lookup on a null value
                    // old browsers (IE6 and opera 11) add element IDs as enumerable properties
                    // of the window object, so make sure the global var is not a HTMLElement
                    value.nodeType !== 1 &&
                    // make sure it isn't a reference to a window object.  This happens in
                    // some browsers (e.g. IE6) when the document contains iframes.  The
                    // frames' window objects are referenced by id in the parent window object.
                    !(value.location && value.document)) {
                        fail = true;
                        leaks.push(property + ' = ' + jazzman.pp(value));
                        // add the bad global to allowed globals so that it only fails this one spec
                        allowedGlobals[property] = true;
                }
                /* eslint-enable indent */
            }
        }
        
        if (fail) {
            spec.expect(leaks).toCleanup('Global variables');
        }
    }
    
    return fail;
};

jazzman.Env.prototype.checkLayoutSuspension = function(spec) {
    var count = Ext.Component.layoutSuspendCount,
        fail;
    
    if (count !== 0) {
        spec.fail('Spec completed with layouts suspended: count=' + count);
        Ext.Component.layoutSuspendCount = 0;
        fail = true;
    }
    
    if (Ext.Component.runningLayoutContext) {
        spec.fail('Spec completed with running layout:\n', Ext.Component.runningLayoutContext);
        Ext.Component.runningLayoutContext = Ext.destroy(Ext.Component.runningLayoutContext);
        fail = true;
    }
    
    if (Ext.Component.pendingLayouts) {
        // Not a failure condition if the test hasn't waited around for another scheduled
        // layout run.
        Ext.Component.pendingLayouts = Ext.destroy(Ext.Component.pendingLayouts);
    }
    
    return fail;
};

jazzman.Env.prototype.checkFocusSuspension = function(spec) {
    var count;
    
    // If the ExtJS version supports focus suspension...
    if (Ext.suspendFocus) {
        count = Ext.event.publisher.Focus.instance.suspendCount;
        
        if (count) {
            spec.fail('Spec completed with focus suspended: count=' + count);
            Ext.event.publisher.Focus.instance.suspendCount = 0;
            
            return true;
        }
    }
};

jazzman.Env.prototype.checkImportantElements = function(spec) {
    var elProto = Ext.dom.Element.prototype,
        elements = this.importantElementInstances,
        allowedMethods = this.allowedImportantElementInstanceMethods,
        leaks = [],
        fail, el, props, prop, elCounter, elLen, i, len;
    
    for (elCounter = 0, elLen = elements.length; elCounter < elLen; elCounter++) {
        el = elements[elCounter];
        props = jazzman.object.keys(el);
        
        for (i = 0, len = props.length; i < len; i++) {
            prop = props[i];
            
            if (typeof el[prop] === 'function' && (prop in elProto) && !allowedMethods[prop]) {
                leaks.push(el.dom.tagName + '#' + el.id + ' has property ' + prop);
                fail = true;
                
                // Do not allow this to poison subsequent specs
                delete el[prop];
            }
        }
    }
    
    if (fail) {
        spec.expect(leaks).toCleanup('Important Ext.dom.Element instance methods');
    }
    
    return fail;
};

jazzman.Env.prototype.checkDataStores = function(spec) {
    // We're bypassing public API here for the sake of performance
    var items = Ext.data.StoreManager.items,
        autoCreated = Ext.data.StoreManager.autoCreatedStores,
        itemsLen = items.length,
        autoCreatedLen = autoCreated.length,
        item, leaks, fail, i;

    // Usually there's only one store and it's the EmptyStore; that one is special
    // and is never included in autoCreatedStores.
    if (autoCreatedLen || (itemsLen && !(itemsLen === 1 && items[0] && items[0].isEmptyStore))) {
        leaks = [];
        
        for (i = 0; i < itemsLen; i++) {
            item = items[i];
            
            if (!item.isEmptyStore) {
                leaks.push(item);
            }
        }
        
        for (i = 0; i < autoCreatedLen; i++) {
            item = autoCreated[i];

            if (!item.destroyed) {
                leaks.push(item);
            }
        }
        
        if (leaks.length) {
            spec.expect(leaks).toCleanup('Store instances');
            fail = true;
        }
    }
    
    return fail;
};

jazzman.Env.prototype.checkTaskManager = function(spec) {
    var fail, tasks, task, leaks, i, len;
    
    // We have killed the TaskManager singleton's timer.
    // Ensure it knows this next time it's asked to run anything.
    if (Ext.TaskManager) {
        Ext.TaskManager.timerId = null;
        
        tasks = Ext.TaskManager.tasks;
        
        if (len = tasks.length) {
            leaks = [];
            
            for (i = 0; i < len; i++) {
                task = tasks[i];
                
                if (!task.stopped) {
                    leaks.push('Task ' + i + ': ' + (task.run.plan ? task.run.plan : task.run).toString());
                    
                    // And don't allow it to interfere with subsequent tests.
                    Ext.TaskManager.stop(task, true);
                }
            }
            
            if (leaks.length) {
                spec.expect(leaks).toCleanup('TaskManager queue');
                fail = true;
            }
            
            leaks.length = 0;
        }
    }
    
    return fail;
};

// Check for any pending setTimeout calls.
// They don't necessarily mean spec failures, it is just part of natural framework behaviour
// *but* there can be genuine runaway timers that should cause test failures. In any case
// we don't want unsafe dangling timers to poison subsequent specs.
jazzman.Env.prototype.checkTimers = function(spec, specName) {
    var clock = jazzman.Clock,
        leaks = [],
        fail, tasks, task, taskLeaks, timerId, fn, fnSource, i, len;
    
    tasks = clock.scheduledFunctions;
    
    for (timerId in tasks) {
        task = tasks[timerId];
        
        fn = task.scheduledFn.$origFn ? task.scheduledFn.$origFn : task.scheduledFn;
        
        // Some framework-wide timers are deemed safe and can fire at will
        if (!task.$skipTimerCheck && !task.$allowedTimer) {
            fnSource = fn.toString();
            
            // Some external libraries such as d3.js install timers and never clean them up.
            // Also the way WebDriver executes JavaScript involves setting timers.
            // We can't really do anything about that so let's ignore these.
            // IE doesn't support name property on Function objects.
            if (fn.name === 'poke$1' || fnSource.indexOf('poke$1') !== -1 ||
                fnSource.indexOf('StatusCode.SCRIPT_TIMEOUT') !== 1
            ) {
                task.$skipTimerCheck = true;
                continue;
            }
            
            leaks.push(fnSource + (task.created ? ', created at: ' + task.created : ''));
            
            if (jazzman.DEBUGGING_MODE) {
                // We only want to log an error in the unlikely case of runaway timers
                // started in a different spec somehow evading detection in that spec
                if (task.spec && task.spec !== specName) {
                    jazzman.console.error(task.spec + ' left scheduled timer: ');
                    jazzman.console.log(fn);
                    
                    if (task.created) {
                        jazzman.console.log(task.created);
                    }
                }
                
                jazzman.console.log('Leaked timer id: ' + timerId + ' in spec ' + specName);
                jazzman.console.log('Leaked function: ' + fnSource +
                                    (task.created ? ',\ncreated at: ' + task.created : ''));
            }
            
            taskLeaks = taskLeaks || [];
            taskLeaks.push(timerId);
        }
        // This is intentional: ($skipTimerCheck || $allowedTimer) && $clearTimer
        else if (fn.$clearTimer) {
            jazzman.clearTimeout(task.realTimeoutKey);
            delete tasks[timerId];
        }
    }
    
    if (taskLeaks && taskLeaks.length) {
        for (i = 0, len = taskLeaks.length; i < len; i++) {
            timerId = taskLeaks[i];
            
            // Don't allow it to fire in the next spec
            clock.installed.clearTimeout(timerId);
            delete tasks[timerId];
        }
    }
    
    if (leaks.length) {
        spec.expect(leaks).toCleanup('Scheduled timers');
        fail = true;
    }
    
    return fail;
};

jazzman.Env.prototype.checkTaskQueue = function(queue, type, spec, specName) {
    var fail, item, i, len;
    
    if (queue.length === 1 && queue[0].$skipResourceCheck) {
        return fail;
    }
    
    for (i = 0, len = queue.length; i < len; i++) {
        item = queue[i];
        
        if (!item.$skipResourceCheck) {
            fail = true;
            
            jazzman.console.log('Leaked Ext.TaskQueue.' + type + ' request in spec ' + specName);
            jazzman.console.dir(item);
        }
    }
    
    if (fail) {
        spec.expect(queue).toCleanup('Ext.TaskQueue.' + type, 5);
    }
    
    return fail;
};

jazzman.Env.prototype.collectDomGarbage = function(spec, specName) {
    var garbage = [],
        ids = [],
        msg = [],
        cache = Ext.cache,
        detachedBody = this.detachedBody,
        fail = false,
        tagName, eid, el, dom, isGarbage, elId, comp, events, eventName, event, listenerCount,
        i, len, j;

    for (eid in cache) {
        el = cache[eid];

        if (el.skipGarbageCollection) {
            continue;
        }

        isGarbage = false;
        dom = el.dom;

        // Should always have a DOM node
        if (!dom) {
            msg.push('Missing DOM node in element garbage collection: ' + eid);
            isGarbage = true;
        }
        else {
            try {
                tagName = dom.tagName;
                
                // In IE, accessing any properties of the window object of an orphaned iframe
                // can result in a "Permission Denied" error.  The same error also occurs
                // when accessing any properties of orphaned documentElement or body inside
                // of an iframe (documentElement and body become orphaned when the iframe
                // contentWindow is unloaded)
                isGarbage = dom.nodeType === 1 && tagName !== 'BODY' && tagName !== 'HTML' &&
                            tagName !== 'HEAD' &&
                            (!dom.parentNode || !dom.ownerDocument.body.contains(dom)) &&
                            !detachedBody.contains(dom);
            }
            catch (e) {
                // if an error was thrown in isGarbage it is most likely because we are
                // dealing with an inaccessible window or documentElement inside an orphaned
                // iframe in IE. In this case we can't do anything except remove the
                // cache entry.
                delete cache[eid];
                garbage.push(el);
                
                continue;
            }
        }
        
        if (isGarbage) {
            elId = (tagName ? tagName : '') + '#' + (el.id || eid);
            ids.push(elId);
            garbage.push(el);
            fail = true;
            
            msg.push(elId + ' is an orphan Ext.dom.Element instance');
            
            if (comp = el.comp) {
                msg.push('Owner Component ' + comp.id + '\r\nSpec: ' + comp.$spec +
                         '\r\nCreated: ' + comp.$created);
            }
            
            if (!el.destroyed) {
                // Log any active listeners
                events = jazzman.object.keys(el.events);
                
                for (i = 0, len = events.length; i < len; i++) {
                    eventName = events[i];
                    event = el.events[eventName];
                    listenerCount = event.listeners.length;
                        
                    if (listenerCount) {
                        jazzman.console.error(elId + ': event ' + eventName +
                                              ' has listeners in ' + specName + '\r\n', event);
                        
                        for (j = 0; j < listenerCount; j++) {
                            jazzman.console.log('\t   fn: ', event.listeners[j].fn);
                            
                            if (event.listeners[j].scope) {
                                jazzman.console.log('\tscope: ' + event.listeners[j].scope.$className);
                                jazzman.console.log('\t       ', event.listeners[j].scope);
                            }
                        }
                        
                        msg.push(elId + ': event ' + eventName + ' has listeners');
                    }
                }
                
                el.events = {};
            }
            
            delete cache[eid];
        }
    }

    for (i = 0, len = garbage.length; i < len; i++) {
        if (!garbage[i].destroyed) {
            garbage[i].collect();
        }
    }
    
    if (fail) {
        spec.fail(msg.join('\n'));
    }
    
    return fail;
};

jazzman.Env.prototype.checkPrototype = function(cls, spec, specName) {
    var proto = cls.prototype,
        propList = [],
        keys, propName, prop, fail, i, len;

    keys = jazzman.object.keys(proto);

    for (i = 0, len = keys.length; i < len; i++) {
        propName = keys[i];
        prop = proto[propName];
        
        if ((typeof prop === 'function') && !prop.prototype && prop.$owner !== cls) {
            fail = true;
            propList.push(propName);
        }
    }
    
    if (fail) {
        jazzman.console.error(specName + ' corrupted ' + cls.$className + "'s properties:");
        jazzman.console.error(propList.join(', '));
        spec.fail('corrupted ' + cls.$className + "'s properties: " + propList.join(', '));
    }
    
    return fail;
};

jazzman.addAllowedComponent = function(c, preventDestruction, marker) {
    this.env.addAllowedComponent(c, preventDestruction, marker);
};

jazzman.removeAllowedComponent = function(c, marker) {
    this.env.removeAllowedComponent(c, marker);
};

jazzman.preventGarbageCollection = function(c) {
    this.env.preventGarbageCollection(c);
};

jazzman.addAllowedListener = function(eventName) {
    this.env.addAllowedListener(eventName);
};

jazzman.mouseToTypeMap = {
    mousedown: 'start',
    mousemove: 'move',
    mouseup: 'end',
    mouseover: 'over',
    mouseout: 'out',
    mouseenter: 'enter',
    mouseleave: 'leave'
};

jazzman.focusEvents = {
    mousedown: true,
    click: true
};

// This requires initialized Ext core
jazzman.env.addStartupHook(function() {
    jazzman.pointerEventsMap = Ext.supports.MSPointerEvents && !Ext.supports.PointerEvents
        ? {
            // translation map for IE10
            pointerdown: 'MSPointerDown',
            pointermove: 'MSPointerMove',
            pointerup: 'MSPointerUp',
            pointerover: 'MSPointerOver',
            pointerout: 'MSPointerOut',
            // IE10 does not have pointer events for enter/leave
            pointerenter: 'mouseenter',
            pointerleave: 'mouseleave'
        }
        : {};
});

/**
 * Utility function to fire a fake mouse event to a given target element
 */
jazzman.fireMouseEvent = function(target, type, x, y, button, shiftKey, ctrlKey, altKey, relatedTarget) {
    var doc, ret, focusable, oldActiveEl, centre, targetCmp,
        minMove = Math.ceil(Math.sqrt(Math.pow(Ext.event.gesture.Drag.$config.values.minDistance, 2) / 2));
    
    if (target && target.isComponent) {
        targetCmp = target;
    }

    target = Ext.getDom(target && target.isComponent ? target.el : target);
    centre = Ext.fly(target).getAnchorXY('c');

    if (!target) {
        throw 'Cannot fire mouse event on null element';
    }

    // If we are doing a move event immediately after a down event, ensure the pointer has moved by taking the
    // down position, and moving it by the Drag Gesture's minDistance
    if (x == null && y == null && Ext.String.endsWith(type, 'move') &&
        Ext.String.endsWith(jazzman.lastMouseEventType, 'down')) {
        x = jazzman.mouseX + minMove;
        y = jazzman.mouseY + minMove;
    }

    doc = target.ownerDocument || document;
    
    if (x == null) {
        x = centre[0];
    }
    else {
        // Allow '+10'/'-10' to mean offsets from last used position.
        // Useful when dragging.
        if (typeof x === 'string') {
            x = jazzman.mouseX + parseInt(x, 10);
        }
    }
    
    if (y == null) {
        y = centre[1];
    }
    else {
        if (typeof y === 'string') {
            y = jazzman.mouseY + parseInt(y, 10);
        }
    }
    
    jazzman.mouseX = x;
    jazzman.mouseY = y;
    jazzman.lastMouseEventType = type;

    // Mousedown might lead to focus (not context menu mousedown)
    if (jazzman.focusEvents[type] && !button) {
        // Find a click target which is potentially focusable.
        // Not immediately tabbable; the mousedown handling might MAKE it tabbable.
        // Certain components like Modern buttons might have focusable elmement *inside*
        // the target so going from parent up yields entirely wrong result
        if (targetCmp && !targetCmp.isContainer) {
            focusable = Ext.getDom(targetCmp.getFocusEl());
        }
        
        focusable = focusable || Ext.fly(target).findParent(function(e) {
            return Ext.fly(e).isFocusable();
        }, null);

        // Mousedown is followed by focus, unless a listener prevented default,
        // or the focus was moved by a prior listener
        if (focusable) {
            oldActiveEl = doc.activeElement;
            
            if (focusable !== oldActiveEl) {
                Ext.getDoc().on({
                    mousedown: function(e) {
                        var fly;
                        
                        if (!e.defaultPrevented && doc.activeElement === oldActiveEl &&
                            (fly = Ext.fly(focusable)) && fly.isFocusable()) {
                            fly.focus();
                        }
                    },
                    single: true,
                    priority: -10000
                });
            }
        }
    }

    if (type === 'click') {
        ret = Ext.testHelper.tap(target, {
            x: x,
            y: y,
            button: button,
            shiftKey: shiftKey,
            ctrlKey: ctrlKey,
            altKey: altKey,
            relatedTarget: relatedTarget
        });
    }
    else if (type === 'dblclick') {
        ret = jazzman.fireMouseEvent(target, 'click', x, y, button, shiftKey, ctrlKey, altKey);
        
        if (ret !== false) {
            ret = jazzman.fireMouseEvent(target, 'click', x, y, button, shiftKey, ctrlKey, altKey);

            // Multi-phase mouse events are done with gestures now, so ensure there's a real dblclick
            // fired. Unless the click event was cancelled
            if (ret !== false) {
                jazzman.doFireMouseEvent(target, 'dblclick', x, y, button, shiftKey, ctrlKey, altKey);
            }
        }
    }
    else if (type === 'contextmenu') {
        ret = jazzman.doFireMouseEvent(target, type, x, y, button, shiftKey, ctrlKey, altKey);
    }
    else {
        ret = Ext.testHelper.fireEvent(jazzman.mouseToTypeMap[type], target, {
            x: x,
            y: y,
            button: button,
            shiftKey: shiftKey,
            ctrlKey: ctrlKey,
            altKey: altKey,
            relatedTarget: relatedTarget
        });
    }

    // If they asked for button 2, it means they wanted a contextmenu event too.
    if (type === 'mousedown' && button === 2) {
        // IE, CTRL+SHIFT+CLICK is contextmenu
        if (Ext.isIE) {
            ret = jazzman.doFireMouseEvent(target, 'click', x, y, button, true, true);
        }
        // Other browsers support contextmenu
        else {
            ret = jazzman.doFireMouseEvent(target, 'contextmenu', x, y);
        }
    }

    return ret;
};

jazzman.doFireMouseEvent = function(target, type, x, y, button, shiftKey, ctrlKey, altKey, relatedTarget) {
    // Save a function call
    target = target.nodeName ? target : Ext.getDom(target);
    
    if (relatedTarget) {
        relatedTarget = relatedTarget.nodeName ? relatedTarget : Ext.getDom(relatedTarget);
    }
    else {
        if (type === 'mouseover' || type === 'mouseout' || type === 'mousenter' || type === 'mouseleave') {
            relatedTarget = target.parentNode;
        }
        else {
            relatedTarget = null;
        }
    }

    // eslint-disable-next-line vars-on-top
    var doc = target.ownerDocument || document,
        docEl = doc.documentElement,
        body, dispatched, e;

    // Ensure the mouse position is registered at the point of contact
    if (type === 'mousedown') {
        jazzman.doFireMouseEvent(docEl, 'mousemove', x, y);
        
        // We need to clean up any pending mouseup listeners
        jazzman.doFireMouseEvent.needMouseup = true;
    }
    else if (type === 'mouseup') {
        jazzman.doFireMouseEvent.needMouseup = false;
    }

    // We are using old IE event model for IE9 too, because it has problems
    // with synthetic events created and dispatched in the standard way.
    if (Ext.isIE9m && doc.createEventObject) {
        e = doc.createEventObject();
        body = doc.body;
        x = x + (docEl && docEl.clientLeft || 0) + (body && body.clientLeft || 0);
        y = y + (docEl && docEl.clientTop || 0) + (body && body.clientTop || 0);

        Ext.apply(e, {
            bubbles: true,
            cancelable: true,
            screenX: x,
            screenY: y,
            clientX: x,
            clientY: y,
            button: button || 1,
            shiftKey: !!shiftKey,
            ctrlKey: !!ctrlKey,
            altKey: !!altKey,
            relatedTarget: relatedTarget
        });
        
        if (jazzman.CAPTURE_CALL_STACK) {
            e.created = new Error().stack;
        }
        
        return target.fireEvent('on' + type, e);
    }
    else {
        if (jazzman.supportsMouseConstructor) {
            e = new MouseEvent(type, {
                view: doc.defaultView || doc.parentWindow,
                bubbles: true,
                cancelable: true,
                screenX: x,
                screenY: y,
                clientX: x,
                clientY: y,
                button: button || 1,
                shiftKey: !!shiftKey,
                ctrlKey: !!ctrlKey,
                altKey: !!altKey,
                relatedTarget: relatedTarget
            });
        }
        else {
            e = doc.createEvent("MouseEvents");
        }
        
        e.initMouseEvent(type, true, true, doc.defaultView || doc.parentWindow, 1, x, y, x, y,
                         !!ctrlKey, !!altKey, !!shiftKey, false, button || 0, relatedTarget);
        
        if (jazzman.CAPTURE_CALL_STACK) {
            e.created = new Error().stack;
        }

        dispatched = target.dispatchEvent(e);

        return (dispatched === false) ? dispatched : e;
    }
};

jazzman.pointerTypeMap = {
    touch: 2,
    pen: 3,
    mouse: 4
};

/**
 * Fires a pointer event.  Since PointerEvents cannot yet be directly constructed,
 * we fake it by constructing a mouse event and setting its pointer id.  This method
 * should typically be used when (Ext.supports.PointerEvents || Ext.supports.MSPointerEvents).
 * @param {String/Ext.Element/HTMLElement} target
 * @param {String} type The name of the event to fire
 * @param {Number} [pointerId] A unique id for the pointer, for more on pointerId see
 * http://www.w3.org/TR/pointerevents/
 * @param {Number} [x] The x coordinate
 * @param {Number} [y] The y coordinate
 * @param {Number} [button]
 * @param {Boolean} [shiftKey]
 * @param {Boolean} [ctrlKey]
 * @param {Boolean} [altKey]
 * @param {String/Ext.Element/HTMLElement} relatedTarget
 * @param {String} [pointerType=mouse]
 * @return {Boolean} true if the event was successfully dispatched
 */
jazzman.firePointerEvent =
function(target, type, pointerId, x, y, button, shiftKey, ctrlKey, altKey, relatedTarget, pointerType) {
    target = Ext.getDom(target);
    
    if (relatedTarget) {
        relatedTarget = Ext.getDom(relatedTarget);
    }
    else {
        if (Ext.String.endsWith(type, 'over') || Ext.String.endsWith(type, 'out') ||
            Ext.String.endsWith(type, 'enter') || Ext.String.endsWith(type, 'leave')) {
            relatedTarget = target.parentNode;
        }
        else {
            relatedTarget = null;
        }
    }

    // eslint-disable-next-line vars-on-top
    var doc = target.ownerDocument || document,
        pointerTypeValue = jazzman.pointerTypeMap[pointerType ? pointerType.toLowerCase() : 'mouse'],
        e, dispatched;

    if (!target) {
        throw 'Cannot fire pointer event on null element';
    }

    // Ensure the pointer position is registered at the point of contact
    if (type === 'mousedown') {
        jazzman.firePointerEvent(doc.defaultView || doc.parentWindow, 'mousemove', x, y);
    }

    type = jazzman.pointerEventsMap[type] || type;

    // Broken IE10 implementation
    if (Ext.supports.MSPointerEvents && !Ext.supports.PointerEvents) {
        e = doc.createEvent("MouseEvents");
        e.initMouseEvent(
            type, // type
            true, // canBubble
            true, // cancelable
            doc.defaultView || doc.parentWindow, // view
            1, // detail
            x, // screenX
            y, // screenY
            x, // clientX
            y, // clientY
            !!ctrlKey, // ctrlKey
            !!altKey,   // altKey
            !!shiftKey, // shiftKey
            false, // metaKey
            button || 0, // button
            relatedTarget // relatedTarget
        );
        e.pointerId = pointerId || 1;
        e.pointerType = pointerType || 'mouse';
    }
    // PointerEvents standard
    else {
        if (jazzman.supportsPointerEventConstructor) {
            e = new PointerEvent(type, {
                // Event
                bubbles: true,
                cancelable: true,

                // UIEvent
                detail: 1,
                view: doc.defaultView || doc.parentWindow,

                // MouseEvent
                screenX: x,
                screenY: y,
                clientX: x,
                clientY: y,
                ctrlKey: !!ctrlKey,
                shiftKey: !!shiftKey,
                altKey: !!altKey,
                metaKey: false,
                button: button || 0,
                relatedTarget: relatedTarget,

                // PointerEvent
                pointerId: pointerId || 1,
                width: 1,
                height: 1,
                pressure: 0.5,
                tiltX: 0,
                tiltY: 0,
                pointerType: pointerType,
                isPrimary: true
            });
        }
        else {
            e = doc.createEvent('PointerEvent');
            e.initPointerEvent(
                type, // type
                true, // canBubble
                true, // cancelable
                doc.defaultView || doc.parentWindow, // view
                1, // detail
                x, // screenX
                y, // screenY
                x, // clientX
                y, // clientY
                !!ctrlKey, // ctrlKey
                !!altKey,   // altKey
                !!shiftKey, // shiftKey
                false, // metaKey
                button || 0, // button
                relatedTarget, // relatedTarget,
                1, // element offset X
                1, // element offset Y
                1, // width
                1, // height
                0.5, // pressure
                0, // rotation
                0, // tiltX
                0, // tiltY
                pointerId || 1, // id,
                pointerTypeValue, // pointerType
                Ext.now(), // timestamp
                true    // primary, ie: the mouse
            );
        }
    }
    
    if (jazzman.CAPTURE_CALL_STACK) {
        e.created = new Error().stack;
    }
    
    dispatched = target.dispatchEvent(e);
    
    return (dispatched === false) ? dispatched : e;
};

// Test all three ways that we can use to create touch events.
jazzman.supportsTouch = (function() {
    var maxTouchPoints = navigator.msMaxTouchPoints || navigator.maxTouchPoints,
        touchEvent, touchList, touch;

    // See if we can create TouchEvents using a constructor.
    // If not, we will fall back to using a CustomEvent.
    try {
        touchEvent = new TouchEvent('touchstart', {
            target: document,
            bubbles: true
        });
        
        jazzman.supportsObjectTouchEventConstructor = touchEvent.bubbles === true;
    }
    catch (e) {
        // ignore
    }

    if (!jazzman.supportsObjectTouchEventConstructor) {
        try {
            touch = new TouchEvent(
                'touchstart'
            );
            
            jazzman.supportsTouchEventConstructor = true;
        }
        catch (e) {
            // ignore
        }
    }

    try {
        if (!touchEvent) {
            touchEvent = new CustomEvent('touchstart', {
                bubbles: true,
                cancelable: true
            });
        }
    }
    catch (e) {
        // ignore
    }

    // See if we can create individual Touches using the constructor.
    // If not, we will fall back to using document.createTouch.
    try {
        touch = new Touch({
            identifier: 1,
            target: document
        });
        
        jazzman.supportsTouchConstructor = touch.target === document;
    }
    catch (e) {
        // ignore
    }
    
    if (!jazzman.supportsTouchConstructor) {
        try {
            touch = document.createTouch(
                document.defaultView,
                document,
                1, 0, 0, 0, 0
            );
        }
        catch (e) {
            return false;
        }
    }

    // See if we can create a filled TouchList using the constructor.
    // If not, the TouchEvent accepts raw arrays of Touches.
    if (!document.createTouchList) {
        try {
            touchList = new TouchList(touch);
            jazzman.supportsTouchListConstructor = touchList.length > 0;
        }
        catch (e) {
            // ignore
        }
    }

    return 'ontouchend' in window || maxTouchPoints > 0;
})();

jazzman.supportsMouseConstructor = (function() {
    var supports = false,
        e;

    function setFlag(e) {
        supports = !!e;
    }
    
    if (document.addEventListener) {
        try {
            document.addEventListener('mousedown', setFlag);
            e = new MouseEvent('mousedown', { bubbles: true });
            document.querySelector('script').dispatchEvent(e);
        }
        catch (e) {
            // ignore
        }
        finally {
            document.removeEventListener('mousedown', setFlag);
        }
    }
    
    return supports;
})();

jazzman.supportsPointerEventConstructor = (function() {
    var e;

    try {
        if (window.PointerEvent) {
            // IE11 throws an error when you invoke the PointerEvent constructor.
            // In IE11 we can use document.createEvent('PointerEvent') to create a pointer
            // event instance.  In Chrome, document.createEvent('PointerEvent') throws
            // an error, so we have to use the PointerEvent constructor in Chrome.
            e = new PointerEvent('pointerdown', { clientX: 100 });

            // Detect https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11208119/
            // If bug is present we cannot use the PointerEvent constructor due to incorrect pageX/pageY
            if (e.pageX !== 100) {
                return false;
            }

            return true;
        }
    }
    catch (e) {
        // ignore
    }

    return false;
})();

jazzman.createTouchList = function(touchList, target) {
    var touches = [],
        doc = target.ownerDocument || document,
        touch, touchCfg, i, len;

    if (touchList && touchList.length) {
        target = touchList[0].target || target;

        doc = target.ownerDocument || document;

        for (i = 0, len = touchList.length; i < len; i++) {
            touchCfg = touchList[i];

            // W3 standard compliant.
            if (jazzman.supportsTouchConstructor) {
                touch = new Touch({
                    target: target,
                    identifier: touchCfg.identifier || 1,
                    pageX: touchCfg.pageX,
                    pageY: touchCfg.pageY,
                    screenX: touchCfg.screenX || touchCfg.pageX, // use pageX/Y as the default for screenXY
                    screenY: touchCfg.screenY || touchCfg.pageY,
                    clientX: touchCfg.screenX || touchCfg.pageX, // use pageX/Y as the default for clientXY
                    clientY: touchCfg.screenY || touchCfg.pageY,
                    radiusX: 1,
                    radiusY: 1,
                    rotationAngle: 0,
                    force: 0.5
                });
            }
            else {
                touch = doc.createTouch(
                    doc.defaultView || doc.parentWindow,
                    target,
                    // use 1 as the default ID, so that tests that are only concerned with a single
                    // touch event don't need to worry about providing an ID
                    touchCfg.identifier || 1,
                    touchCfg.pageX,
                    touchCfg.pageY,
                    touchCfg.screenX || touchCfg.pageX, // use pageX/Y as the default for screenXY
                    touchCfg.screenY || touchCfg.pageY
                );
            }
            
            touches.push(touch);
        }
    }

    /* eslint-disable indent */
    return jazzman.supportsTouchListConstructor ? new TouchList(touches)
         : doc.createTouchList                  ? doc.createTouchList.apply(doc, touches)
         :                                        touches
         ;
    /* eslint-enable indent */
};

/**
 * Utility for emulating a touch event.  This method should typically only be used when
 * Ext.supports.TouchEvents.  Recommended reading for understanding how touch events work:
 * http://www.w3.org/TR/touch-events/
 * @param {String/Ext.Element/HTMLElement} target
 * @param {String} type The name of the event to fire
 * @param {Object[]} touches An array of config objects for constructing the event object's
 * "touches".  The config objects conform to the following interface:
 * http://www.w3.org/TR/touch-events/#idl-def-Touch The only required properties
 * are pageX and pageY. this method provides defaults for the others.
 * @param {Object[]} changedTouches An array of config objects for constructing the event
 * object's "changedTouches" (defaults to the same value as the `touches` param)
 * @param {Object[]} targetTouches An array of config objects for constructing the event
 * object's "targetTouches" (defaults to the same value as the `touches` param)
 * @return {Event} The browser event if the event was successfully dispatched, otherwise `false`
 */
jazzman.fireTouchEvent = function(target, type, touchesParam, changedTouches, targetTouches) {
    var touch, touches, e, dispatched, centre;
    
    target = Ext.getDom(target);

    if (!target) {
        throw 'Cannot fire touch event on null element';
    }

    if (!touchesParam) {
        centre = Ext.fly(target).getAnchorXY('c');
        touchesParam = [{
            pageX: centre[0],
            pageY: centre[1]
        }];
    }

    touches = jazzman.createTouchList(touchesParam, target);
    changedTouches = jazzman.createTouchList(changedTouches || touchesParam, target);
    targetTouches = jazzman.createTouchList(targetTouches || touchesParam, target);

    touch = touchesParam[0];

    e = jazzman.createTouchEvent(type, target, {
        target: target,
        touches: touches,
        changedTouches: changedTouches,
        targetTouches: targetTouches,
        bubbles: true,
        cancelable: true,
        shiftKey: touch ? !!touch.shiftKey : false,
        ctrlKey: touch ? !!touch.ctrlKey : false,
        altKey: touch ? !!touch.altKey : false
    });

    if (jazzman.CAPTURE_CALL_STACK) {
        e.created = new Error().stack;
    }
    
    dispatched = target.dispatchEvent(e);
    
    return (dispatched === false) ? dispatched : e;
};

jazzman.createTouchEvent = function(type, target, cfg) {
    var doc = target.ownerDocument || document,
        result;

    if (jazzman.supportsObjectTouchEventConstructor) {
        result = new TouchEvent(type, {
            target: target,
            touches: cfg.touches,
            changedTouches: cfg.changedTouches,
            targetTouches: cfg.touches,
            bubbles: true,
            cancelable: true,
            shiftKey: cfg.shiftKey,
            ctrlKey: cfg.ctrlKey,
            altKey: cfg.altKey
        });
    }
    else if (jazzman.supportsTouchEventConstructor) {
        result = new TouchEvent(
            type, // type
            true, // canBubble
            true, // cancelable
            doc.defaultView || doc.parentWindow, // view
            1, // detail
            cfg.pageX,
            cfg.pageY,
            cfg.screenX || cfg.pageX, // use pageX/Y as the default for clientXY
            cfg.screenY || cfg.pageY,
            cfg.ctrlKey, // ctrlKey
            cfg.altKey,   // altKey
            cfg.shiftKey, // shiftKey
            false, // metaKey
            cfg.touches,
            cfg.changedTouches,
            cfg.touches,
            1, // scale
            0 // rotation
        );
    }
    else {
        result = new CustomEvent(type, {
            bubbles: true,
            cancelable: true
        });
        
        Ext.apply(result, {
            target: target,
            touches: cfg.touches,
            changedTouches: cfg.changedTouches,
            targetTouches: cfg.touches
        });
    }
    
    return result;
};

/**
 * Utility function to fire a fake key event to a given target element
 */
jazzman.fireKeyEvent = function(target, type, key, shiftKey, ctrlKey, altKey) {
    var doc, e, dispatched;
    
    target = Ext.getDom(target);
    
    if (!target) {
        throw 'Cannot fire key event on null element';
    }
    
    doc = target.ownerDocument || document;
    
    // We are using old IE event model for IE9 too, because it has problems
    // with synthetic events created and dispatched in the standard way.
    if (Ext.isIE9m && doc.createEventObject) {
        e = doc.createEventObject();
        Ext.apply(e, {
            bubbles: true,
            cancelable: true,
            keyCode: key,
            shiftKey: !!shiftKey,
            ctrlKey: !!ctrlKey,
            altKey: !!altKey
        });
        
        dispatched = target.fireEvent('on' + type, e);
        
        return (dispatched === false) ? dispatched : e;
    }
    else {
        e = doc.createEvent("Events");
        e.initEvent(type, true, true);
        Ext.apply(e, {
            keyCode: key,
            shiftKey: !!shiftKey,
            ctrlKey: !!ctrlKey,
            altKey: !!altKey
        });

        dispatched = target.dispatchEvent(e);

        return (dispatched === false) ? dispatched : e;
    }
};

// This implementation is pretty naïve but since it's not easy to simulate
// real Tab key presses (if at all possible), it doesn't make sense to go
// any further than this.
jazzman.simulateTabKey = jazzman.syncPressTabKey = function(from, forward) {
    var ev, to;
    
    function getNextTabTarget(currentlyFocused, forward) {
        var selector = 'a[href],button,iframe,input,select,textarea,[tabindex],[contenteditable="true"]',
            body = Ext.getBody(),
            currentDom, focusables, node, next,
            len, currIdx, i, to, step;
        
        currentDom = Ext.getDom(currentlyFocused);
        focusables = body.dom.querySelectorAll(selector);
        len = focusables.length;
        currIdx = Ext.Array.indexOf(focusables, currentDom);
        
        // If the currently focused element is not present in the list,
        // it must be the body itself. Just focus the first or last
        // tabbable element.
        if (currIdx < 0) {
            if (forward) {
                i = 0;
                to = len - 1;
                step = 1;
            }
            else {
                i = len - 1;
                to = 0;
                step = -1;
            }
        }
        else {
            if (forward) {
                i = currIdx + 1;
                to = len - 1;
                step = 1;
            }
            else {
                i = currIdx - 1;
                to = 0;
                step = -1;
            }
        }
        
        // We're only interested in the elements that an user can *tab into*,
        // not all programmatically focusable elements. So we have to filter
        // these out.
        for (;; i += step) {
            if ((step > 0 && i > to) || (step < 0 && i < to)) {
                break;
            }
            
            node = focusables[i];
            
            if (Ext.fly(node).isTabbable()) {
                next = node;
                break;
            }
        }
        
        // We *need* to return Ext.Element instance here because later on
        // we will try to focus it and it's just not that simple. :(
        // There are Element overrides that deal with IE bugs.
        return Ext.get(next || body);
    }
    
    if (!from) {
        from = document.activeElement;
    }
    
    if (forward == null) {
        forward = true;
    }
    
    from = from.getFocusEl ? from.getFocusEl() : from;
    
    // A handler can call preventDefault() on the event in which case
    // we don't proceed with changing focus. It is also possible that
    // element tabbability could have changed in a tab key handler,
    // and activeElement could have changed as well, so we have to
    // compute the next target *after* firing successful keydown.
    // Whoa that escalates quickly!
    ev = jazzman.fireKeyEvent(from, 'keydown', 9, !forward);
    
    if (ev) {
        // There is an issue here which is an interplay between focus events
        // in the keyboard mode handling to try to deal with hover focused
        // menu items... and the fact that the test runner focuses the iframe.
        // That iframe focus event (sometimes?) kicks the keyboard mode logic
        // into thinking you are back in mouse mode, so this ensures that the
        // keyboard event state is in effect after we play with the focus.
        Ext.syncKeyboardMode(ev);
        
        to = getNextTabTarget(document.activeElement || from, forward);
        
        if (to) {
            to.focus();
        }
    }
    
    jazzman.fireKeyEvent(document.activeElement, 'keyup',   9, !forward);

    return document.activeElement;
};

jazzman.getGlobal().simulateTabKey = jazzman.simulateTabKey;

jazzman.simulateArrowKey = jazzman.syncPressArrowKey =
jazzman.simulateKey = jazzman.syncPressKey = function(from, key, options) {
    var keyCode = typeof key === 'number' ? key : Ext.event.Event[key.toUpperCase()],
        target, shiftKey, ctrlKey, altKey;
    
    if (keyCode === undefined) {
        throw 'Cannot fire undefined key event!';
    }

    from = from.getFocusEl ? from.getFocusEl() : from;

    target = Ext.getDom(from);

    if (!target) {
        throw 'Cannot fire arrow key event on null element';
    }
    
    if (options) {
        shiftKey = options.shift || options.shiftKey;
        ctrlKey = options.ctrl || options.ctrlKey;
        altKey = options.alt || options.altKey;
    }

    jazzman.fireKeyEvent(target, 'keydown', keyCode, shiftKey, ctrlKey, altKey);
    jazzman.fireKeyEvent(target, 'keyup', keyCode, shiftKey, ctrlKey, altKey);
};

jazzman.usesViewport = function(config) {
    beforeAll(function() {
        if (Ext.isModern) {
            Ext.viewport.Viewport.setup(config);
        }
    });

    afterAll(function() {
        if (Ext.isModern) {
            Ext.Viewport = Ext.destroy(Ext.Viewport);
        }
    });
};

jazzman.waitsForFocusOrBlur = function(event, target, message, timeout) {
    if (target == null) {
        throw new Error("Expected something focusable, got " + target + " instead!");
    }
    
    if (target.$isFocusableEntity && !target.rendered) {
        jazzman.env.waitsForEvent(target, 'render', target.$className + '#' + target.id + ' to render');
    }
    
    jazzman.env.waitsForEvent(target, event, message, timeout);
};

/**
 * Scrolls the passed scroller until the isDone callback returns true,
 * That is passed te scroller, x, and y scroll positions.
 * @param {Ext.scroll.Scroller} scroller The scroller to scroll.
 * @param {Function/Number[]} isDone The callback to test whether scrolling is finished.
 * If this parameter is an array of numbers, they are interpreted to be the desired scroll
 * positions followed by the tolerance values, both in x,y order. In other words, that is
 * `[targetX, targetY, toleranceX, toleranceY]`. The target values can be `null` if they
 * are not important. The tolerance values default to `0`.
 * @param {Ext.scroll.Scroller} isDone.scroller The scroller.
 * @param {Number} isDone.x The current x position.
 * @param {Number} isDone.y The current y position.
 * @param {String} msg Descriptions of the wait condition.
 * @param {Number} timeout The time to wait in milliseconds.
 */
jazzman.waitForScroll = jazzman.waitsForScroll = function(scroller, isDone, msg, timeout) {
    var goal;
    
    if (!scroller.isScroller && scroller.getScrollable) {
        scroller = scroller.getScrollable();
    }

    if (Ext.isArray(isDone)) {
        goal = isDone;

        isDone = function(sc, x, y) {
            var targetX = goal[0],
                targetY = goal[1],
                toleranceX = goal[2] || 0,
                toleranceY = goal[3] || 0,
                dx, dy;

            dx = (targetX === null) ? 0 : Math.abs(x - targetX);
            dy = (targetY === null) ? 0 : Math.abs(y - targetY);

            return dx <= toleranceX && dy <= toleranceY;
        };
    }

    waitsFor(function() {
        var position;

        position = scroller.getPosition();

        if (isDone(scroller, Math.round(position.x), Math.round(position.y))) {
            position = scroller = null;
            
            return true;
        }
        
        return false;
    }, timeout, msg);
};

// In IE (all of 'em), focus/blur events are asynchronous. To us it means
// not only that we have to wait for the actual element to focus but
// also for its container-injected focus handler to fire; and since
// container focus handler may focus yet another element we have to yield
// for *that* focus handler to fire, too. The third `waits` is to
// accommodate for any repercussions caused by secondary focus handler,
// and of course as a good luck charm.
// Note that the timeout value is not important here because effectively
// we just want to yield enough cycles to unwind all the async event handlers
// before the test checks done in the specs, so we default to 1 ms.
jazzman.waitAWhile = jazzman.waitsAWhile = function(timeout) {
    timeout = timeout != null ? timeout : 1;

    waits(timeout);
    waits(timeout);
    waits(timeout);
};

jazzman.getGlobal().waitAWhile = jazzman.waitAWhile;

jazzman.focusAndWait = function(cmp, waitFor, desc) {
    // Apparently IE has yet another odd problem with focusing some elements;
    // if dom.focus() is called before the element is fully initialized, focusing
    // will fail and focus will jump to the document body. This happens with
    // text inputs at the very least, maybe with some others as well.
    // In IE9-10 we work around this issue by giving it a bit of time to finish
    // whatever initialization it was doing; in IE8 some harsher measures are
    // required, see Ext.dom.Element override.
    if (Ext.isIE10m) {
        jazzman.waitAWhile();
    }
    
    runs(function() {
        cmp.focus();
    });
    
    jazzman.waitsForFocus(waitFor || cmp, desc);

    jazzman.waitAWhile();
};

jazzman.getGlobal().focusAndWait = jazzman.focusAndWait;

jazzman.fireTabAndWait = function(target, waitFor, desc) {
    runs(function() {
        jazzman.fireKeyEvent(target, 'keydown', Ext.event.Event.TAB);
    });
    waitsForFocus(waitFor, desc);
};

jazzman.getGlobal().fireTabAndWait = jazzman.fireTabAndWait;

jazzman.blurAndWait = function(cmp, waitFor) {
    runs(function() {
        (cmp.findFocusTarget() || document.body).focus();
        cmp.blur();
    });

    jazzman.waitForBlur(waitFor || cmp);

    jazzman.waitAWhile();
};

jazzman.pressTabKey = jazzman.asyncPressTabKey = function(from, forward) {
    jazzman.focusAndWait(from, from);

    runs(function() {
        jazzman.simulateTabKey(from, forward);
    });

    jazzman.waitAWhile();
};

jazzman.getGlobal().pressTabKey = jazzman.pressTabKey;

jazzman.pressArrowKey = jazzman.asyncPressArrowKey =
jazzman.pressKey = jazzman.asyncPressKey = function(from, key, options) {
    jazzman.focusAndWait(from);

    runs(function() {
        jazzman.simulateArrowKey(from, key, options);
    });

    jazzman.waitAWhile();
};

jazzman.getGlobal().pressKey = jazzman.pressKey;

// Can't add this one and below as simple matchers,
// because there's async waiting involved
jazzman.expectFocused = jazzman.expectsFocused = function(want, noWait) {
    if (!noWait) {
        jazzman.waitsForFocus(want);
    }

    runs(function() {
        /* eslint-disable indent */
        var have = want.$isFocusableEntity ? Ext.ComponentManager.getActiveComponent()
                 : want.isElement          ? Ext.fly(document.activeElement)
                 :                           document.activeElement
                 ;
        /* eslint-enable indent */
        
        expect(have).toBe(want);
    });
};

jazzman.getGlobal().expectFocused = jazzman.expectFocused;

// Focus and optionally wait for another element - FocusableContainers shift focus!
jazzman.focusAndExpect = function(whatFocus, whatExpect) {
    jazzman.focusAndWait(whatFocus, whatExpect);
    jazzman.expectFocused(whatExpect || whatFocus);
};

jazzman.getGlobal().focusAndExpect = jazzman.focusAndExpect;

/**
 * Waits for the passed object to fire the passed event name before proceeding to the next block.
 *
 * @param {Ext.mixin.Observable} eventSource The object which is going to fire the event.
 * @param {String} eventName The name of the event to wait for.
 * @param {String} [timeoutMessage] Optional timeout message
 * @param {Number} [timeout] Optional timeout in ms
 */
jazzman.getGlobal().waitsForEvent = function(eventSource, eventName, timeoutMessage, timeout) {
    return jazzman.env.waitsForEvent(eventSource, eventName, timeoutMessage, timeout);
};

jazzman.getGlobal().waitForEvent = waitsForEvent;

jazzman.waitsForFocus = jazzman.waitForFocus = function(focusable, message, timeout) {
    return jazzman.waitsForFocusOrBlur('focus', focusable, message, timeout);
};

jazzman.getGlobal().waitsForFocus = jazzman.waitsForFocus;
jazzman.getGlobal().waitForFocus = jazzman.waitsForFocus;

jazzman.waitsForBlur = jazzman.waitForBlur = function(focusable, message, timeout) {
    return jazzman.waitsForFocusOrBlur('blur', focusable, message, timeout);
};

jazzman.getGlobal().waitsForBlur = jazzman.waitsForBlur;
jazzman.getGlobal().waitForBlur = jazzman.waitsForBlur;

// This requires loaded Ext so needs to be done right before tests are starting
jazzman.env.addStartupHook(function() {
    var stickyElements;

    // The Reaper must not fire idle events during specs.
    // We will flush its queue after every spec.
    // See jazzman.Spec.prototype.finish
    Ext.Reaper.delay = 1e6;

    // Prevent the iOS inactive webview watchdog timer from firing at 500ms intervals
    // throughout the test suite and injecting spurious idle events.
    if (Ext.TaskQueue) {
        Ext.uninterval(Ext.TaskQueue.watchdogTimer);
    }
    
    if (Ext.AnimationQueue) {
        Ext.uninterval(Ext.AnimationQueue.watchdogTimer);
    }

    if (Ext.isModern) {
        // all tests run in normal mode by default regardless of the device
        // it is the responsibility of the tests/suites that need to test big mode
        // to add the x-big class to the documentElement before testing and remove it when done.
        Ext.theme.getDocCls = function() {};
    }

    if (Ext.Element) {
        jazzman._bodyRegion = new Ext.util.Region(
            0, window.innerWidth || document.documentElement.clientWidth,
            window.innerHeight || document.documentElement.clientHeight, 0
        );
        
        stickyElements = Ext.getBody().query('[data-sticky]');
        
        // calling setCapture() can cause problem with emulated mouse events
        Ext.Element.prototype.setCapture = Ext.emptyFn;
        
        // All pixels are just one pixel for test purposes
        Ext.Element.getViewportScale = function() {
            return 1;
        };
    }

    // ensures the body begins absolutely empty (some browsers have a default text node)
    document.body.innerHTML = '';

    // Elements which are flagged as sticky must persist as if the tests were
    // one long running application.
    // Test code will assume that there has been no teardown.
    if (stickyElements) {
        Ext.getBody().appendChild(stickyElements);
    }

    // The deferCallback method defers execution of a function until the next animation frame.
    // In unit tests, we do not want this, we need everything to execute synchronously.
    Ext.deferCallback = Ext.callback;

    // In IE8 and below, trying to delete a property in window object will throw
    // an exception. This means we can't really remove defined named classes from
    // global namespace, and this is a problem for unit tests because it will create
    // uncleanable global variable leaks. Since there is no real solution we just cheat
    // by intercepting Ext.undefine and adding whatever top namespace it was undefining
    // to the allowedGlobals pool. We don't care about any nested namespaces here.
    if (Ext.isIE8m) {
        (function(oldFunc) {
            var global = jazzman.getGlobal();
            
            Ext.undefine = function(className) {
                var entryName = oldFunc(className);
                
                if (entryName && (entryName in global)) {
                    addGlobal(entryName);
                }
            };
        })(Ext.undefine);
    }
    
    // Errors thrown by XTemplate-generated code should not be caught;
    // they should cause test failures
    Ext.define(null, {
        override: 'Ext.XTemplate',
        
        strict: true
    });
    
    // Exceptions in TaskRunner are normally trapped but in unit tests we want them
    // to blow up and cause failures.
    Ext.define(null, {
        override: 'Ext.util.TaskRunner',
        
        disableTryCatch: true
    });
    
    // This should fire after onReady when the timer has been installed
    if (Ext.scroll && Ext.scroll.Scroller) {
        if (Ext.scroll.Scroller.initViewportScrollerTimer) {
            window.clearTimeout(Ext.scroll.Scroller.initViewportScrollerTimer);
            Ext.scroll.Scroller.initViewportScroller();
        }
    }

    // Capturing call stack is VERY expensive and is meaningless in CI anyway
    if (jazzman.CI_ENVIRONMENT) {
        Ext.Timer.track = false;
        Ext.Timer.captureStack = false;
    }
    else {
        Ext.Timer.track = true;
        
        Ext.Timer.hook = function(timer) {
            var spec = timer.spec = jazzman.env.currentSpec;
            
            timer.test = spec ? spec.getFullName(true) : null;
        };
    }
    
    // For unit tests we want to clear properties synchronously
    Ext.define(null, {
        override: 'Ext.Component',
        
        clearPropertiesOnDestroy: true
    });
    
    // We seriously want our scroller to be FASTER for testing
    Ext.define(null, {
        override: 'Ext.scroll.Scroller',
        
        scrollEndBuffer: 16
    });
    
    if (jazzman.CLEAR_PROTOTYPE) {
        Ext.define(null, {
            override: 'Ext.Base',
            
            clearPrototypeOnDestroy: true
        });
        
        Ext.define(null, {
            override: 'Ext.data.operation.Operation',
            $preservePrototypeProperties: [
                '$className',
                'isOperation'
            ]
        });
    }

    // Many unit tests involve Ajax requests, for which we use MockAjax object.
    // Whenever a real XMLHttpRequest object is used to make an Ajax request
    // in unit tests, most probably that's a bug and we want to catch it.
    XMLHttpRequest.prototype.send = function() {
        throw new Error("Attempt at sending XMLHttpRequest!");
    };

    // We don't want ARIA warnings to pollute the console
    Ext._ariaWarn = Ext.ariaWarn;
    Ext.ariaWarn = Ext.emptyFn;
    
    // We want to catch when something tries to fire events on destroyed objects
    Ext.raiseOnDestroyed = true;

    // We would love to catch runaway Promises, too, but there's a tiny problem
    // of what to do with them when that happens. See comment in checkResourceLeaks()
    // if (jazzman.DEBUGGING_MODE) {
    //     (function() {
    //         var id = 0;
    //         
    //         Ext.define(null, {
    //             override: 'Ext.promise.Consequence',
    //             
    //             schedule: function(callback) {
    //                 if (jazzman.CAPTURE_CALL_STACK) {
    //                     callback.$createdAt = new Error().stack;
    //                 }
    //                 
    //                 // IE8 does not support collecting stack trace,
    //                 // so we have to use another way.
    //                 callback.$id = ++id;
    //                 
    //                 return this.callParent([callback]);
    //             }
    //         });
    //     })();
    // }

    if (Ext.isClassic) {
        // We want layout run errors to fail tests
        Ext.devMode = 2;
        
        // Our test suite assumes that unspecified header text will still show headers.
        // 6.2 sets hideHeaders if there is no header text, no grouped headers,
        // and hideHeaders is not in the class.
        // So we override it just for tests.
        // This is tested in Ext.tree.TreeGrid tests, "collapsing locked TreeGrid" suite.
        //
        // Note that tests which test auto-selection of header visibility must override this.
        Ext.define(null, {
            override: 'Ext.grid.Panel',

            config: {
                hideHeaders: false
            }
        });
        
        // Testing always uses the classic row height
        Ext.define(null, {
            override: 'Ext.grid.plugin.BufferedRenderer'
        }, function(BufferedRenderer) {
            BufferedRenderer.prototype.themeRowHeight = BufferedRenderer.prototype.rowHeight;
        });
        
        Ext.define(null, {
            override: 'Ext.form.Basic',
            
            taskDelay: 0
        });
        
        // The Ext.form.* unit tests test the layout of msgTarget: 'qtip'
        // So when that is defaulted to 'side' on touch platforms, we must fix it.
        Ext.define(null, {
            override: 'Ext.form.field.Base',
            
            msgTarget: 'qtip'
        });
        
        Ext.define(null, {
            override: 'Ext.form.Labelable',
            
            msgTarget: 'qtip'
        });
        
        // We do not want waits when we control the mouse in tests
        Ext.define(null, {
            override: 'Ext.menu.Item',
            
            menuExpandDelay: 0
        });

        // Usually MenuManager will register these listeners lazily but we need them
        // upfront to be accounted as allowed for leak checks
        Ext.define(null, {
            override: 'Ext.menu.Manager'
        }, function() {
            Ext.menu.Manager.registerGlobalListeners();
        });
        
        // QuickTips should also be there before tests start, if any of the tests require it
        Ext.define(null, {
            override: 'Ext.tip.QuickTipManager'
        }, function() {
            var tip;
            
            Ext.QuickTips.init();
            
            if (tip = Ext.QuickTips.tip) {
                jazzman.addAllowedComponent(tip, true, true);
                jazzman.preventGarbageCollection(tip);
            }
        });
    }

    if (!jazzman.CHECK_LEAKS) {
        Ext.Base.prototype.clearReferencesOnDestroy = false;
    }
    else {
        // eslint-disable-next-line vars-on-top
        var env = jazzman.env;
        
        addGlobal([
            // IE10 needs this
            'devicePixelRatio',
            
            // Old Firefox needs these
            'getInterface',
            'loadFirebugConsole',
            '_createFirebugConsole',
            'netscape',
            'XPCSafeJSObjectWrapper',
            'XPCNativeWrapper',
            'Components',
            '_firebug',
            
            // IE10+ F12 dev tools adds these properties when opened.
            '_IE_DEVTOOLBAR_CONSOLE_COMMAND_LINE',
            '__BROWSERTOOLS_CONSOLE',
            '__BROWSERTOOLS_CONSOLE_BREAKMODE_FUNC',
            '__BROWSERTOOLS_CONSOLE_SAFEFUNC',
            
            // in IE8 jazzman's overrides of setTimeout/setInterval make them iterable
            'setTimeout',
            'setInterval',
            'clearTimeout',
            'clearInterval'
        ]);
        
        if (document.addEventListener) {
            // Browsers that don't support passive events will interpret the options object
            // as truthy value, with effectively the same result. Browsers that do support
            // passive listeners might run a bit snappier.
            document.body.addEventListener('scroll', env.bodyScrollListener, {
                capture: true,
                passive: true
            });
        }
        else {
            document.body.attachEvent('onscroll', env.bodyScrollListener);
        }
        
        if (Ext.Element) {
            // We need to check if these Ext.dom.Element instances' methods
            // were overridden or new methods were injected. We only care about
            // important persistent ones hence the name.
            env.importantElementInstances.push(
                Ext.getWin(),
                Ext.getDoc(),
                Ext.getHead(),
                Ext.getBody(),
                Ext.getDetachedBody()
            );
            
            // These methods are allowed to be added to the instance
            env.allowedImportantElementInstanceMethods.getUniqueId = true;
            
            env.detachedBody = Ext.getDetachedBody().dom;
        }
        
        // Tag all instances of Ext classes with their full origin and id.
        // This helps greatly tracking down component leaks.
        Ext.Base.prototype.constructor = Ext.Function.createInterceptor(Ext.Base.prototype.constructor, function() {
            var spec = jazzman.env.currentSpec;
            
            if (jazzman.CAPTURE_CALL_STACK) {
                this.$createdAt = new Error().stack;
            }
            
            // If we are within a spec, capture the full name
            if (spec) {
                this.$spec = spec.getFullName();
            }
            
            if (this.id == null) {
                Ext.id(this, (this.$className ? this.$className.replace(/\./g, '-') : 'ext-'));
            }
        });

        // Ext.sparkline.Base puts this tooltip on its prototype
        Ext.define(null, {
            override: 'Ext.sparkline.Base'
        }, function() {
            Ext.onInternalReady(function() {
                var tooltip = Ext.sparkline.Base.prototype.tooltip;
                
                if (tooltip) {
                    jazzman.addAllowedComponent(tooltip, true, true);
                    jazzman.preventGarbageCollection(tooltip);
                }
            });
        });
        
        // Block unregistration of allowed components
        Ext.define(null, {
            override: 'Ext.ComponentManager',
            
            unregister: function(cmp) {
                var spec;
                
                if (cmp.$allowedComponent) {
                    spec = jazzman.env.currentSpec;
                    
                    if (spec) {
                        jazzman.console.error(spec.getFullName() + ' attempted to unregister ' + cmp.id);
                        spec.fail('attempted to unregister ' + cmp.id);
                    }
                    else {
                        jazzman.console.error('Attempted to unregister allowed component: ' + cmp.id);
                    }
                }
                else {
                    this.callParent([cmp]);
                }
            }
        });
        
        // Make sure MessageBox is allowed and stickied upfront
        Ext.define(null, {
            override: Ext.isModern ? 'Ext.MessageBox' : 'Ext.window.MessageBox'
        }, function() {
            // This should come right after the function that creates MessageBox instance
            Ext.onInternalReady(function() {
                var msgbox = Ext.Msg;

                // Allow the MessageBox's centering window resize listener to persist.
                if (msgbox && Ext.isModern) {
                    msgbox.show(null);
                    jazzman.addAllowedListener('resize');
                    msgbox.hide(null);
                }

                jazzman.addAllowedComponent(msgbox, true, true);
                jazzman.preventGarbageCollection(msgbox);
        
                // Tag the MessageBox el with stickness so it doesn't get detected as leaked DOM
                if (msgbox.rendered) {
                    msgbox.el.dom.setAttribute('data-sticky', 'true');
                }
                else {
                    msgbox.on({
                        render: function(cmp) {
                            cmp.el.dom.setAttribute('data-sticky', 'true');
                        },
                        single: true
                    });
                }
            });
        });
        
        // Default ZIndexManager is not a component but we want
        // to allow its listeners to linger on GlobalEvents
        Ext.define(null, {
            override: 'Ext.ZIndexManager'
        }, function() {
            if (Ext.WindowManager) {
                jazzman.addAllowedComponent(Ext.WindowManager.id);
            }
        });
        
        Ext.define(null, {
            override: 'Ext.data.StoreManager',
            
            lookup: function(store, defaultType) {
                var result = this.callParent([store, defaultType]);
                
                if (result && result.autoDestroy && !result.isEmptyStore && !result.$trackedResource) {
                    result.$trackedResource = true;
                    this.autoCreatedStores.push(result);
                }
                
                return result;
            },
            
            clear: function() {
                this.callParent();
                this.autoCreatedStores.length = 0;
            }
        }, function(StoreManager) {
            StoreManager.autoCreatedStores = [];
        });
        
        Ext.define(null, {
            override: 'Ext.TaskQueue'
        }, function() {
            // Ext.TaskQueue usage is just too contrived to clean it up at this time
            Ext.TaskQueue.run.$skipTimerCheck = Ext.TaskQueue.run.$clearTimer = true;
        });
        
        Ext.define(null, {
            override: 'Ext.AnimationQueue'
        }, function() {
            // Same goes for AnimationQueue
            Ext.AnimationQueue.run.$skipTimerCheck = Ext.AnimationQueue.run.$clearTimer = true;
        });
        
        // The number of classes in the framework. Tests must not add or remove.
        env.baseClassCount = Ext.ClassManager.classCount;
        
        if (Ext.ComponentMgr) {
            // This warrants an additional check because Component might not be loaded
            // if we're only testing Widgets!
            if (Ext.Component && Ext.ComponentMgr.installFocusListener) {
                jazzman.addAllowedComponent(Ext.ComponentMgr);
                Ext.ComponentMgr.installFocusListener();
            }
        }
        
        if (Ext.drag && Ext.drag.Manager) {
            Ext.override(Ext.drag.Manager, {
                register: function(target) {
                    if (jazzman.CAPTURE_CALL_STACK) {
                        target.$createdAt = new Error().stack;
                    }
                    
                    target.spec = jazzman.getEnv().currentSpec;
                    
                    this.callParent([target]);
                }
            });
        }

        // eslint-disable-next-line vars-on-top
        var spec = env.rootSuite.it('There should be no resource leaks before test suite start', function() {
            var allowedComponents = this.env.allowedComponents,
                leaks = [],
                components, cmp, i, len;
            
            if (Ext.ComponentMgr) {
                components = Ext.ComponentMgr.getAll();
                
                // Ext.MessageBox and its children are going to be present in all tests.
                // The reason why we don't just add allow everything that is already present
                // in Ext.ComponentMgr collection is that sometimes components are created
                // by mistake in spec definition. We want to catch these as well.
                for (i = 0, len = components.length; i < len; i++) {
                    cmp = components[i];
                    
                    if (!allowedComponents[cmp.id]) {
                        leaks.push(cmp);
                    }
                }
                
                if (leaks.length) {
                    jazzman.console.error('COMPONENTS EXIST BEFORE TEST SUITE START');
                    jazzman.console.dir(leaks);
                    
                    expect(leaks).toCleanup('Components exist before test suite start');
                }
                
                // Destroy only disallowed components
                if (leaks.length) {
                    Ext.destroy(leaks);
                }
            }
            
            // beforeAll will automatically enumerate resources the first time it kicks in,
            // but we need the list to be up to snuff before that ever happens
            this.env.enumerateResources(false, true);
        }, { toStart: true, totalSpecs: 0, skipBeforesAndAfters: true });
        
        spec.skipReporting = true;
    }
});

/**
 * Class to act as a bridge between the MockAjax class and Ext.data.Request
 */
jazzman.getGlobal().MockAjaxManager = {
    getXhrInstance: null,
    
    /**
     * Pushes methods onto the Request prototype to make it easier to deal with
     */
    addMethods: function() {
        var Connection = Ext.data.Connection,
            connectionProto = Connection.prototype,
            requestProto = Ext.data.request.Ajax.prototype;
            
        Connection.requestId = 0;
        MockAjaxManager.getXhrInstance = requestProto.getXhrInstance;
        
        /**
         * Template method to create the AJAX request
         */
        requestProto.getXhrInstance = function() {
            return new MockAjax();
        };
        
        /**
         * Method to simulate a request completing
         * @param {Object} response The response
         * @param {String} id (optional) The id of the completed request
         */
        connectionProto.mockComplete = function(response, id) {
            var request = this.mockGetRequestXHR(id);
            
            if (request) {
                request.xhr.complete(response);
            }
        };

        connectionProto.mockCompleteWithData = function(data, id) {
            this.mockComplete({
                status: 200,
                responseText: Ext.JSON.encode(data)
            }, id);
        };
        
        /**
         * Get a particular request
         * @param {String} id (optional) The id of the request
         */
        connectionProto.mockGetRequestXHR = function(id) {
            var request;
                
            if (id) {
                request = this.requests[id];
            }
            else {
                // get the first one
                request = this.mockGetAllRequests()[0];
            }
            
            return request ? request : null;
        };
        
        /**
         * Gets all the requests from the Connection
         */
        connectionProto.mockGetAllRequests = function() {
            var requests = this.requests,
                out = [],
                id;
            
            for (id in requests) {
                if (requests.hasOwnProperty(id)) {
                    out.push(requests[id]);
                }
            }
            
            return out;
        };
        
        if (Ext.data.JsonP) {
            Ext.data.JsonP.loadScript = Ext.emptyFn;
            
            Ext.data.JsonP.createScript = function() {
                return document.createElement('script');
            };
            
            Ext.data.JsonP.mockComplete = function(url, data) {
                var requests = this.requests,
                    id, request, callbackName;
                
                // We have the request itself, yey!
                if (typeof url === 'object') {
                    request = url;
                }
                
                // If we happen to know id, let's use it
                else if (typeof url === 'number') {
                    request = requests[url];
                }
                
                else {
                    for (id in requests) {
                        if (requests[id].url.indexOf(url) === 0) {
                            request = requests[id];
                            break;
                        }
                    }
                }
                
                if (!request) {
                    return;
                }
                
                callbackName = request.callbackName;
                
                this[callbackName](data);
            };
        }
        
        this.originalExtAjax = Ext.Ajax;
        Ext.Ajax = new Connection({ autoAbort: false });
    },
    
    /**
     * Restore any changes made by addMethods
     */
    removeMethods: function() {
        var proto = Ext.data.Connection.prototype;

        Ext.Ajax.abortAll();
        
        if (this.originalExtAjax) {
            delete proto.mockComplete;
            delete proto.mockGetRequestXHR;
            
            Ext.Ajax = this.originalExtAjax;
            delete this.originalExtAjax;
            
            if (Ext.data.JsonP) {
                delete Ext.data.JsonP.loadScript;
                delete Ext.data.JsonP.mockComplete;
            }

            Ext.data.request.Ajax.prototype.getXhrInstance = MockAjaxManager.getXhrInstance;
            MockAjaxManager.getXhrInstance = null;
        }
    }
};

Ext.testHelper = {
    defaultTarget: document.createElement('div'),

    createTouchList: function(touches) {
        var touchList = [],
            i, ln, touch;

        for (i = 0, ln = touches.length; i < ln; i++) {
            touch = touches[i];

            touchList.push(this.createTouch(touch));
        }

        return touchList;
    },

    createTouch: function(touch) {
        return Ext.merge({
            target: this.defaultTarget,
            timeStamp: Ext.Date.now(),
            time: Ext.Date.now(),
            pageX: 0,
            pageY: 0,
            identifier: 0,
            point: new Ext.util.Point(touch.pageX || 0, touch.pageY || 0)
        }, touch || {});
    },

    createTouchEvent: function(event) {
        var touchEvent = Ext.merge({
            type: 'touchstart',
            target: this.defaultTarget,
            timeStamp: Ext.Date.now(),
            time: Ext.Date.now(),
            touches: [],
            changedTouches: [],
            targetTouches: [],
            pageX: 0,
            pageY: 0
        }, event || {});

        touchEvent.touches = this.createTouchList(touchEvent.touches);
        touchEvent.changedTouches = this.createTouchList(touchEvent.changedTouches);
        touchEvent.targetTouches = this.createTouchList(touchEvent.targetTouches);

        return touchEvent;
    },

    createTouchEvents: function(events) {
        var ret = [],
            i, ln, event;

        for (i = 0, ln = events.length; i < ln; i++) {
            event = events[i];

            ret.push(this.createTouchEvent(event));
        }

        return ret;
    },

    recognize: function(recognizer, events) {
        var currentTouchesCount = 0,
            i, ln, e;

        events = this.createTouchEvents(events);

        mainLoop: for (i = 0, ln = events.length; i < ln; i++) {
            e = events[i];

            switch (e.type) {
                case 'touchstart':
                    // eslint-disable-next-line vars-on-top
                    var changedTouchesCount = e.changedTouches.length,
                        isStarted = currentTouchesCount > 0;

                    currentTouchesCount += changedTouchesCount;

                    if (!isStarted) {
                        if (recognizer.onStart(e) === false) {
                            break mainLoop;
                        }
                    }

                    if (recognizer.onTouchStart(e) === false) {
                        break mainLoop;
                    }

                    break;

                case 'touchmove':
                    if (recognizer.onTouchMove(e) === false) {
                        break mainLoop;
                    }
                    
                    break;

                case 'touchend':
                    changedTouchesCount = e.changedTouches.length;

                    currentTouchesCount -= changedTouchesCount;

                    if (recognizer.onTouchEnd(e) === false) {
                        break mainLoop;
                    }

                    if (this.currentTouchesCount === 0) {
                        if (recognizer.onEnd(e) === false) {
                            break mainLoop;
                        }
                    }
                    
                    break;
            }
        }

        return events;
    },

    pointerEvents: Ext.supports.PointerEvents ? {
        start: 'pointerdown',
        move: 'pointermove',
        end: 'pointerup',
        cancel: 'pointercancel',
        over: 'pointerover',
        out: 'pointerout',
        enter: 'pointerenter',
        // No decent way to feature detect this, pointerleave relatedTarget is
        // incorrect on IE11, so force it to use mouseleave here.
        // See: https://connect.microsoft.com/IE/feedback/details/851111/ev-relatedtarget-in-pointerleave-indicates-departure-element-not-destination-element
        leave: jasmine.browser.isIE11 ? 'mouseleave' : 'pointerleave'
    } : Ext.supports.MSPointerEvents ? {
        start: 'MSPointerDown',
        move: 'MSPointerMove',
        end: 'MSPointerUp',
        cancel: 'MSPointerCancel',
        over: 'MSPointerOver',
        out: 'MSPointerOut',
        // IE10 does not have pointer events for enter/leave
        enter: 'mouseenter',
        leave: 'mouseleave'
    } : {},

    touchEvents: {
        start: 'touchstart',
        move: 'touchmove',
        end: 'touchend',
        cancel: 'touchcancel'
    },

    mouseEvents: {
        start: 'mousedown',
        move: 'mousemove',
        end: 'mouseup',
        over: 'mouseover',
        out: 'mouseout',
        enter: 'mouseenter',
        leave: 'mouseleave',
        cancel: 'mouseup'
    },

    fireEvent: function(type, target, cfg) {
        var me = this,
            scroll = Ext.getDoc().getScroll(),
            eventType, centre;

        if (!cfg) {
            cfg = {};
        }

        cfg.id = cfg.id || 1;

        if (cfg.x == null || cfg.y == null) {
            // Default to the middle of the target
            centre = Ext.fly(target, '_testFireEvent').getAnchorXY('c');

            if (cfg.x == null) {
                cfg.x = centre[0];
            }

            if (cfg.y == null) {
                cfg.y = centre[1];
            }
        }

        target = Ext.getDom(target);
        eventType = me.pointerEvents[type];

        // If the type required can be handled through the pointer events system, use that
        if (eventType) {
            return jasmine.firePointerEvent(
                target,
                eventType,
                cfg.id,
                cfg.x - scroll.left,
                cfg.y - scroll.top,
                cfg.button || 0,
                cfg.shiftKey,
                cfg.ctrlKey,
                cfg.altKey,
                cfg.relatedTarget,
                cfg.pointerType || 'mouse'
            );
        }
        // Now decide whether to use touch or mouse events
        else {
            // Use touch if the platform supports the requested interaction type.
            // If it's "over" or "out", we'll fall through to mouse events.
            // This is important for touch enabled platforms which have a mouse but
            // do not support W3C pointer events.
            // If they insist on specifying touch events, override the fallback to mouse
            // on desktop browsers that support touch events

            eventType = me.touchEvents[type];
            
            if (jasmine.supportsTouch &&
                    (cfg.pointerType === 'touch' || (eventType && !Ext.os.is.Desktop))) {
                // If a translated mousemove happens with no prior mousedown
                // we have to ignore it - that's no gesture on touch.
                if (eventType === 'touchmove' && !Ext.Object.getKeys(me.activeTouches).length) {
                    return;
                }

                return me.fireSingleTouch(me.touchEvents[type], target, cfg);
            }
            // Use mouse events
            else {
                return jasmine.doFireMouseEvent(
                    target,
                    me.mouseEvents[type],
                    cfg.x - scroll.left,
                    cfg.y - scroll.top,
                    cfg.button || 0,
                    cfg.shiftKey,
                    cfg.ctrlKey,
                    cfg.altKey,
                    cfg.relatedTarget
                );
            }
        }
    },

    fireSingleTouch: function(type, target, cfg) {
        var activeTouches = this.activeTouches || (this.activeTouches = {}),
            scroll = Ext.getDoc().getScroll(),
            touch, touches, id;

        touch = activeTouches[cfg.id] = {
            identifier: cfg.id,
            pageX: cfg.x,
            pageY: cfg.y,
            clientX: cfg.x - scroll.left,
            clientY: cfg.y - scroll.top,
            screenX: cfg.x - scroll.left,
            screenY: cfg.y - scroll.top,
            shiftKey: cfg.shiftKey,
            ctrlKey: cfg.ctrlKey,
            altKey: cfg.altKey
        };

        touches = [];

        if (type === 'touchend' || type === 'touchcancel') {
            delete activeTouches[cfg.id];
        }

        for (id in activeTouches) {
            touches.push(activeTouches[id]);
        }

        jasmine.fireTouchEvent(
            target,
            type,
            touches,
            [touch]
        );

    },
    
    inputTypeSelectionSupported: /text|password|search|tel|url/i,

    getCaretPos: function(el) {
        var dom = Ext.getDom(el),
            type = dom.type,
            doSwitch = !Ext.testHelper.inputTypeSelectionSupported.test(type),
            result;

        if (doSwitch) {
            dom.type = 'text';
        }

        result = Ext.fly(dom).getCaretPos();

        if (doSwitch) {
            dom.type = type;
        }

        return result;
    },

    setCaretPos: function(el, newPos) {
        var dom = Ext.getDom(el),
            type = dom.type,
            doSwitch = !Ext.testHelper.inputTypeSelectionSupported.test(type);

        if (doSwitch) {
            dom.type = 'text';
        }

        Ext.fly(dom).setCaretPos(newPos);

        if (doSwitch) {
            dom.type = type;
        }
    },

    select: function(el, start, end, direction) {
        var dom = Ext.getDom(el),
            type = dom.type,
            doSwitch = !Ext.testHelper.inputTypeSelectionSupported.test(type);

        if (doSwitch) {
            dom.type = 'text';
        }

        Ext.fly(dom).selectText(start, end, direction);

        if (doSwitch) {
            dom.type = type;
        }
    },

    tap: function(target, cfg) {
        var scroll, ret;

        cfg = cfg || {};

        this.fireEvent('start', target, cfg);
        this.fireEvent('end', target, cfg);

        scroll = Ext.getDoc().getScroll();

        ret = jasmine.doFireMouseEvent(
            Ext.getDom(target),
            'click',
            (cfg.x || 0) - scroll.left,
            (cfg.y || 0) - scroll.top,
            cfg.button ? cfg.button : 0,
            cfg.shiftKey,
            cfg.ctrlKey,
            cfg.altKey
        );

        return ret;
    },

    touchStart: function(target, cfg) {
        this.fireEvent('start', target, Ext.apply({
            pointerType: 'touch'
        }, cfg));
    },

    touchMove: function(target, cfg) {
        this.fireEvent('move', target, Ext.apply({
            pointerType: 'touch'
        }, cfg));
    },

    touchEnd: function(target, cfg) {
        this.fireEvent('end', target, Ext.apply({
            pointerType: 'touch'
        }, cfg));
    },

    touchCancel: function(target, cfg) {
        this.fireEvent('cancel', target, Ext.apply({
            pointerType: 'touch'
        }, cfg));
    },
    
    showHeaderMenu: function(column) {
        var menu = column.getRootHeaderCt().getMenu();

        // Hide menu if it's shown for another column
        runs(function() {
            if (menu.isVisible() && menu.getRefOwner() !== column) {
                menu.hide();
            }
        });
        focusAndWait(column);
        runs(function() {
            jasmine.fireKeyEvent(column.el, 'keydown', Ext.event.Event.DOWN);
            waitsForFocus(menu.child(':focusable'), 'Column #' + column.id +
                          ' [text="' + column.text + '"] to focus');
        });
    },

    parseTransform: function(el) {
        var match, ret;
        
        el = Ext.getDom(el);

        // eslint-disable-next-line no-useless-escape
        match = /translate(?:3d)?\s*\(([^\)]*)\)/.exec(el.style.transform);

        if (match) {
            ret = match[1].split(/\s*,\s*/);
        }
        else {
            ret = [0, 0, 0];
        }
        
        return ret;
    },

    doTyping: function(el, text) {
        el = Ext.get(el);
        
        if (text == null) {
            text = '';
        }

        // eslint-disable-next-line vars-on-top
        var dom = Ext.getDom(el),
            curValue = dom.value,
            cursorPos = this.getCaretPos(el),
            charCount = text.length,
            newValue = curValue.substr(0, cursorPos) + text + curValue.substr(cursorPos),
            inputEvent;

        if (document.defaultView.InputEvent) {
            inputEvent = new InputEvent('input');
            inputEvent.bubbles = true;
            inputEvent.cancelable = true;
        }
        else {
            inputEvent = document.createEvent('Event');
            inputEvent.initEvent('input', true, true);
        }

        dom.value = newValue;
        this.setCaretPos(el, cursorPos + charCount);
        
        dom.dispatchEvent(inputEvent);
    },

    // jazzman automatically invokes this method after each spec
    reset: function() {
        var activeTouches = this.activeTouches,
            id;

        for (id in activeTouches) {
            jasmine.fireTouchEvent(
                document,
                'touchcancel',
                [activeTouches[id]],
                [activeTouches[id]]
            );
        }
        
        this.activeTouches = null;

        // End any mousedown counters. Don't fire mouseup if there was no mousedown though!
        if (jasmine.doFireMouseEvent.needMouseup) {
            // We don't need stack for this one, and collecting it is expensive!
            id = jasmine.CAPTURE_CALL_STACK;
            jasmine.CAPTURE_CALL_STACK = false;

            jasmine.doFireMouseEvent(document.body, 'mouseup');

            jasmine.CAPTURE_CALL_STACK = id;
        }
    },

    hash: {
        init: function() {
            this.$win = Ext.util.History.win;

            Ext.util.History.win = Ext.testHelper.hash.create();
        },

        reset: function() {
            Ext.util.History.win = this.$win;
            this.$win = null;

            delete Ext.util.History.hashBang;

            Ext.util.History.currentToken =
                Ext.util.History.hash =
                window.location.hash = '';
        },

        create: function() {
            var HashMock = {
                hash: '',
                historyStack: [],
                currentIdx: -1,
                history: {
                    go: function(direction) {
                        var newIdx = HashMock.currentIdx + direction;

                        if (newIdx < 0) {
                            // cannot go to -1
                            newIdx = 0;
                        }

                        HashMock.currentIdx = newIdx;

                        HashMock.hash = HashMock.historyStack[newIdx] || '';
                    }
                },
                location: {
                    replace: function(uri) {
                        var stack = HashMock.historyStack,
                            idx = HashMock.currentIdx;

                        if (idx < 0) {
                            // should not replace -1
                            idx = HashMock.currentIdx = 0;
                        }

                        stack[idx] = uri;

                        HashMock.hash = '#' + uri.split('#')[1];
                    }
                },
                reset: function() {
                    this.hash = '';
                    this.historyStack.length = 0;
                    this.currentIdx = -1;
                }
            };

            if (!Ext.isIE8) {
                Object.defineProperty(HashMock.location, 'hash', {
                    enumerable: true,
                    get: function() {
                        return HashMock.hash;
                    },
                    set: function(frag) {
                        if (frag.substr(0, 1) !== '#') {
                            frag = '#' + frag;
                        }

                        if (HashMock.hash !== frag) {
                            // eslint-disable-next-line vars-on-top
                            var stack = HashMock.historyStack,
                                num = stack.length;

                            if (HashMock.currentIdx === -1) {
                                stack.push('');
                                HashMock.currentIdx = num;

                                num++;
                            }

                            if (num - 1 > HashMock.currentIdx) {
                                stack.length = num - 1;
                            }

                            stack.push(HashMock.hash = frag);

                            HashMock.currentIdx = num;
                        }
                    }
                });
            }

            return HashMock;
        }
    }
};

})();
