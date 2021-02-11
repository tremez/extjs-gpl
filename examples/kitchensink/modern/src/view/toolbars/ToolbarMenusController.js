Ext.define('KitchenSink.view.toolbars.ToolbarMenusController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.toolbar-menus',

    templates: {
        onButtonClick: 'You clicked the "{0}" button.',
        onItemClick: 'You clicked the "{0}" menu item.',
        onItemCheck: 'You {1} the "{0}" menu item.',
        onItemToggle: 'Button "{0}" was toggled to {1}.'
    },

    getTemplate: function(name) {
        var tpl = this.templates[name];

        if (Ext.isString(tpl)) {
            tpl = this.templates[name] = new Ext.Template(tpl);
        }

        return tpl;
    },

    showToast: function(tpl) {
        var data = Ext.Array.from(arguments);

        data.shift();

        Ext.toast(this.getTemplate(tpl).apply(data));
    },

    onItemClick: function(item) {
        this.showToast('onItemClick', item.getText());
    },

    onItemCheck: function(item, checked) {
        this.showToast('onItemCheck', item.getText(), checked ? 'checked' : 'unchecked');
    },

    onButtonClick: function(btn) {
        this.showToast('onButtonClick', btn.displayText || btn.text);
    },

    onItemToggle: function(button) {
        var pressed = button.isPressed();

        this.showToast('onItemToggle', button.getText(), pressed ? 'pressed' : 'unpressed');
    }
});
