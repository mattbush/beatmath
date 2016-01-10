var _ = require('underscore');
var React = require('react');
var MinHeap = require('min-heap');
var getPossibleOrientation = require('js/brick_possible_orientation');
var updateHue = require('js/update_hue');

const {WIDTH_PX, DESIRED_HEIGHT_PX} = require('js/beatmath_constants');

var SAT_COEFF = 1.5;
var BRI_COEFF = 0.6;

const {POSITION_REFRESH_RATE, ENABLE_HUE_ALTERNATING} = require('js/brick_constants');

const BPM_CONST = 123;

const TRIANGLE_GENERATING_RATE = 60 * 1000 / BPM_CONST;
const BRICK_COLOR_REFRESH_RATE = 500;

const BRICK_SCALE = 16;
const MAX_TRIANGLES_TO_EXTRACT = 24;
const RENDER_DISTANCE_CUTOFF = 240 / BRICK_SCALE;

const EXTRACTION_DISTANCE_TOLERANCE = 4;
const POSITION_OFFSET_REFRESH_RATE = Math.max(TRIANGLE_GENERATING_RATE, POSITION_REFRESH_RATE);

const NEIGHBOR_OFFSETS_EVEN = [{x: 2, y: 0}, {x: -1, y: 1}, {x: -1, y: -1}];
const NEIGHBOR_OFFSETS_ODD = [{x: -2, y: 0}, {x: 1, y: 1}, {x: 1, y: -1}];
const NEIGHBOR_OFFSETS_BY_PARITY = [NEIGHBOR_OFFSETS_EVEN, NEIGHBOR_OFFSETS_ODD];

const HEAP_FLUSH_RATE = 10000;
const NUM_ITEMS_TO_SAVE_IN_FLUSH = 32;

const INV_SQRT_3 = 1 / Math.sqrt(3);
const TWO_X_INV_SQRT_3 = 2 / Math.sqrt(3);

const {BrickColor, BrickPosition} = require('js/brick_properties');

var brickColors = [
    new BrickColor({startValue: '#fd8', index: 0}),
    new BrickColor({startValue: '#180', index: 0}),
    new BrickColor({startValue: '#f10', index: 0}),
];

var getFillForOrientation = function(orientation) {
    var orientationGroup = Math.floor(orientation / 2);
    return brickColors[orientationGroup].getValue();
};
var updateFillForOrientation = function(previousFill, orientation) {
    var orientationGroup = Math.floor(orientation / 2);
    return brickColors[orientationGroup].mix(previousFill);
};

var tick = 0;
var updateColors = function() {
    _.times(3, i => {
        var lightIndex = i + tick % 3;
        updateHue(lightIndex, getFillForOrientation(i * 2), {satCoeff: SAT_COEFF, briCoeff: BRI_COEFF});
    });
    tick++;
};

if (ENABLE_HUE_ALTERNATING) {
    setInterval(updateColors, TRIANGLE_GENERATING_RATE);
}

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

var brickPosition = new BrickPosition();

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

var startItem = {x: 0, y: 0, parity: 0};
var heapState = new MinHeap(function(l, r) {
    return l.heapWeight - r.heapWeight;
});
var enqueuedState = {};
var startItemCoords = `${startItem.x},${startItem.y}`;
enqueuedState[startItemCoords] = startItem;
insertItemIntoHeap(heapState, startItem);

var gridState = {};
extractMinAndAddNeighbors(heapState, gridState, enqueuedState);

var flushHeap = function() {
    if (heapState.size <= NUM_ITEMS_TO_SAVE_IN_FLUSH) {
        return;
    }
    var tempArray = [];
    while (heapState.size > 0) {
        var head = heapState.removeHead();
        if (tempArray.length < NUM_ITEMS_TO_SAVE_IN_FLUSH) {
            tempArray.push(head);
        }
    }
    for (var item of tempArray) {
        heapState.insert(item);
    }
};

setInterval(flushHeap, HEAP_FLUSH_RATE);

var BrickGrid = React.createClass({
    getInitialState: function() {
        return {
            grid: gridState,
            heap: heapState,
            enqueued: enqueuedState,
        };
    },
    componentDidMount: function() {
        setInterval(this._update, TRIANGLE_GENERATING_RATE);
    },
    componentDidUpdate: function() {
        console.log(this.state.heap.size);
        for (let coords of this._coordsToDelete) {
            delete this.state.grid[coords];
            delete this.state.enqueued[coords];
        }
    },
    _update: function() {
        for (var i = 0; i < MAX_TRIANGLES_TO_EXTRACT; i++) {
            extractMinAndAddNeighbors(this.state.heap, this.state.grid, this.state.enqueued);
        }
        this.forceUpdate();
    },
    render: function() {
        var grid = this.state.grid;
        var triangles = [];
        this._coordsToDelete = [];
        for (let coords in grid) {
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
            <svg width={WIDTH_PX} height={DESIRED_HEIGHT_PX} className="brickGrid">
                <g transform={`translate(${WIDTH_PX / 2}, ${DESIRED_HEIGHT_PX / 2})`}>
                    <g style={style}>
                        {triangles}
                    </g>
                </g>
            </svg>
        );
    },
});

module.exports = BrickGrid;
