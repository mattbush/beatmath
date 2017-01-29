const _ = require('lodash');
const {polarAngleDeg, posMod} = require('js/core/utils/math');

const Y_AXIS_SCALE = Math.sqrt(3) / 2;

const j = {color: '#A09000', points: '-6,2 0,4 6,2 3,2 3,-1 0,-4 -6,-2 -3,-1 0,-1 0,2'};
const e = {color: '#A09000', points: '-6,2 0,4 6,2 0,2 -1.5,0.5 1.5,0.5 3,-1 -3,-1 0,-2 6,-2 0,-4 -6,-2'};
const s = {color: '#A09000', points: '-6,2 0,4 6,2 0,2 -1.5,0.5 1.5,0.5 6,0 6,-2 0,-4 -6,-2 0,-2 3,-1 -3,-1 -6,0'};
const t = {color: '#A09000', points: '-6,2 0,4 6,2 1.5,2 1.5,0.5 3,-1 0,-4 -3,-1 -1.5,0.5 -1.5,2'};
const w = {color: '#A09000', points: '-6,2 -3,3 -3,-1 0,2 3,-1 3,3 6,2 6,-2 3,-3 0,-2 -3,-3 -6,-2'};
const o = {color: '#A09000', points: '-6,2 0,4 6,2 6,-2 0,-4 -6,-2 -6,0 -3,0 -3,-1 0,-2 3,-1 3,1 0,2 -3,1 -3,0 -6,0'};
const r = {color: '#A09000', points: '-6,2 0,4 6,2 6,0 3,-1 6,-2 3,-3 0,-2 0,-4 -6,-2 -3,-1 -3,0 0,0 3,1 0,2 0,0 -3,0 -3,1'};
const l = {color: '#A09000', points: '-6,2 0,4 3,3 0,2 0,-2 3,-1 6,-2 3,-3 -3,-3 -6,-2 -3,-1 -3,1'};
const d = {color: '#A09000', points: '-6,2 0,4 6,2 6,-2 0,-4 -6,-2 -3,-1 -3,0 0,0 0,-2 3,-1 3,1 0,2 0,0 -3,0 -3,1'};

const w1 = {color: '#00aaaa', points: '0,4 6,2 0,0'};
const w3 = {color: '#00bbbb', points: '6,2 6,-2 0,0'};
const w5 = {color: '#00cccc', points: '6,-2 0,-4 0,0'};
const w7 = {color: '#009999', points: '0,-4 -6,-2 0,0'};
const w9 = {color: '#008888', points: '-6,-2 -6,2 0,0'};
const w11 = {color: '#007777', points: '-6,2 0,4 0,0'};

const jestworldHexGridShapes = [
    [],
    [null, null, null, [j], [e], [s], [t], [w], [o], [r], [l], [d]],
    [null, null, null, null, null, null, null, null, [w7]],
    [null, null, null, null, [w7, w9], null, [w5], [w1, w3, w5], [w3, w5], null, null, [w7, w9]],
    [null, [w7, w9, w11], [w7], [w5], [w1, w3, w5], [w3, w5], null, [w7, w9, w11], [w7, w9, w11, w3, w5], [w9, w11], [w5], [w1, w3, w5], [w3, w5], null, null, [w7, w9, w11]],
    [[w1, w3, w5], [w7, w1, w3, w5], null, [w7, w9, w11], [w7, w9, w11, w3, w5], [w9, w11], [w1, w3], [w1, w3, w5, w7, w9], null, null, [w7, w9, w11], [w7, w9, w11, w3, w5], [w9, w11], [w1, w3, w5], [w1, w3, w5]],
    [null, [w7, w9, w11, w1], null, [w1, w3], [w1, w3, w5, w7, w9], null, null, null, [w7, w9, w11], null, [w1, w3], [w1, w3, w5, w7, w9], null, null, [w1, w3, w11], [w7, w9, w11]],
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

_.each(jestworldHexGridShapes, row => _.each(row, shapes => {
    if (shapes) {
        shapes.forEach(processShapeIfNeeded);
    }
}));

module.exports = jestworldHexGridShapes;
