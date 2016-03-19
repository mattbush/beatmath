var _ = require('underscore');
var React = require('react');
var LatticeParameters = require('js/lattice/parameters/LatticeParameters');
var InfluenceCircle = require('js/lattice/components/InfluenceCircle');
var LatticePixel = require('js/lattice/components/LatticePixel');
var BeatmathFrame = require('js/core/components/BeatmathFrame');
var ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
var LatticeRefreshTimer = require('js/lattice/state/LatticeRefreshTimer');

const {MAX_SIZE} = require('js/lattice/parameters/LatticeConstants');

var tinycolor = require('tinycolor2');
var {ColorInfluence, RotationInfluence, SizeInfluence} = require('js/lattice/state/Influence');

var LatticeGrid = React.createClass({
    mixins: [ParameterBindingsMixin],
    childContextTypes: {
        latticeParameters: React.PropTypes.object,
        influences: React.PropTypes.array,
        refreshTimer: React.PropTypes.object,
    },
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
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
        var beatmathParameters = this.context.beatmathParameters;
        var latticeParameters = new LatticeParameters(mixboard, beatmathParameters);
        var refreshTimer = new LatticeRefreshTimer(mixboard, beatmathParameters);

        var influences = [
            new ColorInfluence({beatmathParameters, latticeParameters, startCol: 0.2, startRow: 0.2, startValue: tinycolor('#f00'), index: 0}),
            new ColorInfluence({beatmathParameters, latticeParameters, startCol: 0.8, startRow: 0.2, startValue: tinycolor('#0f0'), index: 1}),
            new ColorInfluence({beatmathParameters, latticeParameters, startCol: 0.5, startRow: 0.8, startValue: tinycolor('#00f'), index: 2}),

            new SizeInfluence({beatmathParameters, latticeParameters, startCol: 0.2, startRow: 0.2, startValue: MAX_SIZE * 0.5}),
            new SizeInfluence({beatmathParameters, latticeParameters, startCol: 0.8, startRow: 0.2, startValue: MAX_SIZE * 0.5}),
            new SizeInfluence({beatmathParameters, latticeParameters, startCol: 0.5, startRow: 0.8, startValue: MAX_SIZE * 0.5}),

            new RotationInfluence({beatmathParameters, latticeParameters, startCol: 0.2, startRow: 0.2, startValue: 0}),
            new RotationInfluence({beatmathParameters, latticeParameters, startCol: 0.8, startRow: 0.2, startValue: 0}),
            new RotationInfluence({beatmathParameters, latticeParameters, startCol: 0.5, startRow: 0.8, startValue: 0}),
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
