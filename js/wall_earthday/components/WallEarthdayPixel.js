const _ = require('lodash');
const React = require('react');
const tinycolor = require('tinycolor2');
const {runAtTimestamp} = require('js/core/utils/time');
const earth = require('js/wall_earthday/science/earth');
const {dist, RAD_2_DEG} = require('js/core/utils/math');

const gray = tinycolor('#909090');

const DEGREES_PER_TICK = 20;

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
        this._scheduleNextUpdate();
    },
    getInitialState: function() {
        return {
            color: gray,
            ticks: 0,
        };
    },
    _scheduleNextUpdate: function() {
        const tempo = this.context.beatmathParameters.tempo;

        const [lat, long] = this._getLatLong();
        const earthRotationDegreesUntilNextChange = earth.getDLongForNextChange(lat, long);
        const ticksUntilNextChange = earthRotationDegreesUntilNextChange / DEGREES_PER_TICK;
        const timeUntilNextChange = ticksUntilNextChange * tempo.getPeriod();
        runAtTimestamp(this._update, Date.now() + timeUntilNextChange);
    },
    _update: function() {
        if (!this.isMounted()) {
            return;
        }

        this._scheduleNextUpdate();

        this._nextState = _.clone(this.state);
        this._nextState.ticks++;

        _.each(this.context.influences, this._mixInfluenceIntoNextState);
        this.setState(this._nextState);
    },
    _mixInfluenceIntoNextState: function(influence) {
        return influence.mix(this._nextState, this._y, this._x);
    },
    _getLatLong() {
        const tempo = this.context.beatmathParameters.tempo;
        const earthRotationDeg = tempo.getNumTicksFractional() * DEGREES_PER_TICK;

        const SPHERICAL_PROJECTION = true;

        if (SPHERICAL_PROJECTION) {
            const R = 20;
            const p = dist(this._x, this._y);
            if (p >= R) {
                return [];
            }
            const c = Math.asin(p / R);
            const lat = Math.asin(-this._y * Math.sin(c) / p) * RAD_2_DEG;
            const long = Math.atan2(this._x * Math.sin(c), p * Math.cos(c)) * RAD_2_DEG;
            return [lat, long + earthRotationDeg];
        } else {
            const NON_SPHERICAL_SCALE = 4;
            const TILT_DEGREES = 20;
            return [-this._y * NON_SPHERICAL_SCALE + TILT_DEGREES, this._x * NON_SPHERICAL_SCALE + earthRotationDeg];
        }
    },
    render: function() {
        const [lat, long] = this._getLatLong();

        const isLand = earth.isLatLongLand(lat, long);
        const rotation = isLand ? 0 : 90;

        const [x, y] = this.props.polygon.center;
        const transitionTimeMs = 5000 / DEGREES_PER_TICK;
        const style = {
            transform: `translate(${x}px,${y}px) rotate3d(0,1,0,${rotation}deg)`,
            transition: `all ${transitionTimeMs}ms linear`,
        };
        return (
            <polygon className="mine" style={style} fill={this.state.color} points={this.props.polygon.pointsAroundCenter} />
        );
    },
});

module.exports = WallEarthdayPixel;
