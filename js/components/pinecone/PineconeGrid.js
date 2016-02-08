// var _ = require('underscore');
var React = require('react');
var BeatmathFrame = require('js/components/BeatmathFrame');
var ParameterBindingsMixin = require('js/components/ParameterBindingsMixin');
var PineconeParameters = require('js/parameters/pinecone/PineconeParameters');

var NUM_ROWS = 6;
var NUM_COLS = 6;
var TRIANGLE_SCALE = 32;
const {manhattanDist, posMod} = require('js/utils/math');

var shouldColor = function(x, y, isOuter) {
    var dist = manhattanDist(x, y);
    if (isOuter) {
        dist = dist + 1;
    }
    var result = posMod(dist + 1, 4) >= 2;
    // if ((dist % 2) && isOuter) {
    //     result = !result;
    // }
    return result;
};

var PineconeTriangle = React.createClass({
    render: function() {
        var x = this.props.x;
        var y = this.props.y;
        var isOuter = this.props.isOuter;
        var points, color;

        if (isOuter) {
            points = '1,1 0,1 1,0';
        } else {
            points = '0,0 1,0 0,1';
            color = '#08f';
        }

        if (shouldColor(x, y, isOuter)) {
            color = '#f80';
        } else {
            color = '#08f';
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
                    <PineconeTriangle key={`${x}~${y}~i`} x={x} y={y} isOuter={false} />
                );
                triangles.push(
                    <PineconeTriangle key={`${x}~${y}~o`} x={x} y={y} isOuter={true} />
                );
            }
        }

        var style = {
            transform: `scale(${TRIANGLE_SCALE}) scaleY(-1) translate(${-NUM_COLS / 2}px, ${-NUM_ROWS / 2}px)`,
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
