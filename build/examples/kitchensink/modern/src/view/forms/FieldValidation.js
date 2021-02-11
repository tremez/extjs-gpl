/**
 * Demonstrates form field validation.
 */
Ext.define('KitchenSink.view.forms.FieldValidation', {
    extend: 'Ext.form.Panel',
    xtype: 'field-validation',
    controller: 'forms-fieldvalidation',
    title: 'User Profile',

    requires: [
        'Ext.field.Number',
        'Ext.field.Text',
        'Ext.field.Email',
        'Ext.data.validator.Url',
        'Ext.data.validator.IPAddress',
        'Ext.data.validator.CIDRv4',
        'Ext.data.validator.CIDRv6',
        'Ext.data.validator.Number',
        'Ext.data.validator.CurrencyUS',
        'Ext.data.validator.Phone',
        'Ext.data.validator.Date',
        'Ext.data.validator.Time',
        'Ext.data.validator.DateTime'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/forms/FieldValidationController.js'
    }],

    profiles: {
        defaults: {
            height: 500,
            width: 400
        },
        material: {
            width: 300
        },
        phone: {
            defaults: {
                height: undefined,
                width: undefined
            }
        }
    },
    //</example>

    bodyPadding: 20,
    defaultType: 'textfield',
    height: '${height}',
    scrollable: 'y',
    width: '${width}',

    buttons: [{
        text: 'Reset',
        handler: 'reset'
    }, {
        text: 'Submit',
        handler: 'submit'
    }],

    items: [{
        label: 'ID',
        placeholder: 'xxx-xxxx',
        required: true,
        validators: /[a-z0-9]{3}-[a-z0-9]{4}/
    }, {
        label: 'Name',
        required: true
    }, {
        xtype: 'datepickerfield',
        label: 'Date of Birth',
        required: true,
        validators: 'date'
    }, {
        xtype: 'fieldset',
        margin: '20 0 0',
        title: 'Contact Information',
        defaults: {
            xtype: 'textfield'
        },
        items: [{
            xtype: 'emailfield',
            label: 'Email',
            placeholder: 'sales@sencha.com',
            required: true,
            validators: 'email'
        }, {
            label: 'Phone Number',
            placeholder: '(xxx) xxx-xxxx',
            inputMask: '(999) 999-9999' // field is validated by this automatically
        }, {
            xtype: 'urlfield',
            label: 'Homepage',
            placeholder: 'https://www.sencha.com/',
            validators: 'url'
        }]
    }, {
        xtype: 'fieldset',
        margin: '20 0 0',
        title: 'Employment Information',
        defaults: {
            xtype: 'textfield'
        },
        items: [{
            label: 'Salary',
            placeholder: '$xx,xxx',
            validators: {
                type: 'currency-us',
                message: 'Invalid salary'
            }
        }, {
            label: 'Last Login',
            placeholder: 'YYYY/MM/DD hh:mm',
            validators: {
                type: 'datetime',
                message: 'Invalid date and/or time'
            }
        }, {
            xtype: 'numberfield',
            label: 'Rating',
            decimals: 0,
            validators: {
                type: 'range',
                min: 1,
                max: 5,
                minOnlyMessage: 'The rating must be at least {0}',
                maxOnlyMessage: 'The rating must be no more than than {0}',
                bothMessage: 'Invalid rating, must be between {0} and {1}'
            }
        }]
    }]
});
