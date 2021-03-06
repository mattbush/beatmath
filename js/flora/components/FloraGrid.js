const _ = require('lodash');
const React = require('react');
const FloraParameters = require('js/flora/parameters/FloraParameters');
const InfluenceCircle = require('js/lattice/components/InfluenceCircle');
const FloraPixel = require('js/flora/components/FloraPixel');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const LatticeRefreshTimer = require('js/lattice/state/LatticeRefreshTimer');

const {MAX_SIZE, CELL_SIZE} = require('js/flora/parameters/FloraConstants');

const tinycolor = require('tinycolor2');
const {ColorInfluence, RotationInfluence, SizeInfluence, ApertureInfluence, RotundityInfluence} = require('js/lattice/state/Influence');

const FloraGrid = React.createClass({
    mixins: [ParameterBindingsMixin],
    childContextTypes: {
        floraParameters: React.PropTypes.object,
        influences: React.PropTypes.array,
        refreshTimer: React.PropTypes.object,
    },
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        mixboard: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            floraParameters: this.state.floraParameters,
            influences: this.state.influences,
            refreshTimer: this.state.refreshTimer,
        };
    },
    getInitialState: function() {
        const mixboard = this.context.mixboard;
        const beatmathParameters = this.context.beatmathParameters;
        const floraParameters = new FloraParameters(mixboard, beatmathParameters);
        const pieceParameters = floraParameters;
        const refreshTimer = new LatticeRefreshTimer(mixboard, beatmathParameters, {pieceParameters});

        const influences = [
            new ColorInfluence({beatmathParameters, pieceParameters, startCol: 0.2, startRow: 0.2, startValue: tinycolor('#f00'), channelNumber: 0}),
            new ColorInfluence({beatmathParameters, pieceParameters, startCol: 0.8, startRow: 0.2, startValue: tinycolor('#0f0'), channelNumber: 1}),
            new ColorInfluence({beatmathParameters, pieceParameters, startCol: 0.5, startRow: 0.8, startValue: tinycolor('#00f'), channelNumber: 2}),

            new SizeInfluence({beatmathParameters, pieceParameters, startCol: 0.2, startRow: 0.2, startValue: MAX_SIZE * 0.5}),
            new SizeInfluence({beatmathParameters, pieceParameters, startCol: 0.8, startRow: 0.2, startValue: MAX_SIZE * 0.5}),

            new ApertureInfluence({beatmathParameters, pieceParameters, startCol: 0.9, startRow: 0.9, startValue: 32}),
            new ApertureInfluence({beatmathParameters, pieceParameters, startCol: 0.1, startRow: 0.1, startValue: 96}),

            new RotundityInfluence({beatmathParameters, pieceParameters, startCol: 0.9, startRow: 0.1, startValue: 32}),
            new RotundityInfluence({beatmathParameters, pieceParameters, startCol: 0.1, startRow: 0.9, startValue: 96}),

            new RotationInfluence({beatmathParameters, pieceParameters, startCol: 0.2, startRow: 0.2, startValue: 0}),
            new RotationInfluence({beatmathParameters, pieceParameters, startCol: 0.8, startRow: 0.2, startValue: 0}),
            new RotationInfluence({beatmathParameters, pieceParameters, startCol: 0.5, startRow: 0.8, startValue: 0}),
        ];

        return {floraParameters, influences, refreshTimer};
    },
    getParameterBindings: function() {
        return {
            showInfluences: this.state.floraParameters.showInfluences,
            numRows: this.state.floraParameters.numRows,
            numColumns: this.state.floraParameters.numColumns,
        };
    },
    render: function() {
        const children = [];
        const numRows = this.getParameterValue('numRows');
        const numColumns = this.getParameterValue('numColumns');
        const useTriangularGrid = this.state.floraParameters.triangularGridPercent.getValue() >= 0.5;

        for (let row = -numRows; row <= numRows; row++) {
            let minColumn = -numColumns;
            let maxColumn = numColumns;
            if (useTriangularGrid) {
                minColumn += Math.floor((Math.abs(row)) / 2);
                maxColumn -= Math.floor((Math.abs(row) + 1) / 2);
            }

            for (let col = minColumn; col <= maxColumn; col++) {
                children.push(<FloraPixel row={row} col={col} key={row + '|' + col} />);
            }
        }

        return (
            <BeatmathFrame>
                <g>
                    {children}
                    {this.getParameterValue('showInfluences') && <g>
                        {_.map(this.state.influences, (influence, index) =>
                            <InfluenceCircle influence={influence} key={index} cellSize={CELL_SIZE} />
                        )}
                    </g>}
                </g>
            </BeatmathFrame>
        );
    },
});

module.exports = FloraGrid;
