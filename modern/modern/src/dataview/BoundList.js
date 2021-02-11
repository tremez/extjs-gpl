/**
 * @private
 * Class used to display popup selection lists bound to fields.
 *
 * A BoundList is not focusable, has no `focusEl`, and has no `tabIndex` stamped into it.
 *
 * Its keyboard events are provided by its owning field, referenced by its `ownerCmp`, and
 * the `BoundListNavigationModel` uses the field as the key event source.
 */
Ext.define('Ext.dataview.BoundList', {
    extend: 'Ext.dataview.List',
    xtype: 'boundlist',
    requires: [
        'Ext.dataview.BoundListNavigationModel'
    ],

    tabIndex: null,
    focusEl: null,
    focusable: false,
    itemsFocusable: false,
    navigationModel: {
        type: 'boundlist'
    },
    itemConfig: {
        cls: Ext.baseCSSPrefix + 'boundlistitem',
        tools: {
            selected: {
                zone: 'start',
                passive: true,
                cls: Ext.baseCSSPrefix + 'selected-icon',
                iconCls: Ext.baseCSSPrefix + 'fa fa-check'
            }
        }
    },

    /**
     * @cfg {'tap'} triggerEvent
     * @hide
     * BoundLists always use tap. This is ignored.
     */
    onFocusEnter: Ext.emptyFn,
    onFocusLeave: Ext.emptyFn,

    afterShow: function() {
        this.callParent();

        // Our navModel uses the field's inputElement as event source,
        // so enable navigation KeyMap on show.
        this.getNavigationModel().enable();
    },

    afterHide: function(me) {
        var navModel = me.getNavigationModel();

        me.callParent([me]);

        // Set the location to null because there's no onFocusLeave
        // to do this because the picker does not get focused.
        // Our navModel uses the field's inputElement as event source,
        // so disable navigation KeyMap on hide.
        navModel.setLocation(null);
        navModel.disable();
    },

    privates: {
        /**
         * The selection model informs the view when it refreshes itself due to store
         * churn - for example reloading, filtering etc.
         *
         * The view must have the final say what records exit the selection because of
         * records inserted as a result of forceSelection: false.
         * @param {Ext.data.Model[]} toDeselect Records to be removed from the selection
         * @param {Ext.data.Model[]} toReselect Records to be added to the collection.
         */
        beforeSelectionRefresh: function(toDeselect, toReselect) {
            var len = toDeselect.length,
                i, rec;

            for (i = 0; i < len;) {
                rec = toDeselect[i];

                // If this is a record added as a result of forceSelection: false,
                // remove it from the eviction list.
                if (rec.isEntered) {
                    toDeselect.splice(i, 1);
                    len--;
                }
                else {
                    i++;
                }
            }
        }
    }
});
