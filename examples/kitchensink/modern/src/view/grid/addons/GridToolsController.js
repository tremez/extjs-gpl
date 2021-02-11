Ext.define('KitchenSink.view.grid.addons.GridToolsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.grid-tools',

    //---------------------
    // Cell actions:

    onGear: function(grid, info) {
        Ext.Msg.alert('Settings',
                      'Change settings for ' + Ext.htmlEncode(info.record.data.name));
    },

    onPin: function(grid, info) {
        Ext.Msg.alert('Pin',
                      'Pinned item "' + Ext.htmlEncode(info.record.data.name) + '"');
    },

    onSearch: function(grid, info) {
        Ext.Msg.alert('Search',
                      'Search for item "' + Ext.htmlEncode(info.record.data.name) + '"');
    },

    //---------------------
    // Group actions:

    onGroupPrint: function(grid, info) {
        this.doGroup(info, 'Print Group');
    },

    onGroupRefresh: function(grid, info) {
        this.doGroup(info, 'Refresh Group');
    },

    onGroupSave: function(grid, info) {
        this.doGroup(info, 'Save Group');
    },

    doGroup: function(info, action) {
        var tpl = Ext.XTemplate.getTpl(this.getView(), 'helperTpl');

        Ext.Msg.alert(action, tpl.apply({
            group: info.group
        }));
    }
});
