Ext.define('KitchenSink.view.lists.DisclosureListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.disclosure-list',

    onDisclosureTap: function(record) {
        Ext.Msg.alert('Tap', 'Disclose more info for ' + record.get('firstName'));
    }
});
