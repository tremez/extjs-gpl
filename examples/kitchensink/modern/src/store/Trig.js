Ext.define('KitchenSink.store.Trig', {
    extend: 'Ext.data.Store',
    alias: 'store.trig',

    fields: [ 'x', 'sin', 'cos' ],

    constructor: function(config) {
        // Create data in construct time instead of defining it
        // on the prototype, so that each example that's using
        // this store works on its own set of data.
        var data = [],
            increment = Math.PI / 18,
            k = 10,
            a = 0,
            i, ln;

        config = config || {};

        for (i = 0, ln = 100; i < ln; i++) {
            data.push({
                x: a,
                sin: k * Math.sin(a),
                cos: k * Math.cos(a)
            });
            a += increment;
        }

        config.data = data;

        this.callParent([config]);
    }

});
