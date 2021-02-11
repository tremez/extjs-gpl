Ext.define('KitchenSink.view.chart.column.RendererController', {
    extend: 'KitchenSink.view.chart.ChartController',
    alias: 'controller.column-renderer',

    colors: [
        '#8ca640',
        '#974144',
        '#4091ba',
        '#8e658e',
        '#3b8d8b',
        '#b86465',
        '#d2af69',
        '#6e8852',
        '#3dcc7e',
        '#a6bed1',
        '#cbaa4b',
        '#998baa'
    ],

    onColumnRender: function(sprite, config, data, index) {
        return {
            fillStyle: this.colors[index],
            strokeStyle: index % 2 ? 'none' : 'black',
            opacity: index % 2 ? 1 : 0.5
        };
    },

    onTooltipRender: function(tooltip, record, item) {
        tooltip.setHtml(record.get('month') + ': ' + record.get('data3') + '%');
    },

    onAxisLabelRender: function(axis, label, layoutContext) {
        // Custom renderer overrides the native axis label renderer.
        // Since we don't want to do anything fancy with the value
        // ourselves except appending a '%' sign, but at the same time
        // don't want to loose the formatting done by the native renderer,
        // we let the native renderer process the value first.
        return layoutContext.renderer(label) + '%';
    },

    seriesG1Renderer: function(sprite, config, rendererData, index) {
        var store = rendererData.store,
            storeItems = store.getData().items,
            record = storeItems[index],
            diff = record && (record.get('g2') - record.get('g1')),
            last = storeItems.length - 1,
            surface = sprite.getParent(),
            changes = {},
            lineSprites, firstColumnConfig, firstData, lastData, growth, string,
            x1, y1, x2, y2;

        if (!record) {
            return;
        }

        // This renderer function paints the back column red instead
        // of palegreen if series #2 is greater than series #1.
        changes.fillStyle = (diff > 0 ? 'tomato' : 'palegreen');

        // Make the first and last columns larger.
        if (index === 0 || index === last) {
            changes.x = config.x - config.width * 0.2;
            changes.y = config.y;
            changes.width = config.width * 1.4;
            changes.lineWidth = 4;
            // Draw a line between the first and last columns
            lineSprites = surface.myLineSprites;

            if (!lineSprites) {
                lineSprites = surface.myLineSprites = [];
                lineSprites[0] = surface.add({
                    type: 'path'
                });
                lineSprites[1] = surface.add({
                    type: 'text'
                });
            }

            if (index === 0) {
                surface.myFirstColumnConfig = Ext.clone(changes);
            }
            else if (index === last) {
                firstData = storeItems[0].get('g1');
                lastData = storeItems[last].get('g1');
                firstColumnConfig = surface.myFirstColumnConfig;

                x1 = firstColumnConfig.x + firstColumnConfig.width;
                y1 = firstColumnConfig.y;
                x2 = changes.x;
                y2 = changes.y;

                lineSprites[0].setAttributes({
                    lineWidth: 1,
                    stroke: 'blue',
                    zIndex: 10000,
                    opacity: 0.4,
                    path: "M" + x2 + " " + y2 + " L" + x1 + " " + y1 + " L" + x2 + " " + y1 + (lastData < firstData ? " L" : " M") + x2 + " " + y2 + " Z"
                });

                growth = Math.round(100 * (lastData - firstData) / (firstData || 1));
                string = (growth > 0 ? "+ " : "- ") + Math.abs(growth) + " %";

                lineSprites[1].setAttributes({
                    text: string,
                    x: changes.x - 12,
                    y: firstColumnConfig.y + (changes.y - firstColumnConfig.y) / 2 + 10,
                    fill: '#00c',
                    fontSize: 20,
                    zIndex: 10000,
                    opacity: 0.6,
                    scalingY: -1,
                    textAlign: "center",
                    rotate: -90
                });
            }
        }
        else {
            changes.lineWidth = 2;
        }

        return changes;
    },

    seriesG2Renderer: function(sprite, config, rendererData, index) {
        var store = rendererData.store,
            storeItems = store.getData().items,
            last = storeItems.length - 1,
            record = storeItems[index],
            diff = record && Math.round(record.get('g2') - record.get('g1')),
            surface = sprite.getParent(),
            textSprites, textSprite, rectSprite;

        if (!record) {
            return;
        }

        // This renderer function draws a red label if series #2 is greater than series #1.
        // The label displays the difference between the values of series #1 and series #2.
        //
        // Note: The two renderer functions in this test case cannot be consolidated. The red labels
        // are rendered here because they are positioned relatively to the series #2 columns.
        if (diff > 0) {
            textSprites = surface.myTextSprites;

            if (!textSprites) {
                textSprites = surface.myTextSprites = [];
            }

            textSprite = textSprites[index];

            if (!textSprite) {
                textSprite = textSprites[index] = surface.add({
                    type: 'text'
                });
                rectSprite = textSprite.rectSprite = surface.add({
                    type: 'rect'
                });
            }
            else {
                rectSprite = textSprite.rectSprite;
                textSprite.show();
                rectSprite.show();
            }

            rectSprite.setAttributes({
                x: config.x + (index === last ? -18 : 20),
                y: config.y - 36,
                width: 36 + (diff >= 10 ? (diff >= 100 ? (diff >= 1000 ? 30 : 20) : 10) : 0),
                height: 22,
                fill: 'tomato',
                stroke: 'black',
                radius: 4,
                opacity: 1,
                zIndex: 10000
            });

            textSprite.setAttributes({
                text: "+ " + diff,
                x: config.x + (index === last ? -12 : 28),
                y: config.y - 20,
                fill: 'black',
                fontSize: 16,
                zIndex: 10001,
                scalingY: -1
            });
        }
        else {
            textSprites = surface.myTextSprites;

            if (textSprites) {
                textSprite = textSprites[index];

                if (textSprite) {
                    textSprite.rectSprite.hide();
                    textSprite.hide();
                }
            }
        }

        return null;
    }
});
