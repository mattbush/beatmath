const React = require('react');
const WallLatticeParameters = require('js/wall_lattice/parameters/WallLatticeParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const WallLatticeGrid = require('js/wall_lattice/components/WallLatticeGrid');
const tinycolor = require('tinycolor2');
const {ColorInfluence} = require('js/lattice/state/Influence');
const LatticeRefreshTimer = require('js/lattice/state/LatticeRefreshTimer');

const WallLatticeContainer = React.createClass({
    childContextTypes: {
        wallLatticeParameters: React.PropTypes.object,
        influences: React.PropTypes.array,
        refreshTimer: React.PropTypes.object,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            wallLatticeParameters: this.state.wallLatticeParameters,
            influences: this.state.influences,
            refreshTimer: this.state.refreshTimer,
        };
    },
    getInitialState: function() {
        const mixboard = this.context.mixboard;
        const beatmathParameters = this.context.beatmathParameters;
        const wallLatticeParameters = new WallLatticeParameters(mixboard, beatmathParameters);
        const pieceParameters = wallLatticeParameters;
        const refreshTimer = new LatticeRefreshTimer(mixboard, beatmathParameters, {pieceParameters});

        const influences = [
            new ColorInfluence({beatmathParameters, pieceParameters, startCol: 0.3, startRow: 0.8, startValue: tinycolor('#ff0'), channelNumber: 0}),
            new ColorInfluence({beatmathParameters, pieceParameters, startCol: 0.7, startRow: 0.2, startValue: tinycolor('#0f0'), channelNumber: 1}),
            new ColorInfluence({beatmathParameters, pieceParameters, startCol: 0.5, startRow: 0.8, startValue: tinycolor('#00f'), channelNumber: 2}),
            new ColorInfluence({beatmathParameters, pieceParameters, startCol: 0.1, startRow: 0.2, startValue: tinycolor('#f00'), channelNumber: 3}),
            new ColorInfluence({beatmathParameters, pieceParameters, startCol: 0.9, startRow: 0.8, startValue: tinycolor('#0ff'), channelNumber: 4}),
        ];

        return {wallLatticeParameters, influences, refreshTimer};
    },
    getParameterBindings: function() {
        return {
            showInfluences: this.state.latticeParameters.showInfluences,
            numRows: this.state.latticeParameters.numRows,
            numColumns: this.state.latticeParameters.numColumns,
        };
    },

    render: function() {
        return (
            <BeatmathFrame>
                <WallLatticeGrid />
            </BeatmathFrame>
        );
    },
});

module.exports = WallLatticeContainer;
