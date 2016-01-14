require('regenerator/runtime');
var React = require('react');
var ReactDOM = require('react-dom');
var AnagramDisplay = require('js/components/anagrams/AnagramDisplay');
var Mixboard = require('js/inputs/Mixboard');
var MixboardContext = require('js/components/MixboardContext');

document.addEventListener('DOMContentLoaded', async function() {
    var mixboard = await Mixboard.getInstanceAsync();

    ReactDOM.render(
        <MixboardContext mixboard={mixboard}>
            <AnagramDisplay />
        </MixboardContext>,
        document.getElementById('start')
    );
});
