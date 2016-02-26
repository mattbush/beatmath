var _ = require('underscore');
var React = require('react');

var POINTINESS_SETTINGS_PER_UNIT = 20;
var MAX_POINTINESS = 2.5;

var SIZE_CORRECTION = 1.06; // corrects for the relative "bulge" of a circle compared to an inscribed hexagon/octagon

var generatePoints = function(numSides, minPointMultiplier) {
    return _.times(MAX_POINTINESS * POINTINESS_SETTINGS_PER_UNIT + 1, index => {
        var rawPointMultiplier = index / POINTINESS_SETTINGS_PER_UNIT;
        var pointMultiplier = Math.max(minPointMultiplier, rawPointMultiplier);

        var pointinessRatio = pointMultiplier / minPointMultiplier;
        var pointyRadius = Math.pow(pointinessRatio, 0.667) * SIZE_CORRECTION;
        var nonPointyRadius = Math.pow(pointinessRatio, -0.333) * SIZE_CORRECTION;

        var numPoints = numSides * 2;
        var pointsArray = _.times(numPoints, pointIndex => {
            var angleRadians = pointIndex / numPoints * 2 * Math.PI;
            var radius = (pointIndex % 2) ? pointyRadius : nonPointyRadius;
            var x = Math.sin(angleRadians) * radius; // sic, prefer to have everything start at y=1, x=0
            var y = Math.cos(angleRadians) * radius; // sic, prefer to have everything start at y=-1, x=0
            return `${x},${y}`;
        });

        return pointsArray.join(' ');
    });
};

var trianglePoints = generatePoints(3, 0.5);
var rectPoints = generatePoints(4, 1 / Math.sqrt(2));

var BeatmathPixel = React.createClass({
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
    },
    render: function() {
        var pixelPointiness = this.context.beatmathParameters.pixelPointiness.getValue();
        var pixelSidedness = this.context.beatmathParameters.pixelSidedness.getValue();
        // var shouldStrokePixels = this.context.beatmathParameters.shouldStrokePixels.getValue();
        var colorSpin = this.context.beatmathParameters.colorSpin.getValue();
        var brightness = this.context.beatmathParameters.brightness.getValue();

        var color = this.props.color;
        if (colorSpin !== 0) {
            color = color.spin(colorSpin);
        }
        if (brightness !== 1) {
            color = color.darken((1 - brightness) * 100);
        }
        var fill = color.toHexString(true);

        if (pixelPointiness < 0.5) {
            return <circle cx="0" cy="0" r="1" fill={fill} />;
        } else {
            var pointsArray = (pixelSidedness === 3) ? trianglePoints : rectPoints;
            var pointsIndex = Math.floor(pixelPointiness * POINTINESS_SETTINGS_PER_UNIT);
            var points = pointsArray[pointsIndex];
            return (
                <polygon points={points} fill={fill} />
            );
        }
    },
});

module.exports = BeatmathPixel;
