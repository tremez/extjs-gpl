/**
 * The 'd3-treemap' component visualizes tree nodes as rectangles, where parent rectangles
 * contain the child ones. This makes a more efficient use of space than 'd3-pack',
 * but at the expense of some visual clarity.
 * In this example the component is used to show the day performance of the SP500 stocks
 * categorized by market sector. It's very easy to see the stocks and sectors that are doing
 * well and those that are not.
 */
Ext.define('KitchenSink.view.d3.TreeMap', {
    extend: 'Ext.panel.Panel',
    xtype: 'd3-view-treemap',
    controller: 'treemap',

    requires: [
        'KitchenSink.view.d3.StocksViewModel',
        'Ext.d3.hierarchy.TreeMap'
    ],

    //<example>
    // Content between example tags is omitted from code preview.
    otherContent: [
        {
            type: 'Controller',
            path: 'classic/samples/view/d3/TreeMapController.js'
        },
        {
            type: 'Model',
            path: 'app/model/Stock.js'
        },
        {
            type: 'View Model',
            path: 'classic/samples/view/d3/StocksViewModel.js'
        },
        {
            type: 'Data',
            path: 'data/tree/stocks.json'
        }
    ],
    //</example>

    width: '${width}',
    height: 600,

    profiles: {
        classic: {
            width: 930,
            companyPanelWidth: 215
        },
        neptune: {
            width: 930,
            companyPanelWidth: 215
        },
        graphite: {
            width: 1000,
            companyPanelWidth: 300
        },
        'classic-material': {
            width: 1000,
            companyPanelWidth: 300
        }
    },

    layout: 'border',

    viewModel: {
        type: 'stocks'
    },

    items: [
        {
            xtype: 'treepanel',
            region: 'west',
            title: 'Companies',
            split: true,
            splitterResize: false,
            collapsible: true,
            minWidth: 100,
            width: '${companyPanelWidth}',
            useArrows: true,
            displayField: 'name',
            rootVisible: false,
            bind: {
                store: '{store}',
                selection: '{selection}',
                focused: '{selection}'
            },
            tbar: {
                xtype: 'segmentedbutton',
                width: '100%',
                items: [
                    {
                        text: 'Market Cap',
                        pressed: true
                    },
                    {
                        text: 'Uniform'
                    }
                ],
                listeners: {
                    toggle: 'onNodeValueToggle'
                }
            }
        },
        {
            xtype: 'panel',
            region: 'center',
            layout: 'fit',
            items: {
                xtype: 'd3-treemap',
                reference: 'treemap',
                rootVisible: false,
                interactions: {
                    type: 'panzoom',
                    zoom: {
                        doubleTap: false
                    }
                },
                bind: {
                    store: '{store}',
                    selection: '{selection}'
                },
                nodeValue: 'cap',
                noParentValue: true,
                scaleLabels: true,
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
            }
        }
    ]
});
