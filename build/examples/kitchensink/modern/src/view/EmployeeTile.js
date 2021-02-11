Ext.define('KitchenSink.view.EmployeeTile', {
    extend: 'Ext.Component',

    xtype: 'employeetile',

    config: {
        name: null,

        avatar: null,

        role: null
    },

    classCls: Ext.baseCSSPrefix + 'employee-tile',

    template: [{
        tag: 'img',
        reference: 'avatarElement',
        src: 'modern/resources/images/employee.png',
        cls: Ext.baseCSSPrefix + 'employee-tile-avatar'
    }, {
        children: [{
            reference: 'nameElement',
            cls: Ext.baseCSSPrefix + 'employee-tile-name'
        }, {
            reference: 'roleElement',
            cls: Ext.baseCSSPrefix + 'employee-tile-role'
        }]
    }],

    updateName: function(name) {
        this.nameElement.update(name);
    },

    updateRole: function(role) {
        this.roleElement.update(role);
    },

    updateAvatar: function(url) {
        this.avatarElement.update(url);
    }
});
