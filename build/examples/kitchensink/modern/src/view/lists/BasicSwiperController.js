Ext.define('KitchenSink.view.lists.BasicSwiperController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.basic-swiper',

    onCall: function(list, info) {
        var record = info.record;

        Ext.Msg.alert('Call', record.get('firstName') + ' ' + record.get('lastName'));
    },

    onGear: function(list, info) {
        var record = info.record;

        Ext.Msg.alert('Edit Settings',
                      record.get('firstName') + ' ' + record.get('lastName'));
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
    }
});
