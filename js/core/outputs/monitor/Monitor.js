const _ = require('lodash');
const React = require('react');
const MonitorValue = require('js/core/outputs/monitor/MonitorValue');

const Monitor = React.createClass({
    componentDidMount: function() {
        this._parsedStorage = {};
        this._throttledForceUpdate = _.throttle(this.forceUpdate.bind(this), 50);
        window.addEventListener('storage', this._onStorage);
    },
    _onStorage: function(event) {
        if (event.key === 'mapping') {
            return;
        }
        this._parsedStorage[event.key] = JSON.parse(event.newValue);
        this._throttledForceUpdate();
    },
    render: function() {
        return (
            <div className="main">
                {_.map(_.pickBy(this._parsedStorage), (value, key) =>
                    <MonitorValue
                        key={key}
                        value={value}
                    />
                )}
            </div>
        );
    },
});

module.exports = Monitor;
