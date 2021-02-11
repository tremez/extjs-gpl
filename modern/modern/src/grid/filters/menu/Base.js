/**
 * @private
 */
Ext.define('Ext.grid.filters.menu.Base', {
    extend: 'Ext.menu.CheckItem',

    isFilterMenuItem: true,

    mixins: [
        'Ext.mixin.Bufferable'
    ],

    /**
     * @cfg {String} text
     * The menu item text for the filters sub-menu.
     * @locale
     */
    text: 'Filter',

    menu: {
        indented: false
    },

    weight: -70,

    bufferableMethods: {
        onInputChange: 300
    },

    syncFilter: function() {
        var me = this,
            dataIndex = me.column.getDataIndex(),
            query = me.plugin.getQuery(),
            filters = query.getFilters(),
            items = me.getMenu().getItems().items,
            f, i, k, item, value;

        for (i = items.length; i-- > 0; /* empty */) {
            item = items[i];

            if (item.operator) {
                value = null;

                for (k = dataIndex && filters && filters.length; k-- > 0; /* empty */) {
                    f = filters[k];

                    if (f.property === dataIndex && f.operator === item.operator) {
                        value = f.value;
                        break;
                    }
                }

                item.setValue(value);
            }
        }
    },

    syncQuery: function() {
        var me = this,
            dataIndex = me.column.getDataIndex(),
            plugin = me.plugin,
            query = plugin.getQuery(),
            added = 0,
            removed = 0,
            filters, i, item, items, value;

        if (dataIndex) {
            filters = Ext.clone(query.getFilters());
            items = me.getMenu().getItems().items;

            for (i = filters && filters.length; i-- > 0; /* empty */) {
                if (filters[i].property === dataIndex) {
                    filters.splice(i, 1);
                    ++removed;
                }
            }

            if (me.getChecked()) {
                for (i = items.length; i-- > 0;) {
                    item = items[i];

                    if (item.operator) {
                        value = item.getValue();

                        if (value !== null && value !== '') {
                            ++added;

                            if (Ext.isDate(value)) {
                                value = Ext.Date.format(value, 'C');
                            }

                            (filters || (filters = [])).push({
                                property: dataIndex,
                                operator: item.operator,
                                value: value
                            });
                        }
                    }
                }
            }

            if (!added) {
                me.setChecked(false);
            }

            if (added || removed) {
                plugin.setActiveFilter(filters);
            }
        }
    },

    privates: {
        doOnInputChange: function() {
            this.setChecked(true);
            this.syncQuery();
        }
    }
});
