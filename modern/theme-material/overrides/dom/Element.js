/**
 * @class Ext.dom.Element
 * @override Ext.dom.Element
 */

Ext.define('Ext.overrides.dom.Element', {
    override: 'Ext.dom.Element',

    /**
     * @property  {Number/Boolean} rippleShowTimeout
     * The amount of time take by ripple to completely shown.
     * Settings this to `true` defaults to 300ms.
     */
    rippleShowTimeout: 300
});
