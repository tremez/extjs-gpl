Ext.define('Ext.locale.fi.data.validator.CIDRv6', {
    override: 'Ext.data.validator.CIDRv6',

    config: {
        message: 'Ei ole kelvollinen CIDR-lohko'
    }
});
