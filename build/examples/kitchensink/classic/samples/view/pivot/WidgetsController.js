/**
 * Controls the widgets view example.
 */
Ext.define('KitchenSink.view.pivot.WidgetsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pivotwidgets',

    onAddData: function() {
        var store = this.getView().getMatrix().store,
            data = KitchenSink.data.PivotData.getData(6),
            len = data.length,
            i, record;

        for (i = 0; i < len; i++) {
            record = data[i];
            record.person = 'Adrian';
            record.company = (i < 3 ? 'Microsoft' : 'Apple');
        }

        store.add(data);
    },

    onUpdateData: function() {
        var store = this.getView().getMatrix().store,
            data = KitchenSink.data.PivotData.getData(1)[0],
            record = KitchenSink.data.PivotData.getRandomItem(store.data.items);

        if (record) {
            record.set(data);
        }
    },

    onRemoveData: function() {
        var store = this.getView().getMatrix().store,
            record = KitchenSink.data.PivotData.getRandomItem(store.data.items);

        if (record) {
            store.remove(record);
        }
    },

    onClearData: function() {
        var store = this.getView().getMatrix().store;

        store.removeAll();
    },

    onPivotGroupExpand: function(matrix, type, group) {
        Ext.log((group ? 'Group "' + group.name + '" expanded on ' : 'All groups expanded on ') + type);
    },

    onPivotGroupCollapse: function(matrix, type, group) {
        Ext.log((group ? 'Group "' + group.name + '" collapsed on ' : 'All groups expanded on ') + type);
    },

    changeView: function(button, checked) {
        if (checked) {
            this.getView().reconfigurePivot({
                viewLayoutType: button.text.toLowerCase()
            });
        }
    },

    getPerformance: function(records, dataIndex) {
        var ret = [],
            len = records.length,
            i;

        for (i = 0; i < len; i++) {
            ret.push(records[i].get(dataIndex));
        }

        return ret.length ? ret : null;
    },

    rand: 37
});
