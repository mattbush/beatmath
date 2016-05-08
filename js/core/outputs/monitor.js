const _ = require('underscore');
require('regenerator/runtime');
const React = require('react');
const ReactDOM = require('react-dom');

const Monitor = React.createClass({
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
        const sortedKeys = _.keys(this.state).sort();

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
