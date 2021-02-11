/**
 * This example shows data binding using unary operators in expressions.
 */
Ext.define('KitchenSink.view.binding.AlgebraUnary', {
    extend: 'Ext.Container',
    xtype: 'binding-algebra-unary',

    viewModel: {
        type: 'default',
        data: {
            x: 1
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

    defaults: {
        xtype: 'textfield',
        readOnly: true
    },

    items: [{
        xtype: 'spinnerfield',
        stepValue: 1,
        readOnly: false,
        label: 'x',
        bind: '{x}'
    }, {
        label: '!x',
        bind: '{!x}'
    }, {
        label: '+x',
        bind: '{+x}'
    }, {
        label: '-x',
        bind: '{-x}'
    }, {
        label: 'Globals',
        // expressions should have at least one token to be evaluated
        bind: 'Ext JS version: {@Ext.versions.ext.version}'
    }]
});
