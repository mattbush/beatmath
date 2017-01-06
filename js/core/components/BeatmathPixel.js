const _ = require('lodash');
const React = require('react');
const {lerp} = require('js/core/utils/math');
const mapColorString = require('js/core/utils/mapColorString');

const POINTINESS_SETTINGS_PER_UNIT = 20;
const MAX_POINTINESS = 2.5;

const SIZE_CORRECTION = 1.06; // corrects for the relative "bulge" of a circle compared to an inscribed hexagon/octagon

const generatePointsForHeart = function() {
    const OCTAGON_WIDTH = Math.sqrt(2) + 1;
    const OCTAGON_SIDE_WIDTH = 1 / OCTAGON_WIDTH;
    const OCTAGON_DIAGONAL_WIDTH = (1 / Math.sqrt(2)) / OCTAGON_WIDTH;
    const pointsForHeart = [
        [0, -OCTAGON_SIDE_WIDTH],
        [OCTAGON_DIAGONAL_WIDTH, -(OCTAGON_SIDE_WIDTH + OCTAGON_DIAGONAL_WIDTH)],
        [OCTAGON_SIDE_WIDTH + OCTAGON_DIAGONAL_WIDTH, -(OCTAGON_SIDE_WIDTH + OCTAGON_DIAGONAL_WIDTH)],
        [1, -OCTAGON_SIDE_WIDTH],
        [1, 0],
        [0, 1],
        [-1, 0],
        [-1, -OCTAGON_SIDE_WIDTH],
        [-(OCTAGON_SIDE_WIDTH + OCTAGON_DIAGONAL_WIDTH), -(OCTAGON_SIDE_WIDTH + OCTAGON_DIAGONAL_WIDTH)],
        [-OCTAGON_DIAGONAL_WIDTH, -(OCTAGON_SIDE_WIDTH + OCTAGON_DIAGONAL_WIDTH)],
    ];
    const TWOPI_OVER_10 = 2 * Math.PI / 10;
    const pointsForDecagon = _.times(10, i => [Math.sin(i * TWOPI_OVER_10), -Math.cos(i * TWOPI_OVER_10)]);

    return _.times(MAX_POINTINESS * POINTINESS_SETTINGS_PER_UNIT + 1, index => {
        const interpolation = ((index / POINTINESS_SETTINGS_PER_UNIT) - 0.4) * 1.5;
        const pointsArray = _.times(10, i => {
            const x = lerp(pointsForDecagon[i][0], pointsForHeart[i][0] * 1.3, interpolation);
            const y = lerp(pointsForDecagon[i][1], pointsForHeart[i][1] * 1.3, interpolation);
            return `${x},${y}`;
        });

        return pointsArray.join(' ');
    });
};

const generatePoints = function(numSides, minPointMultiplier) {
    return _.times(MAX_POINTINESS * POINTINESS_SETTINGS_PER_UNIT + 1, index => {
        const rawPointMultiplier = index / POINTINESS_SETTINGS_PER_UNIT;
        const pointMultiplier = Math.max(minPointMultiplier, rawPointMultiplier);

        const pointinessRatio = pointMultiplier / minPointMultiplier;
        const pointyRadius = Math.pow(pointinessRatio, 0.667) * SIZE_CORRECTION;
        const nonPointyRadius = Math.pow(pointinessRatio, -0.333) * SIZE_CORRECTION;

        const numPoints = numSides * 2;
        const pointsArray = _.times(numPoints, pointIndex => {
            const angleRadians = pointIndex / numPoints * 2 * Math.PI;
            const radius = (pointIndex % 2) ? pointyRadius : nonPointyRadius;
            const x = Math.sin(angleRadians) * radius; // sic, prefer to have everything start at y=1, x=0
            const y = Math.cos(angleRadians) * radius; // sic, prefer to have everything start at y=-1, x=0
            return `${x},${y}`;
        });

        return pointsArray.join(' ');
    });
};

const generatedPoints = [
    null,
    null,
    generatePoints(2, 0.4),
    generatePoints(3, 0.5),
    generatePoints(4, 1 / Math.sqrt(2)),
    generatePoints(5, 0.809),
    generatePointsForHeart(),
];

const BeatmathPixel = React.createClass({
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
    },
    render: function() {
        const pixelPointiness = this.context.beatmathParameters.pixelPointiness.getValue();
        const pixelSidedness = this.context.beatmathParameters.pixelSidedness.getValue();
        const colorSpin = this.context.beatmathParameters.colorSpin.getValue();
        const brightness = this.context.beatmathParameters.brightness.getValue();

        let color = this.props.color;
        if (colorSpin !== 0) {
            color = color.spin(colorSpin);
        }
        if (brightness !== 1) {
            color = color.darken((1 - brightness) * 100);
        }
        const fill = mapColorString(color.toHexString(true));

        if (pixelPointiness < 0.5) {
            return <circle cx="0" cy="0" r="1" fill={fill} />;
        } else {
            const pointsArray = generatedPoints[pixelSidedness];
            const pointsIndex = Math.floor(pixelPointiness * POINTINESS_SETTINGS_PER_UNIT);
            const points = pointsArray[pointsIndex];
            return (
                <polygon points={points} fill={fill} />
            );
        }
    },
});

module.exports = BeatmathPixel;
