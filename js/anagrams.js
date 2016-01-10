require('regenerator/runtime');
var React = require('react');
var ReactDOM = require('react-dom');
var AnagramDisplay = require('js/components/anagrams/AnagramDisplay');

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
      <div className="main">
          <AnagramDisplay />
      </div>,
      document.getElementById('start')
    );
});
