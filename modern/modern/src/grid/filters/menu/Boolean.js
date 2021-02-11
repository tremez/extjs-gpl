/**
 * @private
 * 
 * The boolean grid filter allows you to create a filter selection that limits results
 * to values matching true or false.  The filter can be set programmatically or via 
 * user input with a configurable {@link Ext.menu.RadioItem radio item} in the filter section 
 * of the column header.
 * 
 * Boolean filters use unique radio group IDs, so you may utilize more than one.
 *
 * Example Boolean Filter Usage:
 * 
 *     @example
 *     var store = Ext.create('Ext.data.Store', {
 *         fields: ['firstname', 'lastname', 'seniority', 'department', 'hired', 'active'],
 *         data: [
 *             {
 *                  firstname:"Michael",
 *                  lastname:"Scott",
 *                  seniority:7,
 *                  department:"Management",
 *                  hired:"01/10/2004",
 *                  active: true
 *             },
 *             {
 *                  firstname:"Dwight",
 *                  lastname:"Schrute",
 *                  seniority:2,
 *                  department:"Sales",
 *                  hired:"04/01/2004",
 *                  active: true
 *             },
 *             {
 *                  firstname:"Jim",
 *                  lastname:"Halpert",
 *                  seniority:3,
 *                  department:"Sales",
 *                  hired:"02/22/2006",
 *                  active: false
 *             },
 *             {
 *                  firstname:"Kevin",
 *                  lastname:"Malone",
 *                  seniority:4,
 *                  department:"Accounting",
 *                  hired:"06/10/2007",
 *                  active: true
 *             },
 *             {
 *                  firstname:"Angela",
 *                  lastname:"Martin",
 *                  seniority:5,
 *                  department:"Accounting",
 *                  hired:"10/21/2008",
 *                  active: false
 *             }
 *         ]
 *     });
 *   
 *     Ext.create({
 *         xtype: 'grid',
 *         title: 'Filter Grid - Boolean Type',
 *         itemConfig: {
 *             viewModel: true
 *         },
 *         plugins: {
 *              gridfilters: true
 *         },
 *         store: store,
 *         columns: [
 *             {text: 'First Name',  dataIndex:'firstname'},
 *             {text: 'Last Name',  dataIndex:'lastname'},
 *             {text: 'Department',  dataIndex:'department'},
 *             {text: 'Seniority',  dataIndex:'seniority'},
 *             {text: 'Hired Month',  dataIndex:'hired'},
 *             {
 *                  text: 'Active',
 *                  dataIndex:'active',
 *                  filter: {
 *                      type: 'boolean',
 *                      menu: {
 *                          items: {
 *                              yes: {
 *                                  text: 'Custom True'
 *                              },
 *                              no: {
 *                                  text: 'Custom False'
 *                              }
 *                          }
 *                      }
 *                  }
 *             }
 *         ],
 *         width: 500,
 *         fullscreen: true
 *     });
 */
Ext.define('Ext.grid.filters.menu.Boolean', {
    extend: 'Ext.grid.filters.menu.Base',
    alias: 'gridFilters.boolean',

    requires: [
        'Ext.menu.RadioItem'
    ],

    menu: {
        defaults: {
            name: 'boolfilter',
            group: 'value',
            xtype: 'menuradioitem',
            operator: '==',
            checkHandler: 'up.onInputChange'
        },
        items: {
            yes: {
                value: true,
                text: 'True',
                weight: 10
            },
            no: {
                value: false,
                text: 'False',
                weight: 20
            }
        }
    },

    syncFilter: function() {
        var me = this,
            column = me.column,
            dataIndex = column.getDataIndex(),
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
                        if (item.getChecked) {
                            if (f.value === item.getValue()) {
                                value = f.value;
                                break;
                            }
                        }
                        else {
                            value = f.value;
                            break;
                        }
                    }
                }

                if (item.operator === '==' && item.getChecked) {
                    if (item.getValue() === value) {
                        item.setChecked(true);
                    }
                    else {
                        item.setChecked(false);
                    }
                }
                else {
                    item.setValue(value);
                }
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
                        if (item && item.getChecked) { // This is for radio or checkbox type fields
                            if (item.getChecked() &&
                                (item.getValue() === true || item.getValue() === false)) {
                                value = item.getValue();
                            }
                            else {
                                value = null;
                            }

                        }
                        else {
                            value = item.getValue();
                            me.setChecked(true);
                        }

                        if (value !== null && value !== '') {
                            ++added;

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
    }
});
