/**
 *
 * This example shows that the pivot grid is stateful.
 *
 * Use the button "Configure" to apply a matrix configuration, navigate to another
 * example in KS and return to this example. The pivot grid will be restored to the
 * last configuration used.
 *
 * Use "Clear state" to remove the state.
 */
Ext.define('KitchenSink.view.pivot.Stateful', {
    extend: 'Ext.pivot.Grid',
    xtype: 'stateful-pivot-grid',
    controller: 'statefulpivot',

    requires: [
        'KitchenSink.view.pivot.StatefulController',
        'KitchenSink.store.pivot.Sales'
    ],

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'classic/samples/view/pivot/StatefulController.js'
    }, {
        type: 'Model',
        path: 'classic/samples/model/pivot/Sale.js'
    }, {
        type: 'Store',
        path: 'classic/samples/store/pivot/Sales.js'
    }],
    profiles: {
        classic: {
            width: 600,
            height: 350
        },
        neptune: {
            width: 750,
            height: 400
        },
        graphite: {
            width: 750,
            height: 600
        },
        'classic-material': {
            width: 750,
            height: 600
        }
    },
    //</example>

    title: 'Stateful Pivot Grid',
    width: '${width}',
    height: '${height}',
    collapsible: true,
    multiSelect: true,

    selModel: {
        type: 'spreadsheet'
    },

    stateful: true,
    stateId: 'PivotGrid',

    matrix: {
        type: 'local',
        store: {
            type: 'sales'
        }
    },

    tbar: [{
        text: 'Configure',
        handler: 'onConfigure'
    }, {
        text: 'Clear state',
        handler: 'onClearState'
    }]
});
