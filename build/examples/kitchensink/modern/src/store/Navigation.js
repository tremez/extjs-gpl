// Unused Views:
// animations/Cube.js
// Map.js (Google Maps ux)
// ColorPatterns.js
// GalleryPage.js
// ProfileSwitcher.js
// SourceItem.js
// SourceOverlay.js
//
Ext.define('KitchenSink.store.Navigation', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.navigation',

    // So that a leaf node being filtered in
    // causes its parent to be filtered in too.
    filterer: 'bottomup',

    constructor: function(config) {
        var me = this,
            items = [],
            ver = Ext.getVersion().parts;

        me.ver = new Ext.Version(ver[0] + '.' + ver[1] + '.' + ver[2]); // just 3-digits

        items.push(me.getNavItemsGeneral());
        items.push(me.getNavItemsGrid());
        items.push(me.getNavItemsTrees());
        items.push(me.getNavItemsCharts());
        items.push(me.getNavItemsCalendar());
        items.push(me.getNavItemsGridPivot());
        items.push(me.getNavItemsD3());

        items = {
            text: 'All',
            id: 'all',
            expanded: true,
            description: '<h2>Welcome To Ext JS Kitchen Sink!</h2>' +
                'This application showcases all the components in Ext JS and demonstrates ' +
                'how easy it is to start using them in your applications!',

            children: items
        };

        me.fixUp(items);

        me.callParent([Ext.apply({
            root: items
        }, config)]);
    },

    /**
     * This method is used to fill in missing fields (e.g. iconCls) and also to localize
     * the text and description fields if a translation is available.
     *
     * @param {Object/Object[]} items
     * @param {String} tier
     */
    fixUp: function(items, tier, parent) {
        var me = this,
            item = items,
            i, since;

        if (Ext.isArray(items)) {
            for (i = items.length; i-- > 0;) {
                item = items[i];

                if (item.compat === false) {
                    items.splice(i, 1);
                }
                else {
                    me.fixUp(item, tier, parent);

                    if (parent && (item.isNew || item.hasNew)) {
                        parent.hasNew = true;
                    }
                }
            }
        }
        else {
            since = item.since;

            if (since) {
                item.sinceVer = since = new Ext.Version(since);
                item.isNew = since.gtEq(me.ver);
            }

            tier = item.tier || (item.tier = tier || 'standard');

            if (!('iconCls' in item)) {
                item.iconCls = 'icon-' + item.id;
            }

            if (item.children) {
                me.fixUp(item.children, tier, item);
            }
        }
    },

    getNavItemsCalendar: function() {
        return {
            text: 'Calendar',
            id: 'calendar',
            tier: 'premium',
            since: '6.2.0',

            description: 'The calendar family of components allows you to present ' +
                         'schedules and manage event information.',

            children: [
                { id: 'calendar-panel', text: 'Calendar Panel', leaf: true },
                { id: 'calendar-month-view', text: 'Month View', leaf: true },
                { id: 'calendar-week-view', text: 'Week View', leaf: true },
                { id: 'calendar-days-view', text: 'Days View', leaf: true },
                { id: 'calendar-timezone', text: 'Timezone Support', leaf: true },
                { id: 'calendar-validation', text: 'Drag/Resize Validation', leaf: true }
            ]
        };
    },

    getNavItemsCharts: function() {
        return {
            text: 'Charts',
            id: 'charts',
            expanded: true,

            description: 'With charts you can easily visualize many types of data. Charts ' +
                         'leverage Stores of records and renders their meaningful fields using ' +
                         'lines, bars or other graphical elements.',

            children: [
                this.getNavAreaCharts(),
                this.getNavBarCharts(),
                this.getNav3DBarCharts(),
                this.getNavBoxPlotCharts(),
                this.getNavColumnCharts(),
                this.getNav3DColumnCharts(),
                this.getNavFinancialCharts(),
                this.getNavGaugeCharts(),
                this.getNavLineCharts(),
                this.getNavNavigatorCharts(),
                this.getNavPieCharts(),
                this.getNavRadarCharts(),
                this.getNavScatterCharts(),
                this.getNavCombinationCharts(),
                this.getNavDrawing()
            ]
        };
    },

    getNavColumnCharts: function() {
        return {
            text: 'Column Charts',
            id: 'column-charts',

            description: 'Column chsarts provide a visual comparison of numbers or frequency ' +
                         'against different discrete categories or groups. These charts display ' +
                         'vertical bars to represent information in a way that allows for quick ' +
                         'generalizations regarding your data.',

            children: [
                { id: 'column-basic', text: 'Basic', leaf: true },
                { id: 'column-stacked', text: 'Stacked', leaf: true },
                { id: 'column-stacked-100', text: '100% Stacked', leaf: true },
                { id: 'column-renderer', text: 'With Renderer', leaf: true },
                { id: 'column-multi-axis', text: 'Multiaxis', leaf: true }
            ]
        };
    },

    getNav3DColumnCharts: function() {
        return {
            text: '3D Column Charts',
            id: 'column-charts-3d',
            description: '3D Column charts provide a visual comparison of numbers or frequency ' +
                         'against different discrete categories or groups. These charts display ' +
                         'vertical bars to represent information in a way that allows for quick ' +
                         'generalizations regarding your data.',
            children: [
                { id: 'column-basic-3d', text: 'Basic', leaf: true },
                { id: 'column-grouped-3d', text: 'Grouped', leaf: true },
                { id: 'column-stacked-3d', text: 'Stacked', leaf: true },
                { id: 'column-stacked-100-3d', text: '100% Stacked', leaf: true },
                { id: 'column-negative-3d', text: 'Negative values', leaf: true },
                { id: 'column-renderer-3d', text: 'With Renderer', leaf: true }
            ]
        };
    },

    getNavBarCharts: function() {
        return {
            text: 'Bar Charts',
            id: 'bar-charts',
            description: 'Bar charts provide a visual comparison of numbers or frequency  ' +
                         'against different discrete categories or groups. These charts display ' +
                         'horizontal  bars to represent information in a way that allows for ' +
                         'quick generalizations regarding your data.',
            children: [
                { id: 'bar-basic', text: 'Basic', leaf: true },
                { id: 'bar-stacked', text: 'Stacked', leaf: true },
                { id: 'bar-stacked-100', text: '100% Stacked', leaf: true }
            ]
        };
    },

    getNav3DBarCharts: function() {
        return {
            text: '3D Bar Charts',
            id: 'bar-charts-3d',

            description: '3D Bar charts provide a visual comparison of numbers or frequency ' +
                         'against different discrete categories or groups. These charts display ' +
                         'horizontal bars to represent information in a way that allows for ' +
                         'quick generalizations regarding your data.',
            children: [
                { id: 'bar-basic-3d', text: 'Basic', leaf: true },
                { id: 'bar-stacked-3d', text: 'Stacked', leaf: true },
                { id: 'bar-stacked-100-3d', text: '100% Stacked', leaf: true },
                { id: 'bar-negative-3d', text: 'Negative values', leaf: true }
            ]
        };
    },

    getNavLineCharts: function() {
        return {
            text: 'Line Charts',
            id: 'line-charts',

            description: 'Line charts display information as a series of markers that ' +
                         'are connected by lines. These charts are excellent for showing ' +
                         'underlying patterns between data points.',
            children: [
                { id: 'line-basic', text: 'Basic', leaf: true },
                { id: 'line-marked', text: 'Basic + Markers', leaf: true },
                { id: 'line-spline', text: 'Spline', leaf: true },
                { id: 'line-marked-spline', text: 'Spline + Markers', leaf: true },
                { id: 'line-plot', text: 'Plot', leaf: true },
                { id: 'line-markers', text: 'With Image Markers', leaf: true },
                { id: 'line-crosszoom', text: 'With Zoom', leaf: true },
                { id: 'line-renderer', text: 'With Renderer', leaf: true },
                { id: 'line-real-time-date', text: 'Real-time', leaf: true }
                // { id: 'line-real-time-number', text: 'Real-time (number), leaf: true }
            ]
        };
    },

    getNavAreaCharts: function() {
        return {
            text: 'Area Charts',
            id: 'area-charts',

            description: 'Area charts display data by differentiating the area between lines. ' +
                         'They are often  used to measure trends by representing totals over time.',
            children: [
                { id: 'area-basic', text: 'Basic', leaf: true },
                { id: 'area-stacked', text: 'Stacked', leaf: true },
                { id: 'area-stacked-100', text: '100% Stacked', leaf: true },
                { id: 'area-negative', text: 'Negative Values', leaf: true }
            ]
        };
    },

    getNavScatterCharts: function() {
        return {
            text: 'Scatter Charts',
            id: 'scatter-charts',
            description: 'Scatter charts are diagrams that are used to display data as a ' +
                         'collection of points. They are perfect for showing multiple ' +
                         'measurements to aid in finding correlation  between variables.',
            children: [
                { id: 'scatter-basic', text: 'Basic', leaf: true },
                { id: 'scatter-custom-icons', text: 'Custom Icons', leaf: true },
                { id: 'scatter-bubble', text: 'Bubble', leaf: true }
            ]
        };
    },

    getNavFinancialCharts: function() {
        return {
            text: 'Financial Charts',
            id: 'financial-charts',
            description: 'Financial charts provide a simple method for showing the change ' +
                         'in price over time.  A quick look at these charts provides ' +
                         'information regarding financial highs, lows,  opens, and closes.',

            children: [
                { id: 'financial-candlestick', text: 'Candlestick', leaf: true },
                { id: 'financial-ohlc', text: 'OHLC', leaf: true }
            ]
        };
    },

    getNavPieCharts: function() {
        return {
            text: 'Pie Charts',
            id: 'pie-charts',
            description: 'Pie charts show sectors of data proportional to the whole. They ' +
                         'are excellent for  providing a quick and simple comparison of a ' +
                         'category to the whole.',
            children: [
                { id: 'pie-basic', text: 'Basic', leaf: true },
                { id: 'pie-custom', text: 'Spie', leaf: true },
                { id: 'pie-donut', text: 'Donut', leaf: true },
                { id: 'pie-double-donut', text: 'Double Donut', leaf: true },
                { id: 'pie-3d', text: '3D Pie', leaf: true }
            ]
        };
    },

    getNavRadarCharts: function() {
        return {
            text: 'Radar Charts',
            id: 'radar-charts',
            description: 'Radar charts offer a flat view of data involving multiple variable ' +
                         'quantities. They are  generally used to show performance metrics ' +
                         'because they easily emphasize strengths and  weaknesses from a ' +
                         'simple two-dimensional perspective.',
            children: [
                { id: 'radar-basic', text: 'Basic', leaf: true },
                { id: 'radar-filled', text: 'Filled', leaf: true },
                { id: 'radar-marked', text: 'Marked', leaf: true },
                { id: 'radar-multi-axis', text: 'Multiaxis', leaf: true }
            ]
        };
    },

    getNavGaugeCharts: function() {
        return {
            text: 'Gauge Charts',
            id: 'gauge-charts',

            description: 'Gauge charts contain a single value axis that provides simple ' +
                         'visualization for dashboards. They are generally used to show ' +
                         'the current status or heartbeat with a single point of data.',
            children: [
                { id: 'gauge-basic', text: 'Basic', leaf: true },
                { id: 'gauge-sectors', text: 'Sectors', leaf: true }
            ]
        };
    },

    getNavNavigatorCharts: function() {
        return {
            text: 'Navigator',
            id: 'navigator-charts',

            description: '',
            children: [
                { id: 'navigator-line', text: 'Line Chart', leaf: true }
            ]
        };
    },

    getNavBoxPlotCharts: function() {
        return {
            text: 'Box Plot',
            id: 'boxplot-charts',

            description: '',
            children: [
                { id: 'boxplot-nobel', text: 'Nobel Prize', leaf: true }
            ]
        };
    },

    getNavCombinationCharts: function() {
        return {
            text: 'Combination Charts',
            id: 'combination-charts',

            description: 'Sencha Charts gives you the ability to easily join several ' +
                         'chart types into one chart. This gives developers the ability ' +
                         'to show multiple series in a single view.',
            children: [
                { id: 'combination-pareto', text: 'Pareto', leaf: true },
                { id: 'combination-dashboard', text: 'Interactive Dashboard', leaf: true },
                // { id: 'unemployment', text: 'Infographic', leaf: true },
                { id: 'combination-theme', text: 'Custom Theme', leaf: true },
                { id: 'combination-bindingtabs', text: 'Binding & Tabs', leaf: true }
            ]
        };
    },

    getNavDrawing: function() {
        return {
            text: 'Drawing',
            id: 'drawing',

            description: 'The Sencha Draw package allows developers to create cross-browser ' +
                         'compatible and mobile friendly graphics, text, and shapes. You can ' +
                         'even create a standalone drawing tool!',
            children: [
                { id: 'free-paint', text: 'Free Paint', leaf: true },
                { id: 'draw-bounce', text: 'Bouncing Logo', leaf: true },
                { id: 'hit-test', text: 'Hit Testing', leaf: true },
                { id: 'intersections', text: 'Path Intersections', leaf: true },
                { id: 'draw-composite', text: 'Composite', leaf: true },
                { id: 'sprite-events', text: 'Sprite Events', leaf: true },
                { id: 'easing-functions', text: 'Easing Functions', leaf: true }
            ]
        };
    },

    getNavItemsD3: function() {
        return {
            text: 'D3',
            id: 'd3',
            expanded: true,
            tier: 'premium',
            since: '6.2.0',

            description: 'Ext JS seamlessly integrates with D3, so you can visualize ' +
                         'your stores simply by binding them to D3 components.',

            children: [
                this.getD3HierarchyData(),
                this.getD3HeatmapData(),
                this.getD3CustomSVGData(),
                this.getD3CustomCanvasData()
            ]
        };
    },

    getD3HierarchyData: function() {
        return {
            id: 'd3-hierarchy',
            text: 'Hierarchy',

            description: 'This set of stock components uses D3\'s hierarchical layouts ' +
                         'to render tree stores.',

            children: [
                { id: 'd3-view-tree', text: 'Tree', leaf: true },
                { id: 'd3-view-sencha-tree', text: 'Org Chart', leaf: true },
                { id: 'd3-view-treemap', text: 'Treemap', leaf: true },
                { id: 'd3-view-treemap-tooltip', text: 'Treemap Tooltip', leaf: true },
                {
                    id: 'd3-view-treemap-pivot-configurator',
                    text: 'Configurable Pivot TreeMap',
                    leaf: true
                },
                { id: 'd3-view-pack', text: 'Pack', leaf: true },
                { id: 'd3-view-words', text: 'Words', leaf: true, compat: !Ext.platformTags.phone },
                {
                    id: 'd3-view-sunburst',
                    text: 'Sunburst',
                    leaf: true,
                    compat: !Ext.platformTags.phone
                },
                { id: 'd3-view-sunburst-zoom', text: 'Zoomable Sunburst', leaf: true }
            ]
        };
    },

    getD3HeatmapData: function() {
        return {
            id: 'd3-heatmap',
            text: 'Heatmap',

            description: 'The hierarchy component can visualize matrices ' +
                         'where individual values are represented as colors.',

            children: [
                { id: 'd3-view-heatmap-purchases', text: 'Purchases by Day', leaf: true },
                { id: 'd3-view-heatmap-sales', text: 'Sales Per Employee', leaf: true },
                { id: 'd3-view-heatmap-pivot', text: 'Pivot Heatmap', leaf: true },
                {
                    id: 'd3-view-heatmap-pivot-configurator',
                    text: 'Configurable Pivot Heatmap',
                    leaf: true
                }
            ]
        };
    },

    getD3CustomSVGData: function() {
        return {
            id: 'd3-svg',
            text: 'Custom SVG',

            description: 'Custom SVG visualizations can be easily created by using ' +
                         'the "d3" component directly.',

            children: [
                { id: 'd3-view-transitions', text: 'Transitions', leaf: true },
                {
                    id: 'd3-view-day-hour-heatmap',
                    text: 'Day / Hour Heatmap',
                    leaf: true,
                    compat: !Ext.platformTags.phone
                }
            ]
        };
    },

    getD3CustomCanvasData: function() {
        return {
            id: 'd3-canvas',
            text: 'Custom Canvas',

            description: 'Custom Canvas visualizations can be easily created by ' +
                         'using the "d3-canvas" component directly.',

            children: [
                { id: 'd3-view-particles', text: 'Particles', leaf: true }
            ]
        };
    },

    getNavItemsData: function() {
        return {
            text: 'Data',
            id: 'Data',
            iconCls: 'icon-direct-named',
            description: 'Examples demonstrating ExtJS HTTP request types',

            children: [
                { id: 'nestedloading', text: 'Nested Loading', leaf: true },
                { id: 'jsonp', text: 'JSONP', leaf: true },
                // { id: 'yql', text: 'YQL', leaf: true },
                { id: 'ajax', text: 'Ajax', leaf: true }
            ]
        };
    },

    getNavItemsIcons: function() {
        return {
            text: 'Icons',
            id: 'Icons',
            iconCls: 'icon-layout-card',
            description: 'Ext JS provides a wide variety of icons.',

            children: [
                { id: 'fa-icons', text: 'Font Awesome Icons', leaf: true },
                { id: 'vector-icons', text: 'Vector Icons', leaf: true }
            ]
        };
    },

    getNavItemsMaps: function() {
        return {
            text: 'Maps',
            id: 'map',
            expanded: true,
            iconCls: 'x-fa fa-globe',
            description: 'Ext JS map component',

            children: [
                {
                    id: 'map-basic',
                    iconCls: 'x-fa fa-map',
                    text: 'Basic',
                    leaf: true,
                    packages: ['kitchensink-google']
                }
            ]
        };
    },

    getNavItemsMedia: function() {
        return {
            text: 'Media',
            id: 'Media',
            iconCls: 'x-fa fa-video',
            description: 'Ext JS multimedia components',

            children: [
                { id: 'audio-basic', text: 'Audio', leaf: true },
                { id: 'video-basic', text: 'Video', leaf: true }
            ]
        };
    },

    getNavItemsGeneral: function() {
        var me = this;

        return {
            text: 'Components',
            id: 'components',
            iconCls: 'icon-state-saving',
            description: 'Ext JS provides a wide variety of other, simpler components.',

            children: [
                { id: 'animations', text: 'Animations', leaf: true },
                me.getNavItemsButtons(),
                me.getNavItemsCarousel(),
                { id: 'color-selector', text: 'Color Picker', leaf: true },
                me.getNavItemsData(),
                me.getNavItemsDataBinding(),
                me.getNavItemsDataView(),
                me.getNavItemsDragDrop(),
                me.getNavItemsEnterprise(),
                me.getNavItemsExtDirect(),
                // me.getNavItemsFormFields(),
                me.getNavItemsForms(),
                // me.getNavItemsPanelsWindows(),
                me.getNavItemsGauge(),
                me.getNavItemsIcons(),
                me.getNavItemsLayouts(),
                me.getNavItemsLists(),
                me.getNavItemsMaps(),
                me.getNavItemsMedia(),
                me.getMenus(),
                me.getNavItemsPanels(),
                me.getNavItemsPopups(),
                me.getNavItemsProgressBars(),
                me.getNavItemsTabs(),
                me.getNavItemsToolbars(),
                me.getNavItemsTips(),
                { id: 'touch-events', text: 'Touch Events', leaf: true },
                {
                    id: 'virtual-scroller',
                    iconCls: 'icon-drag-drop',
                    text: 'Virtual Scroller',
                    leaf: true
                },
                {
                    id: 'froala-editor',
                    iconCls: 'icon-editor',
                    text: 'Froala Editor',
                    leaf: true
                }
            ]
        };
    },

    getMenus: function() {
        return {
            text: 'Menu',
            id: 'menu',
            iconCls: 'x-fa fa-bars',
            description: 'Menu examples',

            children: [
                { id: 'menus', iconCls: 'x-fa fa-bars', text: 'Menus', leaf: true },
                { id: 'actionsheets', text: 'Action Sheets', leaf: true }
            ]
        };
    },

    getNavItemsPopups: function() {
        return {
            text: 'Popups',
            id: 'popups',
            iconCls: 'icon-windows',
            description: 'Popup dialog/toast examples',

            children: [
                { id: 'basic-dialog', text: 'Basic Dialog', leaf: true },
                // { id: 'message-box', text: 'Msg Box', leaf: true },
                { id: 'overlays', text: 'Overlays', leaf: true },
                { id: 'toast-view', text: 'Toast', leaf: true }
            ]
        };
    },

    getNavItemsTips: function() {
        return {
            text: 'Tooltips',
            id: 'tooltips',
            iconCls: 'icon-tooltips',
            compat: !Ext.platformTags.phone,
            description: 'Tooltip examples',

            children: [
                { id: 'anchored-tooltips', text: 'Anchored ToolTips', leaf: true },
                {
                    id: 'mousetrack-tooltips',
                    text: 'Mouse Tracking ToolTips',
                    leaf: true,
                    compat: Ext.platformTags.desktop
                },
                { id: 'html-tooltips', text: 'Tooltips embedded in HTML', leaf: true },
                { id: 'tip-aligning', text: 'Tooltip align options', leaf: true },
                { id: 'closable-tooltips', text: 'Closable ToolTips', leaf: true }
            ]
        };
    },

    getNavItemsGauge: function() {
        return {
            text: 'Gauges',
            id: 'gauges',
            iconCls: 'icon-gauge-charts',

            description: 'The gauge component is a flexible progress bar that displays ' +
                         'its value in a circular form. The gauge is similar to a gauge chart ' +
                         'except that there is no axis.',
            children: [
                {
                    id: 'default-gauge',
                    iconCls: 'icon-gauge-basic',
                    text: 'Basic Gauge',
                    leaf: true
                },
                {
                    id: 'needle-gauge',
                    iconCls: 'icon-gauge-basic',
                    text: 'Needle Gauge',
                    leaf: true
                },
                {
                    id: 'custom-needle-gauge',
                    iconCls: 'icon-gauge-basic',
                    text: 'Custom Needle Gauge',
                    leaf: true
                }
            ]
        };
    },

    getNavItemsButtons: function() {
        return {
            text: 'Buttons',
            id: 'buttons',
            description: '',
            children: [
                { id: 'buttons-basic', iconCls: 'icon-buttons', text: 'Basic Buttons', leaf: true },
                { id: 'buttons-extra', iconCls: 'icon-buttons', text: 'Extra Buttons', leaf: true },
                { id: 'buttons-split', iconCls: 'icon-buttons', text: 'Split Buttons', leaf: true },
                {
                    id: 'buttons-split-bottom',
                    iconCls: 'icon-buttons',
                    text: 'Split Bottom Buttons',
                    leaf: true
                },
                {
                    id: 'buttons-segmented',
                    iconCls: 'icon-buttons',
                    text: 'Segmented Buttons',
                    leaf: true
                }
            ]
        };
    },

    getNavItemsCarousel: function() {
        return {
            text: 'Carousel',
            id: 'carousel',

            description: '',
            children: [
                {
                    id: 'carousel-basic',
                    iconCls: 'x-fa fa-ellipsis-h',
                    text: 'Basic Carousel',
                    leaf: true
                },
                {
                    id: 'carousel-vertical',
                    iconCls: 'x-fa fa-ellipsis-v',
                    text: 'Vertical Carousel',
                    leaf: true
                }
            ]
        };
    },

    getNavItemsProgressBars: function() {
        return {
            text: 'Progress Bars',
            id: 'progress-bar',

            description: '',
            children: [
                {
                    id: 'progress-basic',
                    text: 'Basic',
                    leaf: true
                },
                {
                    id: 'progress-decorated',
                    text: 'Decorated',
                    leaf: true
                }
            ]
        };
    },

    getNavItemsPanels: function() {
        return {
            text: 'Panels',
            id: 'panels',
            description: 'Panel is a specialized container that introduces extra ' +
                         'functionality such as headers, resizing and collapsing.',
            children: [
                { id: 'panel-basic', text: 'Basic Panel', leaf: true },
                {
                    id: 'panel-accordion',
                    iconCls: 'icon-layout-accordion',
                    text: 'Accordion',
                    leaf: true
                },
                {
                    id: 'panel-handleresize',
                    text: 'Resizable - Handle',
                    leaf: true,
                    compat: !Ext.platformTags.phone
                },
                {
                    id: 'panel-splitresize',
                    text: 'Resizable - Split',
                    leaf: true,
                    compat: !Ext.platformTags.phone
                },
                {
                    id: 'panel-headerposition',
                    text: 'Header Position',
                    leaf: true
                },
                { id: 'panel-collapsible', text: 'Collapsible', leaf: true },
                {
                    id: 'panel-complex-collapsible',
                    text: 'Complex Collapsible',
                    leaf: true,
                    compat: !Ext.platformTags.phone
                },
                { id: 'panel-time', text: 'Time Panel', leaf: true },
                { id: 'panel-date', text: 'Basic Date Panel', leaf: true },
                {
                    id: 'panel-date-adv',
                    text: 'Advanced Date Panel',
                    leaf: true,
                    compat: !Ext.platformTags.phone
                }
            ]
        };
    },

    getNavItemsDataBinding: function() {
        return {
            text: 'Data Binding',
            id: 'data-binding',
            description: 'Data binding, and the ViewModel that powers it, are powerful ' +
                         'pieces of Ext JS. Together, they enable you to create a seamless ' +
                         'connection between your application UI  and your business logic.',
            children: [
                { id: 'binding-hello-world', text: 'Hello World', leaf: true },
                { id: 'binding-dynamic', text: 'Dynamic', leaf: true },
                { id: 'binding-two-way', text: 'Two Way', leaf: true },
                { id: 'binding-formulas', text: 'Formulas', leaf: true },
                { id: 'binding-associations', text: 'Associations', leaf: true },
                { id: 'binding-component-state', text: 'Component State', leaf: true },
                { id: 'binding-chained-stores', text: 'Chaining Stores', leaf: true },
                { id: 'binding-combo-chaining', text: 'Chained Select', leaf: true },
                { id: 'binding-selection', text: 'Selection', leaf: true },
                { id: 'binding-form', text: 'Slider and Form Fields', leaf: true },
                // { id: 'binding-gridform', text: 'Grid + Form', leaf: true },
                { id: 'binding-model-validation', text: 'Model Validation', leaf: true },
                { id: 'binding-field-validation', text: 'Field Validation', leaf: true },
                { id: 'binding-two-way-formulas', text: 'Two-Way Formulas', leaf: true },
                // { id: 'binding-child-session', text: 'Isolated Child Sessions', leaf: true },
                { id: 'binding-algebra-binary', text: 'Binary Operators', leaf: true },
                { id: 'binding-algebra-ternary', text: 'Ternary Operators', leaf: true },
                { id: 'binding-algebra-formatters', text: 'Formatters', leaf: true },
                { id: 'binding-algebra-unary', text: 'Unary Operators', leaf: true }
            ]
        };
    },

    getNavItemsDataView: function() {
        return {
            text: 'DataView',
            id: 'data-view',

            description: 'Dataviews are an XTemplate based mechanism for displaying ' +
                         'data using custom layout templates and formatting. They can ' +
                         'connect to any store and display data in any way you see fit.',
            children: [
                { id: 'dataview-basic', text: 'Basic', leaf: true },
                { id: 'dataview-multisort', text: 'Multisort', leaf: true },
                { id: 'dataview-horizontal', text: 'Horizontal', leaf: true },
                { id: 'dataview-inline', text: 'Inline', leaf: true }
            ]
        };
    },

    getNavItemsDragDrop: function() {
        return {
            text: 'Drag & Drop',
            id: 'drag-drop',

            description: 'Drag and Drop functionality gives developers the ability to ' +
                         'create interactive interfaces for their users.',

            children: [
                { id: 'drag-simple', text: 'Simple', leaf: true },
                { id: 'drag-constraint', text: 'Constraints', leaf: true },
                { id: 'drag-proxy', text: 'Proxies', leaf: true },
                { id: 'drag-handle', text: 'Handles', leaf: true },
                { id: 'drag-group', text: 'Groups', leaf: true },
                { id: 'drag-data', text: 'Data', leaf: true },
                {
                    id: 'drag-file',
                    text: 'Files',
                    iconCls: 'icon-drag-drop-element',
                    leaf: true,
                    compat: Ext.platformTags.desktop
                }

            ]
        };
    },

    getNavItemsExtDirect: function() {
        return {
            text: 'Ext Direct',
            id: 'direct',

            description: 'Ext Direct streamlines communication between the client ' +
                         'and server by providing a single interface that reduces much ' +
                         'of the common code required to validate and handle data.',

            children: [
                { id: 'direct-grid', text: 'Grid with Direct store', leaf: true },
                { id: 'direct-tree', text: 'Tree with dynamic nodes', leaf: true },
                { id: 'direct-form', text: 'Form load and submit actions', leaf: true },
                { id: 'direct-generic', text: 'Generic remoting and polling', leaf: true },
                { id: 'direct-named', text: 'Custom form processing', leaf: true }
            ]
        };
    },

    getNavItemsEnterprise: function() {
        return {
            text: 'Enterprise',
            id: 'enterprise',

            description: 'Our Enterprise tools offer developers the ability to easily ' +
                         'utilize data interfaces such as SOAP and AMF.',

            children: [
                { id: 'amf-zero', iconCls: 'icon-amf-one', text: 'AMF0 Format', leaf: true },
                { id: 'amf-three', iconCls: 'icon-amf-three', text: 'AMF3 Format', leaf: true },
                { id: 'soap', iconCls: 'icon-soap-grid', text: 'SOAP', leaf: true }
            ]
        };
    },

    getNavItemsForms: function() {
        return {
            text: 'Forms',
            id: 'forms',
            description: 'Form Panel extends panel to offer developers the ability ' +
                         'to manage data collection in a simple and straightforward manner. ' +
                         'Field display and handling can be configured in almost any conceivable ' +
                         'fashion and offers default objects to minimize repetitive code.',
            children: [
                { id: 'form-login', text: 'Login Form', leaf: true },
                { id: 'form-contact', text: 'Contact Form', leaf: true },
                { id: 'form-register', text: 'Register Form', leaf: true },
                { id: 'form-email', iconCls: 'icon-form-contact', text: 'Email Form', leaf: true },
                { id: 'form-checkout', text: 'Checkout Form', leaf: true },
                // { id: 'form-rating', text: 'Rating Form', leaf: true},
                // { id: 'form-vboxlayout', text: 'VBox Layout', leaf: true },
                { id: 'form-hboxlayout', text: 'HBox Layout', leaf: true },
                { id: 'form-fieldui', text: 'Field UIs', leaf: true },
                // { id: 'form-containerfield', text: 'Container Field', leaf: true },
                // { id: 'form-multicolumn', text: 'Multi Column Form', leaf: true },
                // { id: 'form-xml', text: 'XML Form', leaf: true },
                // { id: 'form-advtypes', text: 'Custom VTypes', leaf: true },
                // { id: 'form-customfields', text: 'Custom fields', leaf: true },
                { id: 'form-forumsearch', text: 'Forum Search', leaf: true },
                { id: 'form-errortargets', text: 'Field Error Targets', leaf: true },
                { id: 'form-customerrors', text: 'Custom Error Handling', leaf: true },
                { id: 'form-panel', text: 'Form Panel', leaf: true },
                { id: 'form-masks', text: 'Field input mask', leaf: true },
                { id: 'form-validation', text: 'Form Validation', leaf: true },
                { id: 'field-validation', text: 'Field Validation', leaf: true },
                { id: 'field-validation-adv', text: 'Advanced Field Validation', leaf: true },
                { id: 'form-sliders', text: 'Sliders', leaf: true },
                { id: 'form-placeholder', text: 'Label as Placeholder', leaf: true },
                {
                    id: 'form-remote-combo',
                    text: 'Remote ComboBox',
                    leaf: true,
                    compat: Ext.platformTags.desktop
                },
                { id: 'form-interactive-combo', text: 'Interactive ComboBox',
                  compat: false, leaf: true },
                { id: 'form-checkboxgroup', text: 'Checkbox Groups', leaf: true },
                { id: 'form-radiogroup', text: 'Radio Groups', leaf: true }
            ]
        };
    },

    getNavItemsLayouts: function() {
        return {
            text: 'Layouts',
            id: 'layouts',

            description: 'Layouts can be considered the heart and soul of Ext JS. ' +
                         'They manage the DOM flow and display of your content. There ' +
                         'are multiple layout options that should satisfy almost any ' +
                         'application wireframe.',
            children: [
                // { id: 'layout-absolute', text: 'Absolute Layout', leaf: true },
                // { id: 'layout-border', text: 'Border Layout', leaf: true },
                { id: 'layout-card', text: 'Card Layout', leaf: true },
                { id: 'layout-card-indicator', text: 'Card with Indicator', leaf: true },
                { id: 'layout-cardtabs', text: 'Card (Tabs)', leaf: true },
                { id: 'layout-center', text: 'Center Layout', leaf: true },
                // { id: 'layout-column', text: 'Column Layout', leaf: true },
                { id: 'layout-fit', text: 'Fit Layout', leaf: true },
                { id: 'layout-form', text: 'Form Layout', leaf: true },
                { id: 'layout-horizontal-box', text: 'HBox Layout', leaf: true },
                // { id: 'layout-table', text: 'Table Layout', leaf: true },
                { id: 'layout-vertical-box', text: 'VBox Layout', leaf: true }
                // { id: 'layout-box', text: 'Interactive Box', leaf: true }
            ]
        };
    },

    getNavItemsTabs: function() {
        return {
            text: 'Tabs',
            id: 'tabs',

            description: 'Tab Panels are panels that have extended support for containing ' +
                         'and displaying children items. These children are managed using ' +
                         'a Card Layout and are shown as tabulated content.',
            children: [
                { id: 'basic-tabs', text: 'Basic Tabs', leaf: true },
                { id: 'bottom-tabs', text: 'Bottom Tabs', leaf: true },
                { id: 'overflow-tabs', text: 'Overflow Scroller Tabs', leaf: true },
                // { id: 'plain-tabs', text: 'Plain Tabs', leaf: true },
                // { id: 'framed-tabs', text: 'Framed Tabs', leaf: true },
                { id: 'icon-tabs', text: 'Icon Tabs', leaf: true },
                // { id: 'ajax-tabs', text: 'Ajax Tabs', leaf: true },
                { id: 'advanced-tabs', text: 'Advanced Tabs', leaf: true }
                // { id: 'lazy-tabs', text: 'Lazy Instantiating Tabs', leaf: true},
                // { id: 'navigation-tabs', text: 'Navigation Tabs', leaf: true },
                // { id: 'side-navigation-tabs', text: 'Side Navigation Tabs', leaf: true },
                // { id: 'header-tabs', text: 'Header Tabs', leaf: true },
                // { id: 'reorderable-tabs', text: 'Reorderable Tabs', leaf: true }
            ]
        };
    },

    getNavItemsToolbars: function() {
        return {
            text: 'Toolbars',
            id: 'toolbars',

            description: 'Toolbars are easily customizable components that give ' +
                         'developers a simple way to display a variety of user interfaces.',
            children: [
                { id: 'basic-toolbar', text: 'Toolbar', leaf: true },
                { id: 'docked-toolbars', text: 'Docked Toolbar', leaf: true },
                { id: 'breadcrumb-toolbar', text: 'Breadcrumb Toolbar', leaf: true },
                {
                    id: 'toolbar-overflow',
                    text: 'Toolbar Overflow',
                    leaf: true,
                    compat: !Ext.platformTags.phone
                },
                // { id: 'statusbar-demo', text: 'StatusBar', leaf: true },
                { id: 'toolbar-menus', text: 'Toolbar with Menus', leaf: true }
            ]
        };
    },

    /**
     *
     */
    getNavItemsGrid: function() {
        return {
            text: 'Grids',
            id: 'grids',
            expanded: true,

            description: 'Grids are one of the centerpieces of Ext JS. They are ' +
                         'incredibly versatile components that provide an easy path ' +
                         'to display, sort, group, and edit data. These examples show a ' +
                         'number of the most often used grids in Ext JS.',

            children: [
                this.getNavItemsGridBasic(),
                this.getNavItemsGridAddons(),
                this.getNavItemsGridAdvanced()
            ]
        };
    },

    getNavItemsGridAdvanced: function() {
        return {
            text: 'Advanced Features',
            id: 'grid-advanced',
            iconCls: 'icon-grid-plugins',

            compat: !Ext.platformTags.phone,
            description: 'These examples show some of the most powerful features of ' +
                         'the grid working together.',

            children: [
                { id: 'big-data-grid', text: 'Big Data', leaf: true },
                // { id: 'row-widget-grid', text: 'Row Widgets', leaf: true, since: '6.2.0' },
                // { id: 'widget-grid', text: 'Cell Widgets', leaf: true },
                // { id: 'expander-lockable', text: 'Row Expander, lockable columns', leaf: true },
                // { id: 'spreadsheet', text: 'Spreadsheet with locking', leaf: true},
                // { id: 'spreadsheet-checked', text: 'Spreadsheet with Checked Rows', leaf: true },
                { id: 'ticker-grid', text: 'Stock Ticker', leaf: true },
                { id: 'flexible-selection-grid', text: 'Flexible Selection', leaf: true },
                { id: 'reconfigure-grid', text: 'Reconfigure Grid', leaf: true }
            ]
        };
    },

    getNavItemsGridBasic: function() {
        return {
            text: 'Core Features',
            id: 'grid-core',
            iconCls: 'icon-grids',

            description: 'These examples show off the essential features of ' +
                         'the grid.',

            children: [
                { id: 'array-grid', text: 'Basic Grid', leaf: true },
                { id: 'grouped-grid', text: 'Grouped Grid', leaf: true },
                {
                    id: 'cell-editing',
                    text: 'Cell Editing',
                    leaf: true,
                    compat: Ext.platformTags.desktop
                },
                { id: 'row-editing', text: 'Row Editing', leaf: true, compat: Ext.platformTags.desktop },
                // { id: 'checkbox-selection', text: 'Checkbox Selection Model', leaf: true },
                // { id: 'row-numberer', text: 'Row Numberer', leaf: true },
                // { id: 'grouped-header-grid', text: 'Grouped Header Grid', leaf: true },
                // { id: 'multi-sort-grid', text: 'Multiple Sort Grid', leaf: true },
                { id: 'locking-grid', text: 'Locking Grid', leaf: true },
                { id: 'editable-grid', text: 'Editable Grid', leaf: true },
                // { id: 'row-expander-grid', text: 'Row Expander', leaf: true },
                // { id: 'property-grid', text: 'Property Grid', leaf: true },
                { id: 'xml-grid', text: 'XML Grid', leaf: true },
                { id: 'infinite-grid', text: 'Infinite Grid', iconCls: 'icon-buffer-grid', leaf: true }
            ]
        };
    },

    getNavItemsGridAddons: function() {
        return {
            text: 'Add-ons and Decorations',
            id: 'grid-addons',
            iconCls: 'icon-framing-buttons',

            description: 'These examples demonstrate various plugins and other ' +
                         'capabilities that make grids ever more awesome.',

            children: [
                // { id: 'grid-exporter', text: 'Grid Export', leaf: true, tier: 'premium' },
                // { id: 'paging-grid', text: 'Paging', leaf: true },
                // { id: 'progress-bar-pager', text: 'Progress Bar Pager', leaf: true },
                { id: 'grid-tools', text: 'Grid Tools', leaf: true },
                { id: 'gridheader-tools', text: 'Grid Header Tools', leaf: true },
                { id: 'menu-grid', text: 'Grid with Menu', leaf: true },
                { id: 'sliding-pager', text: 'Sliding Pager', leaf: true },
                { id: 'row-body-grid', text: 'Row Body', leaf: true },
                { id: 'row-expander-grid', text: 'Row Expander', leaf: true },
                { id: 'rowoperations-grid', text: 'Row Operations', leaf: true },
                { id: 'summary-row-grid', text: 'Summary Row', leaf: true },
                { id: 'grid-filtering', text: 'Grid Filtering', leaf: true },
                { id: 'view-options-grid', text: 'View Options', leaf: true },
                { id: 'cell-overflow-grid', text: 'Cell Overflow Tip', leaf: true },
                {
                    id: 'dd-grid-row',
                    text: 'Row Drag & Drop',
                    leaf: true,
                    compat: Ext.platformTags.desktop
                },
                { id: 'dd-form-to-grid', text: 'Drag Form to Grid', leaf: true }
                // { id: 'dd-field-to-grid', text: 'Drag Field to Grid', leaf: true },
                // { id: 'dd-grid-to-form', text: 'Drag Grid to Form', leaf: true },
                // { id: 'dd-grid-to-grid', text: 'Drag Grid to Grid', leaf: true },
                // { id: 'actions-grid', text: 'Reusable Actions', leaf: true }
            ]
        };
    },

    getNavItemsGridPivot: function() {
        return {
            text: 'Pivot Grids',
            id: 'pivot-grids',
            tier: 'premium',

            description:
                'The Pivot Grid component enables rapid summarization of large sets of data. ' +
                'It provides a simple way to condense many data points into a format that ' +
                'makes trends and insights more apparent.',

            children: [
                { id: 'outline-pivot-grid', text: 'Outline layout', leaf: true },
                { id: 'compact-pivot-grid', text: 'Compact layout', leaf: true },
                { id: 'tabular-pivot-grid', text: 'Tabular layout', leaf: true },
                // { id: 'locked-pivot-grid', text: 'Locked', leaf: true },
                { id: 'collapsible-pivot-grid', text: 'Collapsible', leaf: true },
                { id: 'datachanges-pivot-grid', text: 'Data changes', leaf: true },
                { id: 'widgets-pivot-grid', text: 'Widgets', leaf: true },
                { id: 'drilldown-pivot-grid', text: 'DrillDown plugin', leaf: true },
                { id: 'configurable-pivot-grid', text: 'Configurator plugin', leaf: true },
                // { id: 'cellediting-pivot-grid', text: 'CellEditing plugin', leaf: true },
                { id: 'rangeeditor-pivot-grid', text: 'RangeEditor plugin', leaf: true },
                { id: 'exporter-pivot-grid', text: 'Exporter plugin', leaf: true },
                { id: 'grandtotals-pivot-grid', text: 'Row styling', leaf: true },
                { id: 'cellediting-pivot-grid', text: 'Cell styling', leaf: true },
                // { id: 'chart-pivot-grid', text: 'Chart integration', leaf: true },
                // { id: 'grandtotals-pivot-grid', text: 'Custom grand totals', leaf: true },
                { id: 'remote-pivot-grid', text: 'Remote calculations', leaf: true }
            ]
        };
    },

    getNavItemsTrees: function() {
        return {
            text: 'Trees',
            id: 'trees',

            description: 'Tree Panels provide a tree-structured UI representation ' +
                         'of tree-structured data. Tree Panel\'s built-in expand/collapse ' +
                         'nodes offer a whole new set of opportunities for user interface ' +
                         'and data display.',
            children: [
                { id: 'basic-trees', text: 'Basic Trees', leaf: true },
                { id: 'tree-decorations', text: 'Tree Decorations', leaf: true },
                { id: 'tree-reorder', text: 'Tree Reorder', leaf: true },
                { id: 'tree-grid', text: 'Tree Grid', leaf: true },
                { id: 'tree-editable', text: 'Editable Tree', leaf: true },
                { id: 'tree-cell-editing', text: 'Cell Editing', leaf: true },
                // { id: 'tree-two', text: 'Two Trees', leaf: true },
                // { id: 'check-tree', text: 'Check Tree', leaf: true },
                // { id: 'filtered-tree', text: 'Filtered Tree', leaf: true },
                { id: 'heterogeneous-tree', text: 'Heterogeneous Tree', leaf: true },
                { id: 'lineardata-tree', text: 'Linear Data Geographical Tree', leaf: true },
                { id: 'tree-list', text: 'Tree List', leaf: true },
                { id: 'tree-xml', text: 'XML Tree', leaf: true }
            ]
        };
    },

    getNavItemsLists: function() {

        return {
            text: 'Lists',
            id: 'lists',

            description: 'Lists allow for the display of lists of information and provide ' +
                         'a means of selecting items from the lists. Lists may be nested ' +
                         'for provide a structure for navigation through the structured ' +
                         'list items.',

            children: [
                { id: 'basic-list', text: 'Basic List', leaf: true },
                { id: 'grouped-list', text: 'Grouped List', leaf: true },
                { id: 'disclosure-list', text: 'Disclosure List', leaf: true },
                { id: 'nested-list', text: 'Nested List', leaf: true },
                { id: 'pullrefresh-list', text: 'Pull Refresh List', leaf: true },
                { id: 'listpaging-list', text: 'List Paging', leaf: true },
                { id: 'basic-accordion-swiper', text: 'Basic Accordion Swiper', leaf: true },
                { id: 'basic-step-swiper', text: 'Basic Step Swiper', leaf: true },
                { id: 'undoable-accordion-swiper', text: 'Undoable Accordion Swiper', leaf: true },
                { id: 'undoable-step-swiper', text: 'Undoable Step Swiper', leaf: true }
            ]
        };
    }
});
