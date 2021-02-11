Ext.define('KitchenSink.view.binding.ChainedSelect', {
    extend: 'Ext.Container',
    xtype: 'binding-combo-chaining',

    viewModel: {
        type: 'binding-chainedselect'
    },

    //<example>
    otherContent: [{
        type: 'ViewModel',
        path: 'modern/src/view/binding/ChainedSelectModel.js'
    }, {
        type: 'Store',
        path: 'app/store/Countries.js'
    }, {
        type: 'Store',
        path: 'app/store/CountryStates.js'
    }],

    profiles: {
        defaults: {
            width: 400
        },
        phone: {
            defaults: {
                width: undefined
            }
        }
    },

    cls: 'demo-solid-background',
    //</example>

    padding: 20,
    referenceHolder: true,
    width: '${width}',
    autoSize: true,

    items: [{
        xtype: 'fieldset',
        items: [{
            xtype: 'selectfield',
            label: 'Country',
            placeholder: 'Choose a country',
            reference: 'countryField',
            valueField: 'name',
            displayField: 'name',
            bind: {
                store: '{countries}'
            }
        }, {
            xtype: 'selectfield',
            label: 'States',
            valueField: 'abbr',
            displayField: 'state',
            bind: {
                store: '{states}',
                placeholder: '{countryField.value === "USA" ? "Chose a state" : countryField.value === "Canada" ? "Chose a province" : ""}'
            }
        }, {
            xtype: 'component',
            margin: '20 0 0',
            html: 'The states store contains all US states and Canadian provinces, however it filters based upon the ' +
                'id of the selected record in the country field.'
        }]
    }]
});
