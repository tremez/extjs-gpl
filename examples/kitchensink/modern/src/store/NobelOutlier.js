Ext.define('KitchenSink.store.NobelOutlier', {
    extend: 'Ext.data.Store',
    alias: 'store.nobel-outlier',

    fields: [ 'field', 'age' ],

    data: [{
        field: 'medicine',
        age: 87
    }, {
        field: 'peace',
        age: 17
    }]
});
