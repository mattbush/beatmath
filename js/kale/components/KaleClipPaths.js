const _ = require('lodash');
const React = require('react');
const {lerp, centerOfPoints} = require('js/core/utils/math');

const SQRT_3 = 3 ** 0.5;

const clipPaths = [];
_.times(21, index => {
    const interpolation = index / 20;
    const lerp1OverSqrt3 = lerp(1, 1 / SQRT_3, interpolation);
    const lerp2OverSqrt3 = lerp(1, 2 / SQRT_3, interpolation);

    // not exactly linear, but whatever
    const angleForBSide = lerp(247.5, 240, interpolation);
    const cosAngle = Math.cos(angleForBSide * (Math.PI / 180));
    const sinAngle = Math.sin(angleForBSide * (Math.PI / 180));
    const cosAngle2 = Math.cos((360 - angleForBSide) * (Math.PI / 180));
    const sinAngle2 = Math.sin((360 - angleForBSide) * (Math.PI / 180));

    const pointsForInterpolation = {
        I1: [
            [-1000, -1000],
            [1000, -1000],
            [1000, 1000],
            [-1000, 1000],
        ],
        I2: [
            [0, -1000],
            [1000, -1000],
            [1000, 1000],
            [0, 1000],
        ],
        I4: [
            [0, 0],
            [1000, 0],
            [1000, 1000],
            [0, 1000],
        ],
        I6: [
            [0, 0],
            [1000, 1000 * lerp1OverSqrt3],
            [1000, -1000 * lerp1OverSqrt3],
        ],
        I6B: [
            [0, 0],
            [-1000, 1000 * lerp1OverSqrt3],
            [0, 1000 * lerp2OverSqrt3],
        ],
        I6C: [
            [0, 0],
            [-1000, -1000 * lerp1OverSqrt3],
            [0, -1000 * lerp2OverSqrt3],
        ],
        F1: [
            [-1, -lerp1OverSqrt3],
            [-1, lerp1OverSqrt3],
            [0, lerp2OverSqrt3],
            [1, lerp1OverSqrt3],
            [1, -lerp1OverSqrt3],
            [0, -lerp2OverSqrt3],
        ],
        F2: [
            [0, 0],
            [0, lerp2OverSqrt3],
            [1, lerp1OverSqrt3],
            [1, -lerp1OverSqrt3],
            [0, -lerp2OverSqrt3],
        ],
        F4: [
            [0, 0],
            [0, lerp2OverSqrt3],
            [1, lerp1OverSqrt3],
            [1, 0],
        ],
        F6: [
            [0, 0],
            [1, lerp1OverSqrt3],
            [1, -lerp1OverSqrt3],
        ],
        F6B: [
            [0, 0],
            [-1, lerp1OverSqrt3],
            [0, lerp2OverSqrt3],
        ],
        F6C: [
            [0, 0],
            [-1, -lerp1OverSqrt3],
            [0, -lerp2OverSqrt3],
        ],
    };

    _.each(pointsForInterpolation, (points, id) => {
        if (id.includes('B')) {
            points = _.map(points, ([x, y]) => [cosAngle * x - sinAngle * y, sinAngle * x + cosAngle * y]);
        } else if (id.includes('C')) {
            points = _.map(points, ([x, y]) => [cosAngle2 * x - sinAngle2 * y, sinAngle2 * x + cosAngle2 * y]);
        }

        const [centerX, centerY] = centerOfPoints(points);

        const clipPathKey = id + '~' + interpolation;

        clipPaths.push({
            key: clipPathKey,
            centerX: centerX,
            centerY: centerY,
            jsx: (
                <clipPath id={clipPathKey}>
                    <polygon points={_.map(points, pair => pair.join(',')).join(' ')} />
                </clipPath>,
            ),
        });
    });
});

const KaleClipPaths = _.map(
    clipPaths,
    (clipPath, i) => React.cloneElement(clipPath.jsx, {key: i})
);

const clipPathXCenters = _.zipObject(_.map(clipPaths, 'key'), _.map(clipPaths, 'centerX'));
const clipPathYCenters = _.zipObject(_.map(clipPaths, 'key'), _.map(clipPaths, 'centerY'));

module.exports = {KaleClipPaths, clipPathXCenters, clipPathYCenters};
