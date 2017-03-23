require('regenerator/runtime');
const React = require('react');
const ReactDOM = require('react-dom');
const Mixboard = require('js/core/inputs/Mixboard');
const MixboardContext = require('js/core/components/MixboardContext');

document.addEventListener('DOMContentLoaded', async function() {
    const mixboard = await Mixboard.getInstanceAsync();

    ReactDOM.render(
        <MixboardContext mixboard={mixboard}>
            <g />
        </MixboardContext>,
        document.getElementById('start')
    );
});
