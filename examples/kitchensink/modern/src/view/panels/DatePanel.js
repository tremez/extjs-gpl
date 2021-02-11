Ext.define('KitchenSink.view.panels.DatePanel', {
    extend: 'Ext.Container',
    xtype: 'panel-date',

    requires: [
        'Ext.panel.Date',
        'Ext.layout.Center'
    ],

    //<example>
    shadow: false,
    //</example>

    height: '100%',
    width: '100%',
    layout: 'center',
    scrollable: true,

    items: [{
        xtype: 'datepanel',
        shadow: true
    }]
});
