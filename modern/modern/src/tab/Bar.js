/**
 * Ext.tab.Bar is used internally by {@link Ext.tab.Panel} to create the bar of tabs that appears
 * at the top of the tab panel. It can also be used as a standalone component to 
 * recreate the look and feel of tabs.
 */
Ext.define('Ext.tab.Bar', {
    extend: 'Ext.Toolbar',
    alternateClassName: 'Ext.TabBar',
    xtype: 'tabbar',
    isTabBar: true,

    requires: [
        'Ext.layout.HBox',
        'Ext.tab.Tab'
    ],

    config: {
        /**
         * @cfg {String} defaultTabUI
         * A default {@link Ext.Component#ui ui} to use for {@link Ext.tab.Tab Tab} items.
         */
        defaultTabUI: null,

        /**
         * @cfg {Boolean} animateIndicator
         * Determines if the active indicator below the tab should animate or snap
         */
        animateIndicator: false,

        /**
         * @cfg {String} tabRotation
         * Specifies tab rotation. Possible values are 'default', 'left',
         * 'none', 'right'.
         * @accessor
         */
        tabRotation: "default"
    },

    /**
     * @cfg defaultType
     * @inheritdoc
     */
    defaultType: 'tab',

    /**
     * @cfg layout
     * @inheritdoc
     */
    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    eventedConfig: {
        /**
         * @cfg {Number/String/Ext.Component} activeTab
         * The initially activated tab. Can be specified as numeric index, itemId,
         * component ID, or as the component instance itself.
         * @accessor
         * @evented
         */
        activeTab: null
    },

    /**
     * @property baseCls
     * @inheritdoc
     */
    baseCls: Ext.baseCSSPrefix + 'tabbar',

    /**
     * Speed in which the Indicator will move per Tab in milliseconds
     */
    indicatorAnimationSpeed: 150,

    /**
     * @event tabchange
     * Fired when active tab changes.
     * @param {Ext.tab.Bar} this
     * @param {Ext.tab.Tab} newTab The new Tab
     * @param {Ext.tab.Tab} oldTab The old Tab
     */

    initialize: function() {
        var me = this;

        me.callParent();

        me.on({
            tap: 'onTabTap',

            delegate: '> tab',
            scope: me
        });
    },

    getTemplate: function() {
        var template = this.callParent();

        template.push({
            reference: 'stripElement',
            cls: Ext.baseCSSPrefix + 'strip-el'
        });

        return template;
    },

    /**
     * @private
     */
    onTabTap: function(tab) {
        this.setActiveTab(tab);
    },

    /**
     * @private
     */
    applyActiveTab: function(newActiveTab, oldActiveTab) {
        var newTabInstance = this.parseActiveTab(newActiveTab);

        if (!newActiveTab && newActiveTab !== 0) {
            return;
        }

        if (!newTabInstance) {
            //<debug>
            if (oldActiveTab) {
                Ext.Logger.warn('Trying to set a non-existent activeTab');
            }

            //</debug>
            return;
        }

        return newTabInstance;
    },

    /**
     * @private
     */
    updateTabRotation: function(rotation) {
        var tabs = this.getTabs(),
            i;

        for (i = 0; i < tabs.length; i++) {
            tabs[i].setRotation(rotation);
        }
    },

    /**
     * @private
     * Default pack to center when docked to the bottom, otherwise default pack to left
     */
    updateDocked: function(newDocked) {
        var me = this,
            layout = me.getLayout(),
            initialConfig = me.getInitialConfig(),
            i, vertical,
            pack, tabs;

        if (!initialConfig.layout || !initialConfig.layout.pack) {
            pack = (newDocked === 'bottom') ? 'center' : 'left';

            // layout isn't guaranteed to be instantiated so must test
            if (layout.isLayout) {
                layout.setPack(pack);
            }
            else {
                layout.pack = (layout && layout.pack) ? layout.pack : pack;
            }
        }

        vertical = (newDocked === 'right' || newDocked === 'left');

        if (layout.getVertical() !== vertical) {
            layout.setVertical(vertical);
        }

        // Let the tab buttons know the new tab bar position.
        tabs = this.getTabs();

        for (i = 0; i < tabs.length; i++) {
            tabs[i].setTabPosition(newDocked);
        }

        this.callParent(arguments);
    },

    /**
     * @private
     * Sets the active tab
     */
    updateActiveTab: function(newTab, oldTab) {
        var me = this,
            animateIndicator = this.getAnimateIndicator();

        if (animateIndicator && newTab && oldTab && oldTab.parent) {
            me.animateTabIndicator(newTab, oldTab);
        }
        else {

            if (newTab) {
                newTab.setActive(true);
            }

            // Check if the parent is present, if not it is destroyed
            if (oldTab && oldTab.parent) {
                oldTab.setActive(false);
                this.previousTab = oldTab;
            }

        }
    },

    updateAnimateIndicator: function() {
        var me = this;

        if (me.$animateIndicatorElement) {
            me.$animateIndicatorElement.destroy();
        }

        if (me.$indicatorAnimationListeners) {
            me.$indicatorAnimationListeners.destroy();
        }

        me.$indicatorAnimationListeners = me.$animateIndicatorElement = null;
    },

    animateTabIndicator: function(newTab, oldTab) {
        var me = this,
            newTabElement = newTab.element,
            oldTabElement = oldTab.element,
            oldIndicator = oldTab.activeIndicatorElement,
            newIndicator = newTab.activeIndicatorElement,
            oldIndicatorProps, newIndicatorProps, animateIndicatorElement,
            vertical, heightOrWidth, calcIndicatorProps,
            tabBarPosition = this.getDocked();

        vertical = ((tabBarPosition === 'left') || (tabBarPosition === 'right'));

        calcIndicatorProps = function(tabElement, indicator) {
            // Construct an object that looks like this. If the
            // orientation is vertical, start and stop at the tab's y.
            // If it's horizontal, start and stop at the tab's x.
            // {
            //     width: 32,
            //     height: 4,
            //     x: 100,
            //     y: 300,
            //     'background-color': #fafafa
            // }

            var slideAnimObj = {
                width: indicator.getWidth(),
                height: indicator.getHeight(),
                x: indicator.getX(),
                y: tabElement.getY(),
                'background-color': indicator.getStyle('background-color')
            };

            if (!vertical) {
                slideAnimObj.x = tabElement.getX();
                slideAnimObj.y = indicator.getY();
            }

            return slideAnimObj;
        };

        oldIndicatorProps = calcIndicatorProps(oldTabElement, oldIndicator);
        newIndicatorProps = calcIndicatorProps(newTabElement, oldIndicator);

        newIndicator.hide();

        newTab.setActive(true);
        oldTab.setActive(false);

        // If the indicator has a height (if top or bottom) or width (if left or right)
        // then have it do its thing.
        heightOrWidth = vertical ? 'width' : 'height';

        if (oldIndicatorProps[heightOrWidth] || newIndicatorProps[heightOrWidth]) {

            animateIndicatorElement = me.$animateIndicatorElement;

            animateIndicatorElement = me.$animateIndicatorElement = me.element.insertFirst({
                cls: Ext.baseCSSPrefix + 'active-indicator-el'
            });

            if (me.$indicatorAnimationListeners) {
                me.$indicatorAnimationListeners.destroy();
                me.$indicatorAnimationListeners = null;
            }

            me.$indicatorAnimation = animateIndicatorElement.animate({
                duration: me.indicatorAnimationSpeed,
                from: oldIndicatorProps,
                to: newIndicatorProps
            });

            me.$indicatorAnimationListeners = me.$indicatorAnimation.on({
                destroyable: true,
                animationend: {
                    fn: function() {
                        newIndicator.show();
                        animateIndicatorElement.hide();
                        animateIndicatorElement.destroy();
                        me.$indicatorAnimationListeners.destroy();
                        me.$indicatorAnimation = me.$indicatorAnimationListeners = null;
                    },
                    single: true
                }
            });
        }
    },

    /**
     * Returns the tabs within the tab panel
     * @return {Ext.tab.Tab[]}
     */
    getTabs: function() {
        return this.query('> tab');
    },

    /**
     * @private
     * Parses the active tab, which can be a number or string
     */
    parseActiveTab: function(tab) {
        // we need to call getItems to initialize the items, otherwise they will not exist yet.
        if (typeof tab === 'number') {
            return this.getTabs()[tab];
        }
        else if (typeof tab === 'string') {
            tab = this.getComponent(tab) || Ext.getCmp(tab);
        }

        return tab;
    },

    onItemAdd: function(item, index) {
        var me = this,
            defaultTabUI = me.getDefaultTabUI();

        if (item.isTab) {
            item.setRotation(me.getTabRotation());
            item.setTabPosition(me.getDocked());

            if (defaultTabUI && (item.getUi() == null)) {
                item.setUi(defaultTabUI);
            }
        }

        this.callParent([item, index]);
    },

    privates: {
        /**
         * @private
         * Determines the next tab to activate when one tab is closed.
         * @param {Ext.tab.Tab} tabToClose
         */
        findNextActivatableTab: function(tabToClose) {
            var me = this,
                previousTab = me.previousTab,
                nextTab;

            if (tabToClose.getActive() && me.getItems().getCount() > 1) {
                if (previousTab && previousTab !== tabToClose && !previousTab.getDisabled()) {
                    nextTab = previousTab;
                }
                else {
                    nextTab = tabToClose.next('tab:not([disabled=true])') ||
                        tabToClose.prev('tab:not([disabled=true])');
                }
            }

            // If we couldn't find the next tab to activate, fall back
            // to the currently active one. We need to have a focused tab
            // at all times.
            return nextTab || me.getActiveTab();
        },

        /**
         * @private
         * @param {Ext.tab.Tab} tab
         */
        closeTab: function(tab) {
            var me = this,
                nextActivatableTab = me.findNextActivatableTab(tab),
                parent = me.parent;

            if (parent && parent.isTabPanel) {
                // setting the active card on a tab panel also sets the active tab in the tab bar
                if (nextActivatableTab) {
                    parent.setActiveItem(nextActivatableTab.card);
                }

                // removing card from tab panel also removes the tab from the tab bar
                parent.remove(tab.card);
            }
            else {
                if (nextActivatableTab) {
                    me.setActiveTab(nextActivatableTab);
                }

                me.remove(tab);
            }
        }
    }
});
