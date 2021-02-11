Ext.define('Admin.view.forms.Finish', {
    extend: 'Ext.Panel',
    xtype: 'finishform',

    bodyPadding: '0 20 10 20',
    cls: 'wizard-finish',
    iconCls: 'x-fa fa-heart',
    title: 'Finish',

    html:
        '<div class="finish-form-title">Thank You</div>' +
        '<div class="finish-form-text">Lorem ipsum dolor sit amet, consectetuer adipiscing ' +
        'elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam ' +
        'erat volutpat.</div>' +
        '<div style="clear:both"></div>'
});
