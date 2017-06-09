const _ = require('lodash');
const React = require('react');
const tinycolor = require('tinycolor2');
const FloraInnerPixel = require('js/flora/components/FloraInnerPixel');
const {runAtTimestamp} = require('js/core/utils/time');
const {lerp, modAndShiftToHalf} = require('js/core/utils/math');

const {CELL_SIZE, INFLUENCE_SCALE_FACTOR} = require('js/flora/parameters/FloraConstants');

const gray = tinycolor('#909090');

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
        this._row = this.props.row * INFLUENCE_SCALE_FACTOR;
        this._col = this.props.col * INFLUENCE_SCALE_FACTOR;

        return {
            color: gray,
            size: CELL_SIZE * 0.4,
            rotation: 0,
            aperture: 64,
            rotundity: 64,
        };
    },
    _update: function() {
        if (!this.isMounted()) {
            return;
        }
        const tempo = this.context.beatmathParameters.tempo;

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

        _.each(this.context.influences, this._mixInfluenceIntoNextState);
        const wavePercent = this.context.floraParameters.wavePercent.getValue();
        if (wavePercent) {
            const sizeModFromOffset = (tempo.getNumTicks() % 2) + (refreshOffset / tempo.getPeriod()) / 2;
            this._nextState.size = lerp(this._nextState.size, CELL_SIZE * lerp(1.5, 0, sizeModFromOffset), wavePercent);
        }
        this.setState(this._nextState);
    },
    _getRefreshOffset: function() {
        return this.context.refreshTimer.getRefreshOffset(this._row, this._col);
    },
    _mixInfluenceIntoNextState: function(influence) {
        return influence.mix(this._nextState, this._row, this._col);
    },
    render: function() {
        // round to the nearest 30 degrees
        const rotation = this.state.rotation - modAndShiftToHalf(this.state.rotation, 30);
        const x = this.props.col * CELL_SIZE;
        const y = this.props.row * CELL_SIZE;
        const fill = this.state.color;
        const transitionTime = this.context.beatmathParameters.tempo.getPeriod() / 3;

        const showCenters = this.context.floraParameters.showCenters.getValue();
        const showEdges = this.context.floraParameters.showEdges.getValue();
        const scaleMod = (showCenters && showEdges) ? 0.8 : showEdges ? 0.9 : 1.2;

        const scale = this.state.size / 2;

        const style = {
            transform: `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale * scaleMod})`,
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
