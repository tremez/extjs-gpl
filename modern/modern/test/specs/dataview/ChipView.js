topSuite("Ext.dataview.ChipView", [
    "Ext.Panel"
], function() {
    var Contact = Ext.define(null, {
            extend: 'Ext.data.Model',
            fields: [{
                name: 'emailAddress'
            }, {
                name: 'picture'
            }, {
                name: 'role',
                type: 'int'
            }, {
                name: 'closable',
                calculate: function(data) {
                    return data.role > 2 ? false : true;
                }
            }, {
                name: 'iconCls',
                calculate: function(data) {
                    return data.picture ? (data.role > 2 ? 'x-manager-icon' : 'x-employee-icon') : '';
                }
            }]
        }),
        store, panel, view;

    function makeChipView(storeCfg, viewCfg) {
        store = new Ext.data.Store(Ext.apply({
            model: Contact,
            data: [{
                emailAddress: 'frederick.bloggs@sentcha.com',
                picture: 'https://www.sencha.com/assets/images/sencha-avatar-64x64.png',
                role: 1
            }, {
                emailAddress: 'joe.poe@sentcha.com',
                picture: 'https://www.sencha.com/assets/images/sencha-avatar-64x64.png',
                role: 2
            }, {
                emailAddress: 'mike.jones@sentcha.com',
                picture: 'https://www.sencha.com/assets/images/sencha-avatar-64x64.png',
                role: 3
            }]
        }, storeCfg));

        panel = Ext.create({
            xtype: 'panel',
            title: 'Chip DataView',
            width: 400,
            height: 200,
            renderTo: document.body,
            bodyPadding: 5,
            border: true,
            items: Ext.apply({
                xtype: 'chipview',
                store: store,
                displayField: 'emailAddress',
                closableField: 'closable',
                iconField: 'picture',
                iconClsField: 'iconCls'
            }, viewCfg)
        });
        view = panel.child('chipview');
    }

    afterEach(function() {
        panel = view = Ext.destroy(panel);
    });

    describe('rendering', function() {
        it('should assign classes based on record data and field mapping', function() {
            makeChipView();

            // Should be visible icons
            expect(Ext.fly(view.itemFromRecord(0)).down('.x-icon-el').isVisible()).toBe(true);
            expect(Ext.fly(view.itemFromRecord(1)).down('.x-icon-el').isVisible()).toBe(true);
            expect(Ext.fly(view.itemFromRecord(1)).down('.x-icon-el').isVisible()).toBe(true);

            // Roles 1 and 2 are non-managerial roles
            expect(Ext.fly(view.itemFromRecord(0)).down('.x-icon-el').hasCls('x-employee-icon')).toBe(true);
            expect(Ext.fly(view.itemFromRecord(0)).down('.x-icon-el').hasCls('x-manager-icon')).toBe(false);
            expect(Ext.fly(view.itemFromRecord(1)).down('.x-icon-el').hasCls('x-employee-icon')).toBe(true);
            expect(Ext.fly(view.itemFromRecord(1)).down('.x-icon-el').hasCls('x-manager-icon')).toBe(false);

            // Mike Jones is a manager.
            expect(Ext.fly(view.itemFromRecord(2)).down('.x-icon-el').hasCls('x-employee-icon')).toBe(false);
            expect(Ext.fly(view.itemFromRecord(2)).down('.x-icon-el').hasCls('x-manager-icon')).toBe(true);

            // Non-managerial contacts are closable
            expect(Ext.fly(view.itemFromRecord(0)).down('.x-close-el').isVisible()).toBe(true);
            expect(Ext.fly(view.itemFromRecord(1)).down('.x-close-el').isVisible()).toBe(true);

            // Managers are not closable.
            expect(Ext.fly(view.itemFromRecord(2)).down('.x-close-el').isVisible()).toBe(false);
        });

        it("should have the icon el if there's icon field", function() {
            makeChipView({
                data: [{
                    emailAddress: 'frederick.bloggs@sentcha.com',
                    picture: 'https://www.sencha.com/assets/images/sencha-avatar-64x64.png',
                    role: 1
                }, {
                    emailAddress: 'joe.poe@sentcha.com',
                    picture: 'https://www.sencha.com/assets/images/sencha-avatar-64x64.png',
                    role: 2
                }, {
                    emailAddress: 'mike.jones@sentcha.com',
                    picture: 'https://www.sencha.com/assets/images/sencha-avatar-64x64.png',
                    role: 3
                }]
            });

            // Should be no visible icons
            expect(Ext.fly(view.itemFromRecord(0)).down('.x-icon-el').isVisible()).toBe(true);
            expect(Ext.fly(view.itemFromRecord(1)).down('.x-icon-el').isVisible()).toBe(true);
            expect(Ext.fly(view.itemFromRecord(2)).down('.x-icon-el').isVisible()).toBe(true);
        });

        it("should hide the icon el if there's no icon", function() {
            makeChipView({
                data: [{
                    emailAddress: 'frederick.bloggs@sentcha.com',
                    role: 1
                }, {
                    emailAddress: 'joe.poe@sentcha.com',
                    role: 2
                }, {
                    emailAddress: 'mike.jones@sentcha.com',
                    role: 3
                }]
            });

            // Should be no visible icons
            expect(Ext.fly(view.itemFromRecord(0)).down('.x-icon-el').isVisible()).toBe(false);
            expect(Ext.fly(view.itemFromRecord(1)).down('.x-icon-el').isVisible()).toBe(false);
            expect(Ext.fly(view.itemFromRecord(2)).down('.x-icon-el').isVisible()).toBe(false);
        });

        it("should hide and show the icon el as per individual record", function() {
            makeChipView({
                data: [{
                    emailAddress: 'frederick.bloggs@sentcha.com',
                    role: 1
                }, {
                    emailAddress: 'joe.poe@sentcha.com',
                    picture: 'https://www.sencha.com/assets/images/sencha-avatar-64x64.png',
                    role: 2
                }, {
                    emailAddress: 'mike.jones@sentcha.com',
                    role: 3
                }]
            });

            // Should be no visible icons
            expect(Ext.fly(view.itemFromRecord(0)).down('.x-icon-el').isVisible()).toBe(false);
            expect(Ext.fly(view.itemFromRecord(1)).down('.x-icon-el').isVisible()).toBe(true);
            expect(Ext.fly(view.itemFromRecord(2)).down('.x-icon-el').isVisible()).toBe(false);
        });
    });

    describe('closeHandler', function() {
        it('should invoke the closeHandler on close icon tap', function() {
            var clickedChipView,
                clickedLocation,
                closeIcon;

            makeChipView(null, {
                closeHandler: function(chipview, location) {
                    clickedChipView = chipview;
                    clickedLocation = location;
                }
            });
            closeIcon = Ext.fly(view.itemFromRecord(1)).down('.x-close-el');

            // Click the close icon on chip 1
            Ext.testHelper.tap(closeIcon);

            expect(clickedChipView).toBe(view);
            expect(clickedLocation.equals(view.getNavigationModel().createLocation(closeIcon))).toBe(true);
        });
    });

    describe('selection', function() {
        it('should add selected Cls on chip tap', function() {
            makeChipView({
                data: [{
                    emailAddress: 'frederick.bloggs@sentcha.com',
                    picture: 'https://www.sencha.com/assets/images/sencha-avatar-64x64.png',
                    role: 1
                }, {
                    emailAddress: 'joe.poe@sentcha.com',
                    role: 2
                }, {
                    emailAddress: 'mike.jones@sentcha.com',
                    role: 3
                }]
            });

            var record1 = view.itemFromRecord(1),
                record2 = view.itemFromRecord(2);

            Ext.testHelper.tap(record1);

            expect(record1).toHaveCls('x-selected');
            expect(record2).not.toHaveCls('x-selected');
        });
    });
});
