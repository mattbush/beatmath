// var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var AnagramSet = require('./anagram_set');

const {WIDTH_PX, HEIGHT_PX} = require('./beatmath_constants.js');

const LETTER_SPACING = 64;
const ANAGRAM_CYCLE_TIME = 2000;

var Letter = React.createClass({
    render: function() {
        var x = this.props.index * this.props.letterSpacing;
        return (
            <text className="letter" textAnchor="middle" x={x} y={0}>
                {this.props.character}
            </text>
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
        this._clearInterval(this._intervalId);
        this._intervalId = setInterval(this._cycleAnagramIndex, ANAGRAM_CYCLE_TIME);
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
                <Letter
                    character={anagramSet.getLetterAtLetterIndex(letterIndex)}
                    index={anagramSet.getLetterOffsetForAnagram(anagramIndex, letterIndex)}
                    key={letterIndex}
                    letterSpacing={letterSpacing}
                />
            );
        }

        return (
            <g transform={`translate(${xOffset}, 0)`}>
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
                new AnagramSet(['ANAGRAMS NEVER LIE', 'A RENAMING REVEALS']),
            ],
            textValue: '',
        };
    },
    render: function() {
        return (
            <div>
                <div className="main">
                    <svg width={WIDTH_PX} height={HEIGHT_PX} className="brickGrid">
                        <g transform={`translate(${WIDTH_PX / 2}, ${HEIGHT_PX / 2}) scale(1)`}>
                            <AnagramSetComponent anagramSet={this.state.anagramSets[0]} />
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
