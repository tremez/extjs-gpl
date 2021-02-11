/**
 * A mixin for being able to save the state of an object to a {@link Ext.state.Provider}.
 *
 * To initialize a state provider, do the following:
 *
 *      Ext.state.Provider.register(new Ext.state.LocalStorage());
 *
 * In addition to registered a state provider, an `id` or {@link #stateId `stateId`} must
 * be assigned to enable a component to save its state. This id is used as the key under
 * which stateful properties are stored. Auto-generated `id` properties do not qualify in
 * this case.
 *
 * Finally, the `stateful` config is used to specify which configs should be saved and
 * restored.
 *
 * @since 6.7.0
 */
Ext.define('Ext.state.Stateful', function(Stateful) { return { // eslint-disable-line brace-style
    extend: 'Ext.Mixin',

    requires: [
        'Ext.state.Provider'
    ],

    mixinConfig: {
        id: 'state',

        // Ensure our configs are defined on the classes into which we are mixed even if
        // they have that property already. Without this any class that mixed in this class
        // would be unable to specify `stateful` or other configs.
        configs: true,

        before: {
            destroy: '_flushStateful'
        },

        mixed: function(targetClass) {
            targetClass.addConfigTransform('transformStatefulConfig', 20);
        }
    },

    isStateful: true,

    config: {
        /**
         * @cfg {Boolean/Object/String[]} [stateful=false]
         *
         * This config specifies the config properties that will be persisted using the
         * {@link Ext.state.Provider state provider}. If this config is set to `true`, the
         * configs specified by `statefulDefaults` will be assumed.
         *
         *      stateful: true
         *
         * Otherwise, this config can be an array of strings of the properties to save:
         *
         *      stateful: [
         *          'width',
         *          'height',
         *          'collapsed'
         *      ]
         *
         * The above is equivalent to:
         *
         *      stateful: {
         *          width: true,
         *          height: true,
         *          collapsed: true
         *      }
         *
         * **Note:** To be truly stateful, an `id` or `stateId` must also be assigned.
         *
         * A stateful object will save its state when any of these config properties change
         * value.
         */
        stateful: {
            $value: null,

            merge: function(newValue, oldValue) {
                if (newValue === true) {
                    return oldValue || newValue;
                }

                if (!newValue) {
                    return false;
                }

                return this.mergeSets(newValue, oldValue);
            }
        },

        /**
         * @cfg {Object/String[]} statefulDefaults
         * The default set of {@link #cfg!stateful} properties. The form of this config
         * is the same as {@link #cfg!stateful} except this config cannot be a Boolean.
         *
         * This config is intended for classes to specify so that instances can simply
         * enable statefulness using `stateful: true`.
         * @protected
         */
        statefulDefaults: {
            $value: null,

            cached: true,

            merge: function(newValue, oldValue) {
                return this.mergeSets(newValue, oldValue);
            }
        },

        /**
         * @cfg {String} stateId
         * The unique id for this object to use for state management purposes.
         */
        stateId: null
    },

    /**
     * This method allows a class to specify an owning stateful object. This is used by
     * {@link Ext.plugin.Abstract plugins} to save their state as part of their owning
     * {@link Ext.Component component}.
     *
     * The return value can be either a `Stateful` object or an array whose first element is
     * a `Stateful` object. This object's state will be stored inside the state object of
     * the returned `Stateful` object. If an array is returned, the elements beyond the first
     * are sub-keys in the state object.
     *
     * For example, {@link Ext.plugin.Abstract plugins} implement this method like so:
     *
     *      getStatefulOwner: function() {
     *          return [ this.cmp, 'plugins' ];
     *      }
     *
     * The effect of this is to produce a state object like so:
     *
     *      {
     *          plugins: {
     *              pluginId1: {
     *                  //...
     *              }
     *          }
     *      }
     *
     * In order for a child object's state to be saved and restored, all of its parents must
     * also be stateful (i.e., have a `stateId`).
     *
     * @method getStatefulOwner
     * @return {Ext.state.Stateful|Array}
     * @private
     */
    getStatefulOwner: Ext.emptyFn,

    /**
     * This method is called to load state from the provided `state` builder. This method
     * should return the config properties loaded from `state`.
     *
     * This method, like `saveState`, can be overridden by derived classes:
     *
     *      loadState: function(state) {
     *          var ret = this.callParent([ state ]);
     *
     *          if (ret.foo) {
     *              // use custom data...
     *
     *              delete ret.foo;  // remove it since it isn't a config
     *          }
     *
     *          return ret;
     *      }
     *
     * When overriding this method, it is also likely necessary to override `saveState`.
     *
     * @param {Ext.state.Builder} state
     * @param {Object} stateful The stateful properties as an object keyed by config name.
     * @return {Object}
     * @private
     */
    loadState: function(state, stateful) {
        var props = stateful && state.data,
            name, ret;

        props = props && props.$;  // we want only this object's properties

        if (props) {
            for (name in stateful) {
                if (stateful[name] && (name in props)) {
                    (ret || (ret = {}))[name] = props[name];
                }
            }
        }

        return ret;
    },

    /**
     * Saves the current state of this object to the provided `state` builder. By default
     * this method saves the configs specified as `stateful`.
     *
     * This method can also be overridden by subclasses to store custom data directly to
     * the `state` builder:
     *
     *      saveState: function(state) {
     *          this.callParent([ state ]);
     *
     *          state.set('foo', 42);
     *      }
     *
     * When overriding this method, it is also likely necessary to override `loadState`.
     *
     * @param {Ext.state.Builder} state The state builder to which to save state.
     * @param {Object} stateful The stateful properties as an object keyed by config name.
     * @private
     */
    saveState: function(state, stateful) {
        var me = this,
            name;

        if (stateful) {
            for (name in stateful) {
                state.save(me, name);
            }
        }
    },

    //---------------------------------------------------------------------------
    // Configs

    // stateful

    applyStateful: function(stateful, was) {
        var me = this,
            ret = false,
            handler = 'onStatefulChange',
            watcher = (stateful || was) && me.getConfigWatcher(),
            defaults = me.isConfiguring,
            name, on;

        if (stateful) {
            // Direct calls to setStateful() won't be processed by our merge() method
            // so we have to handle those cases here...
            if (stateful === true) {
                ret = {};
                defaults = true;
            }
            else if (typeof stateful === 'string') {
                ret = {};
                ret[stateful] = true;
            }
            else if (Ext.isObject(stateful)) {
                ret = stateful;
            }
            else {
                ret = Ext.Array.toMap(stateful);
            }

            defaults = defaults && me.getStatefulDefaults();

            if (defaults) {
                ret = Ext.merge({}, defaults, ret);
            }

            was = was || {};

            for (name in ret) {
                on = ret[name];

                if (!on !== !was[name]) {
                    watcher[on ? 'on' : 'un'](name, handler, me);

                    if (on) {
                        was[name] = true;
                    }
                    else {
                        delete was[name];
                    }
                }
            }

            ret = Ext.Object.isEmpty(was) ? false : was;
        }
        else if (was) {
            for (name in was) {
                watcher.un(name, handler, me);
            }
        }

        return ret;
    },

    //---------------------------------------------------------------------------
    privates: {
        statics: {
            /**
             * @property {String[]} _configNames
             * The names of the configs that need to be available to `transformInstanceConfig`.
             * @private
             */
            _configNames: [
                'stateful',
                'stateId'
            ]
        },

        /**
         * This method is called before `destroy` to ensure that this instance's `stateful`
         * properties are saved to persistent storage. Since this object is about to be
         * destroyed, this cannot be delayed.
         * @private
         */
        _flushStateful: function() {
            if (this.$saveStatePending) {
                // eslint-disable-next-line vars-on-top
                var provider = Ext.state.Provider.get();

                if (provider && provider.isSaveStatePending) {
                    provider.flushSaveState();
                }
            }
        },

        /**
         * Creates a state builder to access or edit this instance's state object. If this
         * instance has a `{@link #method!getStatefulOwner statefulOwner}`, the returned
         * builder will have a `parent` reference that owner's state builder. This can be
         * an arbitrarily deep chain but does proceed all the way up to the root instance
         * (with no owner) since that is the instance that determines the ultimate state
         * storage key.
         * @param {Boolean} [cache=false] Pass `true` to return a cached builder.
         * @return {Ext.state.Builder}
         * @private
         */
        getStateBuilder: function(cache) {
            var me = this,
                id = me._getStateId(),
                ret = (cache && me.$state) || null,
                // No need to check for a provider if we don't have an id
                provider = id && Ext.state.Provider.get(),
                n, owner, statefulOwner;

            // If we don't have a provider, then nothing is stateful...
            if (provider && !ret) {
                if (!(statefulOwner = me.getStatefulOwner())) {
                    ret = new Ext.state.Builder();

                    // When we are creating the root for our cached builder, we also read
                    // the data from storage.
                    if (cache) {
                        ret.data = provider.get(id);
                    }
                }
                else {
                    if (!(owner = statefulOwner).isStateful) {
                        owner = statefulOwner[0];
                        n = 1;
                    }

                    ret = owner.getStateBuilder(cache);

                    if (ret) {
                        // chase down the set of sub-keys
                        for (; n && n < statefulOwner.length; ++n) {
                            ret = ret.child(statefulOwner[n]);
                        }

                        // Our stateId is the final step in the chain:
                        ret = ret.child(id);
                    }
                }

                if (ret) {
                    ret.owner = me;
                    ret.id = id;
                }

                // Once we save state we need to remove the cached copy:
                me.$state = cache ? ret : null;
            }

            return ret;
        },

        /**
         * Returns the state id for this object.
         * @return {String} The `stateId` or the configured `id`.
         * @private
         */
        _getStateId: function() {
            var me = this,
                id = me.getStateId();

            me._getStateId = me.getStateId;   // don't come back here

            if (!id) {
                id = me.id || me.getId();

                if (me.autoGenId) {
                    id = null;
                }
                else {
                    me.setStateId(id);
                }
            }

            return id;
        },

        /**
         * This method is called when any of the `stateful` configs are modified.
         * @private
         */
        onStatefulChange: function() {
            var me = this;

            if (!me.destroying && me._getStateId()) {
                Ext.state.Provider.get().save(me);
            }
        },

        /**
         * Saves the state of this instance to the persistence store. This method is called
         * by the {@link Ext.state.Provider state provider} when it is ready to save state
         * to storage.
         * @private
         */
        persistState: function() {
            var me = this,
                state = me.getStateBuilder(),
                id, provider, root;

            if (state) {
                provider = Ext.state.Provider.get();
                root = state.root;
                id = root.id;

                if (state.parent) {
                    root.data = provider.get(id);
                    state.clear();
                }

                me.saveState(state, me.getStateful());

                // We need to save state even if it is null since it may need to erase
                // the previously saved (non-null) state.
                provider.set(id, root.data);
            }
        },

        /**
         * Returns this instance's state object from the persistence store. This object
         * should contain config properties.
         * @return {Object}
         * @private
         */
        readStateObject: function() {
            var me = this,
                state = me.getStateBuilder(/* cache= */true),
                ret;

            if (state) {
                state.getData(/* create = false */);
                ret = me.loadState(state, me.getStateful());
            }

            return ret || null;
        },

        /**
         * This method is called internally by `initConfig` to apply whatever changes are
         * needed from persistent storage.
         *
         * @param {Object} instanceConfig The base config object
         * @param {Ext.Configurator} configurator
         * @return {Object} The config object to use.
         * @private
         */
        transformStatefulConfig: function(instanceConfig, configurator) {
            var me = this,
                ret = instanceConfig,
                saved, name, state, stateful;

            // Ensure that `stateful` and `stateId` configs are ready to be pulled:
            if (configurator.hoistConfigs(me, instanceConfig, Stateful._configNames)) {
                state = me.readStateObject();

                if (state) {
                    stateful = me.getStateful();
                    saved = {};

                    // We could have properties in previously saved state that are no
                    // longer stateful, so strip them out. Any that we keep, we need to
                    // track so that we save them next time. Once the user takes control
                    // of a config, the developer's initial config should no longer be
                    // relevant since the user should stay in control (also we lose the
                    // initial config here anyway).
                    for (name in state) {
                        if (stateful[name]) {
                            saved[name] = true;
                        }
                        else {
                            delete state[name];
                        }
                    }

                    state = Ext.Object.isEmpty(state) ? null : state;
                    me.$statefulConfigs = state && saved;
                }

                if (state) {
                    ret = configurator.merge(me, ret, state, /* clone= */true);
                }
                else {
                    ret = Ext.apply({}, ret);
                }

                // Since we have processed these we remove them from the instanceConfig
                // that will be used for the rest of initConfig:
                delete ret.stateful;
                delete ret.stateId;
            }

            return ret;
        }
    }
};
});
