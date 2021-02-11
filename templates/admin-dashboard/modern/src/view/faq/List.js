Ext.define('Admin.view.faq.List', {
    extend: 'Ext.dataview.List',
    xtype: 'faq',

    store: {
        type: 'faq',
        autoLoad: true
    },

    itemConfig: {
        xtype: 'faqitems',
        shadow: true,
        viewModel: true,
        bind: {
            title: '{record.name}',
            store: '{record.questions}'
        }
    }
});
