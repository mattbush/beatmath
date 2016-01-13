var React = require('react');
var ReactDOM = require('react-dom');

var HoneycombContainer = require('js/components/honeycomb/HoneycombContainer');

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
        <HoneycombContainer />,
        document.getElementById('start')
    );
});
