Ext.define('Admin.override.container.Container', {
   override: 'Ext.container.Container',

   getDefaultFocus: function () {
       // defaultFocus on mobile devices causes the virtual keyboard to
       // immediately display without action so only focus for desktops
       if (Ext.os.deviceType === 'Desktop') {
           return this.callParent();
       }
   }
});
