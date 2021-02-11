/**
 * Demonstrates usage of a card layout.
 */
Ext.define('KitchenSink.view.layout.Card', {
    extend: 'Ext.panel.Panel',
    xtype: 'layout-card',
    controller: 'layout-card',

    requires: [
        'Ext.layout.Card'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/layout/CardController.js'
    }],

    profiles: {
        defaults: {
            height: 300,
            width: 400
        },
        phone: {
            defaults: {
                height: undefined,
                width: undefined
            }
        }
    },
    //</example>

    bodyPadding: 15,
    height: '${height}',
    layout: 'card',
    width: '${width}',

    buttons: [{
        reference: 'card-prev',
        text: '&laquo; Previous',
        handler: 'showPrevious',
        disabled: true
    }, {
        reference: 'card-next',
        text: 'Next &raquo;',
        handler: 'showNext'
    }],

    items: [{
        html: '<h2>Welcome to the Demo Wizard!</h2><p>Step 1 of 3</p><p>Please click the "Next" button to continue...</p>'
    }, {
        html: '<p>Step 2 of 3</p><p>Almost there.  Please click the "Next" button to continue...</p>'
    }, {
        html: '<h1>Congratulations!</h1><p>Step 3 of 3 - Complete</p>'
    }]
});
