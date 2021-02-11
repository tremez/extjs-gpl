Ext.define('KitchenSink.view.chart.column.StackedController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.column-stacked',

    init: function(view) {
        var chart, interaction, button, segButton, toolbar;

        this.callParent([view]);

        toolbar = view.child('toolbar');

        if (Ext.supports.Touch) {
            if (Ext.platformTags.phone) {
                segButton = toolbar.getAt(2);

                toolbar.insert(2, {
                    xtype: 'component',
                    flex: 1,
                    shadow: false
                });

                segButton.setMargin(null);
            }
        }
        else {
            /**
             * Touch devices do not need the toggle buttons
             * as the panzoom interaction can determine which
             * interaction to use based on how many touches.
             * 1 touch point is a pan, 2 touch points is a zoom.
             */
            chart = view.lookup('chart');
            interaction = chart.getInteraction('panzoom');
            button = interaction.getModeToggleButton();

            toolbar.add(button);
        }
    },

    onStackedToggle: function(segmentedButton, button, pressed) {
        var chart = this.lookup('chart'),
            series = chart.getSeries()[0],
            value = segmentedButton.getValue();

        series.setStacked(value === 0);
        chart.redraw();
    }
});
