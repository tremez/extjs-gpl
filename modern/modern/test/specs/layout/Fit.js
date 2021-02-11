describe("Ext.layout.Fit", function() {
    var ct, item;

    afterEach(function() {
        ct = Ext.destroy(ct);
    });

    describe("configured size", function() {
        function create(itemConfig) {
            ct = new Ext.Container({
                layout: 'fit',
                renderTo: Ext.getBody(),
                height: 100,
                width: 100,
                items: Ext.apply({
                    xtype: 'component'
                }, itemConfig)
            });

            item = ct.items.getAt(0);
        }

        it("should size an unsized item", function() {
            create();

            expect(item.element.getWidth()).toBe(100);
            expect(item.element.getHeight()).toBe(100);
        });

        // TODO: enable this spec once the following issue is fixed.
        // https://bugs.webkit.org/show_bug.cgi?id=137730
        // UPDATE - these are failing on IE11, Edge, FF and Chrome (latest on Oct 2018),
        // so I suspect this is not per-flexbox spec
        xit("should grow a sized item", function() {
            create({
                width: 50,
                height: 50
            });

            expect(item.element.getWidth()).toBe(100);
            expect(item.element.getHeight()).toBe(100);
        });

        // TODO: enable this spec once the following issue is fixed.
        // https://bugs.webkit.org/show_bug.cgi?id=137730
        xit("should shrink a sized item", function() {
            create({
                width: 150,
                height: 150
            });

            expect(item.element.getWidth()).toBe(100);
            expect(item.element.getHeight()).toBe(100);
        });
    });

    describe("shrink wrap both dimensions", function() {
        function create(itemConfig) {
            ct = new Ext.Container({
                layout: 'fit',
                floated: true,
                items: Ext.apply({
                    xtype: 'component'
                }, itemConfig)
            });

            item = ct.items.getAt(0);

            ct.show();
        }

        it("should shrink wrap an unsized item", function() {
            create({
                html: '<div style="height: 50px; width: 50px;"></div>'
            });

            expect(item.element.getWidth()).toBe(50);
            expect(item.element.getHeight()).toBe(50);
            expect(ct.element.getWidth()).toBe(50);
            expect(ct.element.getHeight()).toBe(50);
        });

        // TODO: enable this spec once the following issue is fixed.
        // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/13179068/
        (Ext.isEdge ? xit : it)("should shrink wrap a sized item", function() {
            create({
                width: 50,
                height: 50
            });

            expect(item.element.getWidth()).toBe(50);
            expect(item.element.getHeight()).toBe(50);
            expect(ct.element.getWidth()).toBe(50);
            expect(ct.element.getHeight()).toBe(50);
        });
    });

});
