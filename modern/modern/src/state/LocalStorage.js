/**
 * A Provider implementation based on the HTML5 `localStorage` API.
 * @since 6.7.0
 */
Ext.define('Ext.state.LocalStorage', {
    extend: 'Ext.state.Provider',
    requires: [
        'Ext.util.LocalStorage'
    ],

    config: {
        /**
         * @cfg {Ext.util.LocalStorage} storage
         * The storage to use. The default settings rarely need adjusting.
         */
        storage: {
            id: 'ext-state'
        }
    },

    applyStorage: function(config) {
        return config && new Ext.util.LocalStorage(config);
    },

    updateStorage: function(storage) {
        if (storage) {
            // eslint-disable-next-line vars-on-top
            var state = this.state = {}, // start over...
                keys = storage.getKeys(),
                i, key;

            for (i = 0; i < keys.length; ++i) {
                key = keys[i];
                state[key] = this.decodeValue(storage.getItem(key));
            }
        }
    },

    clear: function() {
        this.getStorage().clear();
        this.callParent();
    },

    set: function(name, value) {
        var me = this,
            storage = me.getStorage();

        me.callParent([ name, value ]);

        if (value == null) { // undefined || null
            storage.removeItem(name);
        }
        else {
            storage.setItem(name, me.encodeValue(value));
        }
    }
});
