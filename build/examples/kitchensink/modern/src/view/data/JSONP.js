/**
 * Demonstrates how to issue JSON-P request to fetch weather data from a web API
 */
Ext.define('KitchenSink.view.data.JSONP', {
    extend: 'Ext.Panel',
    xtype: 'jsonp',
    controller: 'jsonp',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/data/JSONPController.js'
    }],

    profiles: {
        defaults: {
            minHeight: 300,
            width: 400
        },
        phone: {
            defaults: {
                minHeight: undefined,
                width: undefined
            }
        }
    },
    //</example>

    minHeight: '${minHeight}',
    scrollable: true,
    width: '${width}',
    autoSize: true,

    tbar: [{
        text: 'Load using JSON-P',
        handler: 'onLoad'
    }],

    items: [{
        xtype: 'component',
        reference: 'results'
    }]
});
