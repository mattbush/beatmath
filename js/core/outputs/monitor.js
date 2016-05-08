require('regenerator/runtime');
const React = require('react');
const ReactDOM = require('react-dom');
const Monitor = require('js/core/outputs/monitor/Monitor');

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
        <Monitor />,
        document.getElementById('start')
    );
});
