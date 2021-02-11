/**
 * This class is a simple Back/Next style wizard extension of a tab panel.
 */
Ext.define('Admin.view.forms.Wizard', {
    extend: 'Ext.tab.Panel',
    xtype: 'wizard',

    isWizard: true,

    config: {
        appendButtons: true,

        controlBar: {
            xtype: 'toolbar',
            docked: 'bottom',
            border: false,
            items: [
                '->'
            ]
        },

        next: {
            xtype: 'button',
            ui: 'action',
            text: 'Next',
            margin: '0 8',
            handler: 'onNext'
        },

        back: {
            xtype: 'button',
            ui: 'action',
            text: 'Back',
            margin: '0 0 0 8',
            handler: 'onBack'
        }
    },

    cls: 'wizard',
    controller: 'wizard',

    applyBack: function (back, oldBack) {
        return Ext.updateWidget(oldBack, back);
    },

    applyControlBar: function (controlBar, oldControlBar) {
        return Ext.updateWidget(oldControlBar, controlBar);
    },

    applyNext: function (next, oldNext) {
        return Ext.updateWidget(oldNext, next);
    },

    updateActiveItem: function (newActiveItem, oldActiveItem) {
        this.callParent([newActiveItem, oldActiveItem]);

        this.getController().syncBackNext();
    },

    updateBack: function (back) {
        var idx = 0,
            controlBar;

        if (back) {
            controlBar = this.getControlBar();

            if (controlBar) {
                if (this.getAppendButtons()) {
                    idx = 1;
                }

                controlBar.insert(idx, back);
            }
        }
    },

    updateControlBar: function (controlBar) {
        if (controlBar) {
            this.add(controlBar);
        }
    },

    updateNext: function (next) {
        var idx = 1,
            controlBar;

        if (next) {
            controlBar = this.getControlBar();

            if (controlBar) {
                if (this.getAppendButtons()) {
                    idx = 2;
                }

                controlBar.insert(idx, next);
            }
        }
    }
});
