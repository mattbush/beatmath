const _ = require('underscore');
const React = require('react');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const PineconeParameters = require('js/pinecone/parameters/PineconeParameters');

const NUM_ROWS = 6;
const NUM_COLS = 24;
const TRIANGLE_SCALE = 32;
const NUM_VERTICAL_REFLECTIONS = 3;
const {manhattanDist, posMod} = require('js/core/utils/math');

const shouldColor = function(x, y, isOuter) {
    let dist = manhattanDist(x, y);
    if (isOuter) {
        dist = dist + 1;
    }
    const result = posMod(dist + 1, 4) < 2;
    return !result !== !(y % 2); // xor
};

const PineconeTriangle = React.createClass({
    render: function() {
        const x = this.props.x;
        const y = this.props.y;
        const isOuter = this.props.isOuter;
        let points, color;

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

        const style = {
            transform: `translate(${x}px, ${y}px)`,
            fill: color,
        };

        return (
            <polygon style={style} points={points} />
        );
    },
});

const PineconeGrid = React.createClass({
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
        const mixboard = this.context.mixboard;
        const pineconeParameters = new PineconeParameters(mixboard, this.context.beatmathParameters);
        return {pineconeParameters};
    },
    getParameterBindings: function() {
        return {
//          foo: this.state.pineconeParameters.foo,
        };
    },
    render: function() {
        const triangles = [];
        for (let y = 0; y < NUM_ROWS; y++) {
            for (let x = 0; x < NUM_COLS; x++) {
                triangles.push(
                    <PineconeTriangle key={`${x}~${y}~i`} x={x} y={y} isOuter={false} />
                );
                triangles.push(
                    <PineconeTriangle key={`${x}~${y}~o`} x={x} y={y} isOuter={true} />
                );
            }
        }

        const reflections = [];
        _.times(NUM_VERTICAL_REFLECTIONS * 2 - 1, index => {
            index = index - (NUM_VERTICAL_REFLECTIONS - 1);
            const translate = index !== 0 ? ` translate(0px, ${NUM_ROWS * index * 2}px)` : '';
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
