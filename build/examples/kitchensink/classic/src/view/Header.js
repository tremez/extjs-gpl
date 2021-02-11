Ext.define('KitchenSink.view.Header', {
    extend: 'Ext.Container',
    xtype: 'appHeader',
    id: 'app-header',
    title: 'Ext JS Kitchen Sink',
    height: 52,
    layout: {
        type: 'hbox',
        align: 'middle'
    },

    initComponent: function() {
        document.title = this.title;

        this.items = [{
            xtype: 'component',
            id: 'app-header-logo',
            cls: [ 'ext', 'ext-sencha' ]
        }, {
            xtype: 'component',
            id: 'app-header-title',
            html: this.title,
            flex: 1
        }];

        if (Ext.theme.name === 'Material') {
            this.items.push({
                xtype: 'button',
                iconCls: 'button-material-pallete',
                cls: 'classic-material-theme-menu-button',
                hidden: !Ext.supports.CSSVariables || Ext.isEdge,
                menu: {
                    plain: true,
                    items: [{
                        xtype: 'checkbox',
                        labelAlign: 'left',
                        cls: 'dark-mode-cb',
                        fieldLabel: 'Dark Mode',
                        reference: 'darkMode',
                        listeners: {
                            change: 'changeDarkMode'
                        }
                    }, {
                        xtype: 'menuseparator'
                    }, {
                        text: 'America\'s Captain',
                        baseColor: 'red',
                        accentColor: 'blue'
                    }, {
                        text: 'Royal Appeal',
                        baseColor: 'deep-purple',
                        accentColor: 'indigo'
                    }, {
                        text: 'Creamsicle',
                        baseColor: 'deep-orange',
                        accentColor: 'grey'
                    }, {
                        text: 'Mocha Pop',
                        baseColor: 'brown',
                        accentColor: 'blue-grey'
                    }, {
                        text: 'Dry Shores',
                        baseColor: 'blue-grey',
                        accentColor: 'grey'
                    }, {
                        text: 'Bubble Gum',
                        baseColor: 'pink',
                        accentColor: 'light-blue'
                    }, {
                        text: '120° Compliments',
                        baseColor: 'green',
                        accentColor: 'deep-purple'
                    }, {
                        text: 'Roboto House',
                        baseColor: 'grey',
                        accentColor: 'blue-grey'
                    }, {
                        text: 'Daylight & Tungsten',
                        baseColor: 'light-blue',
                        accentColor: 'grey'
                    }],
                    listeners: {
                        click: 'colorchange'
                    }
                }
            });
        }

        if (!Ext.getCmp('options-toolbar')) {
            this.items.push({
                xtype: 'profileSwitcher'
            });
        }

        this.callParent();
    }
});
