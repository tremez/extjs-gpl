Ext.define('KitchenSink.model.Restaurant', {
    extend: 'KitchenSink.model.Base',

    requires: [
        'Ext.data.summary.Average'
    ],

    fields: [
        'name',
        'cuisine',
        {
            name: 'rating',
            summary: 'average'
        }
    ]
});
