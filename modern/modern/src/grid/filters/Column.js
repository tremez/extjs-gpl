/**
 * @class Ext.grid.column.Column
 */
// separate so doc parser doesn't try to auto-detect on an override
Ext.define('Ext.grid.filters.Column', {
    override: 'Ext.grid.column.Column',

    config: {
        /**
         * @cfg {Object/Boolean} filter
         */
        filter: null
    },

    /**
     * @property {String} [defaultFilterType=null]
     * This property can be set on column classes to determine the default `type` alias
     * for filters.
     */

    createFilter: function(config) {
        var me = this,
            filter = me.getFilter(),
            cloned, field, model;

        if (filter !== false) {
            if (!filter || filter === true) {
                cloned = true;
                filter = {};
            }
            else if (typeof filter === 'string') {
                cloned = true;
                filter = {
                    type: filter
                };
            }

            if (!filter.type) {
                if (!cloned) {
                    cloned = true;
                    filter = Ext.clone(filter);
                }

                if (!(filter.type = me.defaultFilterType || me.columnFilterTypes[me.xtype])) {
                    model = me.getGrid().getStore();
                    model = model && model.getModel();
                    field = me.getDataIndex();

                    if (field && model) {
                        field = model.getField(field);

                        filter.type = me.fieldFilterTypes[field && field.type];
                    }
                }

                if (!filter.type) {
                    filter = false;
                }
            }

            if (config && filter) {
                if (!cloned) {
                    filter = Ext.clone(filter);
                }

                filter = Ext.apply(filter, config);
            }
        }

        return filter;
    },

    privates: {
        /**
         * This object maps column `xtype` values to filter `type` aliases. These aliases
         * are used if the column does not define a `defaultFilterType`.
         * @private
         * @readonly
         * @since 6.7.0
         */
        columnFilterTypes: {
            booleancolumn: 'boolean',
            datecolumn: 'date',
            numbercolumn: 'number'
        },

        /**
         * This object maps `Ext.data.field.Field` `type` aliases to filter `type` aliases.
         * These aliases are used if the column does not define a `defaultFilterType`.
         * @private
         * @readonly
         * @since 6.7.0
         */
        fieldFilterTypes: {
            auto: 'string',
            bool: 'boolean',
            date: 'date',
            'float': 'number',
            number: 'number',
            'int': 'number',
            integer: 'number',
            string: 'string'
        }
    }

}, function() {
    Ext.Factory.define('gridFilters', {
        defaultType: 'string'
    });
});
