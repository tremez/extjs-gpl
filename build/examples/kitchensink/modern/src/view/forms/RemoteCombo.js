/**
 * Demonstrates a ComboBox with a remotely filtered data source
 */
Ext.define('KitchenSink.view.forms.RemoteCombo', {
    extend: 'Ext.form.Panel',
    xtype: 'form-remote-combo',

    requires: [
        'Ext.field.ComboBox'
    ],

    controller: 'form-remote-combo',

    //<example>
    otherContent: [{
        type: 'Store',
        path: 'app/store/ForumPosts.js'
    }, {
        type: 'Model',
        path: 'app/model/ForumPost.js'
    }],

    profiles: {
        defaults: {
            alignTarget: undefined,
            pickerMaxHeight: undefined,
            width: 300,
            height: 400
        },
        phone: {
            defaults: {
                width: undefined,
                height: undefined,
                alignTarget: 'el',
                pickerMaxHeight: 1000
            }
        }
    },
    //</example>

    bodyPadding: 20,
    width: '${width}',
    height: '${height}',
    autoSize: true,

    items: [{
        xtype: 'combobox',
        label: 'Forum threads',
        triggerAction: 'query',
        queryMode: 'remote',
        picker: 'floated',
        placeholder: 'Choose thread to open...',
        alignTarget: '${alignTarget}',
        forceSelection: true,
        store: {
            type: 'form-forum-posts'
        },
        displayField: 'title',
        floatedPicker: {
            maxHeight: '${pickerMaxHeight}'
        },
        itemTpl: '<div class="remote-combo-search-item">' +
                    '<h3><span>{[Ext.Date.format(values.lastPost, "M j, Y")]}<br>by {author}</span>{title}</h3>' +
                    '{excerpt}' +
                '</div>',
        listeners: {
            select: 'onThreadSelect'
        }
    }, {
        xtype: 'component',
        reference: 'threadDetails',
        tpl: '<h2>Thread Details</h2>' +
             '<div class="remote-combo-search-item">' +
                '<h3>' +
                    '<span>' +
                        '{[Ext.Date.format(values.lastPost, "M j, Y")]}<br>by {author}' +
                    '</span>' +
                    '<a href="{url}" target="_blank">' +
                        '{title}' +
                    '</a>' +
                '</h3>' +
                '{excerpt}' +
            '</div>'
    }]
});
