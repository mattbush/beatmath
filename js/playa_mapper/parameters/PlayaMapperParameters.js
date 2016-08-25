const _ = require('lodash');
const {LinearParameter, LogarithmicParameter} = require('js/core/parameters/Parameter');
const PieceParameters = require('js/core/parameters/PieceParameters');
const {DEG_2_RAD} = require('js/core/utils/math');

const CANOPY_SCALE_FACTOR = 20;
const TOWER_SCALE_FACTOR = 10;

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
            xOffset: {
                type: LinearParameter,
                range: [-200, 200],
                start: savedParams.xOffset || 0,
                listenToLaunchpadKnob: [0, 0],
                monitorName: 'xOffset',
            },
            yOffset: {
                type: LinearParameter,
                range: [-200, 200],
                start: savedParams.yOffset || 0,
                listenToLaunchpadKnob: [0, 1],
                monitorName: 'yOffset',
            },
            triangleYawAngle: {
                type: LinearParameter,
                range: [0, 72],
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
                range: [1, 10000],
                start: savedParams.scale || 100,
                listenToLaunchpadKnob: [0, 2],
                monitorName: 'scale',
            },
            projectorPitchAngle: {
                type: LinearParameter,
                range: [-90, 90],
                start: savedParams.projectorPitchAngle || 0,
                listenToLaunchpadKnob: [0, 3],
                monitorName: 'projectorPitchAngle',
            },
        };
    }
    getPlayaMapping() {
        const baseMapping = [
            {
                transforms: [
                    {perspective: [21.18 * CANOPY_SCALE_FACTOR]},
                    {rotateX: this.projectorPitchAngle.getValue()},
                    {translate: [this.xOffset.getValue(), this.yOffset.getValue()]},
                    {scale: this.scale.getValue() / 21.18},
                    {translate: [10 * CANOPY_SCALE_FACTOR * Math.cos(this.triangleYawAngle.getValue() * DEG_2_RAD), 0]},
                    {rotateY: this.triangleYawAngle.getValue()},
                    {rotateX: this.trianglePitchAngle.getValue()},
                ],
                width: 20,
                height: 20,
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
                    {rotateY: -this.triangleYawAngle.getValue()},
                    {rotateX: this.trianglePitchAngle.getValue()},
                ],
                width: 20,
                height: 20,
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
                width: 1,
                height: 24,
                scaleFactor: TOWER_SCALE_FACTOR,
                shapes: [
                    [[-0.5, 4], [0.5, 4], [0.5, -12], [-0.5, -12]],
                ],
            },
        ];

        return baseMapping;
    }
    _getSerializedMapping() {
        return this._shapes.map(shape => shape.serialize());
    }
    _getSerializedPlayaParams() {
        return _.mapValues(this._declareParameters(), (ignore, paramName) => this[paramName].getValue());
    }
    _onMappingChanged() {
        // window.localStorage.setItem('playaMapping', JSON.stringify(this._getSerializedMapping()));
        window.localStorage.setItem('playaMapperParams', JSON.stringify(this._getSerializedPlayaParams()));
    }
}

module.exports = PlayaMapperParameters;
