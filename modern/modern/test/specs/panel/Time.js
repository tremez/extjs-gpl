topSuite("Ext.panel.Time", function() {
    var panel, header, view, faceEl, layoutSpy;

    function createPanel(config) {
        config = Ext.apply({}, config);

        panel = new Ext.panel.Time(config);
    }

    function makePanel(config) {
        config = Ext.apply({
            renderTo: document.body
        }, config);

        createPanel(config);

        view = panel.getView();
        header = view.getHeader();
        faceEl = view.faceEl;

        layoutSpy = jasmine.createSpy('TimeView face layout');
        view.on('painted', layoutSpy);

        waitForSpy(layoutSpy);
    }

    beforeEach(function() {
        makePanel();
    });

    afterEach(function() {
        panel = header = view = faceEl = layoutSpy = Ext.destroy(panel);
    });

    describe("initialization", function() {
        describe("create", function() {
            var date;

            beforeEach(function() {
                date = new Date();
            });

            it("should be created without error", function() {
                expect(panel).toBeDefined();
            });

            it("should have value as current time", function() {
                expect(view.getHours()).toEqual(date.getHours());
                expect(view.getMinutes()).toEqual(date.getMinutes());
            });
        });

        describe("initialize time panel component and check its rendering", function() {
            it("should have default values", function() {
                expect(view).toBeDefined();
                expect(view.getHeaderPosition()).toBe('top');
                expect(panel.getMode()).toBe('hour');
                expect(panel.getAutoAdvance()).toBe(true);
            });

            it("should render header elements correctly ", function() {
                panel.setValue(800);
                expect(view.getAm()).toBe(false);
                expect(header.hoursEl).toHaveCls('active');
            });

            it("should draw hand element correctly ", function() {
                panel.setValue(500);
                expect(view.getHours()).toBe(8);
                expect(view.handEl.dom.style['transform']).toBe('rotate(' + view.getAngleFromTime(8, 'hour') + 'deg)');
            });

            it("should draw face element correctly ", function() {
                panel.setValue(400);
                expect(faceEl.dom.childNodes.length).toBe(12);

                view.activateMinutes();
                expect(faceEl.dom.childNodes.length).toBe(60);
            });
        });
    });

    describe("config", function() {
        describe("confirmable", function() {
            it("should be false by default and buttons should not be available", function() {
                expect(panel.getConfirmable()).toBe(false);
                expect(view.getButtons()).toBe(false);
            });

            it("should set Buttons on setting confirmable as true", function() {
                panel.setConfirmable(true);
                expect(view.getButtons()).not.toBe(null);
            });
        });

        // TODO Vertical layout is broken
        xdescribe("vertical", function() {
            it("should be top by default", function() {
                expect(panel.getHeaderPosition()).toBe('top');
            });

            it("should be left if set vertical as false", function() {
                panel.setVertical(false);
                expect(view.getHeaderPosition()).toBe('left');
            });
        });

        describe("autoAdvance", function() {
            it("should be true by default and mode should advanced to minute after selecting hour value", function() {
                expect(panel.getAutoAdvance()).toBe(true);
                expect(panel.getMode()).toBe('hour');
                jasmine.fireMouseEvent(faceEl.dom.children[5], 'click');
                expect(panel.getMode()).toBe('minute');
            });

            it("should not change mode after selection if autoAdvance is false", function() {
                panel.setAutoAdvance(false);
                expect(panel.getAutoAdvance()).toBe(false);
                expect(panel.getMode()).toBe('hour');
                jasmine.fireMouseEvent(faceEl.dom.children[5], 'click');
                expect(panel.getMode()).toBe('hour');
            });
        });

        describe("buttonAlign/confirmable/defaultButtons", function() {
            it("should be right and no buttons on panel by default", function() {
                expect(view.getButtonAlign()).toBe('right');
                expect(view.getButtons()).toBe(false);
            });

            it("no buttons on panel when confirmable as true but defaultButtons as null", function() {
                panel.setDefaultButtons(null);
                panel.setConfirmable(true);

                expect(view.getButtonAlign()).toBe('right');
                expect(view.getButtons()).toBeNull();
            });

            it("should set Buttons on right if confirmable is true", function() {
                panel.setConfirmable(true);

                expect(view.getButtons().getLayout().getPack()).toBe('end');
            });

            it("should set Buttons on left if set buttonAlign as left and confirmable as true", function() {
                panel.setButtonAlign('left');
                panel.setConfirmable(true);

                expect(view.getButtons().getLayout().getPack()).toBe('start');
            });

            it("should set Buttons on center if set buttonAlign as center and confirmable as true", function() {
                panel.setButtonAlign('center');
                panel.setConfirmable(true);

                expect(view.getButtons().getLayout().getPack()).toBe('center');
            });
        });

        //EXTJS-27468
        describe("hourformat", function() {
            function meridemCheck(hourNodes, format){
                var hourDisplay;
                for(var i = 0; i<hourNodes.length; i++){
                    if(format==='H'){
                        hourDisplay = i < 9 ? '0'+ (i+1) : i == 23 ? '00': (i+1).toString();
                    }else{
                        hourDisplay = i == 23 ? '00' : (i+1).toString();
                    }   
                    expect(hourNodes[i].innerText).toBe(hourDisplay);
                }
            }

            it("should have 24 hour format analog time", function() {
                panel.setMeridiem(false);

                expect(faceEl.dom.childNodes.length).toBe(24);
            });

            it("should set AM and PM dom style display set none", function() {
                panel.setMeridiem(false);
                
                expect(view.el.down('.analog-picker-24hr-format')).toBeDefined();
            });

            it("should set 13-00 hours of analog clock inside circle of 1-12", function() {
                panel.setMeridiem(false);
                panel.setAlignPMInside(true);
                
                expect(faceEl.dom.childNodes[0].style.transform.split(' ')[1]).not.toBe(faceEl.dom.childNodes[13].style.transform.split(' ')[1]);
            });

            it("should set AM and PM dom style display set block", function() {
                panel.setMeridiem(true);

                expect(view.el.down('.analog-picker-12hr-format')).toBeDefined();
            });

            it("should change hourDisplay format for 24hrs to 00", function() {
                panel.setMeridiem(false);
                panel.setHourDisplayFormat('H');

                expect(faceEl.dom.childNodes[23].innerText).toBe('00');
            });

              it("should display hours from 01 to 00 when set meridiem : false and hoursDisplayFormat : H", function() {
                panel.setMeridiem(false);
                panel.setHourDisplayFormat('H');

                meridemCheck(faceEl.dom.childNodes, 'H');
            });

            it("should display hours from 1 to 12 when set meridiem : true and hoursDisplayFormat : G", function() {
                panel.setMeridiem(true);
                panel.setHourDisplayFormat('G');

                meridemCheck(faceEl.dom.childNodes, 'G');
            });

             it("should return proper time on setter and getter methods", function() {
                panel.setMeridiem(true);

                view.setHours(0);
                expect(view.el.query('.active')[0].innerText).toBe('12');

                view.setHours(3);
                expect(view.el.query('.active')[0].innerText).toBe('3');

                panel.setMeridiem(false);
                expect(view.el.query('.active')[0].innerText).toBe('3');

                view.setHours(12);
                expect(view.el.query('.active')[0].innerText).toBe('12');

                panel.setMeridiem(true);
                expect(view.el.query('.active')[0].innerText).toBe('12');

                view.setHours(15);
                expect(view.el.query('.active')[0].innerText).toBe('3');

                panel.setMeridiem(false);
                expect(view.el.query('.active')[0].innerText).toBe('15');
            });
        });
    });

    describe("value", function() {
        describe("hours", function() {
            it("should be correct when setting value", function() {
                panel.setValue(780);
                expect(view.getHours()).toBe(13);
            });

            it("should set current Time when setting wrong value", function() {
                panel.setValue(-1);
                expect(view.getHours()).toBe(new Date().getHours());
                expect(view.getMinutes()).toBe(new Date().getMinutes());
            });
        });

        describe("minutes", function() {
            it("should be correct when setting value", function() {
                panel.setValue(788);
                expect(view.getMinutes()).toBe(8);
            });
        });
    });

    describe("confirm and decline handlers", function() {
        var confirmHandlerSpy, declineHandlerSpy;

        beforeEach(function() {
            confirmHandlerSpy = jasmine.createSpy('confirmHandler');
            declineHandlerSpy = jasmine.createSpy('declineHandler');

            panel.setConfirmable(true);
            panel.setConfirmHandler(confirmHandlerSpy);
            panel.setDeclineHandler(declineHandlerSpy);
        });

        afterEach(function() {
            confirmHandlerSpy = declineHandlerSpy = null;
        });

        it("should call confirmHandler on ok click", function() {
            expect(view.getButtons()).not.toBeNull();
            view.onConfirm();

            waitsForSpy(confirmHandlerSpy);

            runs(function() {
                expect(confirmHandlerSpy).toHaveBeenCalled();
            });
        });

        it("should call declineHandler on cancel click", function() {
            expect(view.getButtons()).not.toBeNull();
            view.onDecline();

            waitsForSpy(declineHandlerSpy);

            runs(function() {
                expect(declineHandlerSpy).toHaveBeenCalled();
            });
        });
    });

    (Ext.supports.Touch ? xdescribe : describe)("pointer interaction", function() {
        describe("header", function() {
            it("should set AM as true and it should be active on clicking on AM ", function() {
                panel.setValue(800);
                expect(view.getAm()).toBe(false);

                jasmine.fireMouseEvent(header.amEl, 'click');

                expect(view.getAm()).toBe(true);
                expect(header.pmEl).not.toHaveCls('active');
                expect(header.amEl).toHaveCls('active');
            });

            it("should set AM as false and PM should be active on clicking on PM", function() {
                panel.setValue(500);
                expect(view.getAm()).toBe(true);

                jasmine.fireMouseEvent(header.pmEl, 'click');

                expect(view.getAm()).toBe(false);
                expect(header.pmEl).toHaveCls('active');
                expect(header.amEl).not.toHaveCls('active');
            });

            it("should activate hours on mouse click on hoursEl", function() {
                view.activateMinutes();

                expect(header.hoursEl).not.toHaveCls('active');
                expect(header.minutesEl).toHaveCls('active');

                jasmine.fireMouseEvent(header.hoursEl, 'click');

                expect(header.hoursEl).toHaveCls('active');
                expect(header.minutesEl).not.toHaveCls('active');
            });

            it("should activate minutes on mouse click on minutesEl", function() {
                view.activateHours();

                expect(header.hoursEl).toHaveCls('active');
                expect(header.minutesEl).not.toHaveCls('active');

                jasmine.fireMouseEvent(header.minutesEl, 'click');

                expect(header.hoursEl).not.toHaveCls('active');
                expect(header.minutesEl).toHaveCls('active');
            });
        });

        describe("face", function() {
            describe("clicking", function() {
                it("should update hours value in hours mode", function() {
                    panel.setValue(500);

                    expect(view.getHours()).toBe(8);

                    jasmine.fireMouseEvent(faceEl.dom.children[5], 'click');

                    expect(view.getHours()).toBe(6);
                });

                it("should advance to minutes from hours mode", function() {
                    panel.setValue(500);

                    expect(view.getHours()).toBe(8);
                    expect(view.getMode()).toBe('hour');

                    jasmine.fireMouseEvent(faceEl.dom.children[9], 'click');

                    expect(view.getMode()).toBe('minute');
                });

                it("should update minutes value in minutes mode", function() {
                    panel.setValue(500);

                    expect(view.getMinutes()).not.toBe(16);

                    view.activateMinutes();

                    jasmine.fireMouseEvent(faceEl.dom.children[15], 'click');

                    expect(view.getMinutes()).toBe(16);
                });

                it("should fire select event when selecting minute value if confirmable == false", function() {
                    var spy = jasmine.createSpy('select'),
                        args, wantDate, haveDate;

                    panel.setConfirmable(false);
                    panel.setValue(600);
                    view.activateMinutes();

                    expect(view.getMinutes()).toBe(0);

                    panel.on('select', spy);

                    jasmine.fireMouseEvent(faceEl.dom.children[33], 'click');

                    expect(view.getMinutes()).toBe(34);

                    expect(spy).toHaveBeenCalled();

                    args = spy.mostRecentCall.args;

                    expect(args[0]).toBe(panel);

                    haveDate = args[1];
                    wantDate = new Date(1970, 0, 1, 10, 34, 0);

                    expect(haveDate.getTime()).toBe(wantDate.getTime());
                });

                it("should not fire select event when selecting minute value if confirmable == true", function() {
                    var spy = jasmine.createSpy('select');

                    panel.setConfirmable(true);
                    panel.setValue(600);
                    view.activateMinutes();

                    expect(view.getMinutes()).toBe(0);

                    panel.on('select', spy);

                    jasmine.fireMouseEvent(faceEl.dom.children[33], 'click');

                    expect(view.getMinutes()).toBe(34);

                    expect(spy).not.toHaveBeenCalled();
                });
            });

            describe("dragging", function() {
                var mouseMoveSpy;

                beforeEach(function() {
                    mouseMoveSpy = jasmine.createSpy('mousemove');

                    faceEl.on({
                        mousemove: mouseMoveSpy,
                        scope: this
                    });
                });

                afterEach(function() {
                    mouseMoveSpy = null;
                });

                describe("hours", function() {
                    it("should activate minutes after dragging hoursEl", function() {
                        panel.setValue(500);

                        expect(header.hoursEl).toHaveCls('active');

                        jasmine.fireMouseEvent(faceEl, 'mousedown');
                        jasmine.fireMouseEvent(faceEl, 'mousemove');

                        waitsForSpy(mouseMoveSpy);

                        runs(function() {
                            jasmine.fireMouseEvent(faceEl.dom.children[9], 'mouseup');
                            expect(header.minutesEl).toHaveCls('active');
                        });
                    });

                    it("should set hour value after dragging hoursEl", function() {
                        panel.setValue(0);

                        expect(view.getHours()).not.toBe(12);
                        expect(header.hoursEl).toHaveCls('active');

                        jasmine.fireMouseEvent(faceEl, 'mousedown');
                        jasmine.fireMouseEvent(faceEl, 'mousemove');

                        waitsForSpy(mouseMoveSpy);

                        runs(function() {
                            jasmine.fireMouseEvent(faceEl.dom.children[10], 'mouseup');
                            expect(view.getHours()).toBe(11);
                        });
                    });

                    it("should update hour value while dragging hoursEl", function() {
                        panel.setValue(500);

                        expect(view.getHours()).toBe(8);
                        expect(header.hoursEl).toHaveCls('active');

                        jasmine.fireMouseEvent(faceEl, 'mousedown');
                        jasmine.fireMouseEvent(faceEl.dom.children[5], 'mousemove');

                        expect(view.getHours()).toBe(6);

                        jasmine.fireMouseEvent(faceEl.dom.children[3], 'mousemove');

                        expect(view.getHours()).toBe(4);

                        jasmine.fireMouseEvent(faceEl, 'mouseup');
                    });

                    it("should activate hour value under mouse while dragging in hour mode", function() {
                        panel.setValue(500);

                        expect(view.getHours()).toBe(8);
                        expect(faceEl.dom.children[7]).not.toHaveCls('active');

                        jasmine.fireMouseEvent(faceEl, 'mousedown');
                        jasmine.fireMouseEvent(faceEl.dom.children[5], 'mousemove');

                        expect(faceEl.dom.children[5]).toHaveCls('active');

                        jasmine.fireMouseEvent(faceEl.dom.children[3], 'mousemove');

                        expect(faceEl.dom.children[5]).not.toHaveCls('active');
                        expect(faceEl.dom.children[3]).toHaveCls('active');

                        jasmine.fireMouseEvent(faceEl, 'mouseup');
                    });

                    it("should redraw hour hand correctly while dragging in hour mode", function() {
                        panel.setValue(500);

                        expect(view.getHours()).toBe(8);
                        expect(view.handEl.dom.style['transform']).toBe('rotate(' + view.getAngleFromTime(view.getHours(), 'hour') + 'deg)');

                        jasmine.fireMouseEvent(faceEl, 'mousedown');
                        jasmine.fireMouseEvent(faceEl.dom.children[6], 'mousemove');

                        expect(view.handEl.dom.style['transform']).toBe('rotate(' + view.getAngleFromTime(view.getHours(), 'hour') + 'deg)');

                        jasmine.fireMouseEvent(faceEl.dom.children[7], 'mousemove');

                        expect(view.handEl.dom.style['transform']).toBe('rotate(' + view.getAngleFromTime(view.getHours(), 'hour') + 'deg)');
                        jasmine.fireMouseEvent(faceEl, 'mouseup');
                    });

                    it("should not update minutes value while dragging hoursEl", function() {
                        panel.setValue(500);

                        expect(view.getMinutes()).toBe(20);
                        expect(header.hoursEl).toHaveCls('active');

                        jasmine.fireMouseEvent(faceEl, 'mousedown');
                        jasmine.fireMouseEvent(faceEl.dom.children[5], 'mousemove');

                        expect(view.getMinutes()).toBe(20);

                        jasmine.fireMouseEvent(faceEl.dom.children[3], 'mousemove');

                        expect(view.getMinutes()).toBe(20);

                        jasmine.fireMouseEvent(faceEl, 'mouseup');
                    });

                    it("should not update minutes value after dragging hoursEl", function() {
                        panel.setValue(500);

                        expect(view.getMinutes()).toBe(20);
                        expect(header.hoursEl).toHaveCls('active');

                        jasmine.fireMouseEvent(faceEl, 'mousedown');
                        jasmine.fireMouseEvent(faceEl, 'mousemove');

                        waitsForSpy(mouseMoveSpy);

                        runs(function() {
                            jasmine.fireMouseEvent(faceEl.dom.children[7], 'mouseup');
                            expect(view.getMinutes()).toBe(20);
                        });
                    });

                    it("should not fire select event after dragging in hour mode if confirmable == false", function() {
                        var spy = jasmine.createSpy('select');

                        panel.setConfirmable(false);
                        panel.on('select', spy);
                        panel.setValue(500);

                        expect(view.getMinutes()).toBe(20);
                        expect(header.hoursEl).toHaveCls('active');

                        jasmine.fireMouseEvent(faceEl, 'mousedown');
                        jasmine.fireMouseEvent(faceEl, 'mousemove');

                        waitsForSpy(mouseMoveSpy);

                        runs(function() {
                            jasmine.fireMouseEvent(faceEl.dom.children[7], 'mouseup');
                            expect(view.getMinutes()).toBe(20);
                            expect(spy).not.toHaveBeenCalled();
                        });
                    });

                    it("should not fire select event after dragging in hour mode if confirmable == true", function() {
                        var spy = jasmine.createSpy('select');

                        panel.setConfirmable(true);
                        panel.on('select', spy);
                        panel.setValue(500);

                        expect(view.getMinutes()).toBe(20);
                        expect(header.hoursEl).toHaveCls('active');

                        jasmine.fireMouseEvent(faceEl, 'mousedown');
                        jasmine.fireMouseEvent(faceEl, 'mousemove');

                        waitsForSpy(mouseMoveSpy);

                        runs(function() {
                            jasmine.fireMouseEvent(faceEl.dom.children[7], 'mouseup');
                            expect(view.getMinutes()).toBe(20);
                            expect(spy).not.toHaveBeenCalled();
                        });
                    });

                    it("should repaint after dragging hoursEl", function() {
                        panel.setValue(500);

                        spyOn(view, 'layoutFace').andCallThrough();

                        expect(header.hoursEl).toHaveCls('active');

                        jasmine.fireMouseEvent(faceEl, 'mousedown');
                        jasmine.fireMouseEvent(faceEl, 'mousemove');

                        waitsForSpy(mouseMoveSpy);

                        runs(function() {
                            jasmine.fireMouseEvent(faceEl.getLastChild(), 'mouseup');
                            expect(view.layoutFace).toHaveBeenCalled();
                        });
                    });

                    it("should repaint after calling activateMinutes method", function() {
                        panel.setValue(500);

                        spyOn(view, 'layoutFace').andCallThrough();

                        view.activateMinutes();

                        waitsForSpy(view.layoutFace);

                        runs(function() {
                            expect(view.layoutFace).toHaveBeenCalled();
                        });
                    });
                });

                describe("minutes", function() {
                    beforeEach(function() {
                        panel.setAutoAdvance(false);
                        view.activateMinutes();
                    });

                    it("should update minutes value while dragging in minute mode", function() {
                        panel.setValue(500);
                        expect(view.getMinutes()).toBe(20);

                        jasmine.fireMouseEvent(faceEl, 'mousedown');
                        jasmine.fireMouseEvent(faceEl.dom.children[29], 'mousemove');

                        expect(view.getMinutes()).toBe(30);

                        jasmine.fireMouseEvent(faceEl.dom.children[35], 'mousemove');

                        expect(view.getMinutes()).toBe(36);

                        jasmine.fireMouseEvent(faceEl, 'mouseup');
                    });

                    it("should not update hours value while dragging in minute mode", function() {
                        panel.setValue(500);
                        expect(view.getHours()).toBe(8);

                        jasmine.fireMouseEvent(faceEl, 'mousedown');
                        jasmine.fireMouseEvent(faceEl.dom.children[24], 'mousemove');

                        expect(view.getHours()).toBe(8);

                        jasmine.fireMouseEvent(faceEl.dom.children[35], 'mousemove');

                        expect(view.getHours()).toBe(8);

                        jasmine.fireMouseEvent(faceEl, 'mouseup');
                    });

                    it("should activate value under mouse while dragging in minute mode", function() {
                        panel.setValue(500);
                        expect(Ext.fly(faceEl.dom.children[29])).not.toHaveCls('active');

                        jasmine.fireMouseEvent(faceEl, 'mousedown');
                        jasmine.fireMouseEvent(faceEl.dom.children[29], 'mousemove');

                        expect(faceEl.dom.children[29]).toHaveCls('active');

                        jasmine.fireMouseEvent(faceEl.dom.children[35], 'mousemove');

                        expect(faceEl.dom.children[29]).not.toHaveCls('active');
                        expect(faceEl.dom.children[35]).toHaveCls('active');

                        jasmine.fireMouseEvent(faceEl, 'mouseup');
                    });

                    it("should redraw minute hand correctly while dragging in minute mode", function() {
                        panel.setValue(500);

                        jasmine.fireMouseEvent(faceEl.dom.children[20], 'mousedown');
                        jasmine.fireMouseEvent(faceEl.dom.children[20], 'mousemove');

                        waitsForAnimation();

                        runs(function() {
                            expect(view.handEl.dom.style['transform']).toBe('rotate(' + view.getAngleFromTime(21, 'minute') + 'deg)');
                            jasmine.fireMouseEvent(faceEl.dom.children[41], 'mousemove');
                        });

                        waitsForAnimation();

                        runs(function() {
                            expect(view.handEl.dom.style['transform']).toBe('rotate(' + view.getAngleFromTime(42, 'minute') + 'deg)');
                            jasmine.fireMouseEvent(faceEl, 'mouseup');
                        });
                    });

                    it("should set minutes value after dragging when minute mode is active", function() {
                        panel.setValue(0);
                        expect(view.getMinutes()).toBe(0);

                        jasmine.fireMouseEvent(faceEl, 'mousedown');
                        jasmine.fireMouseEvent(faceEl, 'mousemove');

                        waitsForSpy(mouseMoveSpy);

                        runs(function() {
                            jasmine.fireMouseEvent(faceEl.dom.children[9], 'mouseup');
                            expect(view.getMinutes()).toBe(10);
                        });
                    });

                    it("should fire select event after dragging in minute mode if confirmable == false", function() {
                        var spy = jasmine.createSpy('select');

                        panel.setConfirmable(false);
                        panel.on('select', spy);
                        panel.setValue(120);
                        expect(view.getMinutes()).toBe(0);

                        jasmine.fireMouseEvent(faceEl, 'mousedown');
                        jasmine.fireMouseEvent(faceEl.dom.children[3], 'mousemove');

                        waitsForSpy(mouseMoveSpy);

                        runs(function() {
                            jasmine.fireMouseEvent(faceEl.dom.children[18], 'mouseup');
                            expect(view.getMinutes()).toBe(19);

                            var args = spy.mostRecentCall.args,
                                wantDate = new Date(1970, 0, 1, 2, 19, 0);

                            expect(args[0]).toBe(panel);
                            expect(args[1].getTime()).toBe(wantDate.getTime());
                        });
                    });

                    it("should not fire select event after dragging in minute mode if confirmable == true", function() {
                        var spy = jasmine.createSpy('select');

                        panel.setConfirmable(true);
                        panel.on('select', spy);
                        panel.setValue(120);
                        expect(view.getMinutes()).toBe(0);

                        jasmine.fireMouseEvent(faceEl, 'mousedown');
                        jasmine.fireMouseEvent(faceEl.dom.children[3], 'mousemove');

                        waitsForSpy(mouseMoveSpy);

                        runs(function() {
                            jasmine.fireMouseEvent(faceEl.dom.children[18], 'mouseup');
                            expect(view.getMinutes()).toBe(19);
                            expect(spy).not.toHaveBeenCalled();
                        });
                    });

                    it("should update minutes value after dragging in minute mode", function() {
                        panel.setValue(500);
                        expect(view.getMinutes()).not.toBe(6);

                        jasmine.fireMouseEvent(faceEl, 'mousedown');
                        jasmine.fireMouseEvent(faceEl, 'mousemove');

                        waitsForSpy(mouseMoveSpy);

                        runs(function() {
                            jasmine.fireMouseEvent(faceEl.dom.children[5], 'mouseup');
                            expect(view.getMinutes()).toBe(6);
                        });
                    });

                    it("should not update hours value after dragging in minutes mode", function() {
                        panel.setValue(500);
                        expect(view.getHours()).toBe(8);

                        jasmine.fireMouseEvent(faceEl, 'mousedown');
                        jasmine.fireMouseEvent(faceEl, 'mousemove');

                        waitsForSpy(mouseMoveSpy);

                        runs(function() {
                            jasmine.fireMouseEvent(faceEl.dom.children[14], 'mouseup');
                            expect(view.getHours()).toBe(8);
                        });
                    });
                });
            });
        });
    });

    (Ext.supports.Touch ? describe : xdescribe)("touch interaction", function() {
        function doTouch(method, idx, cfg) {
            runs(function() {
                cfg = cfg || {};

                var el = Ext.fly(idx).el,
                    xy, dim, x, y, offsetX, offsetY;

                xy = el.getXY();
                dim = el.measure();

                x = cfg.x != null ? cfg.x : xy[0];
                y = cfg.y != null ? cfg.y : xy[1];

                offsetX = cfg.offsetX != null ? cfg.offsetX : Math.floor(dim.width / 2);
                offsetY = cfg.offsetY != null ? cfg.offsetY : Math.floor(dim.height / 2);

                Ext.testHelper[method](el, {
                    x: x + offsetX,
                    y: y + offsetY
                });

                waitsForAnimation();
            });
        }

        describe("header", function() {
            it("should set AM as true and it should be active on tap on AM", function() {
                panel.setValue(850);
                expect(view.getAm()).toBe(false);

                doTouch('tap', header.amEl);

                runs(function() {
                    expect(view.getAm()).toBe(true);
                    expect(header.pmEl).not.toHaveCls('active');
                    expect(header.amEl).toHaveCls('active');
                });
            });

            it("should set AM as false and PM should be active on tapping on PM", function() {
                panel.setValue(480);
                expect(view.getAm()).toBe(true);

                doTouch('tap', header.pmEl);

                runs(function() {
                    expect(view.getAm()).toBe(false);
                    expect(header.pmEl).toHaveCls('active');
                    expect(header.amEl).not.toHaveCls('active');
                });
            });

            it("should activate hours on tapping on hoursEl", function() {
                view.activateMinutes();

                expect(header.hoursEl).not.toHaveCls('active');
                expect(header.minutesEl).toHaveCls('active');

                doTouch('tap', header.hoursEl);

                runs(function() {
                    expect(header.hoursEl).toHaveCls('active');
                    expect(header.minutesEl).not.toHaveCls('active');
                });
            });

            it("should activate hours on tapping on minutesEl", function() {
                view.activateHours();

                expect(header.hoursEl).toHaveCls('active');
                expect(header.minutesEl).not.toHaveCls('active');

                doTouch('tap', header.minutesEl);

                runs(function() {
                    expect(header.hoursEl).not.toHaveCls('active');
                    expect(header.minutesEl).toHaveCls('active');
                });
            });
        });

        describe("face", function() {
            describe("tapping", function() {
                it("should update hours in hour mode", function() {
                    panel.setValue(700);
                    view.activateHours();

                    expect(view.getHours()).toBe(11);

                    doTouch('tap', faceEl.dom.children[5]);

                    runs(function() {
                        expect(view.getHours()).toBe(6);
                    });
                });

                it("should advance to minutes from hours mode", function() {
                    panel.setValue(500);
                    view.activateHours();

                    expect(view.getHours()).toBe(8);
                    expect(view.getMode()).toBe('hour');

                    doTouch('tap', faceEl.dom.children[9]);

                    runs(function() {
                        expect(view.getMode()).toBe('minute');
                    });
                });

                it("should not update minutes in hour mode", function() {
                    panel.setValue(700);
                    view.activateMinutes();

                    expect(view.getMinutes()).toBe(40);

                    doTouch('tap', faceEl.dom.children[7]);

                    runs(function() {
                        expect(view.getMinutes()).toBe(8);
                    });
                });

                it("should update minutes after tapping on value in minute mode", function() {
                    view.activateMinutes();
                    panel.setValue(600);
                    expect(view.getHours()).toBe(10);

                    doTouch('tap', faceEl.dom.children[41]);

                    runs(function() {
                        expect(view.getMinutes()).toBe(42);
                    });
                });

                it("should not update hours on tapping on value in minute mode", function() {
                    view.activateMinutes();
                    panel.setValue(700);
                    expect(view.getHours()).toBe(11);

                    doTouch('tap', faceEl.dom.children[17]);

                    runs(function() {
                        expect(view.getHours()).toBe(11);
                    });
                });
            });

            describe("dragging", function() {
                describe("hours", function() {
                    beforeEach(function() {
                        view.activateHours();
                    });

                    it("should activate minutes after dragging in hour mode", function() {
                        panel.setValue(1200);
                        expect(view.getHours()).toBe(20);

                        doTouch('touchStart', faceEl.dom.children[1]);
                        doTouch('touchMove', faceEl.dom.children[2]);
                        doTouch('touchEnd', faceEl.dom.children[3]);

                        runs(function() {
                            expect(view.getMode()).toBe('minute');
                        });
                    });

                    it("should set hour value after dragging", function() {
                        panel.setValue(1380);
                        expect(view.getHours()).toBe(23);

                        doTouch('touchStart', faceEl.dom.children[11]);
                        doTouch('touchMove', faceEl.dom.children[6]);
                        doTouch('touchEnd', faceEl.dom.children[8]);

                        runs(function() {
                            expect(view.getHours()).toBe(21);
                        });
                    });

                    it("should leave the last hour value if dragging ends outside of the view", function() {
                        panel.setValue(61);
                        expect(view.getHours()).toBe(1);

                        doTouch('touchStart', faceEl.dom.children[0]);
                        doTouch('touchMove', faceEl.dom.children[1]);
                        doTouch('touchMove', faceEl.dom.children[2]);
                        doTouch('touchMove', faceEl.dom.children[3], {
                            offsetX: 50,
                            offsetY: 50
                        });
                        doTouch('touchEnd', faceEl.dom.children[3], {
                            offsetX: 50,
                            offsetY: 50
                        });

                        runs(function() {
                            expect(view.getHours()).toBe(4);
                        });
                    });

                    it("should update hours while dragging in hour mode", function() {
                        panel.setValue(700);
                        expect(view.getHours()).toBe(11);

                        doTouch('touchStart', faceEl.dom.children[5]);
                        doTouch('touchMove', faceEl.dom.children[3]);

                        runs(function() {
                            expect(view.getHours()).toBe(4);
                            expect(faceEl.dom.children[3]).toHaveCls('active');
                        });

                        doTouch('touchMove', faceEl.dom.children[7]);

                        runs(function() {
                            expect(view.getHours()).toBe(8);
                            expect(faceEl.dom.children[7]).toHaveCls('active');
                        });

                        doTouch('touchEnd', faceEl);
                    });

                    it("should activate hour value under tap area while dragging", function() {
                        panel.setValue(300);
                        expect(view.getHours()).toBe(5);

                        doTouch('touchStart', faceEl.dom.children[7]);
                        doTouch('touchMove', faceEl.dom.children[7]);

                        runs(function() {
                            expect(faceEl.dom.children[7]).toHaveCls('active');
                        });

                        doTouch('touchMove', faceEl.dom.children[9]);

                        runs(function() {
                            expect(faceEl.dom.children[9]).toHaveCls('active');
                        });

                        doTouch('touchEnd', faceEl);
                    });

                    it("should redraw hour hand correctly while dragging", function() {
                        panel.setValue(242);
                        expect(view.getHours()).toBe(4);

                        doTouch('touchStart', faceEl.dom.children[1]);
                        doTouch('touchMove', faceEl.dom.children[1]);

                        runs(function() {
                            expect(view.handEl.dom.style['transform']).toBe('rotate(' + view.getAngleFromTime(2, 'hour') + 'deg)');
                        });

                        doTouch('touchMove', faceEl.dom.children[3]);

                        runs(function() {
                            expect(view.handEl.dom.style['transform']).toBe('rotate(' + view.getAngleFromTime(4, 'hour') + 'deg)');
                        });

                        doTouch('touchMove', faceEl.dom.children[5]);

                        runs(function() {
                            expect(view.handEl.dom.style['transform']).toBe('rotate(' + view.getAngleFromTime(6, 'hour') + 'deg)');
                        });

                        doTouch('touchEnd', faceEl);
                    });

                    it("should not update minutes while dragging in hour mode", function() {
                        panel.setValue(700);
                        expect(view.getMinutes()).toBe(40);

                        doTouch('touchStart', faceEl.dom.children[10]);
                        doTouch('touchMove', faceEl.dom.children[5]);

                        runs(function() {
                            expect(view.getMinutes()).toBe(40);
                        });
                    });
                });

                describe("minutes", function() {
                    beforeEach(function() {
                        view.activateMinutes();
                    });

                    it("should update minutes while dragging", function() {
                        panel.setValue(700);
                        expect(view.getMinutes()).toBe(40);

                        doTouch('touchStart', faceEl.dom.children[39]);
                        doTouch('touchMove', faceEl.dom.children[43]);

                        runs(function() {
                            expect(view.getMinutes()).toBe(44);
                        });

                        doTouch('touchMove', faceEl.dom.children[44]);

                        runs(function() {
                            expect(view.getMinutes()).toBe(45);
                        });

                        doTouch('touchMove', faceEl.dom.children[48]);

                        runs(function() {
                            expect(view.getMinutes()).toBe(49);
                        });

                        doTouch('touchMove', faceEl.dom.children[51]);

                        runs(function() {
                            expect(view.getMinutes()).toBe(52);
                        });

                        doTouch('touchEnd', faceEl);
                    });

                    it("should activate value under tap area while dragging", function() {
                        panel.setValue(42);
                        expect(view.getMinutes()).toBe(42);

                        doTouch('touchStart', faceEl.dom.children[13]);
                        doTouch('touchMove', faceEl.dom.children[14]);

                        runs(function() {
                            expect(faceEl.dom.children[13]).not.toHaveCls('active');
                            expect(faceEl.dom.children[14]).toHaveCls('active');
                        });

                        doTouch('touchMove', faceEl.dom.children[18]);

                        runs(function() {
                            expect(faceEl.dom.children[14]).not.toHaveCls('active');
                            expect(faceEl.dom.children[18]).toHaveCls('active');
                        });

                        doTouch('touchMove', faceEl.dom.children[23]);

                        runs(function() {
                            expect(faceEl.dom.children[18]).not.toHaveCls('active');
                            expect(faceEl.dom.children[23]).toHaveCls('active');
                        });

                        doTouch('touchEnd', faceEl);
                    });

                    it("should not update hours while dragging", function() {
                        panel.setValue(700);
                        expect(view.getHours()).toBe(11);

                        doTouch('touchStart', Ext.fly(faceEl.dom.children[5]));
                        doTouch('touchMove', Ext.fly(faceEl.dom.children[17]));
                        doTouch('touchEnd', faceEl.dom.children[23]);

                        runs(function() {
                            expect(view.getHours()).toBe(11);
                        });
                    });
                });
            });
        });
    });
});
