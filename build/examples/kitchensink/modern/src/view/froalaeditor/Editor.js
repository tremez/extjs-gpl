/**
 * This demonstrates the use of Ext.froala.EditorField, which is a
 * WYSIWYG html editor. There are two versions of the editor:
 * Ext.froala.EditorField, which is desiged to be used in forms,
 * and a non-field version named Ext.froala.Editor, for when you'd
 * like to use the editor component in other situations.
 */
Ext.define('KitchenSink.view.froalaeditor.Editor', {
    extend: 'Ext.form.Panel',
    requires: ['Ext.froala.EditorField'],

    xtype: 'froala-editor',

    title: 'Ext.froala.EditorField inside a form panel',
    layout: 'fit',
    items: [
        {
            xtype: 'froalaeditorfield',
            // The "editor" config is for native Froala configuration
            editor: {
                autofocus: true,
                fontSize: ['10', '12', '16', '24']
            },
            name: 'html',
            listeners: {
                change: function(froalaComponent) {
                    Ext.toast({ message: 'Change!' });
                },
                // Native Froala events are prefixed with 'froala.'
                'froala.click': function(froalaComponent) {
                    Ext.toast({ message: 'Click!' });
                }
            },
            margin: 16
        }
    ],
    buttons: {
        ok: {
            text: 'getValues()',
            handler: function(button) {
                var form = button.up('formpanel');

                // Ext.froala.EditorField is a field, so its name and value are
                // seen by the form panel. This code gathers the values via
                // getValues(), then encodes it as a string for easy viewing.
                Ext.Msg.alert('getValues()', Ext.JSON.encode(form.getValues()));
            }
        }
    }
});
