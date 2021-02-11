/**
 * This is the base class for state provider implementations. The provider is responsible
 * for storing values to and retrieving values from the underlying data storage. The base
 * class implements the in-memory storage. Derived classes (e.g., `Ext.state.LocalStorage`)
 * handle persistent storage.
 *
 * It is important to note that this API is synchronous. State data must be available when
 * needed by {@link Ext.state.Stateful stateful} objects.
 * @since 6.7.0
 */
Ext.define('Ext.state.Provider', function(Provider) { return { // eslint-disable-line brace-style
    mixins: [
        'Ext.mixin.Bufferable'
    ],

    requires: [
        'Ext.util.Bag',
        'Ext.GlobalEvents'
    ],

    statics: {
        /**
         * Returns the {@link #register registered} provider instance.
         * @return {Ext.state.Provider}
         */
        get: function() {
            return Provider._default;
        },

        /**
         * Registers the default state provider.
         * @param {Ext.state.Provider} provider The new default state provider.
         */
        register: function(provider) {
            var was = Provider._default;

            if (was !== provider) {
                Provider._default = provider;

                if (provider) {
                    provider.global = true;
                }

                if (was) {
                    was.global = false;
                }

                if (Ext.hasListeners.stateproviderchange) {
                    Ext.fireEvent('stateproviderchange', provider, was);
                }
            }
        }
    },

    bufferableMethods: {
        // We don't immediately save to storage on each stateful update.
        saveState: 50
    },

    constructor: function(config) {
        this.queue = new Ext.util.Bag();
        this.state = {};

        this.initConfig(config);
    },

    /**
     * Clears all state data.
     */
    clear: function() {
        var me = this;

        me.cancelSaveState();
        me.queue.clear();
        me.state = {};
    },

    /**
     * Returns the current value for a key
     * @param {String} name The key name
     * @param {Object} defaultValue A default value to return if the key's value is not found
     * @return {Object} The state data
     */
    get: function(name, defaultValue) {
        var ret = this.state[name];

        return ret === undefined ? defaultValue : ret;
    },

    /**
     * Removes a value from the state. This is the same as calling:
     *
     *      provider.set(name, null);
     *
     * @param {String} name The key name
     */
    remove: function(name) {
        return this.set(name, null);
    },

    /**
     * Sets the value for a key.
     *
     * @param {String} name The key name
     * @param {Mixed} value The value to set. If `null`, the key is removed.
     */
    set: function(name, value) {
        var me = this,
            state = me.state,
            looper = name;

        if (typeof name === 'string') {
            looper = {};
            looper[name] = value;
        }

        for (name in looper) {
            value = looper[name];

            if (value == null) {
                delete state[name];
                value = null;
            }
            else {
                state[name] = value;
            }
        }
    },

    /**
     * Decodes the given string value (formerly produced by {@link #encodeValue}. This
     * method is used to deserialize values from storage.
     *
     * @param {String} value
     * @return {Mixed}
     * @protected
     */
    decodeValue: function(value) {
        return Ext.decode(value);
    },

    /**
     * Encodes the given value as a string. This method is used by {@link #method!set} to
     * serialize values for storage.
     * @param {Mixed} value
     * @return {String}
     * @protected
     */
    encodeValue: function(value) {
        return Ext.encode(value);
    },

    privates: {
        doSave: function(stateful) {
            stateful.$saveStatePending = false;
            stateful.persistState();
        },

        doSaveState: function() {
            var me = this,
                queue = me.queue;

            queue.each(me.doSave, me);
            queue.clear();
        },

        /**
         *
         * @param {Ext.state.Stateful} stateful
         */
        save: function(stateful) {
            //<debug>
            if (stateful.destroyed || stateful.destroying) {
                Ext.raise('Cannot save state of instance during or after destroy');
            }
            //</debug>

            stateful.$saveStatePending = true;
            this.queue.add(stateful);
            this.saveState(); // buffered method
        }
    }

};
}, function(Provider) {
    Provider.register(new Provider());
});
