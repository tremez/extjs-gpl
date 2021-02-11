/**
 * Presents a large touch zone and reports all of the touch 
 * events fired when the user interacts with it
 */
Ext.define('KitchenSink.view.touchevent.Events', {
    extend: 'Ext.Container',
    xtype: 'touch-events',
    controller: 'touch-events',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/touchevent/EventsController.js'
    }, {
        type: 'Info',
        path: 'modern/src/view/touchevent/Info.js'
    }, {
        type: 'Pad',
        path: 'modern/src/view/touchevent/Pad.js'
    }],

    shadow: false,
    //</example>

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'container',
        reference: 'info',
        flex: 1,
        margin: 8,
        shadow: true,
        layout: {
            type: 'vbox'
        },
        items: [{
            xtype: 'toucheventinfo',
            flex: 1
        }]
    }, {
        xtype: 'toucheventpad',
        flex: 1,
        shadow: true,
        listeners: {
            element: 'element',
            touchstart: 'onTouchPadEvent',
            touchend: 'onTouchPadEvent',
            touchmove: 'onTouchPadEvent',
            swipe: 'onTouchPadEvent',
            dragstart: 'onTouchPadEvent',
            drag: 'onTouchPadEvent',
            dragend: 'onTouchPadEvent',
            tap: 'onTouchPadEvent',
            singletap: 'onTouchPadEvent',
            doubletap: 'onTouchPadEvent',
            longpress: 'onTouchPadEvent',
            pinch: 'onTouchPadEvent',
            rotate: 'onTouchPadEvent'
        }
    }]
});
