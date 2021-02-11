Ext.define('KitchenSink.view.d3.hierarchy.TreeMapController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.treemap',

    parentTemplate: null,
    leafTemplate: null,

    getParentHtml: function(record) {
        var template = this.parentTemplate;

        if (!template) {
            template = this.parentTemplate = new Ext.XTemplate(
                '<div class="tip-title">{data.name}</div>',
                '<tpl for="childNodes">',
                '<div><span class="tip-symbol">{data.name}</span><tpl if="data.description"> - {data.description}</tpl></div>',
                '<tpl if="xindex &gt; 10">...{% break; %}</tpl>',
                '</tpl>'
            );
        }

        return template.apply(record);
    },

    getLeafHtml: function(record) {
        var template = this.leafTemplate;

        if (!template) {
            template = this.leafTemplate = new Ext.XTemplate(
                '<div class="tip-company">{data.description}</div>',
                '<div>Change:&nbsp;<tpl if="data.change &gt; 0">+</tpl>{data.change}%</div>'
            );
        }

        return template.apply(record);
    },

    onTooltip: function(component, tooltip, node, element, event) {
        var record = node.data;

        component.setSelection(record);

        if (record.isLeaf()) {
            tooltip.setHtml(this.getLeafHtml(record));
        }
        else {
            tooltip.setHtml(this.getParentHtml(record));
        }
    }

});
