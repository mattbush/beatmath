const _ = require('lodash');

const THROTTLE_MS = 16;

const ParameterBindingsMixin = {
    // callers implement this, returns a mapping of string to parameter object
    // getParameterBindings: function() {},
    _getParameterBindings: function() {
        if (!this._parameterBindings) {
            this._parameterBindings = this.getParameterBindings();
        }
        return this._parameterBindings;
    },
    componentDidMount: function() {
        const boundForceUpdate = this.forceUpdate.bind(this);
        const updateDelay = this._getUpdateDelay ? this._getUpdateDelay() : null;
        const boundForceUpdateWithDelay = updateDelay ? () => setTimeout(boundForceUpdate, updateDelay) : boundForceUpdate;
        this._boundThrottledForceUpdate = _.throttle(boundForceUpdateWithDelay, THROTTLE_MS);

        _.each(this._getParameterBindings(), parameter => parameter.addListener(this._boundThrottledForceUpdate));
    },
    componentWillUnmount: function() {
        _.each(this._getParameterBindings(), parameter => parameter.removeListener(this._boundThrottledForceUpdate));
    },
    getParameterValue: function(paramName) {
        return this._getParameterBindings()[paramName].getValue();
    },
};

module.exports = ParameterBindingsMixin;
