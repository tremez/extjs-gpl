Ext.define('Admin.view.faq.Items', {
    extend: 'Ext.Panel',
    xtype: 'faqitems',

    requires: [
        'Ext.dataview.DataView'
    ],

    bodyPadding: '0 20 20 20',
    controller: 'faqitems',
    ui: 'light',
    userCls: 'faq-item',

    config: {
        store: null
    },

    items: [{
        xtype: 'dataview',
        reference: 'dataview',
        scrollable: false,
        listeners: {
            childtap: 'onChildTap'
        },
        itemTpl: '<div class="faq-item">' +
                '<div class="faq-title">' +
                    '<div class="faq-expander x-fa"></div>' +
                    '<div class="faq-question">{question}</div>' +
                '</div>' +
                '<div class="faq-body">' +
                    '<div>{answer}</div>' +
                '</div>' +
            '</div>'
    }],

    updateStore: function (store) {
        var grid = this.lookup('dataview');

        grid.setStore(store);
    }
});
