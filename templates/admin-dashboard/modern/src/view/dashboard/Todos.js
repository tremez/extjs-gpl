Ext.define('Admin.view.dashboard.Todos', {
    extend: 'Ext.Panel',
    xtype: 'todo',

    requires: [
        'Ext.grid.plugin.MultiSelection',
        'Ext.grid.Grid',
        'Ext.field.Text',
        'Ext.Button'
    ],

    cls: 'todo-list',
    controller: 'todo',
    bodyPadding: 15,
    layout: 'vbox',
    shadow: true,
    title: 'TODO List',

    items: [{
        xtype: 'grid',
        reference: 'taskGrid',
        flex: 1,
        userCls: 'dashboard-todo-list',
        hideHeaders: true,
        bind: '{todos}',
        plugins: {
            multiselection: {
                selectionColumn: {
                    hidden: false,
                    width: 40  // Change column width from the default of 60px
                }
            }
        },
        columns: [{
            text: 'Task',
            flex: 1,
            dataIndex: 'task',
            cell: {
                tools: {
                    close: {
                        handler: 'removeTodo',
                        tooltip: 'Delete TODO',
                        zone: 'end'
                    }
                }
            }
        }]
    }, {
        xtype: 'toolbar',
        padding: '10 0 0 0',
        items: [{
            xtype: 'textfield',
            reference: 'taskField',
            flex: 1,
            label: 'Add Task',
            placeholder: 'Add New Task',
            listeners: {
                keyup: 'onTaskKeyUp'
            }
        }, {
            ui: 'soft-green',
            handler: 'addTodo',
            iconCls: 'x-fa fa-plus',
            margin: '0 0 0 10'
        }]
    }]
});
