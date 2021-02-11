/**
 * This example demonstrates using a paging display.
 */
Ext.define('KitchenSink.view.grid.Paging', {
    extend: 'Ext.grid.Panel',
    xtype: 'paging-grid',
    controller: 'paging-grid',

    requires: [
        'Ext.toolbar.Paging',
        'Ext.ux.PreviewPlugin'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/grid/PagingController.js'
    }, {
        type: 'Store',
        path: 'app/store/ForumThreads.js'
    }, {
        type: 'Model',
        path: 'app/model/grid/ForumThread.js'
    }],
    profiles: {
        classic: {
            width: 700,
            height: 500,
            repliesWidth: 70,
            percentChangeColumnWidth: 75,
            lastUpdatedColumnWidth: 85,
            lastpostWidth: 150
        },
        neptune: {
            width: 760,
            height: 500,
            percentChangeColumnWidth: 100,
            lastUpdatedColumnWidth: 115,
            repliesWidth: 70,
            lastpostWidth: 150
        },
        graphite: {
            width: 1000,
            height: 600,
            repliesWidth: 150,
            lastpostWidth: 250
        },
        'classic-material': {
            width: 1000,
            height: 600,
            repliesWidth: 150,
            lastpostWidth: 250
        }
    },
    //</example>

    title: 'Browse Forums',
    width: '${width}',
    height: '${height}',

    autoLoad: true,
    frame: true,
    disableSelection: true,
    loadMask: true,

    store: {
        type: 'forumthreads'
    },
    viewModel: {
        data: {
            expanded: true
        }
    },

    plugins: {
        preview: {
            expanded: true,
            bodyField: 'excerpt'
        }
    },

    viewConfig: {
        trackOver: false,
        stripeRows: false
    },

    columns: [{
        text: "Topic",
        dataIndex: 'title',

        flex: 1,
        sortable: false,
        renderer: 'renderTopic'
    }, {
        text: "Author",
        dataIndex: 'username',

        width: 100,
        hidden: true,
        sortable: true
    }, {
        text: "Replies",
        dataIndex: 'replycount',

        width: '${repliesWidth}',
        align: 'right',
        sortable: true
    }, {
        text: "Last Post",
        dataIndex: 'lastpost',

        width: '${lastpostWidth}',
        sortable: true,
        renderer: 'renderLast'
    }],

    bbar: {
        xtype: 'pagingtoolbar',
        displayInfo: true,
        displayMsg: 'Displaying topics {0} - {1} of {2}',
        emptyMsg: "No topics to display",

        items: ['-', {
            bind: '{expanded ? "Hide Preview" : "Show Preview"}',
            pressed: '{expanded}',
            enableToggle: true,
            toggleHandler: 'onToggleExpanded'
        }]
    }
});
