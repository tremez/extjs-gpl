/**
 * This class is used to display instances of a data item in an input area. For example,
 * email addresses.
 *
 * To represent {@link Ext.data.Store Stores} of {@link Ext.data.Model records} using Chips,
 * see the {@link Ext.dataview.ChipView} class.
 *
 * @since 6.7.0
 */
Ext.define('Ext.Chip', {
    extend: 'Ext.Component',
    xtype: 'chip',

    /**
     * @property {Boolean} isChip
     * `true` in this class to identify an object this type, or subclass thereof.
     * @readonly
     */
    isChip: true,

    focusable: false,
    tabIndex: null,

    classCls: Ext.baseCSSPrefix + 'chip',
    hasIconCls: Ext.baseCSSPrefix + 'has-icon',
    closableCls: Ext.baseCSSPrefix + 'closable',

    element: {
        reference: 'element',
        children: [{
            reference: 'bodyElement',
            cls: Ext.baseCSSPrefix + 'body-el',
            children: [{
                reference: 'iconElement',
                cls: Ext.baseCSSPrefix + 'icon-el ' + Ext.baseCSSPrefix + 'font-icon'
            }, {
                reference: 'textElement',
                cls: Ext.baseCSSPrefix + 'text-el'
            }, {
                reference: 'closeElement',
                cls: Ext.baseCSSPrefix + 'close-el ' + Ext.baseCSSPrefix + 'font-icon',
                listeners: {
                    click: 'onClick'
                }
            }]
        }]
    },

    config: {
        /**
         * @cfg {String} icon
         * Url to the icon image to use if you want an icon to appear on ths chip.
         * See {@link Ext#resolveResource} for details on locating application resources.
         */
        icon: false,

        /**
         * @cfg {String} iconCls
         * The CSS class to apply to the icon on this chip.
         */
        iconCls: null,

        /**
         * @cfg {String} text
         * The text to display in the chip. Mutually exclusive with the
         * {@link #cfg!displayField} config.
         */
        text: null,

        /**
         * @cfg {Boolean} [closable=false]
         * Configure as `true` to show a close icon in the chip.
         */
        closable: null,

        /**
         * @cfg {Function/String} closeHandler
         * @param {Ext.Chip} closeHandler.chip This Chip.
         * @param {Ext.event.Event} closeHandler.e The triggering event.
         * The handler function to run when the close tool is tapped.
         */
        closeHandler: null,

        /**
         * @cfg {Object} scope
         * The scope (`this` reference) in which the configured {@link #closeHandler} will
         * be executed, unless the scope is a ViewController method name.
         * @accessor
         */
        scope: null
    },

    defaultBindProperty: 'text',

    onClick: function(e) {
        var me = this,
            handler = me.getCloseHandler();

        Ext.callback(handler, me.getScope(), [me, e], 0, me);
    },

    applyIcon: function(icon) {
        return Ext.resolveResource(icon);
    },

    updateClosable: function(closable) {
        this.el.toggleCls(this.closableCls, closable);
    },

    updateIcon: function(icon) {
        var me = this,
            iconEl = me.iconElement,
            hasIconCls = me.hasIconCls;

        if (icon) {
            iconEl.setStyle('background-image', 'url(' + icon + ')');
            me.addCls(hasIconCls);
        }
        else {
            iconEl.setStyle('background-image', '');

            if (!me.getIconCls()) {
                me.removeCls(hasIconCls);
            }
        }
    },

    updateIconCls: function(iconCls, oldIconCls) {
        this.iconElement.replaceCls(oldIconCls, iconCls);
        this.el.toggleCls(this.hasIconCls, !!iconCls);
    },

    updateText: function(text) {
        this.textElement.setHtml(Ext.htmlEncode(text));
    }
});
