var React = require('react');
var ReactDOM = require('react-dom');
var TwentySixteen = require('js/components/twenty_sixteen/TwentySixteen');

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
      <TwentySixteen />,
      document.getElementById('start')
    );
});
