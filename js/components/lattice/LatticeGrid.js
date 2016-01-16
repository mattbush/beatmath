var _ = require('underscore');
var React = require('react');
var LatticeParameters = require('js/parameters/lattice/LatticeParameters');
var InfluenceCircle = require('js/components/lattice/InfluenceCircle');
var LatticePixel = require('js/components/lattice/LatticePixel');
var BeatmathFrame = require('js/components/BeatmathFrame');
var ParameterBindingsMixin = require('js/components/ParameterBindingsMixin');

const {MAX_SIZE} = require('js/parameters/lattice/LatticeConstants');

var tinycolor = require('tinycolor2');
var {ColorInfluence, RotationInfluence, SizeInfluence} = require('js/state/lattice/Influence');

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
        var latticeParameters = new LatticeParameters(this.context.mixboard);

        var influences = [
            new ColorInfluence({latticeParameters, startCol: 0.2, startRow: 0.2, startValue: tinycolor('#800'), index: 0}),
            new ColorInfluence({latticeParameters, startCol: 0.8, startRow: 0.2, startValue: tinycolor('#080'), index: 1}),
            new ColorInfluence({latticeParameters, startCol: 0.5, startRow: 0.8, startValue: tinycolor('#008'), index: 2}),

            new SizeInfluence({latticeParameters, startCol: 0.2, startRow: 0.2, startValue: MAX_SIZE * 0.5}),
            new SizeInfluence({latticeParameters, startCol: 0.8, startRow: 0.2, startValue: MAX_SIZE * 0.5}),
            new SizeInfluence({latticeParameters, startCol: 0.5, startRow: 0.8, startValue: MAX_SIZE * 0.5}),

            new RotationInfluence({latticeParameters, startCol: 0.2, startRow: 0.2, startValue: 0}),
            new RotationInfluence({latticeParameters, startCol: 0.8, startRow: 0.2, startValue: 0}),
            new RotationInfluence({latticeParameters, startCol: 0.5, startRow: 0.8, startValue: 0}),
        ];

        return {latticeParameters, influences};
    },
    getParameterBindings: function() {
        return {
            showInfluences: this.state.latticeParameters.showInfluences,
            numRows: this.state.latticeParameters.numRows,
            numCols: this.state.latticeParameters.numCols,
        };
    },
    render: function() {
        const children = [];
        var numRows = this.getParameterValue('numRows');
        var numCols = this.getParameterValue('numCols');
        for (let row = -numRows; row <= numRows; row++) {
            for (let col = -numCols; col <= numCols; col++) {
                children.push(<LatticePixel influences={this.state.influences} row={row} col={col} key={row + '|' + col} />);
            }
        }

        return (
            <BeatmathFrame>
                <g>
                    {children}
                </g>
                {this.getParameterValue('showInfluences') && <g>
                    {_.map(this.state.influences, (influence, index) =>
                        <InfluenceCircle influence={influence} key={index} />
                    )}
                </g>}
            </BeatmathFrame>
        );
    },
});

module.exports = LatticeGrid;
