Ext.define('KitchenSink.view.touchevent.Pad', {
    extend: 'Ext.Container',
    xtype: 'toucheventpad',

    cls: 'touchpad',

    flex: 1,
    margin: 10,

    touchAction: {
        panX: false,
        panY: false,
        doubleTapZoom: false,
        pinchZoom: false
    },

    layout: {
        type: 'vbox',
        pack: 'center',
        align: 'stretch'
    },

    items: [{
        xtype: 'component',
        html: 'Touch here!'
    }]
});
