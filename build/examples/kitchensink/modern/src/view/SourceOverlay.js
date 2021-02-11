/**
 * This is used to display the source code for any given example. Each example has a 'Source' button
 * on its top toolbar that activates this
 */
Ext.define('KitchenSink.view.SourceOverlay', {
    extend: 'Ext.Panel',
    xtype: 'sourceoverlay',
    title: 'Details',

    requires: [
        'Ext.panel.Collapsible',
        'Ext.panel.Resizable'
    ],

    config: {
        tier: null
    },

    layout: 'fit',
    referenceHolder: true,

    platformConfig: {
        '!phone': {
            collapsible: 'right',
            resizable: {
                split: true,
                edges: 'west'
            },
            // collapsed: true,
            stateId: 'sourceOverlay',
            stateful: [
                'collapsed',
                'width'
            ]
        }
    },

    header: {
        items: [{
            xtype: 'component',
            align: 'right',
            hidden: true,
            cls: 'tier',
            reference: 'premiumComp',
            html: 'Premium',
            tooltip: {
                align: 'tr-br?',
                html: 'Uses features that require Ext JS Premium'
            }
        }, {
            xtype: 'component',
            align: 'right',
            hidden: true,
            cls: 'tier',
            reference: 'proComp',
            html: 'Pro',
            tooltip: {
                align: 'tr-br?',
                html: 'Uses features that require Ext JS Professional'
            }
        }].concat(Ext.os.is.Phone
            ? [{
                xtype: 'button',
                ui: 'action',
                iconCls: 'x-fa fa-times',
                align: 'right',
                action: 'closeSource'
            }]
            : [])
    },

    items: [{
        xtype: 'tabpanel',
        defaultType: 'sourceitem',
        reference: 'tabs',
        tabBar: {
            platformConfig: {
                desktop: {
                    layout: {
                        pack: 'left'
                    }
                }
            },
            layout: {
                overflow: 'scroller'
            }
        }
    }],

    setContent: function(content) {
        var tabs = this.lookup('tabs');

        tabs.removeAll();
        tabs.add(content);
        tabs.getTabBar().setHidden(content.length === 1);
    },

    updateTier: function(tier) {
        var premium = this.lookup('premiumComp'),
            pro = this.lookup('proComp');

        if (tier === 'premium') {
            premium.show();
        }
        else if (tier === 'pro') {
            pro.show();
        }

        if (tier !== 'premium') {
            premium.hide();
        }
        else if (tier !== 'pro') {
            pro.hide();
        }
    }
});
