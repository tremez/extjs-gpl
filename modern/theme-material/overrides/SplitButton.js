Ext.define('Ext.theme.material.SplitButton', {
    override: 'Ext.SplitButton',

    /**
     * @private
     * @cfg {Number/Boolean} menuShowDelay
     * The amount of delay between the `tap` or `onClick` and the moment the
     * split menu button shows the menu.
     */

    config: {
        splitRipple: {
            delegate: '.x-splitInner-el'
        },

        arrowRipple: {
            delegate: '.x-splitArrow-el'
        }
    },

    menuShowDelay: 0,

    doDestroy: function() {
        var me = this;

        if (me.hasOwnProperty('menuShowTimeout')) {
            Ext.undefer(me.menuShowTimeout);
        }

        me.callParent();
    }
});
