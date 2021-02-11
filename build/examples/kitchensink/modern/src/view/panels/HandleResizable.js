Ext.define('KitchenSink.view.panels.HandleResizable', {
    extend: 'Ext.Container',
    xtype: 'panel-handleresize',
    controller: 'panels-handleresizable',

    requires: [
        'Ext.panel.Resizer',
        'Ext.field.Checkbox'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/panels/HandleResizableController.js'
    }],

    profiles: {
        defaults: {
            height: '100%',
            width: '100%'
        },
        phone: {
            defaults: {
                height: undefined,
                width: undefined
            }
        }
    },

    height: '${height}',
    width: '${width}',
    //</example>

    items: [{
        xtype: 'panel',
        title: 'Resize Me',
        reference: 'resizePanel',
        border: true,
        width: '40%',
        height: '40%',
        resizable: {
            edges: 'all'
        },
        tbar: [{
            xtype: 'checkboxfield',
            checked: false,
            label: 'Dynamic',
            labelWidth: 'auto',
            labelAlign: 'right',
            listeners: {
                change: 'onDynamicChange'
            }
        }],
        listeners: {
            // TODO: EXT-294 to allow auto center
            delay: 1,
            initialize: function() {
                this.center();
            }
        }
    }]
});
