Ext.define('Admin.view.main.Toolbar', {
    extend: 'Ext.Toolbar',
    xtype: 'maintoolbar',

    requires: [
        'Ext.Button',
        'Ext.Img',
        'Ext.SegmentedButton'
    ],

    items: [{
        // This component is moved to the floating nav container by the phone profile
        xtype: 'component',
        reference: 'logo',
        userCls: 'main-logo',
        html: 'Sencha'
    }, {
        ui: 'header',
        iconCls: 'x-fa fa-bars',
        margin: '0 0 0 10',
        listeners: {
            tap: 'onToggleNavigationSize'
        }
    }, '->', {
        xtype: 'segmentedbutton',
        reference: 'toolkitSwitch',
        margin: '0 16 0 0',
        platformConfig: {
            phone: {
                hidden: true
            }
        },
        items: [{
            width: 35,
            value: 'classic',
            iconCls: 'x-fa fa-desktop',
            handler: 'onSwitchToClassic'
        }, {
            value: 'modern',
            iconCls: 'x-fa fa-tablet',
            pressed: true
        }]
    }, {
        ui: 'header',
        iconCls: 'x-fa fa-search',
        href: '#searchresults',
        margin: '0 7 0 0',
        handler: 'toolbarButtonClick'
    }, {
        ui: 'header',
        iconCls: 'x-fa fa-envelope',
        href: '#email',
        margin: '0 7 0 0',
        handler: 'toolbarButtonClick'
    }, {
        ui: 'header',
        iconCls: 'x-fa fa-question',
        href: '#faq',
        margin: '0 7 0 0',
        handler: 'toolbarButtonClick'
    }, {
        ui: 'header',
        iconCls: 'x-fa fa-th-large',
        href: '#dashboard',
        margin: '0 7 0 0',
        handler: 'toolbarButtonClick'
    }, {
        xtype: 'component',
        html: 'Goff Smith',
        margin: '0 12 0 4',
        userCls: 'main-user-name'
    }, {
        xtype: 'image',
        userCls: 'main-user-image small-image circular',
        alt: 'Current user image',
        src: '<shared>/images/user-profile/2.png'
    }]
});
