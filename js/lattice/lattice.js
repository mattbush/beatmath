require('regenerator/runtime');
var React = require('react');
var ReactDOM = require('react-dom');
var LatticeGrid = require('js/lattice/components/LatticeGrid');
var Mixboard = require('js/core/inputs/Mixboard');
var MixboardContext = require('js/core/components/MixboardContext');

document.addEventListener('DOMContentLoaded', async function() {
    var mixboard = await Mixboard.getInstanceAsync();

    ReactDOM.render(
        <MixboardContext mixboard={mixboard}>
            <LatticeGrid />
        </MixboardContext>,
        document.getElementById('start')
    );
});
