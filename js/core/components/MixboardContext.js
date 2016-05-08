const React = require('react');
const BeatmathParameters = require('js/core/parameters/BeatmathParameters');

const MixboardContext = React.createClass({
    getInitialState: function() {
        return {
            beatmathParameters: new BeatmathParameters(this.props.mixboard, {
                bpmMod: this.props.bpmMod,
            }),
        };
    },
    childContextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            mixboard: this.props.mixboard,
            beatmathParameters: this.state.beatmathParameters,
        };
    },
    render: function() {
        return React.Children.only(this.props.children);
    },
});

module.exports = MixboardContext;
