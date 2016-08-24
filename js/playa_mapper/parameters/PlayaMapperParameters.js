const _ = require('lodash');
const {LinearParameter} = require('js/core/parameters/Parameter');
const PieceParameters = require('js/core/parameters/PieceParameters');

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
        };
    }
    getPlayaMapping() {
        const baseMapping = [
            {
                transforms: [],
                shapes: [
                    [[0, 0], [-7.692, -4.213], [-10, 0]],
                    [[0, 0], [-7.692, -4.213], [0, -18.26]],
                    [[0, 0], [7.692, -4.213], [10, 0]],
                    [[0, 0], [7.692, -4.213], [0, -18.26]],
                ],
            },
        ];
        baseMapping.forEach(group => group.shapes.forEach(shape => shape.forEach(point => {
            point[0] = 0 + point[0] * 10 + this.xOffset.getValue();
            point[1] = 0 + point[1] * 10 + this.yOffset.getValue();
        })));

        return baseMapping;
    }
    mapShapes(fn) {
        const mapping = this.getPlayaMapping();
        const shapes = _.flatten(mapping.map(group => group.shapes));
        return shapes.map(fn);
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
