var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');
var LinkedStateMixin = require('react-addons-linked-state-mixin');

const {WIDTH_PX, HEIGHT_PX} = require('./beatmath_constants.js');

const LETTER_SPACING = 64;

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

var AnagramPair = React.createClass({
    render: function() {
        var anagram = this.props.anagramPair[0];
        var letterSpacing = Math.min(LETTER_SPACING, (WIDTH_PX - LETTER_SPACING) / anagram.length);
        var xOffset = -1 * (anagram.length - 1) / 2 * letterSpacing;
        var letters = _.map(anagram, (character, index) =>
            <Letter character={character} index={index} key={index} letterSpacing={letterSpacing} />
        );

        return (
            <g transform={`translate(${xOffset}, 0)`}>
                {letters}
            </g>
        );
    }
});

var AnagramDisplay = React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState: function() {
        return {
            anagramPairs: [
                ['ANAGRAMS NEVER LIE', 'A RENAMING REVEALS'],
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
                            <AnagramPair anagramPair={this.state.anagramPairs[0]} />
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
