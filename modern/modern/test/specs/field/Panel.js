topSuite('Ext.field.Panel', [
    'Ext.field.*',
    'Ext.app.ViewModel'
], function() {
    var field, panel;

    function create(config) {
        panel = Ext.create(Ext.apply({
            xtype: 'fieldpanel',
            renderTo: Ext.getBody()
        }, config));
    }

    afterEach(function() {
        panel = Ext.destroy(panel);
    });

    describe('dirty', function() {
        describe('state', function() {
            it('should not be dirty by default', function() {
                create({
                    items: [{
                        xtype: 'textfield'
                    }]
                });

                field = panel.getComponent(0);

                expect(field.getDirty()).toBe(false);
                expect(field.isDirty()).toBe(false);

                expect(panel.getDirty()).toBe(false);
            });

            it('should bubble dirty to the container', function() {
                create({
                    items: [{
                        xtype: 'textfield'
                    }]
                });

                // Get the state fixed up...
                Ext.fixReferences();

                field = panel.getComponent(0);

                expect(field.getDirty()).toBe(false);
                expect(field.isDirty()).toBe(false);

                expect(panel.getDirty()).toBe(false);

                field.setValue('foo');

                expect(field.getDirty()).toBe(true);
                expect(field.isDirty()).toBe(true);

                expect(panel.getDirty()).toBe(true);
            });

            it('should bubble dirty to all containers and reset', function() {
                create();

                var sub = Ext.create({
                    xtype: 'fieldpanel',
                    items: [{
                        xtype: 'textfield'
                    }]
                });

                field = sub.getComponent(0);

                field.setValue('foo');

                expect(field.getDirty()).toBe(true);
                expect(field.isDirty()).toBe(true);

                // Does not bubble instantly...
                expect(sub.getDirty()).toBe(false);
                expect(panel.getDirty()).toBe(false);

                Ext.fixReferences();

                expect(field.getDirty()).toBe(true);
                expect(field.isDirty()).toBe(true);

                expect(sub.getDirty()).toBe(true);
                expect(panel.getDirty()).toBe(false);

                panel.add(sub);

                // Still won't bubble immediately...
                expect(panel.getDirty()).toBe(false);

                Ext.fixReferences();

                expect(sub.getDirty()).toBe(true);
                expect(panel.getDirty()).toBe(true);

                // clear dirty state...
                field.resetOriginalValue();

                expect(field.getDirty()).toBe(false);
                expect(field.isDirty()).toBe(false);

                expect(sub.getDirty()).toBe(false);
                expect(panel.getDirty()).toBe(false);
            });

            it('should bubble dirty to all containers and update', function() {
                create({
                    referenceHolder: true,
                    viewModel: {}
                });

                var sub = Ext.create({
                    xtype: 'fieldpanel',
                    reference: 'subby',
                    items: [{
                        xtype: 'textfield',
                        value: 'Bill'
                    }]
                });

                field = sub.getComponent(0);
                var vm = panel.getViewModel();

                field.setValue('Ted');

                expect(field.getDirty()).toBe(true);
                expect(field.isDirty()).toBe(true);

                // Does not bubble instantly...
                expect(sub.getDirty()).toBe(false);
                expect(panel.getDirty()).toBe(false);

                Ext.fixReferences();

                expect(field.getDirty()).toBe(true);
                expect(field.isDirty()).toBe(true);

                expect(sub.getDirty()).toBe(true);
                expect(panel.getDirty()).toBe(false);

                var subbyDirty;

                vm.bind('{subby.dirty}', function(value) {
                    subbyDirty = value;
                });

                panel.add(sub);

                // Still won't bubble immediately...
                expect(panel.getDirty()).toBe(false);

                Ext.fixReferences();

                expect(sub.getDirty()).toBe(true);
                expect(panel.getDirty()).toBe(true);
                expect(vm.get('subby.dirty')).toBe(true);

                waitsFor(function() {
                    return subbyDirty;
                });

                runs(function() {
                    // clear dirty state...
                    field.setValue('Bill');

                    expect(field.getDirty()).toBe(false);
                    expect(field.isDirty()).toBe(false);

                    expect(sub.getDirty()).toBe(false);
                    expect(panel.getDirty()).toBe(false);
                });

                waitsFor(function() {
                    return !subbyDirty;
                });
            });

            it('should bubble checkbox dirty to all containers and reset', function() {
                create();

                var sub = Ext.create({
                    xtype: 'fieldpanel',
                    items: [{
                        xtype: 'checkbox'
                    }]
                });

                field = sub.getComponent(0);

                field.setChecked(true);

                expect(field.getDirty()).toBe(true);
                expect(field.isDirty()).toBe(true);

                expect(sub.getDirty()).toBe(false);
                expect(panel.getDirty()).toBe(false);

                Ext.fixReferences();

                expect(field.getDirty()).toBe(true);
                expect(field.isDirty()).toBe(true);

                expect(sub.getDirty()).toBe(true);
                expect(panel.getDirty()).toBe(false);

                panel.add(sub);

                // Still won't bubble immediately...
                expect(panel.getDirty()).toBe(false);

                Ext.fixReferences();

                expect(sub.getDirty()).toBe(true);
                expect(panel.getDirty()).toBe(true);

                // clear dirty state...
                field.resetOriginalValue();

                expect(field.getDirty()).toBe(false);
                expect(field.isDirty()).toBe(false);

                expect(sub.getDirty()).toBe(false);
                expect(panel.getDirty()).toBe(false);
            });

            it('should bubble checkbox dirty to all containers and update', function() {
                create();

                var sub = Ext.create({
                    xtype: 'fieldpanel',
                    items: [{
                        xtype: 'checkbox'
                    }]
                });

                field = sub.getComponent(0);

                field.setChecked(true);

                expect(field.getDirty()).toBe(true);
                expect(field.isDirty()).toBe(true);

                expect(sub.getDirty()).toBe(false);
                expect(panel.getDirty()).toBe(false);

                Ext.fixReferences();

                expect(field.getDirty()).toBe(true);
                expect(field.isDirty()).toBe(true);

                expect(sub.getDirty()).toBe(true);
                expect(panel.getDirty()).toBe(false);

                panel.add(sub);

                // Still won't bubble immediately...
                expect(panel.getDirty()).toBe(false);

                Ext.fixReferences();

                expect(sub.getDirty()).toBe(true);
                expect(panel.getDirty()).toBe(true);

                // clear dirty state...
                field.setChecked(false);

                expect(field.getDirty()).toBe(false);
                expect(field.isDirty()).toBe(false);

                expect(sub.getDirty()).toBe(false);
                expect(panel.getDirty()).toBe(false);
            });
        });
    });

    describe('dirtychange', function() {
        function suite(xtype, descr, fieldConfig) {
            function createField(config) {
                return Ext.apply(Ext.apply({
                    xtype: xtype,
                    label: 'name'
                }, fieldConfig), config);
            }

            beforeEach(function() {
                create({
                    items: [createField()]
                });

                field = panel.getComponent(0);
            });

            it('should return true when form field dirty states is true', function() {
                expect(panel.dirty).toBe(false);

                field[descr.setter](descr.dirtyValue);

                expect(field.dirty).toBe(true);

                waitsFor(function() {
                    return panel.dirty;
                });
            });

            it('should return false when form field dirty states is false', function() {
                expect(panel.dirty).toBe(false);

                field[descr.setter](descr.dirtyValue);

                waitsFor(function() {
                    return panel.dirty;
                });

                runs(function() {
                    field.reset();
                });

                waitsFor(function() {
                    return !panel.dirty;
                });
            });

            it('should fire the dirtychange event', function() {
                var fired = false,
                    state;

                panel.on('dirtychange', function(sender, dirty) {
                    fired = true;
                    state = dirty;
                    expect(sender).toBe(panel);
                });

                expect(panel.dirty).toBe(false);

                field[descr.setter](descr.dirtyValue);

                waitsFor(function() {
                    return fired;
                });

                runs(function() {
                    expect(panel.dirty).toBe(true);
                    expect(field.dirty).toBe(true);
                    expect(state).toBe(true);

                    fired = false;
                    field[descr.setter](descr.cleanValue);

                    expect(field.dirty).toBe(false);
                });

                waitsFor(function() {
                    return fired;
                });

                runs(function() {
                    expect(panel.dirty).toBe(false);
                    expect(field.dirty).toBe(false);
                    expect(state).toBe(false);
                });
            });

            it('should fire the dirtychange event on resetOriginalValue', function() {
                var fired = false,
                    state;

                panel.on('dirtychange', function(sender, dirty) {
                    fired = true;
                    state = dirty;
                    expect(sender).toBe(panel);
                });

                expect(panel.dirty).toBe(false);

                field[descr.setter](descr.dirtyValue);

                waitsFor(function() {
                    return fired;
                });

                runs(function() {
                    expect(panel.dirty).toBe(true);
                    expect(field.dirty).toBe(true);
                    expect(state).toBe(true);

                    fired = false;
                    field.resetOriginalValue();

                    expect(field.dirty).toBe(false);
                });

                waitsFor(function() {
                    return fired;
                });

                runs(function() {
                    expect(panel.dirty).toBe(false);
                    expect(field.dirty).toBe(false);
                    expect(state).toBe(false);

                    fired = false;
                    field[descr.setter](descr.cleanValue); // cleanValue is dirty now

                    expect(field.dirty).toBe(true);
                });

                waitsFor(function() {
                    return fired;
                });

                runs(function() {
                    expect(panel.dirty).toBe(true);
                    expect(field.dirty).toBe(true);
                    expect(state).toBe(true);
                });
            });

            it('should fire dirtychange event when adding item to the panel', function() {
                var fired = false,
                    dynamicField, state;

                panel.on('dirtychange', function(sender, dirty) {
                    fired = true;
                    expect(sender).toBe(panel);
                    state = dirty;
                });

                // Create a new field
                dynamicField = Ext.create(createField());

                expect(dynamicField.dirty).toBe(false);

                // Change the dirty state
                dynamicField[descr.setter](descr.dirtyValue);

                expect(dynamicField.dirty).toBe(true);

                // Add field dynamically to the panel
                panel.add(dynamicField);

                waitsFor(function() {
                    return fired;
                });

                runs(function() {
                    expect(panel.dirty).toBe(true);
                    expect(dynamicField.dirty).toBe(true);
                    expect(state).toBe(true);

                    fired = false;
                    dynamicField[descr.setter](descr.cleanValue);
                });

                waitsFor(function() {
                    return fired;
                });

                runs(function() {
                    expect(panel.dirty).toBe(false);
                    expect(dynamicField.dirty).toBe(false);
                    expect(state).toBe(false);
                });
            });

            it('should fire dirtychange event when adding item to a sub-panel', function() {
                var fired = false,
                    dynamicField, state;

                panel.on('dirtychange', function(sender, dirty) {
                    fired = true;
                    expect(sender).toBe(panel);
                    state = dirty;
                });

                // Create a new field in a sub-panel
                var subPanel = Ext.create({
                    xtype: 'fieldpanel',
                    items: [createField()]
                });

                dynamicField = subPanel.getComponent(0);

                expect(dynamicField.dirty).toBe(false);

                // Change the dirty state
                dynamicField[descr.setter](descr.dirtyValue);

                expect(dynamicField.dirty).toBe(true);

                // Add field dynamically to the panel
                panel.add(subPanel);

                waitsFor(function() {
                    return fired;
                });

                runs(function() {
                    expect(panel.dirty).toBe(true);
                    expect(subPanel.dirty).toBe(true);
                    expect(dynamicField.dirty).toBe(true);
                    expect(state).toBe(true);

                    fired = false;
                    dynamicField[descr.setter](descr.cleanValue);
                });

                waitsFor(function() {
                    return fired;
                });

                runs(function() {
                    expect(panel.dirty).toBe(false);
                    expect(subPanel.dirty).toBe(false);
                    expect(dynamicField.dirty).toBe(false);
                    expect(state).toBe(false);
                });
            });
        }

        describe('checkbox', function() {
            suite('checkbox', {
                getter: 'getChecked',
                setter: 'setChecked',
                cleanValue: false,
                dirtyValue: true
            });
        });

        describe('combobox', function() {
            suite('combobox', {
                getter: 'getValue',
                setter: 'setValue',
                cleanValue: 'aaa',
                dirtyValue: 'xxx'
            }, {
                options: ['aaa', 'bbb'],
                value: 'aaa'
            });
        });

        describe('datefield', function() {
            suite('datefield', {
                getter: 'getValue',
                setter: 'setValue',
                cleanValue: null,
                dirtyValue: new Date()
            });
        });

        describe('numberfield', function() {
            suite('numberfield', {
                getter: 'getValue',
                setter: 'setValue',
                cleanValue: null,
                dirtyValue: 42
            });
        });

        describe('passwordfield w/null', function() {
            suite('passwordfield', {
                getter: 'getValue',
                setter: 'setValue',
                cleanValue: null,
                dirtyValue: 'foo'
            });
        });

        describe('passwordfield w/""', function() {
            suite('passwordfield', {
                getter: 'getValue',
                setter: 'setValue',
                cleanValue: "",
                dirtyValue: 'foo'
            });
        });

        describe('selectfield', function() {
            suite('selectfield', {
                getter: 'getValue',
                setter: 'setValue',
                cleanValue: 'aaa',
                dirtyValue: 'bbb'
            }, {
                options: ['aaa', 'bbb'],
                value: 'aaa'
            });
        });

        describe('sliderfield', function() {
            suite('sliderfield', {
                getter: 'getValue',
                setter: 'setValue',
                cleanValue: 0,
                dirtyValue: 42
            });
        }, {
            minValue: 0,
            maxValue: 50,
            increment: 2
        });

        describe('spinnerfield', function() {
            suite('spinnerfield', {
                getter: 'getValue',
                setter: 'setValue',
                cleanValue: 0,
                dirtyValue: 42
            });
        });

        describe('textareafield w/null', function() {
            suite('textareafield', {
                getter: 'getValue',
                setter: 'setValue',
                cleanValue: null,
                dirtyValue: 'foo'
            });
        });

        describe('textareafield w/""', function() {
            suite('textareafield', {
                getter: 'getValue',
                setter: 'setValue',
                cleanValue: "",
                dirtyValue: 'foo'
            });
        });

        describe('textfield w/null', function() {
            suite('textfield', {
                getter: 'getValue',
                setter: 'setValue',
                cleanValue: null,
                dirtyValue: 'foo'
            });
        });

        describe('textfield w/""', function() {
            suite('textfield', {
                getter: 'getValue',
                setter: 'setValue',
                cleanValue: "",
                dirtyValue: 'foo'
            });
        });

        describe('timefield', function() {
            suite('timefield', {
                getter: 'getValue',
                setter: 'setValue',
                cleanValue: null,
                dirtyValue: new Date()
            });
        });

        describe('togglefield', function() {
            suite('togglefield', {
                getter: 'getValue',
                setter: 'setValue',
                cleanValue: 0,
                dirtyValue: 1
            });
        });

        describe('urlfield w/null', function() {
            suite('urlfield', {
                getter: 'getValue',
                setter: 'setValue',
                cleanValue: null,
                dirtyValue: 'http://foo.com'
            });
        });

        describe('urlfield w/""', function() {
            suite('urlfield', {
                getter: 'getValue',
                setter: 'setValue',
                cleanValue: "",
                dirtyValue: 'http://foo.com'
            });
        });
    });
});
