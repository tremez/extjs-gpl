/**
 * Demonstrates the flexibility of the Grid selection model.
 *
 * Supported features:
 *
 *  - Single / Range / Multiple individual row selection.
 *  - Single / Range cell selection.
 *  - Column selection by click selecting column headers.
 *  - Select / deselect all by clicking in the top-left, header.
 *  - Adds row number column to enable row selection.
 *  - Selection extensibility using a drag gesture. Configured in this case to be up or down.
 *
 */
Ext.define('KitchenSink.view.grid.advanced.FlexibleSelection', {
    extend: 'Ext.Container',
    xtype: 'flexible-selection-grid',
    controller: 'flexible-selection',

    requires: [
        'KitchenSink.store.MonthlySales',
        'Ext.grid.plugin.Clipboard'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/grid/advanced/FlexibleSelectionController.js'
    }, {
        type: 'Store',
        path: 'app/store/MonthlySales.js'
    }, {
        type: 'Model',
        path: 'app/model/MonthlySales.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            maxWidth: 1125,
            padding: 8,
            shadow: true,
            tbarPadding: '5 8',
            title: 'Flexible Selection'
        },
        ios: {
            buttonShadow: undefined,
            tbarPadding: undefined
        },
        phone: {
            defaults: {
                maxWidth: undefined,
                padding: undefined,
                shadow: undefined,
                tbarPadding: '12 8',
                title: undefined
            },
            ios: {
                tbarPadding: undefined
            }
        }
    },

    viewModel: {
        data: {
            isRows: true
        }
    },

    padding: '${padding}', // give room for the grid's shadow
    shadow: false,
    //</example>

    layout: 'fit',
    maxWidth: '${maxWidth}',

    items: [{
        xtype: 'grid',
        reference: 'selectionGrid',
        shadow: '${shadow}',
        title: '${title}',
        rowNumbers: true,
        columnLines: true,
        itemRipple: false,
        store: {
            type: 'monthlysales'
        },
        selectable: {
            // Disables sorting by header click, though it will be still available via menu
            columns: true,
            cells: true,
            checkbox: true,
            drag: true,
            extensible: 'y'
        },
        // Propagates numeric values when the selection is extended in the Y axis
        plugins: {
            clipboard: true,
            selectionreplicator: true
        },
        listeners: {
            selectionchange: 'onSelectionChange'
        },
        columns: [
            { text: 'Year', dataIndex: 'year', flex: 1, minWidth: 75 },
            { text: 'Jan', dataIndex: 'jan', width: 75 },
            { text: 'Feb', dataIndex: 'feb', width: 75 },
            { text: 'Mar', dataIndex: 'mar', width: 75 },
            { text: 'Apr', dataIndex: 'apr', width: 75 },
            { text: 'May', dataIndex: 'may', width: 75 },
            { text: 'Jun', dataIndex: 'jun', width: 75 },
            { text: 'Jul', dataIndex: 'jul', width: 75 },
            { text: 'Aug', dataIndex: 'aug', width: 75 },
            { text: 'Sep', dataIndex: 'sep', width: 75 },
            { text: 'Oct', dataIndex: 'oct', width: 75 },
            { text: 'Nov', dataIndex: 'nov', width: 75 },
            { text: 'Dec', dataIndex: 'dec', width: 75 }
        ],
        items: [{
            xtype: 'component',
            reference: 'status',
            docked: 'bottom',
            cls: 'demo-solid-background',
            padding: '5 10',
            html: 'No selection'
        }]
    }, {
        xtype: 'toolbar',
        docked: 'top',
        ui: 'transparent',
        padding: '${tbarPadding}',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        defaults: {
            margin: '0 10 0 0',
            shadow: '${buttonShadow}',
            ui: 'action'
        },
        items: [{
            text: 'Selectable',
            menu: {
                defaults: {
                    xtype: 'menucheckitem',
                    checkHandler: 'onSelectableChange'
                },
                items: [{
                    text: 'rows',
                    fn: 'setRows',
                    checked: true,
                    bind: {
                        checked: '{isRows}'
                    }
                }, {
                    text: 'cells',
                    fn: 'setCells',
                    checked: true
                }, {
                    text: 'columns',
                    fn: 'setColumns',
                    checked: true
                }, {
                    text: 'drag',
                    fn: 'setDrag',
                    checked: true
                }, {
                    text: 'checkbox',
                    fn: 'setCheckbox',
                    checked: true,
                    bind: {
                        checked: {
                            bindTo: '{isRows}',
                            twoWay: false
                        }
                    }
                }]
            }
        }, {
            text: 'Extensible',
            menu: {
                defaults: {
                    xtype: 'menuradioitem',
                    checkHandler: 'onExtensibleChange',
                    group: 'extensible'
                },
                items: [{
                    text: 'x',
                    value: 'x'
                }, {
                    text: 'y',
                    value: 'y',
                    checked: true
                }, {
                    text: 'both',
                    value: true
                }]
            }
        }]
    }]
});
