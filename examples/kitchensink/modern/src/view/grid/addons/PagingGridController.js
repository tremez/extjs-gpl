Ext.define('KitchenSink.view.grid.addons.PagingGridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.paging-grid',

    topicTpl: '<a href="http://sencha.com/forum/showthread.php?t={1}" target="_blank">{0}</a>',
    lastTpl: '{0}<br/>by {1}',

    renderTopic: function(value, record) {
        return Ext.String.format(
            this.topicTpl,
            value,
            record.getId()
        );
    },

    renderLast: function(value, model) {
        return Ext.String.format(
            this.lastTpl,
            Ext.Date.dateFormat(value, 'M j, Y, g:i a'),
            model.get('lastposter')
        );
    }
});
