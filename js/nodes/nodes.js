require('regenerator/runtime');
const React = require('react');
const ReactDOM = require('react-dom');
const NodesContainer = require('js/nodes/components/NodesContainer');
const Mixboard = require('js/core/inputs/Mixboard');
const MixboardContext = require('js/core/components/MixboardContext');

document.addEventListener('DOMContentLoaded', async function() {
    const mixboard = await Mixboard.getInstanceAsync();

    ReactDOM.render(
        <MixboardContext mixboard={mixboard} hasSpecialMapping={true} canMapAcrossGroups={true}>
            <NodesContainer />
        </MixboardContext>,
        document.getElementById('start')
    );
});
