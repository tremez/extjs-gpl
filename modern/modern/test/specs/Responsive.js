topSuite('Ext.Responsive',
    ['Ext.Panel'],
function() {
    var environments = {
            ipad: {
                landscape: {
                    width: 1024,
                    height: 768,
                    orientation: 'landscape'
                },
                portrait: {
                    width: 768,
                    height: 1024,
                    orientation: 'portrait'
                }
            }
        },
        env = environments.ipad.landscape,
        Responsive,
        oldGetOrientation, oldGetViewWidth, oldGetViewHeight, oldResponsiveContext,
        panel;

    function createPanel() {
        panel = Ext.create({
            xtype: 'panel',
            layout: {
                type: 'box'
            },
            width: 600,
            height: 600,
            renderTo: Ext.getBody(),
            referenceHolder: true,

            responsiveFormulas: {
                narrow: function(state) {
                    return state.width < 800;
                }
            },
            responsiveConfig: {
                'width < 800': {
                    layout: {
                        type: 'box',
                        vertical: true
                    }
                },

                'width >= 800': {
                    layout: {
                        type: 'box',
                        vertical: false
                    }
                },

                narrow: {
                    title: 'Title - Narrow'
                },
                '!narrow': {
                    title: 'Title - Not Narrow'
                }
            }
        });
    }

    beforeEach(function() {
        Responsive = Ext.mixin.Responsive;

        oldGetOrientation = Ext.dom.Element.getOrientation;
        oldGetViewWidth = Ext.dom.Element.getViewportWidth;
        oldGetViewHeight = Ext.dom.Element.getViewportHeight;

        oldResponsiveContext = Responsive.context;

        Ext.dom.Element.getOrientation = function() {
            return env.orientation;
        };

        Ext.dom.Element.getViewportWidth = function() {
            return env.width;
        };

        Ext.dom.Element.getViewportHeight = function() {
            return env.height;
        };
    });

    afterEach(function() {
        panel = Ext.destroy(panel);

        env = environments.ipad.landscape; // reset to default

        Ext.dom.Element.getOrientation = oldGetOrientation;
        Ext.dom.Element.getViewportWidth = oldGetViewWidth;
        Ext.dom.Element.getViewportHeight = oldGetViewHeight;

        Responsive.context = oldResponsiveContext;

        expect(Responsive.active).toBe(false);
        expect(Responsive.count).toBe(0);
    });

    describe('creation', function() {
        it('should be created using config object', function() {
            createPanel();

            // tests to make sure plugin didn't set plugin configs
            // onto the component see EXTJS-25719
            expect(panel.getId()).not.toBe('responsive');
        });
    });

    describe('reaction', function() {
        it('should react to viewport change', function() {
            createPanel('responsive');

            var layout = panel.getLayout();

            expect(layout.getVertical()).toBe(false);
            expect(panel.getTitle()).toBe('Title - Not Narrow');

            env = environments.ipad.portrait;
            Responsive.notify();

            expect(layout.getVertical()).toBe(true);
            expect(panel.getTitle()).toBe('Title - Narrow');
        });
    });
});
