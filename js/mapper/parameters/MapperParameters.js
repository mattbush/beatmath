const _ = require('underscore');
const {LinearParameter} = require('js/core/parameters/Parameter');
const {LaunchpadButtons} = require('js/core/inputs/LaunchpadConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');

class MapperParameters extends PieceParameters {
    constructor(mixboard) {
        super(...arguments);

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
    }
    _declareParameters() {
        return {
            numTriangles: {
                type: LinearParameter,
                range: [1, 16],
                start: 1,
                listenToDecrementAndIncrementLaunchpadButtons: 6,
                monitorName: 'Num Shapes',
            },
            curTriangle: {
                type: LinearParameter,
                range: [1, 16],
                start: 1,
                listenToDecrementAndIncrementLaunchpadButtons: 7,
                monitorName: 'Current Shape',
            },
        };
    }
    _onDirectionButtonPressed(direction, value) {
        // TODO
    }
    _onVertexButtonPressed(index, value) {
        // TODO
    }
}

module.exports = MapperParameters;
