/**
 * This example shows data binding using formatters in expressions.
 */
Ext.define('KitchenSink.view.binding.AlgebraFormatters', {
    extend: 'Ext.Container',
    xtype: 'binding-algebra-formatters',

    viewModel: {
        type: 'default',
        data: {
            x: 10.52,
            y: 10.52
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
        xtype: 'spinnerfield',
        stepValue: 1,
        readOnly: false,
        label: 'y',
        bind: '{y}'
    }, {
        label: 'Single',
        bind: '{ ( x > y ) ? ( x:number("0") ) : ( (y/2):number("0.00") ) }'
    }, {
        label: 'Chained',
        bind: '{ (x*y*100):fileSize:lowercase }'
    }, {
        label: 'Nested',
        bind: '{ (x*y):currency( "USD":lowercase, (x/y):round(0):lessThanElse(20, 2, 5) ) }'
    }]
});
