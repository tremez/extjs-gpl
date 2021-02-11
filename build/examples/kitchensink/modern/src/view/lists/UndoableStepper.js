Ext.define('KitchenSink.view.lists.UndoableStepper', {
    extend: 'Ext.dataview.List',
    xtype: 'undoable-step-swiper',
    controller: 'undoable-swiper',

    requires: [
        'Ext.dataview.listswiper.ListSwiper',
        'Ext.dataview.listswiper.Stepper'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/lists/UndoableSwiperController.js'
    }],

    profiles: {
        defaults: {
            height: 400,
            width: 300
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
    itemTpl: '{firstName} {lastName}',
    store: 'List',
    width: '${width}',
    grouped: false,
    itemConfig: {
        height: 50
    },

    plugins: {
        listswiper: {
            widget: {
                xtype: 'listswiperstepper'
            },

            right: [{
                iconCls: 'x-fa fa-envelope',
                text: 'Message',
                ui: 'confirm',
                commit: 'onMessage'
            }, {
                iconCls: 'x-fa fa-phone',
                text: 'Call',
                ui: 'action',
                commit: 'onCall',

                undoable: true
            }, {
                iconCls: 'x-fa fa-trash-alt',
                text: 'Delete',
                ui: 'decline',

                precommit: 'onDeleteItem',
                commit: 'onCommitDeleteItem',
                revert: 'onUndoDeleteItem',
                undoable: true
            }]
        }
    }
});
