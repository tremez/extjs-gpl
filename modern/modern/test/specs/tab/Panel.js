topSuite('Ext.tab.Panel', ['Ext.Panel'], function() {
    var panel;

    function makePanel(config, items) {
        items = items || [{
            xtype: 'panel',
            itemId: 'foo',
            title: 'foo',
            html: 'lorem ipsum foo baroo'
        }, {
            xtype: 'panel',
            itemId: 'bar',
            title: 'bar',
            html: 'blergo zumbo shmorem gypsum'
        }];

        config = Ext.apply({
            renderTo: document.body,
            items: items
        }, config);

        panel = new Ext.tab.Panel(config);

        return panel;
    }

    function createTabPanelWithTabs(count, config) {
        var i,
            items = [];

        for (i = 0; i < count; i++) {
            items[i] = {
                xtype: 'panel',
                html: 'test ' + (i + 1),
                title: 'test ' + (i + 1),
                itemId: 'item' + (i + 1)
            };
        }

        return makePanel(Ext.apply({}, config, {
            items: items
        }));
    }

    afterEach(function() {
        panel = Ext.destroy(panel);
    });

    describe("card behavior", function() {
        var fooTab, fooCard, barTab, barCard;

        beforeEach(function() {
            makePanel();

            fooCard = panel.down('#foo');
            fooTab = fooCard.tab;

            barCard = panel.down('#bar');
            barTab = barCard.tab;
        });

        afterEach(function() {
            fooTab = fooCard = barTab = barCard = null;
        });

        describe("setTitle", function() {
            beforeEach(function() {
                fooCard.setTitle('throbbe');
            });

            it("should update tab text", function() {
                expect(fooTab.getText()).toBe('throbbe');
            });
        });
    });

    describe("active item", function() {
        it("should default the active item to the first item", function() {
            makePanel();

            expect(panel.getActiveItem()).toBe(panel.getInnerItems()[0]);
        });

        it("should be able to set the active item initially", function() {
            makePanel({
                activeItem: 1
            });

            expect(panel.getActiveItem()).toBe(panel.getInnerItems()[1]);
        });

        it("should set the last item as active if the active item is out of bounds", function() {
            makePanel({
                activeItem: 3
            });

            expect(panel.getActiveItem()).toBe(panel.getInnerItems()[1]);
        });

        it("should not change the active item if we add a new item", function() {
            makePanel({
                activeItem: 1
            });

            panel.add({
                xtype: 'panel',
                itemId: 'hello',
                title: 'hello',
                html: 'lorem ipsum foo baroo'
            });

            expect(panel.getActiveItem()).toBe(panel.getInnerItems()[1]);
        });

        it("should be able to set the active item from a selector", function() {
            makePanel({
                activeItem: '#bar'
            });

            expect(panel.getActiveItem()).toBe(panel.getInnerItems()[1]);
        });

        it("should be able to set the active item from a component instance", function() {
            makePanel({
                activeItem: 0
            });

            var item = panel.getInnerItems()[1];

            panel.setActiveItem(item);

            expect(panel.getActiveItem()).toBe(item);
        });
    });

    describe("closable tabs", function() {
        it("should support creating with closable child panel", function() {
            makePanel(null, {
                xtype: 'panel',
                title: 'foo',
                closable: true
            });

            expect(panel.getActiveItem()).toBe(panel.getInnerItems()[0]);
        });
    });

    describe('tabBar', function() {
        it('should allow non-tab items', function() {
            makePanel({
                tabBar: {
                    items: [{
                        xtype: 'button',
                        text: 'Test'
                    }]
                }
            });

            var tabBar = panel.getTabBar();

            expect(panel.getActiveItem()).toBe(panel.getInnerItems()[0]);
            expect(tabBar.getActiveTab()).toBe(tabBar.getInnerItems()[0]);
        });

        it('should not change tabs on non-tab click', function() {
            makePanel({
                layout: {
                    animation: false
                },
                tabBar: {
                    items: [{
                        xtype: 'button',
                        text: 'Test'
                    }]
                }
            });

            var tabBar = panel.getTabBar(),
                button = tabBar.child('button[text=Test]');

            jasmine.fireMouseEvent(button.el, 'click');

            expect(panel.getActiveItem()).toBe(panel.getInnerItems()[0]);
            expect(tabBar.getActiveTab()).toBe(tabBar.getInnerItems()[0]);
        });

        it('should change tabs on tab click', function() {
            makePanel({
                layout: {
                    animation: false
                },
                tabBar: {
                    items: [{
                        xtype: 'button',
                        text: 'Test'
                    }]
                }
            });

            var tabBar = panel.getTabBar(),
                tab = tabBar.getComponent(1);

            jasmine.fireMouseEvent(tab.el, 'click');

            expect(panel.getActiveItem()).toBe(panel.getInnerItems()[1]);
            expect(tabBar.getActiveTab()).toBe(tabBar.getInnerItems()[1]);
        });
    });

    describe("tabBarPosition", function() {
        it("should dock the tabBar to the top when tabBarPosition is 'top'", function() {
            createTabPanelWithTabs(1);
            expect(panel.getTabBar().getDocked()).toBe('top');
        });

        it("should dock the tabBar to the right when tabBarPosition is 'right'", function() {
            createTabPanelWithTabs(1, {
                tabBarPosition: 'right'
            });
            expect(panel.getTabBar().getDocked()).toBe('right');
        });

        it("should dock the tabBar to the bottom when tabBarPosition is 'bottom'", function() {
            createTabPanelWithTabs(1, {
                tabBarPosition: 'bottom'
            });
            expect(panel.getTabBar().getDocked()).toBe('bottom');
        });

        it("should dock the tabBar to the left when tabBarPosition is 'left'", function() {
            createTabPanelWithTabs(1, {
                tabBarPosition: 'left'
            });
            expect(panel.getTabBar().getDocked()).toBe('left');
        });

        it("should set the tab rotated to left when tabRotation :'left'", function() {
            var tabaBar, tab;

            createTabPanelWithTabs(1, {
                tabRotation: 'left'
            });
            tabaBar = panel.getTabBar();
            tab = panel.getTabBar().getInnerAt(0);

            expect(tabaBar.getDocked()).toBe('top');
            expect(tab.hasCls(tab._positionCls)).toBe(true);
            expect(tabaBar.getTabRotation()).toBe('left');
            expect(tab.getRotation()).toBe('left');
            expect(tab.hasCls('x-tab-rotate-left')).toBe(true);
        });

        it("should set tabBarPosition after rendering", function() {
            createTabPanelWithTabs(1);

            panel.setTabBarPosition('left');
            expect(panel.getTabBar().getDocked()).toBe('left');
        });

        it("should set the tab rotated according to the config after rendered", function() {
            var tabBar, tab;

            createTabPanelWithTabs(1, {
                tabRotation: 'right'
            });
            tabBar = panel.getTabBar();
            tab = panel.getTabBar().getInnerAt(0);

            expect(tabBar.getDocked()).toBe('top');
            expect(tab.hasCls('x-tab-position-top')).toBe(true);
            expect(tab.getRotation()).toBe('right');
            expect(tab.hasCls('x-tab-rotate-right')).toBe(true);

            expect(tabBar.getTabRotation()).toBe('right');
            expect(tab.getRotation()).toBe('right');
            expect(tab.hasCls('x-tab-rotate-right')).toBe(true);

            panel.setTabBarPosition('left');
            expect(tabBar.getDocked()).toBe('left');
            expect(tab.getTabPosition()).toBe('left');
            expect(tab.hasCls('x-tab-position-left')).toBe(true);

            tabBar.setTabRotation('none');
            expect(tabBar.getTabRotation()).toBe('none');
            expect(tab.getRotation()).toBe('none');
            expect(tab.hasCls('x-tab-rotate-none')).toBe(true);
        });
    });
});
