var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');

const {WIDTH_PX, HEIGHT_PX} = require('./beatmath_constants.js');

const LETTER_SPACING = 50;

var Letter = React.createClass({
    render: function() {
        var x = this.props.index * LETTER_SPACING;
        return (
            <text className="letter" textAnchor="middle" x={x} y={0}>
                {this.props.character}
            </text>
        );
    },
});

var AnagramPair = React.createClass({
    render: function() {
        var anagram = this.props.anagramPair[0];
        var xOffset = -1 * anagram.length / 2 * LETTER_SPACING;
        var letters = _.map(anagram, (character, index) =>
            <Letter character={character} index={index} key={index} />
        );

        return (
            <g transform={`translate(${xOffset}, 0)`}>
                {letters}
            </g>
        );
    }
});

var AnagramDisplay = React.createClass({
    getInitialState: function() {
        return {
            anagramPairs: [
                ['ANAGRAMS NEVER LIE', 'A RENAMING REVEALS'],
            ],
        };
    },
    render: function() {
        return (
            <svg width={WIDTH_PX} height={HEIGHT_PX} className="brickGrid">
                <g transform={`translate(${WIDTH_PX / 2}, ${HEIGHT_PX / 2}) scale(1)`}>
                    <AnagramPair anagramPair={this.state.anagramPairs[0]} />
                </g>
            </svg>
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
