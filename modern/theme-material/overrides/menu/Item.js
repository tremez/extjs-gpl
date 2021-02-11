Ext.define('Ext.theme.material.menu.Item', {
    override: 'Ext.menu.Item',

    config: {
        ripple: {
            delegate: '.' + Ext.baseCSSPrefix + 'body-el'
        }
    },

    shouldRipple: function() {
        var me = this,
            rippleDelay = me.el.rippleShowTimeout;

        // To delay menu hide(closing of menu) after menu item is clicked. RippleDelayis used to
        // show ripple effect on menu items. Max(clickHideDelay,rippleDelay) should be used
        me.clickHideDelay = me.clickHideDelay > rippleDelay ? me.clickHideDelay : rippleDelay;

        return this.getRipple();
    }
});
