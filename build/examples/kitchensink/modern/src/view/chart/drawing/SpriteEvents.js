/**
 * This example shows how to use the 'spriteevents' plugin.
 * Clicking on a sprite will change its color.
 */
Ext.define('KitchenSink.view.chart.drawing.SpriteEvents', {
    extend: 'Ext.Container',
    xtype: 'sprite-events',
    controller: 'sprite-events',

    requires: [
        'Ext.draw.Component',
        'Ext.draw.plugin.SpriteEvents'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/drawing/SpriteEventsController.js'
    }],
    //</example>

    layout: 'fit',

    items: [{
        xtype: 'draw',
        style: 'background: white',
        plugins: {
            spriteevents: true
        },
        sprites: [{
            type: 'circle',
            fillStyle: '#7BB20C',
            r: 75,
            x: 100,
            y: 200,
            animation: {
                duration: 300
            }
        }, {
            type: 'rect',
            fillStyle: 'orange',
            x: 150,
            y: 450,
            width: 150,
            height: 150,
            animation: {
                duration: 300
            }
        }, {
            type: 'path',
            strokeStyle: 'rgb(222,127,209)',
            lineWidth: 12,
            lineCap: 'round',
            path: 'M250,300L300,100',
            animation: {
                duration: 300
            }
        }, {
            type: 'text',
            text: 'CLICK ME',
            fontSize: 40,
            fillStyle: 'rgb(121,190,239)',
            x: 200,
            y: 80,
            animation: {
                duration: 300,
                customDurations: {
                    text: 0
                }
            }
        }, {
            type: 'image',
            src: 'modern/resources/images/bounce.png',
            id: 'logo',
            x: 100,
            y: 320,
            width: 256,
            height: 107,
            animation: {
                duration: 500,
                easing: 'bounceOut'
            }
        }],
        listeners: {
            spriteclick: 'onSpriteClick'
        }
    }]
});
