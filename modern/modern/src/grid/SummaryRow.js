/**
 *
 * @since 6.5.0
 */
Ext.define('Ext.grid.SummaryRow', {
    extend: 'Ext.grid.Row',
    xtype: 'gridsummaryrow',

    requires: [
        'Ext.data.summary.*'
    ],

    isSummaryRow: true,

    config: {
        // translatable: {
        //     type: 'csstransform'
        // },

        group: null
    },

    defaultCellUI: 'summary',

    classCls: Ext.baseCSSPrefix + 'summaryrow',

    element: {
        reference: 'element',
        children: [{
            reference: 'cellsElement',
            className: Ext.baseCSSPrefix + 'cells-el'
        }, {
            reference: 'rightSpacer',
            className: Ext.baseCSSPrefix + 'cells-el-right-spacer'
        }]
    },

    updateGroup: function() {
        this.syncSummary();
    },

    privates: {
        beginRefresh: function(context) {
            var me = this,
                group = me.getGroup();

            context = me.callParent([ context ]);

            context.group = group;
            context.records = (group ? group.data : context.store.data).items;
            context.summary = true;

            return context;
        },

        syncSummary: function() {
            var me = this,
                owner = me.getGroup() || me.parent.store,
                record = owner.getSummaryRecord(),
                viewModel = me.getViewModel();

            if (record === me.getRecord()) {
                me.refresh();
            }
            else {
                me.setRecord(record);

                if (viewModel) {
                    viewModel.setData({
                        record: record
                    });
                }
            }
        }
    } // privates
});
