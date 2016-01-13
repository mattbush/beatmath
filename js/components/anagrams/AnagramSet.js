var React = require('react');
var Letter = require('js/components/anagrams/Letter');

const {WIDTH_PX} = require('js/parameters/BeatmathConstants.js');
const {LETTER_SPACING, ANAGRAM_CYCLE_TIME, JUMP_UNIT_HEIGHT, LETTER_TRANSITION_TIME} = require('js/parameters/anagrams/AnagramsConstants');

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

var AnagramSet = React.createClass({
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

module.exports = AnagramSet;
