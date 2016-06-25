const _ = require('underscore');
const MapperShape = require('js/mapper/parameters/MapperShape');
const {LinearParameter} = require('js/core/parameters/Parameter');
const {LaunchpadButtons} = require('js/core/inputs/LaunchpadConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');

const MOVE_SHAPE_POLLING_RATE = 50;

class MapperParameters extends PieceParameters {
    constructor(mixboard) {
        super(...arguments);

        this._verticesPressed = {};
        this._directionsPressed = {};
        this._shapes = [];
        this._onNumShapesChange();

        this.numShapes.addListener(this._onNumShapesChange.bind(this));

        mixboard.addLaunchpadButtonListener(LaunchpadButtons.TRACK_FOCUS[4], this._onDirectionButtonPressed.bind(this, 'up'));
        mixboard.addLaunchpadButtonListener(LaunchpadButtons.TRACK_CONTROL[3], this._onDirectionButtonPressed.bind(this, 'left'));
        mixboard.addLaunchpadButtonListener(LaunchpadButtons.TRACK_CONTROL[4], this._onDirectionButtonPressed.bind(this, 'down'));
        mixboard.addLaunchpadButtonListener(LaunchpadButtons.TRACK_CONTROL[5], this._onDirectionButtonPressed.bind(this, 'right'));

        mixboard.setLaunchpadLightValue(LaunchpadButtons.TRACK_FOCUS[4], 0x12);
        mixboard.setLaunchpadLightValue(LaunchpadButtons.TRACK_CONTROL[3], 0x12);
        mixboard.setLaunchpadLightValue(LaunchpadButtons.TRACK_CONTROL[4], 0x12);
        mixboard.setLaunchpadLightValue(LaunchpadButtons.TRACK_CONTROL[5], 0x12);

        const lightValues = [0x03, 0x22, 0x30];
        _.times(3, column => {
            mixboard.addLaunchpadButtonListener(LaunchpadButtons.TRACK_CONTROL[column], this._onVertexButtonPressed.bind(this, column));
            mixboard.setLaunchpadLightValue(LaunchpadButtons.TRACK_CONTROL[column], lightValues[column]);
        });

        setInterval(this._moveCurrentShape.bind(this), MOVE_SHAPE_POLLING_RATE);
    }
    _declareParameters() {
        return {
            numShapes: {
                type: LinearParameter,
                range: [1, 16],
                start: 1,
                listenToDecrementAndIncrementLaunchpadButtons: 6,
                monitorName: 'Num Shapes',
            },
            currentShape: {
                type: LinearParameter,
                range: [1, 16],
                start: 1,
                listenToDecrementAndIncrementLaunchpadButtons: 7,
                monitorName: 'Current Shape',
            },
        };
    }
    _onDirectionButtonPressed(direction, value) {
        if (value) {
            this._directionsPressed = true;
        } else {
            delete this._directionsPressed[direction];
        }
    }
    _onVertexButtonPressed(index, value) {
        if (value) {
            this._verticesPressed = true;
        } else {
            delete this._verticesPressed[index];
        }
    }
    _moveCurrentShape() {
        const currentShape = this.getCurrentShape();
        if (!currentShape) {
            return;
        }
        _.each(this._verticesPressed, (ignore, vertex) => {
            _.each(this._directionsPressed, (ignore2, direction) => {
                switch (direction) {
                    case 'up':
                        currentShape.moveVertex(vertex, 0, -1);
                        break;
                    case 'down':
                        currentShape.moveVertex(vertex, 0, 1);
                        break;
                    case 'left':
                        currentShape.moveVertex(vertex, -1, 0);
                        break;
                    case 'right':
                        currentShape.moveVertex(vertex, 1, 0);
                        break;
                    default:
                }
            });
        });
        this._onMappingChanged();
    }
    getCurrentShape() {
        const currentShape = this.currentShape.getValue();
        const numShapes = this.numShapes.getValue();
        if (currentShape < numShapes) {
            return this._shapes[currentShape];
        } else {
            return null;
        }
    }
    mapShapes(fn) {
        return this._shapes.map(fn);
    }
    _onNumShapesChange() {
        const numShapes = this.numShapes.getValue();

        for (let i = this._shapes.length; i < numShapes; i++) {
            const shape = new MapperShape(i);
            this._shapes.push(shape);
        }
        for (let i = this._shapes.length; i > numShapes; i--) {
            this._shapes.pop();
        }

        this._onMappingChanged();
    }
    _onMappingChanged() {
        // TODO
    }
}

module.exports = MapperParameters;
