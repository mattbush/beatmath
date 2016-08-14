const React = require('react');
const Letter = require('js/anagrams/components/Letter');

const {WIDTH_PX} = require('js/core/parameters/BeatmathConstants.js');
const {LETTER_SPACING, WORD_TRANSITION_TIME} = require('js/anagrams/parameters/AnagramsConstants');

const DancingText = React.createClass({
    render: function() {
        const textLength = this.props.text.length;
        const letterSpacing = Math.min(LETTER_SPACING, (WIDTH_PX - LETTER_SPACING) / textLength);
        const xOffset = -1 * (textLength - 1) / 2 * letterSpacing;

        const letterComponents = [];
        for (let letterIndex = 0; letterIndex < textLength; letterIndex++) {
            let x = letterIndex * letterSpacing;
            let style = {
                transform: `translate(${x}px, 0px)`,
            };
            letterComponents.push(
                <g style={style} key={letterIndex}>
                    <Letter character={this.props.text[letterIndex]} index={letterIndex} />
                </g>
            );
        }

        const style = {
            transform: `translate(${xOffset}px, 0px)`,
            transition: `transform ${WORD_TRANSITION_TIME / 2000}s ease`,
        };

        return (
            <g style={style}>
                {letterComponents}
            </g>
        );
    },
});

module.exports = DancingText;
