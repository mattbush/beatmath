const _ = require('underscore');
const React = require('react');

const POINTINESS_SETTINGS_PER_UNIT = 20;
const MAX_POINTINESS = 2.5;

const SIZE_CORRECTION = 1.06; // corrects for the relative "bulge" of a circle compared to an inscribed hexagon/octagon

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
        const fill = color.toHexString(true);

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
