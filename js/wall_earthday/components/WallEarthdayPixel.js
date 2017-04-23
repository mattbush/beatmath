const _ = require('lodash');
const React = require('react');
const tinycolor = require('tinycolor2');
const {runAtTimestamp} = require('js/core/utils/time');
const earth = require('js/wall_earthday/science/earth');
const {dist, RAD_2_DEG, DEG_2_RAD} = require('js/core/utils/math');
const {sin, cos, asin, atan2} = Math;
const mapColorString = require('js/core/utils/mapColorString');

const gray = tinycolor('#909090');

const DEGREES_PER_TICK = 10;
const PIXELS_PER_HEX_SCALE = 5;

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
        this._x = (this.props.tx + this.props.polygon.center[0] - 7.5) * PIXELS_PER_HEX_SCALE;
        this._y = (this.props.ty + this.props.polygon.center[1] + dy - 2.6) * PIXELS_PER_HEX_SCALE;
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

        const scale = this.context.wallEarthdayParameters.scale.getValue();
        const tilt = this.context.wallEarthdayParameters.tilt.getValue();

        if (this.context.wallEarthdayParameters.spherical.getValue()) {
            const x = this._x;
            const y = -this._y;
            const R = PIXELS_PER_HEX_SCALE * scale;
            const p = dist(x, y);
            if (p >= R) {
                return [];
            }
            const lat0 = DEG_2_RAD * tilt;
            const c = asin(p / R);

            const lat = asin(cos(c) * sin(lat0) + y * sin(c) * cos(lat0) / p) * RAD_2_DEG;
            const long = atan2(x * sin(c), p * cos(c) * cos(lat0) - y * sin(c) * sin(lat0)) * RAD_2_DEG + earthRotationDeg;
            return [lat, long];
        } else {
            return [-this._y * (25 / scale) + tilt, this._x * (25 / scale) + earthRotationDeg];
        }
    },
    render: function() {
        const [lat, long] = this._getLatLong();

        const isLand = earth.isLatLongLand(lat, long);
        const rotation = isLand ? 0 : 90;

        const [x, y] = this.props.polygon.center;
        const transitionTimeMs = 2500 / DEGREES_PER_TICK;
        const style = {
            transform: `translate(${x}px,${y}px) rotate3d(0,1,0,${rotation}deg)`,
            transition: `all ${transitionTimeMs}ms linear`,
        };

        const fill = mapColorString(this.state.color);

        return (
            <polygon className="mine" style={style} fill={fill} points={this.props.polygon.pointsAroundCenter} />
        );
    },
});

module.exports = WallEarthdayPixel;
