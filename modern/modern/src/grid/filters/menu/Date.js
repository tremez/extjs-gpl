/**
 * @private
 * 
 * The date grid filter allows you to create a filter selection that limits results
 * to values matching specific date constraints.  The filter can be set programmatically or via 
 * user input with a configurable {@link Ext.field.Date DatePicker menu} in the filter section 
 * of the column header.
 * 
 * Example Date Filter Usage:
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
 *         title: 'Filter Grid - Date Type',
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
 *             {
 *                  text: 'Hired Month',
 *                  dataIndex:'hired',
 *                  filter: {
 *                      type: 'date',
 *                      menu: {
 *                          items: {
 *                              lt: {
 *                                  label: 'Custom Less than',
 *                                  placeholder: 'Custom Less than...',
 *                                  dateFormat: 'd-m-y'
 *                              },
 *                              gt: {
 *                                  label: 'Custom Greater than',
 *                                  placeholder: 'Custom Greater than...',
 *                                  dateFormat: 'd-m-y'
 *                              },
 *                              eq: {
 *                                  label: 'Custom On',
 *                                  placeholder: 'Custom On...',
 *                                  dateFormat: 'd-m-y'
 *                              }
 *                          }
 *                      }
 *                  }
 *             },
 *             {text: 'Active',  dataIndex:'active'}
 *         ],
 *         width: 500,
 *         fullscreen: true
 *     });
 * 
 */
Ext.define('Ext.grid.filters.menu.Date', {
    extend: 'Ext.grid.filters.menu.Base',
    alias: 'gridFilters.date',

    requires: [
        'Ext.field.Date'
    ],

    menu: {
        items: {
            lt: {
                xtype: 'datefield',
                // iconCls: 'fi-arrow-left', TODO
                label: 'Before',
                placeholder: 'Before...',
                operator: '<',
                weight: 10,
                listeners: {
                    change: 'up.onInputChange'
                }
            },
            gt: {
                xtype: 'datefield',
                // iconCls: 'fi-arrow-right', TODO
                label: 'After',
                placeholder: 'After...',
                operator: '>',
                weight: 20,
                listeners: {
                    change: 'up.onInputChange'
                }
            },
            eq: {
                xtype: 'datefield',
                // iconCls: 'fi-equal', TODO ?
                label: 'On',
                placeholder: 'On...',
                operator: '=',
                separator: true,
                weight: 30,
                listeners: {
                    change: 'up.onInputChange'
                }
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

                    if (f.operator === '==' &&
                        !item.getChecked &&
                        !(typeof f.value === 'boolean')) {
                        f.operator = '=';
                    }

                    if (f.property === dataIndex && f.operator === item.operator) {
                        value = f.value;
                        break;
                    }
                }

                if (column.columnFilterTypes[column.xtype] === 'date') {
                    /*  This check is to parse date and pass it back to field
                     *  when filters are pulled from storage
                     */
                    value = value && Ext.Date.parse(value);
                }

                item.setValue(value);
            }
        }
    }
});
