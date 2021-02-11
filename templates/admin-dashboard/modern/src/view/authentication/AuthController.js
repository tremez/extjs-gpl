Ext.define('Admin.view.authentication.AuthController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.auth',

    goToDashboard: function () {
        this.redirectTo('dashboard');
    },

    goToRegister: function () {
        this.redirectTo('register');
    }
});
