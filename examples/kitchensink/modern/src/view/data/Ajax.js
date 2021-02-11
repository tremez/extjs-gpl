/**
 * Demonstrates loading data over AJAX.
 */
Ext.define('KitchenSink.view.data.Ajax', {
    extend: 'Ext.Panel',
    xtype: 'ajax',
    controller: 'ajax',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/data/AjaxController.js'
    }],
    //</example>

    scrollable: true,

    tbar: [{
        text: 'Load using Ajax',
        handler: 'onLoad'
    }, {
        text: 'Format JSON',
        reference: 'formatBtn',
        enableToggle: true,
        handler: 'onFormat'
    }],

    items: [{
        xtype: 'component',
        reference: 'results'
    }]
});
