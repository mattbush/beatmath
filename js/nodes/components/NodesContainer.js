const React = require('react');
const NodesParameters = require('js/nodes/parameters/NodesParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const NodeComponent = require('js/nodes/components/NodeComponent');
const EdgeComponent = require('js/nodes/components/EdgeComponent');

const NodesFrame = React.createClass({
    mixins: [ParameterBindingsMixin],
    contextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
        nodesParameters: React.PropTypes.object,
    },
    getParameterBindings: function() {
        return {
            tempo: this.context.beatmathParameters.tempo,
        };
    },
    render: function() {
        return (
            <g style={{transform: 'scale(400)'}}>
                {this.context.nodesParameters.mapEdges((node1, node2) =>
                    <EdgeComponent key={`${node1.getId()}~${node2.getId()}`} node1={node1} node2={node2} />
                )}
                {this.context.nodesParameters.mapRings(ring =>
                    ring.mapNodesInRing(node =>
                        <NodeComponent key={node.getId()} node={node} />
                    )
                )}
            </g>
        );
    },
});

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
                <NodesFrame />
            </BeatmathFrame>
        );
    },
});

module.exports = NodesContainer;
