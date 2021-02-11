/**
 * @private
 */
Ext.define('Ext.grid.HeaderDropZone', {
    extend: 'Ext.grid.GridDropZone',

    dropMarkerCls: Ext.baseCSSPrefix + 'header-drop-indicator',
    autoDestroy: false,

    isValidDrag: function(targetCmp, sourceCmp) {
        var info = this.info,
            cursor, prevSibling,
            nextSibling, box, diff;

        // Avoid parent column to be dragged on child column or column container
        if (!!targetCmp.up(sourceCmp)) {
            return false;
        }

        cursor = info.cursor.current;
        prevSibling = sourceCmp.previousSibling();
        nextSibling = sourceCmp.nextSibling();

        if (targetCmp === prevSibling) {
            box = prevSibling.element.getBox();
            diff = (cursor.x - box.left) / box.width;

            if (diff > 0.50) {
                return false;
            }
        }
        else if (targetCmp === nextSibling) {
            box = nextSibling.element.getBox();
            diff = (cursor.x - box.left) / box.width;

            if (diff <= 0.50) {
                return false;
            }
        }

        return true;
    },

    onDragMove: function(info) {
        var me = this,
            ddManager = Ext.dd.Manager,
            targetCmp = ddManager.getTargetComp(info),
            isDragTarget = targetCmp.isDragColumn,
            sourceCmp = ddManager.getSourceComp(info),
            notHeader = !targetCmp.isHeaderContainer || !sourceCmp.isHeaderContainer,
            highlight, positionCls;

        // Return on same column, not a column, on drag indicator column
        // or on header end if space is available
        if (notHeader || targetCmp === sourceCmp || isDragTarget ||
            targetCmp.getParent() === me.view) {
            if (this.ddEl) {
                this.removeDropMarker();
            }

            return;
        }

        highlight = ddManager.getPosition(info, targetCmp, 'x');
        positionCls = me.dropMarkerCls + '-' + highlight;

        if (targetCmp.hasCls(positionCls)) {
            return;
        }

        if (this.ddEl) {
            this.removeDropMarker();
        }

        if (me.isValidDrag(targetCmp, sourceCmp)) {
            me.ddEl = targetCmp;
            me.addDropMarker(targetCmp, [me.dropIndicator, positionCls]);
        }
    },

    /**
     * Remove the parent header if all its child headers are removed
     * And is not grid header container
     */
    trackHeaderMove: function(header, headerCt) {
        var parentCt;

        if (!header || header === headerCt || header.innerItems.length) {
            return;
        }

        parentCt = header.getParent();
        parentCt.remove(header);
        this.trackHeaderMove(parentCt, headerCt);
    },

    onDrop: function(info) {
        var me = this,
            dropMethod = 'insertBefore',
            ddManager, targetCmp, headerCt,
            sourceCmp, dropAt, position,
            relativeToItem, fromCtRoot, fromIdx, sourceCmpParent;

        if (!me.ddEl) {
            return;
        }

        ddManager = Ext.dd.Manager;
        targetCmp = ddManager.getTargetComp(info);
        headerCt = targetCmp.getParent() || targetCmp.getRootHeaderCt();
        sourceCmp = ddManager.getSourceComp(info);
        fromCtRoot = sourceCmp.getRootHeaderCt();
        fromIdx = fromCtRoot.indexOf(sourceCmp);
        dropAt = headerCt.indexOf(targetCmp);
        position = ddManager.getPosition(info, targetCmp, 'x');
        sourceCmpParent = sourceCmp.getParent();

        me.removeDropMarker();

        if (dropAt === -1) {
            return;
        }

        if (position === 'after') {
            relativeToItem = headerCt.getAt(dropAt + 1);

            if (!relativeToItem) {
                dropMethod = 'insertAfter';
                relativeToItem = targetCmp;
            }
        }
        else {
            relativeToItem = headerCt.getAt(dropAt);
        }

        headerCt[dropMethod](sourceCmp, (relativeToItem || null));

        me.trackHeaderMove(sourceCmpParent, fromCtRoot);

        fromCtRoot.fireEvent('move', fromCtRoot, sourceCmp, dropAt, fromIdx);
    }
});
