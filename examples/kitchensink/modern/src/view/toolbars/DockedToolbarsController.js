Ext.define('KitchenSink.view.toolbars.DockedToolbarsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.docked-toolbars',

    onCancel: function() {
        Ext.Msg.alert('Button Click', 'You clicked on the "Cancel" button!');
    },

    onHelp: function() {
        Ext.Msg.alert('Button Click', 'You clicked on the "Help" button!');
    },

    onOk: function() {
        Ext.Msg.alert('Button Click', 'You clicked on the "Ok" button!');
    }
});
