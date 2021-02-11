Ext.define('Ext.locale.fi.data.validator.CIDRv4', {
    override: 'Ext.data.validator.CIDRv4',

    config: {
        message: 'Ei ole kelvollinen CIDR-lohko'
    }
});
