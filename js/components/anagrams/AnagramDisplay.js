var _ = require('underscore');
var React = require('react');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var AnagramSet = require('js/state/anagrams/AnagramSet');
var tinycolor = require('tinycolor2');

var timeout = duration => new Promise(cb => setTimeout(cb, duration));

const {WIDTH_PX, DESIRED_HEIGHT_PX} = require('js/beatmath_constants.js');

const LETTER_SPACING = 64;
const JUMP_UNIT_HEIGHT = -16;
const ANAGRAM_SET_CYCLE_TIME = 24000;
const ANAGRAM_CYCLE_TIME = 4000;
const LETTER_TRANSITION_TIME = 1000;
const WORD_TRANSITION_TIME = 600;
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

var DancingText = React.createClass({
    render: function() {
        var textLength = this.props.text.length;
        var letterSpacing = Math.min(LETTER_SPACING, (WIDTH_PX - LETTER_SPACING) / textLength);
        var xOffset = -1 * (textLength - 1) / 2 * letterSpacing;

        var letterComponents = [];
        for (var letterIndex = 0; letterIndex < textLength; letterIndex++) {
            let x = letterIndex * letterSpacing;
            style = {
                transform: `translate(${x}px, 0px)`,
            };
            letterComponents.push(
                <g style={style} key={letterIndex}>
                    <Letter character={this.props.text[letterIndex]} index={letterIndex} />
                </g>
            );
        }

        var style = {
            transform: `translate(${xOffset}px, 0px)`,
            transition: `transform ${WORD_TRANSITION_TIME / 2000}s ease`,
        };

        return (
            <g style={style}>
                {letterComponents}
            </g>
        );

    }
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
        var xOffset = -1 * (anagramLength - 1) / 2 * letterSpacing + WIDTH_PX * this.props.xPosition;
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

var AnagramSetCycler = React.createClass({
    getInitialState: function() {
        return {
            prevAnagramSetIndex: -1,
            anagramSetIndex: 0,
            nextAnagramSetIndex: -1,
        };
    },
    componentDidMount: function() {
        this._intervalId = setInterval(this._cycleAnagramSetIndex, ANAGRAM_SET_CYCLE_TIME);
    },
    componentWillUnmount: function() {
        clearInterval(this._intervalId);
    },
    _cycleAnagramSetIndex: async function() {
        var newAnagramSetIndex = (this.state.anagramSetIndex + 1) % this.props.anagramSets.length;
        this.setState({
            nextAnagramSetIndex: newAnagramSetIndex,
        });
        await timeout(LETTER_TRANSITION_TIME);
        this.setState({
            nextAnagramSetIndex: -1,
            anagramSetIndex: this.state.nextAnagramSetIndex,
            prevAnagramSetIndex: this.state.anagramSetIndex,
        });
        await timeout(LETTER_TRANSITION_TIME);
        this.setState({
            prevAnagramSetIndex: -1,
        });
    },
    render: function() {
        var prev = this.props.anagramSets[this.state.prevAnagramSetIndex];
        var cur = this.props.anagramSets[this.state.anagramSetIndex];
        var next = this.props.anagramSets[this.state.nextAnagramSetIndex];

        return (
            <g>
                {prev &&
                    <AnagramSetComponent xPosition={-1} anagramSet={prev} key={prev.getId()} />
                }
                <AnagramSetComponent xPosition={0} anagramSet={cur} key={cur.getId()} />
                {next &&
                    <AnagramSetComponent xPosition={1} anagramSet={next} key={next.getId()} />
                }
            </g>
        );
    },
});

var AnagramDisplay = React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState: function() {
        return {
            anagramSets: [
                new AnagramSet(['MATT BUSH', 'MATHTUBS']),
                new AnagramSet(['ANAGRAMS NEVER LIE', 'A RENAMING REVEALS']),
            ],
            inputState: null,
            error: false,
            textValue: '',
            textEntries: [],
        };
    },
    _onInputKeyDown: function(e) {
        if (this.state.inputState === null) {
            this.setState({
                inputState: 0,
                textValue: '',
                textEntries: [],
                error: false,
            });
            e.preventDefault();
        } else if (this.state.inputState === 0) {
            if (e.key === 'Enter') {
                this.state.textEntries.push(this.state.textValue.trim());
                this.setState({
                    textValue: '',
                    inputState: 1,
                    error: false,
                });
            } else if (e.key === 'Escape') {
                this.setState({inputState: null});
            }
        } else {
            if (e.key === 'Enter') {
                this.state.textEntries.push(this.state.textValue.trim());

                if (e.getModifierState('Shift')) {
                    this.setState({
                        textValue: '',
                        inputState: this.state.inputState + 1,
                        error: false,
                    });
                } else {
                    var anagramSet = new AnagramSet(this.state.textEntries);
                    if (anagramSet.isValid()) {
                        this.state.anagramSets.unshift(anagramSet);
                        this.setState({inputState: null});
                    } else {
                        this.state.textEntries.pop();
                        this.setState({
                            textValue: '',
                            error: true,
                        });
                    }
                }
            } else if (e.key === 'Escape') {
                this.setState({inputState: null});
            }
        }
    },
    _renderContents: function() {
        if (this.state.inputState === null) {
            return <AnagramSetCycler key={this.state.anagramSets.length} anagramSets={this.state.anagramSets} />;
        } else {
            var headerText = ['Enter your name', 'Enter your anagram'][this.state.inputState] || 'Enter another anagram';
            if (this.state.error) {
                headerText = 'Invalid. Re-' + headerText;
            }
            return (
                <g>
                    <text className="header" textAnchor="middle" x="0" y="-56">
                        {headerText.toUpperCase()}
                    </text>
                    <DancingText text={this.state.textValue.toUpperCase()} />
                </g>
            );
        }
    },
    render: function() {
        return (
            <div>
                {/* <div className="backgroundImage" style={{top: (DESIRED_HEIGHT_PX - HEIGHT_PX) / 2}} /> */}
                <div className="main">
                    <svg width={WIDTH_PX} height={DESIRED_HEIGHT_PX} className="brickGrid">
                        <g transform={`translate(${WIDTH_PX / 2}, ${DESIRED_HEIGHT_PX / 2}) scale(1)`}>
                            {this._renderContents()}
                        </g>
                    </svg>
                </div>
                <input
                    autoFocus={true}
                    className="anagramTextInput"
                    onKeyDown={this._onInputKeyDown}
                    type="text"
                    valueLink={this.linkState('textValue')}
                />
            </div>
        );
    },
});
