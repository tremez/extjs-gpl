/**
 * This example shows how one can show a tooltip when a 'd3-treemap' item is hovered.
 * Hovering a stock will show its day change, hovering a sector will list the full names
 * of all the companies in it.
 */
Ext.define('KitchenSink.view.d3.hierarchy.TreeMapTooltip', {
    extend: 'Ext.Panel',
    xtype: 'd3-view-treemap-tooltip',
    controller: 'treemap-tooltip',

    requires: [
        'KitchenSink.view.d3.hierarchy.StocksViewModel',
        'Ext.d3.hierarchy.TreeMap'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/d3/hierarchy/TreeMapTooltipController.js'
    }, {
        type: 'Model',
        path: 'app/model/Stock.js'
    }, {
        type: 'View Model',
        path: 'modern/src/view/d3/hierarchy/StocksViewModel.js'
    }, {
        type: 'Data',
        path: 'data/tree/stocks.json'
    }, {
        type: 'Styles',
        path: 'modern/sass/src/view/d3/hierarchy/TreeMap.scss'
    }],
    //</example>

    layout: 'fit',

    parentTpl: [
        '<div class="tip-title">{data.name}</div>',
        '<tpl for="childNodes">',
        '<div><span class="tip-symbol">{data.name}</span><tpl if="data.description"> - {data.description}</tpl></div>',
        '<tpl if="xindex &gt; 10">...{% break; %}</tpl>',
        '</tpl>'
    ],

    leafTpl: [
        '<div class="tip-company">{data.description}</div>',
        '<div>Change:&nbsp;<tpl if="data.change &gt; 0">+</tpl>{data.change}%</div>'
    ],

    viewModel: {
        type: 'stocks'
    },

    items: [{
        xtype: 'd3-treemap',
        rootVisible: false,
        interactions: {
            type: 'panzoom',
            pan: {
                momentum: null
            },
            zoom: {
                doubleTap: false
            }
        },
        bind: {
            store: '{store}',
            selection: '{selection}'
        },
        selectEventName: null,
        expandEventName: null,
        nodeValue: function(node) {
            return node.data.cap;
        },
        noParentValue: true,
        scaleLabels: true,
        tooltip: {
            cls: 'tip',
            ui: 'd3-treemap',
            trackMouse: true,
            renderer: 'onTooltip'
        },
        colorAxis: {
            scale: {
                type: 'linear',
                domain: [-5, 0, 5],
                range: ['#E45649', '#ECECEC', '#50A14F']
            },
            field: 'change',
            processor: function(axis, scale, node, field) {
                var record = node.data;

                return record.isLeaf() ? scale(record.get(field)) : '#ececec';
            }
        }
    }]
});
