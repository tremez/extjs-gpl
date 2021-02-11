/**
 * @private
 * 
 * The string grid filter allows you to create a filter selection that limits results
 * to values matching a particular string.  The filter can be set programmatically or via 
 * user input with a configurable {@link Ext.field.Text text field} in the filter section 
 * of the column header.
 *
 * Example String Filter Usage:
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
 *         title: 'Filter Grid - String Type',
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
 *             {
 *                  text: 'Department',
 *                  dataIndex:'department',
 *                  filter: {
 *                      type: 'string',
 *                      menu: {
 *                          items: {
 *                              like: {
 *                                  placeholder: 'Custom Like...'
 *                              }
 *                          }
 *                      }
 *                  }
 *             },
 *             {text: 'Seniority',  dataIndex:'seniority'},
 *             {text: 'Hired Month',  dataIndex:'hired'},
 *             {text: 'Active',  dataIndex:'active'}
 *         ],
 *         width: 500,
 *         fullscreen: true
 *     });
 */
Ext.define('Ext.grid.filters.menu.String', {
    extend: 'Ext.grid.filters.menu.Base',
    alias: 'gridFilters.string',

    menu: {
        items: {
            like: {
                xtype: 'textfield',
                placeholder: 'Like...',
                operator: 'like',
                listeners: {
                    change: 'up.onInputChange'
                }
            }
        }
    }
});
