const _ = require('lodash');
const React = require('react');
const tinycolor = require('tinycolor2');
const mapColorString = require('js/core/utils/mapColorString');
const {runAtTimestamp} = require('js/core/utils/time');
const {lerp, xyRotatedAroundOriginWithAngle} = require('js/core/utils/math');

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
    componentDidMount() {
        const tempo = this.context.beatmathParameters.tempo;
        const refreshOffset = this._getRefreshOffset();
        runAtTimestamp(this._update, tempo.getNextTick() + refreshOffset);
    },
    getInitialState() {
        const rowTriangular = calculateRowTriangular(this.props.row, this.props.col);
        const colTriangular = calculateColTriangular(this.props.row, this.props.col);
        const triangularGridPercent = this.context.tactileParameters.triangularGridPercent.getValue();
        return {
            rowTriangular,
            colTriangular,
            triangularGridPercent,
            ticks: 0,
            color: gray,
            size: CELL_SIZE * 0.8,
            rowComputed: lerp(this.props.row, rowTriangular, triangularGridPercent),
            colComputed: lerp(this.props.col, colTriangular, triangularGridPercent),
        };
    },
    componentWillMount() {
        this._recalculateCoords();
    },
    _recalculateCoords() {
        const mapperShape = this.props.mapperShape;
        let cx, cy, tx, ty;
        if (mapperShape) {
            const frameScale = this.context.beatmathParameters.getFrameScale(); // only this can change while operating
            const rotationDeg = mapperShape.getRotationDeg();
            [cx, cy] = xyRotatedAroundOriginWithAngle(this.props.col, this.props.row, rotationDeg);
            cx *= frameScale;
            cy *= frameScale;
            [tx, ty] = [
                mapperShape.getCenterX() / CELL_SIZE,
                mapperShape.getCenterY() / CELL_SIZE,
            ];
        } else {
            [cx, cy] = [this.props.col, this.props.row];
            [tx, ty] = [0, 0];
        }

        this._txForInfluence = cx + tx; // position within all shapes
        this._tyForInfluence = cy + ty;
        this._cxForInfluence = cx; // position within current shape, rotated
        this._cyForInfluence = cy;
    },
    _update() {
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

        // divide by this since it's easier than scaling influences' boundaries by this
        const APPROX_NUM_SHAPE_LENGTHS_IN_FRAME = 4;

        const influenceWithinShapePercent = this.context.tactileParameters.influenceWithinShapePercent.getValue();
        this._influenceX = lerp(this._txForInfluence, this._cxForInfluence, influenceWithinShapePercent) / APPROX_NUM_SHAPE_LENGTHS_IN_FRAME;
        this._influenceY = lerp(this._tyForInfluence, this._cyForInfluence, influenceWithinShapePercent) / APPROX_NUM_SHAPE_LENGTHS_IN_FRAME;

        _.each(this.context.influences, this._mixInfluenceIntoNextState);
        const wavePercent = this.context.tactileParameters.wavePercent.getValue();
        if (wavePercent) {
            const sizeModFromOffset = (tempo.getNumTicks() % 2) + (refreshOffset / tempo.getPeriod()) / 2;
            this._nextState.size = lerp(this._nextState.size, CELL_SIZE * lerp(1.5, 0, sizeModFromOffset), wavePercent);
        }
        this.setState(this._nextState);
    },
    _getRefreshOffset() {
        // just use one or the other, rather than a mix, to take advantage of the cache
        // const useTriangularGrid = this.context.tactileParameters.triangularGridPercent.getValue() >= 0.5;
        return this.context.refreshTimer.getRefreshOffset(this._refreshY, this._refreshX);
    },
    _getRefreshGradient() {
        const raiseOriginPercent = this.context.beatmathParameters.raiseOriginPercent.getValue();

        // assumes this is called before _getRefreshOffset() and _mixInfluenceIntoNextState
        this._recalculateCoords();
        const refreshWithinShapePercent = this.context.tactileParameters.refreshWithinShapePercent.getValue();
        this._refreshX = lerp(this._txForInfluence, this._cxForInfluence, refreshWithinShapePercent);
        this._refreshY = lerp(this._tyForInfluence, this._cyForInfluence, refreshWithinShapePercent) + this.context.tactileParameters.numRows.getValue() * raiseOriginPercent;

        // just use one or the other, rather than a mix, to take advantage of the cache
        // const useTriangularGrid = this.context.tactileParameters.triangularGridPercent.getValue() >= 0.5;
        return this.context.refreshTimer.getRefreshGradient(this._refreshY, this._refreshX);
    },
    _mixInfluenceIntoNextState(influence) {
        return influence.mix(this._nextState, this._influenceY, Math.abs(this._influenceX));
    },
    _getColorHexString() {
        const color = this.state.color;
        const hexString = color.toHexString(true);
        return mapColorString(hexString);
    },
    render() {
        const x = this.state.colComputed * CELL_SIZE;
        const y = this.state.rowComputed * CELL_SIZE;

        const tempo = this.context.beatmathParameters.tempo;
        const flipDurationPercent = this.context.tactileParameters.flipDurationPercent.getValue();
        const duration = flipDurationPercent * tempo.getPeriod();
        const size = lerp(CELL_SIZE, this.state.size, this.context.tactileParameters.varySizePercent.getValue());

        const isOdd = this.state.ticks % 2;
        const rotation = isOdd ? 90 : -90;
        const {x: ax, y: ay} = this._getRefreshGradient();
        const style = {
            transform: `translate(${x}px,${y}px) rotate3d(${ax},${ay},0,${rotation}deg) scale(${size / 2})`,
            transition: `all ${duration}ms linear`,
        };

        const shape = this.context.tactileParameters.triangularGridPercent.getValue() >= 0.5 ?
            <circle cx="0" cy="0" r="1" fill={this._getColorHexString()} /> :
            <rect x="-1" y="-1" width="2" height="2" fill={this._getColorHexString()} />;

        return (
            <g style={style}>
                {shape}
            </g>
        );
    },
});

module.exports = TactilePixel;
