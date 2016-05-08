const _ = require('underscore');
const React = require('react');
const MonitorValue = require('js/core/outputs/monitor/MonitorValue');

const Monitor = React.createClass({
    getInitialState: function() {
        return {};
    },
    componentDidMount: function() {
        window.addEventListener('storage', this._onStorage);
    },
    _onStorage: function(event) {
        this.setState({
            [event.key]: JSON.parse(event.newValue),
        });
    },
    render: function() {
        return (
            <div className="main">
                {_.map(_.compact(this.state), (value, key) =>
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
