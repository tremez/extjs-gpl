Ext.define('KitchenSink.view.icons.VectorIconsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.vector-icons',

    iconSize: 40,
    numColumns: 3,
    colSize: Math.ceil(224 / 3), // 224 / numColumns

    init: function() {
        var me = this,
            view = me.getView(),
            iconTpl = view.iconTpl,
            listContainer = view.lookup('listContainer'),
            list = view.lookup('list'),
            icons = view.icons,
            iconSize = me.iconSize,
            numColumns = me.numColumns,
            i = 0,
            j = 0,
            name;

        listContainer.setWidth(numColumns * iconSize + 32);

        for (name in icons) {
            list
                .getSurface('row-' + j)
                .add(Ext.apply({}, {
                    path: icons[name],
                    translationX: i * iconSize + 5
                }, iconTpl));

            i++;

            if (i >= numColumns) {
                i = 0;
                j++;
            }
        }

        me.updateLastHightlighted(0, 0);
    },

    updateLastHightlighted: function(row, col) {
        var list = this.lookup('list'),
            preview = this.lookup('preview'),
            previewItem = preview.getSurface().getItems()[0],
            lastHighlighted;

        lastHighlighted = this.lastHighlighted;

        if (lastHighlighted) {
            lastHighlighted.setAttributes({
                highlighted: false
            });
        }

        if (col < this.numColumns && row < this.colSize) {
            lastHighlighted = list.getSurface('row-' + row).getItems()[col];

            lastHighlighted.setAttributes({
                highlighted: true
            });

            previewItem.setAttributes({
                path: lastHighlighted.attr.path
            });
        }
        else {
            lastHighlighted = null;
        }

        return this.lastHighlighted = lastHighlighted;
    },

    placeItem: function(size, item) {
        var bbox = item.getBBox(true),
            iconSize = this.iconSize,
            val1 = (size.width - 30) / (bbox.width || iconSize),
            val2 = (size.height - 30) / (bbox.height || iconSize),
            scaling = Math.min(val1, val2);

        if (isFinite(scaling)) {
            item.setAttributes({
                scaling: scaling,
                translationX: size.width / 2 - (bbox.x + bbox.width / 2) * scaling,
                translationY: size.height / 2 - (bbox.y + bbox.height / 2) * scaling
            });
        }
    },

    listResizeHandler: function(size) {
        var list = this.lookup('list'),
            colSize = this.colSize,
            iconSize = this.iconSize,
            i;

        for (i = 0; i < colSize; i++) {
            list.getSurface('row-' + i).setRect([0, iconSize * i, size.width, iconSize]);
        }
    },

    previewResizeHandler: function(size) {
        var preview = this.lookup('preview'),
            surface = preview.getSurface(),
            item = surface.getItems()[0];

        surface.setRect([0, 0, size.width, size.height]);

        this.placeItem(size, item);
    },

    onIconTap: function(e) {
        var me = this,
            scrollableTarget = e.getTarget('.x-scroller'),
            iconSize = me.iconSize,
            list = me.lookup('list'),
            preview = me.lookup('preview'),
            previewItem = preview.getSurface().getItems()[0],
            xy = list.element.getXY(),
            col = (e.pageX - xy[0] + scrollableTarget.scrollLeft) / iconSize >> 0,
            row = (e.pageY - xy[1] + scrollableTarget.scrollTop) / iconSize >> 0;

        me.updateLastHightlighted(row, col);

        me.placeItem(preview.element.getSize(), previewItem);

        list.getSurface().renderFrame();
        preview.getSurface().renderFrame();
    }
});
