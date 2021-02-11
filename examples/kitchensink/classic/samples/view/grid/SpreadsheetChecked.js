/**
 * Demonstrates the Spreadsheet selection model.
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
 * Copy/paste to system clipboard using CTRL+C, CTRL+X and CTRL+V.
 */
Ext.define('KitchenSink.view.grid.SpreadsheetChecked', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.grid.selection.SpreadsheetModel',
        'Ext.grid.plugin.Clipboard',
        'KitchenSink.store.MonthlySales'
    ],
    //<example>
    exampleTitle: 'Spreadsheet',
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/grid/SpreadsheetController.js'
    }, {
        type: 'Store',
        path: 'app/store/MonthlySales.js'
    }, {
        type: 'Model',
        path: 'app/model/MonthlySales.js'
    }],
    //</example>

    xtype: 'spreadsheet-checked',
    controller: 'spreadsheet',

    store: {
        type: 'monthlysales'
    },
    columnLines: true,
    height: 400,
    width: '${width}',
    title: 'Spreadsheet',
    profiles: {
        classic: {
            width: 750,
            columnWidth: 50
        },
        neptune: {
            width: 750,
            columnWidth: 50
        },
        graphite: {
            width: 930,
            columnWidth: 65
        },
        'classic-material': {
            width: 930,
            columnWidth: 65
        }
    },
    frame: true,

    selModel: {
        type: 'spreadsheet',
        // Disables sorting by header click, though it will be still available via menu
        columnSelect: true,
        checkboxSelect: true,
        pruneRemoved: false,
        extensible: 'y'
    },

    // Enable CTRL+C/X/V hot-keys to copy/cut/paste to the system clipboard.
    plugins: {
        clipboard: true,
        selectionreplicator: true
    },

    listeners: {
        selectionchange: 'onSelectionChange'
    },

    tools: [{
        type: 'refresh',
        handler: 'onRefresh',
        tooltip: 'Reload Data'
    }],

    tbar: [{
        xtype: 'component',
        html: 'Selectable: '
    }, {
        text: 'Rows',
        enableToggle: true,
        toggleHandler: 'toggleRowSelect',
        pressed: true
    }, {
        text: 'Cells',
        enableToggle: true,
        toggleHandler: 'toggleCellSelect',
        pressed: true
    }, {
        text: 'Columns',
        enableToggle: true,
        toggleHandler: 'toggleColumnSelect',
        pressed: true
    }, '->', {
        xtype: 'component',
        reference: 'status'
    }],

    columns: [
        { text: 'Year', dataIndex: 'year', flex: 1, minWidth: 70 },
        { text: 'Jan', dataIndex: 'jan', width: '${columnWidth}' },
        { text: 'Feb', dataIndex: 'feb', width: '${columnWidth}' },
        { text: 'Mar', dataIndex: 'mar', width: '${columnWidth}' },
        { text: 'Apr', dataIndex: 'apr', width: '${columnWidth}' },
        { text: 'May', dataIndex: 'may', width: '${columnWidth}' },
        { text: 'Jun', dataIndex: 'jun', width: '${columnWidth}' },
        { text: 'Jul', dataIndex: 'jul', width: '${columnWidth}' },
        { text: 'Aug', dataIndex: 'aug', width: '${columnWidth}' },
        { text: 'Sep', dataIndex: 'sep', width: '${columnWidth}' },
        { text: 'Oct', dataIndex: 'oct', width: '${columnWidth}' },
        { text: 'Nov', dataIndex: 'nov', width: '${columnWidth}' },
        { text: 'Dec', dataIndex: 'dec', width: '${columnWidth}' }
    ],
    forceFit: true,

    viewConfig: {
        columnLines: true,
        trackOver: false
    }
});
