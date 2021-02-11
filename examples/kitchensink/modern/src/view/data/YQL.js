/**
 * Demonstrates using YQL to fetch data from remote sources (in this case loading from the Sencha blog)
 */
Ext.define('KitchenSink.view.data.YQL', {
    extend: 'Ext.Panel',
    xtype: 'yql',
    controller: 'yql',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/data/YQLController.js'
    }],

    profiles: {
        defaults: {
            height: 400,
            width: 400
        },
        phone: {
            defaults: {
                height: undefined,
                width: undefined
            }
        }
    },
    //</example>

    bodyPadding: 10,
    height: '${height}',
    scrollable: true,
    width: '${width}',

    tbar: [{
        text: 'Load using YQL',
        handler: 'onLoad'
    }],

    items: [{
        xtype: 'component',
        reference: 'results'
    }]
});
