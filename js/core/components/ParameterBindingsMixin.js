const _ = require('underscore');

const THROTTLE_MS = 100;

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
        this._boundThrottledForceUpdate = _.throttle(this.forceUpdate.bind(this), THROTTLE_MS);

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
