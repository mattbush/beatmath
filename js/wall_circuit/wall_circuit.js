require('regenerator/runtime');
const React = require('react');
const ReactDOM = require('react-dom');
const WallCircuitContainer = require('js/wall_circuit/components/WallCircuitContainer');
const Mixboard = require('js/core/inputs/Mixboard');
const MixboardContext = require('js/core/components/MixboardContext');

document.addEventListener('DOMContentLoaded', async function() {
    const mixboard = await Mixboard.getInstanceAsync();

    ReactDOM.render(
        <MixboardContext mixboard={mixboard} bpmMod={4.0} useFrame={false}>
            <WallCircuitContainer />
        </MixboardContext>,
        document.getElementById('start')
    );
});
