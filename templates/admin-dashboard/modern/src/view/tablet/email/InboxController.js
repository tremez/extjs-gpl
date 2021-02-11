Ext.define('Admin.view.tablet.email.InboxController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.tablet-email-inbox',

    searchFields: [
        'from',
        'title'
    ],

    destroy: function () {
        var filter = this.filter,
            view, store;

        if (filter) {
            view = this.getView();
            store = view.getStore();

            store.removeFilter(filter);
        }

        this.callParent();
    },

    emptyStringRenderer: function () {
        return '';
    },

    onSearch: function (field, value) {
        var me = this,
            view = me.getView(),
            store = view.getStore(),
            regex, filter, filterFn, filters;

        if (value) {
            filter = me.filter;
            regex = new RegExp(value, 'i');
            filterFn = function (rec) {
                var fields = me.searchFields,
                    i = 0,
                    length = fields.length;

                for (; i < length; i++) {
                    if (regex.test(rec.get(fields[i]))) {
                        return true;
                    }
                }

                return false;
            };

            if (filter) {
                filters = store.getFilters();

                filter.setFilterFn(filterFn);

                //trigger a store update
                filters.beginUpdate();
                filters.endUpdate();
            } else {
                me.filter = filter = new Ext.util.Filter({
                    filterFn: filterFn
                });

                store.filter(filter);
            }
        } else {
            me.filter = store.clearFilter();
        }
    }
});
