const _ = require('lodash');
const {xyRotatedAroundOriginWithAngle} = require('js/core/utils/math');

const SQRT_3 = Math.sqrt(3);

const tilingShapeSets = [
    {pts: '3,1 0,1 0,0', angles: [0, 120, 240]},
    {pts: '-3,1 0,1 0,0', angles: [0, 120, 240]},

    {pts: '0,1 3,1 1.5,2.5', angles: [0, 120, 240]},
    {pts: '0,1 -3,1 -1.5,2.5', angles: [0, 120, 240]},
    {pts: '-1.5,2.5 1.5,2.5 0,1', angles: [0, 120, 240]},
    {pts: '-1.5,2.5 1.5,2.5 0,4', angles: [0, 120, 240]},
];

const tilingShapes = [];

for (const shapeSet of tilingShapeSets) {
    for (const angle of shapeSet.angles) {
        const shape = {};
        const pointsRaw = _.filter(shapeSet.pts.split(' ')).map(x => x.split(',').map(Number));
        shape.points = pointsRaw.map(([x, y]) => {
            y *= -1;
            x /= SQRT_3;
            return xyRotatedAroundOriginWithAngle(x, y, angle);
        });

        const centerX = shape.points.map(p => p[0]).reduce((x, xx) => x + xx, 0) / shape.points.length;
        const centerY = shape.points.map(p => p[1]).reduce((x, xx) => x + xx, 0) / shape.points.length;

        shape.center = [centerX, centerY];
        shape.pointsAroundCenter = shape.points.map(([x, y]) => [x - centerX, y - centerY]);
        shape.pointsAroundCenterString = shape.pointsAroundCenter.map(x => x.join(',')).join(' ');

        tilingShapes.push(shape);
    }
}

module.exports = tilingShapes;
