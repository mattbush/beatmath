var _ = require('underscore');
var React = require('react');
var LatticeParameters = require('js/parameters/lattice/LatticeParameters');
var InfluenceCircle = require('js/components/lattice/InfluenceCircle');
var LatticePixel = require('js/components/lattice/LatticePixel');
var BeatmathFrame = require('js/components/BeatmathFrame');
var ParameterBindingsMixin = require('js/components/ParameterBindingsMixin');
var LatticeRefreshTimer = require('js/state/lattice/LatticeRefreshTimer');

const {MAX_SIZE} = require('js/parameters/lattice/LatticeConstants');

var tinycolor = require('tinycolor2');
var {ColorInfluence, RotationInfluence, SizeInfluence} = require('js/state/lattice/Influence');

var LatticeGrid = React.createClass({
    mixins: [ParameterBindingsMixin],
    childContextTypes: {
        latticeParameters: React.PropTypes.object,
        influences: React.PropTypes.array,
        refreshTimer: React.PropTypes.object,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            latticeParameters: this.state.latticeParameters,
            influences: this.state.influences,
            refreshTimer: this.state.refreshTimer,
        };
    },
    getInitialState: function() {
        var mixboard = this.context.mixboard;
        var latticeParameters = new LatticeParameters(mixboard);

        var refreshTimer = new LatticeRefreshTimer({mixboard, latticeParameters});

        var influences = [
            new ColorInfluence({latticeParameters, startCol: 0.2, startRow: 0.2, startValue: tinycolor('#f00'), index: 0}),
            new ColorInfluence({latticeParameters, startCol: 0.8, startRow: 0.2, startValue: tinycolor('#0f0'), index: 1}),
            new ColorInfluence({latticeParameters, startCol: 0.5, startRow: 0.8, startValue: tinycolor('#00f'), index: 2}),

            new SizeInfluence({latticeParameters, startCol: 0.2, startRow: 0.2, startValue: MAX_SIZE * 0.5}),
            new SizeInfluence({latticeParameters, startCol: 0.8, startRow: 0.2, startValue: MAX_SIZE * 0.5}),
            new SizeInfluence({latticeParameters, startCol: 0.5, startRow: 0.8, startValue: MAX_SIZE * 0.5}),

            new RotationInfluence({latticeParameters, startCol: 0.2, startRow: 0.2, startValue: 0}),
            new RotationInfluence({latticeParameters, startCol: 0.8, startRow: 0.2, startValue: 0}),
            new RotationInfluence({latticeParameters, startCol: 0.5, startRow: 0.8, startValue: 0}),
        ];

        return {latticeParameters, influences, refreshTimer};
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
        var numRows = Math.floor(this.getParameterValue('numRows'));
        var numCols = Math.floor(this.getParameterValue('numCols'));
        for (let row = -numRows; row <= numRows; row++) {
            for (let col = -numCols; col <= numCols; col++) {
                children.push(<LatticePixel row={row} col={col} key={row + '|' + col} />);
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
