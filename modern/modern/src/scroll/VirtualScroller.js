Ext.define('Ext.scroll.VirtualScroller', {
    extend: 'Ext.scroll.Scroller',
    alias: 'scroller.virtual',

    isVirtualScroller: true,

    requires: [
        'Ext.scroll.indicator.*'
    ],

    config: {
        /**
         * @cfg {Boolean} autoRefresh
         * `true` to refresh the scroller automatically when the element size or content
         * size changes
         * @private
         */
        autoRefresh: false,

        /**
         * @cfg {Ext.scroll.indicator.Bar} barIndicator
         * Default configuration object to use for constructing
         * {@link Ext.scroll.indicator.Bar bar} {@link #indicators}.
         */
        barIndicator: {
            lazy: true,
            $value: {
                type: 'bar'
            }
        },

        /**
         * @cfg {Ext.fx.easing.Bounce} bounceEasing
         * @private
         */
        bounceEasing: {
            duration: 400
        },

        /**
         * @cfg {Boolean} directionLock
         * `true` to lock the direction of the scroller when the user starts scrolling.
         * Only applicable when interacting with the Scroller via touch-screen.
         * @accessor
         */
        directionLock: false,

        /**
         * @cfg {Boolean} disabled
         * `true` to disable this scroller.
         */
        disabled: null,

        /**
         * @cfg {Object} clientSize
         * @private
         */
        clientSize: undefined,

        /**
         * @cfg {Object} scrollbarSize
         * @private
         */
        scrollbarSize: {
            width: 0,
            height: 0
        },

        /**
         * @cfg {Boolean/Object/'overlay'/'bar'} [indicators=true]
         * `false` to hide scroll indicators while scrolling, `true` to show scroll indicators,
         * or a config object for {@link Ext.scroll.indicator.Indicator} to configure the
         * scroll indicators.
         *
         * May also be an object with 'x' and 'y' properties for configuring the vertical
         * and horizontal indicators separately. For example, to show only the vertical
         * indicator, but not the horizontal indicator:
         *
         *     {
         *         x: false,
         *         y: true
         *     }
         *
         * The Virtual Scroller will automatically choose an appropriate Indicator type
         * for the current platform:
         *
         * - {@link Ext.scroll.indicator.Bar} on devices that display native scrollbars.
         * - {@link Ext.scroll.indicator.Overlay} on devices with no scrollbars (iOS and
         * android devices, and MacOS when configured to not display scrollbars via "settings")
         *
         * The default selection of indicator type can be overridden by specifying the type
         * of indicator as a string, for example:
         *
         *     indicators: 'overlay'
         *
         * Overlay indicators can be used on any device, but "bar" indicators are only available
         * on devices that have scrollbars natively.
         */
        indicators: {
            x: true,
            y: true
        },

        /**
         * @cfg {Boolean} infinite
         * `true` to enable "infinite" scrolling.  In infinite scrolling mode when
         * {@link #pageSize} is reached the translation position of the innerElement will
         * be reset to 0, 0. The user of this scroller must adjust the positioning
         * of the content by the {@link #offsetY} and {@link #offsetX} amounts.
         */
        infinite: true,

        /**
         * @cfg {Ext.dom.Element} innerElement
         * @private
         * The element that wraps the content of {@link #element} and is translated in
         * response to user interaction.  If not configured, one will be automatically
         * generated.
         */
        innerElement: null,

        /**
         * @cfg {Number} maxAbsoluteVelocity
         * @private
         */
        maxAbsoluteVelocity: 6,

        /**
         * @cfg {Object} maxPosition
         * The max scroll position
         * @private
         */
        maxPosition: {
            x: 0,
            y: 0
        },

        /**
         * @cfg {Object} maxUserPosition
         * The max scroll position that can be achieved via user interaction.
         * @private
         */
        maxUserPosition: {
            x: 0,
            y: 0
        },

        /**
         * @cfg {Object} minPosition
         * The min scroll position.
         * @private
         */
        minPosition: {
            x: 0,
            y: 0
        },

        /**
         * @cfg {Object} minUserPosition
         * The min scroll position that can be achieved via user interaction.
         * @private
         */
        minUserPosition: {
            x: 0,
            y: 0
        },

        /**
         * @cfg {Ext.fx.easing.BoundMomentum} momentumEasing
         *
         * Momentum easing for touch-screen scrolling
         * @private
         */
        momentumEasing: {
            momentum: {
                acceleration: 30,
                friction: 0.5
            },

            bounce: {
                acceleration: 30,
                springTension: 0.3
            },

            minVelocity: 1
        },

        /**
         * @cfg outOfBoundRestrictFactor
         * @private
         */
        outOfBoundRestrictFactor: 0.5,

        /**
         * @cfg {Ext.scroll.indicator.Overlay} overlayIndicator
         * Default configuration object to use for constructing
         * {@link Ext.scroll.indicator.Overlay overlay} {@link #indicators}.
         */
        overlayIndicator: {
            lazy: true,
            $value: {
                type: 'overlay'
            }
        },

        /**
         * @cfg {Object} pageSize
         * @private
         * The size of each "virtual page" when {@link #infinite}
         * A page size of 0 means no infinite scrolling in that dimension.
         */
        pageSize: {
            // These numbers ought to be less than 1 million since that's the point at
            // which CSS transforms lose precision.
            x: 500000,
            y: 500000
        },

        /**
         * @cfg {Object} slotSnapEasing
         * @private
         */
        slotSnapEasing: {
            duration: 150
        },

        /**
         * @cfg {Object} slotSnapOffset
         * @private
         */
        slotSnapOffset: {
            x: 0,
            y: 0
        },

        /**
         * @cfg {Number/Object} slotSnapSize
         * The size of each slot to snap to in 'px', can be either an object with `x` and `y`
         * values, i.e:
         *
         *      {
         *          x: 50,
         *          y: 100
         *      }
         *
         * or a number value to be used for both directions. For example, a value of `50`
         * will be treated as:
         *
         *      {
         *          x: 50,
         *          y: 50
         *      }
         */
        slotSnapSize: {
            x: 0,
            y: 0
        },

        /**
         * @cfg {Number} startMomentumResetTime
         * @private
         */
        startMomentumResetTime: 300
    },

    eventedConfig: {
        /**
         * @cfg {Number} offsetX
         * @private
         * The x offset for {@link #infinite} scrolling
         */
        offsetX: 0,

        /**
         * @cfg {Number} offsetY
         * @private
         * The y offset for {@link #infinite} scrolling
         */
        offsetY: 0
    },

    translatable: 'csstransform',

    dragStartTime: 0,

    dragEndTime: 0,

    isDragging: false,

    isWheeling: false,

    isAnimating: false,

    isMouseEvent: {
        mousedown: 1,
        mousemove: 1,
        mouseup: 1
    },

    listenerMap: {
        touchstart: 'onTouchStart',
        touchmove: 'onTouchMove',
        dragstart: 'onDragStart',
        drag: 'onDrag',
        dragend: 'onDragEnd'
    },

    constructor: function(config) {
        var me = this,
            onEvent = 'onEvent',
            autoRefresh;

        me.elementListeners = {
            touchstart: onEvent,
            touchmove: onEvent,
            dragstart: onEvent,
            drag: onEvent,
            dragend: onEvent,
            wheel: 'onWheel',
            scope: me
        };

        me.minPosition = { x: 0, y: 0 };

        me.startPosition = { x: 0, y: 0 };

        me.velocity = { x: 0, y: 0 };

        me.isAxisEnabledFlags = { x: false, y: false };

        me.flickStartPosition = { x: 0, y: 0 };

        me.flickStartTime = { x: 0, y: 0 };

        me.lastDragPosition = { x: 0, y: 0 };

        me.dragDirection = { x: 0, y: 0 };

        // This object contains the potential height and width of scrollbars for size/clientSize
        // calculations.  To get the actual scrollbarSize after calculations use getScrollbarSize
        me.scrollbarSize = { width: 0, height: 0 };

        me.callParent([config]);

        autoRefresh = me.getAutoRefresh();

        me.refreshScrollbarSize();

        if (autoRefresh) {
            me.refresh(true);
        }
        else {
            me.refreshAxes();
            me.callIndicators('onRefresh');
        }

        me.scheduleRefresh = {
            idle: me.doRefresh,
            scope: me,
            single: true,
            destroyable: true
        };
    },

    doDestroy: function() {
        var me = this,
            element = me.getElement(),
            innerElement = me.getInnerElement(),
            sizeMonitors = me.sizeMonitors;

        if (sizeMonitors) {
            sizeMonitors.element.destroy();
            sizeMonitors.container.destroy();
        }

        if (element && !element.destroyed) {
            element.removeCls(me.cls);
        }

        if (innerElement && !innerElement.destroyed) {
            innerElement.removeCls(me.innerCls);
        }

        if (me._isWrapped) {
            if (!element.destroyed) {
                me.unwrapContent();
            }

            innerElement.destroy();
        }

        me.setElement(null);
        me.setInnerElement(null);
        me.setIndicators(null);

        Ext.destroyMembers(me, 'scrollbarCorner');

        me.callParent();
    },

    refresh: function(immediate) {
        var me = this;

        if (immediate) {
            me.doRefresh();
        }
        // Schedule a refresh at the next transition to idle.
        else if (!me.refreshScheduled) {
            me.refreshScheduled = Ext.on(me.scheduleRefresh);
        }

        return me;
    },

    //--------------------------------------------------------
    // Public Config Properties

    // disabled

    updateDisabled: function(disabled) {
        // attachment of listeners is handled by updateElement during initial config
        if (!this.isConfiguring) {
            if (disabled) {
                this.detachListeners();
            }
            else {
                this.attachListeners();
            }
        }
    },

    // element

    updateElement: function(element, oldElement) {
        var me = this,
            virtualScrollerCls = me.virtualScrollerCls,
            innerElement = me.getInnerElement(),
            autoRefresh;

        me.callParent([element, oldElement]);

        if (oldElement && !oldElement.destroyed) {
            oldElement.removeCls(virtualScrollerCls);
        }

        if (element) {
            element.addCls(virtualScrollerCls);

            if (!innerElement) {
                innerElement = me.wrapContent(element);

                me.setInnerElement(innerElement);
            }

            if (!me.getDisabled()) {
                me.attachListeners();
            }

            if (!me.isConfiguring) {
                // setting element after initial construction of Scroller
                // sync up configs that depend on element
                autoRefresh = me.getAutoRefresh();

                if (autoRefresh) {
                    me.toggleResizeListeners(autoRefresh);
                    me.refresh();
                }
            }
        }
    },

    // indicators

    applyIndicators: function(indicators, oldIndicators) {
        var me = this,
            type, defaultsConfig, xIndicator, yIndicator, oldXIndicator, oldYIndicator;

        if (indicators) {
            if (indicators === true || typeof indicators === 'string') {
                xIndicator = yIndicator = indicators;
            }
            else {
                type = indicators.type;
                xIndicator = indicators.x;
                yIndicator = indicators.y;
            }
        }

        if (oldIndicators) {
            indicators = oldIndicators; // reuse the old object
        }
        else {
            indicators = { x: null, y: null };
        }

        if (xIndicator || yIndicator) {
            defaultsConfig = Ext.scrollbar.width() && type !== 'overlay'
                ? 'barIndicator'
                : 'overlayIndicator';
        }

        oldXIndicator = indicators.x;
        oldYIndicator = indicators.y;

        if (xIndicator) {
            indicators.x = Ext.Factory.scrollindicator.update(oldXIndicator, xIndicator, me,
                                                              'createXIndicator', defaultsConfig);
        }
        else if (oldXIndicator) {
            oldXIndicator.destroy();
            indicators.x = null;
        }

        if (yIndicator) {
            indicators.y = Ext.Factory.scrollindicator.update(oldYIndicator, yIndicator, me,
                                                              'createYIndicator', defaultsConfig);
        }
        else if (oldYIndicator) {
            oldYIndicator.destroy();
            indicators.y = null;
        }

        return indicators;
    },

    updateIndicators: function(indicators) {
        if (!this.isConfiguring) {
            this.refreshScrollbarSize();
        }
    },

    createXIndicator: function(defaults) {
        return Ext.apply({
            axis: 'x',
            scroller: this
        }, defaults);
    },

    createYIndicator: function(defaults) {
        return Ext.apply({
            axis: 'y',
            scroller: this
        }, defaults);
    },

    // slotSnapSize

    applySlotSnapSize: function(snapSize) {
        if (typeof snapSize === 'number') {
            snapSize = {
                x: snapSize,
                y: snapSize
            };
        }

        return snapSize;
    },

    // x

    updateX: function() {
        if (!this.isConfiguring) {
            this.refreshAxes();
            this.refreshScrollbarSize();
        }
    },

    // y

    updateY: function() {
        if (!this.isConfiguring) {
            this.refreshAxes();
            this.refreshScrollbarSize();
        }
    },

    privates: {
        virtualScrollerCls: Ext.baseCSSPrefix + 'virtualscroller',

        innerCls: Ext.baseCSSPrefix + 'scroller-inner',

        scrollbarCornerCls: Ext.baseCSSPrefix + 'scrollbar-corner',

        attachListeners: function() {
            this.getElement().on(this.elementListeners);
        },

        callIndicators: function(methodName, force) {
            var me = this,
                indicators = me.getIndicators(),
                xIndicator, yIndicator;

            if (indicators) {
                if (force || me.isAxisEnabled('x')) {
                    xIndicator = indicators.x;

                    if (xIndicator && xIndicator[methodName]) {
                        xIndicator[methodName]();
                    }
                }

                if (force || me.isAxisEnabled('y')) {
                    yIndicator = indicators.y;

                    if (yIndicator && yIndicator[methodName]) {
                        yIndicator[methodName]();
                    }
                }
            }
        },

        constrainX: function(x) {
            return Math.min(this.getMaxPosition().x, Math.max(x, 0));
        },

        constrainY: function(y) {
            return Math.min(this.getMaxPosition().y, Math.max(y, 0));
        },

        // overridden in RTL mode to swap min/max momentum values
        convertEasingConfig: function(config) {
            return config;
        },

        detachListeners: function() {
            this.getElement().un(this.elementListeners);
        },

        /**
         * @private
         */
        doRefresh: function(size) {
            var me = this,
                configuredSize = me.configuredSize;

            if (me.refreshScheduled) {
                me.refreshScheduled = me.refreshScheduled.destroy();
            }

            if (me.getElement()) {
                me.stopAnimation();

                me.getTranslatable().refresh();

                me.setSize({
                    x: configuredSize.x ? undefined : null,
                    y: configuredSize.y ? undefined : null
                });

                me.fireEvent('refresh', me);
            }
        },

        doScrollTo: function(x, y, animate) {
            var me = this,
                isDragging = me.isDragging,
                isPrimary = me.isPrimary,
                ret, deferred, position, positionChanged, translatable, translationX, translationY;

            if (me.destroyed || !me.getElement()) {
                return me;
            }

            translatable = me.getTranslatable();
            position = me.position;

            if (!isDragging || me.isAxisEnabled('x')) {
                if (isNaN(x) || typeof x !== 'number') {
                    x = position.x;
                }
                else {
                    if (isPrimary !== false && !isDragging) {
                        x = me.constrainX(x);
                    }

                    if (position.x !== x) {
                        positionChanged = true;
                    }
                }
            }

            if (!isDragging || me.isAxisEnabled('y')) {
                if (isNaN(y) || typeof y !== 'number') {
                    y = position.y;
                }
                else {
                    if (isPrimary !== false && !isDragging) {
                        y = me.constrainY(y);
                    }

                    if (position.y !== y) {
                        positionChanged = true;
                    }
                }
            }

            if (positionChanged) {
                if (!me.isScrolling) {
                    me.onScrollStart();
                }

                translationX = me.convertX(-x);
                translationY = -y;

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

                    // onAnimationEnd calls onScrollEnd
                    translatable.translateAnimated(translationX, translationY, animate);

                    ret = deferred.promise;
                }
                else {
                    translatable.translate(translationX, translationY);

                    me.onScroll(x, y);

                    if (me.isWheeling || me.isScrollbarScrolling) {
                        me.onScrollEnd();
                    }
                    else if (!isDragging) {
                        me.doOnScrollEnd();
                    }
                }
            }
            else if (animate && animate.callback) {
                animate.callback();
            }

            return ret || Ext.Deferred.getCachedResolved();
        },

        /**
         * @private
         */
        getAnimationEasing: function(axis, e) {
            if (!this.isAxisEnabled(axis)) {
                return null;
            }

            // eslint-disable-next-line vars-on-top
            var me = this,
                currentPosition = me.position[axis],
                minPosition = me.getMinUserPosition()[axis],
                maxPosition = me.getMaxUserPosition()[axis],
                maxAbsVelocity = me.getMaxAbsoluteVelocity(),
                boundValue = null,
                dragEndTime = me.dragEndTime,
                velocity = e.flick.velocity[axis],
                isX = axis === 'x',
                easingConfig, easing;

            if (currentPosition < minPosition) {
                boundValue = minPosition;
            }
            else if (currentPosition > maxPosition) {
                boundValue = maxPosition;
            }

            if (isX) {
                currentPosition = me.convertX(currentPosition);
                boundValue = me.convertX(boundValue);
            }

            // Out of bound, to be pulled back
            if (boundValue !== null) {
                easing = me.getBounceEasing()[axis];
                easing.setConfig({
                    startTime: dragEndTime,
                    startValue: -currentPosition,
                    endValue: -boundValue
                });

                return easing;
            }

            if (velocity === 0) {
                return null;
            }

            if (velocity < -maxAbsVelocity) {
                velocity = -maxAbsVelocity;
            }
            else if (velocity > maxAbsVelocity) {
                velocity = maxAbsVelocity;
            }

            easing = me.getMomentumEasing()[axis];
            easingConfig = {
                startTime: dragEndTime,
                startValue: -currentPosition,
                startVelocity: velocity * 1.5,
                minMomentumValue: -maxPosition,
                maxMomentumValue: 0
            };

            if (isX) {
                me.convertEasingConfig(easingConfig);
            }

            easing.setConfig(easingConfig);

            return easing;
        },

        /**
         * @private
         * @return {Number/null}
         */
        getSnapPosition: function(axis) {
            var me = this,
                snapSize = me.getSlotSnapSize()[axis],
                snapPosition = null,
                position, snapOffset, maxPosition, mod;

            if (snapSize !== 0 && me.isAxisEnabled(axis)) {
                position = me.position[axis];
                snapOffset = me.getSlotSnapOffset()[axis];
                maxPosition = me.getMaxUserPosition()[axis];

                mod = Math.floor((position - snapOffset) % snapSize);

                if (mod !== 0) {
                    if (position !== maxPosition) {
                        if (Math.abs(mod) > snapSize / 2) {
                            snapPosition = Math.min(maxPosition, position + (
                                (mod > 0) ? snapSize - mod : mod - snapSize)
                            );
                        }
                        else {
                            snapPosition = position - mod;
                        }
                    }
                    else {
                        snapPosition = position - mod;
                    }
                }
            }

            return snapPosition;
        },

        /**
         * Returns `true` if a specified axis is enabled.
         * @private
         * @param {String} axis The axis to check (`x` or `y`).
         * @return {Boolean} `true` if the axis is enabled.
         */
        isAxisEnabled: function(axis) {
            this.getX();
            this.getY();

            return this.isAxisEnabledFlags[axis];
        },

        onAnimationEnd: function() {
            this.isAnimating = false;
            this.snapToBoundary();
            this.onScrollEnd();
        },

        onAnimationFrame: function(translatable, x, y) {
            this.onScroll(this.convertX(-x), -y);
        },

        onAnimationStart: function() {
            this.isAnimating = true;
        },

        onAxisDrag: function(axis, delta) {
            // Nothing to do if no delta, or it's on a disabled axis
            if (delta && this.isAxisEnabled(axis)) {
                // eslint-disable-next-line vars-on-top
                var me = this,
                    flickStartPosition = me.flickStartPosition,
                    flickStartTime = me.flickStartTime,
                    lastDragPosition = me.lastDragPosition,
                    dragDirection = me.dragDirection,
                    old = me.position[axis],
                    min = me.getMinUserPosition()[axis],
                    max = me.getMaxUserPosition()[axis],
                    start = me.startPosition[axis],
                    last = lastDragPosition[axis],
                    current = start - delta,
                    lastDirection = dragDirection[axis],
                    restrictFactor = me.getOutOfBoundRestrictFactor(),
                    startMomentumResetTime = me.getStartMomentumResetTime(),
                    now = Ext.Date.now(),
                    distance;

                if (current < min) {
                    current *= restrictFactor;
                }
                else if (current > max) {
                    distance = current - max;
                    current = max + distance * restrictFactor;
                }

                if (current > last) {
                    dragDirection[axis] = 1;
                }
                else if (current < last) {
                    dragDirection[axis] = -1;
                }

                if ((lastDirection !== 0 && (dragDirection[axis] !== lastDirection)) ||
                    (now - flickStartTime[axis]) > startMomentumResetTime) {
                    flickStartPosition[axis] = old;
                    flickStartTime[axis] = now;
                }

                lastDragPosition[axis] = current;

                return true;
            }
        },

        onDrag: function(e) {
            var me = this,
                lastDragPosition = me.lastDragPosition;

            if (!me.isDragging) {
                return;
            }

            // If there's any moving to do, then move the content.
            // Boolean or operator avoids shortcutting the second function call if
            // first returns true.
            if (me.onAxisDrag('x', me.convertX(e.deltaX)) | me.onAxisDrag('y', e.deltaY)) {
                me.doScrollTo(lastDragPosition.x, lastDragPosition.y);
            }
        },

        onDragEnd: function(e) {
            var me = this,
                easingX, easingY;

            if (me.isDragging) {
                me.dragEndTime = Ext.Date.now();

                me.onDrag(e);

                me.isDragging = false;

                easingX = me.getAnimationEasing('x', e);
                easingY = me.getAnimationEasing('y', e);

                if (easingX || easingY) {
                    me.getTranslatable().animate(easingX, easingY);
                }
                else {
                    me.onScrollEnd();
                }
            }
        },

        onDragStart: function(e) {
            var me = this,
                absDeltaX = e.absDeltaX,
                absDeltaY = e.absDeltaY,
                startPosition = me.startPosition,
                flickStartPosition = me.flickStartPosition,
                flickStartTime = me.flickStartTime,
                lastDragPosition = me.lastDragPosition,
                currentPosition = me.position,
                dragDirection = me.dragDirection,
                x = currentPosition.x,
                y = currentPosition.y,
                now = Ext.Date.now(),
                horizontal = me.getX(),
                vertical = me.getY();

            Ext.undefer(me.scrollEndTimer);

            if (me.getDirectionLock() && !(horizontal && vertical)) {
                if ((horizontal && absDeltaX > absDeltaY) || (vertical && absDeltaY > absDeltaX)) {
                    e.stopPropagation();
                }
                else {
                    return;
                }
            }

            lastDragPosition.x = x;
            lastDragPosition.y = y;

            flickStartPosition.x = x;
            flickStartPosition.y = y;

            startPosition.x = x;
            startPosition.y = y;

            flickStartTime.x = now;
            flickStartTime.y = now;

            dragDirection.x = 0;
            dragDirection.y = 0;

            me.dragStartTime = now;

            me.isDragging = true;

            // Only signal a scroll start if we are not already scrolling.
            // If the drag is just the user giving another impulse, it is NOT
            // the start of a drag.
            if (!me.isScrolling) {
                me.onScrollStart();
            }
        },

        onElementResize: function() {
            this.refresh(true);
        },

        onEvent: function(e) {
            // use browserEvent to get the "real" type of DOM event that was fired, not a
            // potentially translated (or recognized) type
            var me = this,
                self = me.self;

            if ((!self.isTouching || me.isTouching) && // prevents nested scrolling
                    !self.isWheeling && // ignore touch input while scrolling with mouse
                    e.pointerType !== 'mouse' && (me.getY() || me.getX())) {
                return me[me.listenerMap[e.type]](e);
            }
        },

        onInnerElementResize: function() {
            this.refresh(true);
        },

        onPartnerScroll: function(x, y) {
            this.callParent([x, y]);

            this.callIndicators('onScroll');
        },

        onPartnerScrollStart: function(x, y, deltaX, deltaY) {
            this.callParent([x, y, deltaX, deltaY]);

            this.callIndicators('onScrollStart');
        },

        onPartnerScrollEnd: function() {
            this.callParent();

            this.callIndicators('onScrollEnd', true);
        },

        onScroll: function(logicalX, logicalY) {
            var me = this,
                position = me.position,
                deltaX = logicalX - position.x,
                deltaY = logicalY - position.y,
                pageSize, pageSizeX, pageSizeY, offsetX, offsetY, physicalX, physicalY;

            if (deltaX || deltaY) {
                position.x = logicalX;
                position.y = logicalY;

                if (me.getInfinite()) {
                    pageSize = me.getPageSize();
                    pageSizeX = pageSize.x;

                    if (pageSizeX) {
                        offsetX = me.getOffsetX();
                        physicalX = logicalX - offsetX;

                        if (physicalX > pageSizeX) {
                            me.setOffsetX(Math.floor(logicalX / pageSizeX) * pageSizeX);
                        }
                        else if (physicalX < -pageSizeX) {
                            me.setOffsetX(Math.ceil(logicalX / pageSizeX) * pageSizeX);
                        }
                    }

                    pageSizeY = pageSize.y;

                    if (pageSizeY) {
                        offsetY = me.getOffsetY();
                        physicalY = logicalY - offsetY;

                        if (physicalY > pageSizeY) {
                            me.setOffsetY(Math.floor(logicalY / pageSizeY) * pageSizeY);
                        }
                        else if (physicalY < -pageSizeY) {
                            me.setOffsetY(Math.ceil(logicalY / pageSizeY) * pageSizeY);
                        }
                    }
                }

                if (me.isPrimary) {
                    me.callIndicators('onScroll');

                    me.callPartners('onPartnerScroll', logicalX, logicalY);

                    me.fireScroll(logicalX, logicalY, deltaX, deltaY);

                    me.callPartners('fireScroll', logicalX, logicalY);
                }
            }
        },

        doOnScrollEnd: function() {
            var me = this,
                position = me.position,
                x = position.x,
                y = position.y;

            if (!me.destroying && !me.destroyed && me.isScrolling && me.isPrimary &&
                    !me.isTouching && !me.snapToSlot()) {

                me.isScrolling = Ext.isScrolling = me.isWheeling = me.self.isWheeling =
                    me.isScrollbarScrolling = false;

                me.callIndicators('onScrollEnd');

                me.callPartners('onPartnerScrollEnd');

                me.fireScrollEnd(x, y);

                me.callPartners('fireScrollEnd', x, y);

                if (!me.isScrolling) { // if scrollend event handler did not initiate another scroll
                    me.setPrimary(null);
                }
            }
        },

        onScrollStart: function() {
            var me = this,
                position = me.position,
                x = position.x,
                y = position.y;

            if (!me.isScrolling) {
                me.setPrimary(true);

                me.callIndicators('onScrollStart');

                me.callPartners('onPartnerScrollStart', x, y);

                me.fireScrollStart(x, y, 0, 0);

                me.callPartners('fireScrollStart', x, y);
            }
        },

        onTouchEnd: function() {
            var me = this;

            me.isTouching = me.self.isTouching = false;

            if (!me.isAnimating) {
                me.onScrollEnd();
            }
        },

        onTouchMove: function(e) {
            // Prevents the page from scrolling during scroll of a VirtualScroller.
            e.preventDefault();
        },

        onTouchStart: function(e) {
            var me = this;

            Ext.getDoc().on({
                touchend: 'onTouchEnd',
                scope: me,
                single: true
            });

            me.isTouching = me.self.isTouching = true;

            me.stopAnimation();
        },

        onWheel: function(e) {
            var me = this,
                self = me.self,
                deltaX = e.deltaX,
                deltaY = e.deltaY,
                position = me.position,
                oldX = position.x,
                oldY = position.y,
                x = me.constrainX(position.x + deltaX),
                y = me.constrainY(position.y + deltaY);

            if (x !== oldX || y !== oldY) {
                me.isWheeling = self.isWheeling = true;

                me.doScrollTo(x, y);

                e.preventDefault();
            }
            else if (me.isScrolling) {
                me.onScrollEnd();
            }
        },

        refreshAxes: function() {
            var me = this,
                flags = me.isAxisEnabledFlags,
                size = me.getSize(),
                clientSize = me.getClientSize(),
                maxX, maxY, x, y;

            if (!size || !clientSize) {
                return;
            }

            maxX = Math.max(0, size.x - clientSize.x);
            maxY = Math.max(0, size.y - clientSize.y);
            x = me.getX();
            y = me.getY();

            me.setMaxPosition({
                x: maxX,
                y: maxY
            });

            if (x === true || x === 'auto') {
                // auto scroll - axis is only enabled if the content is overflowing in the
                // same direction
                flags.x = !!maxX;
            }
            else if (x === false) {
                flags.x = false;
            }
            else if (x === 'scroll') {
                flags.x = true;
            }

            if (y === true || y === 'auto') {
                // auto scroll - axis is only enabled if the content is overflowing in the
                // same direction
                flags.y = !!maxY;
            }
            else if (y === false) {
                flags.y = false;
            }
            else if (y === 'scroll') {
                flags.y = true;
            }

            me.setMaxUserPosition({
                x: flags.x ? maxX : 0,
                y: flags.y ? maxY : 0
            });

            if (!me.isConfiguring) {
                me.callIndicators('onRefresh', true);
            }
        },

        refreshScrollbarSize: function() {
            var me = this,
                indicators = me.getIndicators(),
                barSize = me.scrollbarSize,
                scrollbarSize = Ext.scrollbar.size(),
                xIndicator, yIndicator;

            if (indicators) {
                xIndicator = indicators.x;
                yIndicator = indicators.y;

                if (xIndicator && xIndicator.isScrollbar && me.getX()) {
                    barSize.height = scrollbarSize.height;
                }

                if (yIndicator && yIndicator.isScrollbar && me.getY()) {
                    barSize.width = scrollbarSize.width;
                }
            }
        },

        refreshSize: function(size, oldSize) {
            var me = this,
                el = me.getElement(),
                extraPadding = Ext.isIE ? 1 : 0,
                scrollbarSize, scrollbarWidth, scrollbarHeight, globalScrollbarSize,
                hasVerticalScrollbar, hasHorizontalScrollbar, clientSizeX, clientSizeY,
                sizeX, sizeY, dom, innerDom, flags, measuredX, measuredY, indicators,
                xIndicator, yIndicator, recalcX, recalcY, scrollbarCorner;

            if (el && !el.destroyed) {
                dom = el.dom;
                innerDom = me.getInnerElement().dom;
                sizeX = size.x;
                sizeY = size.y;
                scrollbarSize = me.scrollbarSize;
                scrollbarWidth = scrollbarSize.width;
                scrollbarHeight = scrollbarSize.height;
                globalScrollbarSize = Ext.scrollbar.size();
                hasVerticalScrollbar = false;
                hasHorizontalScrollbar = false;
                indicators = me.getIndicators();
                xIndicator = indicators.x;
                yIndicator = indicators.y;
                scrollbarCorner = me.scrollbarCorner;

                if (sizeX === undefined) {
                    sizeX = oldSize && oldSize.x;
                }

                if (sizeY === undefined) {
                    sizeY = oldSize && oldSize.y;
                }

                // using scrollWidth/scrollHeight instead of offsetWidth/offsetHeight ensures
                // that the size includes any contained absolutely positioned items
                if (sizeX == null) { // could be undefined if oldSize has not yet been set
                    sizeX = innerDom.scrollWidth;
                    measuredX = true;
                }

                if (sizeY == null) { // could be undefined if oldSize has not yet been set
                    sizeY = innerDom.scrollHeight;
                    measuredY = true;
                }

                clientSizeX = dom.clientWidth;
                clientSizeY = dom.clientHeight;

                flags = me.getScrollbarFlags(sizeX, sizeY, clientSizeX, clientSizeY);
                hasVerticalScrollbar = !!(flags & 1);
                hasHorizontalScrollbar = !!(flags & 2);

                if (flags && (flags !== me.scrollbarFlags)) {
                    if (xIndicator) {
                        xIndicator.setEnabled(me.getX() === 'scroll');
                        // make indicator invisible to avoid potential flicker if we have to
                        // perform multiple measurements
                        xIndicator.setStyle('visibility', 'hidden');
                    }

                    if (yIndicator) {
                        yIndicator.setEnabled(me.getY() === 'scroll');
                        // make indicator invisible to avoid potential flicker if we have to
                        // perform multiple measurements
                        yIndicator.setStyle('visibility', 'hidden');
                    }

                    if (measuredX && hasVerticalScrollbar) {
                        yIndicator.setEnabled(true);
                        recalcX = true;
                    }

                    if (measuredY && hasHorizontalScrollbar) {
                        xIndicator.setEnabled(true);
                        recalcY = true;
                    }

                    if (recalcX) {
                        sizeX = innerDom.scrollWidth;
                    }

                    if (recalcY) {
                        sizeY = innerDom.scrollHeight;
                    }

                    if (recalcX || recalcY) {
                        flags = me.getScrollbarFlags(sizeX, sizeY, clientSizeX, clientSizeY);
                        hasVerticalScrollbar = !!(flags & 1);
                        hasHorizontalScrollbar = !!(flags & 2);
                    }

                    if (hasHorizontalScrollbar && hasVerticalScrollbar) {
                        if (!scrollbarCorner) {
                            me.scrollbarCorner = scrollbarCorner = me.getElement().createChild({
                                cls: me.scrollbarCornerCls
                            });

                            scrollbarCorner.setVisibilityMode(2);

                            // windows displays scroll buttons by default and in some browsers 
                            // this can cause scrollbarCorner to grow in size, so we manually 
                            // set height/width of this container.
                            if (Ext.isWindows) {
                                scrollbarCorner.setStyle({
                                    width: (scrollbarWidth + extraPadding) + 'px',
                                    height: (scrollbarHeight + extraPadding) + 'px'
                                });
                            }
                        }

                        scrollbarCorner.show();
                    }
                    else if (scrollbarCorner) {
                        scrollbarCorner.hide();
                    }

                    if (xIndicator) {
                        xIndicator.setStyle('visibility', '');
                    }

                    if (yIndicator) {
                        yIndicator.setStyle('visibility', '');
                    }

                    me.scrollbarFlags = flags;

                    me.setScrollbarSize({
                        width: hasVerticalScrollbar ? scrollbarWidth : 0,
                        height: hasHorizontalScrollbar ? scrollbarHeight : 0,
                        reservedWidth: hasVerticalScrollbar
                            ? globalScrollbarSize.reservedWidth
                            : '',
                        reservedHeight: hasHorizontalScrollbar
                            ? globalScrollbarSize.reservedHeight
                            : ''
                    });
                }

                clientSizeX = hasVerticalScrollbar ? (clientSizeX - scrollbarWidth) : clientSizeX;
                clientSizeY = hasHorizontalScrollbar
                    ? (clientSizeY - scrollbarHeight)
                    : clientSizeY;

                me.setClientSize({
                    x: clientSizeX,
                    y: clientSizeY
                });

                return {
                    x: Math.max(sizeX, clientSizeX),
                    y: Math.max(sizeY, clientSizeY)
                };
            }

            return null;
        },

        /**
         * Returns the following bit flags
         *
         * vertical scrollbar       1   '00000001'
         * horizontal scrollbar     2   '00000010'
         * both scrollbars          3   '00000011'
         *
         * @private
         * @param {Number} sizeX
         * @param {Number} sizeY
         * @param {Number} clientSizeX
         * @param {Number} clientSizeY
         */
        getScrollbarFlags: function(sizeX, sizeY, clientSizeX, clientSizeY) {
            var me = this,
                flags = 0,
                scrollbarSize = me.scrollbarSize,
                scrollbarWidth = scrollbarSize.width,
                scrollbarHeight = scrollbarSize.height;

            if (scrollbarWidth && (me.getY() === 'scroll' || sizeY > clientSizeY)) {
                flags |= 1;
            }

            if (scrollbarHeight && (me.getX() === 'scroll' || sizeX > clientSizeX)) {
                flags |= 2;
            }

            if ((flags & 1) && (scrollbarHeight && (sizeX > clientSizeX - scrollbarWidth))) {
                flags |= 2;
            }

            if ((flags & 2) && (scrollbarWidth && (sizeY > clientSizeY - scrollbarHeight))) {
                flags |= 1;
            }

            return flags;
        },

        snapToBoundary: function() {
            var me = this,
                position = me.getPosition();

            // If we haven't scrolled anywhere, we're done.
            if (me.isConfiguring || !(position.x || position.y)) {
                return;
            }

            // eslint-disable-next-line vars-on-top
            var minPosition = me.getMinUserPosition(),
                maxPosition = me.getMaxUserPosition(),
                minX = minPosition.x,
                minY = minPosition.y,
                maxX = maxPosition.x,
                maxY = maxPosition.y,
                x = Math.round(position.x),
                y = Math.round(position.y);

            if (x < minX) {
                x = minX;
            }
            else if (x > maxX) {
                x = maxX;
            }

            if (y < minY) {
                y = minY;
            }
            else if (y > maxY) {
                y = maxY;
            }

            me.doScrollTo(x, y);
        },

        /**
         * @private
         * @return {Boolean}
         */
        snapToSlot: function() {
            var me = this,
                snapX = me.getSnapPosition('x'),
                snapY = me.getSnapPosition('y'),
                easing = me.getSlotSnapEasing();

            if (snapX !== null || snapY !== null) {
                me.doScrollTo(snapX, snapY, {
                    easingX: easing.x,
                    easingY: easing.y
                });

                return true;
            }

            return false;
        },

        /**
         * @private
         * Stops the animation of the scroller at any time.
         */
        stopAnimation: function() {
            this.getTranslatable().stopAnimation();
        },

        syncOffsets: function(translatable) {
            translatable.setOffsetX(-this.getOffsetX());
            translatable.setOffsetY(-this.getOffsetY());
        },

        toggleResizeListeners: function(autoRefresh) {
            var me = this,
                element = me.getElement(),
                method, innerElement;

            if (element) {
                innerElement = me.getInnerElement();
                method = autoRefresh ? 'on' : 'un';

                element[method]('resize', 'onElementResize', me);
                innerElement[method]('resize', 'onInnerElementResize', me);
            }
        },

        /**
         * Removes the wrapper created by {@link #wrapContent}.
         * @private
         */
        unwrapContent: function() {
            var innerDom = this.getInnerElement().dom,
                dom = this.getElement().dom,
                child;

            while ((child = innerDom.firstChild)) {
                dom.insertBefore(child, innerDom);
            }
        },

        /**
         * Wraps the element's content in a innerElement
         * @param {Ext.dom.Element} element
         * @return {Ext.dom.Element} the innerElement
         * @private
         */
        wrapContent: function(element) {
            var wrap = document.createElement('div'),
                dom = element.dom,
                child;

            while ((child = dom.lastChild)) { // jshint ignore:line
                wrap.insertBefore(child, wrap.firstChild);
            }

            dom.appendChild(wrap);

            this.setInnerElement(wrap);

            // Set a flag that indiacates the element's content was not already pre-wrapped
            // when the scroller was instanced.  This means we had to wrap the content
            // and so must unwrap when we destroy the scroller.
            this._isWrapped = true;

            return this.getInnerElement();
        },

        //--------------------------------------------------------
        // Private Config Properties

        // autoRefresh

        updateAutoRefresh: function(autoRefresh) {
            this.toggleResizeListeners(autoRefresh);
        },

        // bounceEasing

        applyBounceEasing: function(easing) {
            var defaultClass = Ext.fx.easing.EaseOut;

            return {
                x: Ext.factory(easing, defaultClass),
                y: Ext.factory(easing, defaultClass)
            };
        },

        updateBounceEasing: function(easing) {
            this.getTranslatable().setEasingX(easing.x).setEasingY(easing.y);
        },

        // clientSize

        updateClientSize: function() {
            if (!this.isConfiguring) {
                // to avoid multiple calls to refreshAxes() during initialization we will
                // call it once after initConfig has finished.
                this.refreshAxes();
            }
        },

        // innerElement

        applyInnerElement: function(innerElement) {
            if (innerElement) {
                if (!innerElement.isElement) {
                    innerElement = Ext.get(innerElement);
                }
            }

            //<debug>
            if (this.isConfiguring && !innerElement) {
                Ext.raise("Cannot create Ext.scroll.VirtualScroller with null innerElement");
            }
            //</debug>

            return innerElement;
        },

        updateInnerElement: function(innerElement) {
            if (innerElement) {
                innerElement.addCls(this.innerCls);
            }

            this.getTranslatable().setElement(innerElement);
        },

        // maxPosition

        applyMaxPosition: function(maxPosition, oldMaxPosition) {
            // If a no-op (generated setter tests object identity), return undefined to abort set.
            if (oldMaxPosition && maxPosition.x === oldMaxPosition.x &&
                maxPosition.y === oldMaxPosition.y) {
                return;
            }

            // eslint-disable-next-line vars-on-top
            var translatable = this.getTranslatable(),
                yEasing;

            // If an animation is in flight...
            if (translatable.isAnimating) {

                // Find its Y dimension easing object
                yEasing = translatable.activeEasingY;

                // If it's animating in the -ve direction (scrolling up), and we are
                // shortening the scroll range, ensure the easing's min point complies
                // with the new end position.
                if (yEasing && yEasing.getStartVelocity &&
                    yEasing.getStartVelocity() < 0 && maxPosition.y < oldMaxPosition.y) {
                    yEasing.setMinMomentumValue(-maxPosition.y);
                }
            }

            return maxPosition;
        },

        // maxUserPosition

        applyMaxUserPosition: function(maxUserPosition, oldMaxUserPosition) {
            // If a no-op (generated setter tests object identity), return undefined to abort set.
            if (!oldMaxUserPosition || maxUserPosition.x !== oldMaxUserPosition.x ||
                maxUserPosition.y !== oldMaxUserPosition.y) {
                return maxUserPosition;
            }
        },

        updateMaxUserPosition: function() {
            this.snapToBoundary();
        },

        // minUserPosition

        updateMinUserPosition: function() {
            this.snapToBoundary();
        },

        // momentumEasing

        applyMomentumEasing: function(easing) {
            var defaultClass = Ext.fx.easing.BoundMomentum;

            return {
                x: Ext.factory(easing, defaultClass),
                y: Ext.factory(easing, defaultClass)
            };
        },

        // offsetX

        updateOffsetX: function(offsetX) {
            if (!this.isConfiguring) {
                this.getTranslatable().setOffsetX(offsetX);
            }
        },

        // offsetY

        updateOffsetY: function(offsetY) {
            if (!this.isConfiguring) {
                this.getTranslatable().setOffsetY(offsetY);
            }
        },

        // size

        applySize: function(size, oldSize) {
            size = this.callParent([size, oldSize]);

            return this.refreshSize(size, oldSize);
        },

        updateSize: function(size, oldSize) {
            if (!this.isConfiguring) {
                // to avoid multiple calls to refreshAxes() during initialization we will
                // call it once after initConfig has finished.
                this.refreshAxes();
            }
        },

        // slotSnapEasing

        applySlotSnapEasing: function(easing) {
            var defaultClass = Ext.fx.easing.EaseOut;

            return {
                x: Ext.factory(easing, defaultClass),
                y: Ext.factory(easing, defaultClass)
            };
        },

        // slotSnapOffset

        applySlotSnapOffset: function(snapOffset) {
            if (typeof snapOffset === 'number') {
                snapOffset = {
                    x: snapOffset,
                    y: snapOffset
                };
            }

            return snapOffset;
        },

        // translatable

        updateTranslatable: function(translatable) {
            if (translatable) {
                translatable.on({
                    animationframe: 'onAnimationFrame',
                    animationstart: 'onAnimationStart',
                    animationend: 'onAnimationEnd',
                    scope: this
                });
            }
        },

        createTranslatable: function(defaults) {
            return Ext.apply({
                element: this.getInnerElement()
            }, defaults);
        }
    }
});
