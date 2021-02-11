/**
 * This class is a custom toolbar intended for use as a BioTile footer.
 */
Ext.define('Admin.view.widgets.SocialBar', {
    extend: 'Ext.Toolbar',
    xtype: 'socialbar',
    border: false,

    layout: {
        pack: 'center'
    },

    defaults: {
        border: false,
        margin: '2 3'
    },

    items: [{
        ui: 'facebook',
        iconCls: 'x-fab fa-facebook',
        handler: 'onContactFacebook'
    }, {
        ui: 'soft-cyan',
        iconCls: 'x-fab fa-twitter',
        handler: 'onContactTwitter'
    }, {
        ui: 'soft-red',
        iconCls: 'x-fab fa-google-plus',
        handler: 'onContactGooglePlus'
    }, {
        ui: 'soft-purple',
        iconCls: 'x-fa fa-envelope',
        handler: 'onContactEmail'
    }]
});
