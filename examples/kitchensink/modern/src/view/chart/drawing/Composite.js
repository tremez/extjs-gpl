/**
 * This example shows how to create and use composite sprites.
 * Please see the 'Sprite' tab for details.
 */
Ext.define('KitchenSink.view.chart.drawing.Composite', {
    extend: 'Ext.Panel',
    xtype: 'draw-composite',
    controller: 'draw-composite',

    requires: [
        'Ext.draw.Component',
        'KitchenSink.view.chart.drawing.Protractor'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/drawing/CompositeController.js'
    }, {
        type: 'Sprite',
        path: 'modern/src/view/chart/drawing/Protractor.js'
    }],
    //</example>

    layout: 'fit',

    tbar: ['->', {
        xtype: 'segmentedbutton',
        width: 200,
        defaults: {
            ui: 'default-toolbar'
        },
        items: [{
            text: 'Interaction',
            pressed: true
        }, {
            text: 'Animation'
        }],
        listeners: {
            toggle: 'onToggle'
        }
    }],

    items: [{
        xtype: 'draw',
        reference: 'draw',
        style: 'background: white',
        sprites: [{
            type: 'protractor',
            id: 'protractor',
            fromX: 325,
            fromY: 250,
            toX: 400,
            toY: 150,
            strokeStyle: 'red'
        }],
        listeners: {
            element: 'element',
            mousedown: 'onMouseDown',
            mousemove: 'onMouseMove'
        }
    }],

    listeners: {
        show: 'onShow'
    }
});
