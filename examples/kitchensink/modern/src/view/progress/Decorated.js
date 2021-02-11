Ext.define('KitchenSink.view.progress.Decorated', {
    extend: 'Ext.Container',
    xtype: 'progress-decorated',
    controller: 'progress-decorated',

    viewModel: {
        type: 'progress-decorated'
    },

    requires: [
        'Ext.Progress',
        'KitchenSink.view.progress.DecoratedController',
        'KitchenSink.view.progress.DecoratedModel'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/progress/DecoratedController.js'
    }, {
        type: 'Model',
        path: 'modern/src/view/progress/DecoratedModel.js'
    }],

    profiles: {
        defaults: {
            width: '75%'
        },
        phone: {
            defaults: {
                width: '95%'
            }
        }
    },

    shadow: false,
    //</example>

    layout: {
        type: 'vbox',
        pack: 'center',
        align: 'center'
    },

    items: [{
        xtype: 'progress',
        shadow: true,
        width: '${width}',
        bind: {
            text: 'Loading {word} {itemPercent}%',
            value: '{progress}'
        }
    }, {
        xtype: 'component',
        margin: '20 0 10',
        bind: 'Loading {word} {itemPercent}%'
    }, {
        xtype: 'progress',
        shadow: true,
        width: '${width}',
        bind: '{progress}'
    }]
});
