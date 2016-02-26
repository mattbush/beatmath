var _ = require('underscore');
var React = require('react');
var updateHue = require('js/core/outputs/updateHue');

const INV_SQRT_3 = 1 / Math.sqrt(3);
const TWO_X_INV_SQRT_3 = 2 / Math.sqrt(3);

const BRICK_COLOR_REFRESH_RATE = 500;

var SAT_COEFF = 1.5;
var BRI_COEFF = 0.6;

const {ENABLE_HUE_ALTERNATING, TRIANGLE_GENERATING_RATE} = require('js/bricks/parameters/BricksConstants');

const BrickColor = require('js/bricks/state/BrickColor');

var brickColors = [
    new BrickColor({startValue: '#fd8', index: 0}),
    new BrickColor({startValue: '#180', index: 0}),
    new BrickColor({startValue: '#f10', index: 0}),
];

var getFillForOrientation = function(orientation) {
    var orientationGroup = Math.floor(orientation / 2);
    return brickColors[orientationGroup].getValue();
};
var updateFillForOrientation = function(previousFill, orientation) {
    var orientationGroup = Math.floor(orientation / 2);
    return brickColors[orientationGroup].mix(previousFill);
};

var tick = 0;
var updateColors = function() {
    _.times(3, i => {
        var lightIndex = i + tick % 3;
        updateHue(lightIndex, getFillForOrientation(i * 2), {satCoeff: SAT_COEFF, briCoeff: BRI_COEFF});
    });
    tick++;
};

if (ENABLE_HUE_ALTERNATING) {
    setInterval(updateColors, TRIANGLE_GENERATING_RATE);
}

var BrickTriangle = React.createClass({
    getInitialState: function() {
        return {
            color: getFillForOrientation(this.props.orientation),
        };
    },
    componentDidMount: function() {
        this._intervalId = setInterval(this._updateColor, BRICK_COLOR_REFRESH_RATE);
    },
    componentWillUnmount: function() {
        clearInterval(this._intervalId);
    },
    _updateColor: function() {
        this.setState({
            color: updateFillForOrientation(this.state.color, this.props.orientation),
        });
    },
    render: function() {
        var x = this.props.x * INV_SQRT_3;
        var y = this.props.y;

        var points;

        if (this.props.orientation % 2 === 0) {
            points = `${x + INV_SQRT_3},${y + 1} ${x - TWO_X_INV_SQRT_3},${y} ${x + INV_SQRT_3},${y - 1}`;
        } else {
            points = `${x - INV_SQRT_3},${y + 1} ${x + TWO_X_INV_SQRT_3},${y} ${x - INV_SQRT_3},${y - 1}`;
        }
        return (
            <polygon className="triangle" fill={this.state.color.toHexString(true)} points={points} />
        );
    },
});

module.exports = BrickTriangle;
