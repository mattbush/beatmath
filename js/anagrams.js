require('regenerator/runtime');
var React = require('react');
var ReactDOM = require('react-dom');
var AnagramDisplay = require('js/components/anagrams/AnagramDisplay');

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
      <AnagramDisplay />,
      document.getElementById('start')
    );
});
