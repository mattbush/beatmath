const _ = require('underscore');
const MapperShape = require('js/mapper/parameters/MapperShape');
const {Parameter, LinearParameter} = require('js/core/parameters/Parameter');
const {LaunchpadButtons} = require('js/core/inputs/LaunchpadConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');

const MOVE_SHAPE_POLLING_RATE = 33;

class MapperParameters extends PieceParameters {
    constructor(mixboard, beatmathParameters) {
        const existingMapping = JSON.parse(window.localStorage.getItem('mapping'));
        let numShapes = existingMapping ? existingMapping.length : 1;

        super(mixboard, beatmathParameters, {numShapes});

        this._verticesPressed = {};
        this._directionsPressed = {};
        this._shapes = [];
        if (existingMapping) {
            for (let i = 0; i < numShapes; i++) {
                const shape = new MapperShape({existingData: existingMapping[i]});
                this._shapes.push(shape);
            }
        } else {
            const shape = new MapperShape({index: 0});
            this._shapes.push(shape);
        }

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
    _declareParameters({numShapes}) {
        return {
            mapping: {
                type: Parameter,
                start: null,
            },
            numShapes: {
                type: LinearParameter,
                range: [1, 16],
                start: numShapes,
                listenToDecrementAndIncrementLaunchpadButtons: 6,
                monitorName: 'Num Shapes',
            },
            currentShapeIndex: {
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
            this._directionsPressed[direction] = true;
        } else {
            delete this._directionsPressed[direction];
        }
    }
    _onVertexButtonPressed(index, value) {
        if (value) {
            this._verticesPressed[index] = true;
        } else {
            delete this._verticesPressed[index];
        }
    }
    _moveCurrentShape() {
        const currentShape = this.getCurrentShape();
        if (!currentShape) {
            return;
        }
        if (_.size(this._verticesPressed) * _.size(this._directionsPressed) === 0) {
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
        const currentShapeIndex = this.currentShapeIndex.getValue() - 1;
        const numShapes = this.numShapes.getValue();
        if (currentShapeIndex < numShapes) {
            return this._shapes[currentShapeIndex];
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
            const shape = new MapperShape({index: i});
            this._shapes.push(shape);
        }
        for (let i = this._shapes.length; i > numShapes; i--) {
            this._shapes.pop();
        }

        this._onMappingChanged();
    }
    _getSerializedMapping() {
        return this._shapes.map(shape => shape.serialize());
    }
    _onMappingChanged() {
        window.localStorage.setItem('mapping', JSON.stringify(this._getSerializedMapping()));

        this.mapping._updateListeners();
    }
}

module.exports = MapperParameters;
