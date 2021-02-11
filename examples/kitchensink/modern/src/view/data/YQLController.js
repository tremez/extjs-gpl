Ext.define('KitchenSink.view.data.YQLController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.yql',

    cachedConfig: {
        tpl: '<tpl for="item">' +
            '<div class="blog-post">' +
                '<h3><a href="{link}" target="_blank">{title}</a></h3>' +
                '<p>{description}</p>' +
            '</div>' +
        '</tpl>'
    },

    applyTpl: function(tpl) {
        return Ext.XTemplate.get(tpl);
    },

    onLoad: function() {
        this.getView().setMasked({
            xtype: 'loadmask',
            message: 'Loading...'
        });

        Ext.data.JsonP.request({
            scope: this,
            callback: this.loadCallback,
            url: 'http://query.yahooapis.com/v1/public/yql',
            callbackKey: 'callback',
            params: {
                env: 'store://datatables.org/alltableswithkeys',
                format: 'json',
                q: 'select * from rss where url="http://feeds.feedburner.com/sencha" limit 5'
            }
        });
    },

    loadCallback: function(success, response) {
        var results = success && response.query && response.query.results;

        if (results) {
            this.lookup('results').setHtml(this.getTpl().apply(results));
        }
        else {
            Ext.Msg.alert('Error', 'There was an error retrieving the YQL request.');
        }

        this.getView().unmask();
    }
});
