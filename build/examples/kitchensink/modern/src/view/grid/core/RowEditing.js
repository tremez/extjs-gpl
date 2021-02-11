/**
 * This example shows how to enable inline editing of grid rows.
 *
 */
Ext.define('KitchenSink.view.grid.core.RowEditing', {
    extend: 'Ext.grid.locked.Grid',
    xtype: 'row-editing',
    title: 'Row Editing',

    requires: [
        'Ext.grid.rowedit.Plugin'
    ],

    //<example>
    otherContent: [{
        type: 'Model',
        path: 'app/model/Plant.js'
    }],

    profiles: {
        defaults: {
            height: 400,
            width: 700
        },
        phone: {
            defaults: {
                height: undefined,
                width: undefined
            }
        }
    },
    //</example>

    height: '${height}',
    width: '${width}',
    rowNumbers: true,
    markDirty: true,

    plugins: {
        rowedit: {
            // selectOnEdit: true
            autoConfirm: false
        }
    },

    // selectable: {
    //     rows: false,
    //     cells: true
    // },

    store: {
        autoLoad: true,
        model: 'KitchenSink.model.Plant',

        proxy: {
            type: 'ajax',
            url: 'data/grid/plants.xml',

            reader: {
                type: 'xml',
                record: 'plant'
            }
        }
    },

    columns: [{
        text: 'Common Name',
        flex: 1,
        width: 200,
        dataIndex: 'common',
        editable: true,
        locked: true
    }, {
        text: 'Light',
        width: 125,
        dataIndex: 'light',
        editable: true,
        editor: {
            xtype: 'selectfield',
            options: [
                'Shade',
                'Mostly Shady',
                'Sun or Shade',
                'Mostly Sunny',
                'Sunny'
            ]
        }
    }, {
        text: 'Price',
        width: 100,
        formatter: 'usMoney',
        dataIndex: 'price',
        editable: true
    }, {
        xtype: 'datecolumn',
        text: 'Available',
        width: 125,
        dataIndex: 'availDate',
        editable: true
    }, {
        text: 'Indoor?',
        xtype: 'checkcolumn',
        headerCheckbox: true,
        dataIndex: 'indoor'
    }]
});
