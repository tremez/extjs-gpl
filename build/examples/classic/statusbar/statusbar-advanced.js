Ext.require([
    'Ext.form.Panel',
    'Ext.form.field.Date',
    'Ext.tip.QuickTipManager',
    'Ext.ux.statusbar.StatusBar',
    'Ext.ux.statusbar.ValidationStatus'
]);

Ext.onReady(function() {
    var fp;

    Ext.tip.QuickTipManager.init();
    fp = Ext.create('Ext.FormPanel', {
        title: 'StatusBar with Integrated Form Validation',
        renderTo: Ext.getBody(),
        width: 350,
        autoHeight: true,
        id: 'status-form',
        labelWidth: 75,
        bodyPadding: 10,
        defaults: {
            anchor: '95%',
            allowBlank: false,
            selectOnFocus: true,
            msgTarget: 'side'
        },
        items: [{
            xtype: 'textfield',
            fieldLabel: 'Name',
            blankText: 'Name is required'
        }, {
            xtype: 'datefield',
            fieldLabel: 'Birthdate',
            blankText: 'Birthdate is required'
        }],
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            items: ['->', {
                text: 'Save',
                handler: function() {
                    var sb;

                    if (fp.getForm().isValid()) {
                        sb = Ext.getCmp('form-statusbar');

                        sb.showBusy('Saving form...');
                        fp.getEl().mask();
                        fp.getForm().submit({
                            url: 'fake.php',
                            success: function() {
                                sb.setStatus({
                                    text: 'Form saved!',
                                    iconCls: '',
                                    clear: true
                                });
                                fp.getEl().unmask();
                            }
                        });
                    }
                }
            }]
        }, {
            xtype: 'statusbar',
            dock: 'bottom',
            id: 'form-statusbar',
            defaultText: 'Ready',
            plugins: {
                validationstatus: {
                    form: 'status-form'
                }
            }
        }]
    });
});
