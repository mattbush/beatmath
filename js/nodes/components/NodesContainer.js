const React = require('react');
const NodesParameters = require('js/nodes/parameters/NodesParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const NodeComponent = require('js/nodes/components/NodeComponent');

const NodesContainer = React.createClass({
    mixins: [ParameterBindingsMixin],
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
    getParameterBindings: function() {
        return {
            tempo: this.context.beatmathParameters.tempo,
        };
    },
    render: function() {
        return (
            <BeatmathFrame>
                <g style={{transform: 'scale(400)'}}>
                    {this.state.nodesParameters.mapRings(ring =>
                        ring.mapNodesInRing(node =>
                            <NodeComponent key={node.getId()} node={node} />
                        )
                    )}
                </g>
            </BeatmathFrame>
        );
    },
});

module.exports = NodesContainer;
