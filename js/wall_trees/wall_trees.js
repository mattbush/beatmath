require('regenerator/runtime');
const React = require('react');
const ReactDOM = require('react-dom');
const WallTreesContainer = require('js/wall_trees/components/WallTreesContainer');
const Mixboard = require('js/core/inputs/Mixboard');
const MixboardContext = require('js/core/components/MixboardContext');

document.addEventListener('DOMContentLoaded', async function() {
    const mixboard = await Mixboard.getInstanceAsync();

    ReactDOM.render(
        <MixboardContext mixboard={mixboard} useFrame={false}>
            <WallTreesContainer />
        </MixboardContext>,
        document.getElementById('start')
    );
});
