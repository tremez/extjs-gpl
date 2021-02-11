Ext.define('KitchenSink.view.binding.DynamicController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.binding-dynamic',

    contentSwitch: true,
    titleCount: 0,

    onChangeTitleClick: function() {
        this.getViewModel().set('title', 'New Title ' + ++this.titleCount);
    },

    onChangeContentClick: function() {
        var content;

        if (this.contentSwitch) {
            content = KitchenSink.DummyText.longText;

            this.contentSwitch = false;
        }
        else {
            content = KitchenSink.DummyText.mediumText;

            this.contentSwitch = true;
        }

        this.getViewModel().set('content', content);
    }
});
