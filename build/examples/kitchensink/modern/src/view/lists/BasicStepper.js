Ext.define('KitchenSink.view.lists.BasicStepper', {
    extend: 'Ext.dataview.List',
    xtype: 'basic-step-swiper',
    controller: 'basic-swiper',

    requires: [
        'Ext.dataview.listswiper.ListSwiper',
        'Ext.dataview.listswiper.Stepper'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/lists/BasicSwiperController.js'
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
    infinite: true,
    grouped: false,
    itemConfig: {
        height: 50
    },

    plugins: {
        listswiper: {
            defaults: {
                ui: 'action'
            },
            widget: {
                xtype: 'listswiperstepper'
            },

            left: [{
                iconCls: 'x-fa fa-phone',
                text: 'Call',
                ui: 'action',
                commit: 'onCall'
            }],

            right: [{
                iconCls: 'x-fa fa-envelope',
                ui: 'confirm',
                text: 'Message',
                commit: 'onMessage'
            }, {
                iconCls: 'x-fa fa-cog',
                text: 'Settings',
                ui: 'action',
                commit: 'onGear'
            }]
        }
    }
});
