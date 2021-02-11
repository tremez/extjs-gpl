Ext.define('KitchenSink.view.tip.HtmlToolTips', {
    extend: 'Ext.Component',
    xtype: 'html-tooltips',

    //<example>
    $preventContentSize: true,
    cls: 'demo-solid-background',
    //</example>

    element: {
        children: [{
            cls: 'qtip-item color1',
            html: '<div data-qtip="This tip is inline">Inline Tip</div>'
        }, {
            cls: 'qtip-item color2',
            html: '<div data-qtip="This tip has a fixed width" data-qwidth="400">' +
                  'Fixed width inline tip</div>'
        }, {
            cls: 'qtip-item color3',
            html: '<div data-qtip="This tip has a title" data-qtitle="The title">' +
                  'Inline tip with title</div>'
        }, {
            cls: 'qtip-item color4',
            html: '<div data-qtip="Aligned top" data-qalign="bl-tl">Inline tip align top</div>'
        }],
        reference: 'element'
    }
});
