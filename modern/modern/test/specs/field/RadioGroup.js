topSuite("Ext.field.RadioGroup", ['Ext.app.ViewModel', 'Ext.form.Panel'], function() {
    var group, panel;

    function makeGroup(items, cfg) {
        panel = new Ext.form.Panel({
            renderTo: Ext.getBody()
        });

        group = panel.add(Ext.apply({
            xtype: 'radiogroup',
            items: items,
            simpleValue: false
        }, cfg));
    }

    afterEach(function() {
        panel = group = Ext.destroy(panel);
    });

    describe("default name", function() {
        it("should assign group name to child items", function() {
            makeGroup([{}, {}], {
                name: 'zurg'
            });

            expect(group.getItems().getAt(0)).toHaveAttr('name', 'zurg');
            expect(group.getItems().getAt(1)).toHaveAttr('name', 'zurg');
        });

        it("should assign its id as group name to child items", function() {
            makeGroup([{}, {}]);

            expect(group.getItems().getAt(0)).toHaveAttr('name', group.id);
            expect(group.getItems().getAt(1)).toHaveAttr('name', group.id);
        });

        it("should not override child name config", function() {
            makeGroup([{ name: 'gurgle' }, {}], {
                name: 'throbbe'
            });

            expect(group.getItems().getAt(0)).toHaveAttr('name', 'gurgle');
            expect(group.getItems().getAt(1)).toHaveAttr('name', 'throbbe');
        });

        it("should update the name of child when group name is updated", function() {
            var items;

            makeGroup([{}, {}, { name: 'groupItem' }], {
                name: 'zurg'
            });

            items = group.getItems();
            expect(items.getAt(0)).toHaveAttr('name', 'zurg');
            expect(items.getAt(1)).toHaveAttr('name', 'zurg');
            expect(items.getAt(2)).toHaveAttr('name', 'groupItem');

            group.setFieldsName('zurg-group');

            expect(items.getAt(0)).toHaveAttr('name', 'zurg-group');
            expect(items.getAt(1)).toHaveAttr('name', 'zurg-group');
            expect(items.getAt(2)).toHaveAttr('name', 'groupItem');
        });
    });

    describe("setValue", function() {
        it("should check the matching item", function() {
            makeGroup([{
                name: 'foo',
                value: 'a'
            }, {
                name: 'foo',
                value: 'b'
            }, {
                name: 'foo',
                value: 'c'
            }]);

            group.setValue({
                foo: 'b'
            });

            expect(group.getValue()).toEqual({
                foo: 'b'
            });
        });

        describe("with a view model", function() {
            it("should be able to set the value with inline data", function() {
                var vm = new Ext.app.ViewModel({
                    data: {
                        theValue: {
                            foo: 'b'
                        }
                    }
                });

                makeGroup([{
                    name: 'foo',
                    value: 'a'
                }, {
                    name: 'foo',
                    value: 'b'
                }, {
                    name: 'foo',
                    value: 'c'
                }], {
                    viewModel: vm,
                    bind: '{theValue}'
                });

                vm.notify();

                expect(group.getValue()).toEqual({
                    foo: 'b'
                });
            });

            it("should be able to set the value with a defined viewmodel", function() {
                Ext.define('spec.Bar', {
                    extend: 'Ext.app.ViewModel',
                    alias: 'viewmodel.bar',
                    data: {
                        theValue: {
                            foo: 'b'
                        }
                    }
                });

                makeGroup([{
                    name: 'foo',
                    value: 'a'
                }, {
                    name: 'foo',
                    value: 'b'
                }, {
                    name: 'foo',
                    value: 'c'
                }], {
                    viewModel: {
                        type: 'bar'
                    },
                    bind: '{theValue}'
                });

                group.getViewModel().notify();

                expect(group.getValue()).toEqual({
                    foo: 'b'
                });
                Ext.undefine('spec.Bar');
                Ext.Factory.viewModel.instance.clearCache();
            });
        });

        describe("simpleValue", function() {
            var one, two, three;

            beforeEach(function() {
                makeGroup([{
                    boxLabel: 'one',
                    value: '1',
                    checked: true
                }, {
                    boxLabel: 'two',
                    value: '2'
                }, {
                    boxLabel: 'three',
                    value: '3'
                }], {
                    renderTo: undefined,
                    name: 'foo',
                    simpleValue: true
                });

                one = group.down('[boxLabel=one]');
                two = group.down('[boxLabel=two]');
                three = group.down('[boxLabel=three]');
            });

            afterEach(function() {
                one = two = three = null;
            });

            describe("initial", function() {
                it("should have first radio checked", function() {
                    expect(one.isChecked()).toBe(true);
                });

                it("should return value from checked radio", function() {
                    expect(group.getChecked().getValue()).toBe('1');
                });
            });

            describe("setValue", function() {
                beforeEach(function() {
                    group.setValue('2');
                });

                it("should set value", function() {
                    expect(group.getChecked().getValue()).toBe('2');
                });

                it("should check the corresponding radio", function() {
                    expect(two.isChecked()).toBe(true);
                });

                it("should un-check other radios", function() {
                    expect(one.isChecked()).toBe(false);
                    expect(three.isChecked()).toBe(false);
                });
            });
        });
    });
});
