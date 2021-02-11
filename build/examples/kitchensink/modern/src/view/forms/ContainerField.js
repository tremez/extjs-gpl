Ext.define('KitchenSink.view.forms.ContainerField', {
    extend: 'Ext.Container',
    xtype: 'form-containerfield',
    controller: 'form-containerfield',

    requires: [
        'Ext.field.Container',
        'Ext.Dialog'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/forms/ContainerFieldController.js'
    }],

    profiles: {
        defaults: {
            labelAlign: 'top',
            margin: '15 0 0',
            padding: 8,
            shadow: true,
            width: 400
        },
        material: {
            labelAlign: undefined
        },
        phone: {
            defaults: {
                margin: undefined,
                padding: undefined,
                shadow: undefined,
                width: undefined
            }
        }
    },

    padding: '${padding}', // give room for the form's shadow
    shadow: false,
    //</example>

    defaultType: 'formpanel',
    scrollable: 'y',
    width: '${width}',

    defaults: {
        margin: '${margin}',
        shadow: '${shadow}'
    },

    items: [{
        margin: null,
        title: 'QTip Error Target',
        buttons: {
            cancel: 'onCancel',
            ok: 'onOk'
        },
        items: [{
            xtype: 'containerfield',
            label: 'Name',
            labelAlign: '${labelAlign}',
            items: [{
                flex: 1,
                name: 'firstName',
                placeholder: 'First Name',
                required: true
            }, {
                margin: '0 10',
                maxLength: 1,
                name: 'middleName',
                placeholder: 'MI',
                width: 50
            }, {
                flex: 1,
                name: 'lastName',
                placeholder: 'Last Name',
                required: true
            }]
        }]
    }, {
        title: 'Side Error Target',
        buttons: {
            cancel: 'onCancel',
            ok: 'onOk'
        },
        items: [{
            xtype: 'containerfield',
            label: 'Name',
            labelAlign: '${labelAlign}',
            errorTarget: 'side',
            items: [{
                flex: 1,
                name: 'firstName',
                placeholder: 'First Name',
                required: true
            }, {
                margin: '0 10',
                maxLength: 1,
                name: 'middleName',
                placeholder: 'MI',
                width: 50
            }, {
                flex: 1,
                name: 'lastName',
                placeholder: 'Last Name',
                required: true
            }]
        }]
    }, {
        title: 'Under Error Target',
        buttons: {
            cancel: 'onCancel',
            ok: 'onOk'
        },
        items: [{
            xtype: 'containerfield',
            label: 'Name',
            labelAlign: '${labelAlign}',
            errorTarget: 'under',
            items: [{
                flex: 1,
                name: 'firstName',
                placeholder: 'First Name',
                required: true
            }, {
                margin: '0 10',
                maxLength: 1,
                name: 'middleName',
                placeholder: 'MI',
                width: 50
            }, {
                flex: 1,
                name: 'lastName',
                placeholder: 'Last Name',
                required: true
            }]
        }]
    }, {
        title: 'Child Field Errors',
        buttons: {
            cancel: 'onCancel',
            ok: 'onOk'
        },
        items: [{
            xtype: 'containerfield',
            label: 'Name',
            labelAlign: '${labelAlign}',
            items: [{
                errorTarget: 'qtip',
                flex: 1,
                name: 'firstName',
                placeholder: 'First Name',
                required: true
            }, {
                margin: '0 10',
                maxLength: 1,
                name: 'middleName',
                placeholder: 'MI',
                width: 50
            }, {
                errorTarget: 'side',
                flex: 1,
                name: 'lastName',
                placeholder: 'Last Name',
                required: true
            }]
        }]
    }]
});
