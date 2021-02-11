Ext.define('KitchenSink.profile.Desktop', {
    extend: 'KitchenSink.profile.Base',

    controllers: ['Main'],

    mainView: 'desktop.Main',

    isActive: function() {
        return Ext.os.is.Desktop;
    }
});
