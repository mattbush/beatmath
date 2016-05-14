const _ = require('underscore');
const React = require('react');
const {lerp} = require('js/core/utils/math');

const SQRT_3 = 3 ** 0.5;

const clipPaths = [];
_.times(21, index => {
    const interpolation = index / 20;
    var lerp1OverSqrt3 = lerp(1, 1 / SQRT_3, interpolation);
    var lerp2OverSqrt3 = lerp(1, 2 / SQRT_3, interpolation);

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
        I6A: [
            [0, 0],
            [1000, 1000 * lerp1OverSqrt3],
            [1000, -1000 * lerp1OverSqrt3],
        ],
        I6B: [
            [0, 0],
            [1000, 1000 * lerp1OverSqrt3],
            [0, 1000 * lerp2OverSqrt3],
        ],
        C1: [
            [-1, -lerp1OverSqrt3],
            [-1, lerp1OverSqrt3],
            [0, lerp2OverSqrt3],
            [1, lerp1OverSqrt3],
            [1, -lerp1OverSqrt3],
            [0, -lerp2OverSqrt3],
        ],
        C2: [
            [0, 0],
            [0, lerp2OverSqrt3],
            [1, lerp1OverSqrt3],
            [1, -lerp1OverSqrt3],
            [0, -lerp2OverSqrt3],
        ],
        C4: [
            [0, 0],
            [0, lerp2OverSqrt3],
            [1, lerp1OverSqrt3],
            [1, 0],
        ],
        C6A: [
            [0, 0],
            [1, lerp1OverSqrt3],
            [1, -lerp1OverSqrt3],
        ],
        C6B: [
            [0, 0],
            [1, lerp1OverSqrt3],
            [0, lerp2OverSqrt3],
        ],
    };

    _.each(pointsForInterpolation, (points, id) => {
        clipPaths.push(
            <clipPath id={id + '~' + interpolation}>
                <polygon points={_.map(points, pair => pair.join(',')).join(' ')} />
            </clipPath>
        );
    });
});

const clipPathsWithKeys = _.map(
    clipPaths,
    (clipPath, i) => React.cloneElement(clipPath, {key: i})
);

module.exports = clipPathsWithKeys;
