const React = require('react');
const EarthdayParameters = require('js/earthday/parameters/EarthdayParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const EarthdayGrid = require('js/earthday/components/EarthdayGrid');
const tinycolor = require('tinycolor2');
const {ColorInfluence} = require('js/lattice/state/Influence');

const EarthdayContainer = React.createClass({
    childContextTypes: {
        earthdayParameters: React.PropTypes.object,
        influences: React.PropTypes.array,
        refreshTimer: React.PropTypes.object,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            earthdayParameters: this.state.earthdayParameters,
            influences: this.state.influences,
            refreshTimer: this.state.refreshTimer,
        };
    },
    getInitialState: function() {
        const mixboard = this.context.mixboard;
        const beatmathParameters = this.context.beatmathParameters;
        const earthdayParameters = new EarthdayParameters(mixboard, beatmathParameters);
        const pieceParameters = earthdayParameters;

        const influences = [
            new ColorInfluence({beatmathParameters, pieceParameters, startCol: 0.3, startRow: 0.8, startValue: tinycolor('#ff0'), channelNumber: 0}),
            new ColorInfluence({beatmathParameters, pieceParameters, startCol: 0.7, startRow: 0.2, startValue: tinycolor('#0f0'), channelNumber: 1}),
            new ColorInfluence({beatmathParameters, pieceParameters, startCol: 0.5, startRow: 0.8, startValue: tinycolor('#00f'), channelNumber: 2}),
            new ColorInfluence({beatmathParameters, pieceParameters, startCol: 0.1, startRow: 0.2, startValue: tinycolor('#f00'), channelNumber: 3}),
            new ColorInfluence({beatmathParameters, pieceParameters, startCol: 0.9, startRow: 0.8, startValue: tinycolor('#0ff'), channelNumber: 4}),
        ];

        return {earthdayParameters, influences};
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
                <EarthdayGrid />
            </BeatmathFrame>
        );
    },
});

module.exports = EarthdayContainer;
