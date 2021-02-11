Ext.define('Portal.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    onAddUser: function(item) {
        var dashboard = this.lookupReference('dashboard');

        dashboard.addView({
            type: 'userForm'
        });
    }
});
