/**
 * Demonstrates validation at the FormPanel level.
 */
Ext.define('KitchenSink.view.forms.FormValidation', {
    extend: 'Ext.Container',
    xtype: 'form-validation',
    controller: 'formvalidation',
    title: 'FormPanel Validation',

    requires: [
        'Ext.field.Text',
        'KitchenSink.view.forms.FormValidationController'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/forms/FormValidationController.js'
    }],

    profiles: {
        defaults: {
            buttonShadow: true,
            height: 500,
            padding: 8,
            shadow: true,
            tbarPadding: '5 8',
            themeText: 'Theme',
            width: 400
        },
        ios: {
            buttonShadow: undefined,
            tbarPadding: undefined
        },
        phone: {
            defaults: {
                height: undefined,
                padding: undefined,
                shadow: undefined,
                tbarPadding: '12 8',
                width: undefined
            },
            ios: {
                tbarPadding: undefined
            }
        }
    },

    padding: '${padding}', // give room for the chart's shadow
    shadow: false,
    //</example>

    height: '${height}',
    layout: 'fit',
    width: '${width}',

    items: [{
        xtype: 'formpanel',
        reference: 'form',
        shadow: '${shadow}',
        bodyPadding: 20,
        scrollable: 'y',
        defaults: {
            xtype: 'textfield',
            errorTarget: 'under'
        },
        // note there are no validators on these fields
        items: [{
            name: 'azonly',
            label: 'a-z only'
        }, {
            name: 'nonblank',
            required: true,
            label: 'nonblank'
        }, {
            name: 'validated',
            label: 'validator (upper  only)',
            validators: /^[A-Z]*$/
        }, {
            xtype: 'panel',
            docked: 'bottom',
            reference: 'messages',
            title: 'Messages',
            scrollable: true,
            bodyPadding: 20,
            height: 200
        }]
    }, {
        xtype: 'toolbar',
        docked: 'top',
        ui: 'transparent',
        padding: '${tbarPadding}',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        defaults: {
            shadow: '${buttonShadow}',
            ui: 'action'
        },
        items: [{
            text: 'Functions',
            menu: [{
                text: 'clearErrors()',
                handler: 'onClearErrorsClicked'
            }, {
                separator: true,
                text: 'setErrors()',
                handler: 'onSetErrorsButtonClick'
            }, {
                text: 'getErrors()',
                handler: 'onGetErrorsClicked'
            }, {
                separator: true,
                text: 'validate()',
                handler: 'onValidateButtonClicked'
            }, {
                text: 'isValid()',
                handler: 'onIsValidButtonClicked'
            }]
        }]
    }]
});
