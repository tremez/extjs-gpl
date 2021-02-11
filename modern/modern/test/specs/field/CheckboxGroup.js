topSuite("Ext.field.CheckboxGroup", ['Ext.app.ViewModel'], function() {
    var component;

    function makeComponent(config) {
        config = Ext.apply({
            fullscreen: true
        }, config);
        component = new Ext.field.CheckboxGroup(config);
    }

    afterEach(function() {
        Ext.destroy(component);
        component = null;
    });

    describe("default name", function() {
        it("should assign group name to child items", function() {
            makeComponent({
                name: 'zurg',
                items: [{}, {}]
            });

            expect(component.getItems().getAt(0)).toHaveAttr('name', 'zurg');
            expect(component.getItems().getAt(1)).toHaveAttr('name', 'zurg');
        });

        it("should assign its id as group name to child items", function() {
            makeComponent({
                items: [{}, {}]
            });

            expect(component.getItems().getAt(0)).toHaveAttr('name', component.id);
            expect(component.getItems().getAt(1)).toHaveAttr('name', component.id);
        });

        it("should not override child name config", function() {
            makeComponent({
                name: 'throbbe',
                items: [{ name: 'gurgle' }, {}]
            });

            expect(component.getItems().getAt(0)).toHaveAttr('name', 'gurgle');
            expect(component.getItems().getAt(1)).toHaveAttr('name', 'throbbe');
        });

        it("should update the name of child when group name is updated", function() {
            var items;

            makeComponent({
                name: 'zurg',
                items: [{}, {}, { name: 'groupItem' }]
            });

            items = component.getItems();
            expect(items.getAt(0)).toHaveAttr('name', 'zurg');
            expect(items.getAt(1)).toHaveAttr('name', 'zurg');
            expect(items.getAt(2)).toHaveAttr('name', 'groupItem');

            component.setFieldsName('zurg-group');

            expect(items.getAt(0)).toHaveAttr('name', 'zurg-group');
            expect(items.getAt(1)).toHaveAttr('name', 'zurg-group');
            expect(items.getAt(2)).toHaveAttr('name', 'groupItem');
        });
    });

    describe("initial value", function() {
        it("should set its originalValue to the aggregated value of its sub-checkboxes", function() {
            makeComponent({
                items: [
                    { name: 'one', checked: true },
                    { name: 'two', checked: true, value: 'two-1' },
                    { name: 'two', checked: false, value: 'two-2' },
                    { name: 'two', checked: true, value: 'two-3' }
                ]
            });

            expect(component.originalValue).toEqual({ one: 'on', two: ['two-1', 'two-3'] });
        });

        it("should set the values to its sub-checkboxes if the value config is added", function() {
            makeComponent({
                items: [
                    { name: 'one', checked: true },
                    { name: 'two', checked: true, value: 'two-1' },
                    { name: 'two', checked: false, value: 'two-2' },
                    { name: 'two', checked: true, value: 'two-3' }
                ],
                value: { two: ['two-1', 'two-2'] }
            });
            expect(component.originalValue).toEqual({ two: ['two-1', 'two-2'] });
            expect(component.getItems().getAt(0).getChecked()).toBe(false);
            expect(component.getItems().getAt(1).getChecked()).toBe(true);
            expect(component.getItems().getAt(2).getChecked()).toBe(true);
            expect(component.getItems().getAt(3).getChecked()).toBe(false);
        });
    });

    describe("sizing", function() {
        it("should respect a configured height", function() {
            makeComponent({
                renderTo: Ext.getBody(),
                height: 100,
                width: 300,
                vertical: true,
                columns: 2,
                scrollable: 'y',
                items: (function() {
                    var checkboxes = [],
                        i;

                    for (i = 0; i < 50; ++i) {
                        checkboxes.push({
                            xtype: 'checkbox'
                        });
                    }

                    return checkboxes;
                })()
            });
            expect(component.getHeight()).toBe(100);
        });
    });

    it("should fire the change event when a sub-checkbox is changed", function() {
        makeComponent({
            items: [{ name: 'foo', checked: true }]
        });
        var spy = jasmine.createSpy();

        component.on('change', spy);
        component.getItems().getAt(0).setValue(false);
        expect(spy.calls[0].args).toEqual([component, {}, { foo: 'on' }]);
        component.getItems().getAt(0).setValue(true);
        var argsData = Ext.clone(Object.freeze(spy.calls[1]));

        expect(argsData.args).toEqual([component, { foo: true }, {}]);
    });

    describe("getValue", function() {
        it("should return an object with keys matching the names of checked items", function() {
            makeComponent({
                items: [{ name: 'one', checked: true }, { name: 'two' }]
            });
            var val = component.getValue();

            expect(val.one).toBeDefined();
            expect(val.two).not.toBeDefined();
        });
        it("should give the value of a single checked item with a given name", function() {
            makeComponent({
                items: [{ name: 'one', checked: true, value: 'foo' }, { name: 'two' }]
            });
            expect(component.getValue().one).toEqual('foo');
        });
        it("should give an array of values of multiple checked items with the same name", function() {
            makeComponent({
                items: [{ name: 'one', checked: true, value: '1' }, { name: 'one', checked: true, value: '2' }, { name: 'one' }]
            });
            expect(component.getValue().one).toEqual(['1', '2']);
        });
    });

    describe("reset", function() {
        it("should reset each checkbox to its initial checked state", function() {
            makeComponent({
                items: [{ name: 'one', checked: true }, { name: 'two' }, { name: 'three', checked: true }]
            });
            component.setValue({ one: false, two: true });
            component.reset();
            expect(component.getItems().getAt(0).getChecked()).toBe(true);
            expect(component.getItems().getAt(1).getChecked()).toBe(false);
            expect(component.getItems().getAt(2).getChecked()).toBe(true);
        });
    });

    describe("allowBlank = false", function() {
        it("should return a validation error when no sub-checkboxes are checked", function() {
            makeComponent({
                required: true,
                items: [{ name: 'one' }]
            });

            expect(component.isValid()).toBe(false);
        });

        it("should not return an error when a sub-checkbox is checked", function() {
            makeComponent({
                required: true,
                items: [{ name: 'one', checked: true }]
            });
            expect(component.isValid()).toBe(true);
        });

        it("should fire the errorchange event with true when checking a box previously undefined", function() {
            makeComponent({
                required: true,
                items: [{ name: 'one' }]
            });
            var isValid;

            component.on('errorchange', function(field, error) {
                isValid = error;
            });
            component.setValue({
                one: true
            });
            expect(isValid.length).not.toBeGT(0);
        });

        it("should fire the errorchange event with true when un checking a box", function() {
            makeComponent({
                required: true,
                items: [{ name: 'one', checked: true }]
            });
            var isValid;

            component.on('errorchange', function(field, validState) {
                isValid = validState;
            });
            component.setValue({
                one: false
            });
            expect(isValid.length).toBeGT(0);
        });
    });

    describe("setValue", function() {
        describe("with a view model", function() {
            it("should be able to set the value with inline data", function() {
                var vm = new Ext.app.ViewModel({
                    data: {
                        theValue: {
                            foo: true,
                            baz: true
                        }
                    }
                });

                makeComponent({
                    renderTo: Ext.getBody(),
                    items: [{
                        name: 'foo'
                    }, {
                        name: 'bar'
                    }, {
                        name: 'baz'
                    }],
                    viewModel: vm,
                    bind: {
                        value: '{theValue}'
                    }
                });
                vm.notify();
                expect(component.getValue()).toEqual({
                    foo: 'on',
                    baz: 'on'
                });

            });

            it("should be able to set the value with a defined viewmodel", function() {
                Ext.define('spec.Bar', {
                    extend: 'Ext.app.ViewModel',
                    alias: 'viewmodel.bar',
                    data: {
                        theValue: {
                            foo: true,
                            baz: true
                        }
                    }
                });

                makeComponent({
                    renderTo: Ext.getBody(),
                    items: [{
                        name: 'foo'
                    }, {
                        name: 'bar'
                    }, {
                        name: 'baz'
                    }],
                    viewModel: {
                        type: 'bar'
                    },
                    bind: {
                        value: '{theValue}'
                    }
                });

                component.getViewModel().notify();

                expect(component.getValue()).toEqual({
                    foo: 'on',
                    baz: 'on'
                });
                Ext.undefine('spec.Bar');
                Ext.Factory.viewModel.instance.clearCache();
            });
        });
    });

    describe('default field value', function() {
        it('should update the value of child when group defaultFieldValue is updated', function() {
            var items;

            makeComponent({
                name: 'zurg',
                items: [{}, {}, { name: 'groupItem' }]
            });

            items = component.getItems();
            expect(items.getAt(0)).toHaveAttr('value', 'on');
            expect(items.getAt(1)).toHaveAttr('value', 'on');
            expect(items.getAt(2)).toHaveAttr('value', 'on');

            component.setDefaultFieldValue('changed-value');

            expect(items.getAt(0)).toHaveAttr('value', 'changed-value');
            expect(items.getAt(1)).toHaveAttr('value', 'changed-value');
            expect(items.getAt(2)).toHaveAttr('value', 'changed-value');
        });
    });

    describe('add', function() {
        beforeEach(function() {
            makeComponent({
                renderTo: Ext.getBody(),
                name: 'foo',
                items: [ {
                    checked: true
                }, {}]
            });
        });

        it('should initialize the name and value of dynamically added field', function() {
            var items = component.getItems();

            expect(items.getAt(0)).toHaveAttr('name', 'foo');
            expect(items.getAt(1)).toHaveAttr('name', 'foo');

            component.add([{ checked: true }, { value: 'cb-1' }]);

            items = component.getItems();

            expect(items.getAt(2)).toHaveAttr('name', 'foo');
            expect(items.getAt(2)).toHaveAttr('value', 'on');
            expect(items.getAt(3)).toHaveAttr('name', 'foo');
            expect(items.getAt(3)).toHaveAttr('value', 'cb-1');
        });

        it('should initialize the name and value of fields defined in container', function() {
            var items = component.getItems(),
                item;

            component.add([{
                    xtype: 'container',
                    defaults: { xtype: 'checkbox' },
                    items: [{}, {}]
                }, {
                    xtype: 'container',
                    defaults: { xtype: 'checkbox' },
                    items: [{}]
                }
            ]);

            expect(items.getAt(2).innerItems[0]).toHaveAttr('name', 'foo');
            expect(items.getAt(2).innerItems[1]).toHaveAttr('name', 'foo');

            items.getAt(3).add([{ checked: true, value: 'cb-checked' }, { checked: true }]);

            expect(items.getAt(3).innerItems[0]).toHaveAttr('name', 'foo');
            expect(items.getAt(3).innerItems[1]).toHaveAttr('name', 'foo');
            expect(items.getAt(3).innerItems[1]).toHaveAttr('value', 'cb-checked');

            items.getAt(3).add({ xtype: 'container', defaults: { xtype: 'checkbox' } });

            item = items.getAt(3).innerItems[3];
            item.add([{ checked: true, value: 'cb-checked' }, { checked: true }]);

            expect(item.innerItems[0]).toHaveAttr('name', 'foo');
            expect(item.innerItems[0]).toHaveAttr('value', 'cb-checked');
            expect(item.innerItems[1]).toHaveAttr('name', 'foo');
            expect(item.innerItems[1]).toHaveAttr('value', 'on');
        });
    });
});
