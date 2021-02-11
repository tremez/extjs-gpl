/**
 * Demonstrates usage of a card layout.
 */
Ext.define('KitchenSink.view.layout.CardIndicator', {
    extend: 'Ext.Container',
    xtype: 'layout-card-indicator',
    controller: 'layout-card-indicator',

    requires: [
        'Ext.layout.Card'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/layout/CardIndicatorController.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            height: 300,
            padding: 8,
            shadow: true,
            tbarPadding: '5 8',
            width: 400
        },
        ios: {
            buttonShadow: undefined,
            tbarPadding: undefined
        },
        phone: {
            defaults: {
                height: undefined,
                padding: undefined,
                shadow: undefined,
                tbarPadding: '12 8',
                width: undefined
            },
            ios: {
                tbarPadding: undefined
            }
        }
    },

    padding: '${padding}',
    shadow: false,
    //</example>

    height: '${height}',
    layout: 'fit',
    width: '${width}',

    viewModel: {
        data: {
            tapMode: 'direction'
        }
    },

    items: [{
        xtype: 'panel',
        reference: 'panel',
        shadow: '${shadow}',
        bodyPadding: 15,

        layout: {
            type: 'card',
            // The controller inserts this indicator in our bbar
            // and we publish the active index and card count
            // so we can easily disable Next/Prev buttons.
            indicator: {
                reference: 'indicator',
                bind: {
                    tapMode: '{tapMode}'
                },
                publishes: [
                    'activeIndex',
                    'count'
                ]
            }
        },

        items: [{
            html: '<h2>Welcome to the Demo Wizard!</h2><p>Step 1 of 3</p><p>Please click the "Next" button to continue...</p>'
        }, {
            html: '<p>Step 2 of 3</p><p>Almost there.  Please click the "Next" button to continue...</p>'
        }, {
            html: '<h1>Congratulations!</h1><p>Step 3 of 3 - Complete</p>'
        }],

        bbar: {
            reference: 'bbar',
            items: [{
                text: '&laquo; Previous',
                handler: 'onPrevious',
                bind: {
                    disabled: '{!indicator.activeIndex}'
                }
            },
                // the indicator is inserted here
                    {
                        text: 'Next &raquo;',
                        handler: 'onNext',
                        bind: {
                            disabled: '{indicator.activeIndex == indicator.count - 1}'
                        }
                    }]
        }
    }, {
        xtype: 'toolbar',
        docked: 'top',
        ui: 'transparent',
        padding: '${tbarPadding}',
        layout: 'hbox',

        defaults: {
            shadow: '${buttonShadow}',
            ui: 'action'
        },

        items: [{
            xtype: 'segmentedbutton',
            bind: '{tapMode}',

            width: 200,

            defaults: {
                flex: 1,
                ui: 'action'
            },

            items: [{
                text: 'Direction',
                value: 'direction',
                tooltip: 'Indicator taps step one card based on tap location'
            }, {
                text: 'Item',
                value: 'item',
                tooltip: 'Indicator taps will jump to a card if its dot is tapped'
            }]
        }]
    }]
});
