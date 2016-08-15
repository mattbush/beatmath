require('regenerator/runtime');
const React = require('react');
const ReactDOM = require('react-dom');
const PlayaMapperContainer = require('js/playa_mapper/components/PlayaMapperContainer');
const Mixboard = require('js/core/inputs/Mixboard');
const MixboardContext = require('js/core/components/MixboardContext');

document.addEventListener('DOMContentLoaded', async function() {
    const mixboard = await Mixboard.getInstanceAsync();

    ReactDOM.render(
        <MixboardContext mixboard={mixboard} useFrame={false}>
            <PlayaMapperContainer />
        </MixboardContext>,
        document.getElementById('start')
    );
});
