/**
 * This class allows a {@link Ext.Panel Panel} to be collapsible via user interaction.
 *
 * @since 6.5.0
 */
Ext.define('Ext.panel.Collapser', {
    requires: [
        'Ext.panel.Collapsible',
        'Ext.fx.Animation',
        'Ext.Deferred'
    ],

    mixins: [
        'Ext.mixin.ConfigProxy'
    ],

    config: {
        /**
         * @cfg {Boolean/Object} [animation]
         * Animation effect to apply when the Panel is being expanded or collapsed.
         * Set to `null` for no animations. For more fine grained control, see
         * {@link #cfg-expandAnimation} and {@link #cfg-collapseAnimation}.
         */
        animation: {
            duration: 250
        },

        /**
         * @cfg {Boolean/Object} [collapseAnimation]
         * Animation effect to apply when the panel is being collapsed. If not specified,
         * this falls back to {@link #cfg-animation}.
         */
        collapseAnimation: null,

        /**
         * @cfg {Boolean} collapsed
         * True to make the panel collapsed. False to expand the panel.
         */
        collapsed: false,

        /**
         * @cfg {String} collapseToolText Text to be announced by screen readers when
         * **collapse** {@link Ext.panel.Tool tool} is focused.  Will also be set as the
         * collapse tool's {@link Ext.panel.Tool#cfg-tooltip tooltip} text.

         * @locale
         */
        collapseToolText: 'Collapse panel',

        /**
         * @cfg {'top'/'right'/'bottom'/'left'} [direction='top']
         * The direction to collapse the Panel when the toggle button is clicked.
         * Defaults to {@link Ext.Panel#headerPosition}.
         */
        direction: 'top',

        /**
         * @cfg {Object} [drawer]
         * The configuration for the drawer component that can display the collapsed
         * component contents without expanding.
         * when {@link Ext.Panel#titleCollapse} `false`
         */
        drawer: {
            xtype: 'panel',
            border: true,
            top: 0,
            left: 0,
            cls: Ext.baseCSSPrefix + 'drawer'
        },

        /**
         * @cfg {Number} drawerHideDelay
         */
        drawerHideDelay: 500,

        /**
         * @cfg {Boolean} [dynamic=null]
         * `true` to "live resize" the panels as they collapse. `false` to pre-determine
         * the size of surrounding components and then animate. `false` provides a performance
         * benefit because it won't trigger reflow of other components during resizing.
         *
         * The value defaults to `null` and the behavior is determined via the current state.
         * `true` for floated containers, or containers that are not inside a parent container.
         *
         * This config only applies when using animation.
         */
        dynamic: null,

        /**
         * @cfg {Boolean/Object} [expandAnimation]
         * Animation effect to apply when the panel is being expanded. If not specified,
         * this falls back to {@link #cfg-animation}.
         */
        expandAnimation: null,

        /**
         * @cfg {String} expandToolText Text to be announced by screen readers when
         * **expand** {@link Ext.panel.Tool tool} is focused.  Will also be set as the
         * expand tool's {@link Ext.panel.Tool#cfg-tooltip tooltip} text.
         *
         * @locale
         */
        expandToolText: 'Expand panel',

        /**
         * @cfg {Ext.Panel} target
         * The panel to be collapsed.
         *
         * @readonly
         */
        target: null,

        /**
         * @cfg {Object} [tool]
         * The configuration for the collapsible tool. This may be set to `null` to not
         * show the tool.
         */
        tool: {
            xtype: 'tool',
            weight: 900
        },

        /**
         * @cfg {Boolean} [useDrawer]
         * True to enable the {@link #drawer} to display from user interaction.
         */
        useDrawer: true,

        /**
         * @cfg {"collapsed"/"collapsing"/"expanded"/"expanding"} state
         * @since 7.0
         * @private
         */
        state: 'expanded'
    },

    proxyConfig: {
        target: [
            'titleCollapse'
        ]
    },

    collapsed: false,
    collapsing: false,
    expanded: false,
    expanding: false,
    extraSpace: 0,
    $unanimated: false,

    constructor: function(config) {
        this.initConfig(config);
    },

    initialize: function() {
        var me = this;

        me.rendered = true;
        me.ensureCollapseTool();
        me.initialized = true;

        if (me.getCollapsed()) {
            me.doExpandCollapse(true, true);
        }

        me.setupHeaderListeners();
    },

    destroy: function() {
        var me = this,
            active = me.activeOperation,
            task = me.drawerTask;

        me.destroying = true;

        if (task) {
            task.cancel();
        }

        if (active) {
            // This should trigger the callback and cause anu outstanding promise to be triggered
            active.anim.end();
        }

        if (!me.getTarget().destroying) {
            me.reattachBodyWrap();
        }

        Ext.destroy(me.headerListeners, me.drawerListeners, me.drawer, me.collapsibleTool);

        me.callParent();
    },

    /**
     * Collapses the panel body so that the body becomes hidden. Fires the 
     * {@link Ext.Panel#beforecollapse} event which will cancel the collapse action 
     * if it returns false.
     *
     * It also fires the {@link Ext.Panel#collapse} event after the panel body is collapsed.
     *
     * @param {Boolean/Object} [animation] The animation to execute. This setting overrides
     * any {@link #cfg-animation} configuration. Do not pass a value to use the values configured
     * on the class.
     *
     * @return {Ext.Promise} A promise that resolves when the collapse completes.
     */
    collapse: function(animation) {
        return this.toggleCollapsed(true, animation);
    },

    /**
     * Expands the panel body so that it becomes visible. Fires the {@link Ext.Panel#beforeexpand} 
     * event which will cancel the expand action if it returns false.
     *
     * It also fires the {@link Ext.Panel#expand} event after the panel is expanded.
     *
     * @param {Boolean/Object} [animation] The animation to execute. This setting overrides
     * any {@link #cfg-animation} configuration. Do not pass a value to use the values configured
     * on the class.
     *
     * @return {Ext.Promise} A promise that resolves when the expand completes.
     */
    expand: function(animation) {
        return this.toggleCollapsed(false, animation);
    },

    /**
     * Hide the {@link #cfg-drawer}.
     * @param {Boolean/Object} [animation] The animation to execute. This setting overrides
     * any {@link #cfg-animation} configuration. Do not pass a value to use the values configured
     * on the class.
     * @return {Ext.Promise} A promise that resolves when the hide completes.
     */
    hideDrawer: function(animation) {
        var me = this,
            drawer = me.drawer,
            ret;

        if (me.isSliding || !me.getCollapsed() || !drawer || !me.drawerVisible) {
            return; // TODO store promise and return it here
        }

        animation = me.parseAnimation(false, animation);

        if (animation) {
            me.getTarget().element.addCls(me.slidingCls);

            ret = me.doAnimation(false,
                                 me.getSlideOutCfg(
                                     me.getDirection(),
                                     me.afterDrawerHide,
                                     animation
                                 )
            );

            me.isSliding = true;
        }
        else {
            me.afterDrawerHide();
            ret = Ext.Promise.resolve();
        }

        return ret;
    },

    /**
     * Checks the method of expansion, see {@link #dynamic}. If a value is configured,
     * it will be used, otherwise it will be determined.
     * @return {Boolean} If the animated expand/collapse is dynamic.
     */
    isDynamic: function() {
        var dynamic = this.getDynamic(),
            target;

        if (dynamic === null) {
            target = this.getTarget();
            dynamic = target.getFloated() || !target.getRefOwner();
        }

        return dynamic;
    },

    /**
     * Show the {@link #cfg-drawer}.
     * @param {Boolean/Object} [animation] The animation to execute. This setting overrides
     * any {@link #cfg-animation} configuration. Do not pass a value to use the values
     * configured on the class.
     * @return {Ext.Promise} A promise that resolves when the show completes.
     */
    showDrawer: function(animation) {
        var me = this,
            savedProps = me.savedProps,
            direction = me.getDirection(),
            target = me.getTarget(),
            headerSize = me.getHeaderSize(),
            endDirection = me.endDirection,
            vertical = me.verticalMap[direction],
            drawer, w, h, ret, header;

        if (me.isSliding || !me.getCollapsed() || !me.getDrawer()) {
            return Ext.Promise.resolve();
        }

        drawer = me.createDrawer();

        if (vertical) {
            h = '100%';
            w = savedProps.measuredWidth || me.defaultSize;

            drawer.setTop(0);
            drawer.setBottom(0);

            if (endDirection[direction]) {
                drawer.setLeft(null);
                drawer.setRight(headerSize);
            }
            else {
                drawer.setRight(null);
                drawer.setLeft(headerSize);
            }
        }
        else {
            w = '100%';
            h = savedProps.measuredHeight || me.defaultSize;

            drawer.setRight(0);
            drawer.setLeft(0);

            if (endDirection[direction]) {
                drawer.setTop(null);
                drawer.setBottom(headerSize);
            }
            else {
                drawer.setBottom(null);
                drawer.setTop(headerSize);
            }

            if (target.getHeader() && target.getHeaderPosition() === direction) {
                header = drawer.ensureHeader();

                if (header) {
                    header.hide();
                }
            }
        }

        me.configureDrawer(drawer, w, h);
        drawer.show();

        animation = me.parseAnimation(false, animation);
        me.isSliding = true;

        if (animation) {
            animation = me.getSlideInCfg(direction, me.afterDrawerShow, animation);
            animation.preserveEndState = true;
            me.getTarget().element.addCls(me.slidingCls);
            ret = me.doAnimation(false, animation);
        }
        else {
            me.afterDrawerShow();
            ret = Ext.Promise.resolve();
        }

        return ret;
    },

    /**
     * Set the collapsed state of the panel.
     * @param {Boolean} collapsed The collapsed state.
     * @param {Boolean/Object} [animation] The animation to execute. This setting overrides
     * any {@link #cfg-animation} configuration. Do not pass a value to use the values
     * configured on the class.
     * @return {Ext.Promise} A promise that resolves when the collapse/expand completes.
     */
    toggleCollapsed: function(collapsed, animation) {
        var me = this,
            target = me.getTarget(),
            current = me.getCollapsed(),
            event, info, ret;

        if (me.activeOperation) {
            // End animation before collapse/expand on continuous tap
            me.activeOperation.anim.end();
            current = me.getCollapsed();
        }

        if (collapsed === current) {
            return Ext.Promise.resolve();
        }

        if (me.$unanimated) {
            me.$unanimated = animation = false;
        }
        else if (me.rendered) {
            animation = me.parseAnimation(collapsed, animation);
        }
        else {
            animation = null;
        }

        event = 'before' + (collapsed ? 'collapse' : 'expand');

        if (me.initialized && target.hasListeners[event]) {
            info = {
                animation: animation
            };

            if (target.fireEvent(event, target, info) === false) {
                return Ext.Promise.resolve();
            }

            animation = info.animation;
        }

        me.hideDrawer(false);

        if (animation) {
            ret = me.doExpandCollapseAnimated(collapsed, animation);
        }
        else {
            ret = me.doExpandCollapse(collapsed);
        }

        return ret;
    },

    applyAnimation: function(config) {
        if (config === true) {
            config = {};
        }

        return config;
    },

    updateCollapsed: function(collapsed) {
        var me = this;

        if (me.rendered && !me.preventUpdate) {
            // Force the property back to the previous state, it will be set
            // either at the end of the animation, or immediately after the collapse
            // operation completes
            me._collapsed = !collapsed;
            me.toggleCollapsed(collapsed);
        }
        else {
            me.setState(collapsed ? 'collapsed' : 'expanded');
        }
    },

    updateCollapseToolText: function(text) {
        this.setToolTextIf(text, this.getCollapsed());
    },

    updateDirection: function(direction, oldDirection) {
        var me = this;

        if (!me.isConfiguring) {
            if (me.getCollapsed()) {
                me.getTarget().moveHeaderPosition(direction, oldDirection);
            }

            me.ensureCollapseTool();
        }
    },

    updateDynamic: function(dynamic) {
        var me = this,
            drawer = me.drawer;

        if (dynamic && drawer) {
            if (me.hasDetachedBody) {
                me.reattachBodyWrap();
            }

            me.drawer = Ext.destroy(drawer);
        }
    },

    updateExpandToolText: function(text) {
        this.setToolTextIf(text, !this.getCollapsed());
    },

    updateState: function(state, oldState) {
        var me = this,
            target = me.getTarget();

        if (oldState) {
            me[oldState] = target[oldState] = false;
        }

        if (state) {
            me[state] = target[state] = true;
        }
    },

    updateTitleCollapse: function() {
        if (this.rendered) {
            this.setupHeaderListeners();
        }
    },

    updateUseDrawer: function() {
        if (this.rendered) {
            this.setupHeaderListeners();
        }
    },

    privates: {
        animateEndCls: Ext.baseCSSPrefix + 'placeholder-animate-end',

        collapsingDirections: {
            top: ['up', 'down'],
            left: ['left', 'right'],
            bottom: ['down', 'up'],
            right: ['right', 'left']
        },

        defaultSize: 300,

        endDirection: {
            right: 1,
            bottom: 1
        },

        headerChangePosition: {
            top: ['top', 'bottom'],
            left: ['left', 'right'],
            bottom: ['bottom', 'top'],
            right: ['right', 'left']
        },

        hasDetachedBody: false,
        rendered: false,
        slidingCls: Ext.baseCSSPrefix + 'sliding',

        verticalMap: {
            right: 1,
            left: 1
        },

        afterAnimation: function(active) {
            active.deferred.resolve();
            this.activeOperation = null;
        },

        afterDrawerHide: function() {
            var me = this,
                target = me.getTarget(),
                active = me.activeOperation,
                drawer = me.drawer,
                header;

            target.element.removeCls(me.slidingCls);
            me.drawerVisible = me.isSliding = false;

            if (!me.destroying) {
                me.drawerListeners = Ext.destroy(me.drawerListeners);
                drawer.hide();
                header = drawer.getHeader();

                if (header) {
                    header.show();
                }

                target.fireEvent('drawerhide', target);
            }

            if (active) {
                me.afterAnimation(active);
            }
        },

        afterDrawerShow: function() {
            var me = this,
                active = me.activeOperation,
                drawerListeners, listenerCfg,
                target = me.getTarget(),
                header;

            me.isSliding = false;
            me.drawerVisible = true;

            if (!me.destroying) {
                target.element.removeCls(me.slidingCls);

                listenerCfg = {
                    mouseleave: 'handleElMouseLeave',
                    mouseenter: 'handleElMouseEnter',
                    scope: me,
                    destroyable: true
                };

                drawerListeners = [
                    Ext.on('mousedown', 'handleGlobalDrawerEvent', me, {
                        destroyable: true
                    }),
                    Ext.getDoc().on('mousemove', 'handleGlobalDrawerEvent', me, {
                        destroyable: true
                    }),
                    me.drawer.element.on(listenerCfg)
                ];

                header = target.getHeader();

                if (header) {
                    drawerListeners.push(header.element.on(listenerCfg));
                }

                me.drawerListeners = drawerListeners;

                target.fireEvent('drawershow', target);
            }

            if (active) {
                me.afterAnimation(active);
            }
        },

        afterExpandCollapseAnimation: function() {
            var me = this,
                active = me.activeOperation,
                target = me.getTarget(),
                cls = active.animCls,
                anim, header, bodyWrap;

            if (!me.destroying) {
                header = target.getHeader();

                if (active.placeHolder) {
                    me.drawer.hide();
                }

                if (active.reattach) {
                    me.reattachBodyWrap();
                }

                if (header && active.restoreHeaderVis) {
                    header.element.setVisibility(true);
                }

                if (cls) {
                    target.element.removeCls(cls);
                }

                if (active.restore) {
                    anim = active.anim.config;

                    if (anim.to.height) {
                        anim.element.setHeight(null);
                    }

                    if (anim.to.width) {
                        anim.element.setWidth(null);
                    }

                    me.restoreProps();

                    bodyWrap = target.bodyWrapElement;
                    bodyWrap.setWidth(null).setHeight(null);

                    header = header && header.element;

                    if (header) {
                        header.setWidth(null).setHeight(null);
                    }
                }

                me.afterExpandCollapse(active.collapsed, true);
            }

            me.afterAnimation(active);
        },

        afterExpandCollapse: function(collapsed) {
            var me = this,
                target = me.getTarget(),
                types = me.headerChangePosition,
                direction = me.getDirection(),
                headerPosition = target.getHeaderPosition(),
                event = collapsed ? 'collapse' : 'expand';

            target.bodyWrapElement.setVisible(!collapsed);

            if (types[headerPosition].indexOf(direction) < 0) {
                target.moveHeaderPosition(collapsed ? direction : headerPosition,
                                          !collapsed ? direction : headerPosition);
            }

            me.setState(collapsed ? 'collapsed' : 'expanded');

            me.preventUpdate = true;
            // Ensure the panel's collapsed config is maintained (so it can be stateful but
            // also just to be correct if user calls getCollapsed):
            target._collapsed = !collapsed;
            target.setCollapsed(collapsed);
            me.preventUpdate = false;

            me.ensureCollapseTool();

            target.toggleCls(me.expandedCls, !collapsed);

            if (me.initialized && target.hasListeners[event]) {
                target.fireEvent(event, target);
            }

            // This is largely going to be a no-op, since the target will
            // essentially just call collapser.setCollapsed, however this allows
            // consumers the ability to override updateCollapsed to detect changes
            // in state
            target.setCollapsed(collapsed);
        },

        createDrawer: function() {
            var me = this,
                p = me.drawer;

            if (!p) {
                me.drawer = p = Ext.create(me.getDrawer());
                p.bodyWrapElement.hide();
            }

            return p;
        },

        configureDrawer: function(drawer, width, height, resetPos) {
            var me = this,
                target = me.getTarget(),
                bodyWrap = target.bodyWrapElement;

            drawer.setTitle(target.getTitle());

            drawer.setWidth(width);
            drawer.setHeight(height);

            if (resetPos) {
                drawer.setTop(0);
                drawer.setRight(null);
                drawer.setBottom(null);
                drawer.setLeft(0);
            }

            drawer.element.append(bodyWrap);

            me.getContainerTarget().appendChild(drawer.element);

            bodyWrap.show();
            drawer.show();

            me.hasDetachedBody = true;
        },

        doAnimation: function(collapsed, animation, activeOperation) {
            var deferred, anim;

            activeOperation = activeOperation || {};

            deferred = activeOperation.deferred || new Ext.Deferred();
            anim = new Ext.fx.Animation(animation);

            activeOperation.anim = anim;
            activeOperation.deferred = deferred;
            activeOperation.collapsed = collapsed;

            this.activeOperation = activeOperation;

            Ext.Animator.run(anim);

            return deferred.promise;
        },

        doExpandCollapse: function(collapsed, initial) {
            var me = this,
                target = me.getTarget(),
                direction;

            if (me.rendered) {
                if (collapsed) {
                    me.saveProps();
                    target.setFlex(null);
                    direction = me.getDirection();

                    if (direction === 'top' || direction === 'bottom') {
                        target.setHeight(null);
                    }
                    else {
                        target.setWidth(null);
                    }
                }
                else {
                    me.reattachBodyWrap();
                    me.restoreProps();
                }

                me.afterExpandCollapse(collapsed);
            }

            return initial ? null : Ext.Promise.resolve();
        },

        doExpandCollapseAnimated: function(collapsed, animation) {
            var me = this;

            me.setState(collapsed ? 'collapsing' : 'expanding');

            if (me.isDynamic()) {
                return me.doExpandCollapseDynamic(collapsed, animation);
            }

            return me.doExpandCollapsePlaceholder(collapsed, animation);
        },

        doExpandCollapseDynamic: function(collapsed, animation) {
            var me = this,
                target = me.getTarget(),
                headerPosition = target.getHeaderPosition(),
                direction = me.getDirection(),
                targetEl = target.element,
                bodyWrap = target.bodyWrapElement,
                header = target.getHeader(),
                headerEl = header && header.element,
                from = {},
                to = {},
                directionVertical = direction === 'top' || direction === 'bottom',
                headerVertical = headerPosition === 'top' || headerPosition === 'bottom',
                headerSize = me.getHeaderSize(),
                headerDifferent = headerPosition !== direction,
                extraSpace = me.extraSpace,
                height, width, savedProps, size;

            me.extraSpace = 0;

            if (collapsed) {
                savedProps = me.saveProps();
                height = savedProps.measuredHeight;
                width = savedProps.measuredWidth;

                if (directionVertical) {
                    me.measureAndSet(bodyWrap, 'Height');

                    if (headerDifferent) {
                        me.measureAndSet(headerEl, 'Height');
                    }

                    from.height = height;
                    to.height = headerVertical ? headerSize : 0;

                    target.setHeight(null);
                    target.setMinHeight(null);
                }
                else {
                    me.measureAndSet(bodyWrap, 'Width');

                    if (headerDifferent) {
                        me.measureAndSet(headerEl, 'Width');
                    }

                    from.width = width;
                    to.width = headerVertical ? headerSize : 0;

                    target.setWidth(null);
                    target.setMinWidth(null);
                }

                target.setFlex(null);
            }
            else {
                headerDifferent = headerPosition !== direction;
                me.reattachBodyWrap();

                // Clear any stamped on size from the collapse before we measure and restore.
                // The size could be influenced by a css size, so restoring may end up doing nothing
                if (directionVertical) {
                    targetEl.setHeight(null);
                }
                else {
                    targetEl.setWidth(null);
                }

                me.restoreProps(true);

                if (headerDifferent) {
                    target.moveHeaderPosition(
                        collapsed
                            ? direction
                            : headerPosition,
                        !collapsed
                            ? direction
                            : headerPosition
                    );
                }

                bodyWrap.show();

                if (headerEl) {
                    headerEl.setWidth(null).setHeight(null);
                }

                me.measureAndSet(bodyWrap, directionVertical ? 'Height' : 'Width', true);

                size = targetEl.measure();
                height = size.height;
                width = size.width;

                target.setFlex(null);

                me.measureAndSet(headerEl, directionVertical ? 'Height' : 'Width');

                if (directionVertical) {
                    from.height = headerSize;
                    to.height = height + extraSpace;

                    target.setHeight(null);
                }
                else {
                    from.width = headerSize;
                    to.width = width + extraSpace;

                    target.setWidth(null);
                }
            }

            return me.doAnimation(collapsed, Ext.apply({
                scope: me,
                callback: me.afterExpandCollapseAnimation,
                element: targetEl,
                preserveEndState: true,
                from: from,
                to: to
            }, animation), {
                restore: !collapsed
            });
        },

        doExpandCollapsePlaceholder: function(collapsed, animation) {
            var me = this,
                types = me.collapsingDirections,
                target = me.getTarget(),
                targetEl = target.element,
                headerPosition = target.getHeaderPosition(),
                direction = me.getDirection(),
                directionVertical = direction === 'top' || direction === 'bottom',
                headerVertical = headerPosition === 'top' || headerPosition === 'bottom',
                header = target.getHeader(),
                headerDifferent = directionVertical !== headerVertical,
                containerBox = me.getContainerTarget().getBox(),
                height, width, drawer, anim, animCls,
                restoreHeaderVis, savedProps, size, active;

            drawer = me.createDrawer();

            if (collapsed) {
                savedProps = me.saveProps();
                height = savedProps.measuredHeight;
                width = savedProps.measuredWidth;
            }
            else {
                me.reattachBodyWrap();
                me.restoreProps(true);
                size = targetEl.measure();
                height = size.height;
                width = size.width;
            }

            me.configureDrawer(drawer, width, height, true);

            drawer.setLeft(targetEl.getLeft() - containerBox.left);
            drawer.setTop(targetEl.getTop() - containerBox.top);

            if (directionVertical) {
                target.setHeight(null);
                target.setMinHeight(null);
            }
            else {
                target.setWidth(null);
                target.setMinWidth(null);
            }

            target.setFlex(null);

            if (collapsed) {
                if (headerDifferent && types[headerPosition].indexOf(direction) < 0) {
                    target.moveHeaderPosition(
                        collapsed
                            ? direction
                            : headerPosition,
                        !collapsed
                            ? direction
                            : headerPosition
                    );
                }

                if (header) {
                    // Keep the header size, but make it invisible
                    header.element.setVisibility(false);
                }

                anim = me.getSlideOutCfg(direction, function() {
                    if (me.destroying) {
                        return;
                    }

                    active = me.activeOperation;

                    drawer.hide();

                    if (header) {
                        header.element.setVisibility(true);

                        me.doAnimation(collapsed, {
                            type: 'slideIn',
                            element: header.element,
                            reverse: true,
                            direction: direction,
                            isElementBoxFit: false,
                            scope: me,
                            callback: me.afterExpandCollapseAnimation
                        }, active);
                    }
                    else {
                        me.afterExpandCollapseAnimation();
                    }
                }, animation);
            }
            else {
                anim = me.getSlideInCfg(direction, me.afterExpandCollapseAnimation, animation);

                if (me.endDirection[direction]) {
                    animCls = me.animateEndCls;
                    targetEl.addCls(animCls);
                }

                if (!headerDifferent) {
                    header.element.setVisibility(false);
                    restoreHeaderVis = true;
                }
            }

            return me.doAnimation(collapsed, anim, {
                placeHolder: true,
                restore: !collapsed,
                reattach: true,
                animCls: animCls,
                restoreHeaderVis: restoreHeaderVis
            });
        },

        ensureCollapseTool: function() {
            var me = this,
                target = me.getTarget(),
                header = target.ensureHeader(),
                pos = me.getDirection(),
                collapsed = me.getCollapsed(),
                types = me.collapsingDirections,
                tool = me.collapsibleTool,
                cfg = me.getTool();

            if (header && cfg) {
                if (!tool) {
                    me.collapsibleTool = tool = target.addTool(Ext.apply({
                        handler: me.onToggleToolTap,
                        scope: me,
                        $internal: true
                    }, cfg))[0];
                }

                tool.setType(collapsed ? types[pos][1] : types[pos][0]);
                tool.setTooltip(collapsed ? me.getExpandToolText() : me.getCollapseToolText());
            }
            else {
                me.collapsibleTool = Ext.destroy(tool);
            }
        },

        getAnimationFor: function(collapsed) {
            var anim = collapsed ? this.getCollapseAnimation() : this.getExpandAnimation();

            return anim || this.getAnimation();
        },

        getContainerTarget: function() {
            return this.getTarget().element.parent();
        },

        getDrawerTask: function() {
            var me = this,
                task = me.drawerTask;

            if (!task) {
                me.drawerTask = task = new Ext.util.DelayedTask(me.hideDrawer, me);
            }

            return task;
        },

        getHeaderSize: function() {
            var header = this.getTarget().ensureHeader(),
                headerEl = header && header.element;

            return headerEl ? Math.min(headerEl.measure('h'), headerEl.measure('w')) : 0;
        },

        getSlideInCfg: function(direction, callback, animation) {
            return Ext.apply({
                type: 'slideIn',
                direction: direction,
                reverse: true,
                element: this.drawer.element,
                isElementBoxFit: false,
                scope: this,
                callback: callback
            }, animation);
        },

        getSlideOutCfg: function(direction, callback, animation) {
            return Ext.apply({
                type: 'slideOut',
                direction: direction,
                element: this.drawer.element,
                isElementBoxFit: false,
                scope: this,
                callback: callback
            }, animation);
        },

        handleElMouseEnter: function() {
            this.getDrawerTask().cancel();
        },

        handleElMouseLeave: function(e) {
            var me = this,
                toElement = e.getRelatedTarget(),
                target = me.getTarget();

            // If the toElement is in the component tree, do not collapse
            if (toElement && (target.owns(toElement) || me.drawer.owns(toElement))) {
                return;
            }

            me.getDrawerTask().delay(me.getDrawerHideDelay());
        },

        handleGlobalDrawerEvent: function(e) {
            var me = this,
                drawer = me.drawer,
                target = me.getTarget(),
                task;

            task = me.getDrawerTask();

            if (target.owns(e) || drawer.owns(e)) {
                task.cancel();
            }
            else {
                task.delay(me.getDrawerHideDelay());
            }
        },

        measureAndSet: function(el, dimension, clear) {
            var setter, getter;

            if (!el) {
                return;
            }

            setter = 'set' + dimension;
            getter = 'get' + dimension;

            if (clear) {
                el[setter](null);
            }

            el[setter](el[getter](false, true));
        },

        onHeaderTap: function(e) {
            var me = this,
                titleCollapse = me.getTitleCollapse(),
                collapsed = me.getCollapsed(),
                cmp = Ext.Component.from(e);

            // Return on click of tools on header
            if (!(cmp.isPanelTitle || cmp.isPanelHeader)) {
                return;
            }

            if (titleCollapse) {
                me.toggleCollapsed(!collapsed);
            }
            else if (me.getUseDrawer() && collapsed && !me.isDynamic()) {
                me[me.drawerVisible ? 'hideDrawer' : 'showDrawer']();
            }
        },

        onToggleToolTap: function() {
            this.toggleCollapsed(!this.getCollapsed());
        },

        parseAnimation: function(collapsed, animation) {
            if (animation === undefined) {
                animation = this.getAnimationFor(collapsed);
            }
            else if (animation) {
                if (typeof animation === 'boolean') {
                    animation = {};
                }

                animation = Ext.apply({}, animation, this.getAnimationFor(collapsed));
            }

            return animation;
        },

        reattachBodyWrap: function() {
            if (this.hasDetachedBody) {
                this.getTarget().reattachBodyWrap();
                this.hasDetachedBody = false;
            }
        },

        restoreProps: function(keep) {
            var me = this,
                target = me.getTarget(),
                savedProps = me.savedProps,
                prop;

            if (savedProps) {
                prop = savedProps.flex;

                if (prop) {
                    target.setFlex(prop);
                }

                target.setMinHeight(savedProps.minHeight);
                target.setMinWidth(savedProps.minWidth);
                target.setHeight(savedProps.height);
                target.setWidth(savedProps.width);

                if (!keep) {
                    me.savedProps = null;
                }
            }
        },

        saveProps: function() {
            var me = this,
                target = me.getTarget(),
                size = target.element.measure(),
                props;

            me.savedProps = props = {
                flex: target.getFlex(),
                minHeight: target.getMinHeight(),
                minWidth: target.getMinWidth(),
                height: target.getHeight(),
                width: target.getWidth(),
                measuredWidth: size.width,
                measuredHeight: size.height
            };

            return props;
        },

        setToolTextIf: function(text, doSet) {
            var tool = this.collapsibleTool;

            if (text && tool && doSet) {
                tool.setTooltip(text);
            }
        },

        setupHeaderListeners: function() {
            var me = this,
                header = me.getTarget().getHeader();

            me.headerListeners = Ext.destroy(me.headerListeners);

            if (header && (me.getUseDrawer() || me.getTitleCollapse())) {
                me.headerListeners = header.element.on({
                    destroyable: true,
                    scope: me,
                    tap: 'onHeaderTap'
                });
            }
        },

        unanimated: function(fn) {
            this.$unanimated = true;

            if (fn) {
                fn(this);
                this.$unanimated = false;
            }

            return this;
        }
    }
});
