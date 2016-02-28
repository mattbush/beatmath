var _ = require('underscore');
require('regenerator/runtime');
var React = require('react');
var ReactDOM = require('react-dom');

var Monitor = React.createClass({
    getInitialState: function() {
        return {};
    },
    componentDidMount: function() {
        window.addEventListener('storage', this._onStorage);
    },
    _onStorage: function(event) {
        this.setState({
            [event.key]: event.newValue,
        });
    },
    render: function() {
        var sortedKeys = _.keys(this.state).sort();

        return (
            <div>
                {_.map(sortedKeys, key =>
                    <div key={key} className="monitorMessage">
                        {key + ': '}
                        <b>{this.state[key]}</b>
                    </div>
                )}
            </div>
        );
    },
});

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
        <Monitor />,
        document.getElementById('start')
    );
});
