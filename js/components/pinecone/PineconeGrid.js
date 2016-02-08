// var _ = require('underscore');
var React = require('react');
var BeatmathFrame = require('js/components/BeatmathFrame');
var ParameterBindingsMixin = require('js/components/ParameterBindingsMixin');
var PineconeParameters = require('js/parameters/pinecone/PineconeParameters');

var NUM_ROWS = 4;
var NUM_COLS = 4;
var TRIANGLE_SCALE = 20;

var PineconeTriangle = React.createClass({
    render: function() {
        var x = this.props.x;
        var y = this.props.y;
        var side = this.props.side;
        var points, color;

        if (side === 'inner') {
            points = '0,0 1,0 0,1';
            color = '#f00';
        } else {
            points = '1,1 0,1 1,0';
            color = '#0f0';
        }

        var style = {
            transform: `translate(${x}px, ${y}px)`,
            fill: color,
        };

        return (
            <polygon style={style} points={points} />
        );
    },
});

var PineconeGrid = React.createClass({
    mixins: [ParameterBindingsMixin],
    childContextTypes: {
        pineconeParameters: React.PropTypes.object,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            pineconeParameters: this.state.pineconeParameters,
        };
    },
    getInitialState: function() {
        var mixboard = this.context.mixboard;
        var pineconeParameters = new PineconeParameters(mixboard);
        return {pineconeParameters};
    },
    getParameterBindings: function() {
        return {
//          foo: this.state.pineconeParameters.foo,
        };
    },
    render: function() {
        var triangles = [];
        for (var y = 0; y < NUM_ROWS; y++) {
            for (var x = 0; x < NUM_COLS; x++) {
                triangles.push(
                    <PineconeTriangle key={`${x}~${y}~i`} x={x} y={y} side="inner" />
                );
                triangles.push(
                    <PineconeTriangle key={`${x}~${y}~o`} x={x} y={y} side="outer" />
                );
            }
        }

        var style = {
            transform: `scale(${TRIANGLE_SCALE})`,
        };

        return (
            <BeatmathFrame>
                <g style={style}>
                    {triangles}
                </g>
            </BeatmathFrame>
        );
    },
});

module.exports = PineconeGrid;
