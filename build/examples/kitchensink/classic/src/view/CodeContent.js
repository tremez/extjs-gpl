Ext.define('KitchenSink.view.CodeContent', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.codeContent',
    scrollable: true,

    cls: 'code-content',
    bodyCls: 'content-panel-body',

    afterRender: function() {
        this.callParent(arguments);

        // eslint-disable-next-line no-undef
        prettyPrint();
    }
});
