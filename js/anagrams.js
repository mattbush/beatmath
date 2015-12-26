var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var AnagramSet = require('./anagram_set');
var tinycolor = require('tinycolor2');

const {WIDTH_PX, HEIGHT_PX} = require('./beatmath_constants.js');

const LETTER_SPACING = 64;
const JUMP_UNIT_HEIGHT = -16;
const ANAGRAM_SET_CYCLE_TIME = 15000;
const ANAGRAM_CYCLE_TIME = 3000;
const LETTER_TRANSITION_TIME = 1000;
const LETTER_TILT_TIME = 600;

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
        var degrees = 8 * this.state.tilt + 360 * this.state.revolutions;
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

var RearrangingLetter = React.createClass({
    getInitialState: function() {
        return {
            inTransition: false,
            previousIndex: null,
            nextIndex: this.props.index,
        };
    },
    componentWillReceiveProps: function(newProps) {
        this.setState({
            inTransition: true,
            previousIndex: this.props.index,
            nextIndex: newProps.index,
        });
    },
    componentDidUpdate: function() {
        if (this.state.inTransition) {
            setTimeout(() => {
                this.setState({
                    inTransition: false,
                });
            }, LETTER_TRANSITION_TIME / 2);
        }
    },
    render: function() {
        var vertStyle, horizStyle;
        if (this.state.inTransition) {
            let x = (this.state.previousIndex + this.state.nextIndex) / 2 * this.props.letterSpacing;
            let y = (this.state.nextIndex - this.state.previousIndex) * JUMP_UNIT_HEIGHT;
            vertStyle = {
                transform: `translate(0px, ${y}px)`,
                transition: `transform ${LETTER_TRANSITION_TIME / 2000}s ease-out`,
            };
            horizStyle = {
                transform: `translate(${x}px, 0px)`,
                transition: `transform ${LETTER_TRANSITION_TIME / 2000}s ease-in`,
            };
        } else {
            let x = this.state.nextIndex * this.props.letterSpacing;
            vertStyle = {
                transform: `translate(0px, 0px)`,
                transition: `transform ${LETTER_TRANSITION_TIME / 2000}s ease-in`,
            };
            horizStyle = {
                transform: `translate(${x}px, 0px)`,
                transition: `transform ${LETTER_TRANSITION_TIME / 2000}s ease-out`,
            };
        }
        return (
            <g style={vertStyle}>
                <g style={horizStyle}>
                    <Letter character={this.props.character} index={this.props.index} />
                </g>
            </g>
        );
    },
});

var AnagramSetComponent = React.createClass({
    getInitialState: function() {
        return {
            anagramIndex: 0,
        };
    },
    componentDidMount: function() {
        this._intervalId = setInterval(this._cycleAnagramIndex, ANAGRAM_CYCLE_TIME);
    },
    componentWillReceiveProps: function() {
        clearInterval(this._intervalId);
        this._intervalId = setInterval(this._cycleAnagramIndex, ANAGRAM_CYCLE_TIME);
        this.setState({
            anagramIndex: 0,
        });
    },
    componentWillUnmount: function() {
        clearInterval(this._intervalId);
    },
    _cycleAnagramIndex: function() {
        var newAnagramIndex = (this.state.anagramIndex + 1) % this.props.anagramSet.getAnagramCount();
        this.setState({
            anagramIndex: newAnagramIndex,
        });
    },
    render: function() {
        var anagramSet = this.props.anagramSet;
        var anagramIndex = this.state.anagramIndex;

        var anagramLength = anagramSet.getLengthOfAnagram(anagramIndex);
        var letterSpacing = Math.min(LETTER_SPACING, (WIDTH_PX - LETTER_SPACING) / anagramLength);
        var xOffset = -1 * (anagramLength - 1) / 2 * letterSpacing;
        var letterCount = anagramSet.getLetterCount();

        var letterComponents = [];
        for (var letterIndex = 0; letterIndex < letterCount; letterIndex++) {
            letterComponents.push(
                <RearrangingLetter
                    character={anagramSet.getLetterAtLetterIndex(letterIndex)}
                    index={anagramSet.getLetterOffsetForAnagram(anagramIndex, letterIndex) || 0}
                    key={anagramSet.getId() + '~' + letterIndex}
                    letterSpacing={letterSpacing}
                />
            );
        }

        var style = {
            transform: `translate(${xOffset}px, 0px)`,
            transition: `transform ${LETTER_TRANSITION_TIME / 1000}s ease`,
        };

        return (
            <g style={style}>
                {letterComponents}
            </g>
        );
    }
});

var AnagramDisplay = React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState: function() {
        return {
            anagramSets: [
                new AnagramSet(['STEVE DANIELS', 'VESTED ALIENS']),
                new AnagramSet(['ANAGRAMS NEVER LIE', 'A RENAMING REVEALS']),
            ],
            anagramSetIndex: 0,
            textValue: '',
        };
    },
    componentDidMount: function() {
        this._intervalId = setInterval(this._cycleAnagramSetIndex, ANAGRAM_SET_CYCLE_TIME);
    },
    componentWillUnmount: function() {
        clearInterval(this._intervalId);
    },
    _cycleAnagramSetIndex: function() {
        var newAnagramSetIndex = (this.state.anagramSetIndex + 1) % this.state.anagramSets.length;
        this.setState({
            anagramSetIndex: newAnagramSetIndex,
        });
    },
    render: function() {
        return (
            <div>
                <div className="main">
                    <svg width={WIDTH_PX} height={HEIGHT_PX} className="brickGrid">
                        <g transform={`translate(${WIDTH_PX / 2}, ${HEIGHT_PX / 2}) scale(1)`}>
                            <AnagramSetComponent anagramSet={this.state.anagramSets[this.state.anagramSetIndex]} />
                        </g>
                    </svg>
                </div>
                <input className="anagramTextInput" type="text" valueLink={this.linkState('textValue')} />
            </div>
        );
    },
});

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
      <div className="main">
        <AnagramDisplay />
      </div>,
      document.getElementById('start')
    );
});
