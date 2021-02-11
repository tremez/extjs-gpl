/**
 * This helper class is used to simplify managing state objects.
 *
 * @private
 * @since 6.7.0
 */
Ext.define('Ext.state.Builder', {
    constructor: function(parent, name) {
        var me = this;

        // We track the minimum amount of stuff and lazily determine our "data" property

        /**
         * @propery {String} name
         * The name of this child instance in its `parent`.
         */
        me.name = name || null;

        /**
         * @propery {Ext.state.Builder} parent
         * The parent of this instance.
         */
        me.parent = parent || null;

        /**
         * @propery {String} root
         * The top-most `parent` of this instance. If there is no `parent` then `root` will
         * be assigned to `this`.
         */
        me.root = parent ? parent.root : me;
    },

    /**
     * Create a child instance to lazily add data to this instance's state object.
     * @param {String} name
     * @return {Ext.state.Builder}
     */
    child: function(name) {
        return new this.self(this, name);
    },

    /**
     * Returns a property stored by the `set` method.
     *
     * @param {String} name The name of the desired property.
     */
    get: function(name) {
        var data = this.getData(/* create = false */),
            ret;

        if (data && data.$) {
            ret = data.$[name];
        }

        return ret;
    },

    /**
     * Remove the specified property from the state object.
     * @param {String} name
     */
    remove: function(name) {
        var data = this.getData(/* create = false */);

        if (data && data.$) {
            delete data.$[name];
        }
    },

    /**
     * Save a config property from the given instance if that config property is
     * `{@link Ext.state.Stateful#cfg!stateful stateful}`.
     *
     * @param {Ext.Base} instance
     * @param {String} name
     * @return {Ext.state.Builder} this
     */
    save: function(instance, name) {
        var me = this,
            cfg = instance.self.$config.configs[name],  // Configurator must exist by now
            value = instance[cfg.names.get](),
            statefulConfigs = instance.$statefulConfigs,
            save = statefulConfigs && statefulConfigs[name];

        if (!save && !cfg.equals(instance.config[name], value)) {
            statefulConfigs = statefulConfigs || (instance.$statefulConfigs = {});
            statefulConfigs[name] = save = true;
        }

        if (save) {
            // Allow the config property to control its fate:
            //
            //  config: {
            //      foo: {
            //          $value: null,
            //
            //          save: function (state, name, value, instance) {
            //              Ext.Assert.truthy(name === 'foo');
            //
            //              // This is the default behavior:
            //              state.set(name, value);
            //
            //              return false; // prevent default value save
            //          }
            //      }
            //  }
            //
            if (!cfg.save || cfg.save(me, name, value, instance) !== false) {
                me.set(name, value);
            }
        }

        return me;
    },

    /**
     * Set a state property or properties. This will lazily create the required sub-objects
     * to hold the value.
     *
     * @param {String|Object} name The name of the `value` or an object of name/value pairs.
     * @param [value] The value if `name` was a string, otherwise ignored.
     * @return {Ext.state.Builder} this
     */
    set: function(name, value) {
        var me = this,
            data = me.data,
            s;

        if (typeof name === 'string') {
            // Properties are stored in the $ sub-object to avoid collision with any
            // children names and to allow them to be cleanly lifted out as configs:
            if (value === undefined) {
                if (data) {
                    data = data.$;
                }

                if (data) {
                    delete data[name];
                }
            }
            else {
                data = data || me.getData(true);
                data = data.$ || (data.$ = {});

                data[name] = value;
            }
        }
        else {
            for (s in name) {
                me.set(s, name[s]);
            }
        }

        return me;
    },

    privates: {
        /**
         * @property {Object} data
         * The state object managed by this instance. This is lazily fetched from the
         * `parent` and/or created as needed. Properties are stored on a `$` sub-object of
         * this object while `child` data is stored by its `name`:
         *
         *      this.data = {
         *          $: {
         *              prop1: 0,
         *              prop2: 42
         *          },
         *          child1: {
         *              //...
         *          },
         *          //...
         *      };
         */
        data: null,

        /**
         * @property {String} id
         * The state id of the `owner` of this instance.
         */
        id: null,

        /**
         * @property {Ext.state.Stateful} owner
         * The owner of this instance.
         */
        owner: null,

        /**
         * Remove this object's data. If this state object has a parent, the data for this
         * sub-object will be removed from its parent.
         */
        clear: function() {
            var me = this,
                parent = me.parent,
                data = parent && parent.getData(/* create = false */);

            if (data) {
                delete data[me.name];
            }

            me.data = null;
        },

        /**
         * Returns the state object for this instance. This will recursively link `data`
         * into the `root.data` if it exists. It can also create the objects if desired.
         *
         * @param {Boolean} [create=false] Pass `true` to auto-create the state object.
         * @return {Object}
         */
        getData: function(create) {
            var me = this,
                parent = me.parent,
                data = me.data,
                name = me.name;

            if (!data) {
                if (parent) {
                    parent = parent.getData(create);

                    if (parent) {
                        if (!(data = parent[name] || null) && create) {
                            parent[name] = data = {};
                        }
                    }
                }
                else if (create) {
                    data = {};
                }

                me.data = data;
            }

            return data;
        }
    }
});
