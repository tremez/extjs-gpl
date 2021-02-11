/**
 * This example shows how to chain two combo boxes together.
 */
Ext.define('KitchenSink.view.binding.ComboChaining', {
    extend: 'Ext.panel.Panel',
    xtype: 'binding-combo-chaining',
    //<example>
    otherContent: [{
        type: 'Store',
        path: 'app/store/Countries.js'
    }, {
        type: 'Store',
        path: 'app/store/CountryStates.js'
    }, {
        type: 'Model',
        path: 'app/model/tree/Country.js'
    }, {
        type: 'Model',
        path: 'app/model/State.js'
    }],
    bodyPadding: 10,
    //</example>

    profiles: {
        classic: {
            width: 350
        },
        neptune: {
            width: 350
        },
        graphite: {
            width: 480
        },
        'classic-material': {
            width: 480
        }
    },

    width: '${width}',
    layout: 'anchor',
    defaults: { anchor: '-30' },

    referenceHolder: true,
    viewModel: true,

    title: 'Location',

    items: [{
        xtype: 'combo',
        fieldLabel: 'Country',
        reference: 'country',
        displayField: 'name',
        valueField: 'name',
        publishes: 'value',
        store: {
            type: 'countries'
        }
    }, {
        xtype: 'combo',
        fieldLabel: 'State',
        displayField: 'state',
        valueField: 'abbrev',
        queryMode: 'remote',
        forceSelection: true,
        cls: 'combo-chaining-state',
        bind: {
            visible: '{country.value}',
            filters: {
                property: 'country',
                value: '{country.value}'
            }
        },
        store: {
            type: 'country-states'
        }
    }]
});
