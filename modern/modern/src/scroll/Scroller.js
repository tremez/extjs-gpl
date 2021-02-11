/**
 * Ext.scroll.Scroller allows any element to have scrollable content, both on desktop and
 * touch-screen devices, and defines a set of useful methods for manipulating the scroll
 * position and controlling the scrolling behavior.
 */
Ext.define('Ext.scroll.Scroller', {
    extend: 'Ext.Evented',
    alias: 'scroller.scroller',

    uses: [
        'Ext.scroll.NativeScroller',
        'Ext.scroll.VirtualScroller'
    ],

    mixins: [
        'Ext.mixin.Factoryable',
        'Ext.mixin.Bufferable'
    ],

    isScroller: true,

    factoryConfig: {
        defaultType: 'native'
    },

    bufferableMethods: {
        onScrollEnd: 100
    },

    /**
     * @event refresh
     * Fires whenever the Scroller is refreshed.
     * @param {Ext.scroll.Scroller} this
     */

    /**
     * @event scrollstart
     * Fires whenever the scrolling is started.
     * @param {Ext.scroll.Scroller} this
     * @param {Number} x The current x position
     * @param {Number} y The current y position
     */

    /**
     * @event scrollend
     * Fires whenever the scrolling is ended.
     * @param {Ext.scroll.Scroller} this
     * @param {Number} x The current x position
     * @param {Number} y The current y position
     * @param {Number} deltaX The change in x value
     * @param {Number} deltaY The change in y value
     */

    /**
     * @event scroll
     * Fires whenever the Scroller is scrolled.
     * @param {Ext.scroll.Scroller} this
     * @param {Number} x The new x position
     * @param {Number} y The new y position
     * @param {Number} deltaX The change in x value since the last scrollstart event
     * @param {Number} deltaY The change in y value since the last scrollstart event
     */

    config: {
        /**
         * @cfg {'auto'/'vertical'/'horizontal'/'both'} [direction='auto']
         * @deprecated 5.1.0 use {@link #x} and {@link #y} instead
         */
        direction: undefined, // undefined because we need the updater to always run

        /**
         * @cfg {String/HTMLElement/Ext.dom.Element}
         * The element to make scrollable.
         */
        element: null,

        /**
         * @cfg {Object}
         * The size of the scrollable content expressed as an object with x and y properties
         * @private
         * @readonly
         */
        size: null,

        /**
         * @cfg {Boolean/String}
         * - `true` or `'auto'` to enable horizontal auto-scrolling. In auto-scrolling mode
         * scrolling is only enabled when the {@link #element} has overflowing content.
         * - `false` to disable horizontal scrolling
         * - `'scroll'` to always enable horizontal scrolling regardless of content size.
         */
        x: true,

        /**
         * @cfg {Boolean/String}
         * - `true` or `'auto'` to enable vertical auto-scrolling. In auto-scrolling mode
         * scrolling is only enabled when the {@link #element} has overflowing content.
         * - `false` to disable vertical scrolling
         * - `'scroll'` to always enable vertical scrolling regardless of content size.
         */
        y: true,

        /**
         * @cfg {Object} touchAction for the scroller's {@link #element}.
         *
         * For more details see {@link Ext.dom.Element#setTouchAction}
         */
        touchAction: null,

        /**
         * @private
         */
        translatable: 'scrollposition'
    },

    constructor: function(config) {
        var me = this;

        me.position = { x: 0, y: 0 };

        me.configuredSize = { x: false, y: false };

        me.callParent([config]);
    },

    destroy: function() {
        var me = this;

        me.destroying = true;
        me.destroy = Ext.emptyFn;

        me.doDestroy();

        me.callParent();

        // This just makes it hard to ask "was destroy() called?":
        // me.destroying = false; // removed in 7.0
    },

    doDestroy: function() {
        var me = this,
            partners, id;

        me.component = null;

        partners = me._partners;

        if (partners) {
            for (id in partners) {
                me.removePartner(partners[id].scroller);
            }
        }

        me._partners = null;

        me.setElement(null);
        me.setTranslatable(null);
    },

    /**
     * Adds a "partner" scroller.  Partner scrollers reflect each other's scroll position
     * at all times - if either scroller is scrolled, the scroll position of its partner
     * will be be automatically synchronized.
     *
     * A scroller may have multiple partners.
     *
     * @param {Ext.scroll.Scroller} partner
     * @param {String} [axis='both'] The axis to synchronize (`'x'`, '`y`', or '`both`')
     */
    addPartner: function(partner, axis) {
        var me = this,
            partners = me._partners || (me._partners = {}),
            otherPartners = partner._partners || (partner._partners = {});

        // Translate to boolean flags. {x:<boolean>,y:<boolean>}
        axis = me.axisConfigs[axis || 'both'];

        partners[partner.getId()] = {
            scroller: partner,
            axes: axis,
            called: false,
            calledPrimary: false
        };

        otherPartners[me.getId()] = {
            scroller: me,
            axes: axis,
            called: false,
            calledPrimary: false
        };
    },

    // hook for rtl mode to convert an x coordinate to RTL space.
    convertX: function(x) {
        return x;
    },

    /**
     * Ensures a descendant element of the scroller is visible by scrolling to it.
     *
     * @param {Object/String/HTMLElement/Ext.dom.Element} el
     * The descendant element to scroll into view. May also be the options object with
     * the `element` key defining the descendant element.
     *
     * @param {Object} [options] An object containing options to modify the operation.
     *
     * @param {Object} [options.align] The alignment for the scroll.
     * @param {'start'/'center'/'end'} [options.align.x] The alignment of the x scroll. If not
     * specified, the minimum will be done to make the element visible. The behavior is `undefined`
     * if the request cannot be honored. If the alignment is suffixed with a `?`, the alignment will
     * only take place if the item is not already in the visible area.
     * @param {'start'/'center'/'end'} [options.align.y] The alignment of the y scroll. If not
     * specified, the minimum will be done to make the element visible. The behavior is `undefined`
     * if the request cannot be honored. If the alignment is suffixed with a `?`, the alignment will
     * only take place if the item is not already in the visible area.
     *
     * @param {Boolean} [options.animation] Pass `true` to animate the row into view.
     *
     * @param {Boolean} [options.highlight=false] Pass `true` to highlight the row with a glow
     * animation when it is in view. Can also be a hex color to use for highlighting
     * (defaults to yellow = '#ffff9c').
     *
     * @param {Boolean} [options.x=true] `false` to disable horizontal scroll.
     * @param {Boolean} [options.y=true] `false` to disable vertical scroll.
     *
     * @return {Ext.Promise} A promise for when the scroll completes.
     * @since 6.5.1
     */
    ensureVisible: function(el, options) {
        var me = this,
            position = me.getPosition(),
            highlight, newPosition, ret;

        // Might get called before Component#onBoxReady which is when the Scroller is set up with
        // elements.
        if (el) {
            if (el && el.element && !el.isElement) {
                options = el;
                el = options.element;
            }

            options = options || {};

            highlight = options.highlight;
            newPosition = me.getEnsureVisibleXY(el, options);

            // Only attempt to scroll if it's needed.
            if (newPosition.y !== position.y || newPosition.x !== position.x) {
                if (highlight) {
                    me.on({
                        scrollend: 'doHighlight',
                        scope: me,
                        single: true,
                        args: [el, highlight]
                    });
                }

                ret = me.doScrollTo(newPosition.x, newPosition.y, options.animation);
            }
            else {
                // No scrolling needed, but still honor highlight request
                if (highlight) {
                    me.doHighlight(el, highlight);
                }

                // Resolve straight away
                ret = Ext.Deferred.getCachedResolved();
            }
        }
        else {
            // Can't scroll
            ret = Ext.Deferred.getCachedRejected();
        }

        return ret;
    },

    /**
     * @method getClientSize
     * Gets the `clientWidth` and `clientHeight` of the {@link #element} for this scroller.
     * @return {Object} An object with `x` and `y` properties.
     */

    /**
     * @method getMaxPosition
     * Returns the maximum scroll position for this scroller
     * @return {Object} position
     * @return {Number} return.x The maximum scroll position on the x axis
     * @return {Number} return.y The maximum scroll position on the y axis
     */

    /**
     * @method getMaxUserPosition
     * Returns the maximum scroll position for this scroller for scrolling that is initiated
     * by the user via mouse or touch.  This differs from getMaxPosition in that getMaxPosition
     * returns the true maximum scroll position regardless of which axes are enabled for
     * user scrolling.
     * @return {Object} position
     * @return {Number} return.x The maximum scroll position on the x axis
     * @return {Number} return.y The maximum scroll position on the y axis
     */

    /**
     * @method getPosition
     * Returns the current scroll position
     * @return {Object} An object with `x` and `y` properties.
     */
    getPosition: function() {
        return this.position;
    },

    /**
     * @method getScrollbarSize
     * Returns the amount of space consumed by scrollbars in the DOM
     * @return {Object} size An object containing the scrollbar sizes.
     * @return {Number} return.width The width of the vertical scrollbar.
     * @return {Number} return.height The height of the horizontal scrollbar.
     */

    /**
     * Determines if the passed element is within the visible x and y scroll viewport.
     * @param {String/HTMLElement/Ext.dom.Element} el The dom node, Ext.dom.Element, or
     * id (string) of the dom element that is to be verified to be in view
     * @param {Boolean} [contains=true] `false` to skip checking if the scroller contains
     * the passed element in the dom.  When `false` the element is considered to be
     * "in view" if its location on the page is within the scroller's client region.
     * Passing `false` improves performance when the element is already known to be
     * contained by this scroller.
     * @return {Object} Which ranges the element is in.
     * @return {Boolean} return.x `true` if the passed element is within the x visible range.
     * @return {Boolean} return.y `true` if the passed element is within the y visible range.
     */
    isInView: function(el, contains) {
        var me = this,
            c = me.component,
            result = {
                x: false,
                y: false
            },
            myEl = me.getElement(),
            elRegion, myElRegion;

        if (el && (contains === false || myEl.contains(el) || (c && c.owns(el)))) {
            myElRegion = myEl.getRegion();
            elRegion = Ext.fly(el).getRegion();

            result.x = elRegion.right > myElRegion.left && elRegion.left < myElRegion.right;
            result.y = elRegion.bottom > myElRegion.top && elRegion.top < myElRegion.bottom;
        }

        return result;
    },

    /**
     * Refreshes the scroller size and maxPosition.
     * @param {Boolean} immediate `true` to refresh immediately. By default refreshes
     * are deferred until the next {@link Ext.GlobalEvents#event-idle idle} event to
     * ensure any pending writes have been flushed to the dom and any reflows have
     * taken place.
     * @return {Ext.scroll.Scroller} this
     * @chainable
     */
    refresh: function() {
        this.fireEvent('refresh', this);

        return this;
    },

    /**
     * Removes a partnership that was created via {@link #addPartner}
     * @param {Ext.scroll.Scroller} partner
     * @private
     */
    removePartner: function(partner) {
        var partners = this._partners,
            otherPartners = partner._partners;

        if (partners) {
            delete partners[partner.getId()];
        }

        if (otherPartners) {
            delete(otherPartners[this.getId()]);
        }
    },

    /**
     * Scrolls by the passed delta values, optionally animating.
     *
     * All of the following are equivalent:
     *
     *      scroller.scrollBy(10, 10, true);
     *      scroller.scrollBy([10, 10], true);
     *      scroller.scrollBy({ x: 10, y: 10 }, true);
     *
     * A null value for either `x` or `y` will result in no scrolling on the given axis,
     * for example:
     *
     *     scroller.scrollBy(null, 10);
     *
     * will scroll by 10 on the y axis and leave the x axis at its current scroll position
     *
     * @param {Number/Number[]/Object} deltaX Either the x delta, an Array specifying x
     * and y deltas or an object with "x" and "y" properties.
     * @param {Number/Boolean/Object} deltaY Either the y delta, or an animate flag or
     * config object.
     * @param {Boolean/Object} animate Animate flag/config object if the delta values were
     * passed separately.
     * @return {Ext.Promise} A promise for when the scroll completes.
     */
    scrollBy: function(deltaX, deltaY, animate) {
        var position = this.getPosition();

        if (deltaX) {
            if (deltaX.length) { // array
                animate = deltaY;
                deltaY = deltaX[1];
                deltaX = deltaX[0];
            }
            else if (typeof deltaX !== 'number') { // object
                animate = deltaY;
                deltaY = deltaX.y;
                deltaX = deltaX.x;
            }
        }

        deltaX = (typeof deltaX === 'number') ? deltaX + position.x : null;
        deltaY = (typeof deltaY === 'number') ? deltaY + position.y : null;

        return this.doScrollTo(deltaX, deltaY, animate);
    },

    /**
     * Scrolls a descendant element of the scroller into view.
     * @param {String/HTMLElement/Ext.dom.Element} el the descendant to scroll into view
     * @param {Boolean} [hscroll=true] False to disable horizontal scroll.
     * @param {Boolean/Object} [animate] true for the default animation or a standard Element
     * animation config object
     * @param {Boolean/String} [highlight=false] true to
     * {@link Ext.dom.Element#highlight} the element when it is in view. Can also be a
     * hex color to use for highlighting (defaults to yellow = '#ffff9c').
     *
     * @deprecated 6.5.1 Use {@link #ensureVisible} instead.
     * @return {Ext.Promise} A promise for when the scroll completes.
     */
    scrollIntoView: function(el, hscroll, animate, highlight) {
        return this.ensureVisible(el, {
            animation: animate,
            highlight: highlight,
            x: hscroll
        });
    },

    /**
     * Scrolls to the given position.
     *
     * All of the following are equivalent:
     *
     *      scroller.scrollTo(10, 10, true);
     *      scroller.scrollTo([10, 10], true);
     *      scroller.scrollTo({ x: 10, y: 10 }, true);
     *
     * A null value for either `x` or `y` will result in no scrolling on the given axis,
     * for example:
     *
     *     scroller.scrollTo(null, 10);
     *
     * will scroll to 10 on the y axis and leave the x axis at its current scroll position
     *
     * A negative value for either `x` or `y` represents an offset from the maximum scroll
     * position on the given axis:
     *
     *     // scrolls to 10px from the maximum x scroll position and 20px from maximum y
     *     scroller.scrollTo(-10, -20);
     *
     * A value of Infinity on either axis will scroll to the maximum scroll position on
     * that axis:
     *
     *     // scrolls to the maximum position on both axes
     *     scroller.scrollTo(Infinity, Infinity);
     *
     * @param {Number} x The scroll position on the x axis.
     * @param {Number} y The scroll position on the y axis.
     * @param {Boolean/Object} [animation] Whether or not to animate the scrolling to the new
     * position.
     *
     * @return {Ext.Promise} A promise for when the scroll completes.
     */
    scrollTo: function(x, y, animation) {
        var me = this,
            maxPosition;

        if (x) {
            if (Ext.isArray(x)) {
                animation = y;
                y = x[1];
                x = x[0];
            }
            else if (typeof x !== 'number') {
                animation = y;
                y = x.y;
                x = x.x;
            }
        }

        if (x < 0 || y < 0) {
            maxPosition = me.getMaxPosition();

            if (x < 0) {
                x += maxPosition.x;
            }

            if (y < 0) {
                y += maxPosition.y;
            }
        }

        return me.doScrollTo(x, y, animation);
    },

    //-------------------------
    // Public Configs

    // element

    applyElement: function(element) {
        if (element) {
            //<debug>
            if (typeof element === 'string' && !Ext.get(element)) {
                Ext.raise("Cannot create Ext.scroll.Scroller instance. " +
                    "Element with id '" + element + "' not found.");
            }
            //</debug>

            if (!element.isElement) {
                element = Ext.get(element);
            }
        }

        return element;
    },

    updateElement: function(element, oldElement) {
        var me = this,
            scrollerCls = me.scrollerCls,
            touchAction;

        if (oldElement && !oldElement.destroyed) {
            oldElement.removeCls(scrollerCls);
        }

        if (element) {
            if (!this.isConfiguring) {
                touchAction = this.getTouchAction();

                if (touchAction) {
                    element.setTouchAction(touchAction);
                }
            }

            element.addCls(scrollerCls);
        }
    },

    // direction

    updateDirection: function(direction) {
        var me = this,
            x, y;

        if (!direction) {
            // if no direction was configured we set its value based on the values of
            // x and y.  This ensures getDirection() always returns something useful
            // for backward compatibility.
            x = me.getX();
            y = me.getY();

            if (x && y) {
                direction = (y === 'scroll' && x === 'scroll') ? 'both' : 'auto';
            }
            else if (y) {
                direction = 'vertical';
            }
            else if (x) {
                direction = 'horizontal';
            }

            // set the _direction property directly to avoid the updater being called
            // and triggering setX/setY calls
            me._direction = direction;
        }
        else {
            if (direction === 'auto') {
                x = true;
                y = true;
            }
            else if (direction === 'vertical') {
                x = false;
                y = true;
            }
            else if (direction === 'horizontal') {
                x = true;
                y = false;
            }
            else if (direction === 'both') {
                x = 'scroll';
                y = 'scroll';
            }

            me.setX(x);
            me.setY(y);
        }
    },

    // size

    applySize: function(size, oldSize) {
        var num = 'number',
            configuredSize = this.configuredSize,
            x, y;

        if (size == null || typeof size === num) {
            x = y = size;
        }
        else if (size) {
            x = size.x;
            y = size.y;
        }

        if (typeof x === num) {
            configuredSize.x = true;
        }
        else if (x === null) {
            configuredSize.x = false;
        }

        if (typeof y === num) {
            configuredSize.y = true;
        }
        else if (y === null) {
            configuredSize.y = false;
        }

        if (x === undefined) {
            x = (oldSize ? oldSize.x : null);
        }

        if (y === undefined) {
            y = (oldSize ? oldSize.y : null);
        }

        return (oldSize && x === oldSize.x && y === oldSize.y) ? oldSize : { x: x, y: y };
    },

    // touchAction

    updateTouchAction: function(touchAction) {
        var element = this.getElement();

        if (element) {
            element.setTouchAction(touchAction);
        }
    },

    //-----------------------------------------------------------------------

    statics: {
        /**
         * Creates and returns an appropriate Scroller instance for the current device.
         * @param {Object} config Configuration options for the Scroller
         * @param type
         * @return {Ext.scroll.Scroller}
         */
        create: function(config, type) {
            return Ext.Factory.scroller(config, type);
        },

        /**
         * @private
         */
        getScrollingElement: function() {
            return Ext.get(document.scrollingElement || document.documentElement);
        }
    },

    privates: {
        scrollerCls: Ext.baseCSSPrefix + 'scroller',

        axisConfigs: {
            x: { x: 1, y: 0 },
            y: { x: 0, y: 1 },
            both: { x: 1, y: 1 }
        },

        callPartners: function(method, scrollX, scrollY) {
            var me = this,
                partners = me._partners,
                axes, id, partner, pos, scroller, x, y;

            if (!me.suspendSync) {
                for (id in partners) {
                    partner = partners[id];
                    scroller = partner.scroller;

                    if (!scroller.isPrimary && !partner.called) {
                        partner.called = true; // this flag avoids infinite recursion
                        axes = partners[id].axes;
                        pos = scroller.position;

                        x = (!axes.x || scrollX === undefined) ? pos.x : scrollX;
                        y = (!axes.y || scrollY === undefined) ? pos.y : scrollY;

                        scroller[method](x, y, (x - pos.x) || 0, (y - pos.y) || 0);

                        scroller.callPartners(method, x, y);

                        partner.called = false;
                    }
                }
            }
        },

        /**
         * Checks if the scroller contains a component by searching up the element hierarchy
         * using components. It uses component navigation as opposed to elements because we
         * want logical ownership.
         * @private
         */
        contains: function(component) {
            var el = this.getElement(),
                owner = component;

            while (owner && owner !== Ext.Viewport) {
                if (el.contains(owner.el)) {
                    return true;
                }

                owner = owner.getRefOwner();
            }

            return false;
        },

        fireScrollStart: function(x, y, deltaX, deltaY) {
            var me = this,
                component = me.component;

            me.startX = x - deltaX;
            me.startY = y - deltaY;

            if (me.hasListeners.scrollstart) {
                me.fireEvent('scrollstart', me, x, y);
            }

            if (component && component.onScrollStart) {
                component.onScrollStart(x, y);
            }

            Ext.GlobalEvents.fireEvent('scrollstart', me, x, y);
        },

        fireScroll: function(x, y, deltaX, deltaY) {
            var me = this,
                component = me.component;

            if (me.hasListeners.scroll) {
                me.fireEvent('scroll', me, x, y, deltaX, deltaY);
            }

            if (component && component.onScrollMove) {
                component.onScrollMove(x, y, deltaX, deltaY);
            }

            Ext.fireEvent('scroll', me, x, y, deltaX, deltaY);
        },

        fireScrollEnd: function(x, y) {
            var me = this,
                component = me.component,
                deltaX = x - me.startX,
                deltaY = y - me.startY;

            if (me.hasListeners.scrollend) {
                me.fireEvent('scrollend', me, x, y, deltaX, deltaY);
            }

            if (component && component.onScrollEnd) {
                component.onScrollEnd(x, y, deltaX, deltaY);
            }

            Ext.fireEvent('scrollend', me, x, y, deltaX, deltaY);
        },

        /**
         * @private
         * Gets the x/y coordinates to ensure the element is scrolled into view.
         *
         * @param {String/HTMLElement/Ext.dom.Element/Object} el
         * The descendant element to scroll into view. May also be the options object with
         * the `element` key defining the descendant element.
         *
         * @param {Object} [options] An object containing options to modify the operation.
         *
         * @param {Object/String} [options.align] The alignment for the scroll. If a string,
         * this value will be used for both `x` and `y` alignments.
         * @param {'start'/'center'/'end'} [options.align.x] The alignment of the x scroll. If not
         * specified, the minimum will be done to make the element visible. The behavior is
         * `undefined` if the request cannot be honored. If the alignment is suffixed with a `?`,
         * the alignment will only take place if the item is not already in the visible area.
         * @param {'start'/'center'/'end'} [options.align.y] The alignment of the y scroll. If not
         * specified, the minimum will be done to make the element visible. The behavior is
         * `undefined` if the request cannot be honored. If the alignment is suffixed with a `?`,
         * the alignment will only take place if the item is not already in the visible area.
         *
         * @param {Boolean} [options.x=true] `false` to disable horizontal scroll and `x` align
         * option.
         * @param {Boolean} [options.y=true] `false` to disable vertical scroll and `y` align
         * option.
         * @return {Object} The new position that will be used to scroll the element into view.
         * @since 6.5.1
         */
        getEnsureVisibleXY: function(el, options) {
            var position = this.getPosition(),
                viewport = this.component
                    ? this.component.getScrollableClientRegion()
                    : this.getElement(),
                newPosition, align;

            if (el && el.element && !el.isElement) {
                options = el;
                el = options.element;
            }

            options = options || {};
            align = options.align;

            if (align) {
                if (Ext.isString(align)) {
                    align = {
                        x: options.x === false ? null : align,
                        y: options.y === false ? null : align
                    };
                }
                else if (Ext.isObject(align)) {
                    if (align.x && options.x === false) {
                        align.x = null;
                    }

                    if (align.y && options.y === false) {
                        align.y = null;
                    }
                }
            }

            newPosition = Ext.fly(el).getScrollIntoViewXY(viewport, position.x, position.y, align);

            newPosition.x = options.x === false ? position.x : newPosition.x;
            newPosition.y = options.y === false ? position.y : newPosition.y;

            return newPosition;
        },

        onPartnerScroll: function(x, y) {
            this.doScrollTo(x, y);
        },

        onPartnerScrollStart: function(x, y, deltaX, deltaY) {
            this.isScrolling = true;

            if (deltaX || deltaY) {
                this.doScrollTo(x, y);
            }
        },

        onPartnerScrollEnd: function() {
            this.isScrolling = false;
        },

        /**
         * In IE8, IE9, and IE10 when using native scrolling the scroll position is reset
         * to 0,0 when the scrolling element is hidden.  This method may be called to restore
         * the scroll after hiding and showing the element.
         */
        restoreState: Ext.privateFn,

        resumePartnerSync: function(syncNow) {
            var me = this,
                position, x, y;

            if (me.suspendSync) {
                me.suspendSync--;
            }

            if (!me.suspendSync && syncNow) {
                position = me.position;
                x = position.x;
                y = position.y;

                me.callPartners('onPartnerScrollStart', undefined, undefined);
                me.callPartners('fireScrollStart', undefined, undefined);

                me.callPartners('onPartnerScroll', x, y);
                me.callPartners('fireScroll', x, y);

                me.callPartners('onPartnerScrollEnd');
                me.callPartners('fireScrollEnd', x, y);
            }
        },

        /**
         * Sets this scroller as the "primary" scroller in a partnership.  When true
         * sets a `isPrimary` property to true on the primary scroller and recursively sets
         * the same property to `false` on the partners
         * @param {Boolean} isPrimary
         * @private
         */
        setPrimary: function(isPrimary) {
            var me = this,
                partners = me._partners,
                partner, scroller, id;

            if (isPrimary) {
                for (id in partners) {
                    partner = partners[id];
                    scroller = partner.scroller;

                    if (!partner.calledPrimary) {
                        partner.calledPrimary = true; // this flag avoids infinite recursion
                        scroller.setPrimary(false);
                        partner.calledPrimary = false;
                    }
                }

                me.isScrolling = Ext.isScrolling = true;
            }
            else if (me.isScrolling) {
                me.cancelOnScrollEnd();
                me.doOnScrollEnd();
            }

            me.isPrimary = isPrimary;
        },

        suspendPartnerSync: function() {
            this.suspendSync = (this.suspendSync || 0) + 1;
        },

        /**
         * @private
         * May be called when a Component is rendered AFTER some scrolling partner has begun its
         * lifecycle to sync this scroller with partners which may be scrolled anywhere by now.
         */
        syncWithPartners: function() {
            var me = this,
                partners = me._partners,
                position = me.position,
                id, axes, xAxis, yAxis, partner, partnerPosition, x, y, deltaX, deltaY;

            for (id in partners) {
                axes = partners[id].axes;
                xAxis = axes.x;
                yAxis = axes.y;

                partner = partners[id].scroller;
                partnerPosition = partner.position;

                partner.setPrimary(true);

                x = xAxis ? position.x : null;
                y = yAxis ? position.y : null;

                deltaX = deltaY = 0;

                me.onPartnerScrollStart(x, y, 0, 0);

                me.fireScrollStart(x, y, 0, 0);

                x = xAxis ? partnerPosition.x : null;
                y = yAxis ? partnerPosition.y : null;

                deltaX = (x === null) ? 0 : (x - position.x);
                deltaY = (y === null) ? 0 : (y - position.y);

                me.onPartnerScroll(x, y);
                me.fireScroll(x, y, deltaX, deltaY);

                me.onPartnerScrollEnd();
                me.fireScrollEnd(x, y);

                partner.setPrimary(null);
            }
        },

        //-------------------------
        // Private Configs

        // translatable

        applyTranslatable: function(translatable, oldTranslatable) {
            return Ext.Factory.translatable.update(oldTranslatable, translatable, this,
                                                   'createTranslatable');
        }
    },

    deprecated: {
        '5': {
            methods: {
                /**
                 * @method getScroller
                 * Returns this scroller.
                 *
                 * In Sencha Touch 2, access to a Component's Scroller was provided via
                 * a Ext.scroll.View class that was returned from the Component's getScrollable()
                 * method:
                 *
                 *     component.getScrollable().getScroller();
                 *
                 * in 5.0 all the functionality of Ext.scroll.View has been rolled into
                 * Ext.scroll.Scroller, and Ext.scroll.View has been removed.  Component's
                 * getScrollable() method now returns a Ext.scroll.Scroller.  This method is
                 * provided for compatibility.
                 * @deprecated 5.0 This method is deprecated.  Please use Ext.scroll.Scroller's
                 * getScrollable() method instead.
                 */
                getScroller: function() {
                    return this;
                }
            }
        },
        '5.1.0': {
            methods: {
                /**
                 * @method scrollToTop
                 * Scrolls to 0 on both axes
                 * @param {Boolean/Object} animate
                 * @private
                 * @return {Ext.scroll.Scroller} this
                 * @chainable
                 * @deprecated 5.1.0 Use scrollTo instead
                 */
                scrollToTop: function(animate) {
                    return this.scrollTo(0, 0, animate);
                },

                /**
                 * @method scrollToEnd
                 * Scrolls to the maximum position on both axes
                 * @param {Boolean/Object} animate
                 * @private
                 * @return {Ext.scroll.Scroller} this
                 * @chainable
                 * @deprecated 5.1.0 Use scrollTo instead
                 */
                scrollToEnd: function(animate) {
                    return this.scrollTo(Infinity, Infinity, animate);
                }
            }
        }
    }
});
