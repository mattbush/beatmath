var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');
var tinycolor = require('tinycolor2');

const {NUM_COLS, NUM_ROWS, WIDTH_PX, HEIGHT_PX, CELL_SIZE, PIXEL_REFRESH_RATE} = require('./lattice_constants');
const {ColorInfluence, RotationInfluence, SizeInfluence} = require('./influence');
const InfluenceCircle = require('./influence_circle');

const SHOW_INFLUENCES = false;

var gray = tinycolor('#909090');

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
    return ((((0.5 + rowMod10 + colMod10) / DIAMOND_SIZE + (polarAngle * NUM_DIAMOND_SPIRALS / 360)) + NUM_DIAMOND_SPIRALS) % 1) * PIXEL_REFRESH_RATE;
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
    return (((distance / RIPPLE_RADIUS + (polarAngle * NUM_SPIRALS / 360)) + NUM_SPIRALS) % 1) * PIXEL_REFRESH_RATE;
//    return (((Math.log(distance / RIPPLE_RADIUS) + (polarAngle * NUM_SPIRALS / 360)) + NUM_SPIRALS + 10) % 1) * PIXEL_REFRESH_RATE;
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

    return proportion * PIXEL_REFRESH_RATE;
};

const ALL_REFRESH_ALGORITHMS = [RIPPLE_REFRESH_ALGORITHM, SECTOR_REFRESH_ALGORITHM, DIAMOND_REFRESH_ALGORITHM];

const REFRESH_ALGORITHM = ALL_REFRESH_ALGORITHMS[2];

var influences = [
    new ColorInfluence({startCol: 0.2 * NUM_COLS, startRow: 0.2 * NUM_ROWS, startValue: '#f22', index: 0}),
    new ColorInfluence({startCol: 0.8 * NUM_COLS, startRow: 0.2 * NUM_ROWS, startValue: '#2f2', index: 1}),
    new ColorInfluence({startCol: 0.5 * NUM_COLS, startRow: 0.8 * NUM_ROWS, startValue: '#22f', index: 2}),

    new SizeInfluence({startCol: 0.2 * NUM_COLS, startRow: 0.2 * NUM_ROWS, startValue: CELL_SIZE * 0.5}),
    new SizeInfluence({startCol: 0.8 * NUM_COLS, startRow: 0.2 * NUM_ROWS, startValue: CELL_SIZE * 0.5}),
    new SizeInfluence({startCol: 0.5 * NUM_COLS, startRow: 0.8 * NUM_ROWS, startValue: CELL_SIZE * 0.5}),

    new RotationInfluence({startCol: 0.2 * NUM_COLS, startRow: 0.2 * NUM_ROWS, startValue: 0}),
    new RotationInfluence({startCol: 0.8 * NUM_COLS, startRow: 0.2 * NUM_ROWS, startValue: 0}),
    new RotationInfluence({startCol: 0.5 * NUM_COLS, startRow: 0.8 * NUM_ROWS, startValue: 0}),
];

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
        setTimeout(this._update, PIXEL_REFRESH_RATE);
        // whether to oscillate (for diamonds/sectors)
        // setTimeout(this._update, PIXEL_REFRESH_RATE * 2 - this._refreshOffset * 2);
        this._refreshOffset = PIXEL_REFRESH_RATE - this._refreshOffset;
        var state = _.clone(this.state);
        _.each(this.props.influences, influence => influence.mix(state, this.props.row, this.props.col));
        this.setState(state);
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

var ColorGrid = React.createClass({
    render: function() {
        const children = [];
        for (let row = 0; row < this.props.numRows; row++) {
            for (let col = 0; col < this.props.numCols; col++) {
                children.push(<ColorPixel influences={this.props.influences} row={row} col={col} key={row + '|' + col} />);
            }
        }

        return (
            <svg width={WIDTH_PX} height={HEIGHT_PX} className="colorGrid">
                <g>
                    {children}
                </g>
                {SHOW_INFLUENCES && <g>
                    {_.map(this.props.influences, (influence, index) =>
                        <InfluenceCircle influence={influence} key={index} />
                    )}
                </g>}
            </svg>
        );
    },
});

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
      <div className="main">
        <ColorGrid numRows={NUM_ROWS} numCols={NUM_COLS} influences={influences} />
      </div>,
      document.getElementById('start')
    );
});
