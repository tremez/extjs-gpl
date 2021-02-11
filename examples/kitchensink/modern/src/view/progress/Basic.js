Ext.define('KitchenSink.view.progress.Basic', {
    extend: 'Ext.Container',
    xtype: 'progress-basic',

    requires: [
        'Ext.Progress'
    ],

    //<example>
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

    layout: 'center',

    items: [{
        xtype: 'progress',
        shadow: true,
        width: '${width}',
        text: 'Loading...',
        value: 0.5
    }]
});
