Ext.define('Admin.view.profile.UserProfile', {
    extend: 'Admin.view.profile.UserProfileBase',
    xtype: 'profile',

    cls: 'userProfile-container dashboard',
    scrollable: 'y',

    defaults: {
        shadow: true,
        userCls: 'big-50 small-100 dashboard-item'
    },

    items: [{
        xtype: 'profileshare',
        userCls: 'big-100 small-100 dashboard-item'
    }, {
        xtype: 'profilesocial'
    }, {
        xtype: 'profiledescription'
    }, {
        xtype: 'profilenotifications'
    }, {
        xtype: 'profiletimeline'
    }]
});
