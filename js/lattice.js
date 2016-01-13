var React = require('react');
var ReactDOM = require('react-dom');
var LatticeGrid = require('js/components/lattice/LatticeGrid');

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
      <div className="main">
        <LatticeGrid />
      </div>,
      document.getElementById('start')
    );
});
