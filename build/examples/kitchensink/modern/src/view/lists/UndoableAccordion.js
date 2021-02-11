Ext.define('KitchenSink.view.lists.UndoableAccordion', {
    extend: 'Ext.dataview.List',
    xtype: 'undoable-accordion-swiper',
    controller: 'undoable-swiper',

    requires: [
        'Ext.dataview.listswiper.ListSwiper'
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
            defaults: {
                width: 48
            },

            right: [{
                iconCls: 'x-fa fa-envelope',
                ui: 'alt confirm',
                commit: 'onMessage'
            }, {
                iconCls: 'x-fa fa-phone',
                ui: 'alt action',
                commit: 'onCall',
                undoable: true
            }, {
                iconCls: 'x-fa fa-trash-alt',
                ui: 'alt decline',

                precommit: 'onDeleteItem',
                commit: 'onCommitDeleteItem',
                revert: 'onUndoDeleteItem',
                undoable: true
            }]
        }
    }
});
