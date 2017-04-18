require('regenerator/runtime');
const React = require('react');
const ReactDOM = require('react-dom');
const StopwatchContainer = require('js/stopwatch/components/StopwatchContainer');
const Mixboard = require('js/core/inputs/Mixboard');
const MixboardContext = require('js/core/components/MixboardContext');

document.addEventListener('DOMContentLoaded', async function() {
    const mixboard = await Mixboard.getInstanceAsync();

    ReactDOM.render(
        <MixboardContext mixboard={mixboard} bpmMod={2}>
            <StopwatchContainer />
        </MixboardContext>,
        document.getElementById('start')
    );
});
