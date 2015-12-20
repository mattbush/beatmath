var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');
var MinHeap = require('min-heap');

const {WIDTH_PX, HEIGHT_PX} = require('./beatmath_constants.js');

const REFRESH_RATE = 500;

const INV_SQRT_3 = 1 / Math.sqrt(3);
const TWO_X_INV_SQRT_3 = 2 / Math.sqrt(3);

const NEIGHBOR_OFFSETS_EVEN = [{x: 2, y: 0}, {x: -1, y: 1}, {x: -1, y: -1}];
const NEIGHBOR_OFFSETS_ODD = [{x: -2, y: 0}, {x: 1, y: 1}, {x: 1, y: -1}];
const NEIGHBOR_OFFSETS_BY_ORIENTATION = [NEIGHBOR_OFFSETS_EVEN, NEIGHBOR_OFFSETS_ODD, NEIGHBOR_OFFSETS_EVEN, NEIGHBOR_OFFSETS_ODD, NEIGHBOR_OFFSETS_EVEN, NEIGHBOR_OFFSETS_ODD];

var Triangle = React.createClass({
    render: function() {
        var x = this.props.x * INV_SQRT_3;
        var y = this.props.y;

        var points, fill;

        if (this.props.orientation % 2 === 0) {
            points = `${x + INV_SQRT_3},${y + 1} ${x - TWO_X_INV_SQRT_3},${y} ${x + INV_SQRT_3},${y - 1}`;
            fill = '#ff0000';
        } else {
            points = `${x - INV_SQRT_3},${y + 1} ${x + TWO_X_INV_SQRT_3},${y} ${x - INV_SQRT_3},${y - 1}`;
            fill = '#00ff00';
        }
        return (
            <polygon fill={fill} points={points} />
        );
    },
});

var extractMinAndAddNeighbors = function(heap, grid, enqueued) {
    var newItem = heap.removeHead();
    var coords = `${newItem.x},${newItem.y}`;

    grid[coords] = newItem.orientation;

    var neighborOrientation = newItem.orientation ? 0 : 1;
    for (var neighborOffset of NEIGHBOR_OFFSETS_BY_ORIENTATION[newItem.orientation]) {
        var neighbor = {
            x: newItem.x + neighborOffset.x,
            y: newItem.y + neighborOffset.y,
            orientation: neighborOrientation,
        };
        var neighborCoords = `${neighbor.x},${neighbor.y}`;
        if (!_.has(enqueued, neighborCoords)) {
            enqueued[neighborCoords] = true;
            neighbor.heapWeight = neighbor.x * neighbor.x + neighbor.y * neighbor.y;
            heap.insert(neighbor);
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
                <g transform={`translate(${WIDTH_PX / 2}, ${HEIGHT_PX / 2}) scale(25)`}>
                    {triangles}
                </g>
            </svg>
        );
    },
});

var startItem = {x: 0, y: 0, orientation: 0};
var heap = new MinHeap(function(l, r) {
    return l.heapWeight - r.heapWeight;
});
var enqueued = {};
var coords = `${startItem.x},${startItem.y}`;
enqueued[coords] = true;
startItem.heapWeight = startItem.x * startItem.x + startItem.y * startItem.y;
heap.insert(startItem);

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
