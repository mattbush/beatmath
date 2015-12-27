var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');
var MinHeap = require('min-heap');
var getPossibleOrientation = require('./brick_possible_orientation');

const {WIDTH_PX, HEIGHT_PX} = require('./beatmath_constants');

const {POSITION_REFRESH_RATE} = require('./brick_constants');

const {BrickColor, BrickPosition} = require('./brick_properties');

const TRIANGLE_GENERATING_RATE = 250;
const BRICK_COLOR_REFRESH_RATE = 500;
const MAX_TRIANGLES_TO_EXTRACT = 12;

const BRICK_SCALE = 20;
const RENDER_DISTANCE_CUTOFF = 500 / BRICK_SCALE;

const EXTRACTION_DISTANCE_TOLERANCE = 4;
const POSITION_OFFSET_REFRESH_RATE = Math.max(TRIANGLE_GENERATING_RATE, POSITION_REFRESH_RATE);

const INV_SQRT_3 = 1 / Math.sqrt(3);
const TWO_X_INV_SQRT_3 = 2 / Math.sqrt(3);

const NEIGHBOR_OFFSETS_EVEN = [{x: 2, y: 0}, {x: -1, y: 1}, {x: -1, y: -1}];
const NEIGHBOR_OFFSETS_ODD = [{x: -2, y: 0}, {x: 1, y: 1}, {x: 1, y: -1}];
const NEIGHBOR_OFFSETS_BY_PARITY = [NEIGHBOR_OFFSETS_EVEN, NEIGHBOR_OFFSETS_ODD];

const HEAP_FLUSH_RATE = 10000;
const NUM_ITEMS_TO_SAVE_IN_FLUSH = 32;

var brickColors = [
    new BrickColor({startValue: '#fd8', index: 0}),
    new BrickColor({startValue: '#180', index: 0}),
    new BrickColor({startValue: '#f10', index: 0}),
];

var brickPosition = new BrickPosition();

var getFillForOrientation = function(orientation) {
    var orientationGroup = Math.floor(orientation / 2);
    return brickColors[orientationGroup].getValue();
};
var updateFillForOrientation = function(previousFill, orientation) {
    var orientationGroup = Math.floor(orientation / 2);
    return brickColors[orientationGroup].mix(previousFill);
};

var Triangle = React.createClass({
    getInitialState: function() {
        return {
            color: getFillForOrientation(this.props.orientation),
        };
    },
    componentDidMount: function() {
        this._intervalId = setInterval(this._updateColor, BRICK_COLOR_REFRESH_RATE);
    },
    componentWillUnmount: function() {
        clearInterval(this._intervalId);
    },
    _updateColor: function() {
        this.setState({
            color: updateFillForOrientation(this.state.color, this.props.orientation),
        });
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
            <polygon className="triangle" fill={this.state.color.toHexString(true)} points={points} />
        );
    },
});

var insertItemIntoHeap = function(heap, item) {
    item.heapWeight = brickPosition.getDistance(item);
    heap.insert(item);
};

var extractMinWithinRange = function(heap, enqueued) {
    while (heap.size > 0) {
        var newItem = heap.removeHead();

        if (brickPosition.getDistance(newItem) <= newItem.heapWeight + EXTRACTION_DISTANCE_TOLERANCE) {
            return newItem;
        } else {
            var coords = `${newItem.x},${newItem.y}`;
            delete enqueued[coords];
        }
    }
};

var extractMinAndAddNeighbors = function(heap, grid, enqueued) {
    var newItem = extractMinWithinRange(heap, enqueued);

    if (!newItem) {
        return;
    }
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
            enqueued[neighborCoords] = neighbor;
            insertItemIntoHeap(heap, neighbor);
        } else {
            var existingEntry = enqueued[neighborCoords];
            var newNeighborDistance = brickPosition.getDistance(existingEntry);
            if (newNeighborDistance < existingEntry.heapWeight - EXTRACTION_DISTANCE_TOLERANCE) {
                heap.remove(existingEntry);
                existingEntry.heapWeight = newNeighborDistance;
                heap.insert(existingEntry);
            }
        }
    }
};

var BrickGrid = React.createClass({
    componentDidMount: function() {
        setInterval(this._update, TRIANGLE_GENERATING_RATE);
    },
    componentDidUpdate: function() {
        console.log(this.props.heap.size);
        for (var coords of this._coordsToDelete) {
            delete this.props.grid[coords];
            delete this.props.enqueued[coords];
        }
    },
    _update: function() {
        for (var i = 0; i < MAX_TRIANGLES_TO_EXTRACT; i++) {
            extractMinAndAddNeighbors(this.props.heap, this.props.grid, this.props.enqueued);
        }
        this.forceUpdate();
    },
    render: function() {
        var grid = this.props.grid;
        var triangles = [];
        this._coordsToDelete = [];
        for (var coords in grid) {
            var [x, y] = coords.split(',').map(Number);
            if (brickPosition.getDistance({x, y}) < RENDER_DISTANCE_CUTOFF) {
                triangles.push(<Triangle key={coords} x={x} y={y} orientation={grid[coords]} />);
            } else {
                this._coordsToDelete.push(coords);
            }
        }

        var style = {
            transform: `scale(${BRICK_SCALE}) translate(${-brickPosition.getX()}px, ${-brickPosition.getY()}px)`,
            transition: `transform ${POSITION_OFFSET_REFRESH_RATE / 1000}s linear`,
        };

        return (
            <svg width={WIDTH_PX} height={HEIGHT_PX} className="brickGrid">
                <g transform={`translate(${WIDTH_PX / 2}, ${HEIGHT_PX / 2})`}>
                    <g style={style}>
                        {triangles}
                    </g>
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
enqueued[coords] = startItem;
insertItemIntoHeap(heap, startItem);

var grid = {};
extractMinAndAddNeighbors(heap, grid, enqueued);

var flushHeap = function() {
    if (heap.size <= NUM_ITEMS_TO_SAVE_IN_FLUSH) {
        return;
    }
    var tempArray = [];
    while (heap.size > 0) {
        var head = heap.removeHead();
        if (tempArray.length < NUM_ITEMS_TO_SAVE_IN_FLUSH) {
            tempArray.push(head);
        }
    }
    for (var item of tempArray) {
        heap.insert(item);
    }
};

setInterval(flushHeap, HEAP_FLUSH_RATE);

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
      <div className="main">
        <BrickGrid grid={grid} heap={heap} enqueued={enqueued} />
      </div>,
      document.getElementById('start')
    );
});
