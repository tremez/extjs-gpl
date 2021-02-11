/**
 * Controls the collapsible example.
 */
Ext.define('KitchenSink.view.pivot.CollapsibleController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pivotcollapsible',

    onInitialize: function() {
        var data = KitchenSink.data.PivotData.getData(20),
            len = data.length,
            i;

        for (i = 0; i < len; i++) {
            data[i].company = 'Dell';
            data[i].date = KitchenSink.data.PivotData.getRandomDate(new Date(2016, 0, 1), new Date(2016, 0, 31));
        }

        this.lookup('pivotgrid').getMatrix().store.loadData(data);
    },

    reconfigureMatrix: function(button, checked) {
        if (!checked) {
            return;
        }

        // reconfigure the pivot grid with new settings
        this.lookup('pivotgrid').reconfigurePivot(button.cfg);
    },

    yearLabelRenderer: function(value) {
        return 'Year ' + value;
    },

    monthLabelRenderer: function(value) {
        return Ext.Date.monthNames[value];
    },

    onPivotGroupExpand: function(matrix, type, group) {
        Ext.log((group ? 'Group "' + group.name + '" expanded on ' : 'All groups expanded on ') + type);
    },

    onPivotGroupCollapse: function(matrix, type, group) {
        Ext.log((group ? 'Group "' + group.name + '" collapsed on ' : 'All groups expanded on ') + type);
    }
});
