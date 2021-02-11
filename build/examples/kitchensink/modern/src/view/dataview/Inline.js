Ext.define('KitchenSink.view.dataview.Inline', {
    extend: 'Ext.Container',
    xtype: 'dataview-inline',

    requires: [
        'KitchenSink.model.Speaker',
        'Ext.dataview.plugin.ItemTip'
    ],

    //<example>
    otherContent: [{
        type: 'Model',
        path: 'modern/src/model/Speaker.js'
    }],

    profiles: {
        defaults: {
            height: 400,
            width: 400
        },
        phone: {
            defaults: {
                height: undefined,
                width: undefined
            }
        }
    },
    //</example>

    height: '${height}',
    layout: 'fit',
    width: '${width}',

    items: [{
        xtype: 'dataview',
        inline: true,
        cls: 'dataview-inline',
        itemTpl: '<div class="img" style="background-image: url({photo});"></div>',
        store: 'Speakers',
        plugins: {
            dataviewtip: {
                align: 'tl-bl',
                maxHeight: 200,
                width: 300,
                scrollable: 'y',
                delegate: '.img',
                allowOver: true,
                anchor: true,
                bind: '{record}',
                cls: 'dataview-basic',
                tpl: '<strong>Affiliation</strong><div class="info">{affiliation}</div>' +
                    '<strong>Position</strong><div class="info">{position}</div>' +
                    '<strong>Bio</strong><div class="info">{bio:substr(0, 100)}</div>'
            }
        }
    }]
});
