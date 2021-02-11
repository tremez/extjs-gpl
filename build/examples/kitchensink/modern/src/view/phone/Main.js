Ext.define('KitchenSink.view.phone.Main', {
    extend: 'Ext.dataview.NestedList',

    requires: [
        'Ext.TitleBar',
        'Ext.ActionSheet'
    ],

    id: 'cardPanel',

    title: 'Kitchen Sink',
    scrollable: true,
    classCls: 'main-nav',
    layout: {
        type: 'card',
        animation: {
            duration: 250,
            easing: 'ease-in-out'
        }
    },
    backButton: {
        cls: Ext.theme.is.iOS ? 'nested-list-back-btn' : ''
    },
    store: 'Navigation',
    toolbar: {
        id: 'mainNavigationBar',
        xtype: 'titlebar',
        docked: 'top',
        title: 'Kitchen Sink',

        items: [{
            align: 'right',
            id: 'materialThemeMenuButton',
            hidden: true,
            menu: {
                itemId: 'materialThemeMenu',
                xtype: 'actionsheet',
                hideOnMaskTap: true
            },
            iconCls: 'palette',
            arrow: false
        }, {
            xtype: 'button',
            align: 'right',
            action: 'burger',
            menu: Ext.theme.is.Material
                ? {
                    itemId: 'burgerButtonMenu'
                }
                : {
                    xtype: 'actionsheet',
                    side: 'right',
                    itemId: 'burgerButtonMenu',
                    width: 200,
                    viewportMenuConfigs: {
                        right: {
                            reveal: false
                        }
                    }
                },
            iconCls: 'menu',
            arrow: false
        }]
    }
});
