/*
 * Demonstrates all the animations
 */
Ext.define('KitchenSink.view.animations.Animations', {
    extend: 'Ext.Container',
    xtype: 'animations',
    controller: 'animations',

    requires: [
        'KitchenSink.view.animations.AnimationsController'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/animations/AnimationsController.js'
    }],

    profiles: {
        defaults: {
            height: 430,
            width: 300
        },
        'modern-triton': {
            height: 550
        },
        phone: {
            defaults: {
                height: '100%',
                width: '100%'
            }
        }
    },

    cls: 'demo-solid-background',
    //</example>

    height: '${height}',
    width: '${width}',

    layout: {
        type: 'card'
    },

    anims: [{
        group: 'Slide'
    }, {
        group: 'Cover'
    }, {
        group: 'Reveal'
    },
            'Fade',
            'Pop',
            'Flip'
    ],

    defaults: {
        defaultType: 'button',
        layout: 'vbox',
        padding: 20,
        scrollable: 'y'
    }
});
