/**
 * Demonstrates a ComboBox with a remotely filtered data source
 */
Ext.define('KitchenSink.view.forms.InteractiveComboBox', {
    extend: 'Ext.Panel',
    xtype: 'form-interactive-combo',
    controller: 'form-interactive-combo',

    requires: [
        'Ext.field.ComboBox',
        'Ext.field.Container'
    ],

    //<example>
    otherContent: [{
        type: 'Model',
        path: 'app/model/ForumPost.js'
    }],

    profiles: {
        defaults: {
            width: 300
        },
        phone: {
            width: undefined
        }
    },
    //</example>

    bodyPadding: 20,
    width: '${width}',
    autoSize: true,

    viewModel: {
        data: {
            query: '2way'
        },

        stores: {
            myStore: {
                data: [
                    { "abbr": "AL", "name": "Alabamax" },
                    { "abbr": "AK", "name": "Alaskax" },
                    { "abbr": "AZ", "name": "Arizonax" }
                ]
            }
        }
    },

    items: [{
        xtype: 'containerfield',
        label: '!forceSelection',
        items: [{
            xtype: 'combobox',
            reference: 'freeTextCombo',
            store: [
                { "abbr": "AL", "name": "Alabama" },
                { "abbr": "AK", "name": "Alaska" },
                { "abbr": "AZ", "name": "Arizona" }
            ],
            queryMode: 'local',
            displayField: 'name',
            valueField: 'name',
            hideTrigger: true,
            clearable: true,

            listeners: {
                action: 'onFreeTextAction',
                change: 'onFreeTextChange',
                select: 'onFreeTextSelect'
            }
        }, {
            xtype: 'component',
            width: 100,
            bind: '{freeTextCombo.value}'
        }]
    }, {
        xtype: 'containerfield',
        label: 'forceSelection',
        items: [{
            xtype: 'combobox',
            reference: 'forcedSelectCombo',
            store: [
                { "abbr": "AL", "name": "Alabama" },
                { "abbr": "AK", "name": "Alaska" },
                { "abbr": "AZ", "name": "Arizona" }
            ],
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            hideTrigger: true,
            clearable: true,
            forceSelection: true,
            listeners: {
                change: 'onForceSelectChange',
                select: 'onForceSelectSelect'
            }
        }, {
            xtype: 'component',
            width: 100,
            bind: '{forcedSelectCombo.value}'
        }]
    }, {
        xtype: 'containerfield',
        label: 'auto clear !forceSelection',
        items: [{
            xtype: 'combobox',
            reference: 'autoClearCombo',
            store: [
                { "abbr": "AL", "name": "Alabama" },
                { "abbr": "AK", "name": "Alaska" },
                { "abbr": "AZ", "name": "Arizona" }
            ],
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            hideTrigger: true,
            clearable: true,
            forceSelection: false,
            listeners: {
                change: 'onAutoClearChange',
                select: 'onAutoClearSelect'
            }
        }, {
            xtype: 'component',
            bind: '{autoClearCombo.value}'
        }]
    }, {
        label: 'Bind',
        xtype: 'containerfield',
        items: [{
            xtype: 'combobox',
            reference: 'boundCombo',
            bind: {
                store: '{myStore}',
                value: '{query}'
            },
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            hideTrigger: true,
            clearable: true,
            forceSelection: false,
            listeners: {
                // change: 'onChange',
                // select: 'onSelect'
            }
        }, {
            xtype: 'component',
            width: 30,
            bind: '{query}'
        }, {
            xtype: 'component',
            width: 70,
            bind: '{boundCombo.selection.name}'
        }]
    }]
});
