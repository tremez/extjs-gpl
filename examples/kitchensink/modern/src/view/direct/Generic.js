/*
 * This example shows generic Ext Direct remoting and polling.
 */
Ext.define('KitchenSink.view.direct.Generic', {
    extend: 'Ext.Container',
    xtype: 'direct-generic',
    controller: 'direct-generic',

    viewModel: {
        data: {
            interval: 3
        },
        formulas: {
            intervalText: function(get) {
                var interval = get('interval');

                return interval ? interval + ' sec' : 'Paused';
            }
        }
    },

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/direct/GenericController.js'
    }, {
        type: 'Base Controller',
        path: 'modern/src/view/direct/BaseController.js'
    }, {
        type: 'Server Class',
        path: 'data/direct/source.php?file=testaction'
    }, {
        type: 'Server Config',
        path: 'data/direct/source.php?file=config'
    }],

    profiles: {
        defaults: {
            arrow: undefined,
            height: 400,
            padding: 8,
            shadow: true,
            tbarShadow: true,
            width: 500
        },
        phone: {
            defaults: {
                arrow: false,
                height: undefined,
                padding: undefined,
                shadow: undefined,
                tbarShadow: undefined,
                width: undefined
            },
            ios: {
                tbarPadding: undefined
            }
        }
    },

    padding: '${padding}', // give room for the grid's shadow
    shadow: false,
    //</example>

    height: '${height}',
    layout: 'fit',
    width: '${width}',

    items: [{
        xtype: 'panel',
        shadow: '${shadow}',
        tpl: '<p style="margin: 3px 0 0 0">{data}</p>',
        tplWriteMode: 'append',
        bodyPadding: 10,
        reference: 'panel',
        scrollable: true,
        title: 'Remote Call Log'
    }, {
        xtype: 'toolbar',
        docked: 'top',
        ui: 'transparent',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        defaults: function(cfg) {
            cfg = Ext.apply({
                shadow: '${tbarShadow}',
                margin: '0 10 0 0'
            }, cfg);

            if (cfg.xtype === 'button') {
                cfg.ui = 'action';
            }

            return cfg;
        },
        items: [{
            xtype: 'button',
            arrow: '${arrow}',
            bind: '{intervalText}',
            menu: {
                listeners: {
                    delegate: 'menuradioitem',
                    checkchange: 'onIntervalChange'
                },
                items: [{
                    xtype: 'menuradioitem',
                    group: 'interval',
                    text: 'Pause',
                    value: null
                }].concat((function(i, length, cfg) {
                    var items = [],
                        item;

                    for (; i < length; i++) {
                        item = Ext.apply({
                            text: i + ' sec',
                            value: i
                        }, cfg);

                        if (i === 1) {
                            item.separator = true;
                        }
                        else if (i === 3) {
                            item.checked = true;
                        }

                        items.push(item);
                    }

                    return items;
                })(1, 11, {
                    xtype: 'menuradioitem',
                    group: 'interval'
                }))
            }
        }, {
            xtype: 'button',
            text: 'Echo',
            menu: [{
                xtype: 'textfield',
                directAction: 'doEcho',
                placeholder: 'Echo input',
                listeners: {
                    specialkey: 'onFieldSpecialKey'
                }
            }, {
                xtype: 'button',
                ui: 'action',
                text: 'Echo',
                handler: 'onButtonClick'
            }]
        }, {
            xtype: 'button',
            text: 'Multiply',
            menu: [{
                xtype: 'textfield',
                directAction: 'doMultiply',
                placeholder: 'Multiply x 8',
                listeners: {
                    specialkey: 'onFieldSpecialKey'
                }
            }, {
                xtype: 'button',
                ui: 'action',
                text: 'Multiply',
                handler: 'onButtonClick'
            }]
        }]
    }]
});
