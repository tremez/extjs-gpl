topSuite("Ext.Chip", ['Ext.Container'], function() {
    var container, chip;

    function makeChip(config) {
        container = Ext.create({
            xtype: 'container',
            items: chip = Ext.create(Ext.apply({
                xtype: 'chip'
            }, config)),
            renderTo: document.body
        });
    }

    afterEach(function() {
        chip = container = Ext.destroy(container);
    });

    describe('close handler', function() {
        var passedChip;

        it('should pass the chip', function() {
            makeChip({
                text: 'Test Closable',
                closable: true,
                closeHandler: function(chip, e) {
                    passedChip = chip;
                }
            });
            Ext.testHelper.tap(chip.closeElement);
            expect(passedChip).toBe(chip);
        });
    });

    describe('configuration', function() {

        it('should make isChip to true', function() {
            makeChip({
                text: 'Test'
            });
            expect(chip.isChip).toBe(true);
        });

        it('should make focusable false by default', function() {
            makeChip({
                text: 'Test'
            });
            expect(chip.focusable).toBe(false);
        });

        it('should not have closable class if closable proerty not available', function() {
            makeChip({
                text: 'Test',
                closable: false
            });
            expect(chip.element).not.toHaveCls(chip.closableCls);
        });

        it('should not have closable class if closable proerty is false', function() {
            makeChip({
                text: 'Test',
                closable: false
            });
            expect(chip.element).not.toHaveCls(chip.closableCls);
        });

        it('should have closable class if closable proerty is true', function() {
            makeChip({
                text: 'Test',
                closable: true
            });
            expect(chip.element).toHaveCls(chip.closableCls);
        });

        it('should have proper class on closable item', function() {
            makeChip({
                text: 'Test',
                closable: true
            });
            expect(chip.closeElement).toHaveCls(Ext.baseCSSPrefix + 'close-el');
            expect(chip.closeElement).toHaveCls(Ext.baseCSSPrefix + 'font-icon');
        });

        it('should have proper class on body element', function() {
            makeChip({
                text: 'Test'
            });
            expect(chip.bodyElement).toHaveCls(Ext.baseCSSPrefix + 'body-el');
        });

        it('should have proper class on icon element', function() {
            makeChip({
                text: 'Test'
            });
            expect(chip.iconElement).toHaveCls(Ext.baseCSSPrefix + 'icon-el');
            expect(chip.iconElement).toHaveCls(Ext.baseCSSPrefix + 'font-icon');
        });

        it('should have proper class on text element', function() {
            makeChip({
                text: 'Test'
            });
            expect(chip.textElement).toHaveCls(Ext.baseCSSPrefix + 'text-el');
        });

        it('should not make close button visible if closable is not provided', function() {
            makeChip({
                text: 'Test'
            });

            expect(chip.closeElement.isVisible()).toBe(false);
        });

        it('should not make close button visible if closable false', function() {
            makeChip({
                text: 'Test',
                closable: false
            });

            expect(chip.closeElement.isVisible()).toBe(false);
        });

        it('should make close button visible if closable false', function() {
            makeChip({
                text: 'Test',
                closable: true
            });
            expect(chip.closeElement.isVisible()).toBe(true);
        });

    });

    describe("icon", function() {
        describe("configuration", function() {
            beforeEach(function() {
                makeChip({
                    icon: 'resources/images/test.gif'
                });
            });

            it("should set the icon", function() {
                expect(chip.getIcon()).toEqual('resources/images/test.gif');
            });

            describe("after render", function() {
                beforeEach(function() {
                    chip.render(Ext.getBody());
                });

                it("should create a iconEl", function() {
                    expect(chip.iconElement).not.toBeNull();
                });
            });
        });

        describe("methods", function() {
            beforeEach(function() {
                makeChip({});
            });

            it("should set the icon", function() {
                chip.setIcon('resources/images/another.gif');
                expect(chip.getIcon()).toEqual('resources/images/another.gif');
            });

            describe("after render", function() {
                beforeEach(function() {
                    chip.render(Ext.getBody());
                });

                it("should create a iconEl", function() {
                    expect(chip.iconElement).not.toBeNull();
                });

                describe("when remove the icon", function() {
                    beforeEach(function() {
                        chip.setIcon(null);
                    });

                    it("should remove the icon configuration", function() {
                        expect(chip.getIcon()).toBeNull();
                    });
                });

                it("should have the new background-image on the iconEl", function() {
                    chip.setIcon('resources/images/another.gif');

                    expect(chip.iconElement.getStyle('background-image')).toMatch('another');
                });

                it("should remove any old cls on the iconEl", function() {
                    chip.setIcon('resources/images/another.gif');

                    expect(chip.iconElement.getStyle('background-image')).toMatch('another');

                    chip.setIcon('resources/images/new.gif');

                    expect(chip.iconElement.getStyle('background-image')).not.toMatch('another');
                    expect(chip.iconElement.getStyle('background-image')).toMatch('new');
                });
            });
        });
    });

    describe("iconCls", function() {
        describe("configuration", function() {
            beforeEach(function() {
                makeChip({
                    iconCls: 'test'
                });
            });

            it("should set the iconCls", function() {
                expect(chip.getIconCls()).toEqual('test');
            });

            describe("after render", function() {
                beforeEach(function() {
                    chip.render(Ext.getBody());
                });

                it("should insert the iconEl", function() {
                    expect(chip.iconElement.parentNode).not.toBeNull();
                });
            });
        });

        describe("methods", function() {
            beforeEach(function() {
                makeChip({});
            });

            it("should set the iconCls", function() {
                chip.setIconCls('test');
                expect(chip.getIconCls()).toEqual('test');
            });

              it("should create an iconEl", function() {
                expect(chip.iconElement).not.toBeNull();
            });

            describe("after render", function() {
                beforeEach(function() {
                    chip.render(Ext.getBody());
                    chip.setIconCls('test');
                });

                describe("when removing iconCls", function() {
                    beforeEach(function() {
                        chip.setIconCls(null);
                    });

                    it("should remove the iconCls configuration", function() {
                        expect(chip.getIconCls()).toBeNull();
                    });

                    it("should remove the iconCls", function() {
                        expect(chip.element.hasCls('test')).toBeFalsy();
                    });
                });

                it("should have the new cls on the iconEl", function() {
                    chip.setIconCls('another');

                    expect(chip.iconElement.hasCls('another')).toBeTruthy();
                });

                it("should remove any old cls on the iconEl", function() {
                    chip.setIconCls('another');

                    expect(chip.iconElement.hasCls('another')).toBeTruthy();

                    chip.setIconCls('new');

                    expect(chip.iconElement.hasCls('another')).toBeFalsy();
                    expect(chip.iconElement.hasCls('new')).toBeTruthy();
                });
            });
        });
    });

    describe("text", function() {
        describe("configuration", function() {
            beforeEach(function() {
                makeChip({
                    text: 'text'
                });
            });

            it("should set the text", function() {
                expect(chip.getText()).toEqual('text');
            });

            describe("after render", function() {
                beforeEach(function() {
                    chip.render(Ext.getBody());
                });

                it("should create a text element", function() {
                    expect(chip.textElement).not.toBeNull();
                });
            });
        });

        describe("methods", function() {
            beforeEach(function() {
                makeChip({});
            });

            it("should set the text", function() {
                chip.setText('text');
                expect(chip.getText()).toEqual('text');
            });

            describe("after render", function() {
                beforeEach(function() {
                    chip.render(Ext.getBody());
                });

                it("should create a text el", function() {
                    expect(chip.textElement).not.toBeNull();
                });

                describe("when remove the text", function() {
                    beforeEach(function() {
                        chip.setText(null);
                    });

                    it("should remove the icon configuration", function() {
                        expect(chip.getText()).toBeNull();
                    });
                });

                describe("when update the text", function() {
                    beforeEach(function() {
                        chip.setText("text");
                    });

                    it("should remove the icon configuration", function() {
                        expect(chip.getText()).toEqual('text');
                        chip.setText("text-anotehr");
                        expect(chip.getText()).toEqual('text-anotehr');
                    });
                });

            });
        });
    });

});
