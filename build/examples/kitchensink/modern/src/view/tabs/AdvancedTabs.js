/**
 * Demonstrates usage of the Ext.tab.Panel component with the tabBar docked to the
 * different positions of the screen.
 */
Ext.define('KitchenSink.view.tabs.AdvancedTabs', {
    extend: 'Ext.Panel',
    xtype: 'advanced-tabs',

    height: 600,
    width: 800,

    controller: 'advanced-tabs',
    title: 'Advanced Tabs',
    padding: 64,
    defaults: {
        margin: 16
    },
    layout: 'fit',
    viewModel: {
        data: {
            orient: true,
            rotation: 'default',
            position: 'top'
        }
    },
    items: [{
        xtype: 'toolbar',
        docked: 'top',
        items: [{
            xtype: 'label',
            html: 'Rotation:',
            margin: '0 6 0 0'
        }, {
            xtype: 'segmentedbutton',
            bind: '{rotation}',
            items: [{
                text: 'Left',
                value: 'left'
            }, {
                text: 'None',
                value: 'none'
            }, {
                text: 'Right',
                value: 'right'
            }, {
                text: 'Default',
                value: "default"
            }]
        }]
    }, {
        xtype: 'toolbar',
        docked: 'top',
        items: [{
            xtype: 'label',
            html: 'Position:',
            margin: '0 6 0 0'
        },
                {
                    xtype: 'segmentedbutton',
                    bind: '{position}',
                    items: [{
                        text: 'Left',
                        value: 'left'
                    }, {
                        text: 'Top',
                        value: 'top'
                    }, {
                        text: 'Right',
                        value: 'right'
                    }, {
                        text: 'Bottom',
                        value: 'bottom'
                    }]
                }, {
                    xtype: 'spacer',
                    width: 32
                }, {
                    xtype: 'togglefield',
                    label: 'Orient Animation',
                    bind: '{orient}'
                }, {
                    xtype: 'button',
                    text: 'Add Tab',
                    handler: 'onAddTab'
                }
        ]
    },
            {
                xtype: 'tabpanel',
                reference: 'tabpanel',
                bind: {
                    autoOrientAnimation: '{orient}',
                    tabRotation: '{rotation}',
                    tabBarPosition: '{position}'
                },
                items: [{
                    title: 'Tab 1',
                    iconAlign: 'left',
                    iconCls: 'x-fa fa-home',
                    html: 'Tab 1 Content'
                }, {
                    title: 'Tab 2',
                    iconAlign: 'left',
                    iconCls: 'x-fa fa-home',
                    html: 'Tab 2 Content'
                }]
            }
    ]
});
