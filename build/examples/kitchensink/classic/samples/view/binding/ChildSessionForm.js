/**
 * This form is a popup window used by the ChildSession view. This view is
 * added as a contained window so we use the same ViewController instance.
 */
Ext.define('KitchenSink.view.binding.ChildSessionForm', {
    extend: 'Ext.window.Window',
    xtype: 'binding-child-session-form',
    //<example>
    requires: [
        'Ext.form.Panel',
        'Ext.layout.container.Fit',
        'Ext.form.field.Text',
        'Ext.grid.Panel'
    ],
    title: 'Edit', // needed for bind/title - should fix setTitle
    //</example>

    profiles: {
        classic: {
            height: 430,
            removeWidth: 90,
            idWidth: 50,
            bodyPadding: 10,
            textfieldPadding: 0
        },
        neptune: {
            height: 430,
            removeWidth: 90,
            idWidth: 50,
            bodyPadding: 10,
            textfieldPadding: 0
        },
        graphite: {
            height: 530,
            removeWidth: 150,
            idWidth: 80,
            bodyPadding: 10,
            textfieldPadding: 0
        },
        'classic-material': {
            height: 530,
            removeWidth: 150,
            idWidth: 80,
            bodyPadding: 0,
            textfieldPadding: '5 10'
        }
    },
    bind: {
        title: '{title}'
    },
    layout: 'fit',
    modal: true,
    width: 500,
    height: '${height}',
    closable: true,
    cls: 'child-session-form',

    items: {
        xtype: 'form',
        reference: 'form',
        bodyPadding: '${bodyPadding}',
        border: false,
        // use the Model's validations for displaying form errors
        modelValidation: true,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'textfield',
            fieldLabel: 'Name',
            reference: 'name',
            msgTarget: 'side',
            padding: '${textfieldPadding}',
            bind: '{theCompany.name}'
        }, {
            xtype: 'textfield',
            fieldLabel: 'Phone',
            reference: 'phone',
            msgTarget: 'side',
            padding: '${textfieldPadding}',
            bind: '{theCompany.phone}'
        }, {
            xtype: 'grid',
            autoLoad: true,
            flex: 1,
            reference: 'orders',
            margin: '10 0 0 0',
            title: 'Orders',
            bind: '{theCompany.orders}',
            tbar: [{
                text: 'Add Order',
                handler: 'onAddOrderClick'
            }],
            columns: [{
                text: 'Id',
                dataIndex: 'id',
                width: '${idWidth}',
                renderer: 'renderOrderId'
            }, {
                xtype: 'datecolumn',
                text: 'Date',
                dataIndex: 'date',
                format: 'Y-m-d',
                flex: 1
            }, {
                xtype: 'checkcolumn',
                text: 'Shipped',
                dataIndex: 'shipped'
            }, {
                xtype: 'widgetcolumn',
                width: '${removeWidth}',
                widget: {
                    xtype: 'button',
                    text: 'Remove',
                    handler: 'onRemoveOrderClick'
                }
            }]
        }]
    },

    buttons: [{
        text: 'Save',
        handler: 'onSaveClick'
    }, {
        text: 'Cancel',
        handler: 'onCancelClick'
    }]
});
