/**
 * Demonstrates a simple email form.
 */
Ext.define('KitchenSink.view.forms.Email', {
    extend: 'Ext.form.Panel',
    xtype: 'form-email',
    controller: 'form-email',
    title: 'Email',

    requires: [
        'KitchenSink.model.Employee'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/forms/EmailController.js'
    }, {
        type: 'Store',
        path: 'app/store/Staff.js'
    }, {
        type: 'Model',
        path: 'app/model/StaffMember.js'
    }],

    profiles: {
        defaults: {
            maxHeight: 600,
            width: 500
        },
        phone: {
            defaults: {
                maxHeight: undefined,
                width: undefined
            }
        }
    },
    //</example>

    bodyPadding: 20,
    maxHeight: '${maxHeight}',
    scrollable: 'y',
    width: '${width}',
    autoSize: true,

    items: [{
        xtype: 'fieldset',
        layout: 'vbox',
        title: 'Compose',
        defaults: {
            labelAlign: 'top'
        },
        items: [{
            xtype: 'combobox',
            reference: 'emailRecipient',
            multiSelect: true,

            // Selected items should disappear from pick list
            filterPickList: true,

            // Primary filter function is in ViewController
            primaryFilter: 'filterEmail',

            // Typed value converter function is in ViewController
            recordCreator: 'createTypedContact',

            queryMode: 'local',
            label: 'To',
            valueField: 'id',

            // Configure the ChipView to display more info
            chipView: {
                iconField: 'imagePath',
                displayField: 'name',
                platformConfig: {
                    '!phone': {
                        displayTpl: '{name} ({email})'
                    }
                }
            },

            // Configure pick list to display more info
            itemTpl: '<img class="email-picker-avatar" src="{imagePath}">' +
                '<div class="email-picker-text">' +
                '<div class="email-picker-item-name">{name}</div>' +
                '<div class="email-picker-item-address">{email}</div>' +
                '</div>',
            itemCls: 'ks-email-item',
            // Need to give displayTpl in case default {{text}} is not used
            displayTpl: '{name} ({email})',
            store: {
                type: 'staff'
            }
        }, {
            xtype: 'textfield',
            label: 'Subject',
            name: 'subject'
        }, {
            xtype: 'textareafield',
            name: 'body'
        }]
    }],

    buttons: [{
        text: 'Send',
        handler: 'onSendClick'
    }]
});
