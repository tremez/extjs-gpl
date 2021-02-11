/**
 * This example shows how to sort a grid by more than a single field.
 *
 * The store is initially sorted by joinDate DESC then by Salary ASC,
 * as indicated in the headers. The `multiColumnSort` config allows
 * clicking on a header to either add that field as the primary sorter,
 * or if already sorted, it flips direction and moves that field to be
 * the primary sort key.
 */
Ext.define('KitchenSink.view.grid.MultipleSorting', {
    extend: 'Ext.grid.Panel',
    xtype: 'multi-sort-grid',
    controller: 'multi-sort-grid',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/grid/MultipleSortingController.js'
    }],
    //</example>
    profiles: {
        classic: {
            joindateWidth: 125,
            salaryWidth: 125
        },
        neptune: {
            joindateWidth: 125,
            salaryWidth: 125
        },
        graphite: {
            joindateWidth: 150,
            salaryWidth: 150
        },
        'classic-material': {
            joindateWidth: 150,
            salaryWidth: 150
        }
    },

    title: 'Multiple Sort Grid',
    height: 350,
    width: 600,

    bind: '{store}',
    multiColumnSort: true,

    bbar: {
        items: [{
            xtype: 'component',
            bind: 'Sorted By: {sortOrder}'
        }]
    },

    columns: [{
        text: 'Name',
        dataIndex: 'name',

        flex: 1
    }, {
        xtype: 'datecolumn',
        text: 'Join Date',
        dataIndex: 'joinDate',

        width: '${joindateWidth}'
    }, {
        text: 'Salary',
        dataIndex: 'salary',

        width: '${salaryWidth}',
        align: 'right',
        formatter: 'usMoney'
    }],

    viewModel: {
        data: {
            sortOrder: null
        },

        stores: {
            store: {
                type: 'big-data',

                sorters: [
                    { property: 'joinDate', direction: 'DESC' },
                    'salary'
                ],

                listeners: {
                    sort: 'updateSort',
                    refresh: 'updateSort',
                    buffer: 10
                }
            }
        }
    }
});
