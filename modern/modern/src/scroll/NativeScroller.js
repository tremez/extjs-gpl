Ext.define('Ext.scroll.NativeScroller', {
    extend: 'Ext.scroll.Scroller',
    alias: 'scroller.native',

    requires: [
        'Ext.util.CSS',
        'Ext.util.translatable.ScrollPosition',
        'Ext.Deferred'
    ],

    config: {
        monitorScroll: null,

        /**
         * @cfg {Ext.dom.Element}
         * @private
         * @readonly
         * This element is used for reading and writing scrollTop and scrollLeft, and for
         * reading scrollWidth/scrollHeight and clientWidth/clientHeight.  In most cases
         * this is the same as `element`.
         *
         * When the scroller element is the `documentElement` or `body` the
         * [document.scrollingElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/scrollingElement)
         * is used in modern browsers, and the `document.documentElement` is used in
         * legacy browsers that do not support `document.scrollingElement` (IE < 11)
         */
        scrollingElement: null,

        /**
         * @cfg {Object}
         * @private
         */
        spacerXY: null,

        /**
         * @cfg {String}
         * @private
         */
        xCls: null,

        /**
         * @cfg {String}
         * @private
         */
        yCls: null
    },

    statics: {
        /**
         * @private
         */
        initViewportScroller: function() {
            var scroller = Ext.getViewportScroller();

            if (!scroller.getElement()) {
                // if the viewport component has already claimed the viewport scroller
                // it will have already set its overflow element as the scroller element,
                // otherwise, the element is always the body.
                scroller.setElement(Ext.getBody());
            }
        }
    },

    constructor: function(config) {
        var me = this;

        me.trackingPosition = { x: null, y: null };

        me.callParent([config]);

        me.syncXCls();
        me.syncYCls();
    },

    doDestroy: function() {
        var Scroller = Ext.scroll.Scroller,
            me = this;

        // Clear any overflow styles
        me.setX(null);
        me.setY(null);

        if (me._spacer) {
            me._spacer.destroy();
        }

        if (me.scrollListener) {
            me.scrollListener.destroy();
        }

        if (me.translatable) {
            me.translatable = null;
        }

        if (Scroller.viewport === me) {
            Scroller.viewport = null;
        }

        me.callParent();
    },

    getClientSize: function() {
        var dom = this.getElement().dom;

        return {
            x: dom.clientWidth,
            y: dom.clientHeight
        };
    },

    getScrollbarSize: function() {
        var me = this,
            width = 0,
            height = 0,
            element = me.getScrollingElement(),
            dom, x, y, hasXScroll, hasYScroll, scrollbarSize;

        if (element && !element.destroyed) {
            x = me.getX();
            y = me.getY();
            dom = element.dom;

            if (x || y) {
                scrollbarSize = Ext.scrollbar.size();
            }

            if (x === 'scroll') {
                hasXScroll = true;
            }
            else if (x) {
                hasXScroll = dom.scrollWidth > dom.clientWidth;
            }

            if (y === 'scroll') {
                hasYScroll = true;
            }
            else if (y) {
                hasYScroll = dom.scrollHeight > dom.clientHeight;
            }

            if (hasXScroll) {
                height = scrollbarSize.height;
            }

            if (hasYScroll) {
                width = scrollbarSize.width;
            }
        }

        return {
            width: width,
            height: height,
            reservedWidth: hasYScroll ? scrollbarSize.reservedWidth : '',
            reservedHeight: hasXScroll ? scrollbarSize.reservedHeight : ''
        };
    },

    /**
     * @method getSize
     * Returns the size of the scrollable content
     * @return {Object} size
     * @return {Number} return.x The width of the scrollable content
     * @return {Number} return.y The height of the scrollable content
     */
    getSize: function() {
        var element = this.getScrollingElement(),
            size, dom;

        if (element && !element.destroyed) {
            dom = element.dom;
            size = {
                x: dom.scrollWidth,
                y: dom.scrollHeight
            };
        }
        else {
            size = {
                x: 0,
                y: 0
            };
        }

        return size;
    },

    getMaxPosition: function() {
        var element = this.getScrollingElement(),
            x = 0,
            y = 0,
            dom;

        if (element && !element.destroyed) {
            dom = element.dom;
            x = dom.scrollWidth - dom.clientWidth;
            y = dom.scrollHeight - dom.clientHeight;
        }

        return {
            x: x,
            y: y
        };
    },

    getMaxUserPosition: function() {
        var me = this,
            element = me.getScrollingElement(),
            x = 0,
            y = 0,
            dom;

        if (element && !element.destroyed) {
            dom = element.dom;

            if (me.getX()) {
                x = dom.scrollWidth - dom.clientWidth;
            }

            if (me.getY()) {
                y = dom.scrollHeight - dom.clientHeight;
            }
        }

        return {
            x: x,
            y: y
        };
    },

    refresh: function() {
        var me = this,
            // scrollingElement = me.getScrollingElement(),
            scrollPosition = me.getElementScroll(),
            x = scrollPosition.left,
            y = scrollPosition.top,
            position = me.position,
            trackingPosition = me.trackingPosition;

        position.x = trackingPosition.x = x;
        position.y = trackingPosition.y = y;

        return this.callParent();
    },

    //-------------------------
    // Public Configs

    // element

    updateElement: function(element, oldElement) {
        var me = this,
            nativeScrollerCls = me.nativeScrollerCls,
            scrollingElement = null;

        me.callParent([element, oldElement]);

        if (oldElement && !oldElement.destroyed) {
            oldElement.removeCls([ nativeScrollerCls, this.getXCls(), this.getYCls() ]);
        }

        if (element) {
            if (element.dom === document.documentElement || element.dom === document.body) {
                scrollingElement = Ext.scroll.Scroller.getScrollingElement();
            }
            else {
                scrollingElement = element;
            }

            element.addCls(nativeScrollerCls);
        }

        me.setScrollingElement(scrollingElement);

        if (!me.isConfiguring) {
            me.syncXCls();
            me.syncYCls();
            me.getTranslatable().setElement(scrollingElement);
        }
    },

    // size

    updateSize: function(size) {
        var me = this,
            element = me.getScrollingElement(),
            x = size.x,
            y = size.y,
            spacer;

        if (element) {
            spacer = me.getSpacer();

            // Typically native scroller simply assumes the scroll size dictated by its content.
            // In some cases, however, it is necessary to be able to manipulate this scroll size
            // (infinite lists for example).  This method positions a 1x1 px spacer element
            // within the scroller element to set a specific scroll size.
            if (!x && !y) {
                spacer.hide();
            }
            else {
                // Subtract spacer size from coordinates (spacer is always 1x1 px in size)
                if (x > 0) {
                    x -= 1;
                }

                if (y > 0) {
                    y -= 1;
                }

                me.setSpacerXY({
                    x: x,
                    y: y
                });

                spacer.show();
            }
        }
    },

    // x

    updateX: function(x) {
        if (!this.isConfiguring) {
            this.syncXCls();
        }
    },

    // y

    updateY: function(y) {
        if (!this.isConfiguring) {
            this.syncYCls();
        }
    },

    privates: {
        nativeScrollerCls: Ext.baseCSSPrefix + 'nativescroller',

        spacerCls: Ext.baseCSSPrefix + 'scroller-spacer',

        overflowXClsMap: {
            auto: Ext.baseCSSPrefix + 'overflow-x-auto',
            true: Ext.baseCSSPrefix + 'overflow-x-auto',
            false: Ext.baseCSSPrefix + 'overflow-x-hidden',
            scroll: Ext.baseCSSPrefix + 'overflow-x-scroll'
        },

        overflowYClsMap: {
            auto: Ext.baseCSSPrefix + 'overflow-y-auto',
            true: Ext.baseCSSPrefix + 'overflow-y-auto',
            false: Ext.baseCSSPrefix + 'overflow-y-hidden',
            scroll: Ext.baseCSSPrefix + 'overflow-y-scroll'
        },

        constrainScrollRange: function(scrollRange) {
            // TODO: this method should be moved to a classic override, or classic should
            // use the virtual scroller

            // Only do the expensive search for the browser limit if they
            // want more than a million pixels.
            if (scrollRange < 1000000) {
                return scrollRange;
            }

            if (!this.maxSpacerTranslate) {
                //
                // Find max scroll height which transform: translateY(npx) will support.
                // IE11 appears to have 21,474,834
                // Chrome and Safari have 16,777,216, but additional margin-top of 16777215px
                //      allows a scrollHeight of 33,554,431
                // Firefox has 17,895,698
                // IE9-10 1,534,000
                //
                // eslint-disable-next-line vars-on-top
                var maxScrollHeight = Math.pow(2, 32),
                    tooHigh = maxScrollHeight,
                    tooLow = 500,
                    scrollTest = Ext.getBody().createChild({
                        style: {
                            position: 'absolute',
                            left: '-10000px',
                            top: '0',
                            width: '500px',
                            height: '500px'
                        },
                        cn: {
                            cls: this.spacerCls
                        }
                    }, null, true),
                    stretcher = Ext.get(scrollTest.firstChild),
                    sStyle = stretcher.dom.style;

                stretcher.translate(0, maxScrollHeight - 1);
                sStyle.lineHeight = Number(!parseInt(sStyle.lineHeight, 10)) + 'px';

                // See what the max translateY is which still stretches the scrollHeight
                while (tooHigh !== tooLow + 1) {
                    stretcher.translate(0, (
                        maxScrollHeight = tooLow + Math.floor((tooHigh - tooLow) / 2))
                    );

                    // Force a synchronous layout to update the scrollHeight.
                    // This flip-flops between 0px and 1px
                    sStyle.lineHeight = Number(!parseInt(sStyle.lineHeight, 10)) + 'px';

                    if (scrollTest.scrollHeight < maxScrollHeight) {
                        tooHigh = maxScrollHeight;
                    }
                    else {
                        tooLow = maxScrollHeight;
                    }
                }

                stretcher.translate(0, Ext.scroll.Scroller.prototype.maxSpacerTranslate = tooLow);

                // Go through the same steps seeing how far we can push it with margin-top
                tooHigh = tooLow * 2;

                while (tooHigh !== tooLow + 1) {
                    stretcher.dom.style.marginTop = (
                        (maxScrollHeight = tooLow + Math.floor((tooHigh - tooLow) / 2))
                    ) + 'px';

                    // Force a synchronous layout to update the scrollHeight.
                    // This flip-flops between 0px and 1px
                    sStyle.lineHeight = Number(!parseInt(sStyle.lineHeight, 10)) + 'px';

                    if (scrollTest.scrollHeight < maxScrollHeight) {
                        tooHigh = maxScrollHeight;
                    }
                    else {
                        tooLow = maxScrollHeight;
                    }
                }

                Ext.fly(scrollTest).destroy();

                Ext.scroll.Scroller.prototype.maxSpacerMargin =
                    tooLow - Ext.scroll.Scroller.prototype.maxSpacerTranslate;
            }

            // The maximum a translateY transform can be pushed to stretch the scrollHeight before
            // it collapses back to offsetHeight
            return Math.min(scrollRange, this.maxSpacerTranslate);
        },

        // highlights an element after it has been scrolled into view
        doHighlight: function(el, highlight) {
            if (highlight !== true) { // handle hex color
                Ext.fly(el).highlight(highlight);
            }
            else {
                Ext.fly(el).highlight();
            }
        },

        doScrollTo: function(x, y, animate) {
            // There is an IE8 override of this method; when making changes here
            // don't forget to update the override as well
            var me = this,
                element = me.getScrollingElement(),
                translatable = me.getTranslatable(),
                maxPosition, xInf, yInf,
                ret, deferred;

            if (element && !element.destroyed) {
                xInf = (x === Infinity);
                yInf = (y === Infinity);

                if (xInf || yInf) {
                    maxPosition = me.getMaxPosition();

                    if (xInf) {
                        x = maxPosition.x;
                    }

                    if (yInf) {
                        y = maxPosition.y;
                    }
                }

                if (x !== null) {
                    x = me.convertX(x);
                }

                if (animate) {
                    deferred = new Ext.Deferred();

                    // Use onFrame here to let the scroll complete and animations to fire.
                    translatable.on('animationend', function() {
                        // Check destroyed vs destroying since we're onFrame here
                        if (me.destroyed) {
                            deferred.reject();
                        }
                        else {
                            deferred.resolve();
                        }
                    }, Ext.global, { single: true, onFrame: true });

                    translatable.translate(x, y, animate);

                    ret = deferred.promise;
                }
                else {
                    translatable.translate(x, y);

                    ret = Ext.Deferred.getCachedResolved();

                    // If we are not animating, invoke onScroll immediately without waiting
                    // for the next async scroll event.  This ensures that the position
                    // object is immediately updated and scroll events are fired.
                    // The successive scroll event will be ignored since deltaX/deltaY
                    // will be 0.
                    me.onScroll();
                }
            }
            else {
                ret = Ext.Deferred.getCachedRejected();
            }

            return ret;
        },

        // rtl hook
        getElementScroll: function() {
            return this.getScrollingElement().getScroll();
        },

        getSpacer: function() {
            var me = this,
                spacer = me._spacer,
                element;

            // In some cases (e.g. infinite lists) we need to be able to tell the scroller
            // to have a specific size, regardless of its contents.  This creates a spacer
            // element which can then be absolutely positioned to affect the element's
            // scroll size. Must be first element, so it is not translated due to being after
            // the element contrainer el.
            if (!spacer) {
                element = me.getScrollingElement();
                spacer = me._spacer = element.createChild({
                    cls: me.spacerCls,
                    role: 'presentation'
                }, element.dom.firstChild);

                spacer.setVisibilityMode(2); // 'display' visibilityMode
                spacer.hide();

                // make sure the element is positioned if it is not already.  This ensures
                // that the spacer's position will affect the element's scroll size
                element.position();
            }

            return spacer;
        },

        onScroll: function(e) {
            var me = this,
                position = me.position,
                scrollPosition = me.getElementScroll(),
                x = scrollPosition.left,
                y = scrollPosition.top,
                deltaX = x - position.x,
                deltaY = y - position.y;

            if (deltaX || deltaY) {
                // if we have an event here, it was caused by DOM changes
                if (e) {
                    if (!me.getX() && !me.getY() && !me.getMonitorScroll()) {
                        e.preventDefault();

                        return;
                    }
                }

                position.x = x;
                position.y = y;

                if (!me.isScrolling) {
                    me.setPrimary(true);

                    me.callPartners('onPartnerScrollStart', x, y);

                    me.fireScrollStart(x, y, deltaX, deltaY);

                    me.callPartners('fireScrollStart', x, y);
                }

                if (me.isPrimary) {
                    me.callPartners('onPartnerScroll', x, y);

                    me.fireScroll(x, y, deltaX, deltaY);

                    me.callPartners('fireScroll', x, y);

                    me.onScrollEnd(x, y);
                }
            }
        },

        doOnScrollEnd: function(x, y) {
            var me = this,
                position = me.position,
                trackingPosition = me.trackingPosition;

            if (!me.destroying && !me.destroyed) {
                me.isScrolling = Ext.isScrolling = false;

                trackingPosition.x = position.x;
                trackingPosition.y = position.y;

                me.callPartners('onPartnerScrollEnd');

                me.fireScrollEnd(x, y);

                me.callPartners('fireScrollEnd', x, y);

                if (!me.isScrolling) { // if scrollend event handler did not initiate another scroll
                    me.setPrimary(null);
                }
            }
        },

        restoreState: function() {
            var me = this,
                trackingPosition = me.trackingPosition;

            me.doScrollTo(trackingPosition.x, trackingPosition.y);
        },

        syncXCls: function() {
            var me = this;

            if (me.getElement()) {
                me.setXCls(me.overflowXClsMap[me.getX()]);
            }
        },

        syncYCls: function() {
            var me = this;

            if (me.getElement()) {
                me.setYCls(me.overflowYClsMap[me.getY()]);
            }
        },

        // rtl hook - rtl version sets right style
        translateSpacer: function(x, y) {
            this.getSpacer().translate(x, y);
        },

        //-------------------------
        // Private Configs

        // scrollingElement

        updateScrollingElement: function(element, oldElement) {
            var me = this,
                doc = document,
                scrollListener = me.scrollListener,
                dom, eventSource;

            if (scrollListener) {
                scrollListener.destroy();
                me.scrollListener = null;
            }

            if (element) {
                dom = element.dom;

                if (dom === doc.scrollingElement || dom === doc.documentElement) {
                    // When the document.scrollingElement is scrolled, its scroll events are
                    // fired via the window object
                    eventSource = Ext.getWin();
                }
                else {
                    eventSource = element;
                }

                me.scrollListener = eventSource.on({
                    scroll: 'onScroll',
                    scope: me,
                    destroyable: true
                });
            }
        },

        // spacerXY

        applySpacerXY: function(pos, oldPos) {
            // Opt out if we have the same value
            if (oldPos && pos.x === oldPos.x && pos.y === oldPos.y) {
                pos = undefined;
            }

            return pos;
        },

        updateSpacerXY: function(pos) {
            var me = this,
                spacer = me.getSpacer(),
                sStyle = spacer.dom.style,
                scrollHeight = pos.y,
                shortfall;

            sStyle.marginTop = '';
            me.translateSpacer(pos.x, me.constrainScrollRange(scrollHeight));

            // Force a synchronous layout to update the scrollHeight.
            // This flip-flops between 0px and 1px
            sStyle.lineHeight = Number(!parseInt(sStyle.lineHeight, 10)) + 'px';

            // See if we can get any more scrollHeight from a margin-top
            if (scrollHeight > 1000000) {
                shortfall = scrollHeight - me.getScrollingElement().dom.scrollHeight;

                if (shortfall > 0) {
                    sStyle.marginTop = Math.min(shortfall, me.maxSpacerMargin || 0) + 'px';
                }
            }
        },

        // translatable

        createTranslatable: function(defaults) {
            if (this.isConfiguring) {
                // must initialize element first since its updater sets scrollingElement
                this.getElement();
            }

            return Ext.apply({
                element: this.getScrollingElement()
            }, defaults);
        },

        // xCls

        updateXCls: function(xCls, oldXCls) {
            var scrollingElement = this.getScrollingElement();

            if (scrollingElement && !scrollingElement.destroyed) {
                scrollingElement.replaceCls(oldXCls, xCls);
            }
        },

        // yCls

        updateYCls: function(yCls, oldYCls) {
            var scrollingElement = this.getScrollingElement();

            if (scrollingElement && !scrollingElement.destroyed) {
                scrollingElement.replaceCls(oldYCls, yCls);
            }
        }

    }
}, function(NativeScroller) {
    var Scroller = Ext.scroll.Scroller;

    /**
     * @private
     * @return {Ext.scroll.Scroller}
     */
    Ext.getViewportScroller = function(autoCreate) {
        // This method creates the global viewport scroller.  This scroller instance must
        // always exist regardless of whether or not there is a Viewport component in use
        // so that global scroll events will still fire.  Menus and some other floating
        // things use these scroll events to hide themselves.
        var scroller = Scroller.viewport;

        if (!scroller && autoCreate !== false) {
            Scroller.viewport = scroller = new NativeScroller();
            NativeScroller.initViewportScroller();
        }

        return scroller;
    };

    /**
     * @private
     * @param {Ext.scroll.Scroller} scroller
     */
    Ext.setViewportScroller = function(scroller) {
        var current = Scroller.viewport;

        if (scroller !== current) {
            Ext.destroy(current);

            if (scroller && !scroller.isScroller) {
                scroller = new NativeScroller(scroller);
            }

            Scroller.viewport = scroller;
        }
    };

    Ext.onReady(function() {
        // The viewport scroller must always exist, but it is deferred so that the
        // viewport component has a chance to call Ext.setViewportScroller() with
        // its own scroller first.
        // We assign the timer to a property to cancel the call while setting up
        // for unit tests. We will call initViewportScroller without waiting for the
        // Viewport to initialize.
        NativeScroller.initViewportScrollerTimer =
            Ext.defer(NativeScroller.initViewportScroller, 100);
    });
});
