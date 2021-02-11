/**
 * This example shows data binding using binary operators in expressions.
 */
Ext.define('KitchenSink.view.binding.AlgebraBinary', {
    extend: 'Ext.Container',
    xtype: 'binding-algebra-binary',

    viewModel: {
        type: 'default',
        data: {
            x: 10,
            y: 10
        }
    },

    //<example>
    profiles: {
        defaults: {
            labelAlign: 'top',
            padding: 20,
            width: 400
        },
        material: {
            labelAlign: undefined
        },
        phone: {
            defaults: {
                padding: '0 10',
                width: undefined
            }
        }
    },

    cls: 'demo-solid-background',
    //</example>

    padding: '${padding}',
    scrollable: 'y',
    width: '${width}',
    autoSize: true,

    defaults: {
        flex: 1,
        autoSize: true,
        defaults: {
            xtype: 'textfield',
            labelAlign: '${labelAlign}',
            readOnly: true
        }
    },

    layout: {
        type: 'hbox',
        align: 'start'
    },

    items: [{
        margin: '0 10 0 0',
        items: [{
            xtype: 'spinnerfield',
            stepValue: 1,
            readOnly: false,
            label: 'x',
            bind: '{x}'
        }, {
            label: 'x + y',
            bind: '{x + y}'
        }, {
            label: 'x * y',
            bind: '{x * y}'
        }, {
            label: 'x > y',
            bind: '{x > y}'
        }, {
            label: 'x >= y',
            bind: '{x >= y}'
        }, {
            label: 'x == y',
            bind: '{x == y}'
        }, {
            label: 'x === y',
            bind: '{x === y}'
        }, {
            label: 'x > y && y >= 10',
            bind: '{x > y && y >= 10}'
        }]
    }, {
        margin: '0 0 0 10',
        items: [{
            xtype: 'spinnerfield',
            stepValue: 1,
            readOnly: false,
            label: 'y',
            bind: '{y}'
        }, {
            label: 'x / y',
            bind: '{x / y}'
        }, {
            label: 'x < y',
            bind: '{x < y}'
        }, {
            label: 'x <= y',
            bind: '{x <= y}'
        }, {
            label: 'x != y',
            bind: '{x != y}'
        }, {
            label: 'x !== y',
            bind: '{x !== y}'
        }, {
            label: 'x > y || y >= 10',
            bind: '{x > y || y >= 10}'
        }]
    }]
});
