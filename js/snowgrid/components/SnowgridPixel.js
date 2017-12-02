const _ = require('lodash');
const React = require('react');
const tinycolor = require('tinycolor2');
const SnowgridInnerPixel = require('js/snowgrid/components/SnowgridInnerPixel');
const {runAtTimestamp} = require('js/core/utils/time');
const {lerp} = require('js/core/utils/math');

const {CELL_SIZE} = require('js/snowgrid/parameters/SnowgridConstants');

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

const SnowgridPixel = React.createClass({
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        snowgridParameters: React.PropTypes.object,
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
        const triangularGridPercent = this.context.snowgridParameters.triangularGridPercent.getValue();
        return {
            rowTriangular,
            colTriangular,
            triangularGridPercent,
            color: gray,
            size: CELL_SIZE * 0.4,
            rotation: 0,
            rowComputed: lerp(this.props.row, rowTriangular, triangularGridPercent),
            colComputed: lerp(this.props.col, colTriangular, triangularGridPercent),
            length1: 4,
            length2: 4,
            width1: 4,
            width2: 4,
            offset2: 4,
        };
    },
    _update: function() {
        if (!this.isMounted()) {
            return;
        }
        const tempo = this.context.beatmathParameters.tempo;
        const triangularGridPercent = this.context.snowgridParameters.triangularGridPercent.getValue();

        let refreshOffset = this._getRefreshOffset();
        if (tempo.getNumTicks() % 2 &&
            this.context.snowgridParameters.oscillate.getValue()) {
            refreshOffset = tempo.getPeriod() - refreshOffset;
        }
        runAtTimestamp(this._update, tempo.getNextTick() + refreshOffset);
        if (this.props.row === 0 && this.props.col === 0) {
            this.context.snowgridParameters.latency.setValue((Date.now() - tempo.getNextTick()) / 1000);
        }

        this._nextState = _.clone(this.state);
        if (triangularGridPercent !== this.state.triangularGridPercent) {
            this._nextState.triangularGridPercent = triangularGridPercent;
            this._nextState.rowComputed = lerp(this.props.row, this.state.rowTriangular, triangularGridPercent);
            this._nextState.colComputed = lerp(this.props.col, this.state.colTriangular, triangularGridPercent);
        }

        _.each(this.context.influences, this._mixInfluenceIntoNextState);
        const wavePercent = this.context.snowgridParameters.wavePercent.getValue();
        if (wavePercent) {
            const sizeModFromOffset = (tempo.getNumTicks() % 2) + (refreshOffset / tempo.getPeriod()) / 2;
            this._nextState.size = lerp(this._nextState.size, CELL_SIZE * lerp(1.5, 0, sizeModFromOffset), wavePercent);
        }
        this.setState(this._nextState);
    },
    _getRefreshOffset: function() {
        // just use one or the other, rather than a mix, to take advantage of the cache
        const useTriangularGrid = this.context.snowgridParameters.triangularGridPercent.getValue() >= 0.5;
        return this.context.refreshTimer.getRefreshOffset(
            (useTriangularGrid ? this.state.rowTriangular : this.props.row) * 2,
            (useTriangularGrid ? this.state.colTriangular : this.props.col) * 2,
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

        const scale = (20 + this.state.size) / 50;

        const style = {
            transform: `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`,
        };

        return (
            <g style={style}>
                <SnowgridInnerPixel
                    color={fill}
                    length1={Math.round(this.state.length1)}
                    length2={Math.round(this.state.length2)}
                    width1={Math.round(this.state.width1)}
                    width2={Math.round(this.state.width2)}
                    offset2={Math.round(this.state.offset2)}
                />
            </g>
        );
    },
});

module.exports = SnowgridPixel;
