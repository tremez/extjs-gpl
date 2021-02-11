/**
 * A mixin that adds `dirty` config and `dirtychange` event to a component (typically a
 * `field` or `form`).
 * @private
 * @since 7.0
 */
Ext.define('Ext.field.Dirty', {
    extend: 'Ext.Mixin',

    /**
     * @event dirtychange
     * Fires when a change in the component's {@link #cfg-dirty} state is detected.
     *
     * For containers, this event will be fired on a short delay in some cases.
     *
     * @param {Ext.Component} this
     * @param {Boolean} dirty True if the component is now dirty.
     * @since 7.0
     */

    mixinConfig: {
        id: 'dirtyfield',

        after: {
            _fixReference: 'fixDirtyState'
        }
    },

    config: {
        /**
         * @cfg {Boolean} bubbleDirty
         * Set to `false` to disable dirty states affecting ancestor containers such as
         * `fieldpanel` or `formpanel`. The dirty state of such containers is based on the
         * presence of dirty descendants. In some cases, however, it may be desired to
         * hide the dirty state of one of these containers from its ancestor containers.
         * @since 7.0
         */
        bubbleDirty: true,

        /**
         * @cfg {Boolean} dirty
         * This config property describes the modified state of this component. In most
         * cases this config's value is maintained by the component and should be considered
         * readonly. The class implementor should be the only one to call the setter.
         *
         * For containers, this config will be updated on a short delay in some cases.
         * @since 7.0
         */
        dirty: {
            lazy: true,

            $value: false
        }
    },

    dirty: false,

    _childDirtyState: null,

    /**
     * This method is called by descendants that use this mixin when their `dirty` state
     * changes.
     * @param {Boolean} dirty The dirty state of the descendant component.
     * @private
     */
    adjustChildDirtyCount: function(dirty) {
        var me = this,
            childDirtyState = me._childDirtyState;

        if (childDirtyState) {
            // Once a hierarchy change occurs, our childDirtyState is nulled out, so we
            // just wait for the fixup pass.
            if (childDirtyState.ready) {
                childDirtyState.counter += dirty ? 1 : -1;

                me.setDirty(!!childDirtyState.counter);
            }
            else if (dirty) {
                // When a parent (this object) is not ready, we simply count the number
                // of dirty children. We are presently between calls of beginSyncChildDirty
                // and finishSyncChildDirty.
                ++childDirtyState.counter;
            }
        }
    },

    /**
     * This method is called when the component hierarchy has changed and the current set
     * of descendants will be reasserting their `dirty` state. This method is only called
     * on `nameHolder` containers.
     * @private
     */
    beginSyncChildDirty: function() {
        this._childDirtyState = { counter: 0, ready: false };
    },

    /**
     * This method is called when the component hierarchy has changed after the current set
     * of descendants has reasserted their `dirty` state. This method is only called on
     * `nameHolder` containers.
     * @private
     */
    finishSyncChildDirty: function() {
        var me = this,
            childDirtyState = me._childDirtyState,
            dirty = !!childDirtyState.counter;

        if (dirty !== me.dirty) {
            me.setDirty(dirty);
        }
        else if (dirty) {
            me.informParentDirty(dirty);
        }

        childDirtyState.ready = true;
    },

    /**
     * @private
     */
    fireDirtyChange: function() {
        this.fireEvent('dirtychange', this, this.dirty);
    },

    /**
     * This method is called after `_fixReference()` during the reference sync sweep. We
     * need to inform our parent if we are a leaf component and if we are dirty. If we are
     * a `nameHolder` then we'll inform the parent in `finishSyncChildDirty`.
     * @private
     */
    fixDirtyState: function() {
        var me = this;

        if (!me._childDirtyState && me.dirty) {
            me.informParentDirty(true);
        }
    },

    informParentDirty: function(dirty) {
        var me = this,
            parent = me.getBubbleDirty() && me.lookupNameHolder(),
            childDirtyState = me._childDirtyState,
            parentChildDirtyState = parent && parent._childDirtyState;

        if (parentChildDirtyState) {
            if (childDirtyState) {
                // Four possible states:
                //
                //                   Parent
                //    Child      !ready  ready
                //     !ready       1      2
                //     ready        3      4
                //
                // 1. Neither parent nor child are ready. This happens when the child
                //    is the first to receive finishSyncChildDirty and its updateDirty
                //    get tickled. The parent is still counting its dirty children, so
                //    the child just sends up its dirty state.
                // 2. The parent is ready but not the child. This happens when the child
                //    receives the finishSyncChildDirty after the parent. In this case,
                //    we do not want to inform the parent of a transition to !dirty since
                //    it would decrement its counter.
                // 3. The child has changed dirty state after finishSyncChildDirty was
                //    called (maybe from a grandchild hitting case 2) but the parent has
                //    not received finishSyncChildDirty. As with case 1, just inform.
                // 4. Normal ready state, so just inform.

                if (!childDirtyState.ready && parentChildDirtyState.ready) { // case 2
                    if (!dirty) {
                        return;
                    }
                }
            }
            // else the child is not a container/nameHolder (it has no children), so
            // we always inform the parent...

            parent.adjustChildDirtyCount(dirty, me);
        }
    },

    invalidateChildDirty: function() {
        this._childDirtyState = null;
    },

    isDirty: function() {
        // This method is intended for containers of fields. Ext.field.Field has its
        // own isDirty that is designed to handle value-possessing components.
        if (Ext.referencesDirty) {
            Ext.fixReferences();
        }

        return this.getDirty();
    },

    updateDirty: function(dirty) {
        var me = this;

        me.dirty = dirty;

        if (!me.isDirtyInitializing) {
            if (me.fireEvent) {
                me.fireDirtyChange();
            }

            me.informParentDirty(dirty);
        }
    }
});
