/**
 * Base class for email controllers for phone and tablet.
 */
Ext.define('Admin.view.email.EmailController', {
    extend: 'Ext.app.ViewController',

    destroy: function () {
        this.actions = Ext.destroy(this.actions);

        this.callParent();
    },

    emptyStringRenderer: function () {
        return '';
    },

    onChangeFilter: function (sender) {
        console.log('Show ' + sender.getItemId());
    },

    onComposeMessage: function () {
        this.doCompose();
    },

    onComposeTo: function (sender) {
        var rec = sender.getRecord();

        this.doCompose(rec.get('name'));
    },

    onSelectMessage: function (sender, record) {
        //
    },

    hideActions: function () {
        var actions = this.actions;

        if (actions) {
            actions.hide();
        }
    },

    showActions: function () {
        var actions = this.actions;

        if (!actions) {
            actions = this.actions = Ext.create({
                xtype: 'emailactions',
                defaults: {
                    scope: this
                },
                side: 'right',
                hidden: true,
                hideOnMaskTap: true,
                width: 250
            });
        }

        actions.setDisplayed(true);
    }
});
