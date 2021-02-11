Ext.define('KitchenSink.view.chart.line.RendererController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.line-renderer',

    onRefresh: function() {
        var chart = this.lookup('chart'),
            store = chart.getStore();

        store.refreshData();
    },

    onSeriesRender: function(sprite, config, rendererData, index) {
        var store = rendererData.store,
            storeItems = store.getData().items,
            currentRecord = storeItems[index],
            previousRecord = (index > 0 ? storeItems[index - 1] : currentRecord),
            current = currentRecord && currentRecord.data.g1,
            previous = previousRecord && previousRecord.data.g1,
            isUp = current >= previous,
            changes = {};

        switch (config.type) {
            case 'marker':
                changes.strokeStyle = (isUp ? 'cornflowerblue' : 'tomato');
                changes.fillStyle = (isUp ? 'aliceblue' : 'lightpink');
                break;
            case 'line':
                changes.strokeStyle = (isUp ? 'cornflowerblue' : 'tomato');
                changes.fillStyle = (isUp ? 'rgba(100, 149, 237, 0.4)' : 'rgba(255, 99, 71, 0.4)');
                break;
        }

        return changes;
    }
});
