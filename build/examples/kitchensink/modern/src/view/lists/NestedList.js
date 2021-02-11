/**
 * Demonstrates a NestedList, which uses a TreeStore to drill down through hierarchical data
 */
Ext.define('KitchenSink.view.lists.NestedList', {
    extend: 'Ext.dataview.NestedList',
    xtype: 'nested-list',
    controller: 'nested-list',

    requires: [
        'Ext.Dialog'
    ],

    viewModel: {},

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/lists/NestedListController.js'
    }, {
        type: 'Model',
        path: 'modern/src/model/Cars.js'
    }],

    profiles: {
        defaults: {
            height: 400,
            maxDialogWidth: 200,
            width: 300
        },
        phone: {
            defaults: {
                height: undefined,
                maxDialogWidth: '80vw',
                width: undefined
            }
        }
    },
    //</example>

    height: '${height}',
    width: '${width}',

    dialog: {
        xtype: 'dialog',
        title: 'Dialog',

        closable: true,
        defaultFocus: 'textfield',
        maskTapHandler: 'onCancel',

        bodyPadding: 20,
        maxWidth: '${maxDialogWidth}',

        items: [{
            xtype: 'textfield',
            reference: 'textField',
            name: 'text',
            label: 'Name',
            bind: '{selected.text}'
        }],

        // We are using standard buttons on the button
        // toolbar, so their text and order are consistent.
        buttons: {
            ok: 'onOK',
            cancel: 'onCancel'
        }
    },

    store: {
        type: 'tree',
        model: 'KitchenSink.model.Cars',
        root: {},
        proxy: {
            type: 'ajax',
            url: 'data/carregions.json'
        }
    },

    listeners: {
        leafchildtap: 'onLeafChildTap'
    }
});
