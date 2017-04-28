require('regenerator/runtime');
const React = require('react');
const ReactDOM = require('react-dom');
const EarthdayContainer = require('js/earthday/components/EarthdayContainer');
const Mixboard = require('js/core/inputs/Mixboard');
const MixboardContext = require('js/core/components/MixboardContext');

document.addEventListener('DOMContentLoaded', async function() {
    const mixboard = await Mixboard.getInstanceAsync();

    ReactDOM.render(
        <MixboardContext mixboard={mixboard} bpmMod={0.5} useFrame={false}>
            <EarthdayContainer />
        </MixboardContext>,
        document.getElementById('start')
    );
});
