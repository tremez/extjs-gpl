Ext.define('KitchenSink.view.toolbars.OverflowBar', {
    extend: 'Ext.Toolbar',
    xtype: 'toolbar-overflowbar',

    layout: {
        overflow: 'scroller'
    },

    items: [{
        text: 'Menu',
        iconCls: 'x-fa fa-bars',
        menu: {
            maxHeight: 300,
            indented: false,
            layout: {
                overflow: 'scroller'
            },
            items: [{
                text: 'Menu Button 1'
            }, {
                text: 'Menu Button 2'
            }, {
                text: 'Menu Button 3'
            }, {
                text: 'Menu Button 4'
            }, {
                text: 'Menu Button 5'
            }, {
                text: 'Menu Button 6'
            }, {
                text: 'Menu Button 7'
            }, {
                text: 'Menu Button 8'
            }, {
                text: 'Menu Button 9'
            }, {
                text: 'Menu Button 10'
            }, {
                text: 'Menu Button 11'
            }, {
                text: 'Menu Button 12'
            }, {
                text: 'Menu Button 13'
            }, {
                text: 'Menu Button 14'
            }, {
                text: 'Menu Button 15'
            }]
        }
    }, {
        text: 'Cut',
        iconCls: 'x-fa fa-cut',
        menu: [{
            text: 'Cut Menu Item'
        }]
    }, {
        iconCls: 'x-far fa-copy',
        text: 'Copy'
    }, {
        text: 'Paste',
        iconCls: 'x-far fa-clipboard',
        menu: [{
            text: 'Paste Menu Item'
        }]
    }, {
        iconCls: 'x-far fa-file',
        text: 'Format'
    }, {
        iconCls: 'x-fa fa-bold',
        text: 'Bold'
    }, {
        iconCls: 'x-fa fa-underline',
        text: 'Underline',
        menu: [{
            text: 'Solid'
        }, {
            text: 'Dotted'
        }, {
            text: 'Dashed'
        }]
    }, {
        iconCls: 'x-fa fa-italic',
        text: 'Italic'
    }]
});
