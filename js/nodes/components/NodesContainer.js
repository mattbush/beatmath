const React = require('react');
const NodesParameters = require('js/nodes/parameters/NodesParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');

const NodesContainer = React.createClass({
    childContextTypes: {
        nodesParameters: React.PropTypes.object,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            nodesParameters: this.state.nodesParameters,
        };
    },
    getInitialState: function() {
        return {
            nodesParameters: new NodesParameters(this.context.mixboard, this.context.beatmathParameters),
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

module.exports = NodesContainer;
