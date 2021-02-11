Ext.define('Ticket.view.user.GroupController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.user-group',

    onAddGroup: function() {
        var me = this;

        Ext.Msg.prompt('Add Group', 'Group name', function(action, value) {
            var session, viewModel, groups, group;

            if (action === 'ok') {
                session = me.getSession();
                viewModel = me.getViewModel();

                group = session.createRecord('Group', {
                    name: value
                });

                groups = viewModel.getData().currentOrg.groups();
                groups.add(group);
            }
        });
    }
});
