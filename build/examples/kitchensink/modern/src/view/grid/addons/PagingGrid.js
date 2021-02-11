/**
 * The PagingToolbar grid plugin automatically adds a docked paging
 * toolbar to the grid that will allow for pages to be changed. Pages
 * can be changed by either clicking on the forward or back buttons in
 * the docked toolbar or by sliding the slider.
 */
Ext.define('KitchenSink.view.grid.addons.PagingGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'sliding-pager',
    controller: 'paging-grid',
    title: 'Browse Forums',

    requires: [
        'Ext.grid.plugin.PagingToolbar'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/grid/addons/PagingGridController.js'
    }, {
        type: 'Store',
        path: 'app/store/ForumThreads.js'
    }, {
        type: 'Model',
        path: 'app/model/grid/ForumThread.js'
    }],

    profiles: {
        defaults: {
            height: 400,
            width: 600
        },
        phone: {
            defaults: {
                height: undefined,
                width: undefined
            }
        }
    },

    cls: 'sliding-pager',
    //</example>

    height: '${height}',
    width: '${width}',

    plugins: {
        gridpagingtoolbar: true
    },

    store: {
        type: 'forumthreads',
        autoLoad: true
    },

    rowNumbers: {
        text: 'Index'
    },

    columns: [{
        text: 'Topic',
        dataIndex: 'title',
        flex: 1,
        sortable: false,
        renderer: 'renderTopic',
        cell: {
            encodeHtml: false
        }
    }, {
        text: 'Author',
        dataIndex: 'username',
        width: 100,
        hidden: true
    }, {
        text: 'Replies',
        dataIndex: 'replycount',
        width: 80,
        align: 'right'
    }, {
        text: 'Last Post',
        dataIndex: 'lastpost',
        width: 150,
        renderer: 'renderLast',
        cell: {
            encodeHtml: false
        }
    }]
});
