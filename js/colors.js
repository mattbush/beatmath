var React = require('react');
var ReactDOM = require('react-dom');
var tinycolor = require('tinycolor2');

var fullTimeout = 1600;
const MIX_COEFFICIENT = 1.4;

const {NUM_COLS, NUM_ROWS, WIDTH_PX, HEIGHT_PX, CELL_SIZE} = require('./colors_constants');

const SHOW_INFLUENCES = false;

var gray = tinycolor('#909090');
// var white = tinycolor('#ffffff');

const DIAMOND_SIZE = 10;
const NUM_DIAMOND_SPIRALS = 0;
var DIAMOND_REFRESH_ALGORITHM = function(row, col) {
    var dx = col - (NUM_COLS / 2);
    var dy = row - (NUM_ROWS / 2);
    var polarAngle = Math.atan2(dx, dy) * 180 / Math.PI;
    var rowMod10 = row % DIAMOND_SIZE;
    var colMod10 = col % DIAMOND_SIZE;
    var half = DIAMOND_SIZE / 2;
    rowMod10 = (rowMod10 > half) ? (DIAMOND_SIZE - rowMod10) : rowMod10;
    colMod10 = (colMod10 > half) ? (DIAMOND_SIZE - colMod10) : colMod10;
    return ((((0.5 + rowMod10 + colMod10) / DIAMOND_SIZE + (polarAngle * NUM_DIAMOND_SPIRALS / 360)) + NUM_DIAMOND_SPIRALS) % 1) * fullTimeout;
};

// 10, 0|1, 0|1 is standard
// 3.5-4, 1, 2 is a nice combo
const RIPPLE_RADIUS = 12;
const NUM_SPIRALS = 1;
const MANHATTAN_COEFFICIENT = 0;
var RIPPLE_REFRESH_ALGORITHM = function(row, col) {
    var dx = col - (NUM_COLS / 2);
    var dy = row - (NUM_ROWS / 2);
    var polarAngle = Math.atan2(dx, dy) * 180 / Math.PI;
    var manhattanDistance = Math.abs(dx) + Math.abs(dy);
    var euclideanDistance = Math.sqrt(dx * dx + dy * dy);
    var distance = (MANHATTAN_COEFFICIENT * manhattanDistance + (1 - MANHATTAN_COEFFICIENT) * euclideanDistance);
    return (((distance / RIPPLE_RADIUS + (polarAngle * NUM_SPIRALS / 360)) + NUM_SPIRALS) % 1) * fullTimeout;
};

const NUM_SECTORS = 6;
const SECTOR_SIZE = 360 / NUM_SECTORS;
var SECTOR_REFRESH_ALGORITHM = function(row, col) {
    var dx = col - (NUM_COLS / 2);
    var dy = row - (NUM_ROWS / 2);
    var polarAngle = Math.atan2(dx, dy) * 180 / Math.PI;
    polarAngle += 360;
    var polarAngleMod = polarAngle % SECTOR_SIZE;
    if (polarAngleMod > SECTOR_SIZE / 2) {
        polarAngleMod = SECTOR_SIZE - polarAngleMod;
    }
    var proportion = polarAngleMod / (SECTOR_SIZE / 2);

    return proportion * fullTimeout;
};

const ALL_REFRESH_ALGORITHMS = [RIPPLE_REFRESH_ALGORITHM, SECTOR_REFRESH_ALGORITHM, DIAMOND_REFRESH_ALGORITHM];

const REFRESH_ALGORITHM = ALL_REFRESH_ALGORITHMS[1];

