/**
 * This example is an advanced tree example. It illustrates:
 *
 * - Multiple headers
 * - Preloading of nodes with a single AJAX request
 * - Header hiding, showing, reordering and resizing
 * - useArrows configuration
 * - Keyboard Navigation
 * - Discontiguous selection by holding the CTRL key
 * - Using custom iconCls
 * - singleExpand has been set to true
 */
Ext.define('KitchenSink.view.tree.TreeGrid', {
    extend: 'Ext.tree.Panel',
    xtype: 'tree-grid',
    controller: 'tree-grid',

    requires: [
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.tree.*',
        'Ext.grid.column.Check',
        'Ext.grid.plugin.Exporter'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/tree/TreeGridController.js'
    }, {
        type: 'Model',
        path: 'classic/samples/model/tree/Task.js'
    }, {
        type: 'Data',
        path: 'data/tree/treegrid.json'
    }],
    profiles: {
        classic: {
            width: 500,
            colWidth: 40,
            exportOptionWidth: 124
        },
        neptune: {
            width: 600,
            colWidth: 55,
            exportOptionWidth: 124
        },
        graphite: {
            width: 800,
            colWidth: 75,
            exportOptionWidth: 154
        },
        'classic-material': {
            width: 800,
            colWidth: 75,
            exportOptionWidth: 154
        }
    },
    //</example>

    title: 'Core Team Projects',
    width: '${width}',
    height: 370,

    reserveScrollbar: true,
    useArrows: true,
    rootVisible: false,
    multiSelect: true,
    singleExpand: true,

    store: {
        type: 'tree',
        model: 'KitchenSink.model.tree.Task',
        folderSort: true,
        proxy: {
            type: 'ajax',
            url: 'data/tree/treegrid.json'
        }
    },

    columns: [{
        xtype: 'treecolumn', // this is so we know which column will show the tree
        text: 'Task',
        dataIndex: 'task',

        flex: 2,
        sortable: true
    }, {
        text: 'Duration',
        dataIndex: 'duration',

        flex: 1,
        sortable: true,
        align: 'center',
        formatter: 'this.formatHours'
    }, {
        text: 'Assigned To',
        dataIndex: 'user',

        flex: 1,
        sortable: true
    }, {
        xtype: 'checkcolumn',
        header: 'Done',
        dataIndex: 'done',

        width: '${colWidth}',
        stopSelection: false,
        menuDisabled: true
    }, {
        xtype: 'actioncolumn',
        text: 'Edit',

        width: '${colWidth}',
        menuDisabled: true,
        tooltip: 'Edit task',
        align: 'center',
        iconCls: 'tree-grid-edit-task',
        handler: 'onEditRowAction',
        isActionDisabled: 'isRowEditDisabled'
    }],

    header: {
        itemPosition: 1, // after title before collapse tool
        items: [{
            ui: 'default-toolbar',
            xtype: 'button',
            cls: 'dock-tab-btn',
            text: 'Export to ...',
            menu: {
                defaults: {
                    handler: 'exportTo',
                    width: '${exportOptionWidth}'
                },
                items: [{
                    text: 'Excel xlsx',
                    cfg: {
                        type: 'excel07',
                        ext: 'xlsx'
                    }
                }, {
                    text: 'Excel xml',
                    cfg: {
                        type: 'excel03',
                        ext: 'xml'
                    }
                }, {
                    text: 'CSV',
                    cfg: {
                        type: 'csv'
                    }
                }, {
                    text: 'TSV',
                    cfg: {
                        type: 'tsv',
                        ext: 'csv'
                    }
                }, {
                    text: 'HTML',
                    cfg: {
                        type: 'html'
                    }
                }]
            }
        }]
    },

    plugins: 'gridexporter'
});
