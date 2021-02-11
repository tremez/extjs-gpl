topSuite("Ext.dataview.listswiper.Accordion", [
    'Ext.dataview.listswiper.ListSwiper',
    'Ext.dataview.List', 'Ext.data.ArrayStore', 'Ext.layout.Fit'
], function() {
    var helper = Ext.testHelper,
        view;

    function makeView(config) {
        view = Ext.create(Ext.merge({
            xtype: 'list',
            renderTo: Ext.getBody(),
            itemTpl: '{value}',
            plugins: {
                type: 'listswiper',
                widget: {
                    xtype: 'listswiperaccordion'
                }
            },
            store: {
                data: [{
                        value: 'Item 1'
                    },
                    {
                        value: 'Item 2'
                    },
                    {
                        value: 'Item 3'
                    },
                    {
                        value: 'Item 4'
                    }
                ]
            }
        }, config || {}));

        view.refresh();

        return view;
    }

    function swipe(item, direction, distance, maintain) {
        var el = item.el || item.element,
            dx = (distance || 0) * (direction === 'left' ? -1 : 1),
            x = direction === 'left' ? el.getWidth() : 0,
            y = item.el.getHeight() / 2;

        helper.touchStart(el, {
            x: x,
            y: y
        });

        helper.touchMove(el, {
            x: x + dx,
            y: y
        });

        if (!maintain) {
            helper.touchEnd(el, {
                x: x + dx,
                y: y
            });
        }
    }

    afterEach(function() {
        view = view.destroy();
    });

    describe("interaction states", function() {
        it('should not allow swipe left when state is undo', function() {
            var swiperItem,
                list = makeView({
                    height: 256,
                    width: 256,
                    plugins: {
                        right: [{
                            iconCls: 'x-fa fa-envelope',
                            ui: 'alt confirm',
                            commit: 'onMessage'
                        }, {
                            iconCls: 'x-fa fa-phone',
                            ui: 'alt action',
                            commit: 'onCall',
                            undoable: true
                        }, {
                            iconCls: 'x-fa fa-trash',
                            ui: 'alt decline',
                            undoable: true
                        }]
                    }
                }),
                store = list.getStore(),
                item = list.getItemAt(0);

            swipe(item, 'left', 256);
            swiperItem = list.getItemAt(0).$swiperWidget;
            swiperItem.setState('undo');
            swipe(item, 'left', 256);
            expect(swiperItem.getState()).toBe('undo');
        });
    });
});
