/**
 * This example demos all the built-in easing
 * functions there are, and shows how one can
 * create their own easing functions for sprite
 * animations.
 */
Ext.define('KitchenSink.view.chart.drawing.Easings', {
    extend: 'Ext.Container',
    xtype: 'easing-functions',
    controller: 'easing-functions',

    requires: [
        'Ext.draw.Component'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/drawing/EasingsController.js'
    }],

    profiles: {
        defaults: {
            fieldValue: 10,
            fieldProp: 'padding',
            fieldShadow: true,
            padding: 8,
            shadow: true
        },
        ios: {
            fieldProp: 'margin',
            fieldValue: '10 0'
        },
        phone: {
            defaults: {
                fieldShadow: undefined,
                padding: undefined,
                shadow: undefined
            }
        }
    },

    padding: '${padding}', // give room for the draw component's shadow
    shadow: false,
    //</example>

    layout: 'fit',

    listeners: {
        resize: 'onResize'
    },

    items: [{
        xtype: 'draw',
        shadow: '${shadow}',
        engine: 'Ext.draw.engine.Svg',
        cls: 'demo-solid-background',
        reference: 'draw',
        sprites: [{
            id: 'circle',
            type: 'circle',
            r: 20,
            fillStyle: 'red'
        }, {
            id: 'topLine',
            type: 'line'
        }, {
            id: 'bottomLine',
            type: 'line'
        }]
    }, {
        xtype: 'toolbar',
        docked: 'top',
        ui: 'transparent',
        items: [{
            xtype: 'selectfield',
            cls: 'demo-solid-background',
            shadow: '${fieldShadow}',
            '${fieldProp}': '${fieldValue}',
            displayField: 'name',
            valueField: 'name',
            reference: 'easings',
            queryMode: 'local',
            listeners: {
                change: 'onSelect'
            }
        }]
    }]
});
