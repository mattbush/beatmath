var React = require('react');
var Letter = require('js/components/anagrams/Letter');

const {WIDTH_PX} = require('js/parameters/BeatmathConstants.js');
const {LETTER_SPACING, WORD_TRANSITION_TIME} = require('js/parameters/anagrams/AnagramsConstants');

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

module.exports = DancingText;
