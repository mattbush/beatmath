require('regenerator/runtime');
var React = require('react');
var ReactDOM = require('react-dom');
var TreeSet = require('js/trees/components/TreeSet');
var Mixboard = require('js/core/inputs/Mixboard');
var MixboardContext = require('js/core/components/MixboardContext');

document.addEventListener('DOMContentLoaded', async function() {
    var mixboard = await Mixboard.getInstanceAsync();

    ReactDOM.render(
        <MixboardContext mixboard={mixboard}>
            <TreeSet />
        </MixboardContext>,
        document.getElementById('start')
    );
});
