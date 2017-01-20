const _ = require('lodash');
const {polarAngleDeg, posMod} = require('js/core/utils/math');

const Y_AXIS_SCALE = Math.sqrt(3) / 2;

const j = {color: '#A09000', points: '0,4 3,3 0,2 -3,3'};
const e = {color: '#A09000', points: '-3,3 0,2 -3,1 -6,2'};
const s = {color: '#A09000', points: '3,3 6,2 3,1 0,2'};
const t = {color: '#A09000', points: '0,2 3,1 0,0 -3,1'};
const w = {color: '#A09000', points: '-3,1 0,0 -3,-1 -6,0'};
const o = {color: '#A09000', points: '3,1 6,0 3,-1 0,0'};
const r = {color: '#A09000', points: '0,0 3,-1 0,-2 -3,-1'};
const l = {color: '#A09000', points: '-3,-1 0,-2 -3,-3 -6,-2'};
const d = {color: '#A09000', points: '-6,2 0,4 6,2 6,-2 0,-4 -6,-2 -3,-1 -3,0 0,0 0,-2 3,-1 3,1 0,2 0,0 -3,0 -3,1'};

const jestworldHexGridShapes = [
    [],
    [null, null, null, j, e, s, t, w, o, r, l, d],
    [],
    [],
    [],
    [],
    [],
];

const processShapeIfNeeded = function(shape) {
    if (!shape || shape.processed) {
        return;
    }

    shape.processed = true;
    const pointsUnscaled = _.filter(shape.points.split(' ')).map(x => x.split(','));
    const points = pointsUnscaled.map(([x, y]) => [x * 1 / 12, -y * 1 / 8 * 4 / 3 * Y_AXIS_SCALE]);
    shape.points = points;

    const centerX = points.map(p => p[0]).reduce((x, xx) => x + xx, 0) / points.length;
    const centerY = points.map(p => p[1]).reduce((x, xx) => x + xx, 0) / points.length;

    const deg = polarAngleDeg(centerX, centerY);
    const yMax = -_.min(points.map(p => p[1]));

    shape.center = [centerX, centerY];
    shape.clockNumber = Math.round(posMod(deg + 90, 360) / 30);
    shape.yMax = yMax;
};

const jestworldHexGrid = _.each(jestworldHexGridShapes, row => _.each(row, processShapeIfNeeded));

module.exports = jestworldHexGrid;
