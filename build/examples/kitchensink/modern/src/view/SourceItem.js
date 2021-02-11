Ext.define('KitchenSink.view.SourceItem', {
    extend: 'Ext.Component',
    xtype: 'sourceitem',

    cls: 'ux-code',
    scrollable: true,
    padding: 8,

    constructor: function(config) {
        this.renderDiv = document.createElement('div');
        this.callParent([config]);
    },

    doDestroy: function() {
        this.renderDiv = null;
        this.callParent();
    },

    applyHtml: function(html) {
        html = html
            .replace(/</g, '&lt;')
            .replace(/\r/g, '');

        return '<pre style="line-height: 14px; padding-left: 5px" class="prettyprint">' +
               html +
               '</pre>';
    },

    updateHtml: function(html, oldHtml) {
        var me = this,
            renderDiv = me.renderDiv;

        if (this.prettyPrint) {
            renderDiv.innerHTML = html;

            // eslint-disable-next-line no-undef
            PR.prettyPrint(function() {
                if (!me.destroyed) {
                    me.superclass.updateHtml.call(me, renderDiv.innerHTML, oldHtml);
                }
            }, renderDiv);
        }
        else {
            me.callParent([html, oldHtml]);
        }
    }
});
