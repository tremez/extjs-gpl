/**
 * A simple header component for grouped grids.  Grid row headers are created automatically
 * by {@link Ext.grid.Grid Grids} and should not be directly instantiated.
 */
Ext.define('Ext.grid.RowHeader', {
    extend: 'Ext.dataview.ItemHeader',
    xtype: 'rowheader',
    classCls: Ext.baseCSSPrefix + 'rowheader',

    isRowHeader: true,

    toolDefaults: {
        ui: 'itemheader rowheader'
    },

    privates: {
        augmentToolHandler: function(tool, args) {
            // args = [ itemHeader, tool, ev ]   ==>   [ grid, info ]
            this.callParent([tool, args]);

            args[1].grid = args[1].list;
        },

        getGroupHeaderTplData: function() {
            var data = this.callParent([ /* skipHtml= */true ]),
                grid = this.parent,
                partners = grid.allPartners || [grid],
                len = partners.length,
                i, p, column;

            if (data) {
                for (i = 0; i < len; ++i) {
                    p = partners[i];
                    column = p.getColumnForField(data.groupField);

                    if (column) {
                        break;
                    }
                }
            }

            if (column) {
                data.columnName = column.getText();

                if (column.printValue) {
                    data.html = column.printValue(data.value);
                }
            }
            else if (data) {
                data.html = Ext.htmlEncode(data.name);
            }

            return data;
        }
    }
});
