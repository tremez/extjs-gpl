/**
 * Data binding expressions can use the unary operators (!, +, - and @)
 * to convert their bound value into the desired replacement. The first
 * three are standard JavaScript operators.
 *
 * The "@" operator allows a bind expression to use a global variable
 * instead of a bound value. Be aware that changes to global variables
 * are not tracked by the bind system but can be useful for constants.
 */
Ext.define('KitchenSink.view.binding.AlgebraUnary', {
    extend: 'Ext.panel.Panel',
    xtype: 'binding-algebra-unary',

    title: 'Unary operators',

    width: '${width}',
    profiles: {
        classic: {
            width: 370,
            textWidth: 120
        },
        neptune: {
            width: 370,
            textWidth: 120
        },
        graphite: {
            width: 430,
            textWidth: 120
        },
        'classic-material': {
            width: 370,
            textWidth: 150
        }
    },
    bodyPadding: '10 20',
    frame: true,
    layout: 'form',

    viewModel: {
        data: {
            x: 1
        }
    },

    items: [{
        fieldLabel: 'Negate (!x)',
        bind: '{!x}'
    }, {
        fieldLabel: 'Unary plus (+x)',
        bind: '{+x}'
    }, {
        fieldLabel: 'Unary minus (-x)',
        bind: '{-x}'
    }, {
        fieldLabel: 'Globals',
        bind: 'Ext JS version: {@Ext.versions.ext.version}'
    }],

    defaultType: 'displayfield',

    tbar: {
        ui: 'footer',
        items: [{
            xtype: 'numberfield',
            fieldLabel: 'x',
            bind: '{x}',

            labelWidth: 20,
            margin: '0 0 0 10',
            width: '${textWidth}'
        }]
    }
});
