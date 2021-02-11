Ext.define('KitchenSink.view.colorpick.ColorPickerController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.color-selector',

    onChange: function(picker) {
        this.view.getItems().items[1].setTitle(
            '<p style="color: #' + picker.getValue() + '">Selected Color: #' + picker.getValue() + '</p>'
        );
    }
});
