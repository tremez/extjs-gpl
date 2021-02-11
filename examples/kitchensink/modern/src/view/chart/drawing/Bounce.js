Ext.define('KitchenSink.view.chart.drawing.Bounce', {
    extend: 'Ext.Panel',
    xtype: 'draw-bounce',
    controller: 'draw-bounce',

    requires: [
        'Ext.draw.Component'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/drawing/BounceController.js'
    }],
    //</example>

    layout: 'fit',

    items: [{
        xtype: 'draw',
        style: 'background: white',
        reference: 'draw',
        sprites: [{
            type: 'image',
            src: 'modern/resources/images/bounce.png',
            id: 'logo',
            x: 100,
            y: 100,
            width: 256,
            height: 107
        }],

        listeners: {
            resize: 'onResize'
        }
    }]
});
