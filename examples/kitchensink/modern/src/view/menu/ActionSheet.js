/**
 * Demonstrates the {@link Ext.ActionSheet} component
 */
Ext.define('KitchenSink.view.menu.ActionSheet', {
    extend: 'Ext.Panel',
    xtype: 'actionsheets',
    controller: 'actionsheets',
    title: 'Action Sheet',

    requires: [
        'Ext.ActionSheet'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/menu/ActionSheetController.js'
    }],

    profiles: {
        defaults: {
            width: 500
        },
        phone: {
            defaults: {
                width: undefined
            }
        }
    },
    //</example>

    autoSize: true,
    bodyPadding: 20,
    scrollable: true,
    width: '${width}',

    defaults: {
        xtype: 'button',
        cls: 'demobtn',
        margin: '10 0'
    },

    items: [{
        xtype: 'component',
        html: '<b>Ext.ActionSheet</b> is a component which allows you to easily display sliding ' +
              'menus from any side of the screen.<br /><br />You can change which side the menu ' +
              'will be shown on:'
    }, {
        xtype: 'segmentedbutton',
        reference: 'sideButton',
        items: [{
            text: 'Left',
            pressed: true,
            value: 'left'
        }, {
            text: 'Right',
            value: 'right'
        }, {
            text: 'Top',
            value: 'top'
        }, {
            text: 'Bottom',
            value: 'bottom'
        }]
    }, {
        xtype: 'component',
        html: 'Menus may be shown using one of the following settings:'
    }, {
        xtype: 'segmentedbutton',
        reference: 'styleButton',
        items: [{
            text: 'Reveal',
            pressed: true,
            value: 'reveal'
        }, {
            text: 'Cover',
            value: 'cover'
        }]
    }, {
        text: 'Toggle Menu',
        handler: 'toggleMenu'
    }]
});
