/**
 * Demonstrates a TimePanel
 */
Ext.define('KitchenSink.view.panels.TimePanel', {
    extend: 'Ext.Container',
    xtype: 'panel-time',

    requires: [
        'Ext.panel.Time'
    ],

    height: '100%',
    width: '100%',
    layout: {
        type: 'box',
        pack: 'center',
        align: 'center'
    },
    scrollable: true,

    viewModel: {
        data: {
            meridiem: true
        }
    },

    controller: 'panels-timepanel',

    // <example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/panels/TimePanelController.js'
    }],
    // </example>

    items: [{
        xtype: 'toolbar',
        docked: 'top',
        ui: 'transparent',
        responsiveConfig: {
            'width < 500': {
                layout: {
                    type: 'box',
                    vertical: true,
                    pack: 'center',
                    align: 'center'
                }
            },
            'width >= 500': {
                layout: {
                    type: 'hbox',
                    vertical: false,
                    pack: 'center',
                    align: 'center'
                }
            }
        },
        defaults: {
            xtype: 'togglefield',
            padding: '0 10',
            cls: 'demo-solid-background'
        },
        items: [
            {
                boxLabel: 'is Meridiem (12 hour)',
                name: 'hourformat',
                reference: 'hourformat',
                bind: {
                    value: '{meridiem}'
                },
                listeners: {
                    change: 'changeHourFormat'
                }
            },
            {
                boxLabel: 'PM hours Inside',
                name: 'pminside',
                bind: {
                    disabled: '{meridiem}'
                },
                listeners: {
                    change: 'setPMHoursInside'
                }
            }]
    }, {
        xtype: 'timepanel',
        reference: 'timepanel',
        meridiem: true,
        alignFormatInside: false,
        shadow: true
    }]
});
