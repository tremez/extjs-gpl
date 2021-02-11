Ext.define('Ext.overrides.drag.proxy.Placeholder', {
    override: 'Ext.drag.proxy.Placeholder',
    getElement: function() {
        var el = this.callParent();

        el.addCls(Ext.baseCSSPrefix + 'root');

        return el;
    }
});
