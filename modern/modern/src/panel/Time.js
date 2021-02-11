/**
 * This component presents a time selection view with different interaction modes
 * depending on the device and configuration options. Default time view is analog
 * clock face.
 *
 * Time panel is mostly used as a picker by {@link Ext.field.Time} but can also be
 * created and used directly.
 *
 * @since 6.6.0
 *
 * Example usage:
 *
 *      @example
 *      Ext.create('Ext.form.Panel', {
 *           fullscreen: true,
 *           items: [
 *               {
 *                   xtype: 'timepanel',
 *                   shadow: true
 *               }
 *           ]
 *       });
 */
Ext.define('Ext.panel.Time', {
    extend: 'Ext.Panel',
    xtype: 'timepanel',

    mixins: [
        'Ext.mixin.ConfigProxy'
    ],

    config: {
        view: {
            xtype: 'analogtime'
        }
    },

    proxyConfig: {
        view: {
            configs: [
                /**
                 * @cfg {Date} [value]
                 * Time value for the panel. If not set, current time will be displayed.
                 */
                'value',

                /**
                 * @cfg {Boolean} [autoAdvance=true]
                 * If `true`, time panel will automatically advance to minutes after
                 * selecting an hour value. Setting this to `false` will disable this
                 * behavior, and switching from hours to minutes will have to be done
                 * manually via Time panel header.
                 */
                'autoAdvance',

                /**
                 * @cfg {Boolean} [vertical=true]
                 * When `true`, Time header will be at the top of the Time panel.
                 * When `false`, Time header will be at the left side of the Time panel.
                 * When `auto`, Time header will be set based on the orientation of the device.
                 */
                'vertical',

                /**
                 * @cfg {Boolean} [confirmable=false]
                 * When set to `true`, Time panel will have OK and Cancel buttons in
                 * a toolbar docked to the bottom of the Panel, and user will need to
                 * confirm selection by activating OK button.
                 * When set to `false`, Time panel will not have OK and Cancel buttons
                 * and selection will be confirmed automatically when minutes are
                 * selected.
                 */
                'confirmable',

                /**
                 * @cfg {Function} [handler]
                 * This function, if provided, will be called when Time selection
                 * is confirmed by activating OK button (if {@link #confirmable} is `true`),
                 * or selecting minutes.
                 */
                'confirmHandler',

                /**
                 * @cfg {Function} [declineHandler]
                 * This function, if provided, will be called when user has activated
                 * Cancel button (only if {@link #confirmable} is `true`).
                 */
                'declineHandler',

                /**
                 * @cfg {Object} [scope='this']
                 * The scope in which {@link #handler} function will be called.
                 */
                'scope',

                /**
                 * @cfg {String} buttonAlign
                 * @inheritdoc
                 */

                /**
                 * @cfg {Object} defaultButtons
                 * Configuration of the buttons to add to the Time panel if
                 * {@link #confirmable} is set to `true`.
                 *
                 * Default is to provide OK and Cancel buttons.
                 */
                'defaultButtons',

                /**
                 * @cfg {String} [mode=hour]
                 * @private
                 * Default mode for Time Panel. values can be 'hour' or 'minute'
                 */
                'mode',

                /**
                 * @cfg {Boolean} meridiem
                 * Defaults to true for 12 hour format for Time Panel.
                 */
                'meridiem',

                /**
                 * @cfg {Boolean} alignPMInside
                 * Default false.
                 */
                'alignPMInside',

                /**
                  * @cfg {string} hourDisplayFormat
                  * Accepted values are `G` or `H`
                  * Default G
                  * See {@link Ext.Date} for details. 
                  * @since 7.0
                  */
                'hourDisplayFormat'
            ],

            methods: ['getHours', 'getMinutes', 'updateField']
        }
    },

    autoSize: null,

    initialize: function() {
        var me = this;

        me.callParent();

        if (me.getFloated()) {
            me.el.dom.setAttribute('tabIndex', -1);
            me.el.on('mousedown', me.onMouseDown, me);
        }

        me.relayEvents(me.getView(), ['collapsePanel', 'select']);
    },

    applyView: function(config, view) {
        return Ext.updateWidget(view, config, this, 'createView');
    },

    createView: function(config) {
        return this.mergeProxiedConfigs('view', config);
    },

    updateView: function(view, oldView) {
        if (oldView) {
            Ext.destroy(oldView);
        }

        this.add(view);
    },

    updateButtonAlign: function(align) {
        this.getView().setButtonAlign(align);
    },

    onMouseDown: function(e) {
        e.preventDefault();
    }
});
