/**
 * Controls the stateful pivot grid.
 */
Ext.define('KitchenSink.view.pivot.StatefulController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.statefulpivot',

    onConfigure: function() {
        var view = this.getView();

        view.reconfigurePivot({
            // Configure the aggregate dimensions. Multiple dimensions are supported.
            aggregate: [{
                dataIndex: 'value',
                header: 'Total',
                aggregator: 'sum'
            }],

            // Configure the left axis dimensions that will be used to generate
            // the grid rows
            leftAxis: [{
                dataIndex: 'year',
                header: 'Year'
            }, {
                dataIndex: 'person',
                header: 'Person'
            }],

            /**
             * Configure the top axis dimensions that will be used to generate
             * the columns.
             *
             * When columns are generated the aggregate dimensions are also used.
             * If multiple aggregation dimensions are defined then each top axis
             * result will have in the end a column header with children columns
             * for each aggregate dimension defined.
             */
            topAxis: [{
                dataIndex: 'continent',
                header: 'Continent'
            }, {
                dataIndex: 'country',
                header: 'Country'
            }]
        });
    },

    onClearState: function() {
        Ext.state.Manager.getProvider().clear(this.getView().stateId);
        this.getView().reconfigurePivot({
            aggregate: [],
            leftAxis: [],
            topAxis: []
        });
    }
});
