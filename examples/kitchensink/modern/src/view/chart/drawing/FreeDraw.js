Ext.define('KitchenSink.view.chart.drawing.FreeDraw', {
    extend: 'Ext.Panel',
    xtype: 'free-paint',
    controller: 'free-draw',

    requires: [
        'KitchenSink.view.chart.drawing.FreeDrawComponent'
    ],

    //<example>
    otherContent: [{
        type: 'Component',
        path: 'modern/src/view/chart/drawing/FreeDrawComponent.js'
    }],
    //</example>

    layout: 'fit',

    tbar: ['->', {
        iconCls: 'x-fa fa-eraser',
        text: 'Clear',
        handler: 'onClear'
    }],

    items: [{
        xclass: 'KitchenSink.view.chart.drawing.FreeDrawComponent',
        reference: 'drawComponent'
    }]
});
