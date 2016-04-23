var _ = require('underscore');

const SPECIAL_KEYS = [
    'autoupdateEveryNBeats',
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
        this._beatmathParameters.tempo.addListener(parameter, () => {
            var tick = this._beatmathParameters.tempo.getNextTick();
            if (tick % n === 0) {
                parameter.update();
            }
        });
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
