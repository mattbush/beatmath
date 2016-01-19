var _ = require('underscore');
var React = require('react');
var tinycolor = require('tinycolor2');

const {LETTER_TILT_TIME} = require('js/parameters/anagrams/AnagramsConstants');

var colorCache = {};
var getColorForLetter = function(letter) {
    if (!_.has(colorCache, letter)) {
        var spinAmount = (letter.charCodeAt(0) - 'A'.charCodeAt(0)) / 26;
        colorCache[letter] = tinycolor('#f33').spin(spinAmount * 360);
        while (tinycolor.readability('black', colorCache[letter]) <= 4.5) {
            colorCache[letter].lighten(5);
        }
    }
    return colorCache[letter];
};

var Letter = React.createClass({
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
    },
    getInitialState: function() {
        return {
            tilt: 1,
            revolutions: 0,
        };
    },
    componentDidMount: function() {
        this._intervalId = setInterval(this._updateTilt, LETTER_TILT_TIME);
    },
    componentWillUnmount: function() {
        clearInterval(this._intervalId);
    },
    _updateTilt: function() {
        var delay = this.props.index * 0.05;
        var newTilt = -1 * this.state.tilt;
        var newRevolutions = this.state.revolutions + (Math.random() > 0.99 ? newTilt : 0);
        setTimeout(() => {
            this.setState({
                tilt: newTilt,
                revolutions: newRevolutions,
            });
        }, delay);
    },
    render: function() {
        var color = getColorForLetter(this.props.character);
        var colorSpin = this.context.beatmathParameters.colorSpin.getValue();
        color = tinycolor(color.toHexString());
        if (colorSpin !== 0) {
            color = color.spin(colorSpin);
        }

        var degrees = 8 * this.state.tilt * this.context.beatmathParameters.tiltCoefficient.getValue() + 360 * this.state.revolutions;
        var style = {
            fill: color.toHexString(),
            transform: `rotate(${degrees}deg) translate(0px, 20px)`,
            transition: `transform ${LETTER_TILT_TIME / 1000}s ease`,
        };
        return (
            <g style={style}>
                <text className="letter" textAnchor="middle" x="0" y="0">
                    {this.props.character}
                </text>
            </g>
        );
    }
});

module.exports = Letter;
