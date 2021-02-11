Ext.define('KitchenSink.view.icons.VectorIcons', {
    extend: 'Ext.Container',
    xtype: 'vector-icons',
    controller: 'vector-icons',

    mixins: [
        'KitchenSink.view.icons.VectorIconsMixin'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/icons/VectorIconsController.js'
    }, {
        type: 'Sprite',
        path: 'modern/src/view/icons/XRay.js'
    }],

    cls: 'demo-solid-background',
    //</example>

    layout: 'fit',

    iconTpl: {
        type: 'path',
        fillStyle: '#333333',
        stroke: 'none',
        shadowColor: 'none',
        shadowBlur: 0,
        transformFillStroke: true,
        animation: {
            duration: 200
        },
        highlightCfg: {
            shadowColor: '#4aa',
            shadowBlur: 5,
            fillStyle: '#0050af'
        },
        modifiers: 'highlight'
    },

    items: [{
        reference: 'listContainer',
        docked: 'right',
        layout: 'fit',
        items: [{
            xtype: 'draw',
            scrollable: 'y',
            reference: 'list',
            resizeHandler: 'listResizeHandler',
            touchAction: {
                panX: true,
                panY: true
            },
            listeners: {
                element: 'element',
                tap: 'onIconTap'
            }
        }]
    }, {
        xtype: 'draw',
        reference: 'preview',
        margin: '0 0 0 10',
        resizeHandler: 'previewResizeHandler',
        sprites: [{
            type: 'xray',
            strokeStyle: 'black',
            fillStyle: 'rgba(0,0,0,0.3)',
            scalingCenterX: 0,
            scalingCenterY: 0,
            scaling: 15,
            lineWidth: 2
        }]
    }]
});
