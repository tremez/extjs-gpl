/**
 * This example demonstrates how to create framed panels. Framing is a theme-specific
 * concept that adds rounded corners and sometimes a background-color, depending on what
 * is specified in the theme css.
 */
Ext.define('KitchenSink.view.panel.FramedPanels', {
    extend: 'Ext.Container',
    xtype: 'framed-panels',

    //<example>
    profiles: {
        classic: {
            width: 660,
            itemWidth: 640,
            columns: 3,
            hideLightUI: true
        },
        neptune: {
            width: 880,
            itemWidth: 860,
            columns: 4,
            hideLightUI: false
        },
        aria: {
            width: 660,
            itemWidth: 640,
            columns: 3,
            hideLightUI: true
        },
        'classic-material': {
            width: 660,
            itemWidth: 640,
            columns: 3,
            hideLightUI: true
        }
    },
    //</example>

    width: '${width}',
    cls: 'panels-container',
    layout: {
        type: 'table',
        columns: '${columns}',
        tdAttrs: { style: 'padding: 10px; vertical-align: top;' }
    },

    defaults: {
        xtype: 'panel',
        width: 200,
        height: 280,
        bodyPadding: 10,
        frame: true,
        cls: Ext.baseCSSPrefix + 'shadow'
    },

    items: [{
        html: KitchenSink.DummyText.mediumText
    }, {
        title: 'Title',
        html: KitchenSink.DummyText.mediumText
    }, {
        title: 'Collapsible',
        collapsible: true,
        html: KitchenSink.DummyText.mediumText
    }, {
        title: 'Light UI',
        collapsible: true,
        ui: 'light',
        hidden: '${hideLightUI}',
        html: KitchenSink.DummyText.mediumText
    }, {
        title: 'Built in Tools',
        colspan: '${columns}',
        collapsed: true,
        collapsible: true,
        width: '${itemWidth}',
        html: KitchenSink.DummyText.mediumText,
        tools: [
            { type: 'pin' },
            { type: 'refresh' },
            { type: 'search' },
            { type: 'save' }
        ]
    }, {
        title: 'Built in Tools in Light UI',
        colspan: '${columns}',
        collapsed: true,
        collapsible: true,
        ui: 'light',
        width: '${itemWidth}',
        html: KitchenSink.DummyText.mediumText,
        hidden: '${hideLightUI}',
        tools: [
            { type: 'pin' },
            { type: 'refresh' },
            { type: 'search' },
            { type: 'save' }
        ]
    }, {
        collapsed: true,
        collapsible: false,
        header: {
            enableFocusableContainer: false,
            title: {
                text: 'Custom Tools using iconCls',
                focusable: true,
                tabIndex: 0
            }
        },
        width: '${itemWidth}',
        html: KitchenSink.DummyText.mediumText,
        tools: [
            { iconCls: 'x-fa fa-wrench' },
            { iconCls: 'x-fa fa-reply' },
            { iconCls: 'x-fa fa-reply-all' },
            { iconCls: 'x-fa fa-rocket' }
        ],
        colspan: '${columns}'
    }, {
        collapsed: true,
        collapsible: false,
        ui: 'light',
        hidden: '${hideLightUI}',
        header: {
            enableFocusableContainer: false,
            title: {
                text: 'Custom Tools using iconCls in Light UI',
                focusable: true,
                tabIndex: 0
            }
        },
        width: '${itemWidth}',
        html: KitchenSink.DummyText.mediumText,
        tools: [
            { iconCls: 'x-fa fa-wrench' },
            { iconCls: 'x-fa fa-reply' },
            { iconCls: 'x-fa fa-reply-all' },
            { iconCls: 'x-fa fa-rocket' }
        ],
        colspan: '${columns}'
    }, {
        collapsed: true,
        collapsible: false,
        header: {
            enableFocusableContainer: false,
            title: {
                text: 'Custom Tools using glyph configuration',
                focusable: true,
                tabIndex: 0
            }
        },
        width: '${itemWidth}',
        html: KitchenSink.DummyText.mediumText,
        tools: [
            { glyph: 'xf0ad@\'Font Awesome 5 Free\'' },
            { glyph: 'xf3e5@\'Font Awesome 5 Free\'' },
            { glyph: 'xf122@\'Font Awesome 5 Free\'' },
            { glyph: 'xf135@\'Font Awesome 5 Free\'' }
        ],
        colspan: '${columns}'
    }, {
        collapsed: true,
        collapsible: false,
        ui: 'light',
        hidden: '${hideLightUI}',
        header: {
            enableFocusableContainer: false,
            title: {
                text: 'Custom Tools using glyph configuration in Light UI',
                focusable: true,
                tabIndex: 0
            }
        },
        width: '${itemWidth}',
        html: KitchenSink.DummyText.mediumText,
        tools: [
            { glyph: 'xf0ad@\'Font Awesome 5 Free\'' },
            { glyph: 'xf3e5@\'Font Awesome 5 Free\'' },
            { glyph: 'xf122@\'Font Awesome 5 Free\'' },
            { glyph: 'xf135@\'Font Awesome 5 Free\'' }
        ],
        colspan: '${columns}'
    }]
});
