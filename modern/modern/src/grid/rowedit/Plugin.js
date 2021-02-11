/**
 * The `Ext.grid.rowedit.Plugin` provides inline row editing for a `grid` or `lockedgrid`.
 * When editing begins, a small floating dialog will be shown for the appropriate row. Each
 * editable column will show a field for editing. There are configurable buttons to save
 * or cancel the edit.
 *
 * The {@link Ext.grid.column.Column#editor editors} specified for each column are used to
 * edit the record. The editor can be a field instance or a field configuration. See also
 * the {@link Ext.grid.column.Column#cfg!editable editable} config.
 *
 * The cell content will be displayed for non-editable columns.
 *
 * An appropriate field type should be chosen to match the data structure that it will be
 * editing. For example, to edit a date, a {@link Ext.field.Date datefield} would be the
 * appropriate editor. The `dataIndex` of the column and the corresponding `Ext.data.Model`
 * definition for the grid's store are consulted for the appropriate default editor type,
 * therefore in most cases, only `editable: true` is required for a column.
 *
 * @since 7.0
 */
Ext.define('Ext.grid.rowedit.Plugin', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.rowedit',

    requires: [
        'Ext.grid.rowedit.Editor'
    ],

    /**
     * @member Ext.grid.Grid
     * @event beforeedit
     * Fires before row editing is triggered. Return `false` from event handler to prevent
     * the editing.
     *
     * This event is only fired if the {@link Ext.grid.rowedit.Plugin rowedit} plugin is
     * configured on the grid.
     *
     * @param {Ext.grid.Grid} sender
     * @param {Ext.grid.Location} location The editing location.
     * @param {Ext.grid.rowedit.RowEditor} location.editor The editor component.
     */

    /**
     * @member Ext.grid.Grid
     * @event edit
     * Fires after editing.
     *
     * This event is only fired if the {@link Ext.grid.rowedit.Plugin rowedit} plugin is
     * configured on the grid.
     *
     * Usage example:
     *
     *      {
     *          xtype: 'grid',
     *          plugins: 'rowedit',
     *
     *          listeners: {
     *              edit: function(grid, location) {
     *                  // commit the changes right after editing finished
     *                  location.record.commit();
     *              }
     *          }
     *      }
     *
     * @param {Ext.grid.Grid} sender
     * @param {Ext.grid.Location} location The editing location.
     * @param {Ext.grid.rowedit.RowEditor} location.editor The editor component.
     */

    /**
     * @member Ext.grid.Grid
     * @event validateedit
     * Fires after editing, but before the value is set in the record. Return `false`
     * from the event handler to prevent the change.
     *
     * This event is only fired if the {@link Ext.grid.rowedit.Plugin rowedit} plugin is
     * configured on the grid.
     *
     *      {
     *          xtype: 'grid',
     *          plugins: 'rowedit',
     *
     *          listeners: {
     *              edit: function(grid, location) {
     *                  var changes = location.editor.getChanges();
     *
     *                  // validate the fields affected in changes...
     *              }
     *          }
     *      }
     *
     * @param {Ext.grid.Grid} sender
     * @param {Ext.grid.Location} location The editing location.
     * @param {Ext.grid.rowedit.RowEditor} location.editor The editor component.
     */

    /**
     * @member Ext.grid.Grid
     * @event canceledit
     * Fires when the user started editing but then cancelled the edit.
     *
     * This event is only fired if the {@link Ext.grid.rowedit.Plugin rowedit} plugin is
     * configured on the grid.
     *
     * @param {Ext.grid.Grid} sender
     * @param {Ext.grid.Location} location The editing location.
     * @param {Ext.grid.rowedit.RowEditor} location.editor The editor component.
     */

    config: {
        /**
         * @cfg {String} dirtyText
         * The message to display when dirty data prevents closing the row editor.
         * @locale
         */
        dirtyText: 'You need to commit or cancel your changes',

        /**
         * @cfg {Object/Ext.grid.plugin.RowEditor} editor
         * The config object for the row editor component.
         */
        editor: {
            lazy: true,

            $value: {
                xtype: 'roweditor'
            }
        },

        /**
         * @cfg {String} invalidToastMessage
         * A message displayed using `Ext.toast` if the user attempts to save invalid
         * data.
         *
         * Set to `null` to disable this message.
         */
        invalidToastMessage: 'Cannot save invalid data',

        /**
         * @cfg {String} triggerEvent
         * The pointer event to trigger editing.
         */
        triggerEvent: 'doubletap',

        //-------------------------------------------------------------------------
        // Internals

        /**
         * @cfg {Ext.grid.Grid/Ext.grid.locked.Grid} grid
         * @private
         */
        grid: null
    },

    cachedConfig: {
        /**
         * @cfg {Boolean/Object/"discard"} autoConfirm
         * By default, this config is set to `'discard'` which will automatically cancel
         * pending edits when the row editor {@link #cfg!repositionEvent repositions} to a
         * different row. If the record was newly added, it will be removed as the editor
         * moves to the new row.
         *
         * Set this config to `true` to automatically update the current record before
         * editing a different record.
         *
         * Set to `false` to force the user to select Discard or Update in order to leave
         * a new or modified row.
         *
         * Since newly added rows are by definition modified as soon as the row editor
         * appears, there are additional possibilities that can be controlled by using
         * an object.
         *
         *      {
         *          xtype: 'grid',
         *          plugins: {
         *              rowedit: {
         *                  autoConfirm: {
         *                      // Discard new records w/no data entered:
         *                      new: 'discard',
         *
         *                      // Require Save/Cancel for new records w/data
         *                      // entered:
         *                      populated: false,
         *
         *                      // Auto confirm updates to existing records.
         *                      updated: true
         *                  }
         *              }
         *          }
         *      }
         *
         * @cfg {Boolean/"discard"} autoConfirm.new This key determines what is done for
         * new records that have had no data entered into them.
         *
         * @cfg {Boolean/"discard"} autoConfirm.populated This key determines what is done
         * for new records that have data entered into them. If this key is not defined,
         * new records will use the value of the `new` property.
         *
         * @cfg {Boolean/"discard"} autoConfirm.updated This key determines what is done
         * with existing records that have been edited.
         */
        autoConfirm: 'discard',

        /**
         * @cfg {Object/Ext.Button[]} buttons
         * The buttons to be displayed below the row editor as a keyed object (or array)
         * of button configuration objects.
         *
         *      Ext.create({
         *          xtype: 'grid',
         *          ...
         *
         *          plugins: {
         *              rowedit: {
         *                  buttons: {
         *                      ok: { text: 'OK', handler: 'onOK' }
         *                  }
         *              }
         *          }
         *      });
         *
         * The {@link #minButtonWidth} is used as the default
         * {@link Ext.Button#minWidth minWidth} for the buttons in the buttons toolbar.
         */
        buttons: {
            // Standard buttons:
            ok: {
                iconCls: 'fi-check',
                text: null,
                handler: 'up.saveAndClose',
                tooltip: 'Save changes and close editor'
            },
            cancel: {
                iconCls: 'fi-times',
                text: null,
                handler: 'up.cancel',
                tooltip: 'Close editor, discarding any changes'
            },

            // Custom buttons:
            reset: {
                iconCls: 'fi-refresh',
                text: null,
                handler: 'up.resetChanges',
                margin: '0 0 0 8',
                tooltip: 'Reset editor to initially displayed values',
                weight: 200
            },
            revert: {
                iconCls: 'fi-undo',
                text: null,
                handler: 'up.revertChanges',
                margin: '0 0 0 8',
                tooltip: 'Reset editor to record\'s original values',
                weight: 210
            }
        },

        // TODO add "delete" to match features of Editable plugin:
        // delete: {
        //     iconCls: 'fi-trash',
        //     text: null,
        //     handler: 'up.onDropRecord',
        //     margin: '0 0 0 8',
        //     tooltip: 'Delete this record',
        //     weight: 300
        // }

        confirmation: {
            reset: 'Are you sure you want to discard the current edits?',
            revert: 'Are you sure you want to revert all edits to this record?'
        },

        //-----------------------------
        // Private

        adapters: {
            default: {
                xtype: 'roweditorcell'
            },

            checkcell: {
                xtype: 'checkbox',
                isRowEditorCell: true,
                bodyAlign: 'center',
                label: null,
                $hasValue: true
            },

            rownumberercell: {
                driver: 'rownumber'
            },

            expandercell: null,
            widgetcell: null
        },

        drivers: {
            default: {
                prop: 'value',
                commit: function(item) {
                    item.resetOriginalValue();
                },
                convert: Ext.identityFn,
                get: function(item) {
                    return item.getValue();
                },
                reset: function(item) {
                    item.reset();
                },
                set: function(item, value) {
                    if (item.forceSetValue) {
                        item.forceSetValue(value);
                    }
                    else {
                        item.setValue(value);
                    }
                }
            },

            checkbox: {
                prop: 'checked',
                convert: function(value) {
                    return !!value;
                },
                get: function(item) {
                    return item.getChecked();
                },
                set: function(item, value) {
                    item.setChecked(value);
                }
            },

            rownumber: {
                read: function(record, col, editBar) {
                    return col.printValue(editBar.parent.recordIndex + 1);
                }
            },

            roweditorcell: {
                prop: 'html',
                commit: Ext.emptyFn,
                convert: function(value, col) {
                    return Ext.htmlEncode(col.printValue(value));
                },
                get: function(item) {
                    return Ext.htmlDecode(item.getHtml());
                },
                reset: Ext.emptyFn,
                set: function(item, value) {
                    item.setHtml(this.convert(value, item.getColumn()));
                }
            }
        }
    },

    /**
     * @property {Boolean} editing
     * This property is `true` when the row editor is currently editing a row.
     * @readonly
     */
    editing: false,

    // /*
    //  * @cfg {String} formAriaLabel
    //  * The ARIA label template for screen readers to announce when row editing starts.
    //  * This label can be a {@link Ext.String#format} template, with the only parameter
    //  * being the row number. Note that row numbers start at base {@link #formAriaLabelRowBase}.
    //  * @locale
    //  */
    // formAriaLabel: 'Editing row {0}',
    //
    // /*
    //  * @cfg {Number} [formAriaLabelRowBase=2]
    //  * Screen readers will announce grid column header as first row of the ARIA table,
    //  * so the first actual data row is #2 for screen reader users. If your grid has
    //  * more than one column header row, you might want to increase this number.
    //  * If the column header is not visible, the base will be decreased automatically.
    //  */
    // formAriaLabelRowBase: 2,

    constructor: function(config) {
        this.callParent([ config || {} ]);  // ensure we call initConfig()
    },

    init: function(grid) {
        this.callParent([grid]);

        this.setGrid(grid);
    },

    doDestroy: function() {
        this.editing = false;

        this.setEditor(null);
        this.setGrid(null);

        this.callParent();
    },

    cancelEdit: function() {
        if (this.editing) {
            this.getEditor().cancel();
        }
    },

    completeEdit: function() {
        if (this.editing) {
            this.getEditor().saveAndClose();
        }
    },

    /**
     * Starts editing the specified record, using the specified Column definition to define
     * which field is being edited.
     * @param {Ext.data.Model/Ext.grid.Location} record The Store data record which backs
     * the row to be edited.
     * @param {Ext.grid.column.Column/Number} [column] The column to be focused, or index
     * of the column. If not specified, it will default to the first visible column.
     * @return {Boolean} `true` if editing was started, `false` otherwise.
     */
    startEdit: function(record, column) {
        var me = this,
            editor = me.getEditor(),
            location = record;

        if (!location.isLocation) {
            // TODO locked grid?
            location = me.grid.createLocation({
                record: record,
                column: column
            });
        }

        me.grid.ensureVisible(location.record);

        if (location.record && editor.beforeEdit(location) !== false) {
            editor.startEdit(location);

            return true;
        }

        return false;
    },

    //------------------------------------------------------------
    // Configs

    // autoConfirm

    updateAutoConfirm: function(value) {
        var full;

        if (!Ext.isObject(value)) {
            full = {
                new: value,
                populated: value,
                updated: value
            };
        }
        else {
            full = Ext.apply({}, value);

            if (!('updated' in full)) {
                full.updated = 'discard';
            }

            if (!('new' in full)) {
                full.new = full.updated;
            }

            if (!('populated' in full)) {
                full.populated = full.new;
            }
        }

        //<debug>
        Ext.each(['new', 'populated', 'updated'], function(key) {
            var v = full[key];

            if (typeof v !== 'boolean' && v !== 'discard') {
                Ext.raise('Invalid autoConfirm' + (Ext.isObject(value) ? '.' + key : '') +
                    ' value "' + v + '"');
            }
        });
        //</debug>

        this.$autoConfirm = full;
    },

    // editor

    applyEditor: function(config, existing) {
        return Ext.updateWidget(existing, config, this, 'createEditor');
    },

    createEditor: function(config) {
        var grid = this.getGrid();

        return Ext.apply({
            $initParent: grid,
            owner: grid,
            parent: grid,
            plugin: this,
            hidden: true,
            buttons: this.getButtons(),
            left: 0,
            right: 0,
            top: 0
        }, config);
    },

    updateEditor: function(editor) {
        this.editor = editor;

        if (editor) {
            this.getGrid().add(editor);
        }
    },

    // grid

    updateGrid: function(grid, oldGrid) {
        var me = this;

        me.grid = grid;

        if (oldGrid && !oldGrid.destroying) {
            oldGrid.unregisterActionable(this);
        }

        if (grid) {
            // This plugin has an interest in processing a request for actionable mode.
            // It does not actually enter actionable mode, it just calls startEdit
            grid.registerActionable(this);
        }
    },

    //------------------------------------------------------------
    // Internals

    activateCell: function(location) {
        this.startEdit(location);
    },

    pickGrid: function() {
        var grid = this.grid;

        if (grid.isLockedGrid) {
            grid = grid.regionMap.center.getGrid();
        }

        return grid;
    }
});
