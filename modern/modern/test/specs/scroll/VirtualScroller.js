(Ext.isIE9m ? xdescribe : describe)('Ext.scroll.VirtualScroller', function() {
    var scrollbarWidth = Ext.getScrollbarSize().width,
        scrollbarHeight = Ext.getScrollbarSize().height,
        child1, child2, el, scroller, innerElement;

    function makeScroller(config) {
        scroller = new Ext.scroll.VirtualScroller(Ext.apply({
            element: el,
            autoRefresh: true
        }, config));
    }

    beforeEach(function() {
        el = Ext.getBody().createChild({
            style: 'height:100px;width:100px;'
        });
    });

    afterEach(function() {
        Ext.destroy(scroller, el, innerElement, child1, child2);
    });

    describe("innerElement", function() {
        it("should automatically wrap the content in an inner element", function() {
            el.appendChild({
                id: 'foo'
            }, true);

            el.appendChild({
                id: 'bar'
            }, true);

            makeScroller({
                indicators: false
            });

            innerElement = scroller.getInnerElement();

            expect(el.first()).toBe(innerElement);
            expect(Ext.fly('foo').parent()).toBe(innerElement);
            expect(Ext.fly('bar').parent()).toBe(innerElement);
        });

        it("should wrap the content in an inner element when the first child is a text node", function() {
            el.setHtml('foo');

            makeScroller();

            innerElement = scroller.getInnerElement();
            expect(innerElement.dom.textContent).toBe('foo');
        });

        it("should not wrap the content if an innerElement was provided in the initial config", function() {
            innerElement = el.appendChild({});

            makeScroller({
                innerElement: innerElement
            });

            expect(scroller.getInnerElement()).toBe(innerElement);

            innerElement.destroy();
        });

        describe("configuring", function() {
            it("should accept an HTMLElement", function() {
                innerElement = document.createElement('div');
                el.dom.appendChild(innerElement);

                makeScroller({
                    innerElement: innerElement
                });

                innerElement = Ext.get(innerElement);

                expect(scroller.getInnerElement().isElement).toBe(true);
                expect(scroller.getInnerElement()).toBe(innerElement);
            });

            it("should accept an Element ID", function() {
                innerElement = document.createElement('div');
                innerElement.id = 'theScrollerEl';
                el.dom.appendChild(innerElement);

                makeScroller({
                    innerElement: 'theScrollerEl'
                });

                innerElement = Ext.get(innerElement);

                expect(scroller.getInnerElement().isElement).toBe(true);
                expect(scroller.getInnerElement()).toBe(innerElement);
            });

            it("should accept an Ext.dom.Element", function() {
                innerElement = el.createChild();

                makeScroller({
                    innerElement: innerElement
                });

                expect(scroller.getInnerElement()).toBe(innerElement);
            });

            it("should throw an error if element with given id not found", function() {
                expect(function() {
                    makeScroller({
                        innerElement: 'foobarelement'
                    });
                }).toThrow("Cannot create Ext.scroll.VirtualScroller with null innerElement");
            });
        });
    });

    describe("css classes", function() {
        it("should add the 'x-virtualscroller' class to the element", function() {
            makeScroller();
            expect(el).toHaveCls('x-virtualscroller');
        });

        it("should add the 'x-scroller-inner' class to a generated innerElement", function() {
            makeScroller();
            expect(scroller.getInnerElement()).toHaveCls('x-scroller-inner');
        });

        it("should add the 'x-scroller-inner' class to a configured innerElement", function() {
            innerElement = el.createChild();
            makeScroller({
                innerElement: innerElement
            });

            expect(scroller.getInnerElement()).toHaveCls('x-scroller-inner');
            innerElement.destroy();
        });
    });

    describe("x", function() {
        function makeOverflow(cfg) {
            el.appendChild({
                style: 'height:100px;width:200px;'
            }, true);

            makeScroller(cfg);
        }

        function makeNoOverflow(cfg) {
            el.appendChild({
                style: 'height:100px;width:100px;'
            }, true);

            makeScroller(cfg);
        }

        it("should enable the x axis by default if content overflows horizontally", function() {
            makeOverflow();

            expect(scroller.isAxisEnabled('x')).toBe(true);
        });

        it("should not enable the x axis by default if content does not overflow horizontally", function() {
            makeNoOverflow();

            expect(scroller.isAxisEnabled('x')).toBe(false);
        });

        it("should enable the x axis when x is true if content overflows horizontally", function() {
            makeOverflow({
                x: true
            });

            expect(scroller.isAxisEnabled('x')).toBe(true);
        });

        it("should not enable the x axis when x is true if content does not overflow horizontally", function() {
            makeNoOverflow({
                x: true
            });

            expect(scroller.isAxisEnabled('x')).toBe(false);
        });

        it("should enable the x axis when x is 'auto' if content overflows horizontally", function() {
            makeOverflow({
                x: 'auto'
            });

            expect(scroller.isAxisEnabled('x')).toBe(true);
        });

        it("should not enable the x axis when x is 'auto' if content does not overflow horizontally", function() {
            makeNoOverflow({
                x: 'auto'
            });

            expect(scroller.isAxisEnabled('x')).toBe(false);
        });

        it("should enable the x axis when x is 'scroll' if content overflows horizontally", function() {
            makeOverflow({
                x: 'scroll'
            });

            expect(scroller.isAxisEnabled('x')).toBe(true);
        });

        it("should enable the x axis when x is 'scroll' if content does not overflow horizontally", function() {
            makeNoOverflow({
                x: 'scroll'
            });

            expect(scroller.isAxisEnabled('x')).toBe(true);
        });

        it("should not enable the x axis when x is false if content overflows horizontally", function() {
            makeOverflow({
                x: false
            });

            expect(scroller.isAxisEnabled('x')).toBe(false);
        });

        it("should not enable the x axis when x is false if content does not overflow horizontally", function() {
            makeNoOverflow({
                x: false
            });

            expect(scroller.isAxisEnabled('x')).toBe(false);
        });

        it("should disable the x axis when moving from true to false", function() {
            makeOverflow({
                x: true
            });

            scroller.setX(false);

            expect(scroller.isAxisEnabled('x')).toBe(false);
        });

        it("should enable the x axis when moving from false to true", function() {
            makeOverflow({
                x: false
            });

            scroller.setX(true);

            expect(scroller.isAxisEnabled('x')).toBe(true);
        });
    });

    describe("y", function() {
        function makeOverflow(cfg) {
            el.appendChild({
                style: 'height:200px;width:100px;'
            }, true);

            makeScroller(cfg);
        }

        function makeNoOverflow(cfg) {
            el.appendChild({
                style: 'height:100px;width:100px;'
            }, true);

            makeScroller(cfg);
        }

        it("should enable the y axis by default if content overflows vertically", function() {
            makeOverflow();

            expect(scroller.isAxisEnabled('y')).toBe(true);
        });

        it("should not enable the y axis by default if content does not overflow vertically", function() {
            makeNoOverflow();

            expect(scroller.isAxisEnabled('y')).toBe(false);
        });

        it("should enable the y axis when y is true if content overflows vertically", function() {
            makeOverflow({
                y: true
            });

            expect(scroller.isAxisEnabled('y')).toBe(true);
        });

        it("should not enable the y axis when y is true if content does not overflow vertically", function() {
            makeNoOverflow({
                y: true
            });

            expect(scroller.isAxisEnabled('y')).toBe(false);
        });

        it("should enable the y axis when y is 'auto' if content overflows vertically", function() {
            makeOverflow({
                y: 'auto'
            });

            expect(scroller.isAxisEnabled('y')).toBe(true);
        });

        it("should not enable the y axis when y is 'auto' if content does not overflow vertically", function() {
            makeNoOverflow({
                y: 'auto'
            });

            expect(scroller.isAxisEnabled('y')).toBe(false);
        });

        it("should enable the y axis when y is 'scroll' if content overflows vertically", function() {
            makeOverflow({
                y: 'scroll'
            });

            expect(scroller.isAxisEnabled('y')).toBe(true);
        });

        it("should enable the y axis when y is 'scroll' if content does not overflow vertically", function() {
            makeNoOverflow({
                y: 'scroll'
            });

            expect(scroller.isAxisEnabled('y')).toBe(true);
        });

        it("should not enable the y axis when y is false if content overflows vertically", function() {
            makeOverflow({
                y: false
            });

            expect(scroller.isAxisEnabled('y')).toBe(false);
        });

        it("should not enable the y axis when y is false if content does not overflow vertically", function() {
            makeNoOverflow({
                y: false
            });

            expect(scroller.isAxisEnabled('y')).toBe(false);
        });

        it("should disable the y axis when moving from true to false", function() {
            makeOverflow({
                y: true
            });

            scroller.setY(false);

            expect(scroller.isAxisEnabled('y')).toBe(false);
        });

        it("should enable the y axis when moving from false to true", function() {
            makeOverflow({
                y: false
            });

            scroller.setY(true);

            expect(scroller.isAxisEnabled('y')).toBe(true);
        });
    });

    describe("direction", function() {
        it("should set x:true and y:true when direction is 'auto'", function() {
            makeScroller({
                direction: 'auto'
            });

            expect(scroller.getX()).toBe(true);
            expect(scroller.getY()).toBe(true);
        });

        it("should set x:'scroll' and y:'scroll' direction is 'both'", function() {
            makeScroller({
                direction: 'both'
            });

            expect(scroller.getX()).toBe('scroll');
            expect(scroller.getY()).toBe('scroll');
        });

        it("should set y:true when direction is 'vertical'", function() {
            makeScroller({
                direction: 'vertical'
            });

            expect(scroller.getX()).toBe(false);
            expect(scroller.getY()).toBe(true);
        });

        it("should set x:true on the element when direction is 'horizontal'", function() {
            makeScroller({
                direction: 'horizontal'
            });

            expect(scroller.getX()).toBe(true);
            expect(scroller.getY()).toBe(false);
        });
    });

    describe("getSize", function() {
        beforeEach(function() {
            el.appendChild({
                style: 'height:200px;width:300px;'
            }, true);
        });

        it("should return the content size with x:auto and y:auto", function() {
            makeScroller();
            expect(scroller.getSize()).toEqual({
                x: 300,
                y: 200
            });
        });

        it("should return the content size with x:scroll and y:scroll", function() {
            makeScroller({
                x: 'scroll',
                y: 'scroll'
            });
            expect(scroller.getSize()).toEqual({
                x: 300,
                y: 200
            });
        });

        it("should return the content size with x:false and y:false", function() {
            makeScroller({
                x: false,
                y: false
            });

            expect(scroller.getSize()).toEqual({
                x: 300,
                y: 200
            });
        });

        it("should return the content size with x:false and y:auto", function() {
            makeScroller({
                x: false,
                y: true
            });

            expect(scroller.getSize()).toEqual({
                x: 300,
                y: 200
            });
        });

        it("should return the content size with x:auto and y:false", function() {
            makeScroller({
                x: true,
                y: false
            });

            expect(scroller.getSize()).toEqual({
                x: 300,
                y: 200
            });
        });

        it("should return the content size with x:false and y:scroll", function() {
            makeScroller({
                x: false,
                y: 'scroll'
            });

            expect(scroller.getSize()).toEqual({
                x: 300,
                y: 200
            });
        });

        it("should return the content size with x:scroll and y:false", function() {
            makeScroller({
                x: 'scroll',
                y: false
            });

            expect(scroller.getSize()).toEqual({
                x: 300,
                y: 200
            });
        });

        it("should allow absolutely positioned elements to contribute to the size", function() {
            child1 = el.appendChild({
                style: 'position:absolute;height:50px;width:50px;left:400px;top:0px;'
            });

            child2 = el.appendChild({
                style: 'position:absolute;height:50px;width:50px;top:500px;left:0px;'
            });

            makeScroller();

            expect(scroller.getSize()).toEqual({
                x: 450,
                y: 550
            });
        });
    });

    describe("setSize", function() {
        it("should set the size", function() {
            makeScroller();
            scroller.setSize({
                x: 300,
                y: 200
            });

            expect(scroller.getSize()).toEqual({
                x: 300,
                y: 200
            });
        });

        it("should unset the size", function() {
            makeScroller();
            scroller.setSize({
                x: 300,
                y: 200
            });

            scroller.setSize(null);

            expect(scroller.getSize()).toEqual({
                x: 100,
                y: 100
            });
        });

        it("should set the size on both axes to a single number", function() {
            makeScroller();
            scroller.setSize(200);

            expect(scroller.getSize()).toEqual({
                x: 200,
                y: 200
            });
        });

        it("should set the x size", function() {
            makeScroller();
            scroller.setSize({
                x: 200
            });

            expect(scroller.getSize()).toEqual({
                x: 200,
                y: 100
            });
        });

        it("should set the y size", function() {
            makeScroller();
            scroller.setSize({
                y: 200
            });

            expect(scroller.getSize()).toEqual({
                x: 100,
                y: 200
            });
        });
    });

    describe("getClientSize", function() {
        beforeEach(function() {
            el.destroy();

            el = Ext.getBody().createChild({
                style: {
                    height: '200px',
                    width: '200px',
                    borderColor: 'red',
                    borderStyle: 'solid',
                    borderWidth: '10px 20px',
                    padding: '30px 40px'
                }
            });
        });

        function makeNumbers() {
            var content = [],
                i;

            for (i = 0; i < 100; ++i) {
                content.push(i);
            }

            return content;
        }

        it("should return the clientWidth of the element", function() {
            el.setHtml(makeNumbers().join('<br />'));

            makeScroller();

            var size = scroller.getClientSize();

            expect(size.x).toBe(200 - (20 * 2) - scrollbarWidth);
            expect(size.y).toBe(200 - (10 * 2));
        });

        it("should return the clientHeight of the element", function() {
            el.setHtml(makeNumbers().join(''));

            makeScroller();

            var size = scroller.getClientSize();

            expect(size.x).toBe(200 - (20 * 2));
            expect(size.y).toBe(200 - (10 * 2) - scrollbarHeight);
        });

        it("should read by the clientWidth and clientHeight of the element", function() {
            var content = makeNumbers();

            content[0] = makeNumbers().join('');

            el.setHtml(content.join('<br />'));

            makeScroller();

            var size = scroller.getClientSize();

            expect(size.x).toBe(200 - (20 * 2) - scrollbarWidth);
            expect(size.y).toBe(200 - (10 * 2) - scrollbarHeight);
        });
    });

    describe("scrollTo", function() {
        function makeOverflow(cfg) {
            el.appendChild({
                style: 'height:200px;width:300px;'
            }, true);

            makeScroller(cfg);
        }

        function makeNoOverflow(cfg) {
            el.appendChild({
                style: 'height:100px;width:100px;'
            }, true);

            makeScroller(cfg);
        }

        it("should scroll on the x axis", function() {
            makeOverflow();

            scroller.scrollTo(50, 0);

            expect(scroller.getPosition()).toEqual({
                x: 50,
                y: 0
            });
        });

        it("should scroll on the x axis when the x axis is disabled", function() {
            makeOverflow({
                x: false
            });

            scroller.scrollTo(50, 0);

            expect(scroller.getPosition()).toEqual({
                x: 50,
                y: 0
            });
        });

        it("should not scroll on the x axis if the content does not overflow horizontally", function() {
            makeNoOverflow();

            scroller.scrollTo(50, 0);

            expect(scroller.getPosition()).toEqual({
                x: 0,
                y: 0
            });
        });

        it("should constrain to the max x position", function() {
            makeOverflow();

            scroller.scrollTo(250, 0);

            expect(scroller.getPosition()).toEqual({
                x: 200 + scrollbarWidth,
                y: 0
            });
        });

        it("should scroll on the y axis", function() {
            makeOverflow();

            scroller.scrollTo(0, 50);

            expect(scroller.getPosition()).toEqual({
                x: 0,
                y: 50
            });
        });

        it("should scroll on the y axis when the y axis is disabled", function() {
            makeOverflow({
                y: false
            });

            scroller.scrollTo(0, 50);

            expect(scroller.getPosition()).toEqual({
                x: 0,
                y: 50
            });
        });

        it("should not scroll on the y axis if the content does not overflow vertically", function() {
            makeNoOverflow();

            scroller.scrollTo(0, 50);

            expect(scroller.getPosition()).toEqual({
                x: 0,
                y: 0
            });
        });

        it("should constrain to the max y position", function() {
            makeOverflow();

            scroller.scrollTo(0, 250);

            expect(scroller.getPosition()).toEqual({
                x: 0,
                y: 100 + scrollbarHeight
            });
        });

        it("should scroll on both axes", function() {
            makeOverflow();

            scroller.scrollTo(50, 60);

            expect(scroller.getPosition()).toEqual({
                x: 50,
                y: 60
            });
        });

        it("should constrain to max x and y", function() {
            makeOverflow();

            scroller.scrollTo(300, 300);

            expect(scroller.getPosition()).toEqual({
                x: 200 + scrollbarWidth,
                y: 100 + scrollbarHeight
            });
        });

        it("should scroll to max x using Infinity", function() {
            makeOverflow();

            scroller.scrollTo(Infinity, 0);

            expect(scroller.getPosition()).toEqual({
                x: 200 + scrollbarWidth,
                y: 0
            });
        });

        it("should scroll to max y using Infinity", function() {
            makeOverflow();

            scroller.scrollTo(0, Infinity);

            expect(scroller.getPosition()).toEqual({
                x: 0,
                y: 100 + scrollbarHeight
            });
        });

        it("should scroll to max x and y using Infinity", function() {
            makeOverflow();

            scroller.scrollTo(Infinity, Infinity);

            expect(scroller.getPosition()).toEqual({
                x: 200 + scrollbarWidth,
                y: 100 + scrollbarHeight
            });
        });

        it("should ignore x if null is passed", function() {
            makeOverflow();

            scroller.scrollTo(10, 10);

            scroller.scrollTo(null, 20);

            expect(scroller.getPosition()).toEqual({
                x: 10,
                y: 20
            });
        });

        it("should ignore y if null is passed", function() {
            makeOverflow();

            scroller.scrollTo(10, 10);

            scroller.scrollTo(20, null);

            expect(scroller.getPosition()).toEqual({
                x: 20,
                y: 10
            });
        });

        it("should ignore x and y if both null", function() {
            makeOverflow();

            scroller.scrollTo(10, 10);

            scroller.scrollTo(null, null);

            expect(scroller.getPosition()).toEqual({
                x: 10,
                y: 10
            });
        });

        it("should scroll to negative offset from max x", function() {
            makeOverflow();

            scroller.scrollTo(-20, 0);

            expect(scroller.getPosition()).toEqual({
                x: 180 + scrollbarWidth,
                y: 0
            });
        });

        it("should scroll to negative offset from max y", function() {
            makeOverflow();

            scroller.scrollTo(0, -20);

            expect(scroller.getPosition()).toEqual({
                x: 0,
                y: 80 + scrollbarHeight
            });
        });

        it("should scroll to negative offset from max x and y", function() {
            makeOverflow();

            scroller.scrollTo(-20, -20);

            expect(scroller.getPosition()).toEqual({
                x: 180 + scrollbarWidth,
                y: 80 + scrollbarHeight
            });
        });

        it('should fire scrollstart and scrollend', function() {
            var scrollStartFired = 0,
                scrollEndFired = 0;

            makeOverflow();
            scroller.on({
                scrollstart: function() {
                    scrollStartFired++;
                },
                scrollend: function() {
                    scrollEndFired++;
                }
            });
            scroller.scrollTo(20, 20);

            // Wait for scroll to finish. We must wait for any extraneous
            // events to fire. Each should only fire once.
            waits(50);
            runs(function() {
                expect(scrollStartFired).toBe(1);
                expect(scrollEndFired).toBe(1);
            });
        });

        it('should fire scrollstart and scrollend when animated', function() {
            var scrollStartFired = 0,
                scrollEndFired = 0;

            makeOverflow();
            scroller.on({
                scrollstart: function() {
                    scrollStartFired++;
                },
                scrollend: function() {
                    scrollEndFired++;
                }
            });
            scroller.scrollTo(20, 20, true);

            // Wait for scroll animation to finish. We must wait for any extraneous
            // events to fire. Each should only fire once.
            waits(1000);
            runs(function() {
                expect(scrollStartFired).toBe(1);
                expect(scrollEndFired).toBe(1);
            });
        });

        // disabled because it fails intermittently
        xit('should fire scrollstart and scrollend when animated and scroll is terminated using a tap gesture', function() {
            var scrollStartFired = 0,
                scrollEndFired = 0;

            makeOverflow();
            scroller.on({
                scrollstart: function() {
                    scrollStartFired++;
                },
                scrollend: function() {
                    scrollEndFired++;
                }
            });
            scroller.scrollTo(20, 20, true);

            // Wait for scroll animation to begin.
            // We want to interrupt a running animation.
            waits(10);
            runs(function() {
                var el = scroller.getElement();

                // Scroll should have started but not ended
                expect(scrollStartFired).toBe(1);
                expect(scrollEndFired).toBe(0);

                // tap to stop the scroll
                Ext.testHelper.touchStart(el, {
                    id: el.id,
                    x: 50,
                    y: 50
                });
                Ext.testHelper.touchEnd(el, {
                    id: el.id,
                    x: 50,
                    y: 50
                });

                // Scroll should have stopped
                expect(scrollEndFired).toBe(1);
            });
        });
    });

    describe("scrollBy", function() {
        beforeEach(function() {
            el.appendChild({
                style: 'height:200px;width:300px;'
            }, true);
        });

        it("should set the scroll position", function() {
            makeScroller();

            scroller.scrollTo(20, 10);

            expect(scroller.getPosition()).toEqual({
                x: 20,
                y: 10
            });

            scroller.scrollBy(-10, -5);

            expect(scroller.getPosition()).toEqual({
                x: 10,
                y: 5
            });
        });

        it("should ignore x if null is passed", function() {
            makeScroller();

            scroller.scrollTo(10, 10);

            scroller.scrollBy(null, 10);

            expect(scroller.getPosition()).toEqual({
                x: 10,
                y: 20
            });
        });

        it("should ignore y if null is passed", function() {
            makeScroller();

            scroller.scrollTo(10, 10);

            scroller.scrollBy(10, null);

            expect(scroller.getPosition()).toEqual({
                x: 20,
                y: 10
            });
        });

        it("should ignore x and y if both null", function() {
            makeScroller();

            scroller.scrollTo(10, 10);

            scroller.scrollBy(null, null);

            expect(scroller.getPosition()).toEqual({
                x: 10,
                y: 10
            });
        });

        it("should constrain to the max x position", function() {
            makeScroller();

            scroller.scrollBy(250, 0);

            expect(scroller.getPosition()).toEqual({
                x: 200 + scrollbarWidth,
                y: 0
            });
        });

        it("should constrain to the min x position", function() {
            makeScroller();

            scroller.scrollBy(-10, 0);

            expect(scroller.getPosition()).toEqual({
                x: 0,
                y: 0
            });
        });

        it("should constrain to the max y position", function() {
            makeScroller();

            scroller.scrollBy(0, 250);

            expect(scroller.getPosition()).toEqual({
                x: 0,
                y: 100 + scrollbarHeight
            });
        });

        it("should constrain to the min y position", function() {
            makeScroller();

            scroller.scrollBy(0, -10);

            expect(scroller.getPosition()).toEqual({
                x: 0,
                y: 0
            });
        });

        it("should constrain to max x and y", function() {
            makeScroller();

            scroller.scrollBy(300, 300);

            expect(scroller.getPosition()).toEqual({
                x: 200 + scrollbarWidth,
                y: 100 + scrollbarHeight
            });
        });

        it("should constrain to min x and y", function() {
            makeScroller();

            scroller.scrollBy(-10, -10);

            expect(scroller.getPosition()).toEqual({
                x: 0,
                y: 0
            });
        });
    });

    describe("getMaxPosition and getMaxUserPosition", function() {
        beforeEach(function() {
            el.appendChild({
                style: 'height:200px;width:300px;'
            }, true);
        });

        describe("with x:true and y:true", function() {
            beforeEach(function() {
                makeScroller();
            });

            it("should return the maxPosition", function() {
                expect(scroller.getMaxPosition()).toEqual({
                    x: 200 + scrollbarWidth,
                    y: 100 + scrollbarHeight
                });
            });

            it("should return the maxUserPosition", function() {
                expect(scroller.getMaxUserPosition()).toEqual({
                    x: 200 + scrollbarWidth,
                    y: 100 + scrollbarHeight
                });
            });
        });

        describe("with x:true and y:false", function() {
            beforeEach(function() {
                makeScroller({
                    x: true,
                    y: false
                });
            });

            it("should return the maxPosition", function() {
                expect(scroller.getMaxPosition()).toEqual({
                    x: 200,
                    y: 100 + scrollbarHeight
                });
            });

            it("should return the maxUserPosition", function() {
                expect(scroller.getMaxUserPosition()).toEqual({
                    x: 200,
                    y: 0
                });
            });
        });

        describe("with x:false and y:true", function() {
            beforeEach(function() {
                makeScroller({
                    x: false,
                    y: true
                });
            });

            it("should return the maxPosition", function() {
                expect(scroller.getMaxPosition()).toEqual({
                    x: 200 + scrollbarWidth,
                    y: 100
                });
            });

            it("should return the maxUserPosition", function() {
                expect(scroller.getMaxUserPosition()).toEqual({
                    x: 0,
                    y: 100
                });
            });
        });

        describe("with x:false and y:false", function() {
            beforeEach(function() {
                makeScroller({
                    x: false,
                    y: false
                });
            });

            it("should return the maxPosition", function() {
                expect(scroller.getMaxPosition()).toEqual({
                    x: 200,
                    y: 100
                });
            });

            it("should return the maxUserPosition", function() {
                expect(scroller.getMaxUserPosition()).toEqual({
                    x: 0,
                    y: 0
                });
            });
        });
    });

    describe("partnership", function() {
        var el2, el3, scroller2, scroller3;

        function makeScroller2() {
             el2 = Ext.getBody().createChild({
                style: 'height:100px;width:100px;',
                cn: [{
                    style: 'height:200px;width:300px;'
                }]
            });

            scroller2 = new Ext.scroll.VirtualScroller({
                element: el2,
                autoRefresh: true
            });
        }

        function makeScroller3() {
            el3 = Ext.getBody().createChild({
                style: 'height:100px;width:100px;',
                cn: [{
                    style: 'height:200px;width:300px;'
                }]
            });

            scroller3 = new Ext.scroll.VirtualScroller({
                element: el3,
                autoRefresh: true
            });
        }

        beforeEach(function() {
            el.appendChild({
                style: 'height:200px;width:300px;'
            }, true);

            makeScroller();
        });

        afterEach(function() {
            if (scroller2) {
                scroller2.destroy();
                scroller2 = null;
            }

            if (scroller3) {
                scroller3.destroy();
                scroller3 = null;
            }

            if (el2) {
                el2.destroy();
                el2 = null;
            }

            if (el3) {
                el3.destroy();
                el3 = null;
            }
        });

        describe("single partner", function() {
            beforeEach(function() {
                makeScroller2();
            });

            describe("both axes enabled", function() {
                beforeEach(function() {
                    scroller.addPartner(scroller2);
                });

                it("should sync the partner's scroll position when the scroller is scrolled", function() {
                    // The partner should take action upon scroll start and end
                    spyOn(scroller2, 'fireScrollStart').andCallThrough();
                    spyOn(scroller2, 'fireScrollEnd').andCallThrough();

                    scroller.scrollTo(10, 20);

                    expect(scroller2.getPosition()).toEqual({
                        x: 10,
                        y: 20
                    });

                    // The passive side should also have fired its start and end scroll events
                    expect(scroller2.fireScrollStart.callCount).toBe(1);
                    expect(scroller2.fireScrollEnd.callCount).toBe(1);
                });

                it("should sync the scroller's scroll position when the partner is scrolled", function() {
                    // The scroller should take action upon scroll start and end
                    spyOn(scroller, 'fireScrollStart').andCallThrough();
                    spyOn(scroller, 'fireScrollEnd').andCallThrough();

                    scroller2.scrollTo(10, 20);

                    expect(scroller.getPosition()).toEqual({
                        x: 10,
                        y: 20
                    });

                    // The passive side should also have fired its start and end scroll events
                    expect(scroller.fireScrollStart.callCount).toBe(1);
                    expect(scroller.fireScrollEnd.callCount).toBe(1);
                });
            });

            describe("x-axis only", function() {
                beforeEach(function() {
                    scroller.addPartner(scroller2, 'x');
                });

                it("should sync the partner's scroll position when the scroller is scrolled", function() {
                    scroller.scrollTo(10, 20);

                    expect(scroller2.getPosition()).toEqual({
                        x: 10,
                        y: 0
                    });
                });

                it("should sync the scroller's scroll position when the partner is scrolled", function() {
                    scroller2.scrollTo(10, 20);

                    expect(scroller.getPosition()).toEqual({
                        x: 10,
                        y: 0
                    });
                });
            });

            describe("y-axis only", function() {
                beforeEach(function() {
                    scroller.addPartner(scroller2, 'y');
                });

                it("should sync the partner's scroll position when the scroller is scrolled", function() {
                    scroller.scrollTo(10, 20);

                    expect(scroller2.getPosition()).toEqual({
                        x: 0,
                        y: 20
                    });
                });

                it("should sync the scroller's scroll position when the partner is scrolled", function() {
                    scroller2.scrollTo(10, 20);

                    expect(scroller.getPosition()).toEqual({
                        x: 0,
                        y: 20
                    });
                });
            });

            it("should remove the partner", function() {
                scroller.addPartner(scroller2);
                scroller.removePartner(scroller2);

                scroller.scrollTo(10, 20);

                expect(scroller2.getPosition()).toEqual({
                    x: 0,
                    y: 0
                });

                scroller2.scrollTo(40, 30);

                expect(scroller.getPosition()).toEqual({
                    x: 10,
                    y: 20
                });
            });
        });

        describe("multiple partners", function() {
            beforeEach(function() {
                makeScroller2();
                makeScroller3();

                scroller.addPartner(scroller2);
                scroller.addPartner(scroller3);
            });

            it("should sync multiple partners when the scroller is scrolled", function() {
                scroller.scrollTo(10, 15);

                expect(scroller2.getPosition()).toEqual({
                    x: 10,
                    y: 15
                });

                expect(scroller3.getPosition()).toEqual({
                    x: 10,
                    y: 15
                });
            });

            it("should sync scroll position when a partner is scrolled", function() {
                scroller2.scrollTo(50, 60);

                expect(scroller.getPosition()).toEqual({
                    x: 50,
                    y: 60
                });
            });

            it("should remove a partner", function() {
                scroller.removePartner(scroller2);

                scroller2.scrollTo(15, 20);

                expect(scroller.getPosition()).toEqual({
                    x: 0,
                    y: 0
                });

                // scroller3 still attached
                scroller3.scrollTo(30, 45);

                expect(scroller.getPosition()).toEqual({
                    x: 30,
                    y: 45
                });
            });
        });
    });

    describe("refresh", function() {
        // change content size
        // change container size
        //

    });

    (Ext.supports.Touch && !scrollbarWidth ? describe : xdescribe)("interaction", function() {
        var helper = Ext.testHelper;

        function start(cfg, element) {
            cfg.id = 1;
            helper.touchStart(element || el, cfg);
        }

        function move(cfg, element) {
            cfg.id = 1;
            helper.touchMove(element || el, cfg);
        }

        function end(cfg, element) {
            cfg.id = 1;
            helper.touchEnd(element || el, cfg);
        }

        function expectScrollPosition(position, testScroller) {
            if (!testScroller) {
                testScroller = scroller;
            }
            var innerElXY = testScroller.getInnerElement().getOffsetsTo(testScroller.getElement());

            expect(-innerElXY[0]).toBe(position.x);
            expect(-innerElXY[1]).toBe(position.y);
        }

        function makeScroller(config, newElement) {
            var scrollerEl,
                newScroller;

            if (newElement) {
                scrollerEl = Ext.getBody().createChild({
                    style: 'height:100px;width:100px;'
                });
            }
            else {
                scrollerEl = el;
            }

            scrollerEl.appendChild({
                style: 'height:200px;width:200px;'
            }, true);

            newScroller = new Ext.scroll.VirtualScroller(Ext.apply({
                element: scrollerEl,
                autoRefresh: true
            }, config));

            if (!newElement) {
                scroller = newScroller;
                innerElement = scroller.getInnerElement();
            }

            return newScroller;
        }

        describe('synchronizing partners', function() {
            var scroller1, scroller2;

            afterEach(function() {
                Ext.destroy(scroller2._element, scroller1, scroller2);
            });

            it("should sync the partner's scroll position when the scroller is scrolled", function() {
                scroller1 = makeScroller();
                scroller2 = makeScroller(null, true);
                scroller1.addPartner(scroller2);

                // The partner should take action upon scroll start and end
                spyOn(scroller2, 'fireScrollStart').andCallThrough();
                spyOn(scroller2, 'fireScrollEnd').andCallThrough();

                runs(function() {
                    start({ x: 50, y: 50 }, scroller1.getElement());
                    move({ x: 50, y: 40 }, scroller1.getElement());
                    end({ x: 50, y: 40 }, scroller1.getElement());

                    // Both should have indicated that they are scrolling
                    expect(scroller1.isScrolling).toBe(true);
                    expect(scroller2.isScrolling).toBe(true);
                });

                // Wait for the whole thing to settle down and declare itself finished
                waitsFor(function() {
                    return !(scroller1.isScrolling || scroller2.isScrolling);
                }, 'both scrollers to finish scrolling');

                // Then check synchronization conditions, and the the correct call sequences have been followed
                runs(function() {
                    expectScrollPosition({ x: 0, y: scroller1.getPosition().y }, scroller2);

                    // The passive side should also have fired its start and end scroll events
                    expect(scroller2.fireScrollStart.callCount).toBe(1);
                    expect(scroller2.fireScrollEnd.callCount).toBe(1);
                });
            });
        });

        describe("x:'auto' and y:'auto'", function() {
            it("should size to the content", function() {
                makeScroller();

                expect(scroller.getSize()).toEqual({
                    x: 200,
                    y: 200
                });
            });

            it("should allow scrolling in the vertical direction", function() {
                makeScroller();

                runs(function() {
                    start({ x: 50, y: 50 });
                    move({ x: 50, y: 40 });
                });

                waitsForAnimation();

                runs(function() {
                    expectScrollPosition({ x: 0, y: 10 });
                    end({ x: 50, y: 40 });
                });

                waitsForAnimation();
            });

            it("should allow scrolling in the horizontal direction", function() {
                makeScroller();

                runs(function() {
                    start({ x: 50, y: 50 });
                    move({ x: 40, y: 50 });
                });

                waitsForAnimation();

                runs(function() {
                    expectScrollPosition({ x: 10, y: 0 });
                    end({ x: 40, y: 50 });
                });

                waitsForAnimation();
            });

            it("should allow scrolling in both directions simultaneously", function() {
                makeScroller();

                runs(function() {
                    start({ x: 50, y: 50 });
                    move({ x: 40, y: 40 });
                });

                waitsForAnimation();

                runs(function() {
                    expectScrollPosition({ x: 10, y: 10 });
                    end({ x: 40, y: 40 });
                });

                waitsForAnimation();
            });

            describe("stretch", function() {
                it("should allow stretching past the top scroll boundary", function() {
                    makeScroller();

                    runs(function() {
                        start({ x: 50, y: 50 });
                        move({ x: 50, y: 60 });
                    });

                    waitsForAnimation();

                    runs(function() {
                        expectScrollPosition({ x: 0, y: -5 });
                        end({ x: 50, y: 60 });
                    });

                    waitsForAnimation();
                });

                it("should allow stretching past the right scroll boundary", function() {
                    makeScroller();

                    runs(function() {
                        start({ x: 50, y: 50 });
                        move({ x: -60, y: 50 });
                    });

                    waitsForAnimation();

                    runs(function() {
                        expectScrollPosition({ x: 105, y: 0 });
                        end({ x: -60, y: 50 });
                    });

                    waitsForAnimation();
                });

                it("should allow stretching past the bottom scroll boundary", function() {
                    makeScroller();

                    runs(function() {
                        start({ x: 50, y: 50 });
                        move({ x: 50, y: -60 });
                    });

                    waitsForAnimation();

                    runs(function() {
                        expectScrollPosition({ x: 0, y: 105 });
                        end({ x: 50, y: -60 });
                    });

                    waitsForAnimation();
                });

                it("should allow stretching past the left scroll boundary", function() {
                    makeScroller();

                    runs(function() {
                        start({ x: 50, y: 50 });
                        move({ x: 60, y: 50 });
                    });

                    waitsForAnimation();

                    runs(function() {
                        expectScrollPosition({ x: -5, y: 0 });
                        end({ x: 60, y: 50 });
                    });

                    waitsForAnimation();
                });

                it("should allow stretching past the top-left scroll boundary", function() {
                    makeScroller();

                    runs(function() {
                        start({ x: 50, y: 50 });
                        move({ x: 60, y: 60 });
                    });

                    waitsForAnimation();

                    runs(function() {
                        expectScrollPosition({ x: -5, y: -5 });
                        end({ x: 60, y: 60 });
                    });

                    waitsForAnimation();
                });

                it("should allow stretching past the top-right scroll boundary", function() {
                    makeScroller();

                    runs(function() {
                        start({ x: 50, y: 50 });
                        move({ x: -60, y: 60 });
                    });

                    waitsForAnimation();

                    runs(function() {
                        expectScrollPosition({ x: 105, y: -5 });
                        end({ x: -60, y: 60 });
                    });

                    waitsForAnimation();
                });

                it("should allow stretching past the bottom-right scroll boundary", function() {
                    makeScroller();

                    runs(function() {
                        start({ x: 50, y: 50 });
                        move({ x: -60, y: -60 });
                    });

                    waitsForAnimation();

                    runs(function() {
                        expectScrollPosition({ x: 105, y: 105 });
                        end({ x: -60, y: -60 });
                    });

                    waitsForAnimation();
                });

                it("should allow stretching past the bottom-left scroll boundary", function() {
                    makeScroller();

                    runs(function() {
                        start({ x: 50, y: 50 });
                        move({ x: 60, y: -60 });
                    });

                    waitsForAnimation();

                    runs(function() {
                        expectScrollPosition({ x: -5, y: 105 });
                        end({ x: 60, y: -60 });
                    });

                    waitsForAnimation();
                });

                describe("with outOfBoundRestrictFactor:0", function() {
                    it("should not allow stretching past the top scroll boundary", function() {
                        makeScroller({
                            outOfBoundRestrictFactor: 0
                        });

                        runs(function() {
                            start({ x: 50, y: 50 });
                            move({ x: 50, y: 60 });
                        });

                        waitsForAnimation();

                        runs(function() {
                            expectScrollPosition({ x: 0, y: 0 });
                            end({ x: 50, y: 60 });
                        });

                        waitsForAnimation();
                    });

                    it("should not allow stretching past the right scroll boundary", function() {
                        makeScroller({
                            outOfBoundRestrictFactor: 0
                        });

                        runs(function() {
                            start({ x: 50, y: 50 });
                            move({ x: -60, y: 50 });
                        });

                        waitsForAnimation();

                        runs(function() {
                            expectScrollPosition({ x: 100, y: 0 });
                            end({ x: -60, y: 50 });
                        });

                        waitsForAnimation();
                    });

                    it("should not allow stretching past the bottom scroll boundary", function() {
                        makeScroller({
                            outOfBoundRestrictFactor: 0
                        });

                        runs(function() {
                            start({ x: 50, y: 50 });
                            move({ x: 50, y: -60 });
                        });

                        waitsForAnimation();

                        runs(function() {
                            expectScrollPosition({ x: 0, y: 100 });
                            end({ x: 50, y: -60 });
                        });

                        waitsForAnimation();
                    });

                    it("should not allow stretching past the left scroll boundary", function() {
                        makeScroller({
                            outOfBoundRestrictFactor: 0
                        });

                        runs(function() {
                            start({ x: 50, y: 50 });
                            move({ x: 60, y: 50 });
                        });

                        waitsForAnimation();

                        runs(function() {
                            expectScrollPosition({ x: 0, y: 0 });
                            end({ x: 60, y: 50 });
                        });

                        waitsForAnimation();
                    });

                    it("should not allow stretching past the top-left scroll boundary", function() {
                        makeScroller({
                            outOfBoundRestrictFactor: 0
                        });

                        runs(function() {
                            start({ x: 50, y: 50 });
                            move({ x: 60, y: 60 });
                        });

                        waitsForAnimation();

                        runs(function() {
                            expectScrollPosition({ x: 0, y: 0 });
                            end({ x: 60, y: 60 });
                        });

                        waitsForAnimation();
                    });

                    it("should not allow stretching past the top-right scroll boundary", function() {
                        makeScroller({
                            outOfBoundRestrictFactor: 0
                        });

                        runs(function() {
                            start({ x: 50, y: 50 });
                            move({ x: -60, y: 60 });
                        });

                        waitsForAnimation();

                        runs(function() {
                            expectScrollPosition({ x: 100, y: 0 });
                            end({ x: -60, y: 60 });
                        });

                        waitsForAnimation();
                    });

                    it("should not allow stretching past the bottom-right scroll boundary", function() {
                        makeScroller({
                            outOfBoundRestrictFactor: 0
                        });

                        runs(function() {
                            start({ x: 50, y: 50 });
                            move({ x: -60, y: -60 });
                        });

                        waitsForAnimation();

                        runs(function() {
                            expectScrollPosition({ x: 100, y: 100 });
                            end({ x: -60, y: -60 });
                        });

                        waitsForAnimation();
                    });

                    it("should not allow stretching past the bottom-left scroll boundary", function() {
                        makeScroller({
                            outOfBoundRestrictFactor: 0
                        });

                        runs(function() {
                            start({ x: 50, y: 50 });
                            move({ x: 60, y: -60 });
                        });

                        waitsForAnimation();

                        runs(function() {
                            expectScrollPosition({ x: 0, y: 100 });
                            end({ x: 60, y: -60 });
                        });

                        waitsForAnimation();
                    });
                });
            });

            describe("bounce", function() {
                beforeEach(function() {
                    makeScroller();
                });

                it("should bounce back when stretched past the top scroll boundary", function() {
                    var scrollend = false;

                    runs(function() {
                        start({ x: 50, y: 50 });
                        move({ x: 50, y: 60 });
                    });

                    waitsForAnimation();

                    runs(function() {
                        expectScrollPosition({ x: 0, y: -5 });
                        scroller.on('scrollend', function() {
                            scrollend = true;
                        });
                        end({ x: 50, y: 60 });
                    });

                    waitsFor(function() {
                        return scrollend;
                    });

                    runs(function() {
                        expectScrollPosition({ x: 0, y: 0 });
                    });
                });

                it("should bounce back when stretched past the right scroll boundary", function() {
                    var scrollend = false;

                    runs(function() {
                        start({ x: 50, y: 50 });
                        move({ x: -60, y: 50 });
                    });

                    waitsForAnimation();

                    runs(function() {
                        expectScrollPosition({ x: 105, y: 0 });
                        scroller.on('scrollend', function() {
                            scrollend = true;
                        });
                        end({ x: -60, y: 50 });
                    });

                    waitsFor(function() {
                        return scrollend;
                    });

                    runs(function() {
                        expectScrollPosition({ x: 100, y: 0 });
                    });
                });

                it("should bounce back when stretched past the bottom scroll boundary", function() {
                    var scrollend = false;

                    runs(function() {
                        start({ x: 50, y: 50 });
                        move({ x: 50, y: -60 });
                    });

                    waitsForAnimation();

                    runs(function() {
                        expectScrollPosition({ x: 0, y: 105 });
                        scroller.on('scrollend', function() {
                            scrollend = true;
                        });
                        end({ x: 50, y: -60 });
                    });

                    waitsFor(function() {
                        return scrollend;
                    });

                    runs(function() {
                        expectScrollPosition({ x: 0, y: 100 });
                    });
                });

                it("should bounce back when stretched past the left scroll boundary", function() {
                    var scrollend = false;

                    runs(function() {
                        start({ x: 50, y: 50 });
                        move({ x: 60, y: 50 });
                    });

                    waitsForAnimation();

                    runs(function() {
                        expectScrollPosition({ x: -5, y: 0 });
                        scroller.on('scrollend', function() {
                            scrollend = true;
                        });
                        end({ x: 60, y: 50 });
                    });

                    waitsFor(function() {
                        return scrollend;
                    });

                    runs(function() {
                        expectScrollPosition({ x: 0, y: 0 });
                    });
                });

                it("should bounce back when stretched past the top-left scroll boundary", function() {
                    var scrollend = false;

                    runs(function() {
                        start({ x: 50, y: 50 });
                        move({ x: 60, y: 60 });
                    });

                    waitsForAnimation();

                    runs(function() {
                        expectScrollPosition({ x: -5, y: -5 });
                        scroller.on('scrollend', function() {
                            scrollend = true;
                        });
                        end({ x: 60, y: 60 });
                    });

                    waitsFor(function() {
                        return scrollend;
                    });

                    runs(function() {
                        expectScrollPosition({ x: 0, y: 0 });
                    });
                });

                it("should bounce back when stretched past the top-right scroll boundary", function() {
                    var scrollend = false;

                    runs(function() {
                        start({ x: 50, y: 50 });
                        move({ x: -60, y: 60 });
                    });

                    waitsForAnimation();

                    runs(function() {
                        expectScrollPosition({ x: 105, y: -5 });
                        scroller.on('scrollend', function() {
                            scrollend = true;
                        });
                        end({ x: -60, y: 60 });
                    });

                    waitsFor(function() {
                        return scrollend;
                    });

                    runs(function() {
                        expectScrollPosition({ x: 100, y: 0 });
                    });
                });

                it("should bounce back when stretched past the bottom-right scroll boundary", function() {
                    var scrollend = false;

                    runs(function() {
                        start({ x: 50, y: 50 });
                        move({ x: -60, y: -60 });
                    });

                    waitsForAnimation();

                    runs(function() {
                        expectScrollPosition({ x: 105, y: 105 });
                        scroller.on('scrollend', function() {
                            scrollend = true;
                        });
                        end({ x: -60, y: -60 });
                    });

                    waitsFor(function() {
                        return scrollend;
                    });

                    runs(function() {
                        expectScrollPosition({ x: 100, y: 100 });
                    });
                });

                it("should bounce back when stretched past the bottom-left scroll boundary", function() {
                    var scrollend = false;

                    runs(function() {
                        start({ x: 50, y: 50 });
                        move({ x: 60, y: -60 });
                    });

                    waitsForAnimation();

                    runs(function() {
                        expectScrollPosition({ x: -5, y: 105 });
                        scroller.on('scrollend', function() {
                            scrollend = true;
                        });
                        end({ x: 60, y: -60 });
                    });

                    waitsFor(function() {
                        return scrollend;
                    });

                    runs(function() {
                        expectScrollPosition({ x: 0, y: 100 });
                    });
                });
            });
        });

        describe("direction:'both'", function() {
            beforeEach(function() {
                makeScroller({
                    direction: 'both'
                });
            });

            it("should size to the content", function() {
                expect(scroller.getSize()).toEqual({
                    x: 200,
                    y: 200
                });
            });

            it("should allow scrolling in the vertical direction", function() {
                runs(function() {
                    start({ x: 50, y: 50 });
                    move({ x: 50, y: 40 });
                });

                waitsForAnimation();

                runs(function() {
                    expectScrollPosition({ x: 0, y: 10 });
                    end({ x: 50, y: 40 });
                });

                waitsForAnimation();
            });

            it("should allow scrolling in the horizontal direction", function() {
                runs(function() {
                    start({ x: 50, y: 50 });
                    move({ x: 40, y: 50 });
                });

                waitsForAnimation();

                runs(function() {
                    expectScrollPosition({ x: 10, y: 0 });
                    end({ x: 40, y: 50 });
                });

                waitsForAnimation();
            });

            it("should allow scrolling in both directions simultaneously", function() {
                runs(function() {
                    start({ x: 50, y: 50 });
                    move({ x: 40, y: 40 });
                });

                waitsForAnimation();

                runs(function() {
                    expectScrollPosition({ x: 10, y: 10 });
                    end({ x: 40, y: 40 });
                });

                waitsForAnimation();
            });
        });

        describe("direction:'vertical'", function() {
            beforeEach(function() {
                makeScroller({
                    direction: 'vertical'
                });
            });

            it("should size to the content", function() {
                expect(scroller.getSize()).toEqual({
                    x: 200,
                    y: 200
                });
            });

            it("should allow scrolling in the vertical direction", function() {
                runs(function() {
                    start({ x: 50, y: 50 });
                    move({ x: 50, y: 40 });
                });

                waitsForAnimation();

                runs(function() {
                    expectScrollPosition({ x: 0, y: 10 });
                    end({ x: 50, y: 40 });
                });

                waitsForAnimation();
            });

            it("should not allow scrolling in the horizontal direction", function() {
                runs(function() {
                    start({ x: 50, y: 50 });
                    move({ x: 40, y: 50 });
                });

                waitsForAnimation();

                runs(function() {
                    expectScrollPosition({ x: 0, y: 0 });
                    end({ x: 40, y: 50 });
                });

                waitsForAnimation();
            });

            it("should not allow scrolling in both directions simultaneously", function() {
                runs(function() {
                    start({ x: 50, y: 50 });
                    move({ x: 40, y: 40 });
                });

                waitsForAnimation();

                runs(function() {
                    expectScrollPosition({ x: 0, y: 10 });
                    end({ x: 40, y: 40 });
                });

                waitsForAnimation();
            });
        });

        describe("direction:'horizontal'", function() {
            beforeEach(function() {
                makeScroller({
                    direction: 'horizontal'
                });
            });

            it("should size to the content", function() {
                expect(scroller.getSize()).toEqual({
                    x: 200,
                    y: 200
                });
            });

            it("should not allow scrolling in the vertical direction", function() {
                runs(function() {
                    start({ x: 50, y: 50 });
                    move({ x: 50, y: 40 });
                });

                waitsForAnimation();

                runs(function() {
                    expectScrollPosition({ x: 0, y: 0 });
                    end({ x: 50, y: 40 });
                });

                waitsForAnimation();
            });

            it("should allow scrolling in the horizontal direction", function() {
                runs(function() {
                    start({ x: 50, y: 50 });
                    move({ x: 40, y: 50 });
                });

                waitsForAnimation();

                runs(function() {
                    expectScrollPosition({ x: 10, y: 0 });
                    end({ x: 40, y: 50 });
                });

                waitsForAnimation();
            });

            it("should not allow scrolling in both directions simultaneously", function() {
                runs(function() {
                    start({ x: 50, y: 50 });
                    move({ x: 40, y: 40 });
                });

                waitsForAnimation();

                runs(function() {
                    expectScrollPosition({ x: 10, y: 0 });
                    end({ x: 40, y: 40 });
                });

                waitsForAnimation();
            });
        });

        it("should end scrolling when the touchend occurs outside the scroller", function() {
            var scrollEnded = false;

            makeScroller();

            scroller.on('scrollend', function() {
                scrollEnded = true;
            });

            runs(function() {
                start({ x: 50, y: 50 });
                move({ x: 60, y: 40 });
                move({ x: 150, y: 150 });
                end({ x: 150, y: 150 }, document.body);
            });

            waitsFor(function() {
                return scrollEnded;
            });

            runs(function() {
                expect(scrollEnded).toBe(true);
            });
        });

        // disabled - fails intermittently
        xdescribe("directionLock", function() {
            describe("x only", function() {
                beforeEach(function() {
                    makeScroller({
                        x: true,
                        y: false,
                        directionLock: true
                    });
                });

                it("should not stop the scroll if the amount of scroll is x > y", function() {
                    runs(function() {
                        start({ x: 50, y: 50 });
                        move({ x: 80, y: 60 });
                        end({ x: 80, y: 60 });
                    });
                    waitsForAnimation();
                    runs(function() {
                        var pos = scroller.getPosition();

                        expect(pos.x).toBeLessThan(0);
                        expect(pos.y).toBe(0);
                    });
                });

                it("should stop the scroll if the amount of scroll is x < y", function() {
                    runs(function() {
                        start({ x: 50, y: 50 });
                        move({ x: 60, y: 80 });
                        end({ x: 60, y: 80 });
                    });
                    waitsForAnimation();
                    runs(function() {
                        var pos = scroller.getPosition();

                        expect(pos.x).toBe(0);
                        expect(pos.y).toBe(0);
                    });
                });
            });

            describe("y only", function() {
                beforeEach(function() {
                    makeScroller({
                        x: false,
                        y: true,
                        directionLock: true
                    });
                });

                it("should not stop the scroll if the amount of scroll is y > x", function() {
                    runs(function() {
                        start({ x: 50, y: 50 });
                        move({ x: 60, y: 80 });
                        end({ x: 60, y: 80 });
                    });
                    waitsForAnimation();
                    runs(function() {
                        var pos = scroller.getPosition();

                        expect(pos.x).toBe(0);
                        expect(pos.y).toBeLessThan(0);
                    });
                });

                it("should stop the scroll if the amount of scroll is y < x", function() {
                    runs(function() {
                        start({ x: 50, y: 50 });
                        move({ x: 80, y: 60 });
                        end({ x: 80, y: 60 });
                    });
                    waitsForAnimation();
                    runs(function() {
                        var pos = scroller.getPosition();

                        expect(pos.x).toBe(0);
                        expect(pos.y).toBe(0);
                    });
                });
            });

            describe("both", function() {
                beforeEach(function() {
                    makeScroller({
                        x: true,
                        y: true,
                        directionLock: true
                    });
                });

                it("should not limit the scroll if x > y", function() {
                    runs(function() {
                        start({ x: 50, y: 50 });
                        move({ x: 80, y: 60 });
                        end({ x: 80, y: 60 });
                    });
                    waitsForAnimation();
                    runs(function() {
                        var pos = scroller.getPosition();

                        expect(pos.x).toBeLessThan(0);
                        expect(pos.y).toBeLessThan(0);
                    });
                });

                it("should not limit the scroll if y > x", function() {
                    runs(function() {
                        start({ x: 50, y: 50 });
                        move({ x: 60, y: 80 });
                        end({ x: 60, y: 80 });
                    });
                    waitsForAnimation();
                    runs(function() {
                        var pos = scroller.getPosition();

                        expect(pos.x).toBeLessThan(0);
                        expect(pos.y).toBeLessThan(0);
                    });
                });
            });
        });
    });

    if (scrollbarWidth) {
        describe("scrollbars", function() {
            function waitsForRefresh() {
                var refreshFired = false;

                scroller.on({
                    refresh: function() {
                        refreshFired = true;
                    },
                    single: true
                });

                waitsFor(function() {
                    return refreshFired;
                });
            }

            beforeEach(function() {
                innerElement = el.createChild({
                    style: 'height:50px; width:50px;'
                });
            });

            describe("y: true, x: false", function() {
                it("should have no scrollbars when not overflowing", function() {
                    makeScroller({
                        y: true,
                        x: false
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 100, y: 100 });
                    expect(scroller.getClientSize()).toEqual({ x: 100, y: 100 });
                    expect(indicators.x.el.getStyle('display')).toBe('none');
                    expect(indicators.y.el.getStyle('display')).toBe('none');
                });

                it("should have a vertical scrollbar when vertically overflowing", function() {
                    innerElement.setStyle('height', '101px');

                    makeScroller({
                        y: true,
                        x: false
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 100 - scrollbarWidth, y: 101 });
                    expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 });
                    expect(indicators.x.el.getStyle('display')).toBe('none');
                    expect(indicators.y.el.getStyle('display')).toBe('block');
                });

                it("should gain a vertical scrollbar when vertical overflow occurs", function() {
                    makeScroller({
                        y: true,
                        x: false
                    });

                    innerElement.setStyle('height', '101px');

                    waitsForRefresh();

                    runs(function() {
                        var indicators = scroller.getIndicators();

                        expect(scroller.getSize()).toEqual({ x: 100 - scrollbarWidth, y: 101 });
                        expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 });
                        expect(indicators.x.el.getStyle('display')).toBe('none');
                        expect(indicators.y.el.getStyle('display')).toBe('block');
                    });
                });

                it("should lose a vertical scrollbar when vertical underflow occurs", function() {
                    innerElement.setStyle('height', '101px');

                    makeScroller({
                        y: true,
                        x: false
                    });

                    innerElement.setStyle('height', '50px');

                    waitsForRefresh();

                    runs(function() {
                        var indicators = scroller.getIndicators();

                        expect(scroller.getSize()).toEqual({ x: 100, y: 100 });
                        expect(scroller.getClientSize()).toEqual({ x: 100, y: 100 });
                        expect(indicators.x.el.getStyle('display')).toBe('none');
                        expect(indicators.y.el.getStyle('display')).toBe('none');
                    });
                });

                it("should not gain a horizontal scrollbar when horizontally overflowing", function() {
                    innerElement.setStyle('width', '101px');

                    makeScroller({
                        y: true,
                        x: false
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 101, y: 100 });
                    expect(scroller.getClientSize()).toEqual({ x: 100, y: 100 });
                    expect(indicators.x.el.getStyle('display')).toBe('none');
                    expect(indicators.y.el.getStyle('display')).toBe('none');
                });

                it("should not gain a horizontal scrollbar when horizontal overflow occurs", function() {
                    makeScroller({
                        y: true,
                        x: false
                    });

                    innerElement.setStyle('width', '101px');

                    waitsForRefresh();

                    runs(function() {
                        var indicators = scroller.getIndicators();

                        expect(scroller.getSize()).toEqual({ x: 101, y: 100 });
                        expect(scroller.getClientSize()).toEqual({ x: 100, y: 100 });
                        expect(indicators.x.el.getStyle('display')).toBe('none');
                        expect(indicators.y.el.getStyle('display')).toBe('none');
                    });
                });
            });

            describe("y: false, x: true", function() {
                it("should have no scrollbars when not overflowing", function() {
                    makeScroller({
                        y: false,
                        x: true
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 100, y: 100 });
                    expect(scroller.getClientSize()).toEqual({ x: 100, y: 100 });
                    expect(indicators.x.el.getStyle('display')).toBe('none');
                    expect(indicators.y.el.getStyle('display')).toBe('none');
                });

                it("should have a horizontal scrollbar when horizontally overflowing", function() {
                    innerElement.setStyle('width', '101px');

                    makeScroller({
                        y: false,
                        x: true
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 101, y: 100 - scrollbarHeight });
                    expect(scroller.getClientSize()).toEqual({ x: 100, y: 100 - scrollbarHeight });
                    expect(indicators.x.el.getStyle('display')).toBe('block');
                    expect(indicators.y.el.getStyle('display')).toBe('none');
                });

                it("should gain a horizontal scrollbar when horizontal overflow occurs", function() {
                    makeScroller({
                        y: false,
                        x: true
                    });

                    innerElement.setStyle('width', '101px');

                    waitsForRefresh();

                    runs(function() {
                        var indicators = scroller.getIndicators();

                        expect(scroller.getSize()).toEqual({ x: 101, y: 100 - scrollbarHeight });
                        expect(scroller.getClientSize()).toEqual({ x: 100, y: 100 - scrollbarHeight });
                        expect(indicators.x.el.getStyle('display')).toBe('block');
                        expect(indicators.y.el.getStyle('display')).toBe('none');
                    });
                });

                it("should lose a horizontal scrollbar when horizontal underflow occurs", function() {
                    innerElement.setStyle('width', '101px');

                    makeScroller({
                        y: false,
                        x: true
                    });

                    innerElement.setStyle('width', '50px');

                    waitsForRefresh();

                    runs(function() {
                        var indicators = scroller.getIndicators();

                        expect(scroller.getSize()).toEqual({ x: 100, y: 100 });
                        expect(scroller.getClientSize()).toEqual({ x: 100, y: 100 });
                        expect(indicators.x.el.getStyle('display')).toBe('none');
                        expect(indicators.y.el.getStyle('display')).toBe('none');
                    });
                });

                it("should not gain a vertical scrollbar when vertically overflowing", function() {
                    innerElement.setStyle('height', '101px');

                    makeScroller({
                        y: false,
                        x: true
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 100, y: 101 });
                    expect(scroller.getClientSize()).toEqual({ x: 100, y: 100 });
                    expect(indicators.x.el.getStyle('display')).toBe('none');
                    expect(indicators.y.el.getStyle('display')).toBe('none');
                });

                it("should not gain a vertical scrollbar when vertical overflow occurs", function() {
                    makeScroller({
                        y: false,
                        x: true
                    });

                    innerElement.setStyle('height', '101px');

                    waitsForRefresh();

                    runs(function() {
                        var indicators = scroller.getIndicators();

                        expect(scroller.getSize()).toEqual({ x: 100, y: 101 });
                        expect(scroller.getClientSize()).toEqual({ x: 100, y: 100 });
                        expect(indicators.x.el.getStyle('display')).toBe('none');
                        expect(indicators.y.el.getStyle('display')).toBe('none');
                    });
                });
            });

            describe("y: true, x: true", function() {
                it("should have no scrollbars when not overflowing", function() {
                    makeScroller({
                        y: true,
                        x: true
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 100, y: 100 });
                    expect(scroller.getClientSize()).toEqual({ x: 100, y: 100 });
                    expect(indicators.x.el.getStyle('display')).toBe('none');
                    expect(indicators.y.el.getStyle('display')).toBe('none');
                });

                it("should have a vertical scrollbar when vertically overflowing", function() {
                    innerElement.setStyle('height', '101px');

                    makeScroller({
                        y: true,
                        x: true
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 100 - scrollbarWidth, y: 101 });
                    expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 });
                    expect(indicators.x.el.getStyle('display')).toBe('none');
                    expect(indicators.y.el.getStyle('display')).toBe('block');
                });

                it("should gain a vertical scrollbar when vertical overflow occurs", function() {
                    makeScroller({
                        y: true,
                        x: true
                    });

                    innerElement.setStyle('height', '101px');

                    waitsForRefresh();

                    runs(function() {
                        var indicators = scroller.getIndicators();

                        expect(scroller.getSize()).toEqual({ x: 100 - scrollbarWidth, y: 101 });
                        expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 });
                        expect(indicators.x.el.getStyle('display')).toBe('none');
                        expect(indicators.y.el.getStyle('display')).toBe('block');
                    });
                });

                it("should lose a vertical scrollbar when vertical underflow occurs", function() {
                    innerElement.setStyle('height', '101px');

                    makeScroller({
                        y: true,
                        x: true
                    });

                    innerElement.setStyle('height', '50px');

                    waitsForRefresh();

                    runs(function() {
                        var indicators = scroller.getIndicators();

                        expect(scroller.getSize()).toEqual({ x: 100, y: 100 });
                        expect(scroller.getClientSize()).toEqual({ x: 100, y: 100 });
                        expect(indicators.x.el.getStyle('display')).toBe('none');
                        expect(indicators.y.el.getStyle('display')).toBe('none');
                    });
                });

                it("should have a horizontal scrollbar when horizontally overflowing", function() {
                    innerElement.setStyle('width', '101px');

                    makeScroller({
                        y: true,
                        x: true
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 101, y: 100 - scrollbarHeight });
                    expect(scroller.getClientSize()).toEqual({ x: 100, y: 100 - scrollbarHeight });
                    expect(indicators.x.el.getStyle('display')).toBe('block');
                    expect(indicators.y.el.getStyle('display')).toBe('none');
                });

                it("should gain a horizontal scrollbar when horizontal overflow occurs", function() {
                    makeScroller({
                        y: true,
                        x: true
                    });

                    innerElement.setStyle('width', '101px');

                    waitsForRefresh();

                    runs(function() {
                        var indicators = scroller.getIndicators();

                        expect(scroller.getSize()).toEqual({ x: 101, y: 100 - scrollbarHeight });
                        expect(scroller.getClientSize()).toEqual({ x: 100, y: 100 - scrollbarHeight });
                        expect(indicators.x.el.getStyle('display')).toBe('block');
                        expect(indicators.y.el.getStyle('display')).toBe('none');
                    });
                });

                it("should lose a horizontal scrollbar when horizontal underflow occurs", function() {
                    innerElement.setStyle('width', '101px');

                    makeScroller({
                        y: true,
                        x: true
                    });

                    innerElement.setStyle('width', '50px');

                    waitsForRefresh();

                    runs(function() {
                        var indicators = scroller.getIndicators();

                        expect(scroller.getSize()).toEqual({ x: 100, y: 100 });
                        expect(scroller.getClientSize()).toEqual({ x: 100, y: 100 });
                        expect(indicators.x.el.getStyle('display')).toBe('none');
                        expect(indicators.y.el.getStyle('display')).toBe('none');
                    });
                });

                it("should have both scrollbars when both dimensions are overflowing", function() {
                    innerElement.setStyle({
                        width: '101px',
                        height: '101px'
                    });

                    makeScroller({
                        y: true,
                        x: true
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 101, y: 101 });
                    expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 - scrollbarWidth });
                    expect(indicators.x.el.getStyle('display')).toBe('block');
                    expect(indicators.y.el.getStyle('display')).toBe('block');
                });

                it("should have both scrollbars when both dimensions are overflowing (scrollWidth < offsetWidth)", function() {
                    innerElement.setStyle({
                        width: '95px',
                        height: '101px'
                    });

                    makeScroller({
                        y: true,
                        x: true
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 95, y: 101 });
                    expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 - scrollbarWidth });
                    expect(indicators.x.el.getStyle('display')).toBe('block');
                    expect(indicators.y.el.getStyle('display')).toBe('block');
                });

                it("should have both scrollbars when both dimensions are overflowing (scrollHeight < offsetHeight)", function() {
                    innerElement.setStyle({
                        width: '101px',
                        height: '95px'
                    });

                    makeScroller({
                        y: true,
                        x: true
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 101, y: 95 });
                    expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 - scrollbarWidth });
                    expect(indicators.x.el.getStyle('display')).toBe('block');
                    expect(indicators.y.el.getStyle('display')).toBe('block');
                });

                it("should not have either scrollbar when both dimensions are close to overflowing", function() {
                    innerElement.setStyle({
                        width: '99px',
                        height: '99px'
                    });

                    makeScroller({
                        y: true,
                        x: true
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 100, y: 100 });
                    expect(scroller.getClientSize()).toEqual({ x: 100, y: 100 });
                    expect(indicators.x.el.getStyle('display')).toBe('none');
                    expect(indicators.y.el.getStyle('display')).toBe('none');
                });

                it("should transition from vertical scrollbar to both scrollbars", function() {
                    innerElement.setStyle('height', '101px');

                    makeScroller({
                        y: true,
                        x: true
                    });

                    innerElement.setStyle('width', '101px');

                    waitsForRefresh();

                    runs(function() {
                        var indicators = scroller.getIndicators();

                        expect(scroller.getSize()).toEqual({ x: 101, y: 101 });
                        expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 - scrollbarHeight });
                        expect(indicators.x.el.getStyle('display')).toBe('block');
                        expect(indicators.y.el.getStyle('display')).toBe('block');
                    });
                });

                it("should transition from vertical scrollbar to both scrollbars (scrollWidth < offsetWidth", function() {
                   innerElement.setStyle('height', '101px');

                    makeScroller({
                        y: true,
                        x: true
                    });

                    innerElement.setStyle('width', '95px');

                    waitsForRefresh();

                    runs(function() {
                        var indicators = scroller.getIndicators();

                        expect(scroller.getSize()).toEqual({ x: 95, y: 101 });
                        expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 - scrollbarHeight });
                        expect(indicators.x.el.getStyle('display')).toBe('block');
                        expect(indicators.y.el.getStyle('display')).toBe('block');
                    });
                });

                it("should transition from horizontal scrollbar to both scrollbars", function() {
                    innerElement.setStyle('width', '101px');

                    makeScroller({
                        y: true,
                        x: true
                    });

                    innerElement.setStyle('height', '101px');

                    waitsForRefresh();

                    runs(function() {
                        var indicators = scroller.getIndicators();

                        expect(scroller.getSize()).toEqual({ x: 101, y: 101 });
                        expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 - scrollbarHeight });
                        expect(indicators.x.el.getStyle('display')).toBe('block');
                        expect(indicators.y.el.getStyle('display')).toBe('block');
                    });
                });

                it("should transition from horizontal scrollbar to both scrollbars (scrollHeight < offsetHeight)", function() {
                    innerElement.setStyle('width', '101px');

                    makeScroller({
                        y: true,
                        x: true
                    });

                    innerElement.setStyle('height', '95px');

                    waitsForRefresh();

                    runs(function() {
                        var indicators = scroller.getIndicators();

                        expect(scroller.getSize()).toEqual({ x: 101, y: 95 });
                        expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 - scrollbarHeight });
                        expect(indicators.x.el.getStyle('display')).toBe('block');
                        expect(indicators.y.el.getStyle('display')).toBe('block');
                    });
                });

                it("should transition from both scrollbars to vertical scrollbar", function() {
                    innerElement.setStyle({
                        width: '101px',
                        height: '101px'
                    });

                    makeScroller({
                        y: true,
                        x: true
                    });

                    innerElement.setStyle('width', '50px');

                    waitsForRefresh();

                    runs(function() {
                        var indicators = scroller.getIndicators();

                        expect(scroller.getSize()).toEqual({ x: 100 - scrollbarWidth, y: 101 });
                        expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 });
                        expect(indicators.x.el.getStyle('display')).toBe('none');
                        expect(indicators.y.el.getStyle('display')).toBe('block');
                    });
                });

                it("should transition from both scrollbars to vertical scrollbar (scrollWidth < offsetWidth)", function() {
                    innerElement.setStyle({
                        width: '95px',
                        height: '101px'
                    });

                    makeScroller({
                        y: true,
                        x: true
                    });

                    innerElement.setStyle('width', '50px');

                    waitsForRefresh();

                    runs(function() {
                        var indicators = scroller.getIndicators();

                        expect(scroller.getSize()).toEqual({ x: 100 - scrollbarWidth, y: 101 });
                        expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 });
                        expect(indicators.x.el.getStyle('display')).toBe('none');
                        expect(indicators.y.el.getStyle('display')).toBe('block');
                    });
                });

                it("should transition from both scrollbars to horizontal scrollbar", function() {
                    innerElement.setStyle({
                        width: '101px',
                        height: '101px'
                    });

                    makeScroller({
                        y: true,
                        x: true
                    });

                    innerElement.setStyle('height', '50px');

                    waitsForRefresh();

                    runs(function() {
                        var indicators = scroller.getIndicators();

                        expect(scroller.getSize()).toEqual({ x: 101, y: 100 - scrollbarHeight });
                        expect(scroller.getClientSize()).toEqual({ x: 100, y: 100 - scrollbarHeight });
                        expect(indicators.x.el.getStyle('display')).toBe('block');
                        expect(indicators.y.el.getStyle('display')).toBe('none');
                    });
                });

                it("should transition from both scrollbars to horizontal scrollbar (scrollHeight < offsetHeight)", function() {
                    innerElement.setStyle({
                        width: '101px',
                        height: '95px'
                    });

                    makeScroller({
                        y: true,
                        x: true
                    });

                    innerElement.setStyle('height', '50px');

                    waitsForRefresh();

                    runs(function() {
                        var indicators = scroller.getIndicators();

                        expect(scroller.getSize()).toEqual({ x: 101, y: 100 - scrollbarHeight });
                        expect(scroller.getClientSize()).toEqual({ x: 100, y: 100 - scrollbarHeight });
                        expect(indicators.x.el.getStyle('display')).toBe('block');
                        expect(indicators.y.el.getStyle('display')).toBe('none');
                    });
                });

                it("should keep both scrollbars when transitioning from scrollHeight > offsetHeight to clientHeight < scrollHeight < offsetHeight", function() {
                    innerElement.setStyle({
                        width: '101px',
                        height: '101px'
                    });

                    makeScroller({
                        y: true,
                        x: true
                    });

                    innerElement.setStyle('height', '95px');

                    waitsForRefresh();

                    runs(function() {
                        var indicators = scroller.getIndicators();

                        expect(scroller.getSize()).toEqual({ x: 101, y: 95 });
                        expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 - scrollbarHeight });
                        expect(indicators.x.el.getStyle('display')).toBe('block');
                        expect(indicators.y.el.getStyle('display')).toBe('block');
                    });
                });

                it("should keep both scrollbars when transitioning from scrollWidth > offsetWidth to clientWidth < scrollWidth < offsetWidth", function() {
                    innerElement.setStyle({
                        width: '101px',
                        height: '101px'
                    });

                    makeScroller({
                        y: true,
                        x: true
                    });

                    innerElement.setStyle('width', '95px');

                    waitsForRefresh();

                    runs(function() {
                        var indicators = scroller.getIndicators();

                        expect(scroller.getSize()).toEqual({ x: 95, y: 101 });
                        expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 - scrollbarHeight });
                        expect(indicators.x.el.getStyle('display')).toBe('block');
                        expect(indicators.y.el.getStyle('display')).toBe('block');
                    });
                });
            });

            describe("y: scroll, x: false", function() {
                it("should have a vertical scrollbar when not overflowing", function() {
                    makeScroller({
                        y: 'scroll',
                        x: false
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 });
                    expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 });
                    expect(indicators.x.el.getStyle('display')).toBe('none');
                    expect(indicators.y.el.getStyle('display')).toBe('block');
                });

                it("should have a vertical scrollbar when vertically overflowing", function() {
                    innerElement.setStyle('height', '101px');

                    makeScroller({
                        y: 'scroll',
                        x: false
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 100 - scrollbarWidth, y: 101 });
                    expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 });
                    expect(indicators.x.el.getStyle('display')).toBe('none');
                    expect(indicators.y.el.getStyle('display')).toBe('block');
                });

                it("should have a vertical scrollbar when horizontally overflowing", function() {
                    innerElement.setStyle('width', '101px');

                    makeScroller({
                        y: 'scroll',
                        x: false
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 101, y: 100 });
                    expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 });
                    expect(indicators.x.el.getStyle('display')).toBe('none');
                    expect(indicators.y.el.getStyle('display')).toBe('block');
                });

                it("should have a vertical scrollbar when overflowing in both dimensions", function() {
                    innerElement.setStyle({
                        width: '101px',
                        height: '101px'
                    });

                    makeScroller({
                        y: 'scroll',
                        x: false
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 101, y: 101 });
                    expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 });
                    expect(indicators.x.el.getStyle('display')).toBe('none');
                    expect(indicators.y.el.getStyle('display')).toBe('block');
                });
            });

            describe("y: false, x: scroll", function() {
                it("should have a horizontal scrollbar when not overflowing", function() {
                    makeScroller({
                        y: false,
                        x: 'scroll'
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 100, y: 100 - scrollbarHeight });
                    expect(scroller.getClientSize()).toEqual({ x: 100, y: 100 - scrollbarHeight });
                    expect(indicators.x.el.getStyle('display')).toBe('block');
                    expect(indicators.y.el.getStyle('display')).toBe('none');
                });

                it("should have a horizontal scrollbar when horizontal overflowing", function() {
                    innerElement.setStyle('width', '101px');

                    makeScroller({
                        y: false,
                        x: 'scroll'
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 101, y: 100 - scrollbarHeight });
                    expect(scroller.getClientSize()).toEqual({ x: 100, y: 100 - scrollbarHeight });
                    expect(indicators.x.el.getStyle('display')).toBe('block');
                    expect(indicators.y.el.getStyle('display')).toBe('none');
                });

                it("should have a horizontal scrollbar when vertically overflowing", function() {
                    innerElement.setStyle('height', '101px');

                    makeScroller({
                        y: false,
                        x: 'scroll'
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 100, y: 101 });
                    expect(scroller.getClientSize()).toEqual({ x: 100, y: 100 - scrollbarHeight });
                    expect(indicators.x.el.getStyle('display')).toBe('block');
                    expect(indicators.y.el.getStyle('display')).toBe('none');
                });

                it("should have a horizontal scrollbar when overflowing in both dimensions", function() {
                    innerElement.setStyle({
                        width: '101px',
                        height: '101px'
                    });

                    makeScroller({
                        y: false,
                        x: 'scroll'
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 101, y: 101 });
                    expect(scroller.getClientSize()).toEqual({ x: 100, y: 100 - scrollbarHeight });
                    expect(indicators.x.el.getStyle('display')).toBe('block');
                    expect(indicators.y.el.getStyle('display')).toBe('none');
                });
            });

            describe("y: scroll, x: scroll", function() {
                it("should have both scrollbars when not overflowing", function() {
                    makeScroller({
                        y: 'scroll',
                        x: 'scroll'
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 - scrollbarHeight });
                    expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 - scrollbarHeight });
                    expect(indicators.x.el.getStyle('display')).toBe('block');
                    expect(indicators.y.el.getStyle('display')).toBe('block');
                });

                it("should have both scrollbars when vertically overflowing", function() {
                    innerElement.setStyle('height', '101px');

                    makeScroller({
                        y: 'scroll',
                        x: 'scroll'
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 100 - scrollbarWidth, y: 101 });
                    expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 - scrollbarHeight });
                    expect(indicators.x.el.getStyle('display')).toBe('block');
                    expect(indicators.y.el.getStyle('display')).toBe('block');
                });

                it("should have both scrollbars when horizontally overflowing", function() {
                    innerElement.setStyle('width', '101px');

                    makeScroller({
                        y: 'scroll',
                        x: 'scroll'
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 101, y: 100 - scrollbarHeight });
                    expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 - scrollbarHeight });
                    expect(indicators.x.el.getStyle('display')).toBe('block');
                    expect(indicators.y.el.getStyle('display')).toBe('block');
                });

                it("should have both scrollbars when overflowing in both dimensions", function() {
                    innerElement.setStyle({
                        width: '101px',
                        height: '101px'
                    });

                    makeScroller({
                        y: 'scroll',
                        x: 'scroll'
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 101, y: 101 });
                    expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 - scrollbarHeight });
                    expect(indicators.x.el.getStyle('display')).toBe('block');
                    expect(indicators.y.el.getStyle('display')).toBe('block');
                });
            });

            describe("y: scroll, x: true", function() {
                it("should have a vertical scrollbar when not overflowing", function() {
                    makeScroller({
                        y: 'scroll',
                        x: true
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 });
                    expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 });
                    expect(indicators.x.el.getStyle('display')).toBe('none');
                    expect(indicators.y.el.getStyle('display')).toBe('block');
                });

                it("should have a horizontal scrollbar when horizontally overflowing", function() {
                    innerElement.setStyle('width', '101px');

                    makeScroller({
                        y: 'scroll',
                        x: true
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 101, y: 100 - scrollbarHeight });
                    expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 - scrollbarHeight });
                    expect(indicators.x.el.getStyle('display')).toBe('block');
                    expect(indicators.y.el.getStyle('display')).toBe('block');
                });

                it("should gain a horizontal scrollbar when horizontal overflow occurs", function() {
                    makeScroller({
                        y: 'scroll',
                        x: true
                    });

                    innerElement.setStyle('width', '101px');

                    waitsForRefresh();

                    runs(function() {
                        var indicators = scroller.getIndicators();

                        expect(scroller.getSize()).toEqual({ x: 101, y: 100 - scrollbarHeight });
                        expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 - scrollbarHeight });
                        expect(indicators.x.el.getStyle('display')).toBe('block');
                        expect(indicators.y.el.getStyle('display')).toBe('block');
                    });
                });

                it("should lose a horizontal scrollbar when horizontal underflow occurs", function() {
                    innerElement.setStyle('width', '101px');

                    makeScroller({
                        y: 'scroll',
                        x: true
                    });

                    innerElement.setStyle('width', '50px');

                    waitsForRefresh();

                    runs(function() {
                        var indicators = scroller.getIndicators();

                        expect(scroller.getSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 });
                        expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 });
                        expect(indicators.x.el.getStyle('display')).toBe('none');
                        expect(indicators.y.el.getStyle('display')).toBe('block');
                    });
                });
            });

            describe("y: true, x: scroll", function() {
                it("should have a horizontal scrollbar when not overflowing", function() {
                    makeScroller({
                        y: true,
                        x: 'scroll'
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 100, y: 100 - scrollbarHeight });
                    expect(scroller.getClientSize()).toEqual({ x: 100, y: 100 - scrollbarHeight });
                    expect(indicators.x.el.getStyle('display')).toBe('block');
                    expect(indicators.y.el.getStyle('display')).toBe('none');
                });

                it("should have a vertical scrollbar when vertically overflowing", function() {
                    innerElement.setStyle('height', '101px');

                    makeScroller({
                        y: true,
                        x: 'scroll'
                    });

                    var indicators = scroller.getIndicators();

                    expect(scroller.getSize()).toEqual({ x: 100 - scrollbarWidth, y: 101 });
                    expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 - scrollbarHeight });
                    expect(indicators.x.el.getStyle('display')).toBe('block');
                    expect(indicators.y.el.getStyle('display')).toBe('block');
                });

                it("should gain a vertical scrollbar when vertical overflow occurs", function() {
                    makeScroller({
                        y: true,
                        x: 'scroll'
                    });

                    innerElement.setStyle('height', '101px');

                    waitsForRefresh();

                    runs(function() {
                        var indicators = scroller.getIndicators();

                        expect(scroller.getSize()).toEqual({ x: 100 - scrollbarWidth, y: 101 });
                        expect(scroller.getClientSize()).toEqual({ x: 100 - scrollbarWidth, y: 100 - scrollbarHeight });
                        expect(indicators.x.el.getStyle('display')).toBe('block');
                        expect(indicators.y.el.getStyle('display')).toBe('block');
                    });
                });

                it("should lose a vertical scrollbar when vertical underflow occurs", function() {
                    innerElement.setStyle('height', '101px');

                    makeScroller({
                        y: true,
                        x: 'scroll'
                    });

                    innerElement.setStyle('height', '50px');

                    waitsForRefresh();

                    runs(function() {
                        var indicators = scroller.getIndicators();

                        expect(scroller.getSize()).toEqual({ x: 100, y: 100 - scrollbarHeight });
                        expect(scroller.getClientSize()).toEqual({ x: 100, y: 100 - scrollbarHeight });
                        expect(indicators.x.el.getStyle('display')).toBe('block');
                        expect(indicators.y.el.getStyle('display')).toBe('none');
                    });
                });
            });
        });
    }
});
