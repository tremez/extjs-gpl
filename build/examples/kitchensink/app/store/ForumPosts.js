Ext.define('KitchenSink.store.form.ForumPosts', {
    extend: 'Ext.data.Store',
    alias: 'store.form-forum-posts',
    storeId: 'form-forum-posts',

    model: 'KitchenSink.model.form.ForumPost',

    proxy: {
        type: 'jsonp',
        url: 'https://www.sencha.com/forum/topics-remote.php',
        reader: {
            type: 'json',
            rootProperty: 'topics',
            totalProperty: 'totalCount'
        }
    },

    updateProxy: function(proxy, oldProxy) {
        this.callParent([proxy, oldProxy]);

        // Inject custom getParams method
        this.getProxy().getParams = function(operation) {
            var params = Ext.data.proxy.Server.prototype.getParams.call(this, operation);

            if (!params.query) {
                proxy.setExtraParam('forumId', this.self.defaultForumId);
            }

            return params;
        };
    },

    statics: {
        defaultForumId: 4
    }
});
