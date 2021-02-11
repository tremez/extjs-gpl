/**
 * Demonstrates a the docking of toolbars in each dimension on a panel.
 */
Ext.define('KitchenSink.view.toolbars.DockedToolbars', {
    extend: 'Ext.container.Container',
    xtype: 'docked-toolbars',
    controller: 'docked-toolbars',

    //<example>
    profiles: {
        defaults: {
            listCls: 'x-fa fa-list',
            closeCls: 'x-fa fa-times',
            fileCls: 'x-fa fa-file-alt',
            editCls: 'x-far fa-image'
        }
    },

    shadow: false,
    //</example>

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    defaults: {
        defaultType: 'panel',
        flex: 1,
        defaults: {
            bodyPadding: 10,
            flex: 1,
            shadow: true,
            margin: 10
        },
        layout: {
            type: 'vbox',
            align: 'stretch'
        }
    },

    items: [{
        items: [{
            title: 'Top',
            html: KitchenSink.DummyText.shortText,
            tbar: [{
                iconCls: '${listCls}'
            }, {
                iconCls: '${closeCls}'
            }, {
                iconCls: '${fileCls}'
            }, {
                iconCls: '${editCls}'
            }]
        }, {
            title: 'Left',
            html: KitchenSink.DummyText.shortText,
            lbar: [{
                iconCls: '${listCls}'
            }, {
                iconCls: '${closeCls}'
            }, {
                iconCls: '${fileCls}'
            }, {
                iconCls: '${editCls}'
            }]
        }, {
            title: 'Buttons',
            html: KitchenSink.DummyText.shortText,
            buttons: [{
                iconCls: '${listCls}'
            }, {
                iconCls: '${closeCls}'
            }]
        }]
    }, {
        items: [{
            title: 'Right',
            html: KitchenSink.DummyText.shortText,
            rbar: [{
                iconCls: '${listCls}'
            }, {
                iconCls: '${closeCls}'
            }, {
                iconCls: '${fileCls}'
            }, {
                iconCls: '${editCls}'
            }]
        }, {
            title: 'Bottom',
            html: KitchenSink.DummyText.shortText,
            bbar: [{
                iconCls: '${listCls}'
            }, {
                iconCls: '${closeCls}'
            }, {
                iconCls: '${fileCls}'
            }, {
                iconCls: '${editCls}'
            }]
        }, {
            title: 'Buttons',
            html: KitchenSink.DummyText.shortText,
            buttons: {
                cancel: 'onCancel',
                help: 'onHelp',
                ok: 'onOk'
            }
            /**
             * These buttons match a button in Ext.Panel's
             * standardButtons config. Please see the
             * documentation for all possible pre-defined
             * buttons you can use.
             */
        }]
    }]
});
