require('regenerator/runtime');
var React = require('react');
var ReactDOM = require('react-dom');
var HoneycombContainer = require('js/components/honeycomb/HoneycombContainer');
var Mixboard = require('js/inputs/Mixboard');
var MixboardContext = require('js/components/MixboardContext');

document.addEventListener('DOMContentLoaded', async function() {
    var mixboard = await Mixboard.getInstanceAsync();

    ReactDOM.render(
        <MixboardContext mixboard={mixboard}>
            <HoneycombContainer />
        </MixboardContext>,
        document.getElementById('start')
    );
});
