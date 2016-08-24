const _ = require('lodash');
const {LinearParameter, LogarithmicParameter} = require('js/core/parameters/Parameter');
const PieceParameters = require('js/core/parameters/PieceParameters');
const {DEG_2_RAD} = require('js/core/utils/math');

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
            rotateX: {
                type: LinearParameter,
                range: [-90, 90],
                start: savedParams.rotateX || 0,
                listenToLaunchpadKnob: [2, 0],
                monitorName: 'rotateX',
            },
            rotateY: {
                type: LinearParameter,
                range: [-90, 90],
                start: savedParams.rotateY || 0,
                listenToLaunchpadKnob: [2, 1],
                monitorName: 'rotateY',
            },
            scale: {
                type: LogarithmicParameter,
                range: [1, 100],
                start: savedParams.scale || 10,
                listenToLaunchpadKnob: [2, 3],
                monitorName: 'rotateY',
            },
        };
    }
    getPlayaMapping() {
        const baseMapping = [
            {
                transforms: [
                    {scale: this.scale.getValue()},
                    {translate: [10 * Math.cos(this.rotateY.getValue() * DEG_2_RAD), 0]},
                    {rotateY: this.rotateY.getValue()},
                    {rotateX: this.rotateX.getValue()},
                ],
                shapes: [
                    [[0, 0], [-7.692, -4.213], [-10, 0]],
                    [[0, 0], [-7.692, -4.213], [0, -18.26]],
                    [[0, 0], [7.692, -4.213], [10, 0]],
                    [[0, 0], [7.692, -4.213], [0, -18.26]],
                ],
            },
            {
                transforms: [
                    {scale: this.scale.getValue()},
                    {translate: [-10 * Math.cos(this.rotateY.getValue() * DEG_2_RAD), 0]},
                    {rotateY: this.rotateY.getValue()},
                    {rotateX: -this.rotateX.getValue()},
                ],
                shapes: [
                    [[0, 0], [-7.692, -4.213], [-10, 0]],
                    [[0, 0], [-7.692, -4.213], [0, -18.26]],
                    [[0, 0], [7.692, -4.213], [10, 0]],
                    [[0, 0], [7.692, -4.213], [0, -18.26]],
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
