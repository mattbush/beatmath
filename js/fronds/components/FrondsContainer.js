const React = require('react');
const FrondsParameters = require('js/fronds/parameters/FrondsParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');

const FrondsContainer = React.createClass({
    childContextTypes: {
        frondsParameters: React.PropTypes.object,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            frondsParameters: this.state.frondsParameters,
        };
    },
    getInitialState: function() {
        return {
            frondsParameters: new FrondsParameters(this.context.mixboard, this.context.beatmathParameters),
        };
    },
    render: function() {
        return (
            <BeatmathFrame>
                Hello world!
            </BeatmathFrame>
        );
    },
});

module.exports = FrondsContainer;
