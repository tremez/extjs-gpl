/**
 * This is an override, not a class. To use `Ext.Stateful` you simply require it:
 *
 *      Ext.application({
 *          requires: [
 *              'Ext.Stateful'
 *          ],
 *
 *          // ...
 *      });
 *
 * Once required, this override mixes in {@link Ext.state.Stateful} into `Ext.Widget` so
 * that it and all derived classes gain the {@link Ext.state.Stateful#cfg!stateful stateful}
 * config.
 * @since 6.7.0
 */
Ext.define('Ext.Stateful', {
    override: 'Ext.Widget',

    mixins: [
        'Ext.state.Stateful'
    ],

    requires: [
        'Ext.state.Provider'
    ]
});
