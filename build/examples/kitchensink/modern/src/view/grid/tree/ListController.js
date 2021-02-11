Ext.define('KitchenSink.view.grid.TreeListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.tree-list',

    onChange: function(segmented, value) {
        var treelist = this.lookup('treelist'),
            navBtn = this.lookup('navBtn'),
            hasNav = value.indexOf('nav') !== -1,
            hasMicro = value.indexOf('micro') !== -1;

        if (value.length === 1 && !hasNav) {
            segmented.setValue(['nav', 'micro']);
        }
        else {
            treelist.setExpanderFirst(!hasNav);
            treelist.setMicro(hasMicro);
            treelist.setUi(hasNav ? 'nav' : null);

            treelist.setWidth(hasMicro ? this.measureWidth(treelist) : null);

            navBtn.setDisabled(hasMicro);
        }
    },

    measureWidth: function(treelist) {
        return treelist.toolsElement.getWidth();
    }
});
