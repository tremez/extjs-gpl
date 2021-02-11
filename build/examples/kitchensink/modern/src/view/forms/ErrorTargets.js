Ext.define('KitchenSink.view.forms.ErrorTargets', {
    extend: 'Ext.form.Panel',
    xtype: 'form-errortargets',

    //<example>
    profiles: {
        defaults: {
            fieldMargin: undefined,
            width: 400
        },
        material: {
            fieldMargin: '10 0'
        },
        phone: {
            width: undefined
        }
    },
    //</example>

    bodyPadding: 20,
    width: '${width}',
    autoSize: true,

    defaults: {
        xtype: 'textfield',
        labelAlign: 'top',
        margin: '${fieldMargin}',
        value: 'invalid email@foo.com',
        validators: 'email',
        errorTip: {
            anchor: true,
            align: 'l-r?'
        }
    },

    items: [{
        label: 'errorTarget: qtip'
    }, {
        label: 'errorTarget: side',
        errorTarget: 'side'
    }, {
        label: 'errorTarget: under',
        errorTarget: 'under'
    }]
});
