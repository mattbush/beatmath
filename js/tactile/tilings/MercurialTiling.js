/* eslint-disable no-unused-vars */
const _ = require('lodash');
const {polarAngleDeg, posMod} = require('js/core/utils/math');

const tilingShapes = {
    3: {0: {pts: '2,-1 0,1 -2,-1'}, 3: {pts: '-1,1 -1,-1 1,-1'}, 5: {pts: '-1,-1 1,-1 1,1'}},
    2: {},
    1: {1: {pts: '-1,1 1,1 1,-1'}, 4: {pts: '2,1 0,-1 -2,1'}, 7: {pts: '-1,1 1,1 -1,-1'}},
    0: {0: {pts: '0,2 2,0 0,-2 -2,0'}, 3: {pts: '1,0 -1,2 -1,-2'}, 5: {pts: '-1,0 1,2 1,-2'}},
};

const processShapeIfNeeded = function(shape) {
    if (shape.processed) {
        return;
    }

    shape.processed = true;
    const points = _.filter(shape.pts.split(' ')).map(x => x.split(',').map(Number));
    shape.points = points;

    const centerX = points.map(p => p[0]).reduce((x, xx) => x + xx, 0) / points.length;
    const centerY = points.map(p => p[1]).reduce((x, xx) => x + xx, 0) / points.length;

    shape.center = [centerX, centerY];
    shape.pointsAroundCenter = shape.points.map(([x, y]) => [x - centerX, y - centerY]);
    shape.pointsAroundCenterString = shape.pointsAroundCenter.map(x => x.join(',')).join(' ');
};

_.each(tilingShapes, (row, rowIndex) => _.each(row, (shape, colIndex) => {
    processShapeIfNeeded(shape);
}));

const getMercurialShape = function(rowIndex, colIndex) {
    const shouldShiftColumn = posMod(rowIndex / 4, 2) >= 1;
    const rowMod = posMod(rowIndex, 4);
    const columnMod = posMod(colIndex + (shouldShiftColumn ? 4 : 0), 8);
    return tilingShapes[rowMod][columnMod];
};

module.exports = getMercurialShape;
