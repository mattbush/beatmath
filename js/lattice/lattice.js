require('regenerator/runtime');
const React = require('react');
const ReactDOM = require('react-dom');
const LatticeGrid = require('js/lattice/components/LatticeGrid');
const Mixboard = require('js/core/inputs/Mixboard');
const MixboardContext = require('js/core/components/MixboardContext');

document.addEventListener('DOMContentLoaded', async function() {
    const mixboard = await Mixboard.getInstanceAsync();

    ReactDOM.render(
        <MixboardContext mixboard={mixboard} bpmMod={0.5} usePixels={true}>
            <LatticeGrid />
        </MixboardContext>,
        document.getElementById('start')
    );
});
