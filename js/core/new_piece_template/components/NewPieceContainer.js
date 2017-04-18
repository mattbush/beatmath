const React = require('react');
const NewPieceParameters = require('js/new_piece/parameters/NewPieceParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');

const NewPieceContainer = React.createClass({
    childContextTypes: {
        newPieceParameters: React.PropTypes.object,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
    },
    getChildContext() {
        return {
            newPieceParameters: this.state.newPieceParameters,
        };
    },
    getInitialState() {
        return {
            newPieceParameters: new NewPieceParameters(this.context.mixboard, this.context.beatmathParameters),
        };
    },
    render() {
        return (
            <BeatmathFrame>
                Hello world!
            </BeatmathFrame>
        );
    },
});

module.exports = NewPieceContainer;
