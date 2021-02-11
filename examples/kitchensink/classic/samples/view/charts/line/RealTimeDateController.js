Ext.define('KitchenSink.view.charts.line.RealTimeDateController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.line-real-time-date',

    onChartRendered: function(chart) {
        chart.getStore().removeAll();
        this.addNewData();
        this.chartTask = Ext.TaskManager.start({
            run: this.addNewData,
            interval: 1000,
            repeat: 120,
            scope: this
        });
    },

    onAxisLabelRender: function(axis, label, layoutContext) { // only render interger values
        return Math.abs(layoutContext.renderer(label) % 1) < 1e-5 ? Math.round(label) : '';
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
        var me = this,
            chart = me.lookupReference('chart'),
            store = chart.getStore(),
            count = store.getCount(),
            xAxis = chart.getAxes()[1],
            visibleRange = 10000,
            second = 1000,
            xValue, lastRecord;

        if (count > 0) {
            lastRecord = store.getAt(count - 1);
            xValue = lastRecord.get('xValue') + second;

            if (xValue - me.startTime > visibleRange) {
                me.startTime = xValue - visibleRange;
                xAxis.setMinimum(this.startTime);
                xAxis.setMaximum(xValue);
            }

            store.add({
                xValue: xValue,
                metric1: me.getNextValue(lastRecord.get('metric1')),
                metric2: me.getNextValue(lastRecord.get('metric2'))
            });

        }
        else {
            chart.animationSuspended = true;
            me.startTime = Math.floor(Ext.Date.now() / second) * second;
            xAxis.setMinimum(me.startTime);
            xAxis.setMaximum(me.startTime + visibleRange);

            store.add({
                xValue: this.startTime,
                metric1: me.getNextValue(),
                metric2: me.getNextValue()
            });
            chart.animationSuspended = false;
        }
    }

});
