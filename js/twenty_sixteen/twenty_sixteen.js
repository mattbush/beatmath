require('regenerator/runtime');
const React = require('react');
const ReactDOM = require('react-dom');
const TwentySixteen = require('js/twenty_sixteen/components/TwentySixteen');
const Mixboard = require('js/core/inputs/Mixboard');
const MixboardContext = require('js/core/components/MixboardContext');

document.addEventListener('DOMContentLoaded', async function() {
    const mixboard = await Mixboard.getInstanceAsync();

    ReactDOM.render(
        <MixboardContext mixboard={mixboard}>
            <TwentySixteen />
        </MixboardContext>,
        document.getElementById('start')
    );
});
