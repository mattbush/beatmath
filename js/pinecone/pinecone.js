require('regenerator/runtime');
const React = require('react');
const ReactDOM = require('react-dom');
const PineconeGrid = require('js/pinecone/components/PineconeGrid');
const Mixboard = require('js/core/inputs/Mixboard');
const MixboardContext = require('js/core/components/MixboardContext');

document.addEventListener('DOMContentLoaded', async function() {
    const mixboard = await Mixboard.getInstanceAsync();

    ReactDOM.render(
        <MixboardContext mixboard={mixboard}>
            <PineconeGrid />
        </MixboardContext>,
        document.getElementById('start')
    );
});
