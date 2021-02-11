/**
 * This example shows how to submit form values via Ext Direct method
 * that accepts named arguments.
 */
Ext.define('KitchenSink.view.direct.NamedForm', {
    extend: 'Ext.form.Panel',
    xtype: 'direct-named',
    controller: 'direct-named',
    title: 'Personal information',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/direct/NamedFormController.js'
    }, {
        type: 'Base Controller',
        path: 'modern/src/view/direct/BaseController.js'
    }, {
        type: 'Server Class',
        path: 'data/direct/source.php?file=testaction'
    }, {
        type: 'Server Config',
        path: 'data/direct/source.php?file=config'
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
    width: '${width}',
    autoSize: true,

    items: [{
        xtype: 'textfield',
        label: 'First Name',
        name: 'firstName',
        value: 'Evan',
        required: true,
        maxLength: 30,
        enforceMaxLength: true
    }, {
        xtype: 'textfield',
        label: 'Last Name',
        name: 'lastName',
        value: 'Trimboli',
        required: true,
        maxLength: 30,
        enforceMaxLength: true
    }, {
        xtype: 'numberfield',
        label: 'Age',
        name: 'age',
        value: 25,
        decimals: 0,
        required: true
    }, {
        xtype: 'toolbar',
        docked: 'bottom',
        items: ['->', {
            text: 'Send',
            formBind: true,
            handler: 'onFormSubmit'
        }]
    }]
});
