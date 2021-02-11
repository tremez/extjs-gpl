Ext.define('Admin.view.forms.WizardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.wizard',

    init: function () {
        this.syncBackNext();
    },

    passwordValidator: function (value) {
        var password = this.lookup('password'),
            passwordValue = password.getValue();

        if (passwordValue) {
            if (value !== passwordValue) {
                return 'Passwords do not match.';
            }
        }

        return true;
    },

    getItemIndex: function (item) {
        var view = this.getView(),
            items = view.getInnerItems();

        item = item || view.getActiveItem();

        return items.indexOf(item);
    },

    syncBackNext: function () {
        var view = this.getView(),
            next = view.getNext(),
            back = view.getBack(),
            index = this.getItemIndex(),
            tabBar = view.getTabBar(),
            items = tabBar.getItems(),
            i = items.length,
            tab;

        back.setDisabled(!index);
        next.setDisabled(index >= items.length - 1);

        // Disable all tabs beyond the current (progress must use Next button):
        //
        for (; i-- > 0; ) {
            tab = items.getAt(i);
            tab.setDisabled(i > index);
        }
    },

    onBack: function () {
        var view = this.getView(),
            index = this.getItemIndex();

        if (index > 0) {
            view.setActiveItem(index - 1);
        }
    },

    onNext: function () {
        var view = this.getView(),
            index = this.getItemIndex(),
            count = view.getTabBar().getItems().length,
            item;

        if (index < count - 1) {
            item = view.getInnerItems()[index];

            if (!item.validate || item.validate()) {
                view.setActiveItem(index + 1);
            }
        }
    }
});
