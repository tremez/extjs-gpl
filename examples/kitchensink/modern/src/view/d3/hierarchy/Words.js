/**
 * The 'd3-pack' component visualizes tree nodes as circles, where parent circles
 * contain the child ones. Circle packing is not as space efficient as TreeMap,
 * but it's easier to see the hierarchy.
 * This particular example shows the most frequently encountered words in
 * the 'Treasurer Island' novel by Robert Louis Stevenson. When a word is hovered,
 * the words that follow it are highlighted - their circles get a thicker stroke
 * and a pinkish fill. The more often the word follows the howevered word, the deeper
 * the shade of pink.
 */
Ext.define('KitchenSink.view.d3.hierarchy.Words', {
    extend: 'Ext.panel.Panel',
    xtype: 'd3-view-words',
    controller: 'words',
    title: '"Treasure Island"\'s most used words',

    requires: [
        'KitchenSink.view.d3.hierarchy.TreeViewModel',
        'Ext.d3.hierarchy.Pack'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/d3/hierarchy/WordsController.js'
    }, {
        type: 'Styles',
        path: 'modern/sass/src/view/d3/hierarchy/Words.scss'
    }],
    //</example>

    layout: 'fit',

    items: [{
        xtype: 'd3-pack',
        reference: 'pack',
        rootVisible: false,
        padding: 0,
        nodeText: 'word',
        textPadding: [-8, 0],
        nodeValue: function(node) {
            // Instead of using `nodeValue: 'count'` as a config,
            // take a qubic root of the 'count' to downplay
            // differences in the relative size of nodes.
            return Math.pow(node.data.count, 1 / 3);
        },
        colorAxis: {
            // For this example, we want all nodes to have the same color.
            scale: {
                type: 'ordinal',
                range: ['white']
            }
        },
        // In this example the tree store is flat (one level deep
        // from the root node), so we want to prevent any node
        // expansion attempts, as they are meaningless in this case.
        expandEventName: null,
        selectEventName: 'mouseenter',
        tooltip: {
            renderer: 'onTooltip'
        }
    }]
});
