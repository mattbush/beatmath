var _ = require('underscore');

var THROTTLE_MS = 100;

var ParameterBindingsMixin = {
    // callers implement this, returns a mapping of string to parameter object
    // getParameterBindings: function() {},
    componentDidMount: function() {
        this._boundThrottledForceUpdate = _.throttle(this.forceUpdate.bind(this), THROTTLE_MS);

        _.each(this.getParameterBindings(), parameter => parameter.addListener(this._boundThrottledForceUpdate));
    },
    componentWillUnmount: function() {
        _.each(this.getParameterBindings(), parameter => parameter.removeListener(this._boundThrottledForceUpdate));
    },
};

module.exports = ParameterBindingsMixin;
