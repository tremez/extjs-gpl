Ext.define('KitchenSink.view.lists.BasicAccordion', {
    extend: 'Ext.dataview.List',
    xtype: 'basic-accordion-swiper',
    controller: 'basic-swiper',

    requires: [
        'Ext.dataview.listswiper.ListSwiper'
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

            left: [{
                iconCls: 'x-fa fa-phone',
                text: 'Call',
                commit: 'onCall'
            }],

            right: [{
                iconCls: 'x-fa fa-envelope',
                ui: 'alt confirm',
                text: 'Message',
                commit: 'onMessage'
            }, {
                iconCls: 'x-fa fa-cog',
                text: 'Gear',
                commit: 'onGear'
            }]
        }
    }
});
