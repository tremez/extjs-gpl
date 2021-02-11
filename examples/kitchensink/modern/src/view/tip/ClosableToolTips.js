Ext.define('KitchenSink.view.tip.ClosableToolTips', {
    extend: 'Ext.Container',
    xtype: 'closable-tooltips',

    //<example>
    $preventContentSize: true,
    cls: 'demo-solid-background',
    //</example>

    padding: 20,

    layout: {
        type: 'hbox',
        pack: 'center'
    },

    defaultType: 'button',
    defaults: {
        minWidth: 150
    },

    autoSize: true,

    items: [{
        text: 'anchor: "right", rich content',
        margin: '0 15 0 0',
        tooltip: {
            html: '<ul style="margin-bottom: 15px;">' +
                      '<li>5 bedrooms</li>' +
                      '<li>Close to transport</li>' +
                      '<li>Large backyard</li>' +
                  '</ul>' +
                  '<img style="width: 300px; height: 225px;" src="resources/house.jpg" />',
            align: 'tl-tr',
            anchorToTarget: true,
            anchor: true,
            autoHide: false,
            closable: true,
            showOnTap: true
        }
    }, {
        text: 'autoHide: false',
        tooltip: {
            title: 'A title',
            autoHide: false,
            closable: true,
            html: 'Click the X to close this',
            showOnTap: true
        }
    }]
});
