var _ = require('underscore');
var React = require('react');
var LatticeParameters = require('js/parameters/lattice/LatticeParameters');
var InfluenceCircle = require('js/components/lattice/InfluenceCircle');
var LatticePixel = require('js/components/lattice/LatticePixel');
var BeatmathFrame = require('js/components/BeatmathFrame');
var ParameterBindingsMixin = require('js/components/ParameterBindingsMixin');

const {NUM_COLS, NUM_ROWS, MAX_SIZE} = require('js/parameters/lattice/LatticeConstants');

var tinycolor = require('tinycolor2');
var {ColorInfluence, RotationInfluence, SizeInfluence} = require('js/state/lattice/Influence');

var influences = [
    new ColorInfluence({startCol: 0.2 * NUM_COLS, startRow: 0.2 * NUM_ROWS, startValue: tinycolor('#800'), index: 0}),
    new ColorInfluence({startCol: 0.8 * NUM_COLS, startRow: 0.2 * NUM_ROWS, startValue: tinycolor('#080'), index: 1}),
    new ColorInfluence({startCol: 0.5 * NUM_COLS, startRow: 0.8 * NUM_ROWS, startValue: tinycolor('#008'), index: 2}),

    new SizeInfluence({startCol: 0.2 * NUM_COLS, startRow: 0.2 * NUM_ROWS, startValue: MAX_SIZE * 0.5}),
    new SizeInfluence({startCol: 0.8 * NUM_COLS, startRow: 0.2 * NUM_ROWS, startValue: MAX_SIZE * 0.5}),
    new SizeInfluence({startCol: 0.5 * NUM_COLS, startRow: 0.8 * NUM_ROWS, startValue: MAX_SIZE * 0.5}),

    new RotationInfluence({startCol: 0.2 * NUM_COLS, startRow: 0.2 * NUM_ROWS, startValue: 0}),
    new RotationInfluence({startCol: 0.8 * NUM_COLS, startRow: 0.2 * NUM_ROWS, startValue: 0}),
    new RotationInfluence({startCol: 0.5 * NUM_COLS, startRow: 0.8 * NUM_ROWS, startValue: 0}),
];

var LatticeGrid = React.createClass({
    mixins: [ParameterBindingsMixin],
    childContextTypes: {
        latticeParameters: React.PropTypes.object,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            latticeParameters: this.state.latticeParameters,
        };
    },
    getInitialState: function() {
        return {
            latticeParameters: new LatticeParameters(this.context.mixboard),
        };
    },
    getParameterBindings: function() {
        return {
            showInfluences: this.state.latticeParameters.showInfluences,
        };
    },
    render: function() {
        const children = [];
        for (let row = 0; row < NUM_ROWS; row++) {
            for (let col = 0; col < NUM_COLS; col++) {
                children.push(<LatticePixel influences={influences} row={row} col={col} key={row + '|' + col} />);
            }
        }

        return (
            <BeatmathFrame disableTransform={true}>
                <g>
                    {children}
                </g>
                {this.getParameterValue('showInfluences') && <g>
                    {_.map(influences, (influence, index) =>
                        <InfluenceCircle influence={influence} key={index} />
                    )}
                </g>}
            </BeatmathFrame>
        );
    },
});

module.exports = LatticeGrid;
