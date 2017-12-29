const _ = require('lodash');
const React = require('react');
const tinycolor = require('tinycolor2');
const {runAtTimestamp} = require('js/core/utils/time');
const {logerp} = require('js/core/utils/math');
const mapColorString = require('js/core/utils/mapColorString');

const gray = tinycolor('#909090');

const IS_NEGATED = true;

const WallLatticePixel = React.createClass({
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        wallLatticeParameters: React.PropTypes.object,
        influences: React.PropTypes.array,
        refreshTimer: React.PropTypes.object,
    },
    componentWillMount() {
        let dy = 0;
        if (this.props.polygonOrEdge.pointsAroundCenter && this.props.polygonOrEdge.center[0] === 0 && this.props.polygonOrEdge.center[1] === 0) {
            dy = this.props.polygonOrEdge.yMax;
        }
        this._x = (this.props.tx + this.props.polygonOrEdge.center[0] - 7.5) * 5;
        this._y = (this.props.ty + this.props.polygonOrEdge.center[1] + dy - 2.6) * 5;
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
        //     this.context.wallLatticeParameters.latency.setValue((Date.now() - tempo.getNextTick()) / 1000);
        // }

        this._nextState = _.clone(this.state);
        this._nextState.ticks++;

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
        const isOdd = this.state.ticks % 2;
        const rotation = IS_NEGATED ? (isOdd ? -90 : 90) : (isOdd ? 360 : 0);
        const [x, y] = this.props.polygonOrEdge.center;
        const {x: ax, y: ay} = this.context.refreshTimer.getRefreshGradient(this._y, this._x);

        const tempo = this.context.beatmathParameters.tempo;
        const flipDurationPercent = this.context.wallLatticeParameters.flipDurationPercent.getValue();
        const duration = flipDurationPercent * tempo.getPeriod();

        const style = {
            transform: `translate(${x}px,${y}px) rotate3d(${ax},${ay},0,${rotation}deg)`,
            transition: IS_NEGATED ? `all ${duration}ms linear` : `all ${duration}ms cubic-bezier(1,0,0,1)`,
        };

        const color = mapColorString(this.state.color);

        if (this.props.type === 'polygon') {
            return (
                <polygon className="mine" style={style} fill={color} points={this.props.polygonOrEdge.pointsAroundCenter} />
            );
        } else {
            return (
                <line {...this.props.polygonOrEdge.x1x2y1y2AroundCenter} style={style} className="edge" stroke={color} />
            );
        }
    },
});

module.exports = WallLatticePixel;
