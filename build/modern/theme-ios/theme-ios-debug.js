Ext.define('Ext.theme.ios.Panel', {
    override: 'Ext.Panel',
    config: {
        buttonToolbar: {
            defaultButtonUI: null
        }
    }
});

Ext.define('Ext.theme.neptune.Titlebar', {
    override: 'Ext.TitleBar',
    config: {
        defaultButtonUI: 'alt'
    }
});

Ext.define('Ext.theme.ios.TitleBar', {
    override: 'Ext.TitleBar',
    config: {
        defaultButtonUI: null
    }
});

Ext.define('Ext.theme.triton.dataview.ListCollapser', {
    override: 'Ext.dataview.ListCollapser',
    config: {
        tool: {
            weight: -100,
            zone: 'start'
        }
    }
});

Ext.define('Ext.theme.ios.dataview.IndexBar', {
    override: 'Ext.dataview.IndexBar',
    config: {
        indicator: false
    }
});

Ext.define('Ext.theme.ios.dataview.NestedList', {
    override: 'Ext.dataview.NestedList',
    config: {
        backButton: {
            ui: 'back'
        }
    }
});

Ext.define('Ext.theme.ios.dataview.pullrefresh.Bar', {
    override: 'Ext.dataview.pullrefresh.Bar',
    config: {
        mode: 'spinner'
    }
});

Ext.define('Ext.theme.ios.field.Checkbox', {
    override: 'Ext.field.Checkbox',
    config: {
        bodyAlign: 'end'
    }
});

Ext.define('Ext.theme.neptune.panel.Date', {
    override: 'Ext.panel.Date',
    border: true
});

Ext.define('Ext.theme.ios.form.Borders', {
    override: 'Ext.form.Borders',
    config: {
        fieldSeparators: true,
        inputBorders: false
    }
});

Ext.define('Ext.theme.ios.grid.Grid', {
    override: 'Ext.grid.Grid',
    config: {
        striped: false
    }
});

Ext.define('Ext.theme.ios.panel.Header', {
    override: 'Ext.panel.Header',
    config: {
        titleAlign: 'center'
    }
});

Ext.define('Ext.theme.ios.tab.Tab', {
    override: 'Ext.tab.Tab',
    config: {
        flex: 1
    }
});

Ext.namespace('Ext.theme.is').Neptune = true;
Ext.theme.name = 'Neptune';
Ext.theme.getDocCls = function() {
    return Ext.platformTags.desktop ? '' : 'x-big';
};

Ext.namespace('Ext.theme.is').Triton = true;
Ext.theme.name = 'Triton';
Ext.theme.getDocCls = function() {
    return Ext.platformTags.phone ? 'x-big' : '';
};

Ext.namespace('Ext.theme.is').iOS = true;
Ext.theme.name = 'iOS';
Ext.theme.getDocCls = function() {
    return Ext.platformTags.desktop ? '' : 'x-big';
};

