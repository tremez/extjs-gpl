Ext.define('KitchenSink.view.tip.MouseTrackToolTips', {
    extend: 'Ext.Container',
    xtype: 'mousetrack-tooltips',

    //<example>
    $preventContentSize: true,
    cls: 'demo-solid-background',
    //</example>

    padding: 20,

    layout: {
        type: 'vbox',
        pack: 'center'
    },

    defaultType: 'button',
    defaults: {
        minWidth: 150
    },

    autoSize: true,

    items: [{
        margin: '0 0 10',
        text: 'Track Mouse',
        tooltip: {
            html: 'This tip will follow the mouse while it is over the element',
            trackMouse: true
        }
    }, {
        margin: '10 0 0',
        text: 'Anchor with tracking',
        tooltip: {
            html: 'Following the mouse with an anchor',
            trackMouse: true,
            align: 't-b',
            anchor: true
        }
    }]
});