var theColorMixer = {
    circles: [
        {col: 0.2 * NUM_COLS, row: 0.2 * NUM_ROWS, dx: 0, dy: 0, dz: 0, dw: 0, color: tinycolor('#f22'), size: CELL_SIZE * 0.5},
        {col: 0.8 * NUM_COLS, row: 0.2 * NUM_ROWS, dx: 0, dy: 0, dz: 0, dw: 0, color: tinycolor('#2f2'), size: CELL_SIZE * 0.5},
        {col: 0.5 * NUM_COLS, row: 0.8 * NUM_ROWS, dx: 0, dy: 0, dz: 0, dw: 0, color: tinycolor('#22f'), size: CELL_SIZE * 0.5},
    ],
    mixColors: function(oldColor, row, col) {
        let color = oldColor;
        for (let circle of this.circles) {
            let dx = circle.col - col;
            let dy = circle.row - row;
            let distance = Math.sqrt(dx * dx + dy * dy);
//            let mixAmount = 500 / (distance * 5 + 5);
            let mixAmount = (120 - (distance * 8)) * MIX_COEFFICIENT;
            if (mixAmount > 0) {
                color = tinycolor.mix(color, circle.color, mixAmount);
            }
        }
        return color;
    },
};

var theSizeMixer = {
    circles: [
        {col: 0.2 * NUM_COLS, row: 0.2 * NUM_ROWS, dx: 0, dy: 0, dz: 0, dw: 0, size: CELL_SIZE * 0.5, color: tinycolor('#BBB')},
        {col: 0.8 * NUM_COLS, row: 0.2 * NUM_ROWS, dx: 0, dy: 0, dz: 0, dw: 0, size: CELL_SIZE * 0.5, color: tinycolor('#BBB')},
        {col: 0.5 * NUM_COLS, row: 0.8 * NUM_ROWS, dx: 0, dy: 0, dz: 0, dw: 0, size: CELL_SIZE * 0.5, color: tinycolor('#BBB')},
    ],
    mixSizes: function(oldSize, row, col) {
        let size = oldSize;
        for (let circle of this.circles) {
            let dx = circle.col - col;
            let dy = circle.row - row;
            let distance = Math.sqrt(dx * dx + dy * dy);
//            let mixAmount = 500 / (distance * 5 + 5);
            let mixAmount = (120 - (distance * 8)) * MIX_COEFFICIENT;
            if (mixAmount > 0) {
                mixAmount /= 100;
                size = mixAmount * circle.size + (1 - mixAmount) * size;
            }
        }
        return size;
    },
    listeners: [],
};

var theRotationMixer = {
    circles: [
        {col: 0.2 * NUM_COLS, row: 0.2 * NUM_ROWS, dx: 0, dy: 0, dz: 0, dw: 0, rotation: 0, size: CELL_SIZE * 0.5, color: tinycolor('#999')},
        {col: 0.8 * NUM_COLS, row: 0.2 * NUM_ROWS, dx: 0, dy: 0, dz: 0, dw: 0, rotation: 0, size: CELL_SIZE * 0.5, color: tinycolor('#999')},
        {col: 0.5 * NUM_COLS, row: 0.8 * NUM_ROWS, dx: 0, dy: 0, dz: 0, dw: 0, rotation: 0, size: CELL_SIZE * 0.5, color: tinycolor('#999')},
    ],
    mixRotations: function(oldSize, row, col) {
        let size = oldSize;
        for (let circle of this.circles) {
            let dx = circle.col - col;
            let dy = circle.row - row;
            let distance = Math.sqrt(dx * dx + dy * dy);
//            let mixAmount = 500 / (distance * 5 + 5);
            let mixAmount = (120 - (distance * 8)) * MIX_COEFFICIENT;
            if (mixAmount > 0) {
                mixAmount /= 100;
                size = mixAmount * circle.rotation + (1 - mixAmount) * size;
            }
        }
        return size;
    },
};

