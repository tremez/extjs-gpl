Ext.define('KitchenSink.view.chart.line.RealTimeNumberController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.line-real-time-number',

    init: function(view) {
        this.callParent([view]);

        // put this here for onActiveItemChange to start
        this.numberChartTask = Ext.TaskManager.start({
            run: this.addNewData,
            fireOnStart: true,
            interval: 1000,
            repeat: 120,
            scope: this,
            stopped: true
        });
    },

    destroy: function() {
        Ext.TaskManager.stop(this.numberChartTask);

        this.callParent();
    },

    onAxisLabelRender: function(axis, label, layoutContext) { // only render integer values
        return Math.abs(layoutContext.renderer(label) % 1) < 1e-5 ? Math.round(label) : '';
    },

    getNextValue: function(previousValue, min, max, delta) {
        delta = delta || 3;
        min = min || 0;
        max = max || 20;

        delta = Ext.Number.randomInt(-delta, delta);

        if (Ext.isNumber(previousValue)) {
            return Ext.Number.constrain(previousValue + delta, min, max);
        }

        return Ext.Number.randomInt(min, max);
    },

    addNewData: function() {
        var chart = this.lookup('chart'),
            store = chart.getStore(),
            count = store && store.getCount(),
            xAxis = chart.getAxes(),
            visibleRange = 20,
            minY = 0,
            maxY = 100,
            deltaY = 5,
            xValue, lastRecord;

        if (store) {
            xAxis = xAxis[1];

            if (count > 0) {
                lastRecord = store.getAt(count - 1);
                xValue = lastRecord.get('xValue') + 1;

                if (xValue > visibleRange) {
                    xAxis.setMinimum(xValue - visibleRange);
                    xAxis.setMaximum(xValue);
                }

                store.add({
                    xValue: xValue,
                    yValue: this.getNextValue(lastRecord.get('yValue'), minY, maxY, deltaY)
                });
            }
            else {
                chart.animationSuspended = true;

                xAxis.setMinimum(0);
                xAxis.setMaximum(visibleRange);

                store.add({
                    xValue: 0,
                    yValue: this.getNextValue((minY + maxY) / 2, minY, maxY)
                });

                chart.animationSuspended = false;
            }
        }
    }

});
