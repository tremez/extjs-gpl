Ext.define('Ext.theme.triton.dataview.ListCollapser', {
    override: 'Ext.dataview.ListCollapser',

    config: {
        tool: {
            weight: -100,
            zone: 'start'
        }
    }
});