var ColorPixel = React.createClass({
    componentDidMount: function() {
        this._refreshOffset = REFRESH_ALGORITHM(this.props.row, this.props.col);
        setTimeout(this._update, this._refreshOffset);
    },
    getInitialState: function() {
        return {
            color: gray,
            size: 8,
            rotation: 0,
        };
    },
    _update: function() {
        // setTimeout(this._update, fullTimeout);
        // whether to oscillate (for diamonds/sectors)
        setTimeout(this._update, fullTimeout * 2 - this._refreshOffset * 2);
        this._refreshOffset = fullTimeout - this._refreshOffset;
        this.setState({
            color: this.props.colorMixer.mixColors(this.state.color, this.props.row, this.props.col),
            size: this.props.sizeMixer.mixSizes(this.state.size, this.props.row, this.props.col),
            rotation: this.props.rotationMixer.mixRotations(this.state.rotation, this.props.row, this.props.col),
        });
    },
    render: function() {
        var rotation = Math.floor(this.state.rotation);
        var x = this.props.col * CELL_SIZE + CELL_SIZE / 2;
        var y = this.props.row * CELL_SIZE + CELL_SIZE / 2;
        var transform = `translate(${x} ${y}) rotate(${rotation})`;
        var fill = this.state.color.toHexString(true);
        var pixelOffset = -this.state.size / 2;
        return (
            <rect x={pixelOffset} y={pixelOffset} width={this.state.size} height={this.state.size} fill={fill} transform={transform} />
        );
    },
});

var InfluenceCircle = React.createClass({
    componentDidMount: function() {
        this.props.mixer.listeners.push(this.forceUpdate.bind(this));
    },
    render: function() {
        var circle = this.props.mixer.circles[this.props.index];
        var x = circle.col * CELL_SIZE + CELL_SIZE / 2;
        var y = circle.row * CELL_SIZE + CELL_SIZE / 2;
        var size = circle.size * 5;
        var style = {
            transition: `transform ${MIXER_REFRESH_RATE / 1000}s linear`,
            fill: circle.color.toHexString(true),
        };
        if (circle.rotation !== undefined) {
            var rotation = Math.floor(circle.rotation);
            let transform = `translate(${x} ${y}) rotate(${rotation})`;
            var pixelOffset = -size / 2;
            return (
                <g style={style} transform={transform}>
                    <rect x={pixelOffset} y={pixelOffset} width={size} height={size} />
                </g>

            );
        } else {
            let transform = `translate(${x} ${y})`;
            return (
                <g style={style} transform={transform}>
                    <circle cx={0} cy={0} r={size / 2} />
                </g>
            );
        }
    },
});

var ColorGrid = React.createClass({
    render: function() {
        const children = [];
        for (let row = 0; row < this.props.numRows; row++) {
            for (let col = 0; col < this.props.numCols; col++) {
                children.push(<ColorPixel rotationMixer={this.props.rotationMixer} colorMixer={this.props.colorMixer} sizeMixer={this.props.sizeMixer} row={row} col={col} key={row + '|' + col} />);
            }
        }

        return (
            <svg width={WIDTH_PX} height={HEIGHT_PX} className="colorGrid">
                <g>
                    {children}
                </g>
                {SHOW_INFLUENCES && <g>
                    <InfluenceCircle mixer={theColorMixer} index={0} />
                    <InfluenceCircle mixer={theColorMixer} index={1} />
                    <InfluenceCircle mixer={theColorMixer} index={2} />
                    <InfluenceCircle mixer={theSizeMixer} index={0} />
                    <InfluenceCircle mixer={theSizeMixer} index={1} />
                    <InfluenceCircle mixer={theSizeMixer} index={2} />
                    <InfluenceCircle mixer={theRotationMixer} index={0} />
                    <InfluenceCircle mixer={theRotationMixer} index={1} />
                    <InfluenceCircle mixer={theRotationMixer} index={2} />
                </g>}
            </svg>
        );
    },
});

document.addEventListener('DOMContentLoaded', function(e) {
    ReactDOM.render(
      <div className="main">
        <ColorGrid numRows={NUM_ROWS} numCols={NUM_COLS} colorMixer={theColorMixer} sizeMixer={theSizeMixer} rotationMixer={theRotationMixer} />
      </div>,
      document.getElementById('start')
    );

    theColorMixer._update();
    theSizeMixer._update();
    theRotationMixer._update();
});
