const React = require('react');

const NodeComponent = React.createClass({
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
    },
    render: function() {
        const node = this.props.node;
        const tempo = this.context.beatmathParameters.tempo;
        const nodeRadius = 0.01;
        const style = {
            transform: `translate(${node._x}px, ${node._y}px)`,
            transition: `transform ${tempo.getPeriod()}ms linear`,
            fill: '#ff9900',
        };
        return (
            <g style={style}>
                <circle cx={0} cy={0} r={nodeRadius} />
            </g>
        );
    },
});

module.exports = NodeComponent;
