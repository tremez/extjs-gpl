Ext.define('KitchenSink.view.dataview.Horizontal', {
    extend: 'Ext.Container',
    xtype: 'dataview-horizontal',

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
            width: 430
        },
        phone: {
            defaults: {
                width: undefined
            }
        }
    },

    cls: 'ks-basic',
    //</example>

    layout: 'fit',
    width: '${width}',
    autoSize: true,

    items: [{
        xtype: 'dataview',
        cls: 'dataview-horizontal',
        inline: {
            wrap: false
        },
        itemTpl: '<div class="img" style="background-image: url({photo});"></div>' +
                 '<div class="name">{first_name}<br/>{last_name}</div>',
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
