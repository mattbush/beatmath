const _ = require('lodash');

const SPECIAL_KEYS = [
    'autoupdateEveryNBeats', 'autoupdateOnCue',
];
const MIXBOARD_LISTENER_KEYS = (value, key) => key.startsWith('listenTo');

class PieceParameters {
    constructor(mixboard, beatmathParameters, opts) {
        this._mixboard = mixboard;
        this._beatmathParameters = beatmathParameters;

        this._initParameters(opts);
    }
    _initParameters(opts) {
        const parameters = this._declareParameters(opts);
        _.each(parameters, (properties, paramName) => {
            let {type, ...restOfProperties} = properties;

            if (this._mixboard.isMixboardConnected() && _.has(restOfProperties, 'mixboardStart')) {
                restOfProperties.start = restOfProperties.mixboardStart;
                delete restOfProperties.mixboardStart;
            }

            const specialProperties = _.pick(restOfProperties, SPECIAL_KEYS);
            restOfProperties = _.omit(restOfProperties, SPECIAL_KEYS);
            const listenerProperties = _.pick(restOfProperties, MIXBOARD_LISTENER_KEYS);
            const constructorProperties = _.omit(restOfProperties, MIXBOARD_LISTENER_KEYS);
            constructorProperties.tempo = this._beatmathParameters.tempo;

            const parameter = new type(constructorProperties);

            _.each(specialProperties, (value, specialMethodName) => {
                this[specialMethodName](parameter, value);
            });

            _.each(listenerProperties, (value, listenerMethodName) => {
                if (listenerMethodName.includes('Mixtrack') && this._mixboard.isLaunchpad()) {
                    return; // continue
                }
                if (listenerMethodName.includes('Launchpad') && !this._mixboard.isLaunchpad()) {
                    return; // continue
                }
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
            const tick = tempo.getNumTicks();
            if (tick % (n * tempo._bpmMod) === 0) {
                parameter.update();
            }
        });
    }
    autoupdateOnCue(parameter) {
        if (this._mixboard.isMixboardConnected()) {
            parameter.listenForAutoupdateCue(this._mixboard);
        }
    }
    _declareParameters(/* opts */) {
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
