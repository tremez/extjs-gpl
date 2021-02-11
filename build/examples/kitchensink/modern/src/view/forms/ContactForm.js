/**
 * This shows an example of a common "Contact Us" form in a popup window. The form uses
 * vbox and hbox layouts to achieve a uniform flexible layout  even when the window is
 * resized.
 *
 * Note that Tab based navigation within the modal window is confined to within the window.
 */
Ext.define('KitchenSink.view.forms.ContactForm', {
    extend: 'Ext.form.Panel',
    xtype: 'form-contact',
    controller: 'forms-contact',
    title: 'Contact Us',

    requires: [
        'Ext.Dialog'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/forms/ContactFormController.js'
    }],

    profiles: {
        defaults: {
            bodyPadding: 10,
            maxDialogWidth: 550,
            nameLayout: undefined,
            nameMargin: '0 5',
            width: 500
        },
        material: {
            bodyPadding: 0
        },
        phone: {
            defaults: {
                maxDialogWidth: '80vw',
                width: '100%'
            }
        }
    },
    //</example>

    bodyPadding: 20,
    width: '${width}',
    autoSize: true,

    dialog: {
        xtype: 'dialog',
        title: 'Dialog',

        closable: true,
        defaultFocus: 'textfield',
        maskTapHandler: 'onCancel',

        bodyPadding: '${bodyPadding}',
        layout: 'fit',
        maxWidth: '${maxDialogWidth}',

        items: [{
            xtype: 'formpanel',
            reference: 'form',
            autoSize: true,
            items: [{
                xtype: 'containerfield',
                label: 'Name',
                required: true,
                layout: '${nameLayout}',
                defaults: {
                    flex: 1
                },
                items: [{
                    name: 'firstName',
                    placeholder: 'First',
                    required: true
                }, {
                    flex: null,
                    name: 'middleInitial',
                    placeholder: 'M.I.',
                    margin: '${nameMargin}',
                    width: 50
                }, {
                    name: 'lastName',
                    placeholder: 'Last',
                    required: true
                }]
            }, {
                xtype: 'emailfield',
                name: 'email',
                label: 'Email',
                allowBlank: false,
                required: true,
                validators: 'email'
            }, {
                label: 'Subject',
                name: 'subject',
                allowBlank: false,
                required: true
            }, {
                xtype: 'textareafield',
                name: 'message',
                label: 'Message',
                flex: 1,
                allowBlank: false,
                required: true
            }, {
                xtype: 'filefield',
                label: 'Document',
                name: 'photo-path'
            }]
        }],

        // We are using standard buttons on the button
        // toolbar, so their text and order are consistent.
        buttons: {
            ok: 'onOK',
            cancel: 'onCancel'
        }
    },

    items: [{
        xtype: 'component',
        margin: '0 0 20 0',
        html: 'Thank you for visiting our site! We welcome your feedback; ' +
        'please click the button below to send us a message. We will ' +
        'respond to your inquiry as quickly as possible.'
    }],

    buttons: ['->', {
        text: 'Contact Us',
        handler: 'showWindow'
    }, '->']
});
