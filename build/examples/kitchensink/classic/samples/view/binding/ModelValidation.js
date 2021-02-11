/**
 * This example shows simple data binding to models (Ext.data.Model). When the value is
 * changed by the user, the change is reflected to the model and is then validated. The
 * validation is reflected back to the form field to which the value is bound. The
 * validation is based on the length of the field. By looking at the model code, you can
 * see the validator that is attached to the field.
 */
Ext.define('KitchenSink.view.binding.ModelValidation', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.binding-model-validation',
    //<example>
    otherContent: [{
        type: 'Model',
        path: 'app/model/Company.js'
    }],

    defaults: {
        labelWidth: 50
    },
    width: 300,
    bodyPadding: '${bodyPadding}',
    //</example>

    profiles: {
        classic: {
            width: 'auto',
            bodyPadding: 10
        },
        neptune: {
            width: 'auto',
            bodyPadding: 10
        },
        graphite: {
            width: 'auto',
            bodyPadding: 10
        },
        'classic-material': {
            width: 260,
            bodyPadding: 20
        }
    },

    title: 'Company Details',

    // This connects bound form fields to the associated model validators:
    modelValidation: true,

    session: true,
    viewModel: {
        links: {
            theCompany: {
                type: 'Company',
                id: 1
            }
        }
    },

    items: [{
        xtype: 'textfield',
        fieldLabel: 'Name',
        msgTarget: 'side',
        width: '${width}',
        bind: '{theCompany.name}'  // three-way: read, write, validate
    }]
});
