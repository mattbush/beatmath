var _ = require('underscore');

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
            var constructorProperties = _.omit(restOfProperties, MIXBOARD_LISTENER_KEYS);
            var listenerProperties = _.pick(restOfProperties, MIXBOARD_LISTENER_KEYS);

            var parameter = new type(constructorProperties);
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
    _declareParameters() {
        // empty, override me
        return {};
    }
}

module.exports = PieceParameters;
