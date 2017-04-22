const _ = require('lodash');
const React = require('react');
const tinycolor = require('tinycolor2');
const {runAtTimestamp} = require('js/core/utils/time');
const {logerp} = require('js/core/utils/math');
const earth = require('js/wall_earthday/science/earth');

const gray = tinycolor('#909090');

const IS_NEGATED = true;

const WallEarthdayPixel = React.createClass({
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        wallEarthdayParameters: React.PropTypes.object,
        influences: React.PropTypes.array,
        refreshTimer: React.PropTypes.object,
    },
    componentWillMount() {
        let dy = 0;
        if (this.props.polygon.center[0] === 0 && this.props.polygon.center[1] === 0) {
            dy = this.props.polygon.yMax;
        }
        this._x = (this.props.tx + this.props.polygon.center[0] - 7.5) * 5;
        this._y = (this.props.ty + this.props.polygon.center[1] + dy - 2.6) * 5;
    },
    componentDidMount: function() {
        const tempo = this.context.beatmathParameters.tempo;
        const refreshOffset = this._getRefreshOffset();
        runAtTimestamp(this._update, tempo.getNextTick() + refreshOffset);
    },
    getInitialState: function() {
        return {
            color: gray,
            ticks: 0,
        };
    },
    _update: function() {
        if (!this.isMounted()) {
            return;
        }
        const tempo = this.context.beatmathParameters.tempo;

        let refreshOffset = this._getRefreshOffset();
        runAtTimestamp(this._update, tempo.getNextTick() + refreshOffset);
        // if (Math.random() < 0.01) {
        //     this.context.wallEarthdayParameters.latency.setValue((Date.now() - tempo.getNextTick()) / 1000);
        // }

        this._nextState = _.clone(this.state);
        this._nextState.ticks++;

        _.each(this.context.influences, this._mixInfluenceIntoNextState);
        const wavePercent = this.context.wallEarthdayParameters.wavePercent.getValue();
        if (wavePercent) {
            const sizeModFromOffset = Math.exp((tempo.getNumTicks() % 2) + (refreshOffset / tempo.getPeriod()) / 2);
            this._nextState.color = this._nextState.color.spin(logerp(1, sizeModFromOffset, wavePercent));
        }
        this.setState(this._nextState);
    },
    _getRefreshOffset: function() {
        return this.context.refreshTimer.getRefreshOffset(this._y, this._x);
    },
    _mixInfluenceIntoNextState: function(influence) {
        return influence.mix(this._nextState, this._y, this._x);
    },
    render: function() {
        // const isOdd = this.state.ticks % 2;
        // const rotation = IS_NEGATED ? (isOdd ? -90 : 90) : (isOdd ? 360 : 0);
        const tempo = this.context.beatmathParameters.tempo;
        const earthRotationDeg = tempo.getNumTicksFractional() * 2;

        const isLand = earth.isLatLongLand(20 - this._y * 3, this._x * 3 + earthRotationDeg);
        const rotation = isLand ? 0 : 90;

        const [x, y] = this.props.polygon.center;
        const {x: ax, y: ay} = this.context.refreshTimer.getRefreshGradient(this._y, this._x);
        const style = {
            transform: `translate(${x}px,${y}px) rotate3d(${ax},${ay},0,${rotation}deg)`,
            transition: IS_NEGATED ? 'all 0.6s linear' : 'all 1.2s cubic-bezier(1,0,0,1)',
        };
        return (
            <polygon className="mine" style={style} fill={this.state.color} points={this.props.polygon.pointsAroundCenter} />
        );
    },
});

module.exports = WallEarthdayPixel;
