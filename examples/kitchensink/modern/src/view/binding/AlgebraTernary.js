/**
 * This example shows data binding using ternary operators in expressions.
 */
Ext.define('KitchenSink.view.binding.AlgebraTernary', {
    extend: 'Ext.Container',
    xtype: 'binding-algebra-ternary',

    viewModel: {
        type: 'default',
        data: {
            x: 10,
            y: 11
        }
    },

    //<example>
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
        stepValue: 1,
        label: 'x',
        bind: '{x}'
    }, {
        xtype: 'spinnerfield',
        stepValue: 1,
        label: 'y',
        bind: '{y}'
    }, {
        xtype: 'textfield',
        readOnly: true,
        label: 'Calculated',
        bind: '{x > y ? "x is greater" : (x == y ? "x equals y" : "y is greater")}'
    }]
});
