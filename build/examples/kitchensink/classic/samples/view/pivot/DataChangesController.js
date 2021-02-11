/**
 * Controls the "Data changes" pivot grid example.
 */
Ext.define('KitchenSink.view.pivot.DataChangesController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.datachangespivot',

    rand: 37,

    onAddData: function() {
        var store = this.getView().getMatrix().store;

        store.add(KitchenSink.data.PivotData.getData(1));
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
    }
});
