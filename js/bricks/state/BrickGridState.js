const _ = require('lodash');
const MinHeap = require('min-heap');
const getPossibleOrientation = require('js/bricks/state/getPossibleOrientation');
const BrickPosition = require('js/bricks/state/BrickPosition');

const {BRICK_SCALE} = require('js/bricks/parameters/BricksConstants');

const HEAP_FLUSH_RATE = 10000;
const NUM_ITEMS_TO_SAVE_IN_FLUSH = 32;

const EXTRACTION_DISTANCE_TOLERANCE = 4;

const NEIGHBOR_OFFSETS_EVEN = [{x: 2, y: 0}, {x: -1, y: 1}, {x: -1, y: -1}];
const NEIGHBOR_OFFSETS_ODD = [{x: -2, y: 0}, {x: 1, y: 1}, {x: 1, y: -1}];
const NEIGHBOR_OFFSETS_BY_PARITY = [NEIGHBOR_OFFSETS_EVEN, NEIGHBOR_OFFSETS_ODD];

const MAX_TRIANGLES_TO_EXTRACT = 24;
const RENDER_DISTANCE_CUTOFF = 240 / BRICK_SCALE;

class BrickGridState {
    constructor(bricksParameters) {
        this._bricksParameters = bricksParameters;
        this._brickPosition = new BrickPosition(bricksParameters);

        const startItem = {x: 0, y: 0, parity: 0};
        this._heap = new MinHeap(function(l, r) {
            return l.heapWeight - r.heapWeight;
        });
        this._enqueued = {};
        const startItemCoords = `${startItem.x},${startItem.y}`;
        this._enqueued[startItemCoords] = startItem;
        this._insertItemIntoHeap(startItem);

        this._grid = {};
        this._extractMinAndAddNeighbors();

        setInterval(this._flushHeap.bind(this), HEAP_FLUSH_RATE);
    }
    update() {
        for (let i = 0; i < MAX_TRIANGLES_TO_EXTRACT; i++) {
            this._extractMinAndAddNeighbors();
        }

        const coordsToDelete = [];

        for (let coords in this._grid) { // eslint-disable-line guard-for-in
            const [x, y] = coords.split(',').map(Number);
            if (this._brickPosition.getDistance({x, y}) >= RENDER_DISTANCE_CUTOFF) {
                coordsToDelete.push(coords);
            }
        }

        for (let coords of coordsToDelete) {
            delete this._grid[coords];
            delete this._enqueued[coords];
        }
    }
    getGrid() {
        return this._grid;
    }
    getBrickPosition() {
        return this._brickPosition;
    }
    _insertItemIntoHeap(item) {
        item.heapWeight = this._brickPosition.getDistance(item);
        this._heap.insert(item);
    }
    _extractMinWithinRange() {
        while (this._heap.size > 0) {
            const newItem = this._heap.removeHead();

            if (this._brickPosition.getDistance(newItem) <= newItem.heapWeight + EXTRACTION_DISTANCE_TOLERANCE) {
                return newItem;
            } else {
                const coords = `${newItem.x},${newItem.y}`;
                delete this._enqueued[coords];
            }
        }
        return null;
    }
    _extractMinAndAddNeighbors() {
        const newItem = this._extractMinWithinRange();

        if (!newItem) {
            return;
        }
        const coords = `${newItem.x},${newItem.y}`;

        const possibleOrientation = getPossibleOrientation(this._bricksParameters, this._grid, newItem);
        if (possibleOrientation !== null) {
            this._grid[coords] = possibleOrientation;
        }

        const neighborParity = newItem.parity ? 0 : 1;
        for (let neighborOffset of NEIGHBOR_OFFSETS_BY_PARITY[newItem.parity]) {
            const neighbor = {
                x: newItem.x + neighborOffset.x,
                y: newItem.y + neighborOffset.y,
                parity: neighborParity,
            };
            const neighborCoords = `${neighbor.x},${neighbor.y}`;
            if (!_.has(this._enqueued, neighborCoords)) {
                this._enqueued[neighborCoords] = neighbor;
                this._insertItemIntoHeap(neighbor);
            } else {
                const existingEntry = this._enqueued[neighborCoords];
                const newNeighborDistance = this._brickPosition.getDistance(existingEntry);
                if (newNeighborDistance < existingEntry.heapWeight - EXTRACTION_DISTANCE_TOLERANCE) {
                    this._heap.remove(existingEntry);
                    existingEntry.heapWeight = newNeighborDistance;
                    this._heap.insert(existingEntry);
                }
            }
        }
    }
    _flushHeap() {
        if (this._heap.size <= NUM_ITEMS_TO_SAVE_IN_FLUSH) {
            return;
        }
        const tempArray = [];
        while (this._heap.size > 0) {
            const head = this._heap.removeHead();
            if (tempArray.length < NUM_ITEMS_TO_SAVE_IN_FLUSH) {
                tempArray.push(head);
            }
        }
        for (let item of tempArray) {
            this._heap.insert(item);
        }
    }
}

module.exports = BrickGridState;
