Ext.define('KitchenSink.view.data.AjaxController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.ajax',

    onLoad: function() {
        this.getView().setMasked({
            xtype: 'loadmask',
            message: 'Loading...'
        });

        Ext.Ajax.request({
            url: 'data/test.json',
            scope: this,
            failure: this.failureCallback,
            success: this.successCallback
        });
    },

    onFormat: function(btn) {
        var data = this.lastResponse;

        if (data) {
            this.render(data, btn.isPressed());
        }
    },

    failureCallback: function() {
        Ext.Msg.alert('Ajax Load Error', 'There was an error while loading the data.');
    },

    successCallback: function(response) {
        var formatBtn = this.lookup('formatBtn'),
            data = this.lastResponse = response.responseText;

        this.render(data, formatBtn.isPressed());

        this.getView().unmask();
    },

    render: function(data, format) {
        var results = this.lookup('results');

        if (format) {
            results.setHtml('<pre>' + data + '</pre>');
        }
        else {
            results.setHtml(data);
        }
    }
});
