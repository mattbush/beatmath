var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');
var MinHeap = require('min-heap');
var tinycolor = require('tinycolor2');
var getPossibleOrientation = require('./brick_possible_orientation');

const {WIDTH_PX, HEIGHT_PX} = require('./beatmath_constants');

const REFRESH_RATE = 50;

const INV_SQRT_3 = 1 / Math.sqrt(3);
const TWO_X_INV_SQRT_3 = 2 / Math.sqrt(3);

const NEIGHBOR_OFFSETS_EVEN = [{x: 2, y: 0}, {x: -1, y: 1}, {x: -1, y: -1}];
const NEIGHBOR_OFFSETS_ODD = [{x: -2, y: 0}, {x: 1, y: 1}, {x: 1, y: -1}];
const NEIGHBOR_OFFSETS_BY_PARITY = [NEIGHBOR_OFFSETS_EVEN, NEIGHBOR_OFFSETS_ODD];

const FILLS = ['#fd0', '#f00', '#0e0'];

var getFillForOrientation = function(orientation) {
    var orientationGroup = Math.floor(orientation / 2);
    return FILLS[orientationGroup];
};

var Triangle = React.createClass({
    getInitialState: function() {
        return {
            color: tinycolor(getFillForOrientation(this.props.orientation)),
        };
    },
    render: function() {
        var x = this.props.x * INV_SQRT_3;
        var y = this.props.y;

        var points;

        if (this.props.orientation % 2 === 0) {
            points = `${x + INV_SQRT_3},${y + 1} ${x - TWO_X_INV_SQRT_3},${y} ${x + INV_SQRT_3},${y - 1}`;
        } else {
            points = `${x - INV_SQRT_3},${y + 1} ${x + TWO_X_INV_SQRT_3},${y} ${x - INV_SQRT_3},${y - 1}`;
        }
        return (
            <polygon fill={this.state.color.toHexString(true)} points={points} />
        );
    },
});

var insertItemIntoHeap = function(heap, item) {
    var dx = item.x * INV_SQRT_3;
    var dy = item.y;
    item.heapWeight = dx * dx + dy * dy;
    heap.insert(item);
};

var extractMinAndAddNeighbors = function(heap, grid, enqueued) {
    var newItem = heap.removeHead();
    var coords = `${newItem.x},${newItem.y}`;

    var possibleOrientation = getPossibleOrientation(grid, newItem);
    if (possibleOrientation !== null) {
        grid[coords] = possibleOrientation;
    }

    var neighborParity = newItem.parity ? 0 : 1;
    for (var neighborOffset of NEIGHBOR_OFFSETS_BY_PARITY[newItem.parity]) {
        var neighbor = {
            x: newItem.x + neighborOffset.x,
            y: newItem.y + neighborOffset.y,
            parity: neighborParity,
        };
        var neighborCoords = `${neighbor.x},${neighbor.y}`;
        if (!_.has(enqueued, neighborCoords)) {
            enqueued[neighborCoords] = true;
            insertItemIntoHeap(heap, neighbor);
        }
    }
};

var BrickGrid = React.createClass({
    componentDidMount: function() {
        setInterval(this._update, REFRESH_RATE);
    },
    _update: function() {
        extractMinAndAddNeighbors(this.props.heap, this.props.grid, this.props.enqueued);
        this.forceUpdate();
    },
    render: function() {
        var grid = this.props.grid;
        var triangles = [];
        for (var coords in grid) {
            var [x, y] = coords.split(',');
            triangles.push(<Triangle key={coords} x={Number(x)} y={Number(y)} orientation={grid[coords]} />);
        }

        return (
            <svg width={WIDTH_PX} height={HEIGHT_PX} className="brickGrid">
                <g transform={`translate(${WIDTH_PX / 2}, ${HEIGHT_PX / 2}) scale(20)`}>
                    {triangles}
                </g>
            </svg>
        );
    },
});

var startItem = {x: 0, y: 0, parity: 0};
var heap = new MinHeap(function(l, r) {
    return l.heapWeight - r.heapWeight;
});
var enqueued = {};
var coords = `${startItem.x},${startItem.y}`;
enqueued[coords] = true;
insertItemIntoHeap(heap, startItem);

var grid = {};
extractMinAndAddNeighbors(heap, grid, enqueued);

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
      <div className="main">
        <BrickGrid grid={grid} heap={heap} enqueued={enqueued} />
      </div>,
      document.getElementById('start')
    );
});
