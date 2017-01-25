require('regenerator/runtime');
const React = require('react');
const ReactDOM = require('react-dom');
const WallSnowstormContainer = require('js/wall_snowstorm/components/WallSnowstormContainer');
const Mixboard = require('js/core/inputs/Mixboard');
const MixboardContext = require('js/core/components/MixboardContext');

document.addEventListener('DOMContentLoaded', async function() {
    const mixboard = await Mixboard.getInstanceAsync();

    ReactDOM.render(
        <MixboardContext mixboard={mixboard} useFrame={false}>
            <WallSnowstormContainer />
        </MixboardContext>,
        document.getElementById('start')
    );
});
