Ext.define('KitchenSink.view.grid.advanced.TickerController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.tickergrid',

    init: function(view) {
        var store = view.getStore();

        this.callParent();

        if (store.isLoaded() && store.getCount()) {
            this.startTicker(store);
        }

        view.getStore().on('load', 'onStoreLoad', this);
    },

    onStoreLoad: function(store) {
        this.startTicker(store);
    },

    startTicker: function(store) {
        var count, i, j, rec;

        if (this.timer) {
            return;
        }

        store.removeAt(15, 70);

        count = store.getCount();

        for (i = 0; i < count; i++) {
            rec = store.getAt(i);
            rec.beginEdit();

            for (j = 0; j < 10; j++) {
                rec.addPriceTick();
            }

            rec.endEdit(true);
        }

        this.timer = Ext.interval(function() {
            rec = store.getAt(Ext.Number.randomInt(0, store.getCount() - 1));
            rec.addPriceTick();
        }, Ext.isIE || !Ext.is.Desktop ? 100 : 20);
    },

    onTickDelayChange: function(slider, value, oldValue) {
        this.getView().lookupViewModel().getScheduler().setTickDelay(value);
    },

    destroy: function() {
        Ext.uninterval(this.timer);
    }
});
