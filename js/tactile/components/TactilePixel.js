const _ = require('lodash');
const React = require('react');
const tinycolor = require('tinycolor2');
const mapColorString = require('js/core/utils/mapColorString');
const {runAtTimestamp} = require('js/core/utils/time');
const {lerp} = require('js/core/utils/math');

const {CELL_SIZE} = require('js/tactile/parameters/TactileConstants');

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

const TactilePixel = React.createClass({
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        tactileParameters: React.PropTypes.object,
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
        const triangularGridPercent = this.context.tactileParameters.triangularGridPercent.getValue();
        return {
            rowTriangular,
            colTriangular,
            triangularGridPercent,
            ticks: 0,
            color: gray,
            size: CELL_SIZE * 0.9,
            rowComputed: lerp(this.props.row, rowTriangular, triangularGridPercent),
            colComputed: lerp(this.props.col, colTriangular, triangularGridPercent),
        };
    },
    _update: function() {
        if (!this.isMounted()) {
            return;
        }
        const tempo = this.context.beatmathParameters.tempo;
        const triangularGridPercent = this.context.tactileParameters.triangularGridPercent.getValue();

        let refreshOffset = this._getRefreshOffset();
        if (tempo.getNumTicks() % 2 &&
            this.context.tactileParameters.oscillate.getValue()) {
            refreshOffset = tempo.getPeriod() - refreshOffset;
        }
        runAtTimestamp(this._update, tempo.getNextTick() + refreshOffset);
        if (this.props.row === 0 && this.props.col === 0) {
            this.context.tactileParameters.latency.setValue((Date.now() - tempo.getNextTick()) / 1000);
        }

        this._nextState = _.clone(this.state);
        this._nextState.ticks++;

        if (triangularGridPercent !== this.state.triangularGridPercent) {
            this._nextState.triangularGridPercent = triangularGridPercent;
            this._nextState.rowComputed = lerp(this.props.row, this.state.rowTriangular, triangularGridPercent);
            this._nextState.colComputed = lerp(this.props.col, this.state.colTriangular, triangularGridPercent);
        }

        _.each(this.context.influences, this._mixInfluenceIntoNextState);
        const wavePercent = this.context.tactileParameters.wavePercent.getValue();
        if (wavePercent) {
            const sizeModFromOffset = (tempo.getNumTicks() % 2) + (refreshOffset / tempo.getPeriod()) / 2;
            this._nextState.size = lerp(this._nextState.size, CELL_SIZE * lerp(1.5, 0, sizeModFromOffset), wavePercent);
        }
        this.setState(this._nextState);
    },
    _getRefreshOffset: function() {
        // just use one or the other, rather than a mix, to take advantage of the cache
        const useTriangularGrid = this.context.tactileParameters.triangularGridPercent.getValue() >= 0.5;
        return this.context.refreshTimer.getRefreshOffset(
            useTriangularGrid ? this.state.rowTriangular : this.props.row,
            useTriangularGrid ? this.state.colTriangular : this.props.col,
        );
    },
    _getRefreshGradient() {
        // just use one or the other, rather than a mix, to take advantage of the cache
        const useTriangularGrid = this.context.tactileParameters.triangularGridPercent.getValue() >= 0.5;
        return this.context.refreshTimer.getRefreshGradient(
            useTriangularGrid ? this.state.rowTriangular : this.props.row,
            useTriangularGrid ? this.state.colTriangular : this.props.col,
        );
    },
    _mixInfluenceIntoNextState: function(influence) {
        return influence.mix(this._nextState, this.state.rowComputed, this.state.colComputed);
    },
    _getColorHexString() {
        const color = this.state.color;
        const hexString = color.toHexString(true);
        return mapColorString(hexString);
    },
    render: function() {
        const x = this.state.colComputed * CELL_SIZE;
        const y = this.state.rowComputed * CELL_SIZE;

        const tempo = this.context.beatmathParameters.tempo;
        const duration = 0.5 * tempo.getPeriod();

        const isOdd = this.state.ticks % 2;
        const rotation = isOdd ? 90 : -90;
        const {x: ax, y: ay} = this._getRefreshGradient();
        const style = {
            transform: `translate(${x}px,${y}px) rotate3d(${ax},${ay},0,${rotation}deg) scale(${this.state.size / 2})`,
            transition: `all ${duration}ms linear`,
        };

        return (
            <g style={style}>
                <rect x="-1" y="-1" width="2" height="2" fill={this._getColorHexString()} />
            </g>
        );
    },
});

module.exports = TactilePixel;
