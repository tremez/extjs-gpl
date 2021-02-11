/**
 * This example shows how by subclassing the stock tree component and overriding only a few
 * of its methods, one can get a very different looking tree, in this case - an organizational chart.
 */
Ext.define('KitchenSink.view.d3.hierarchy.Organization', {
    extend: 'Ext.Panel',
    xtype: 'd3-view-sencha-tree',
    controller: 'd3-organization',
    title: 'Organization Chart',

    //<example>
    otherContent: [
        {
            type: 'Org Chart',
            path: 'modern/src/view/d3/hierarchy/Org.js'
        },
        {
            type: 'Controller',
            path: 'modern/src/view/d3/hierarchy/OrganizationController.js'
        },
        {
            type: 'Store',
            path: 'app/store/OrgChart.js'
        }
    ],
    //</example>

    layout: 'fit',

    items: [{
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
    }]
});
