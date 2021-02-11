/**
 * Controls the "Data changes" pivot grid example.
 */
Ext.define('KitchenSink.view.pivot.DataChangesController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.datachangespivot',

    onAddData: function() {
        var store = this.lookup('pivotgrid').getMatrix().store;

        store.add(KitchenSink.data.PivotData.getData(1));
    },

    onUpdateData: function() {
        var store = this.lookup('pivotgrid').getMatrix().store,
            data = KitchenSink.data.PivotData.getData(1)[0],
            record = KitchenSink.data.PivotData.getRandomItem(store.data.items);

        if (record) {
            record.set(data);
        }
    },

    onRemoveData: function() {
        var store = this.lookup('pivotgrid').getMatrix().store,
            record = KitchenSink.data.PivotData.getRandomItem(store.data.items);

        if (record) {
            store.remove(record);
        }
    },

    onClearData: function() {
        var store = this.lookup('pivotgrid').getMatrix().store;

        store.removeAll();
    }
});
