Ext.define('KitchenSink.view.panels.BasicPanel', {
    extend: 'Ext.Container',
    xtype: 'panel-basic',

    requires: [
        'Ext.layout.VBox'
    ],

    //<example>
    profiles: {
        defaults: {
            height: 400,
            margin: 10,
            padding: 8,
            shadow: true,
            width: 700
        },
        phone: {
            defaults: {
                height: undefined,
                margin: undefined,
                padding: undefined,
                shadow: undefined,
                width: undefined
            }
        }
    },

    padding: '${padding}',
    shadow: false,
    //</example>

    height: '${height}',
    width: '${width}',

    layout: {
        type: 'vbox',
        pack: 'center',
        align: 'stretch'
    },

    defaults: {
        bodyPadding: 10
    },

    items: [{
        layout: {
            type: 'hbox',
            pack: 'center',
            align: 'stretch'
        },
        autoSize: true,
        defaults: {
            flex: 1,
            bodyPadding: 10,
            autoSize: true,
            html: Ext.os.is.Phone ? KitchenSink.DummyText.shortText : KitchenSink.DummyText.mediumText
        },
        items: [{
            xtype: 'panel',
            shadow: '${shadow}',
            margin: '${margin}'
        }, {
            xtype: 'panel',
            shadow: '${shadow}',
            title: 'Title',
            margin: '${margin}'
        }]
    }, {
        layout: {
            type: 'hbox',
            pack: 'center',
            align: 'stretch'
        },
        autoSize: true,
        defaults: {
            flex: 1,
            bodyPadding: 10,
            autoSize: true,
            html: Ext.os.is.Phone ? KitchenSink.DummyText.shortText : KitchenSink.DummyText.mediumText
        },
        items: [{
            xtype: 'panel',
            shadow: '${shadow}',
            margin: '${margin}',
            title: 'Built in Tools',
            html: Ext.os.is.Phone ? KitchenSink.DummyText.shortText : KitchenSink.DummyText.mediumText,
            tools: [
                //<example>
                /*
                    { type: 'close'},
                    { type: 'minimize'},
                    { type: 'maximize'},
                    { type: 'restore'},
                    { type: 'toggle'},
                    { type: 'toggle'},
                    { type: 'gear'},
                    { type: 'prev'},
                    { type: 'next'},
                    { type: 'pin'},
                    { type: 'unpin'},
                    { type: 'right'},
                    { type: 'left'},
                    { type: 'down'},
                    { type: 'up'},
                    { type: 'refresh'},
                    { type: 'plus'},
                    { type: 'minus'},
                    { type: 'menu'},
                    { type: 'search'},
                    { type: 'save'},
                    { type: 'help'},
                    { type: 'print'},
                    { type: 'expand'},
                    { type: 'collapse'},
                    { type: 'resize'},
                    { type: 'move'}
                    */
                //</example>
                { type: 'minimize' },
                { type: 'refresh' },
                { type: 'search' },
                { type: 'save' },
                { type: 'menu' }
            ]
        }, {
            xtype: 'panel',
            shadow: '${shadow}',
            margin: '${margin}',
            title: 'Custom Tools using iconCls',
            html: Ext.os.is.Phone ? KitchenSink.DummyText.shortText : KitchenSink.DummyText.mediumText,
            autoSize: true,
            tools: [
                { iconCls: 'x-fa fa-wrench' },
                { iconCls: 'x-fa fa-reply' },
                { iconCls: 'x-fa fa-reply-all' }
            ]
        }]
    }]
});
