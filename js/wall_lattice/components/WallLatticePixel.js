const _ = require('lodash');
const React = require('react');
const tinycolor = require('tinycolor2');
const {runAtTimestamp} = require('js/core/utils/time');
const {logerp} = require('js/core/utils/math');

const gray = tinycolor('#909090');

const WallLatticePixel = React.createClass({
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        wallLatticeParameters: React.PropTypes.object,
        influences: React.PropTypes.array,
        refreshTimer: React.PropTypes.object,
    },
    componentWillMount() {
        let dy = 0;
        if (this.props.polygon.center[0] === 0 && this.props.polygon.center[1] === 0) {
            dy = this.props.polygon.yMax;
        }
        this._x = (this.props.tx + this.props.polygon.center[0] - 7) * 5;
        this._y = (this.props.ty + this.props.polygon.center[1] + dy - 1.5) * 5;
    },
    componentDidMount: function() {
        const tempo = this.context.beatmathParameters.tempo;
        const refreshOffset = this._getRefreshOffset();
        runAtTimestamp(this._update, tempo.getNextTick() + refreshOffset);
    },
    getInitialState: function() {
        return {
            color: gray,
        };
    },
    _update: function() {
        if (!this.isMounted()) {
            return;
        }
        const tempo = this.context.beatmathParameters.tempo;

        let refreshOffset = this._getRefreshOffset();
        runAtTimestamp(this._update, tempo.getNextTick() + refreshOffset);
        if (Math.random() < 0.01) {
            this.context.wallLatticeParameters.latency.setValue((Date.now() - tempo.getNextTick()) / 1000);
        }

        this._nextState = _.clone(this.state);

        _.each(this.context.influences, this._mixInfluenceIntoNextState);
        const wavePercent = this.context.wallLatticeParameters.wavePercent.getValue();
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
        return (
            <polygon className="mine" fill={this.state.color} points={this.props.polygon.points} />
        );
    },
});

module.exports = WallLatticePixel;
