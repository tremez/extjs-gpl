/**
 * This example shows data binding using formulas that can be edited. That is, "virtual
 * properties"!
 */
Ext.define('KitchenSink.view.binding.TwoWayFormulas', {
    extend: 'Ext.panel.Panel',
    xtype: 'binding-two-way-formulas',
    //<example>
    otherContent: [{
        type: 'ViewModel',
        path: 'classic/samples/view/binding/TwoWayFormulasModel.js'
    }],
    bodyPadding: 10,
    //</example>

    profiles: {
        classic: {
            width: 450,
            numberfieldWidth: 100
        },
        neptune: {
            width: 450,
            numberfieldWidth: 100
        },
        graphite: {
            width: 550,
            numberfieldWidth: 100
        },
        'classic-material': {
            width: 550,
            numberfieldWidth: 150
        }
    },
    title: 'Two-Way Formulas',

    manageHeight: false,
    width: '${width}',
    frame: true,
    resizable: true,

    viewModel: {
        // Formulas are defined by the ViewModel:
        type: 'binding-two-way-formulas',

        data: {
            birthDate: new Date(1971, 4, 3),
            firstName: 'John',
            lastName: 'Doe'
        }
    },

    // The form layout makes labelWidth automatic
    layout: 'form',

    defaultType: 'textfield',
    items: [{
        fieldLabel: 'First Name',
        bind: '{firstName}'
    }, {
        fieldLabel: 'Last Name',
        bind: '{lastName}'
    }, {
        fieldLabel: 'Full Name (virtual)',
        bind: '{fullName}'
    }, {
        xtype: 'fieldcontainer',
        fieldLabel: 'Age',
        layout: {
            type: 'hbox',
            align: 'center'
        },
        items: [{
            xtype: 'numberfield',
            width: '${numberfieldWidth}',
            bind: '{age}',
            minValue: 0
        }, {
            xtype: 'slider',
            width: 80,
            margin: '0 0 0 8',
            bind: '{age}'
        }, {
            xtype: 'slider',
            width: 80,
            publishOnComplete: false,
            margin: '0 0 0 8',
            bind: '{age}'
        }]
    }, {
        xtype: 'datefield',
        format: 'm/d/Y',
        fieldLabel: 'Birth Date',
        bind: '{birthDate}',
        maxValue: new Date()
    }]
});
