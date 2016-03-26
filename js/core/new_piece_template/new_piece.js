require('regenerator/runtime');
const React = require('react');
const ReactDOM = require('react-dom');
const NewPieceContainer = require('js/new_piece/components/NewPieceContainer');
const Mixboard = require('js/core/inputs/Mixboard');
const MixboardContext = require('js/core/components/MixboardContext');

document.addEventListener('DOMContentLoaded', async function() {
    const mixboard = await Mixboard.getInstanceAsync();

    ReactDOM.render(
        <MixboardContext mixboard={mixboard}>
            <NewPieceContainer />
        </MixboardContext>,
        document.getElementById('start')
    );
});
