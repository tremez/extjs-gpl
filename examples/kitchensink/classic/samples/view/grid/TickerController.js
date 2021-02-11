Ext.define('KitchenSink.view.grid.TickerController', {
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

    renderPositiveNegative: function(val, format) {
        var out = Ext.util.Format.number(val, '0.00'),
            s = '<span',
            theme = Ext.theme.name;

        if (theme === "Graphite") {
            s += ' style="color:unset;"';
        }
        else {
            if (val > 0) {
                s += ' style="color:#73b51e;"';
            }
            else if (val < 0) {
                s += ' style="color:#cf4c35;"';
            }
        }

        return s + '>' + out + '</span>';
    },

    renderChange: function(val) {
        if (this.view.lookupViewModel().get('flashBackground')) {
            arguments[1].tdCls = [val < 0 ? 'ticker-cell-loss' : val > 0 ? 'ticker-cell-gain' : ''];
        }

        return this.renderPositiveNegative(val, '0.00');
    },

    renderChangePercent: function(val) {
        if (this.view.lookupViewModel().get('flashBackground')) {
            arguments[1].tdCls = [val < 0 ? 'ticker-cell-loss' : val > 0 ? 'ticker-cell-gain' : ''];
        }

        return this.renderPositiveNegative(val, '0.00%');
    },

    updaterPositiveNegative: function(cell, value, format) {
        var innerSpan = Ext.fly(cell).down('span', true);

        innerSpan.style.color = value > 0 ? '#73b51e' : '#cf4c35';
        innerSpan.firstChild.data = Ext.util.Format.number(value, format);
    },

    updateChange: function(cell, value) {
        this.updaterPositiveNegative(cell, value, '0.00');
    },

    updateChangePercent: function(cell, value) {
        this.updaterPositiveNegative(cell, value, '0.00%');
    },

    destroy: function() {
        Ext.uninterval(this.timer);
    },

    /**
     * @param {Ext.slider.Multi} slider
     * @param {Number/null} newValue
     * @param {Ext.slider.Thumb/null} thumb
     * @param {String} type
     */
    onTickDelayChange: function(slider, newValue, thumb, type) {
        Ext.view.AbstractView.updateDelay = newValue;
    }
});
