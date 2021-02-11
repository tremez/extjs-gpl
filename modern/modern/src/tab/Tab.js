/**
 * Used in the {@link Ext.tab.Bar} component. This shouldn't be used directly, instead use
 * {@link Ext.tab.Bar} or {@link Ext.tab.Panel}.
 */
Ext.define('Ext.tab.Tab', {
    extend: 'Ext.Button',
    xtype: 'tab',
    alternateClassName: 'Ext.Tab',

    /**
     * @private
     */
    isTab: true,

    config: {
        /**
         * @cfg {Boolean}
         * Set this to `true` to have the tab be active by default.
         */
        active: null,

        /**
         * @cfg {String}
         * The title of the card that this tab is bound to.
         */
        title: null,

        /**
         * @cfg {Boolean} [closable=false]
         * True to make the Tab closable and display the close icon
         */
        closable: null,

        /**
         * @cfg {String}
         * The position of the tabbar.
         */
        tabPosition: 'top',

        /**
         * @cfg {String}
         * The rotation of the tab buttons in tabbar.
         */
        rotation: 'default'
    },

    standardizedRotationByValue: {
        0: "none",
        none: "none",
        1: "right",
        right: "right",
        2: "left",
        left: "left"
    },

    defaultRotationForPosition: {
        top: "none",
        right: "right",
        bottom: "none",
        left: "left"
    },

    rotationClass: {
        none: Ext.baseCSSPrefix + 'tab-rotate-none',
        right: Ext.baseCSSPrefix + 'tab-rotate-right',
        left: Ext.baseCSSPrefix + 'tab-rotate-left'
    },

    iconAlignForRotation: {
        left: {
            left: Ext.baseCSSPrefix + 'icon-align-bottom',
            none: Ext.baseCSSPrefix + 'icon-align-left',
            right: Ext.baseCSSPrefix + 'icon-align-top'
        },
        top: {
            left: Ext.baseCSSPrefix + 'icon-align-left',
            none: Ext.baseCSSPrefix + 'icon-align-top',
            right: Ext.baseCSSPrefix + 'icon-align-left'
        },
        right: {
            left: Ext.baseCSSPrefix + 'icon-align-top',
            none: Ext.baseCSSPrefix + 'icon-align-right',
            right: Ext.baseCSSPrefix + 'icon-align-bottom'
        },
        bottom: {
            left: Ext.baseCSSPrefix + 'icon-align-left',
            none: Ext.baseCSSPrefix + 'icon-align-top',
            right: Ext.baseCSSPrefix + 'icon-align-left'
        }
    },

    positionClass: {
        'top': Ext.baseCSSPrefix + 'tab-position-top',
        'right': Ext.baseCSSPrefix + 'tab-position-right',
        'bottom': Ext.baseCSSPrefix + 'tab-position-bottom',
        'left': Ext.baseCSSPrefix + 'tab-position-left'
    },

    applyRotation: function(rotation) {
        return rotation || 'default';
    },

    updateRotation: function(rotation) {
        this.syncRotationAndPosition();
    },

    updateTabPosition: function() {
        this.syncRotationAndPosition();
    },

    getActualRotation: function() {
        // Return the rotation, or if "default", the default rotation value for the tab position.
        var rotation = this.getRotation() || "default";

        rotation = (rotation === 'default')
            ? this.defaultRotationForPosition[this.getTabPosition()]
            : rotation;

        return this.standardizedRotationByValue[rotation];
    },

    syncRotationAndPosition: function() {

        // Default rotation depends on position, so
        // this common routine is needed to figure out
        // rotation and position together.

        // iconAlign depends on rotation, and is tricky
        // because we need to update the cls without
        // changing the actual iconAlign property. In
        // other words, if iconAlign is top, then the
        // actual cls varies to be icon-align-left, -top,
        // -right, or -bottom, depending on rotation.

        var me = this,
            rotation = me.getActualRotation(),

            oldRotationCls = me._rotationCls,
            rotationCls = me._rotationCls = me.rotationClass[rotation],

            oldIconAlignCls = me._iconAlignCls ||
                Ext.baseCSSPrefix + 'icon-align-' + me.getIconAlign(),
            iconAlignCls = me._iconAlignCls = me.iconAlignForRotation[me.getIconAlign()][rotation],

            oldPositionCls = me._positionCls,
            positionCls = me._positionCls = me.positionClass[me.getTabPosition()];

        me.replaceCls(oldRotationCls, rotationCls);
        me.replaceCls(oldIconAlignCls, iconAlignCls);
        me.replaceCls(oldPositionCls, positionCls);
    },

    pressedDelay: true,

    classCls: Ext.baseCSSPrefix + 'tab',
    activeCls: Ext.baseCSSPrefix + 'active',
    closableCls: Ext.baseCSSPrefix + 'closable',

    getTemplate: function() {
        var template = this.callParent();

        template.push({
            reference: 'activeIndicatorElement',
            cls: Ext.baseCSSPrefix + 'active-indicator-el'
        }, {
            reference: 'closeIconElement',
            cls: Ext.baseCSSPrefix + 'close-icon-el ' +
                    Ext.baseCSSPrefix + 'font-icon ' +
                    Ext.baseCSSPrefix + 'no-ripple',
            listeners: {
                click: 'onClick'
            }
        });

        return template;
    },

    shouldRipple: function() {
        return this.getRipple();
    },

    /**
     * @event activate
     * Fires when a tab is activated
     * @param {Ext.tab.Tab} this
     */

    /**
     * @event deactivate
     * Fires when a tab is deactivated
     * @param {Ext.tab.Tab} this
     */

    onClick: function(e) {
        var me = this,
            tabBar = me.tabBar;

        if (e.currentTarget === me.closeIconElement.dom) {
            if (tabBar && !me.getDisabled()) {
                tabBar.closeTab(me);
            }

            e.stopPropagation();
        }
        else {
            return me.callParent([e]);
        }
    },

    updateTitle: function(title) {
        this.setText(title);
    },

    updateActive: function(active, oldActive) {
        var me = this,
            el = me.el,
            activeCls = me.activeCls;

        if (active && !oldActive) {
            el.addCls(activeCls);
            me.fireEvent('activate', me);
        }
        else if (oldActive) {
            el.removeCls(activeCls);
            me.fireEvent('deactivate', me);
        }
    },

    updateClosable: function(closable) {
        this.toggleCls(this.closableCls, !!closable);
    },

    onAdded: function(parent, instanced) {
        this.callParent([parent, instanced]);

        this.tabBar = parent.isTabBar ? parent : null;
    },

    onRemoved: function(destroying) {
        this.callParent([destroying]);

        this.tabBar = null;
    }

}, function() {
    this.override({
        activate: function() {
            this.setActive(true);
        },

        deactivate: function() {
            this.setActive(false);
        }
    });
});
