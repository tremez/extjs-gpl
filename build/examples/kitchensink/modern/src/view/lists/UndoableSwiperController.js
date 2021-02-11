Ext.define('KitchenSink.view.lists.UndoableSwiperController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.undoable-swiper',

    onCall: function(list, info) {
        var record = info.record;

        Ext.Msg.alert('Call', record.get('firstName') + ' ' + record.get('lastName'));
    },

    onMessage: function(list, info) {
        var record = info.record;

        Ext.Msg.prompt('Send To',
                       record.get('firstName') + ' ' + record.get('lastName'),
                       function(button, text) {
                           if (button === 'ok') {
                               console.log('Send message:', text);
                           }
                       }
        );
    },

    onCommitDeleteItem: function(list, info) {
        var store = list.getStore(),
            record = info.record;

        console.log('Commit delete', record.get('firstName') + ' ' + record.get('lastName'));

        store.remove(record);
    },

    onDeleteItem: function(list, info) {
        var record = info.record;

        console.log('Delete', record.get('firstName') + ' ' + record.get('lastName'));
    },

    onUndoDeleteItem: function(list, info) {
        var record = info.record;

        console.log('Recover', record.get('firstName') + ' ' + record.get('lastName'));
    }
});
