Ext.define('KitchenSink.view.tip.TipAligningModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.tip-aligning',

    data: {
        tipEdge: 0,
        targetEdge: 2,
        tipOffset: 50,
        targetOffset: 50,
        anchor: true
    },

    formulas: {
        alignSpec: function(getter) {
            var edges = 'trbl',
                tipOffset = getter('tipOffset'),
                targetOffset = getter('targetOffset');

            return edges[getter('tipEdge')] + tipOffset + '-' + edges[getter('targetEdge')] + targetOffset;
        }
    }
});
