Ext.define('KitchenSink.profile.Phone', {
    extend: 'KitchenSink.profile.Base',

    controllers: ['Main'],

    mainView: 'phone.Main',

    views: {
        'combination-dashboard': 'KitchenSink.view.phone.chart.combination.Dashboard',
        'touch-events': 'KitchenSink.view.phone.touchevent.Events'
    },

    isActive: function() {
        return Ext.os.is.Phone; // || Ext.os.is.Desktop;
    }
});
