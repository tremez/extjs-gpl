/**
 * Controls the Spreadsheet example view.
 */
Ext.define('KitchenSink.view.grid.advanced.FlexibleSelectionController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.flexible-selection',

    getSelectable: function() {
        return this.lookup('selectionGrid').getSelectable();
    },

    onSelectionChange: function(grid, records, selecting, selection) {
        var status = this.lookup('status'),
            message = '??',
            firstRowIndex,
            firstColumnIndex,
            lastRowIndex,
            lastColumnIndex;

        if (!selection) {
            message = 'No selection';
        }
        else if (selection.isCells) {
            firstRowIndex = selection.getFirstRowIndex();
            firstColumnIndex = selection.getFirstColumnIndex();
            lastRowIndex = selection.getLastRowIndex();
            lastColumnIndex = selection.getLastColumnIndex();

            message = 'Selected cells: ' + (lastColumnIndex - firstColumnIndex + 1) +
                       'x' + (lastRowIndex - firstRowIndex + 1) +
                       ' at (' + firstColumnIndex + ',' + firstRowIndex + ')';
        }
        else if (selection.isRows) {
            message = 'Selected rows: ' + selection.getCount();
        }
        else if (selection.isColumns) {
            message = 'Selected columns: ' + selection.getCount();
        }

        status.setHtml(message);
    },

    onSelectableChange: function(menuitem, checked) {
        var sel = this.getSelectable(),
            fn = menuitem.fn;

        if (fn === 'setChecked') {
            checked = checked ? 'only' : true;
        }

        sel[fn](checked);
    },

    onExtensibleChange: function(menuitem, checked) {
        var sel;

        if (checked) {
            sel = this.getSelectable();

            sel.setExtensible(menuitem.getValue());
        }
    }
});
