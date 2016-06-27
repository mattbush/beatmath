require('regenerator/runtime');
const React = require('react');
const ReactDOM = require('react-dom');
const KaleContainer = require('js/kale/components/KaleContainer');
const Mixboard = require('js/core/inputs/Mixboard');
const MixboardContext = require('js/core/components/MixboardContext');

document.addEventListener('DOMContentLoaded', async function() {
    const mixboard = await Mixboard.getInstanceAsync();

    ReactDOM.render(
        <MixboardContext mixboard={mixboard} hasSpecialMapping={true}>
            <KaleContainer />
        </MixboardContext>,
        document.getElementById('start')
    );
});
