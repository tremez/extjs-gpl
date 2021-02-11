/**
 * Demonstrates form field validation.
 */
Ext.define('KitchenSink.view.forms.FieldValidationAdv', {
    extend: 'Ext.form.Panel',
    xtype: 'field-validation-adv',
    controller: 'forms-fieldvalidationadv',
    title: 'Advanced Validations',

    requires: [
        'Ext.field.Number',
        'Ext.field.Text',
        'Ext.field.Email',
        'Ext.field.trigger.Menu',
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
        path: 'modern/src/view/forms/FieldValidationAdvController.js'
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

    bodyPadding: 20,
    defaultType: 'textfield',
    scollable: 'y',
    width: '${width}',
    autoSize: true,

    buttons: [{
        text: 'Reset',
        handler: 'reset'
    }, {
        text: 'Submit',
        handler: 'submit'
    }],

    items: [{
        label: 'Function',
        errorTarget: 'side',
        validators: function(value) {
            return /^[a-z]*$/.test(value) ? true : 'Invalid by function';
        }
    }, {
        label: '"method" type',
        errorTarget: 'error-div',
        validators: {
            type: 'method',
            fn: function(value) {
                return /^[a-z]*$/.test(value) ? true : 'Invalid by method type';
            }
        }
    }, {
        label: 'Resolved',
        errorTarget: 'under',
        validators: {
            type: 'controller',
            fn: 'controllerValidatorFn'
        }
    }, {
        label: 'RegEx',
        errorTarget: 'title',
        validators: /^[0-9]*$/
    }, {
        label: 'Format Type',
        errorTarget: 'error-div',
        validators: {
            type: 'format',
            message: 'Invalid format',
            matcher: /^[0-9]*$/
        }
    }, {
        xtype: 'emailfield',
        label: 'Email data, preventMark',
        /**
         * Field can be invalid but may not
         * want to have the UI show the invalid state.
         */
        preventMark: true,
        validators: {
            type: 'email',
            message: 'bogus email'
        }
    }, {
        required: true,
        label: 'Programmatic Test',
        errorTarget: 'error-div',
        reference: 'markInvalidTest',
        triggers: {
            fns: {
                type: 'menu',
                menu: [{
                    text: 'markInvalid()',
                    handler: 'callMarkInvalid'
                }, {
                    text: 'clearInvalid()',
                    handler: 'callClearInvalid'
                }, {
                    text: 'validate()',
                    handler: 'callValidate'
                }, {
                    text: 'isValid()',
                    handler: 'callIsValid'
                }]
            }
        }
    }, {
        xtype: 'component',
        id: 'error-div'
    }]
});
