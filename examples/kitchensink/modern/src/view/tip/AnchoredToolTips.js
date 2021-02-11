Ext.define('KitchenSink.view.tip.AnchoredToolTips', {
    extend: 'Ext.Container',
    xtype: 'anchored-tooltips',
    controller: 'anchored-tooltips',

    requires: [
        'KitchenSink.view.tip.AnchoredToolTipsController',
        'KitchenSink.data.ToolTips'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/tip/AnchoredToolTipsController.js'
    }],

    profiles: {
        defaults: {
            height: 200,
            width: 200
        },
        phone: {
            defaults: {
                height: undefined,
                width: undefined
            }
        }
    },

    cls: 'demo-solid-background',
    //<example>

    height: '${height}',
    width: '${width}',

    layout: {
        type: 'vbox',
        align: 'middle',
        pack: 'center'
    },

    defaultType: 'button',
    defaults: {
        margin: '10 0',
        minWidth: 150
    },

    items: [{
        text: 'Basic Tip',
        tooltip: {
            html: 'A simple tooltip'
        }
    }, {
        text: 'Ajax Tip',
        tooltip: {
            autoCreate: true,
            showOnTap: Ext.supports.Touch,
            anchorToTarget: false,
            width: 200,
            dismissDelay: 15000,
            listeners: {
                beforeshow: 'beforeAjaxTipShow'
            }
        }
    }, {
        text: 'Anchor below',
        tooltip: {
            html: 'The anchor is centered',
            anchorToTarget: true,
            align: 'tc-bc',
            anchor: true
        }
    }]
});
