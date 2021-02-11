Ext.define('KitchenSink.view.grid.tree.List', {
    extend: 'Ext.Panel',
    xtype: 'tree-list',
    controller: 'tree-list',
    title: 'Tree List',

    requires: [
        'Ext.list.Tree'
    ],

    viewModel: {
        type: 'tree-list'
    },

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/grid/tree/ListController.js'
    }, {
        type: 'ViewModel',
        path: 'modern/src/view/grid/tree/ListModel.js'
    }],

    profiles: {
        defaults: {
            height: 500,
            width: 250
        },
        phone: {
            defaults: {
                height: undefined,
                width: undefined
            }
        }
    },
    //</example>

    bodyPadding: 10,
    height: '${height}',
    scrollable: 'y',
    width: '${width}',

    items: [{
        xtype: 'treelist',
        reference: 'treelist',
        bind: '{navItems}'
    }],

    bbar: {
        xtype: 'component',
        cls: 'demo-solid-background',
        padding: 10,
        height: 40,
        bind: '{selectionText}'
    },

    tbar: [{
        xtype: 'segmentedbutton',
        allowMultiple: true,
        items: [{
            text: 'Nav',
            reference: 'navBtn',
            value: 'nav'
        }, {
            text: 'Micro',
            value: 'micro'
        }],
        listeners: {
            change: 'onChange'
        }
    }]
});
