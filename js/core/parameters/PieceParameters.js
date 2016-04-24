var _ = require('underscore');
var {mixboardButton} = require('js/core/inputs/MixboardConstants');

const SPECIAL_KEYS = [
    'autoupdateEveryNBeats', 'autoupdateOnCue',
];
var MIXBOARD_LISTENER_KEYS = (value, key) => key.startsWith('listenTo');

class PieceParameters {
    constructor(mixboard, beatmathParameters) {
        this._mixboard = mixboard;
        this._beatmathParameters = beatmathParameters;

        this._initParameters();
    }
    _initParameters() {
        var parameters = this._declareParameters();
        _.each(parameters, (properties, paramName) => {
            var {type, ...restOfProperties} = properties;

            if (this._mixboard.isMixboardConnected() && _.has(restOfProperties, 'mixboardStart')) {
                restOfProperties.start = restOfProperties.mixboardStart;
                delete restOfProperties.mixboardStart;
            }

            var specialProperties = _.pick(restOfProperties, SPECIAL_KEYS);
            restOfProperties = _.omit(restOfProperties, SPECIAL_KEYS);
            var listenerProperties = _.pick(restOfProperties, MIXBOARD_LISTENER_KEYS);
            var constructorProperties = _.omit(restOfProperties, MIXBOARD_LISTENER_KEYS);

            var parameter = new type(constructorProperties);

            _.each(specialProperties, (value, specialMethodName) => {
                this[specialMethodName](parameter, value);
            });

            _.each(listenerProperties, (value, listenerMethodName) => {
                if (_.isArray(value)) { // ugh, hack
                    parameter[listenerMethodName](this._mixboard, ...value);
                } else {
                    parameter[listenerMethodName](this._mixboard, value);
                }
            });

            this[paramName] = parameter;
        });
    }
    autoupdateEveryNBeats(parameter, n) {
        const tempo = this._beatmathParameters.tempo;
        tempo.addListener(() => {
            var tick = tempo.getNumTicks();
            if (tick % (n * tempo._bpmMod) === 0) {
                parameter.update();
            }
        });
    }
    autoupdateOnCue(parameter) {
        if (this._mixboard.isMixboardConnected()) {
            parameter.listenForAutoupdateCue(this._mixboard, mixboardButton.L_CUE);
        }
    }
    _declareParameters() {
        // empty, override me
        return {};
    }
    destroy() {
        _.each(this._declareParameters(), (value, key) => {
            this[key].destroy();
        });
    }
}

module.exports = PieceParameters;
