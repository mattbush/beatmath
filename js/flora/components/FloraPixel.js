const _ = require('lodash');
const React = require('react');
const tinycolor = require('tinycolor2');
const FloraInnerPixel = require('js/flora/components/FloraInnerPixel');
const {runAtTimestamp} = require('js/core/utils/time');
const {lerp} = require('js/core/utils/math');

const {CELL_SIZE} = require('js/flora/parameters/FloraConstants');

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

const FloraPixel = React.createClass({
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        floraParameters: React.PropTypes.object,
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
        const triangularGridPercent = this.context.floraParameters.triangularGridPercent.getValue();
        const raiseOriginPercent = this.context.beatmathParameters.raiseOriginPercent.getValue();
        const rowComputed = lerp(this.props.row, rowTriangular, triangularGridPercent);

        return {
            rowTriangular,
            colTriangular,
            triangularGridPercent,
            raiseOriginPercent,
            color: gray,
            size: CELL_SIZE * 0.4,
            rotation: 0,
            rowComputed,
            rowComputedForRefresh: rowComputed + this.context.floraParameters.numRows.getValue() * raiseOriginPercent,
            colComputed: lerp(this.props.col, colTriangular, triangularGridPercent),
            aperture: 64,
            rotundity: 64,
        };
    },
    _update: function() {
        if (!this.isMounted()) {
            return;
        }
        const tempo = this.context.beatmathParameters.tempo;
        const triangularGridPercent = this.context.floraParameters.triangularGridPercent.getValue();
        const raiseOriginPercent = this.context.beatmathParameters.raiseOriginPercent.getValue();

        let refreshOffset = this._getRefreshOffset();
        if (tempo.getNumTicks() % 2 &&
            this.context.floraParameters.oscillate.getValue()) {
            refreshOffset = tempo.getPeriod() - refreshOffset;
        }
        runAtTimestamp(this._update, tempo.getNextTick() + refreshOffset);
        if (this.props.row === 0 && this.props.col === 0) {
            this.context.floraParameters.latency.setValue((Date.now() - tempo.getNextTick()) / 1000);
        }

        this._nextState = _.clone(this.state);
        if (triangularGridPercent !== this.state.triangularGridPercent || raiseOriginPercent !== this.state.raiseOriginPercent) {
            const rowComputed = lerp(this.props.row, this.state.rowTriangular, triangularGridPercent);

            this._nextState.triangularGridPercent = triangularGridPercent;
            this._nextState.raiseOriginPercent = raiseOriginPercent;
            this._nextState.rowComputed = rowComputed;
            this._nextState.rowComputedForRefresh = rowComputed + this.context.floraParameters.numRows.getValue() * raiseOriginPercent;
            this._nextState.colComputed = lerp(this.props.col, this.state.colTriangular, triangularGridPercent);
        }

        _.each(this.context.influences, this._mixInfluenceIntoNextState);
        const wavePercent = this.context.floraParameters.wavePercent.getValue();
        if (wavePercent) {
            const sizeModFromOffset = (tempo.getNumTicks() % 2) + (refreshOffset / tempo.getPeriod()) / 2;
            this._nextState.size = lerp(this._nextState.size, CELL_SIZE * lerp(1.5, 0, sizeModFromOffset), wavePercent);
        }
        this.setState(this._nextState);
    },
    _getRefreshOffset: function() {
        // just use one or the other, rather than a mix, to take advantage of the cache
        const useTriangularGrid = this.context.floraParameters.triangularGridPercent.getValue() >= 0.5;
        return this.context.refreshTimer.getRefreshOffset(
            this.state.rowComputedForRefresh,
            useTriangularGrid ? this.state.colTriangular : this.props.col,
        );
    },
    _mixInfluenceIntoNextState: function(influence) {
        return influence.mix(this._nextState, this.state.rowComputed, Math.abs(this.state.colComputed));
    },
    render: function() {
        const rotation = Math.floor(this.state.rotation);
        const x = this.state.colComputed * CELL_SIZE;
        const y = this.state.rowComputed * CELL_SIZE;
        const fill = this.state.color;
        const transitionTime = this.context.beatmathParameters.tempo.getPeriod();

        const scale = this.state.size / 2;

        const style = {
            transform: `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`,
            transition: `transform ${transitionTime}ms ease`,
        };

        return (
            <g style={style}>
                <FloraInnerPixel color={fill} aperture={Math.round(this.state.aperture)} rotundity={Math.round(this.state.rotundity)} />
            </g>
        );
    },
});

module.exports = FloraPixel;
