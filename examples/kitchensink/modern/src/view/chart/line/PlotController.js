Ext.define('KitchenSink.view.chart.line.PlotController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.line-plot',

    i: -1,

    fn: [
        function(x) {
            return Math.sin(5 * x);
        },
        function(x) {
            return x * x * 2 - 1;
        },
        function(x) {
            return Math.sqrt((1 + x) / 2) * 2 - 1;
        },
        function(x) {
            return x * x * x;
        },
        function(x) {
            return Math.cos(10 * x);
        },
        function(x) {
            return 2 * x;
        },
        function(x) {
            return Math.pow(x, -2);
        },
        function(x) {
            return Math.pow(x, -3);
        },
        function(x) {
            return Math.tan(5 * x);
        }
    ],

    init: function(view) {
        var chart, toolbar, interaction, button;

        this.callParent([view]);

        if (!Ext.supports.Touch) {
            /**
             * Touch devices do not need the toggle buttons
             * as the panzoom interaction can determine which
             * interaction to use based on how many touches.
             * 1 touch point is a pan, 2 touch points is a zoom.
             */
            chart = view.lookup('chart');
            toolbar = view.lookup('toolbar');
            interaction = chart.getInteraction('panzoom');
            button = interaction.getModeToggleButton();

            toolbar.add(button);
        }

        this.onRefresh();
    },

    generateData: function() {
        var delta = arguments[0],
            length = arguments.length,
            data = [],
            cap = 10000,
            i, j, y,
            rec;

        for (i = -2; i <= 2; i += delta) {
            rec = {
                x: i
            };

            for (j = 1; j < length; ++j) {
                y = arguments[j](i);

                if (y > cap) {
                    y = cap;
                }

                rec['y' + j] = y;
            }

            data.push(rec);
        }

        return data;
    },

    onRefresh: function() {
        var chart = this.lookup('chart'),
            store = chart.getStore(),
            fn = this.fn,
            data = this.generateData(0.02, fn[++this.i % fn.length]);

        store.setData(data);
    }
});
