require('regenerator/runtime');
var React = require('react');
var ReactDOM = require('react-dom');
var PineconeGrid = require('js/components/pinecone/PineconeGrid');
var Mixboard = require('js/inputs/Mixboard');
var MixboardContext = require('js/components/MixboardContext');

document.addEventListener('DOMContentLoaded', async function() {
    var mixboard = await Mixboard.getInstanceAsync();

    ReactDOM.render(
        <MixboardContext mixboard={mixboard}>
            <PineconeGrid />
        </MixboardContext>,
        document.getElementById('start')
    );
});
