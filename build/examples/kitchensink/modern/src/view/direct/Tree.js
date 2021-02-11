/**
 * This example shows how to use a Tree with nodes loaded dynamically from Ext Direct
 * back end.
 */
Ext.define('KitchenSink.view.direct.Tree', {
    extend: 'Ext.grid.Tree',
    xtype: 'direct-tree',
    controller: 'direct-tree',
    title: 'Direct Tree',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/direct/TreeController.js'
    }, {
        type: 'Base Controller',
        path: 'modern/src/view/direct/BaseController.js'
    }, {
        type: 'Server Class',
        path: 'data/direct/source.php?file=testaction'
    }, {
        type: 'Server Config',
        path: 'data/direct/source.php?file=config'
    }],

    profiles: {
        defaults: {
            height: 400,
            width: 400
        },
        phone: {
            defaults: {
                height: undefined,
                width: undefined
            }
        }
    },
    //</example>

    height: '${height}',
    rootVisible: false,
    width: '${width}',

    store: {
        type: 'tree',
        /**
         * By default, a tree with a hidden root will expand
         * the root node automatically when the tree is created.
         * We don't want that to happen since Direct API may not
         * be ready at that point, so we set autoLoad to false
         * which will disable auto-expanding.
         * We will later expand the root node manually in the
         * TreeController's finishInit() method.
         */
        autoLoad: false,
        proxy: {
            type: 'direct',
            directFn: 'TestAction.getTree',
            paramOrder: ['node']
        }
    }
});
