Ext.define('KitchenSink.view.binding.ComponentState', {
    extend: 'Ext.Container',
    xtype: 'binding-component-state',

    viewModel: true,

    //<example>
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

    cls: 'demo-solid-background',
    //</example>

    padding: 20,
    width: '${width}',
    autoSize: true,

    items: [{
        xtype: 'checkboxfield',
        label: 'Is Admin',
        reference: 'isAdmin'
    }, {
        xtype: 'textfield',
        label: 'Admin Key',
        enforceMaxLength: true,
        bind: {
            disabled: '{!isAdmin.checked}'
        }
    }, {
        xtype: 'togglefield',
        label: 'Priority',
        reference: 'priority'
    }, {
        xtype: 'textfield',
        label: 'High Priority Code',
        hidden: true,
        bind: {
            hidden: '{!priority.value}'
        }
    }, {
        xtype: 'component',
        margin: '10 0 0',
        html: 'The admin key field is disabled when the admin checkbox is not checked. ' +
            'The high priority field is hidden when the priority is toggled.'
    }]
});
