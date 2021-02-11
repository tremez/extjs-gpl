/**
 * A simple class used to mask any {@link Ext.Container}.
 *
 * This should rarely be used directly, instead look at the {@link Ext.Container#masked}
 * configuration.
 *
 * ## Example
 *
 *     @example
 *     // Create our container
 *     var container = Ext.create('Ext.Container', {
 *         html: 'My container!'
 *     });
 *
 *     // Add the container to the Viewport
 *     Ext.Viewport.add(container);
 *
 *     // Mask the container
 *     container.setMasked(true);
 */
Ext.define('Ext.Mask', {
    extend: 'Ext.Component',
    xtype: 'mask',
    requires: ['Ext.util.InputBlocker'],

    config: {
        /**
         * @cfg {Boolean} transparent True to make this mask transparent.
         */
        transparent: false,

        /**
         * @cfg
         * @hide
         */
        top: 0,

        /**
         * @cfg
         * @hide
         */
        left: 0,

        /**
         * @cfg
         * @hide
         */
        right: 0,

        /**
         * @cfg
         * @hide
         */
        bottom: 0
    },

    baseCls: Ext.baseCSSPrefix + 'mask',

    /**
     * @event tap
     * A tap event fired when a user taps on this mask
     * @param {Ext.Mask} this The mask instance
     * @param {Ext.EventObject} e The event object
     */
    initialize: function() {
        var me = this;

        me.callParent();
        me.element.on('tap', 'onTap', me);
        me.on('hide', 'onHide', me);
        me.on('show', 'onShow', me);
    },

    onHide: function(me) {
        var firstChild;

        // Enable Tabbing only if tabbing is disabled
        if (me.sender && me.tabbingDisabled) {
            me.sender.enableTabbing();
            me.tabbingDisabled = false;
        }

        Ext.util.InputBlocker.unblockInputs();

        // Oh how I loves the Android
        if (Ext.browser.is.AndroidStock4 && Ext.os.version.getMinor() === 0) {
            firstChild = this.element.getFirstChild();

            if (firstChild) {
                firstChild.redraw();
            }
        }
    },

    onShow: function(me) {
        // Disable Tabbing only if tabbing is enabled
        if (me.sender && !me.tabbingDisabled) {
            me.sender.disableTabbing();
            me.tabbingDisabled = true;
        }
    },

    onTap: function(e) {
        this.fireEvent('tap', this, e);
    },

    updateTransparent: function(transparent) {
        this.toggleCls(this.baseCls + '-transparent', transparent);
    }
});
