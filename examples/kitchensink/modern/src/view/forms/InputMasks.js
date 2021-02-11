/**
 * Demonstrates common field input masks
 */
Ext.define('KitchenSink.view.forms.InputMasks', {
    extend: 'Ext.form.Panel',
    xtype: 'form-masks',
    title: 'User Data',
    controller: 'inputmasks',

    requires: [
        'Ext.field.InputMask', // have to require explicitly
        'Ext.field.*',
        'KitchenSink.view.forms.InputMasksController'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/forms/InputMasksController.js'
    }],

    profiles: {
        defaults: {
            width: 375
        },
        phone: {
            width: undefined
        }
    },
    //</example>

    bodyPadding: 20,
    scrollable: 'y',
    width: '${width}',
    autoSize: true,

    defaults: {
        xtype: 'textfield',
        labelWidth: 140
    },

    items: [{
        label: 'Name on Card',
        reference: 'name',
        autoComplete: true
    }, {
        label: 'Phone Number',
        reference: 'phone',
        inputType: 'tel', // Show phone number input keyboard
        autoComplete: true,
        inputMask: '(999) 999-9999'
    }, {
        label: 'CC number',
        reference: 'cc',
        autoComplete: true,
        autoHideInputMask: false, // Always show input mask
        inputMask: '9999-9999-9999-9999',
        listeners: {
            change: 'swapMask'
        }
    }, {
        label: 'Expiration Date',
        reference: 'expire',
        inputMask: '99/99',
        placeholder: 'mm/yy'
    }],

    buttons: [{
        text: 'Fill phone number',
        handler: 'onPhoneNumberFill'
    }, {
        text: 'Reset',
        handler: 'onResetTap'
    }]
});
