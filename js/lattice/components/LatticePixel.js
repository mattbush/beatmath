const _ = require('underscore');
const React = require('react');
const tinycolor = require('tinycolor2');
const BeatmathPixel = require('js/core/components/BeatmathPixel');
const {runAtTimestamp} = require('js/core/utils/time');
const {lerp} = require('js/core/utils/math');

const {CELL_SIZE} = require('js/lattice/parameters/LatticeConstants');

const SQRT_3_OVER_2 = Math.sqrt(3) / 2;
const SQRT_SQRT_3_OVER_2 = Math.sqrt(SQRT_3_OVER_2);

const gray = tinycolor('#909090');

const calculateRowTriangular = function(row) {
    return row * SQRT_SQRT_3_OVER_2;
};
const calculateColTriangular = function(row, col) {
    const val = (row % 2) ? (col + 0.25) : (col - 0.25);
    return val / SQRT_SQRT_3_OVER_2;
};

const LatticePixel = React.createClass({
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        latticeParameters: React.PropTypes.object,
        influences: React.PropTypes.array,
        refreshTimer: React.PropTypes.object,
    },
    componentDidMount: function() {
        const tempo = this.context.beatmathParameters.tempo;
        const refreshOffset = this._getRefreshOffset();
        runAtTimestamp(this._update, tempo.getNextTick() + refreshOffset);
    },
    getInitialState: function() {
        const rowTriangular = calculateRowTriangular(this.props.row, this.props.col);
        const colTriangular = calculateColTriangular(this.props.row, this.props.col);
        const triangularGridAmount = this.context.latticeParameters.triangularGridAmount.getValue();
        return {
            rowTriangular,
            colTriangular,
            triangularGridAmount,
            color: gray,
            size: CELL_SIZE * 0.4,
            rotation: 0,
            rowComputed: lerp(this.props.row, rowTriangular, triangularGridAmount),
            colComputed: lerp(this.props.col, colTriangular, triangularGridAmount),
        };
    },
    _update: function() {
        if (!this.isMounted()) {
            return;
        }
        const tempo = this.context.beatmathParameters.tempo;
        const triangularGridAmount = this.context.latticeParameters.triangularGridAmount.getValue();

        let refreshOffset = this._getRefreshOffset();
        if (tempo.getNumTicks() % 2 &&
            this.context.latticeParameters.oscillate.getValue()) {
            refreshOffset = tempo.getPeriod() - refreshOffset;
        }
        runAtTimestamp(this._update, tempo.getNextTick() + refreshOffset);

        this._nextState = _.clone(this.state);
        if (triangularGridAmount !== this.state.triangularGridAmount) {
            this._nextState.triangularGridAmount = triangularGridAmount;
            this._nextState.rowComputed = lerp(this.props.row, this.state.rowTriangular, triangularGridAmount);
            this._nextState.colComputed = lerp(this.props.col, this.state.colTriangular, triangularGridAmount);
        }

        _.each(this.context.influences, this._mixInfluenceIntoNextState);
        this.setState(this._nextState);
    },
    _getRefreshOffset: function() {
        // just use one or the other, rather than a mix, to take advantage of the cache
        const useTriangularGrid = this.context.latticeParameters.triangularGridAmount.getValue() >= 0.5;
        return this.context.refreshTimer.getRefreshOffset(
            useTriangularGrid ? this.state.rowTriangular : this.props.row,
            useTriangularGrid ? this.state.colTriangular : this.props.col,
        );
    },
    _mixInfluenceIntoNextState: function(influence) {
        return influence.mix(this._nextState, this.state.rowComputed, this.state.colComputed);
    },
    render: function() {
        const rotation = Math.floor(this.state.rotation);
        const x = this.state.colComputed * CELL_SIZE;
        const y = this.state.rowComputed * CELL_SIZE;
        const fill = this.state.color;

        const style = {
            transform: `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${this.state.size / 2})`,
        };

        return (
            <g style={style}>
                <BeatmathPixel color={fill} />
            </g>
        );
    },
});

module.exports = LatticePixel;
