Ext.define('KitchenSink.view.buttons.ExtraModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.buttons-extra',
    data: {
        style: '',
        type: 'text',
        round: false,
        disabled: false
    },

    icons: [
        'fa-home', 'fa-cog',
        'fa-archive', 'fa-heart',
        'fa-trash-alt', 'fa-wrench'
    ],

    getIcon: function() {
        var icons = this.icons,
            idx = Math.floor(Math.random() * icons.length);

        return 'x-fa ' + icons[idx];
    },

    formulas: {
        type: function(getter) {
            return getter('buttonType.value');
        },
        style: function(getter) {
            return getter('buttonStyle.value');
        },
        normalText: function(getter) {
            var type = getter('type');

            return type.indexOf('text') !== -1 ? 'Normal' : null;
        },
        smallText: function(getter) {
            var type = getter('type');

            return type.indexOf('text') !== -1 ? 'Small' : null;
        },
        mediumText: function(getter) {
            var type = getter('type');

            return type.indexOf('text') !== -1 ? 'Medium' : null;
        },
        largeText: function(getter) {
            var type = getter('type');

            return type.indexOf('text') !== -1 ? 'Large' : null;
        },
        badgeText: function(getter) {
            var type = getter('type');

            return type.indexOf('text') !== -1 ? 'Badge' : null;
        },
        disabledText: function(getter) {
            var type = getter('type');

            return type.indexOf('text') !== -1 ? 'Disabled' : null;
        },
        icon: function(getter) {
            var type = getter('type');

            return type.indexOf('icon') !== -1 ? this.getIcon() : '';
        },
        menu: function(getter) {
            var style = getter('style');

            return style === 'menu' ? [{ text: 'Menu Item' }] : null;
        }
    }
});
