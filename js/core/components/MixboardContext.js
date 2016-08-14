const React = require('react');
const BeatmathParameters = require('js/core/parameters/BeatmathParameters');

const MixboardContext = React.createClass({
    getInitialState: function() {
        const {mixboard, ...restOfProps} = this.props;
        return {
            beatmathParameters: new BeatmathParameters(mixboard, restOfProps),
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
