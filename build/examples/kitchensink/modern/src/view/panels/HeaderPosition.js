Ext.define('KitchenSink.view.panels.HeaderPosition', {
    extend: 'Ext.Container',
    xtype: 'panel-headerposition',

    requires: [
        'Ext.SegmentedButton'
    ],

    viewModel: {
        data: {
            headerPosition: 'top'
        }
    },

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/panels/HandleResizableController.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            height: 400,
            padding: 8,
            shadow: true,
            segBtnMargin: '5 8',
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
                segBtnMargin: '12 8',
                width: undefined
            },
            ios: {
                tbarPadding: undefined
            }
        }
    },

    padding: '${padding}', // give room for the panel's shadow
    shadow: false,
    //</example>

    height: '${height}',
    layout: 'fit',
    width: '${width}',

    items: [{
        xtype: 'panel',
        shadow: '${shadow}',
        title: 'Panel Title',
        tools: [{
            type: 'print'
        }, {
            type: 'help'
        }],
        bind: {
            headerPosition: '{headerPosition}'
        }
    }, {
        xtype: 'segmentedbutton',
        docked: 'top',
        bind: '{headerPosition}',
        margin: '${segBtnMargin}',
        defaults: {
            flex: 1,
            ui: 'action'
        },
        items: [{
            text: 'Top',
            value: 'top'
        }, {
            text: 'Right',
            value: 'right'
        }, {
            text: 'Bottom',
            value: 'bottom'
        }, {
            text: 'Left',
            value: 'left'
        }]
    }]
});
