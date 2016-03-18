var _ = require('underscore');
var React = require('react');
var BeatmathFrame = require('js/core/components/BeatmathFrame');
var ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
var PineconeParameters = require('js/pinecone/parameters/PineconeParameters');

var NUM_ROWS = 6;
var NUM_COLS = 24;
var TRIANGLE_SCALE = 32;
var NUM_VERTICAL_REFLECTIONS = 3;
const {manhattanDist, posMod} = require('js/core/utils/math');

var shouldColor = function(x, y, isOuter) {
    var dist = manhattanDist(x, y);
    if (isOuter) {
        dist = dist + 1;
    }
    var result = posMod(dist + 1, 4) < 2;
    return !result !== !(y % 2); // xor
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
            color = '#048';
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
        beatmathParameters: React.PropTypes.object,
        mixboard: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            pineconeParameters: this.state.pineconeParameters,
        };
    },
    getInitialState: function() {
        var mixboard = this.context.mixboard;
        var pineconeParameters = new PineconeParameters(mixboard, this.context.beatmathParameters);
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

        var reflections = [];
        _.times(NUM_VERTICAL_REFLECTIONS * 2 - 1, index => {
            index = index - (NUM_VERTICAL_REFLECTIONS - 1);
            var translate = index !== 0 ? ` translate(0px, ${NUM_ROWS * index * 2}px)` : '';
            reflections.push(
                {transform: `scale(${TRIANGLE_SCALE})${translate}`},
                {transform: `scale(${TRIANGLE_SCALE})${translate} scaleX(-1)`},
                {transform: `scale(${TRIANGLE_SCALE})${translate} scale(-1)`},
                {transform: `scale(${TRIANGLE_SCALE})${translate} scaleY(-1)`},
            );
        });

        return (
            <BeatmathFrame>
                {_.times(reflections.length, index =>
                    <g key={index} style={reflections[index]}>
                        {triangles}
                    </g>
                )}
            </BeatmathFrame>
        );
    },
});

module.exports = PineconeGrid;
