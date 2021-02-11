/**
 * This plugin enables user-defined filters for a grid.
 * @since 6.7.0
 *
 * In general an gridfilters plugin will be passed to the grid:
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
 *         title: 'Filter Grid Demo',
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
 *             {text: 'Hired Month',  dataIndex:'hired'},
 *             {
 *                 text: 'Department',
 *                 width: 200,
 *                 cell: {
 *                    bind: '{record.department} ({record.seniority})'
 *                 }
 *             }
 *         ],
 *         width: 500,
 *         fullscreen: true
 *     });
 *
 * # Convenience Subclasses
 *
 * There are several menu subclasses that provide default rendering for various data types
 *
 *  - {@link Ext.grid.filters.menu.Boolean}: Renders for boolean input fields
 *  - {@link Ext.grid.filters.menu.Date}: Renders for date input fields
 *  - {@link Ext.grid.filters.menu.Number}: Renders for numeric input fields
 *  - {@link Ext.grid.filters.menu.String}: Renders for string input fields
 *  
 *  These subclasses can be configured in columns as such:
 *
 *
 *      columns: [
 *          {text: 'First Name',  dataIndex:'firstname'},
 *          {text: 'Last Name',  dataIndex:'lastname', filter: 'string'},
 *          {text: 'seniority', dataIndex: 'seniority', filter: 'number'},
 *          {text: 'Hired Month',  dataIndex:'hired', filter: 'date'},
 *          {text: 'Active',  dataIndex:'active', filter: 'boolean'}
 *      ]
 *
 *
 *  Menu items can also be customised as shown below:
 *
 *
 *      columns: [
 *          {
 *              text: 'First Name',
 *              dataIndex:'firstname'
 *          },
 *          {
 *              text: 'Last Name',
 *              filter: {
 *                  type: 'string',
 *                  menu: {
 *                      items: {
 *                          like: {
 *                              placeholder: 'Custom Like...'
 *                          }
 *                      }
 *                  }
 *              }
 *         },
 *         {
 *            text: 'Hired Month',
 *            filter: {
 *              type: 'date',
 *              menu: {
 *                  items: {
 *                      lt: {
 *                          label: 'Custom Less than',
 *                          placeholder: 'Custom Less than...',
 *                          dateFormat: 'd-m-y'
 *                      },
 *                      gt: {
 *                          label: 'Custom Greater than',
 *                          placeholder: 'Custom Greater than...',
 *                          dateFormat: 'd-m-y'
 *                      },
 *                      eq: {
 *                          label: 'Custom On',
 *                          placeholder: 'Custom On...',
 *                          dateFormat: 'd-m-y'
 *                      }
 *                  }
 *              }
 *            }
 *         },
 *         {
 *              text: 'seniority'
 *              filter: {
 *                  type: 'number',
 *                  menu: {
 *                      items: {
 *                          lt: {
 *                              label: 'Custom Less than',
 *                              placeholder: 'Custom Less than...',
 *                          },
 *                          gt: {
 *                              label: 'Custom Greater than',
 *                              placeholder: 'Custom Greater than...',
 *                          },
 *                          eq: {
 *                              label: 'Custom Equal to',
 *                              placeholder: 'Custom Equal to...',
 *                          }
 *                      }
 *                  }
 *              }
 *          },
 *          {
 *              text: 'Active',
 *              filter: {
 *                  type: 'boolean',
 *                  menu: {
 *                      items: {
 *                          yes: {
 *                              text: 'Custom True'
 *                          },
 *                          no: {
 *                              text: 'Custom False'
 *                          }
 *                      }
 *                  }
 *              }             
 *          }
 *      ]
 *
 */
Ext.define('Ext.grid.filters.Plugin', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.gridfilters',

    requires: [
        'Ext.grid.filters.menu.*',
        'Ext.grid.filters.Column',  // an override that extends Column w/filter config
        'Ext.data.Query',
        'Ext.util.Filter'
    ],

    mixins: [
        'Ext.state.Stateful',
        'Ext.mixin.StoreWatcher'
    ],

    config: {
        /**
         * @cfg {String/Object} activeFilter
         * This config holds the current filter. This config is stateful.
         * @private
         */
        activeFilter: null,

        query: {
            type: 'default',
            format: 'filters'
        }
    },

    stateful: [
        'activeFilter'
    ],

    init: function(grid) {
        this.setOwner(grid);

        grid.on({
            beforeshowcolumnmenu: 'onBeforeShowColumnMenu',
            scope: this
        });
    },

    destroy: function() {
        this.setOwner(null);

        this.callParent();
    },

    // activeFilter

    updateActiveFilter: function(filter) {
        var query = this.getQuery();

        if (Ext.isString(filter)) {
            query.setSource(filter);
        }
        else {
            query.setFilters(filter);
        }
    },

    // query

    applyQuery: function(config, query) {
        return Ext.Factory.query.update(query, config);
    },

    updateQuery: function(query) {
        if (query) {
            // eslint-disable-next-line vars-on-top
            var me = this,
                fn = query.compile;

            query.compile = function() {
                fn.call(query);
                me.queryModified(query);
            };
        }
    },

    // store (StoreWatcher)

    updateStore: function(store, oldStore) {
        var me = this,
            query = me.getQuery();

        me.mixins.storewatcher.updateStore.call(me, store, oldStore);

        if (oldStore && !(oldStore.destroying || oldStore.destroyed)) {
            oldStore.getFilters().remove(query);
        }

        if (store) {
            store.getFilters().add(query);
        }
    },

    //--------------------------------------------

    onSetFilter: function(menuItem) {
        this.setActiveFilter(menuItem.rec.data.query);
    },

    privates: {
        onBeforeShowColumnMenu: function(grid, column, menu) {
            var me = this,
                filterMenuItem = menu.getComponent('filter'),
                menuConfig;

            if (!filterMenuItem) {
                // This method is provided by our Column override:
                menuConfig = column.createFilter({
                    itemId: 'filter',
                    plugin: me,
                    column: column
                });

                filterMenuItem = menuConfig && menu.add(Ext.Factory.gridFilters(menuConfig));

                if (filterMenuItem) {
                    filterMenuItem.setCheckHandler(me.onFilterItemCheckChange.bind(me));
                }
            }

            if (filterMenuItem) {
                filterMenuItem.syncFilter();
            }
        },

        onFilterItemCheckChange: function(item) {
            item.syncQuery();
        },

        queryModified: function() {
            var filters = this.cmp.getStore();

            filters = filters && filters.getFilters();

            if (filters) {
                filters.beginUpdate();
                ++filters.generation;
                filters.endUpdate();
            }
        }
    }
});
