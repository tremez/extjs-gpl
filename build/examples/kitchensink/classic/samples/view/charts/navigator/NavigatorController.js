Ext.define('KitchenSink.view.charts.navigator.NavigatorController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.navigator',

    onPreview: function() {
        var navigatorContainer = this.lookup('chartnavigator');

        navigatorContainer.preview();
    }

});
