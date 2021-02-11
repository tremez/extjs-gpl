Ext.define('KitchenSink.view.chart.line.RealTimeDateController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.line-real-time-date',

    init: function(view) {
        this.callParent([view]);
        // put this here for onActiveItemChange to start
        this.timeChartTask = Ext.TaskManager.start({
            run: this.addNewData,
            fireOnStart: true,
            interval: 1000,
            repeat: 120,
            scope: this
        });
    },

    destroy: function() {
        Ext.TaskManager.stop(this.timeChartTask);

        this.callParent();
    },

    onAxisLabelRender: function(axis, label, layoutContext) { // only render interger values
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
        var me = this,
            chart = me.lookup('chart'),
            store = chart.getStore(),
            count = store && store.getCount(),
            xAxis = chart.getAxes(),
            visibleRange = 10000,
            second = 1000,
            xValue, lastRecord;

        if (store) {
            xAxis = xAxis[1];

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
    }

});
