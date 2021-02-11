/**
 * This example shows a common site registration form. The form appears to be simple but
 * it shows a few special things:
 *
 * - The display of field errors has been customized. Fields have `errorTarget: 'none'` so
 * the errors are not displayed with the individual fields; instead event listeners are
 * attached to the form panel to group up all error messages into a custom global error
 * indicator, with a persistent tooltip showing the error details.
 * - The password fields have custom validation attached to verify the user enters the
 * same value in both.
 */
Ext.define('KitchenSink.view.forms.CustomErrorHandling', {
    extend: 'Ext.form.Panel',
    xtype: 'form-customerrors',
    controller: 'forms-customerrors',
    title: 'Account Registration',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/forms/CustomErrorHandlingController.js'
    }],

    profiles: {
        defaults: {
            axisLockValue: undefined,
            width: 350
        },
        phone: {
            defaults: {
                width: undefined,
                axisLockValue: true
            }
        }
    },
    //</example>

    bodyPadding: 20,
    width: '${width}',
    autoSize: true,

    defaults: {
        errorTarget: 'none',
        invalidCls: '' // unset the invalidCls so individual fields do not get styled as invalid
    },

    listeners: {
        delegate: 'field',
        buffer: 10, // buffer as validating each field may trigger an errorchange
        errorchange: 'updateErrorState'
    },

    bbar: [{
        xtype: 'component',
        reference: 'formErrorState',
        flex: 1,
        tpl: '<tpl if="errors.length">' +
                '<span class="x-fa fa-exclamation-triangle" style="color: red;"> Form is invalid</span>' +
            '<tpl else>' +
                '<span class="x-fa fa-check-circle" style="color: green;"> Form is valid</span>' +
            '</tpl>',
        tooltip: {
            axisLock: '${axisLockValue}',
            align: 't-b0?',
            allowOver: false,
            anchor: true,
            autoCreate: true,
            autoHide: false,
            padding: 20,
            tpl: '<tpl for="errors">' +
                '<div class="form-customerrors-item"><strong>{name}:</strong><br />{errors}</div>' +
            '</tpl>'
        }
    }, {
        text: 'Submit Registration',
        handler: 'submitRegistration'
    }],

    items: [{
        xtype: 'textfield',
        name: 'username',
        label: 'User Name',
        required: true,
        minLength: 6,
        validators: {
            type: 'length',
            max: 20,
            min: 6
        }
    }, {
        xtype: 'emailfield',
        name: 'email',
        label: 'Email Address',
        validators: 'email',
        required: true
    }, {
        xtype: 'passwordfield',
        reference: 'password1',
        name: 'password1',
        label: 'Password',
        margin: '15 0 0 0',
        required: true,
        minLength: 8
    }, {
        xtype: 'passwordfield',
        name: 'password2',
        label: 'Repeat Password',
        required: true,
        validators: {
            type: 'controller',
            fn: 'passwordValidator'
        }
    }]
});
