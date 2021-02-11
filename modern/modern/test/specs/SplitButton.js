topSuite("Ext.SplitButton", function() {
    var button;

    function makeButton(config) {
        config = Ext.apply({
            renderTo: Ext.getBody(),
            text: 'foo',
            menu: [{
                text: 'foo'
            }, {
                text: 'bar'
            }]
        }, config);

        return button = new Ext.SplitButton(config);
    }

    afterEach(function() {
        if (button) {
            button.destroy();
        }

        button = null;
    });

    describe("arrowEl", function() {
        it("should render arrowEl", function() {
            makeButton();
            expect(button.splitArrowCoverElement.dom.nodeName).toBe('BUTTON');
            expect(button.splitArrowCoverElement.isVisible()).toBe(true);
        });
    });

    describe("focus styling", function() {
        var before;

        beforeEach(function() {
            before = new Ext.Button({
                renderTo: Ext.getBody(),
                text: 'before'
            });

            makeButton();
        });

        afterEach(function() {
            before.destroy();
            before = null;
        });

        describe("focusing main el", function() {
            beforeEach(function() {
                focusAndWait(button.buttonElement);
            });

            it("should add focusCls", function() {
                expect(button.splitInnerElement.hasCls('x-focused')).toBe(true);
            });

            it("should not add x-arrow-focus", function() {
                expect(button.arrowElement.hasCls('x-focused')).toBe(false);
            });

            describe("blurring main el", function() {
                beforeEach(function() {
                    focusAndWait(before);
                });

                it("should remove x-btn-focus", function() {
                    expect(button.splitInnerElement.hasCls('x-focused')).toBe(false);
                });

                it("should not have x-arrow-focus", function() {
                    expect(button.arrowElement.hasCls('x-focused')).toBe(false);
                });
            });
        });

        describe("focusing arrowEl", function() {
            beforeEach(function() {
                focusAndWait(button.splitArrowCoverElement);
            });

            it("should add x-arrow-focus", function() {
                expect(button.arrowElement.hasCls('x-focused')).toBe(true);
            });

            describe("blurring arrowEl", function() {
                beforeEach(function() {
                    focusAndWait(before);
                });

                it("should remove x-arrow-focus", function() {
                    expect(button.arrowElement.hasCls('x-focused')).toBe(false);
                });
            });
        });
    });

    describe("events", function() {
        var before, focusSpy, blurSpy, elFocusSpy, arrowElFocusSpy, beforeFocusSpy, arrowElBlurSpy;

        beforeEach(function() {
            beforeFocusSpy = jasmine.createSpy('beforeFocusSpy');

            before = new Ext.Button({
                renderTo: Ext.getBody(),
                text: 'before',
                listeners: {
                    focus: beforeFocusSpy
                }
            });

            // Component events
            focusSpy = jasmine.createSpy('focus');
            blurSpy = jasmine.createSpy('elBlur');

            makeButton({
                listeners: {
                    focus: focusSpy,
                    blur: blurSpy
                }
            });

            // Element events
            elFocusSpy = jasmine.createSpy('elFocus');
            arrowElFocusSpy = jasmine.createSpy('arrowElFocus');
            arrowElBlurSpy = jasmine.createSpy('arrowElBlur');

            button.buttonElement.on('focus', elFocusSpy);
            button.splitArrowCoverElement.on('focus', arrowElFocusSpy);

            button.buttonElement.on('blur', blurSpy);
            button.splitArrowCoverElement.on('blur', arrowElBlurSpy);
        });

        afterEach(function() {
            before.destroy();
            before = focusSpy = blurSpy = arrowElBlurSpy = beforeFocusSpy = null;
            elFocusSpy = arrowElFocusSpy = null;
        });

        describe("focus", function() {
            beforeEach(function() {
                focusAndWait(before);

                waitForSpy(beforeFocusSpy);
            });

            it("should fire when main el is focused from the outside", function() {
                focusAndWait(button.buttonElement);

                waitForSpy(elFocusSpy);

                runs(function() {
                    expect(focusSpy).toHaveBeenCalled();
                });
            });

            it("should fire when arrowEl is focused from the outside", function() {
                focusAndWait(button.splitArrowCoverElement);

                waitForSpy(arrowElFocusSpy);

                runs(function() {
                    expect(arrowElFocusSpy).toHaveBeenCalled();
                });
            });

            it("should fire when focus moved from main el to arrowEl", function() {
                focusAndWait(button.buttonElement);
                focusAndWait(button.splitArrowCoverElement);

                waitForSpy(arrowElFocusSpy);

                runs(function() {
                    // First time is when the main el is focused
                    expect(focusSpy.callCount).toBe(1);
                    expect(arrowElFocusSpy.callCount).toBe(1);
                });
            });

            it("should fire when focus moved from arrowEl to main el", function() {
                focusAndWait(button.splitArrowCoverElement);
                focusAndWait(button.buttonElement);

                waitForSpy(elFocusSpy);

                runs(function() {
                    // First time is when the arrowEl is focused
                    expect(focusSpy.callCount).toBe(1);
                    expect(arrowElFocusSpy.callCount).toBe(1);
                });
            });
        });

        describe("blur", function() {
            it("should fire when main el is blurring to the outside", function() {
                focusAndWait(button.buttonElement);

                waitForSpy(elFocusSpy);

                focusAndWait(before);

                waitForSpy(beforeFocusSpy);

                runs(function() {
                    expect(blurSpy).toHaveBeenCalled();
                });
            });

            it("should fire when arrowEl is blurring to the outside", function() {
                focusAndWait(button.splitArrowCoverElement);

                waitForSpy(arrowElFocusSpy);

                focusAndWait(before);

                waitForSpy(beforeFocusSpy);

                runs(function() {
                    expect(arrowElBlurSpy).toHaveBeenCalled();
                });
            });

            it("should fire when focus moved from main el to arrowEl", function() {
                focusAndWait(button.buttonElement);

                waitForSpy(elFocusSpy);

                focusAndWait(button.splitArrowCoverElement);

                waitForSpy(arrowElFocusSpy);

                runs(function() {
                    expect(blurSpy).toHaveBeenCalled();
                });
            });

            it("should fire when focus moved from arrowEl to main el", function() {
                focusAndWait(button.splitArrowCoverElement);

                waitForSpy(arrowElFocusSpy);

                focusAndWait(button.buttonElement);

                waitForSpy(elFocusSpy);

                runs(function() {
                    expect(arrowElBlurSpy).toHaveBeenCalled();
                });
            });
        });
    });

    describe("dynamic setMenu", function() {
        describe("removing menu", function() {
            beforeEach(function() {
                makeButton({
                    tabIndex: 1,
                    menu: [{
                        text: 'item 1'
                    }, {
                        text: 'item 2'
                    }]
                });
                button.setMenu(null);
            });

            describe("re-adding menu", function() {
                beforeEach(function() {
                    button.setMenu({
                        items: [{
                            text: 'foo 1'
                        }, {
                            text: 'foo 2'
                        }]
                    });
                });

                it("should remove display:none from arrowEl", function() {
                    expect(button.splitArrowCoverElement.isVisible(true)).toBe(true);
                });
            });
        });
    });

    describe("keyboard interaction", function() {
        var pressKey = jasmine.pressKey,
            clickSpy, enterSpy, downSpy;

        afterEach(function() {
            clickSpy = enterSpy = downSpy = null;
        });

        describe("keydown processing", function() {
            beforeEach(function() {
                makeButton({
                    renderTo: undefined
                });

                enterSpy = spyOn(button, 'onEnterKey').andCallThrough();
                downSpy = spyOn(button, 'onDownKey').andCallThrough();
                clickSpy = spyOn(button, 'doTap').andCallThrough();
                button.render(Ext.getBody());
            });

            describe("Space key", function() {
                beforeEach(function() {
                    pressKey(button, 'space');
                });

                it("should call onClick", function() {
                    expect(clickSpy).toHaveBeenCalled();
                });

                it("should stop the keydown event", function() {
                    var args = enterSpy.mostRecentCall.args;

                    expect(args[0].stopped).toBe(true);
                });

                it("should return false to stop propagation", function() {
                    expect(enterSpy.mostRecentCall.result).toBe(false);
                });
            });

            describe("Enter key", function() {
                beforeEach(function() {
                    pressKey(button, 'enter');
                });
                it("should call onClick", function() {
                    expect(clickSpy).toHaveBeenCalled();
                });

                it("should stop the keydown event", function() {
                    var args = enterSpy.mostRecentCall.args;

                    expect(args[0].stopped).toBeTruthy();
                });

                it("should return false to stop propagation", function() {
                    expect(enterSpy.mostRecentCall.result).toBe(false);
                });
            });

            describe("Down arrow key", function() {
                beforeEach(function() {
                    pressKey(button, 'down');
                });

                it("should NOT call onClick", function() {
                    expect(clickSpy).not.toHaveBeenCalled();
                });

                it("should NOT stop the keydown event", function() {
                    var args = downSpy.mostRecentCall.args;

                    expect(args[0].stopped).toBeFalsy();
                });

                it("should NOT return false to stop propagation", function() {
                    expect(downSpy.mostRecentCall.result).not.toBeDefined();
                });
            });
        });
    });

    describe("with menu", function() {
        beforeEach(function() {
            makeButton({
                renderTo: undefined
            });

            button.render(Ext.getBody());
        });

        it("should have arrow-align-right cls", function() {
            expect(button.element).toHaveCls('x-arrow-align-right');
            expect(button.element).not.toHaveCls('x-arrow-align-bottom');
        });

        it("should have arrow-align-bottom cls", function() {
            button.setArrowAlign('bottom');

            expect(button.element).toHaveCls('x-arrow-align-bottom');
            expect(button.element).not.toHaveCls('x-arrow-align-right');
        });

        it("should react to Mouse click when clicked on Arrow button", function() {
            jasmine.fireMouseEvent(button.splitArrowCoverElement, 'click');

            expect(button.getMenu().isVisible()).toBe(true);
        });

        it("should react to Esc key when focus is in the menu", function() {
            pressKey(button, 'esc');

            runs(function() {
                expect(button.getMenu().isVisible()).toBe(false);
            });
        });

    });

    describe("default disabled Split Button", function() {
        beforeEach(function() {
            makeButton({
                text: 'gonzo',
                disabled: true,
                menu: [{
                    text: 'foo'
                }, {
                    text: 'bar'
                }]
            });
        });

        it("should have disabled flag on the buttonElement", function() {
            expect(button.buttonElement.dom.disabled).toBeTruthy();
        });

        it("should have disabled style on the element", function() {
            expect(button.element).toHaveCls(button.disabledCls);
        });
    });

    describe("disabling", function() {
        beforeEach(function() {
            makeButton({
                text: 'throbbe'
            });

            button.disable();
        });

        it("should set disabled flag on the buttonElement", function() {
            expect(button.buttonElement.dom.disabled).toBeTruthy();
        });

        it("should add disabled style to the element", function() {
            expect(button.element).toHaveCls(button.disabledCls);
        });

        describe("re-enabling", function() {
            beforeEach(function() {
                button.enable();
            });

            it("should reset disabled flag on the buttonElement", function() {
                expect(button.el.dom.disabled).toBeFalsy();
            });

            it("should reset disabled style on the element", function() {
                expect(button.element).not.toHaveCls(button.disabledCls);
            });
        });
    });

    (Ext.os.is.iOS || Ext.os.is.Android ? xdescribe : describe)("with arrowHandler", function() {
        var pressKey = jasmine.pressKey,
            clickSpy, enterSpy, downSpy, handlerSpy, fooItem;

        afterEach(function() {
            clickSpy = enterSpy = handlerSpy = downSpy = fooItem = null;
        });

        beforeEach(function() {
            handlerSpy = jasmine.createSpy('arrowHandler');

            makeButton({
                renderTo: undefined,
                arrowHandler: handlerSpy
            });

            enterSpy = spyOn(button, 'onEnterKey').andCallThrough();
            downSpy = spyOn(button, 'onDownKey').andCallThrough();
            clickSpy = spyOn(button, 'doTap').andCallThrough();

            button.render(Ext.getBody());
            fooItem = button.getMenu().getItems().getAt(0);
        });

        it("should fire the handler on Space key", function() {
            jasmine.fireKeyEvent(button.splitArrowCoverElement, 'click', 'space');

            expect(button.getMenu().isVisible()).toBe(true);
            expect(handlerSpy).toHaveBeenCalled();
            expect(clickSpy).toHaveBeenCalled();
        });

        it("should not fire the handler on down arrow key", function() {
            jasmine.fireKeyEvent(button.splitArrowCoverElement, 'keydown', '9');

            expect(handlerSpy).not.toHaveBeenCalled();
            expect(clickSpy).not.toHaveBeenCalled();
        });
    });
});
