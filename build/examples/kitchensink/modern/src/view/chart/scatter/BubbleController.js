Ext.define('KitchenSink.view.chart.scatter.BubbleController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.scatter-bubble',

    requires: [
        'Ext.util.Color'
    ],

    seed: 1.3,

    init: function(view) {
        this.callParent([view]);
        this.onRefresh();
    },

    random: function() {
        this.seed *= 7.3;
        this.seed -= Math.floor(this.seed);

        return this.seed;
    },

    createData: function(count) {
        var me = this,
            record = {
                id: 0,
                g0: 300,
                g1: 700 * me.random() + 100,
                g2: 700 * me.random() + 100,
                g3: 700 * me.random() + 100,
                name: 'Item-0'
            },
            data = [record],
            i;

        for (i = 1; i < count; i++) {
            data.push(record = {
                id: i,
                g0: record.g0 + 30 * me.random(),
                g1: Math.abs(record.g1 + 300 * me.random() - 140),
                g2: Math.abs(record.g2 + 300 * me.random() - 140),
                g3: Math.abs(record.g3 + 300 * me.random() - 140)
            });
        }

        return data;
    },

    onRefresh: function() {
        var chart = this.lookup('chart'),
            store = chart.getStore();

        store.setData(this.createData(40));
    },

    interpolate: function(lambda, minSrc, maxSrc, minDst, maxDst) {
        return minDst + (maxDst - minDst) * Math.max(0, Math.min(1, (lambda - minSrc) / (maxSrc - minSrc)));
    },

    interpolateColor: function(lambda, minSrc, maxSrc) {
        var fromHSL = Ext.util.Color.fly('blue').getHSL(),
            toHSL = Ext.util.Color.fly('red').getHSL();

        fromHSL[2] = 0.5;

        return Ext.util.Color.fly(0, 0, 0, 0).setHSL(
            this.interpolate(lambda, minSrc, maxSrc, fromHSL[0], toHSL[0]),
            this.interpolate(lambda, minSrc, maxSrc, fromHSL[1], toHSL[1]),
            this.interpolate(lambda, minSrc, maxSrc, fromHSL[2], toHSL[2])
        ).toString();
    },

    seriesStyleRenderer: function(sprite, config, rendererData, index) {
        var store = rendererData.store,
            storeItem = store.getData().items[index];

        config.radius = this.interpolate(storeItem.data.g3, 0, 1000, 5, 30);
        config.fillOpacity = this.interpolate(storeItem.data.g3, 0, 1000, 1, 0.7);
        config.fill = this.interpolateColor(storeItem.data.g3, 0, 1000);
        config.stroke = Ext.util.Color.fromString(config.fill).createDarker(0.15).toString();
    }
});
