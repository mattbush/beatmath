var React = require('react');
var ReactDOM = require('react-dom');
var BrickGrid = require('js/components/bricks/BrickGrid');

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
      <div className="main">
        <BrickGrid />
      </div>,
      document.getElementById('start')
    );
});
