/**
 * This is an override, not a class. To use `Ext.Responsive` you simply require it:
 *
 *      Ext.application({
 *          requires: [
 *              'Ext.Responsive'
 *          ],
 *
 *          // ...
 *      });
 *
 * Once required, this override mixes in {@link Ext.mixin.Responsive} into `Ext.Widget`
 * so that it gains both {@link Ext.mixin.Responsive#cfg!responsiveConfig responsiveConfig}
 * and {@link Ext.mixin.Responsive#cfg!responsiveFormulas responsiveFormulas} configs.
 * @since 6.7.0
 */
Ext.define('Ext.Responsive', {
    override: 'Ext.Widget',

    mixins: [
        'Ext.mixin.Responsive'
    ]
});
