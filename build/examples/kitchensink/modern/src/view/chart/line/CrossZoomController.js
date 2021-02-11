Ext.define('KitchenSink.view.chart.line.CrossZoomController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.line-crosszoom',

    init: function(view) {
        var chart, toolbar, interaction, button;

        this.callParent([view]);

        chart = view.lookup('chart');
        toolbar = view.lookup('toolbar');
        interaction = chart.getInteraction('crosszoom');
        button = interaction.getUndoButton();

        toolbar.add(button);
    }
});
