Ext.define('Admin.view.dashboard.TodosController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.todo',

    onTaskKeyUp: function (field, e) {
        if (e.getKey() === e.ENTER) {
            this.addTodo();
        }
    },

    addTodo: function () {
        var field = this.lookup('taskField'),
            value = field.getValue(),
            grid, record, store;

        if (value) {
            grid = this.lookup('taskGrid');
            store = this.getStore('todos');

            record = store.add({
                task: value
            });

            grid.ensureVisible(record[0]);

            field.setValue('');
            field.focus();
        }
    },

    removeTodo: function (grid, context) {
        Ext.Msg.confirm(
            'Remove TODO',
            'Are you sure you want to remove that TODO?',
            this.doRemoveTodo.bind(this, context.record)
        );
    },

    doRemoveTodo: function (record, btn) {
        var store;

        if (btn === 'yes') {
            store = this.getStore('todos');

            store.remove(record);
        }
    }
});
