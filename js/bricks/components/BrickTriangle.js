const _ = require('underscore');
const React = require('react');
const updateHue = require('js/core/outputs/updateHue');

const INV_SQRT_3 = 1 / Math.sqrt(3);
const TWO_X_INV_SQRT_3 = 2 / Math.sqrt(3);

const BRICK_COLOR_REFRESH_RATE = 500;

const SAT_COEFF = 1.5;
const BRI_COEFF = 0.6;

const {ENABLE_HUE_ALTERNATING, TRIANGLE_GENERATING_RATE} = require('js/bricks/parameters/BricksConstants');

const BrickColor = require('js/bricks/state/BrickColor');

const brickColors = [
    new BrickColor({startValue: '#fd8', index: 0}),
    new BrickColor({startValue: '#180', index: 0}),
    new BrickColor({startValue: '#f10', index: 0}),
];

const getFillForOrientation = function(orientation) {
    const orientationGroup = Math.floor(orientation / 2);
    return brickColors[orientationGroup].getValue();
};
const updateFillForOrientation = function(previousFill, orientation) {
    const orientationGroup = Math.floor(orientation / 2);
    return brickColors[orientationGroup].mix(previousFill);
};

let tick = 0;
const updateColors = function() {
    _.times(3, i => {
        const lightIndex = i + tick % 3;
        updateHue(lightIndex, getFillForOrientation(i * 2), {satCoeff: SAT_COEFF, briCoeff: BRI_COEFF});
    });
    tick++;
};

if (ENABLE_HUE_ALTERNATING) {
    setInterval(updateColors, TRIANGLE_GENERATING_RATE);
}

const BrickTriangle = React.createClass({
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
        const x = this.props.x * INV_SQRT_3;
        const y = this.props.y;

        let points;

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
