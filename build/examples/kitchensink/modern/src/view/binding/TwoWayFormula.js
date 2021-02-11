Ext.define('KitchenSink.view.binding.TwoWayFormula', {
    extend: 'Ext.Container',
    xtype: 'binding-two-way-formulas',

    viewModel: {
        type: 'binding-twowayformula'
    },

    //<example>
    otherContent: [{
        type: 'ViewModel',
        path: 'modern/src/view/binding/TwoWayFormulaModel.js'
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

    defaultType: 'spinnerfield',
    padding: 10,
    width: '${width}',
    autoSize: true,

    items: [{
        label: 'Kelvin \u00b0',
        stepValue: 0.1,
        decimals: 1,
        bind: '{kelvin}'
    }, {
        label: 'Fahrenheit \u00b0',
        stepValue: 0.1,
        decimals: 1,
        bind: '{fahrenheit}'
    }, {
        label: 'Celcius \u00b0',
        stepValue: 0.1,
        decimals: 1,
        bind: '{celcius}'
    }, {
        xtype: 'component',
        margin: '10 0 0',
        html: 'The Celcius value is calculated from Kelvin. When the Celcius ' +
            'value changes, the Kelvin value is updated via the formula. ' +
            'The Fahrenheight value is calculated from Celcius. When the ' +
            'Fahrenheit value changes, the Celcius value is updated via the formula.'
    }]
});
