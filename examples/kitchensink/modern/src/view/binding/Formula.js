Ext.define('KitchenSink.view.binding.Formula', {
    extend: 'Ext.Container',
    xtype: 'binding-formulas',

    viewModel: {
        type: 'binding-formula'
    },

    //<example>
    otherContent: [{
        type: 'ViewModel',
        path: 'modern/src/view/binding/FormulaModel.js'
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
    width: '${width}',
    autoSize: true,

    items: [{
        xtype: 'spinnerfield',
        label: 'Number',
        stepValue: 1,
        bind: '{x}'
    }, {
        xtype: 'textfield',
        readOnly: true,
        label: 'Times 2',
        bind: '{x} * 2 = {twice}'
    }, {
        xtype: 'textfield',
        readOnly: true,
        label: 'Times 4',
        bind: '{x} * 4 = {quad}'
    }, {
        xtype: 'component',
        margin: '10 0 0',
        instructions: 'As the field changes, the formula calculates the 2x and 4x values.'
    }]
});
