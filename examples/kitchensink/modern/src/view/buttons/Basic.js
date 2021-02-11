/**
 * Demonstrates a range of Button options the framework offers out of the box
 */
Ext.define('KitchenSink.view.buttons.Basic', {
    extend: 'Ext.Container',
    xtype: 'buttons-basic',

    requires: [
        'Ext.layout.HBox',
        'Ext.layout.VBox',
        'Ext.Button'
    ],

    //<example>
    profiles: {
        defaults: {
            labelCls: 'button-group-label button-group-right',
            labelPadding: '25 10 0 0',
            labelProperty: 'width',
            layout: 'hbox',
            iconOnlyUI: undefined,
            width: 530
        },
        material: {
            iconOnlyUI: 'round'
        },
        phone: {
            defaults: {
                labelCls: 'button-group-label',
                labelPadding: undefined,
                labelProperty: undefined,
                layout: 'vbox',
                width: undefined
            }
        }
    },

    cls: 'demo-buttons-basic demo-solid-background',
    //</example>

    scrollable: 'y',
    width: '${width}',
    autoSize: true,

    defaults: {
        margin: '10 20',
        autoSize: true,
        layout: {
            type: '${layout}'
        }
    },

    items: [{
        margin: '20 20 10',
        items: [{
            xtype: 'component',
            cls: '${labelCls}',
            padding: '${labelPadding}',
            '${labelProperty}': 75,
            html: 'Default'
        }, {
            xtype: 'container',
            cls: 'button-group',
            flex: 1,
            minHeight: 55,
            defaultType: 'button',
            defaults: {
                margin: '0 10'
            },
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-around'
            },
            items: [{
                margin: '0 10 0 20',
                text: 'Normal'
            }, {
                text: 'Badge',
                badgeText: '2'
            }, {
                margin: '0 20 0 10',
                text: 'Disabled',
                disabled: true
            }]
        }]
    }, {
        items: [{
            xtype: 'component',
            cls: '${labelCls}',
            padding: '${labelPadding}',
            '${labelProperty}': 75,
            html: 'Alt'
        }, {
            xtype: 'container',
            cls: 'button-group alt',
            flex: 1,
            minHeight: 55,
            defaultType: 'button',
            defaults: {
                margin: '0 10',
                ui: 'alt'
            },
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-around'
            },
            items: [{
                margin: '0 10 0 20',
                text: 'Normal'
            }, {
                text: 'Badge',
                badgeText: '2'
            }, {
                margin: '0 20 0 10',
                text: 'Disabled',
                disabled: true
            }]
        }]
    }, {
        items: [{
            xtype: 'component',
            cls: '${labelCls}',
            padding: '${labelPadding}',
            '${labelProperty}': 75,
            html: 'Raised'
        }, {
            xtype: 'container',
            cls: 'button-group',
            flex: 1,
            minHeight: 55,
            defaultType: 'button',
            defaults: {
                margin: '0 10',
                ui: 'raised'
            },
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-around'
            },
            items: [{
                margin: '0 10 0 20',
                text: 'Normal'
            }, {
                text: 'Badge',
                badgeText: '2'
            }, {
                margin: '0 20 0 10',
                text: 'Disabled',
                disabled: true
            }]
        }]
    }, {
        items: [{
            xtype: 'component',
            cls: '${labelCls}',
            padding: '${labelPadding}',
            '${labelProperty}': 75,
            html: 'Menu'
        }, {
            xtype: 'container',
            cls: 'button-group',
            flex: 1,
            minHeight: 55,
            defaults: {
                margin: '0 10'
            },
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-around'
            },
            items: [{
                xtype: 'button',
                margin: '0 10 0 20',
                text: 'Normal',
                menu: [{
                    text: 'Menu Item'
                }]
            }, {
                xtype: 'button',
                text: 'Badge',
                badgeText: '2',
                menu: [{
                    text: 'Menu Item'
                }]
            }, {
                xtype: 'button',
                margin: '0 20 0 10',
                text: 'Disabled',
                disabled: true,
                menu: [{
                    text: 'Menu Item'
                }]
            }]
        }]
    }, {
        margin: '10 20 20',
        items: [{
            xtype: 'component',
            cls: '${labelCls}',
            padding: '${labelPadding}',
            '${labelProperty}': 75,
            html: 'Icon'
        }, {
            xtype: 'container',
            cls: 'button-group',
            flex: 1,
            minHeight: 55,
            defaultType: 'button',
            defaults: {
                margin: '0 10'
            },
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-around'
            },
            items: [{
                margin: '0 10 0 20',
                iconCls: 'x-fa fa-home',
                ui: '${iconOnlyUI}'
            }, {
                iconCls: 'x-fa fa-home',
                badgeText: '2',
                ui: '${iconOnlyUI}'
            }, {
                margin: '0 20 0 10',
                iconCls: 'x-fa fa-home',
                ui: '${iconOnlyUI}',
                disabled: true
            }]
        }]
    }]
});
