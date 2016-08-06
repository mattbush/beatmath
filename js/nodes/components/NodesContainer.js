const _ = require('lodash');
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
        let rings;
        if (_.has(this.props, 'mapperShapeIndex')) {
            const mapperShapeIndex = this.props.mapperShapeIndex;
            const ringIndex = mapperShapeIndex % this.context.nodesParameters.getNumRings();
            const ring = this.context.nodesParameters.getRingAtIndex(ringIndex);
            rings = [
                ...ring.mapNodesInRing(node =>
                    <NodeComponent key={node.getId()} node={node} />
                ),
                ...ring.mapEdges((node1, node2) =>
                    <EdgeComponent key={`${node1.getId()}~${node2.getId()}`} node1={node1} node2={node2} />
                ),
            ];
        } else {
            rings = this.context.nodesParameters.mapRings(ring =>
                [
                    ...ring.mapNodesInRing(node =>
                        <NodeComponent key={node.getId()} node={node} />
                    ),
                    ...ring.mapEdges((node1, node2) =>
                        <EdgeComponent key={`${node1.getId()}~${node2.getId()}`} node1={node1} node2={node2} />
                    ),
                ]
            );
        }

        return (
            <g style={{transform: 'scale(400)'}}>
                {rings}
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
