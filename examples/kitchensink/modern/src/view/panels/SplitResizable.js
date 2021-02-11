Ext.define('KitchenSink.view.panels.SplitResizable', {
    extend: 'Ext.container.Container',
    xtype: 'panel-splitresize',

    requires: [
        'Ext.panel.Resizer',
        'Ext.Toolbar'
    ],

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    defaultType: 'panel',

    items: [{
        title: 'Dock Left',
        docked: 'left',
        minWidth: 200,
        resizable: {
            split: true,
            edges: 'east'
        }
    }, {
        title: 'Dock Right',
        docked: 'right',
        minWidth: 200,
        resizable: {
            split: true,
            edges: 'west'
        }
    }, {
        title: 'Dock Top',
        docked: 'top',
        minHeight: 150,
        resizable: {
            split: true,
            edges: 'south'
        }
    }, {
        title: 'Unresizable region',
        flex: 1
    }, {
        title: 'Dock Bottom',
        docked: 'bottom',
        minHeight: 150,
        resizable: {
            split: true,
            edges: 'north'
        }
    }]
});
