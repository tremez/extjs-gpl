/**
 * This example shows how to enable inline editing of grid cells.
 *
 */
Ext.define('KitchenSink.view.grid.core.CellEditing', {
    extend: 'Ext.grid.Grid',
    xtype: 'cell-editing',
    title: 'Cell Editing Plants',

    requires: [
        'Ext.grid.plugin.CellEditing'
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
        gridcellediting: {
            selectOnEdit: true
        }
    },

    selectable: {
        rows: false,
        cells: true
    },

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
        dataIndex: 'common',
        editable: true
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
        format: 'M d, Y',
        width: 125,
        dataIndex: 'availDate',
        editor: {
            allowBlur: false,
            field: {
                xtype: 'datepickerfield'
            }
        }
    }, {
        text: 'Indoor?',
        xtype: 'checkcolumn',
        headerCheckbox: true,
        dataIndex: 'indoor'
    }]
});
