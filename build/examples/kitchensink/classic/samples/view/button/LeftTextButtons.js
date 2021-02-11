/**
 * This example shows how to align button text to the left. By default, buttons are sized
 * to the width of the text inside them, but this behavior can be overridden by giving the
 * button a fixed width. In such a case the alignment of the text can be controlled using
 * the `textAlign` config.
 */
Ext.define('KitchenSink.view.button.LeftTextButtons', {
    extend: 'Ext.Container',
    xtype: 'left-text-buttons',
    controller: 'buttons',

    layout: 'vbox',
    width: '${width}',
    cls: 'icons-button-padding',
    profiles: {
        classic: {
            width: 680,
            buttonWidth: 150
        },
        neptune: {
            width: 680,
            buttonWidth: 150
        },
        graphite: {
            width: 880,
            buttonWidth: 200
        },
        'classic-material': {
            width: 680,
            buttonWidth: 150
        }
    },
    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/button/ButtonsController.js'
    }],
    //</example>

    items: [{
        xtype: 'checkbox',
        boxLabel: 'disabled',
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
            width: '${buttonWidth}',
            textAlign: 'left'
        },

        items: [{
            xtype: 'component',
            html: 'Text Only'
        }, {
            xtype: 'button',
            text: 'Small'
        }, {
            xtype: 'button',
            text: 'Medium',
            scale: 'medium'
        }, {
            xtype: 'button',
            text: 'Large',
            scale: 'large'
        }, {
            xtype: 'component',
            html: 'Icon Only'
        }, {
            iconCls: 'button-home-small',
            xtype: 'button'
        }, {
            xtype: 'button',
            iconCls: 'button-home-medium',
            scale: 'medium'
        }, {
            xtype: 'button',
            iconCls: 'button-home-large',
            scale: 'large'
        }, {
            xtype: 'component',
            html: 'Icon and Text (left)'
        }, {
            xtype: 'button',
            iconCls: 'button-home-small padding-text-btn-left',
            text: 'Small'
        }, {
            xtype: 'button',
            iconCls: 'button-home-medium padding-text-btn-left',
            text: 'Medium',
            scale: 'medium'
        }, {
            xtype: 'button',
            iconCls: 'button-home-large padding-text-btn-left',
            text: 'Large',
            scale: 'large'
        }, {
            xtype: 'component',
            html: 'Icon and Text (top)'
        }, {
            xtype: 'button',
            iconCls: 'button-home-small',
            text: 'Small',
            iconAlign: 'top'
        }, {
            xtype: 'button',
            iconCls: 'button-home-medium',
            text: 'Medium',
            scale: 'medium',
            iconAlign: 'top'
        }, {
            xtype: 'button',
            iconCls: 'button-home-large',
            text: 'Large',
            scale: 'large',
            iconAlign: 'top'
        }, {
            xtype: 'component',
            html: 'Icon and Text (right)'
        }, {
            xtype: 'button',
            iconCls: 'button-home-small padding-text-btn-right',
            text: 'Small',
            iconAlign: 'right'
        }, {
            xtype: 'button',
            iconCls: 'button-home-medium padding-text-btn-right',
            text: 'Medium',
            scale: 'medium',
            iconAlign: 'right'
        }, {
            xtype: 'button',
            iconCls: 'button-home-large padding-text-btn-right',
            text: 'Large',
            scale: 'large',
            iconAlign: 'right'
        }, {
            xtype: 'component',
            html: 'Icon and Text (bottom)'
        }, {
            xtype: 'button',
            iconCls: 'button-home-small',
            text: 'Small',
            iconAlign: 'bottom'
        }, {
            xtype: 'button',
            iconCls: 'button-home-medium',
            text: 'Medium',
            scale: 'medium',
            iconAlign: 'bottom'
        }, {
            xtype: 'button',
            iconCls: 'button-home-large',
            text: 'Large',
            scale: 'large',
            iconAlign: 'bottom'
        }]
    }]
});
