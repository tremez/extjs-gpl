/**
 * This example shows how to create split buttons with the dropdown arrow on the bottom.
 * The position of the arrow can be controlled using the `arrowAlign` config.
 */
Ext.define('KitchenSink.view.button.SplitBottomButtons', {
    extend: 'Ext.Container',
    xtype: 'split-bottom-buttons',
    controller: 'buttons',

    layout: 'vbox',
    width: '${width}',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/button/ButtonsController.js'
    }],
    profiles: {
        classic: {
            width: 420
        },
        neptune: {
            width: 475
        },
        triton: {
            width: 500
        },
        'neptune-touch': {
            width: 585
        },
        graphite: {
            width: 680
        },
        'classic-material': {
            width: 680
        }
    },
    //</example>

    items: [{
        xtype: 'checkbox',
        boxLabel: 'Disabled',
        margin: '0 0 0 10',
        listeners: {
            change: 'toggleDisabled'
        }
    }, {
        xtype: 'container',
        layout: {
            type: 'table',
            columns: 4,
            tdAttrs: { style: 'padding: 5px 10px;' }
        },
        defaults: {
            arrowAlign: 'bottom',
            menu: [{
                text: 'Menu Item 1'
            }, {
                text: 'Menu Item 2'
            }, {
                text: 'Menu Item 3'
            }]
        },

        items: [{
            xtype: 'component',
            html: 'Text Only'
        }, {
            xtype: 'splitbutton',
            text: 'Small'
        }, {
            xtype: 'splitbutton',
            text: 'Medium',
            scale: 'medium'
        }, {
            xtype: 'splitbutton',
            text: 'Large',
            scale: 'large'
        }, {
            xtype: 'component',
            html: 'Icon Only (toggle)'
        }, {
            iconCls: 'button-home-small',
            xtype: 'splitbutton',
            enableToggle: true
        }, {
            xtype: 'splitbutton',
            iconCls: 'button-home-medium',
            scale: 'medium',
            enableToggle: true
        }, {
            xtype: 'splitbutton',
            iconCls: 'button-home-large',
            scale: 'large',
            enableToggle: true
        }, {
            xtype: 'component',
            html: 'Icon and Text (left)'
        }, {
            xtype: 'splitbutton',
            iconCls: 'button-home-small',
            text: 'Small'
        }, {
            xtype: 'splitbutton',
            iconCls: 'button-home-medium',
            text: 'Medium',
            scale: 'medium'
        }, {
            xtype: 'splitbutton',
            iconCls: 'button-home-large',
            text: 'Large',
            scale: 'large'
        }, {
            xtype: 'component',
            html: 'Icon and Text (top)'
        }, {
            xtype: 'splitbutton',
            iconCls: 'button-home-small',
            text: 'Small',
            iconAlign: 'top'
        }, {
            xtype: 'splitbutton',
            iconCls: 'button-home-medium',
            text: 'Medium',
            scale: 'medium',
            iconAlign: 'top'
        }, {
            xtype: 'splitbutton',
            iconCls: 'button-home-large',
            text: 'Large',
            scale: 'large',
            iconAlign: 'top'
        }, {
            xtype: 'component',
            html: 'Icon and Text (right)'
        }, {
            xtype: 'splitbutton',
            iconCls: 'button-home-small',
            text: 'Small',
            iconAlign: 'right'
        }, {
            xtype: 'splitbutton',
            iconCls: 'button-home-medium',
            text: 'Medium',
            scale: 'medium',
            iconAlign: 'right'
        }, {
            xtype: 'splitbutton',
            iconCls: 'button-home-large',
            text: 'Large',
            scale: 'large',
            iconAlign: 'right'
        }, {
            xtype: 'component',
            html: 'Icon and Text (bottom)'
        }, {
            xtype: 'splitbutton',
            iconCls: 'button-home-small',
            text: 'Small',
            iconAlign: 'bottom'
        }, {
            xtype: 'splitbutton',
            iconCls: 'button-home-medium',
            text: 'Medium',
            scale: 'medium',
            iconAlign: 'bottom'
        }, {
            xtype: 'splitbutton',
            iconCls: 'button-home-large',
            text: 'Large',
            scale: 'large',
            iconAlign: 'bottom'
        }]
    }]
});
