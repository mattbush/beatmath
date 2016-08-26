const _ = require('lodash');
const React = require('react');
const LatticeParameters = require('js/lattice/parameters/LatticeParameters');
const InfluenceCircle = require('js/lattice/components/InfluenceCircle');
const LatticePixel = require('js/lattice/components/LatticePixel');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const LatticeRefreshTimer = require('js/lattice/state/LatticeRefreshTimer');

const {MAX_SIZE} = require('js/lattice/parameters/LatticeConstants');

const tinycolor = require('tinycolor2');
const {ColorInfluence, RotationInfluence, SizeInfluence} = require('js/lattice/state/Influence');
const {arclerp} = require('js/core/utils/math');

const LatticeFrame = React.createClass({
    mixins: [ParameterBindingsMixin],
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        latticeParameters: React.PropTypes.object,
        influences: React.PropTypes.array,
        refreshTimer: React.PropTypes.object,
    },
    getParameterBindings: function() {
        return {
            showInfluences: this.context.latticeParameters.showInfluences,
            numRows: this.context.latticeParameters.numRows,
            numCols: this.context.latticeParameters.numCols,
            triangleCompressionPercent: this.context.beatmathParameters.triangleCompressionPercent,
        };
    },
    render: function() {
        const children = [];
        const numRows = this.getParameterValue('numRows');
        let numCols = this.getParameterValue('numCols');
        const triangleCompressionPercent = this.getParameterValue('triangleCompressionPercent');
        const isTower = this.props.groupType === 'tower';
        if (isTower) {
            numCols = 1;
        }

        for (let row = -numRows; row <= numRows; row++) {
            for (let col = -numCols; col <= numCols; col++) {
                // skip triangle-ey ones for perf
                if (!isTower && triangleCompressionPercent > 0) {
                    const rowPercent = arclerp(-numRows, numRows, row);
                    const colPercent = Math.abs(col) / numCols;
                    if ((colPercent - rowPercent) > (1 - triangleCompressionPercent)) {
                        continue;
                    }
                }
                children.push(<LatticePixel row={row} col={col} key={row + '|' + col} />);
            }
        }

        return (
            <g>
                {children}
                {this.getParameterValue('showInfluences') && <g>
                    {_.map(this.context.influences, (influence, index) =>
                        <InfluenceCircle influence={influence} key={index} />
                    )}
                </g>}
            </g>
        );
    },
});

const LatticeGrid = React.createClass({
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
        const mixboard = this.context.mixboard;
        const beatmathParameters = this.context.beatmathParameters;
        const latticeParameters = new LatticeParameters(mixboard, beatmathParameters);
        const refreshTimer = new LatticeRefreshTimer(mixboard, beatmathParameters, {latticeParameters});

        const influences = [
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
        return (
            <BeatmathFrame>
                <LatticeFrame />
            </BeatmathFrame>
        );
    },
});

module.exports = LatticeGrid;
