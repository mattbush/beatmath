require('regenerator/runtime');
var React = require('react');
var BeatmathParameters = require('js/parameters/BeatmathParameters');

var MixboardContext = React.createClass({
    getInitialState: function() {
        return {
            beatmathParameters: new BeatmathParameters(this.props.mixboard),
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
