const _ = require('lodash');
const {LinearParameter, LogarithmicParameter} = require('js/core/parameters/Parameter');
const PieceParameters = require('js/core/parameters/PieceParameters');
const {DEG_2_RAD} = require('js/core/utils/math');

const CANOPY_SCALE_FACTOR = 20;
const TOWER_SCALE_FACTOR = 20;

class PlayaMapperParameters extends PieceParameters {
    constructor(mixboard, beatmathParameters) {
        const playaMapperRawParams = window.localStorage.getItem('playaMapperParams');
        const playaMapperParams = playaMapperRawParams ? JSON.parse(playaMapperRawParams) : {};

        super(mixboard, beatmathParameters, playaMapperParams);

        this._onMappingChanged = this._onMappingChanged.bind(this);
        _.each(this._declareParameters(), (value, paramName) => {
            this[paramName].addListener(this._onMappingChanged);
        });
    }
    _declareParameters(savedParams = {}) {
        return {
            projectorOffset: {
                type: LinearParameter,
                range: [0.95, 1.20],
                start: savedParams.projectorOffset || 1,
                listenToLaunchpadKnob: [1, 1],
                monitorName: 'projectorOffset',
            },
            xOffset: {
                type: LinearParameter,
                range: [-75, 75],
                start: savedParams.xOffset || 0,
                listenToLaunchpadKnob: [0, 0],
                monitorName: 'xOffset',
            },
            yOffset: {
                type: LinearParameter,
                range: [-150, 0],
                start: savedParams.yOffset || 0,
                listenToLaunchpadKnob: [0, 1],
                monitorName: 'yOffset',
            },
            triangleYawAngle: {
                type: LinearParameter,
                range: [26, 46],
                start: savedParams.triangleYawAngle || 36,
                listenToLaunchpadKnob: [2, 0],
                monitorName: 'triangleYawAngle',
            },
            trianglePitchAngle: {
                type: LinearParameter,
                range: [38.92, 58.92],
                start: savedParams.trianglePitchAngle || 48.92,
                listenToLaunchpadKnob: [2, 1],
                monitorName: 'trianglePitchAngle',
            },
            scale: {
                type: LogarithmicParameter,
                range: [20, 40],
                start: savedParams.scale || 28.8,
                listenToLaunchpadKnob: [0, 2],
                monitorName: 'scale',
            },
            projectorPitchAngle: {
                type: LinearParameter,
                range: [-10, 10],
                start: savedParams.projectorPitchAngle || 0,
                listenToLaunchpadKnob: [0, 3],
                monitorName: 'projectorPitchAngle',
            },
            towerWidth: {
                type: LinearParameter,
                range: [0.5, 1.5],
                start: savedParams.towerWidth || 1,
                listenToLaunchpadKnob: [2, 3],
                monitorName: 'towerWidth',
            },
        };
    }
    getPlayaMapping() {
        const towerWidth = this.towerWidth.getValue();
        const groups = [
            {
                transforms: [
                    {perspective: [21.18 * CANOPY_SCALE_FACTOR]},
                    {rotateX: this.projectorPitchAngle.getValue()},
                    {translate: [this.xOffset.getValue(), this.yOffset.getValue()]},
                    {scale: this.scale.getValue() / 21.18},
                    {translate: [10 * CANOPY_SCALE_FACTOR * Math.cos(this.triangleYawAngle.getValue() * DEG_2_RAD), 0]},
                    {rotateY: -this.triangleYawAngle.getValue()},
                    {rotateX: -this.trianglePitchAngle.getValue()},
                ],
                width: 20,
                height: 36.5,
                scaleFactor: CANOPY_SCALE_FACTOR,
                shapes: [
                    [[0, 0], [-7.692, -4.213], [-10, 0]],
                    [[0, 0], [-7.692, -4.213], [0, -18.26]],
                    [[0, 0], [7.692, -4.213], [10, 0]],
                    [[0, 0], [7.692, -4.213], [0, -18.26]],
                ],
            },
            {
                transforms: [
                    {perspective: [21.18 * CANOPY_SCALE_FACTOR]},
                    {rotateX: this.projectorPitchAngle.getValue()},
                    {translate: [this.xOffset.getValue(), this.yOffset.getValue()]},
                    {scale: this.scale.getValue() / 21.18},
                    {translate: [-10 * CANOPY_SCALE_FACTOR * Math.cos(this.triangleYawAngle.getValue() * DEG_2_RAD), 0]},
                    {rotateY: this.triangleYawAngle.getValue()},
                    {rotateX: -this.trianglePitchAngle.getValue()},
                ],
                width: 20,
                height: 36.5,
                scaleFactor: CANOPY_SCALE_FACTOR,
                shapes: [
                    [[0, 0], [-7.692, -4.213], [-10, 0]],
                    [[0, 0], [-7.692, -4.213], [0, -18.26]],
                    [[0, 0], [7.692, -4.213], [10, 0]],
                    [[0, 0], [7.692, -4.213], [0, -18.26]],
                ],
            },
            {
                transforms: [
                    {perspective: [13.76 * TOWER_SCALE_FACTOR]},
                    {rotateX: this.projectorPitchAngle.getValue()},
                    {translate: [this.xOffset.getValue(), this.yOffset.getValue()]},
                    {scale: this.scale.getValue() / 13.76},
                ],
                width: towerWidth,
                height: 40,
                scaleFactor: TOWER_SCALE_FACTOR,
                shapes: [
                    [[-towerWidth / 2, 2], [towerWidth / 2, 2], [towerWidth / 2, -20], [-towerWidth / 2, -20]],
                ],
            },
        ];
        const projectorOffset = this.projectorOffset.getValue();

        return {groups, projectorOffset};
    }
    _getSerializedMapping() {
        return this._shapes.map(shape => shape.serialize());
    }
    _getSerializedPlayaParams() {
        return _.mapValues(this._declareParameters(), (ignore, paramName) => this[paramName].getValue());
    }
    _onMappingChanged() {
        window.localStorage.setItem('playaMapping', JSON.stringify(this.getPlayaMapping()));
        window.localStorage.setItem('playaMapperParams', JSON.stringify(this._getSerializedPlayaParams()));
    }
}

module.exports = PlayaMapperParameters;
