const _ = require('lodash');
const React = require('react');
const tinycolor = require('tinycolor2');
const {runAtTimestamp} = require('js/core/utils/time');
const earth = require('js/earthday/science/earth');
const {dist, lerp, RAD_2_DEG, DEG_2_RAD} = require('js/core/utils/math');
const {sin, cos, asin, atan2} = Math;
const mapColorString = require('js/core/utils/mapColorString');

const {CELL_SIZE} = require('js/earthday/parameters/EarthdayConstants');

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

const EarthdayPixel = React.createClass({
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        earthdayParameters: React.PropTypes.object,
        influences: React.PropTypes.array,
        refreshTimer: React.PropTypes.object,
    },
    getInitialState() {
        const rowTriangular = calculateRowTriangular(this.props.row, this.props.col);
        const colTriangular = calculateColTriangular(this.props.row, this.props.col);
        const triangularGridPercent = this.context.earthdayParameters.triangularGridPercent.getValue();
        return {
            rowTriangular,
            colTriangular,
            triangularGridPercent,
            color: gray,
            rowComputed: lerp(this.props.row, rowTriangular, triangularGridPercent),
            colComputed: lerp(this.props.col, colTriangular, triangularGridPercent),
        };
    },
    componentDidMount: function() {
        this._scheduleNextUpdate();
    },
    _scheduleNextUpdate: function() {
        const tempo = this.context.beatmathParameters.tempo;

        const [lat, long] = this._getLatLong();
        const earthRotationDegreesUntilNextChange = earth.getDLongForNextChange(lat, long);
        const degreesPerTick = this.context.earthdayParameters.rotationSpeed.getValue();
        const ticksUntilNextChange = earthRotationDegreesUntilNextChange / degreesPerTick;
        const timeUntilNextChange = ticksUntilNextChange * tempo.getPeriod();
        runAtTimestamp(this._update, Date.now() + timeUntilNextChange);
    },
    _update: function() {
        if (!this.isMounted()) {
            return;
        }

        this._scheduleNextUpdate();

        this._nextState = _.clone(this.state);

        const triangularGridPercent = this.context.earthdayParameters.triangularGridPercent.getValue();
        if (triangularGridPercent !== this.state.triangularGridPercent) {
            this._nextState.triangularGridPercent = triangularGridPercent;
            this._nextState.rowComputed = lerp(this.props.row, this.state.rowTriangular, triangularGridPercent);
            this._nextState.colComputed = lerp(this.props.col, this.state.colTriangular, triangularGridPercent);
        }

        _.each(this.context.influences, this._mixInfluenceIntoNextState);
        this.setState(this._nextState);
    },
    _mixInfluenceIntoNextState: function(influence) {
        return influence.mix(this._nextState, this.state.rowComputed, this.state.colComputed);
    },
    _getColorHexString() {
        const color = this.state.color;
        const hexString = color.toHexString(true);
        return mapColorString(hexString);
    },
    _getLatLong() {
        const earthRotationDeg = this.context.earthdayParameters.getRotation();

        const scale = this.context.earthdayParameters.scale.getValue();
        const tilt = this.context.earthdayParameters.tilt.getValue();
        const x = this.state.colComputed;
        const y = -this.state.rowComputed;

        if (this.context.earthdayParameters.spherical.getValue()) {
            const R = scale;
            const p = dist(x, y);
            if (p >= R) {
                return [];
            }
            const lat0 = DEG_2_RAD * tilt;
            const c = asin(p / R);

            const lat = asin(cos(c) * sin(lat0) + y * sin(c) * cos(lat0) / p) * RAD_2_DEG;
            const long = atan2(x * sin(c), p * cos(c) * cos(lat0) - y * sin(c) * sin(lat0)) * RAD_2_DEG - earthRotationDeg;
            return [lat, long];
        } else {
            return [y * (25 / scale) + tilt, x * (25 / scale) - earthRotationDeg];
        }
    },
    render: function() {
        const x = this.state.colComputed * CELL_SIZE;
        const y = this.state.rowComputed * CELL_SIZE;

        const [lat, long] = this._getLatLong();

        const isLand = earth.isLatLongLand(lat, long);
        const rotation = isLand ? 0 : 90;

        const degreesPerTick = this.context.earthdayParameters.rotationSpeed.getValue();
        const transitionTimeMs = 2500 / degreesPerTick;
        const style = {
            transform: `translate(${x}px,${y}px) rotate3d(0,1,0,${rotation}deg) scale(${CELL_SIZE / 2})`,
            transition: `all ${transitionTimeMs}ms linear`,
        };

        const shape = this.context.earthdayParameters.triangularGridPercent.getValue() >= 0.5 ?
            <circle cx="0" cy="0" r="1" fill={this._getColorHexString()} /> :
            <rect x="-1" y="-1" width="2" height="2" fill={this._getColorHexString()} />;

        return (
            <g style={style}>
                {shape}
            </g>
        );

    },
});

module.exports = EarthdayPixel;
