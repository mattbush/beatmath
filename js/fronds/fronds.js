require('regenerator/runtime');
const React = require('react');
const ReactDOM = require('react-dom');
const FrondsContainer = require('js/fronds/components/FrondsContainer');
const Mixboard = require('js/core/inputs/Mixboard');
const MixboardContext = require('js/core/components/MixboardContext');

document.addEventListener('DOMContentLoaded', async function() {
    const mixboard = await Mixboard.getInstanceAsync();

    ReactDOM.render(
        <MixboardContext mixboard={mixboard}>
            <FrondsContainer />
        </MixboardContext>,
        document.getElementById('start')
    );
});
