Ext.define('KitchenSink.view.grid.tree.TreeGrid', {
    extend: 'Ext.grid.Tree',
    xtype: 'tree-grid',
    title: 'Tree Grid',
    controller: 'tree-grid',

    requires: [
        'Ext.grid.plugin.Exporter'
    ],

    viewModel: {
        type: 'tree-grid'
    },

    //<example>
    otherContent: [{
        type: 'ViewModel',
        path: 'modern/src/view/grid/tree/TreeGridModel.js'
    }],

    profiles: {
        defaults: {
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

    height: '${height}',
    width: '${width}',

    // binds the store from the TreeGridModel to this tree
    bind: '{navItems}',

    columns: [{
        xtype: 'treecolumn',
        text: 'Name',
        dataIndex: 'text',
        flex: 1
    }, {
        xtype: 'numbercolumn',
        width: 100,
        text: '# Items',
        dataIndex: 'numItems',
        align: 'center',
        format: '0,0'
    }],

    plugins: {
        gridexporter: true
    },

    listeners: {
        documentsave: 'onDocumentSave',
        beforedocumentsave: 'onBeforeDocumentSave'
    },

    titleBar: {
        shadow: false,
        items: [{
            align: 'right',
            xtype: 'button',
            text: 'Export to ...',
            stretchMenu: true,
            arrow: false,
            menu: {
                defaults: {
                    handler: 'exportDocument'
                },
                indented: false,
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
    }

});
