Ext.define('KitchenSink.view.phone.touchevent.Events', {
    extend: 'Ext.Container',
    xtype: 'phone-touch-events',
    controller: 'phone-touch-events',

    requires: [
        'KitchenSink.view.phone.touchevent.EventsController',
        'KitchenSink.view.touchevent.Info',
        'KitchenSink.view.touchevent.Pad'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/phone/touchevent/EventsController.js'
    }, {
        type: 'Info',
        path: 'modern/src/view/touchevent/Info.js'
    }, {
        type: 'Pad',
        path: 'modern/src/view/touchevent/Pad.js'
    }],
    //</example>

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'toucheventpad',
        flex: 1,
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
    }, {
        xtype: 'toucheventinfo',
        reference: 'info',
        flex: 1
    }]
});
