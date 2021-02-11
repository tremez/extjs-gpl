/**
 * This example shows how by subclassing the stock tree component and overriding only a few
 * of its methods, one can get a very different looking tree, in this case - an organizational chart.
 */
Ext.define('KitchenSink.view.d3.sencha.Tree', {
    extend: 'Ext.panel.Panel',
    xtype: 'd3-view-sencha-tree',
    controller: 'sencha-tree',

    requires: [
        'Ext.d3.chart.Org',
        'KitchenSink.store.OrgChart'

    ],
    //<example>
    // Content between example tags is omitted from code preview.
    otherContent: [
        {
            type: 'Org Chart',
            path: 'classic/samples/view/d3/sencha/OrgChart.js'
        },
        {
            type: 'Controller',
            path: 'classic/samples/view/d3/sencha/TreeController.js'
        },
        {
            type: 'Store',
            path: 'app/store/OrgChart.js'
        }
    ],
    //</example>

    width: 1200,
    height: 700,

    layout: 'fit',

    items: {
        xtype: 'panel',
        layout: 'fit',

        title: 'Sencha Org Chart',

        items: {
            xtype: 'd3-org-chart',

            interactions: {
                type: 'panzoom',
                zoom: {
                    extent: [0.5, 2],
                    doubleTap: false
                }
            },

            tooltip: {
                renderer: 'onTooltip'
            },

            nodeSize: [200, 100],

            imagePath: 'images/staff/',
            imageField: 'avatar',

            store: {
                type: 'org-chart'
            }
        }
    }

});
