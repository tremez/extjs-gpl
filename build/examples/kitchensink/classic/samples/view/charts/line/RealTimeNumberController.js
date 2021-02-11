Ext.define('KitchenSink.view.charts.line.RealTimeNumberController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.line-real-time-number',

    onAxisLabelRender: function(axis, label, layoutContext) { // only render interger values
        return Math.abs(layoutContext.renderer(label) % 1) < 1e-5 ? Math.round(label) : '';
    },

    onChartRendered: function(chart) {
        chart.getStore().removeAll();
        this.addNewData();
        this.chartTask = Ext.TaskManager.start({
            run: this.addNewData,
            interval: 1000,
            repeat: 240,
            scope: this
        });
    },

    onChartDestroy: function() {
        if (this.chartTask) {
            Ext.TaskManager.stop(this.chartTask);
        }
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
        var chart = this.lookupReference('chart'),
            store = chart.getStore(),
            count = store.getCount(),
            xAxis = chart.getAxes()[1],
            visibleRange = 20,
            minY = 0,
            maxY = 100,
            deltaY = 5,
            xValue, lastRecord;

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
            xAxis.setMinimum(0);
            xAxis.setMaximum(visibleRange);

            store.add({
                xValue: 0,
                yValue: this.getNextValue((minY + maxY) / 2, minY, maxY)
            });
        }
    }

});
