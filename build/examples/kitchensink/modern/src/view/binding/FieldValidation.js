/**
 * This example shows simple data binding to models (Ext.data.Model). When the value is
 * changed by the user, the change is reflected to the model and is then validated by a
 * custom field type. The validation is reflected back to the form field to which the
 * value is bound.
 */
Ext.define('KitchenSink.view.binding.FieldValidation', {
    extend: 'Ext.Panel',
    xtype: 'binding-field-validation',
    title: 'Customer Details',

    viewModel: {
        links: {
            theCustomer: {
                type: 'Company',
                id: 1
            }
        }
    },

    // This connects bound form fields to the associated model validators:
    modelValidation: true,

    //<example>
    otherContent: [{
        type: 'Model',
        path: 'app/model/Company.js'
    }, {
        type: 'Field',
        path: 'app/model/field/PhoneNumber.js'
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
    //</example>

    bodyPadding: 10,
    width: '${width}',
    autoSize: true,

    items: [{
        xtype: 'textfield',
        label: 'Phone',
        errorTarget: 'side',
        bind: '{theCustomer.phone}'  // validation is from custom model field
    }]
});
