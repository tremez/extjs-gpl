/**
 * This example shows a grid using the "grideditable" and
 * "gridcellediting" plugins. The device type is used to
 * determine which user experience is appropriate.
 *
 * On desktop, double-clicking a cell displays and inline
 * editor, while on mobile devices, a form is shows on
 * the right with all the configured column editors.
 *
 * This example also demonstrates configuring the scroller
 * to always use floating overlay scroll indicators instead
 * of scrollbars.
 */
Ext.define('KitchenSink.view.grid.core.EditableGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'editable-grid',
    controller: 'editable-grid',
    title: 'Editable Grid',

    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.grid.plugin.Editable'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/grid/core/EditableGridController.js'
    }, {
        type: 'Store',
        path: 'app/store/Companies.js'
    }, {
        type: 'Model',
        path: 'app/model/Company.js'
    }],

    profiles: {
        defaults: {
            priceWidth: 85,
            changeColumnWidth: 90,
            percentChangeColumnWidth: 100,
            lastUpdatedColumnWidth: 125,
            green: '#73b51e',
            red: '#cf4c35',
            height: 400,
            width: 600
        },
        phone: {
            defaults: {
                height: undefined,
                width: undefined
            }
        }
    },
    //</example>

    platformConfig: {
        desktop: {
            plugins: {
                gridcellediting: true
            }
        },

        '!desktop': {
            plugins: {
                grideditable: true
            }
        }
    },

    height: '${height}',
    store: 'Companies',
    width: '${width}',

    scrollable: {
        indicators: 'overlay'
    },

    columns: [{
        text: 'Company',
        flex: 1,
        dataIndex: 'name',
        minWidth: 100,
        editable: true
    }, {
        text: 'Price',
        width: '${priceWidth}',
        dataIndex: 'price',
        formatter: 'usMoney',
        editable: true,
        editor: {
            xtype: 'numberfield',
            required: true,
            validators: {
                type: 'number',
                message: 'Invalid price'
            }
        }
    }, {
        text: 'Change',
        width: '${changeColumnWidth}',
        dataIndex: 'change',
        renderer: 'renderChange',
        cell: {
            encodeHtml: false
        }
    }, {
        text: '% Change',
        width: '${percentChangeColumnWidth}',
        dataIndex: 'pctChange',
        renderer: 'renderPercent',
        cell: {
            encodeHtml: false
        }
    }, {
        text: 'Last Updated',
        width: '${lastUpdatedColumnWidth}',
        dataIndex: 'lastChange',
        formatter: 'date("m/d/Y")'
    }],

    signTpl: '<span style="' +
            'color:{value:sign("${red}", "${green}")}"' +
        '>{text}</span>'
});
